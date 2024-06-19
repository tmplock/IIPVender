
const express = require('express');
const router = express.Router();

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');
let axios = require('axios');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const cron = require('node-cron');

// const db = require('../db');
// const redis = require('../redis');

let IAccount = 
{
    cVender : 'THENUT',
    cLanguage : "KR",
    cGameType : 'LIVEGAMES',
    cAPIURL : 'https://external.goodgame-api.link',
    cAPIKey : '54c526ac44698470f1fe8dc2431f927c',
};
const headers = {
    "Authorization": "Bearer " + IAccount.cAPIKey,
    "Accept": "application/json",
    "Content-Type": "application/json",
};

let RequestGameList = async (strVender) => {

    try {

        const responseData = await axios.get(

            IAccount.cAPIURL + `/game-list?vendor=${strVender}`,
            { headers }
        );

        return responseData.data;

    } catch (err) {
        console.log('err', err);

        return null;
    }
}

let RequestLobbyList = async (strVender) => {

    try {

        const responseData = await axios.get(

            IAccount.cAPIURL + `/lobby-list`,
            { headers }
        );

        let list = [];
        const data = responseData.data;
        for ( let i in data )
        {
            if ( data[i].vendor == strVender )
            {
                list.push(data[i]);
            }
        }

        return list;

    } catch (err) {
        console.log('err', err);

        return null;
    }
}

let RequestGameURL = async (strVender, strGameID, strID) => {

    try {

        const responseData = await axios.get(

            IAccount.cAPIURL + `/game-launch-link?username=${strID}&game_id=${strGameID}&vendor=${strVender}`,
            { headers }
        );

        return responseData.data;

    } catch (err) {
        console.log('err', err);

        return null;
    }
}

let GetGameURL = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {

    const strToken = await IHelper.BuildToken(16);

    if(strToken != ''){

        const strAgentID = `${strAgentCode}-${strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, strToken, '', strAgentCode, strSecretCode, strReturnURL);
        if(bResult == true)
        {
            console.log(`################################################### strAgentID : ${strAgentID}`);

            const res_data = await RequestGameList(strGameKey);
            //console.log(res_data);

            const res_lobby = await RequestLobbyList(strGameKey);
            if (res_lobby == null) {
                let objectData = {eResult:'Error', eCode:'No Game Access'};
                return objectData;
            }
            console.log(res_lobby);

            const res_url = await RequestGameURL(strGameKey, res_lobby[0].id, strAgentID);
            if (res_url == null || (res_url.link ?? '').length === 0) {
                let objectData = {eResult:'Error', eCode:'No Game Access'};
                return objectData;
            }
            console.log(res_url);

            let objectData = {eResult:'OK', strURL:res_url.link, strID:strID, strToken:strToken};
            //res.send(objectData);
            return objectData;
        }
        else
        {
            let objectData = {eResult:'Error', eCode:'Invalid Agent'};
            //res.send(objectData);
            return objectData;
        }
    }
    else
    {
        let objectData = {eResult:'Error', eCode:'Server System Error'};
        //res.send(objectData);
        return objectData;
    }
}

router.post('/game', async (req, res) => {

    console.log(`##################################################/honorlink/game`);
    console.log(req.body);

    const strToken = await IHelper.BuildToken(16);

    if(strToken != ''){

        const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, strToken, '', req.body.strAgentCode, req.body.strSecretCode);
        if(bResult == true)
        {
            console.log(`################################################### strAgentID : ${strAgentID}`);

            const res_data = await RequestGameList(req.body.strGameKey);
            //console.log(res_data);

            const res_lobby = await RequestLobbyList(req.body.strGameKey);
            if (res_lobby == null) {
                let objectData = {eResult:'Error', eCode:'No Game Access'};
                return objectData;
            }
            console.log(res_lobby);

            const res_url = await RequestGameURL(req.body.strGameKey, res_lobby[0].id, strAgentID);
            if (res_url == null || (res_url.link ?? '').length === 0) {
                let objectData = {eResult:'Error', eCode:'No Game Access'};
                return objectData;
            }
            console.log(res_url);

            let objectData = {eResult:'OK', strURL:res_url.link, strID:req.body.strID, strToken:strToken};
            res.send(objectData);
        }
        else
        {
            let objectData = {eResult:'Error', eCode:'Invalid Agent'};
            res.send(objectData);
        }
    }
    else
    {
        let objectData = {eResult:'Error', eCode:'Server System Error'};

        res.send(objectData);
    }

});

