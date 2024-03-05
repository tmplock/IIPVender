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

router.get('/profile', async(req, res) => {

    console.log(`/partner_popup/profile`);
    console.log(req.query);

    if ( req.user == null )
        res.redirect('/account/login');
    else
    {
        const user = await db.Users.findOne({where:{strID:req.query.strID}});

        res.render('partner/popup_profile', {iLayout:2, user:user, iHeaderFocus:0});
    }        
});

router.get('/inout', async(req, res) => {

    console.log(`/partner_popup/inout`);
    console.log(req.query);

    if ( req.user == null )
        res.redirect('/account/login');
    else
    {
        const user = await db.Users.findOne({where:{strID:req.query.strID}});

        res.render('partner/popup_inout', {iLayout:2, user:user, iHeaderFocus:1});
    }        
});

router.get('/register', async (req, res) => {

    console.log(`/partner_popup/register`);
    console.log(req.query);

    if ( req.user == null )
        res.redirect('/account/login');
    else
    {
        //const user = await db.Users.findOne({where:{strID:req.query.strID}});

        res.render('partner/popup_register', {iLayout:1});
    }        
});

router.post('/request_profilemodify', async (req, res) => {
    console.log(`/partner_popup/request_profilemodify`);
    console.log(req.body);

    await db.Users.update({fOdds:req.body.fOdds, strCallbackURL:req.body.strCallbackURL}, {where:{strID:req.body.strID}});

    const objectData = {result:'OK'};
    res.send(objectData);
});

let FindVacantIndex = (strDefaultGroupID, listUsers) => {

    let listIndices = [];

    for ( let i in listUsers )
    {
        const str = listUsers[i].strGroupID.substr(strDefaultGroupID.length, 2);
        console.log(`str : ${str}, parseInt(str) : ${parseInt(str)}`);

        listIndices.push(parseInt(str));
    }

    for ( let i = 0; i < 100;  ++ i )
    {
        if ( listIndices[i] != i )        
            return i;
    }

    console.log(listIndices);

    return null;
}

var leadingZeros = (n, digits) => {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

let BuildGroupID = async (strDefaultGroupID, iTargetClass) => {

    let users = await db.Users.findAll({where:{iClass:iTargetClass}});

    const index = FindVacantIndex(strDefaultGroupID, users);

    if ( index == null )
        return null;

    return strDefaultGroupID + leadingZeros(index, 2);
}

router.post('/request_register', async (req, res) => {
    console.log(`/partner_popup/request_register`);
    console.log(req.body);

    const strGroupID = await BuildGroupID('0', 1);

    if ( strGroupID == null )
        res.send({result:'Error'});

    else
    {
        await db.Users.create({
            strID:req.body.strID,
            strNickname:req.body.strNickname,
            fOdds:req.body.fOdds,
            strAgentCode:req.body.strAgentCode,
            strSecretCode:req.body.strSecretCode,
            strPassword:req.body.strPassword,
            strBankName:req.body.strBankName,
            strBankAccount:req.body.strBankAccount,
            strBankAccountHolder:req.body.strBankAccountHolder,
            strMobile:req.body.strMobile,
            strCallbackURL:req.body.strCallbackURL,      
            iCash:0,
            iPoint:0,
            iClass:1,
            strGroupID:strGroupID,
            eState:'NORMAL'  
        });
    
        const objectData = {result:'OK'};
        res.send(objectData);
    }
});

router.post('/request_checkid', async (req, res) => {
    console.log(`/partner_popup/request_checkid`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strID:req.body.strID}});

    if ( null == user )
    {
        const objectData = {result:'OK'};
        res.send(objectData);
    }
    else
    {
        const objectData = {result:'Error'};
        res.send(objectData);
    }
});

router.post('/request_checknickname', async (req, res) => {
    console.log(`/partner_popup/request_checknickname`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});

    if ( null == user )
    {
        const objectData = {result:'OK'};
        res.send(objectData);
    }
    else
    {
        const objectData = {result:'Error'};
        res.send(objectData);
    }
});

router.post('/request_checkagentcode', async (req, res) => {
    console.log(`/partner_popup/request_checkagentcode`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strAgentCode:req.body.strAgentCode}});

    if ( null == user )
    {
        const objectData = {result:'OK'};
        res.send(objectData);
    }
    else
    {
        const objectData = {result:'Error'};
        res.send(objectData);
    }

});

router.post('/request_checksecretcode', async (req, res) => {
    console.log(`/partner_popup/request_checksecretcode`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strSecretCode:req.body.strSecretCode}});

    if ( null == user )
    {
        const objectData = {result:'OK'};
        res.send(objectData);
    }
    else
    {
        const objectData = {result:'Error'};
        res.send(objectData);
    }

});

// router.post('/request_list', async (req, res) => {

//     console.log(`/partner/request_list`);
//     console.log(req.body);

//     const [list] = await db.sequelize.query(`
//         SELECT
//         t1.*,
//         IFNULL((SELECT sum(strAmount) FROM transactions WHERE strAgentCode=t1.strAgentCode AND eState='BET' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iBetting,
//         IFNULL((SELECT sum(strAmount) FROM transactions WHERE strAgentCode=t1.strAgentCode AND eState='WIN' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iWin,
//         IFNULL((SELECT sum(strAmount) FROM transactions WHERE strAgentCode=t1.strAgentCode AND eState='REFUND' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iCancel
//         FROM Users AS t1
//         WHERE t1.iClass='1';
//     `);

//     const objectData = {result:'OK', list:list};

//     res.send(objectData);
// })


module.exports = router;