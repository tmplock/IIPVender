const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

// const db = require('../models');
const db = require('../db');
const time = require('../utils/time');

const {Op}= require('sequelize');

const schedule = require('node-schedule');

const ProcessPendingTransaction = schedule.scheduleJob('1,10,20,30,40,50 * * * * *', async () => {

    console.log(`aaa`);
    const listPending = await db.transactions.findAll({where:{eState:'PENDING'}});
    console.log(`Pending Length : ${listPending.length}, ID = ${listPending[0].id}`);
})

router.get('/list', async(req, res) => {

    if ( req.user == null )
        res.redirect('/account/login');
    else
        res.render('partner/list', {iLayout:0, user:req.user, iHeaderFocus:0});
});

router.get('/listvender', async(req, res) => {

    if ( req.user == null )
        res.redirect('/account/login');
    else
        res.render('partner/listvender', {iLayout:0, user:req.user, iHeaderFocus:0});
});

router.post('/request_list', async (req, res) => {

    console.log(`/partner/request_list`);
    console.log(req.body);

    const [list] = await db.sequelize.query(`
        SELECT
        t1.*,
        IFNULL((SELECT sum(strAmount) FROM transactions WHERE strAgentCode=t1.strAgentCode AND eType='BET' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iBetting,
        IFNULL((SELECT sum(strAmount) FROM transactions WHERE strAgentCode=t1.strAgentCode AND eType='WIN' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iWin,
        IFNULL((SELECT sum(strAmount) FROM transactions WHERE strAgentCode=t1.strAgentCode AND eType='REFUND' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iCancel,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strResponseNickname=t1.strNickname AND eType='GIVE' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iGives,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strResponseNickname=t1.strNickname AND eType='TAKE' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iTakes
        FROM Users AS t1
        WHERE t1.iClass='1';
    `);

    const objectData = {result:'OK', list:list};

    res.send(objectData);
});

let GetVenderData = async (strVender, dateStart, dateEnd) => {

    const data = await db.sequelize.query(`
    SELECT
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'LIVE' AND eType='BET' AND eState='COMPLETE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingLive,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'SM' AND eType='BET' AND eState='COMPLETE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iBettingSM,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'LIVE' AND eType='WIN' AND eState='COMPLETE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinLive,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'SM' AND eType='WIN' AND eState='COMPLETE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iWinSM,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'LIVE' AND eType='REFUND' AND eState='COMPLETE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iCancelLive,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'SM' AND eType='REFUND' AND eState='COMPLETE' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iCancelSM,

    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'LIVE' AND eType='BET' AND eState='PENDING' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPendingBettingLive,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'SM' AND eType='BET' AND eState='PENDING' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPendingBettingSM,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'LIVE' AND eType='WIN' AND eState='PENDING' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPendingWinLive,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'SM' AND eType='WIN' AND eState='PENDING' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPendingWinSM,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'LIVE' AND eType='REFUND' AND eState='PENDING' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPendingCancelLive,
    IFNULL((SELECT sum(strAmount) FROM transactions WHERE strVender='${strVender}' AND eGameType = 'SM' AND eType='REFUND' AND eState='PENDING' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iPendingCancelSM
    ;
`);
    console.log(data);
    let list = [];
    list.push(data[0][0]);

    return list;
}

router.post('/request_listvender', async (req, res) => {

    console.log(`/partner/request_listvender`);
    console.log(req.body);

    // const dataVivo = await db.sequelize.query(`
    //     SELECT
    //     IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'LIVE' AND eState='BET' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iBettingLive,
    //     IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'SM' AND eState='BET' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iBettingSM,
    //     IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'LIVE' AND eState='WIN' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iWinLive,
    //     IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'SM' AND eState='WIN' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iWinSM,
    //     IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'LIVE' AND eState='REFUND' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iCancelLive,
    //     IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'SM' AND eState='REFUND' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iCancelSM
    //     ;
    // `);

    // console.log(dataVivo);
    // let list = [];
    // list.push(dataVivo[0][0]);

    const listVivo = await GetVenderData('VIVO', req.body.dateStart, req.body.dateEnd);
    const listPP = await GetVenderData('PP', req.body.dateStart, req.body.dateEnd);
    const listWE = await GetVenderData('WE', req.body.dateStart, req.body.dateEnd);
    const listEZUGI = await GetVenderData('EZUGI', req.body.dateStart, req.body.dateEnd);
    const listHL = await GetVenderData('HONORLINK', req.body.dateStart, req.body.dateEnd);
    const listHabanero = await GetVenderData('HABANERO', req.body.dateStart, req.body.dateEnd);
    const listCQ9 = await GetVenderData('CQ9', req.body.dateStart, req.body.dateEnd);

    const objectData = {result:'OK', listVivo:listVivo, listPP:listPP, listWE:listWE, listEZUGI:listEZUGI, listHL:listHL, listHabanero:listHabanero, listCQ9:listCQ9};

    res.send(objectData);
});
// SELECT
// IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'LIVE' AND eState='BET' AND date(createdAt) BETWEEN '2023-01-01' AND '2023-07-01'),0) as iBettingLive,
// IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'SM' AND eState='BET' AND date(createdAt) BETWEEN '2023-01-01' AND '2023-07-01'),0) as iBettingSM,
// IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'LIVE' AND eState='WIN' AND date(createdAt) BETWEEN '2023-01-01' AND '2023-07-01'),0) as iWinLive,
// IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'SM' AND eState='WIN' AND date(createdAt) BETWEEN '2023-01-01' AND '2023-07-01'),0) as iWinSM,
// IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'LIVE' AND eState='REFUND' AND date(createdAt) BETWEEN '2023-01-01' AND '2023-07-01'),0) as iCancelLive,
// IFNULL((SELECT sum(strAmount) FROM transactions WHERE strProviderID='VIVO' AND eType = 'SM' AND eState='REFUND' AND date(createdAt) BETWEEN '2023-01-01' AND '2023-07-01'),0) as iCancelSM;

module.exports = router;