let GetSlotGameURL = async (strAgentCode, strID, strSecretCode, strVender, strGameKey, strReturnURL) => {

    console.log(`###### GetSlotGameURL : ${strAgentCode}-${strID}`);
    console.log(`/GetSlotGameURL`);

    const strAgentID = `${strAgentCode}-${strID}`;
    const res_url = await RequestGameURL(strVender, strGameKey, strAgentID);
    if (res_url == null || (res_url.link ?? '').length === 0) {
        let objectData = {eResult:'Error', eCode:'No Game Access'};
        return objectData;
    }

    // const strToken = await IHelper.BuildToken(16);

    // const bResult = await IHelper.UpdateToken(strAgentID, strToken, strAgentCode, strSecretCode, strReturnURL);
    
    const token = await IHelper.GetUserFromID2(IAccount.cVender, strAgentID)
    console.log(`##### token : ${strAgentID}`);
    if ( null == token )
    {
        console.log(`##### token is null`);
        const strToken = await IHelper.BuildToken(16);
        const bResult = await IHelper.UpdateToken(strAgentID, strToken, '',strAgentCode, strSecretCode, strReturnURL);
    }
    console.log(res_url);
    let objectData = {eResult:'OK', strURL:res_url.link, strID:strID, strToken:''};
    //res.send(objectData);
    return objectData;
}

router.post('/gamesm', async (req, res) => {

    console.log(`##################################################/honorlink/gamesm`);
    console.log(req.body);

    const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
    const res_url = await RequestGameURL(req.body.strGameKey, req.body.symbol, strAgentID);
    if (res_url == null || (res_url.link ?? '').length === 0) {
        let objectData = {eResult:'Error', eCode:'No Game Access'};
        return objectData;
    }
    console.log(res_url);
    let objectData = {eResult:'OK', strURL:res_url.link, strID:req.body.strID, strToken:''};
    res.send(objectData);
    // try {
    //     const data = req.body;
    //     const cVender = data.strGameKey;
    //     const responseData = await axios.get(
    //         IAccount.cAPIURL + `/game-url?vendor_key=${cVender}&game_key=${data.symbol}&account=${req.body.strID}`,
    //         { headers }
    //     );

    //     let objectData = {eResult:'OK', strURL:responseData.data.data.url, strID:req.body.strID, strToken:''};
    //     //res.send(`window.open('${responseData.data.data.url}','IIP Gaming','width='+screen.width+', height='+screen.height+', statusbar=no,scrollbars=auto,toolbar=no,resizable=no');`);
    //     //res.send(responseData.data.data.url);
    //     res.send(objectData);

    // } catch (err) {
    //     console.log('err', err);
    // }
});

let GetSlotList = async (strGameKey) => {

    const res_data = await RequestGameList(strGameKey);
    //console.log(res_data);
    if (res_data == null) {
        let objectData = {eResult:'Error', eCode:'No Game Access', data: {}};
        return objectData;
    }
    //res.send({eResult:'OK', data:res_data});
    return {eResult:'OK', data:res_data};
}

router.post('/request_listsm', async (req, res) => {

    console.log(`##################################################/honorlink/request_listsm`);
    console.log(req.body);

    const res_data = await RequestGameList(req.body.strGameKey);
    if (res_data == null) {
        let objectData = {eResult:'Error', eCode:'No Game Access', data: {}};
        return objectData;
    }
    //console.log(res_data);

    // const responseData = await axios.get(
    //     IAccount.cAPIURL + `/game?vendor_key=${req.body.strGameKey}`,
    //     { headers }
    // );
    // console.log(responseData.data);
    // console.log(responseData.data.data.game_list[0]);
    
    // let gameList= responseData.data.data.game_list;

    // gameList.forEach((element) => {
    //     element.imgUrl = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.game_key}.png`;
    // });

    // //res.render('pp/slot', { gameList });
     res.send({eResult:'OK', data:res_data});
})

router.get('/balance', async (req, res) => {

    console.log(`##################################################/thenut/balance`);
    console.log(req.query);

    const user = await IHelper.GetUserFromID2(IAccount.cVender, req.query.username);
    if (user === null) {
        return res.json({balance:0});
    }
    return res.json({balance:user.iCash});
})

let GetGameType = (game) => {

    if ( game.type == 'slot')
        return 'SM';

    return 'LIVE';
}

