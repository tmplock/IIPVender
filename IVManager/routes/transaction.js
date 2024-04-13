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

router.get('/list', async(req, res) => {

    console.log(`/transaction/list`);

    if ( req.user == null )
        res.redirect('/account/login');
    else
        res.render('transaction/list', {iLayout:0, user:req.user, iHeaderFocus:1});
});

router.get('/search', async(req, res) => {

    console.log(`/transaction/search`);

    if ( req.user == null )
        res.redirect('/account/login');
    else
        res.render('transaction/search', {iLayout:0, user:req.user, iHeaderFocus:1});
});

router.post('/request_list', async (req, res) => {

    console.log(`/transaction/request_list`);
    console.log(req.body);

    let listType = ['BET', 'WIN', 'REFUND'];
    let listState = ['COMPLETE', 'PENDING', 'EXCEPTION'];
    let listGameType = ['LIVE', 'SM'];
    if ( req.body.eType != '' )
    {
        listType = [];
        listType.push(req.body.eType);
    }
    if ( req.body.eState != '' )
    {
        listState = [];
        listState.push(req.body.eState);
    }
    if ( req.body.eGameType != '' )
    {
        listGameType = [];
        listGameType.push(req.body.eGameType);
    }

    let list = await db.transactions.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            eType:{[Op.or]:listType},
            eState:{[Op.or]:listState},
            eGameType:{[Op.or]:listGameType}
        },
        order:[['createdAt','DESC']],
        limit:100,
    });


    const objectData = {result:'OK', list:list};

    res.send(objectData);
});

router.post('/request_removetransactions', async (req, res) => {

    console.log(`/request_removetransactions`);
    console.log(req.body);

    await db.transactions.destroy({where:{createdAt:{[Op.lte]:req.body.strDateBase}}});

    res.send({result:'OK'});
});

let Find = (list, strVender) => {

    for ( let i in list )
    {
        if ( list[i].strVender == strVender )
        {
            return list[i];
        }        
    }
    return null;
}

let BuildList = (listDB) => {

    let list = [];

    for ( let i in listDB )
    {
        let object = Find(list, listDB[i].strVender);
        if ( object == null )
        {
            object = {strVender:listDB[i].strVender, iBet:0, iWin:0, iCancel:0};
            list.push(object);
        }

        if ( listDB[i].eType == 'BET' )
            object.iBet += parseInt(listDB[i].strAmount);
        else if ( listDB[i].eType == 'WIN' )
            object.iWin += parseInt(listDB[i].strAmount);
        else
            object.iCancel += parseInt(list[i].strAmount);            
    }
    return list;
}

router.post('/request_search', async (req, res) => {

    console.log(`/transaction/request_search`);
    console.log(req.body);

    let list = await db.transactions.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:req.body.strID,
        },
        order:[['createdAt','DESC']],
    });

    let listData = BuildList(list);

    const objectData = {result:'OK', list:listData };

    res.send(objectData);
});


module.exports = router;