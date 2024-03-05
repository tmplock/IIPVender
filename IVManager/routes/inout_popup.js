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

router.get('/inout', async (req, res) => {
    
    console.log(`/inout_popup/inout`);
    console.log(req.query);

    if ( req.user == null )
        res.redirect('/account/login');
    else
    {
        //const user = await db.Users.findOne({where:{strID:req.query.strID}});
        const admin = await db.Users.findOne({where:{iClass:0}});
        const agents = await db.Users.findAll({where:{iClass:1}});

        res.render('inout/popup_inout', {iLayout:1, admin:admin, agents:agents});
    }     

});

router.post('/request_list', async (req, res) => {
    
    console.log(`/partner_popup/request_list`);
    console.log(req.body);

    let listGives = await db.Inouts.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strRequestNickname:req.body.strRequestNickname,
            eType:'GIVE'
        },
        order:[['createdAt','DESC']]
    });
    let listTakes = await db.Inouts.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strRequestNickname:req.body.strRequestNickname,
            eType:'TAKE'
        },
        order:[['createdAt','DESC']]
    });

    const objectData = {result:'OK', listGives:listGives, listTakes:listTakes};
    res.send(objectData);
});

router.post('/request_listforresponser', async (req, res) => {
    
    console.log(`/partner_popup/request_listforresponser`);
    console.log(req.body);

    let listGives = await db.Inouts.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strResponseNickname:req.body.strResponseNickname,
            eType:'GIVE'
        },
        order:[['createdAt','DESC']]
    });
    let listTakes = await db.Inouts.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strResponseNickname:req.body.strResponseNickname,
            eType:'TAKE'
        },
        order:[['createdAt','DESC']]
    });

    const objectData = {result:'OK', listGives:listGives, listTakes:listTakes};
    res.send(objectData);
});

router.post('/request_inout', async (req, res) => {
    
    console.log(`/partner_popup/request_inout`);
    console.log(req.body);

    const admin = await db.Users.findOne({where:{iClass:0}});
    const agent = await db.Users.findOne({where:{strNickname:req.body.strAgent}});

    if ( admin == null || agent == null )
    {
        res.send({result:'Error'});
    }
    else
    {
        await db.Inouts.create({
            strRequestNickname:admin.strNickname,
            strResponseNickname:agent.strNickname,
            strGroupID:agent.strGroupID,
            eType:req.body.eInoutType,
            eState:'COMPLETE',
            iAmount:req.body.iAmount,
        });

        if ( req.body.eInoutType == 'GIVE' )
        {
            await db.Users.increment({iCash:req.body.iAmount}, {where:{strNickname:req.body.strAgent}});
        }
        else
        {
            await db.Users.decrement({iCash:req.body.iAmount}, {where:{strNickname:req.body.strAgent}});
        }

        const objectData = {result:'OK'};
        res.send(objectData);
    }
});

module.exports = router;