let GetGameCode = (game) => {

    if ( game.type == 'slot')
        return 200;
    else if ( game.type == 'baccarat' )
        return 0;
    
    return 500;
}

// let listDB = [];

// let AddDB = (objectDB) => {
    
//     listDB.push(objectDB);
//     if ( listDB.length > 100 )
//     {
//         listDB.shift();
//     }

//     console.log(`##### HonorLink : AddDB : ${listDB.length}`);
// }

// let FindDB = (strTransactionID) => {

//     for ( let i in listDB )
//     {
//         if ( listDB[i].strTransactionID == strTransactionID )
//             return listDB[i];
//     }
//     return null;
// }

router.post('/changebalance', async (req, res) => {

    console.log(`##################################################/honorlink/changebalance`);
    console.log(req.body);

    const transaction = req.body.transaction;

    console.log(transaction.details.game);

    const cType = GetGameType(transaction.details.game);
    const eGameCode = GetGameCode(transaction.details.game);

    console.log(transaction.details.game);

    switch ( transaction.type )
    {
        case 'bet':
            {
                //res.status(200).json({});
                //const bet = await IHelper.ProcessBet(req.body.username, cType, IAccount.cVender, transaction.details.game.vendor, transaction.details.game.id, transaction.details.game.round, -req.body.amount, 0, '', transaction.id, eGameCode);
                //const bet = await IHelper.ProcessBet2(req.body.username, cType, IAccount.cVender, transaction.details.game.vendor, transaction.details.game.id, transaction.details.game.round, -req.body.amount, 0, '', transaction.id, eGameCode);
                const bet = await IHelper.ProcessBet2(req.body.username, cType, IAccount.cVender, transaction.details.game.vendor, transaction.details.game.title, transaction.details.game.round, -req.body.amount, 0, '', transaction.id, eGameCode);
                if ( bet != null )
                {
                    res.status(200).json({});
                }
                else
                {
                    res.status(500).json({});
                }
                //AddDB(bet);
                //await AddDB(bet);
                return;
            }
        case 'win':
            {
                res.status(200).json({});

                if ( parseInt(req.body.amount) > 0 )
                {
                    const win = await IHelper.ProcessWin2(req.body.username, cType, IAccount.cVender, transaction.details.game.vendor, transaction.details.game.title, transaction.details.game.round, req.body.amount, 0, '', transaction.referer_id, eGameCode);
                }
                //const win = await IHelper.ProcessWin2(req.body.username, cType, IAccount.cVender, transaction.details.game.vendor, transaction.details.game.id, transaction.details.game.round, req.body.amount, 0, '', transaction.referer_id, eGameCode);
                //const win = await IHelper.ProcessWin2(req.body.username, cType, IAccount.cVender, transaction.details.game.vendor, transaction.details.game.id, transaction.details.game.round, req.body.amount, 0, '', transaction.id, eGameCode);
                
                //AddDB(win);
                //await AddDB(win);
                return;
            }
        case 'cancel':
            {
                res.status(200).json({});

                await IHelper.ProcessCancel2(req.body.username, transaction.referer_id);
                // const data = await FindDB(transaction.referer_id);
                // if ( data != null )
                // {
                //     const cancel = await IHelper.ProcessCancel2(req.body.username, IAccount.cVender, data.strTransactionID, data.strGameID, data.strRoundID, data.eType);
                // }
                return;
            }
        case 'charge':
            {
                return res.status(500).json({});
            }
        case 'adjust':
            {
                return res.status(500).json({});
            }
        case 'promo_win':
            {
                return res.status(500).json({});
            }
        case 'exceed_credit':
            {
                return res.status(500).json({});
            }
    }
});

module.exports = {
    router:router,
    GetGameURL:GetGameURL,
    GetSlotList:GetSlotList,
    GetSlotGameURL:GetSlotGameURL,
};

// let lProcessID = -1;
// let strCurrentStep = '';

// //cron.schedule('*/5 * * * * * ', async ()=> {
// cron.schedule('*/10 * * * * * ', async ()=> {
// //cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * ', async ()=> {

//     console.log(`##### CRON`);
    
//     if (lProcessID != -1)
//     {
//         console.log(`##### CRON IS PROCESSING : ${strCurrentStep}`);
//         return;
//     }
//     lProcessID = 1;

    
//     lProcessID = -1;
    
//     console.log(`##### END OF CRON`);
// });