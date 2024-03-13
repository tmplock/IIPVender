const express = require('express');
const router = express.Router();

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const IGetVivoURL = require('./vivo').GetGameURL;
const IGetWorldURL = require('./worldent').GetGameURL;
const IGetEzugiURL = require('./ezugi').GetGameURL;
const IGetHabaneroURL = require('./habanero').GetGameURL;
const IGetHananeroSlotList = require('./habanero').GetSlotList;
const IGetHonorLinkURL = require('./honorlink').GetGameURL;
const IGetHonorLinkSlotURL = require('./honorlink').GetSlotGameURL;
const IGetHonorLinkSlotList = require('./honorlink').GetSlotList;
const IGetCQ9URL = require('./cq9').GetGameURL;

router.post('/', async (req, res) => {

    console.log(`##################################################/game`);
    console.log(req.body);
    /*
        strVender,
        strGameKey,
        strAgentCode,
        strID,
        strSecretCode,
    */
    if ( req.body.strVender == undefined || req.body.strGameKey == undefined || req.body.strAgentCode == undefined || req.body.strID == undefined || req.body.strSecretCode == undefined )
    {
        return res.send({eResult:'Error', eCode:'Not Enough Params'});
    }

    if ( req.body.strVender == IEnum.EVender.LIVE_VIVO )
    {
        const objectData = await IGetVivoURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_PP )
    {
        const objectData = await IGetHonorLinkURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, 'PragmaticPlay Live', req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_WORLD )
    {
        const objectData = await IGetWorldURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, req.body.strGameKey, req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_EZUGI )
    {
        const objectData = await IGetEzugiURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, req.body.strGameKey, req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_EVOLUTION )
    {
        const objectData = await IGetHonorLinkURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "evolution", req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_VOTA )
    {
        const objectData = await IGetHonorLinkURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "bota", req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_CQ9 )
    {
        const objectData = await IGetCQ9URL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "", req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.LIVE_DOWON )
    {
        const objectData = await IGetHonorLinkURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "Dowin", req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }

    else if ( req.body.strVender == IEnum.EVender.SM_PP )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, 'PragmaticPlay', req.body.strGameKey, req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_HABANERO )
    {
        const objectData = await IGetHabaneroURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, req.body.strGameKey, req.body.strReturnURL);
        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_MICROGAMING )  //  HONORLINK
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "MicroGaming Plus Slo", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_NETENT )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "netent", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_REDTIGER )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "redtiger", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }

    else if ( req.body.strVender == IEnum.EVender.SM_BLUEPRINT )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "Blueprint Gaming", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_DRAGONSOFT )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "Dragoon Soft", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_RELAX )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "Relax Gaming", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_ELK )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "Elk Studios", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_PLAYSTAR )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "PlayStar", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }

    else if ( req.body.strVender == IEnum.EVender.SM_BOOONGO )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "Booongo", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_PLAYSON )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "PlaySon", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_CQ9 )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "CQ9", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_ASIASLOT )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "7-mojos-slots", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_BETSOFT )
    {
        const objectData = await IGetHonorLinkSlotURL(req.body.strAgentCode, req.body.strID, req.body.strSecretCode, "7777", req.body.strGameKey, req.body.strReturnURL);

        console.log(objectData);
        return res.send(objectData);
    }
});

router.post('/slotlist', async (req, res) => {
    
    console.log(`##################################################/game/slotlist`);
    console.log(req.body);

    if ( req.body.strVender == IEnum.EVender.SM_HABANERO )
    {
        const objectData = await IGetHananeroSlotList();
        return res.send(objectData);
    }
    else if ( req.body.strVender == IEnum.EVender.SM_PP ||
                req.body.strVender == IEnum.EVender.SM_MICROGAMING ||
                req.body.strVender == IEnum.EVender.SM_NETENT ||
                req.body.strVender == IEnum.EVender.SM_REDTIGER || 
                req.body.strVender == IEnum.EVender.SM_BLUEPRINT ||
                req.body.strVender == IEnum.EVender.SM_DRAGONSOFT ||
                req.body.strVender == IEnum.EVender.SM_RELAX ||
                req.body.strVender == IEnum.EVender.SM_ELK ||
                req.body.strVender == IEnum.EVender.SM_PLAYSTAR ||
                req.body.strVender == IEnum.EVender.SM_BOOONGO ||
                req.body.strVender == IEnum.EVender.SM_PLAYSON ||
                req.body.strVender == IEnum.EVender.SM_CQ9 ||
                req.body.strVender == IEnum.EVender.SM_ASIASLOT ||
                req.body.strVender == IEnum.EVender.SM_BETSOFT 
            )
    {
        const objectData = await IGetHonorLinkSlotList(req.body.strGameKey);
        return res.send(objectData);
    }    
}); 

module.exports = router;