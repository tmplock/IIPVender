
const express = require('express');
const router = express.Router();
const md5 = require('md5');
const axios = require('axios');
const IHelper = require('../helpers/IHelpers');
//const ApiHelper = require('../helpers/ApiHelper');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const db = require('../db');

let IAccount = 
{
    cVender: 'PP',
    //cGameType: 'LIVEGAMES',
    cCurrency: 'KRW',
    //cAPIURL : 'https://api.prerelease-env.biz/IntegrationService/v3/http/CasinoGameAPI',
    cAPIURL : 'https://api-sg13.ppgames.net/IntegrationService/v3/http/CasinoGameAPI',
    cServerID : 6401748,
    cOperatorID : 3004307,
    cSecretKey : "2a8a899cCaB6472c",
    cApplication : "lobby",
    cLanguage : "ko",
    cAccount : "iipcorp_iip",
};

const makeParamsEx = (params) => {

    // null check
    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
            delete params[key];
        }
    });

    // sort
    let result = Object.keys(params).sort().reduce(
        (obj, key) => {
            obj[key] = params[key];
            return obj;
        },
        {}
    );

    // make params
    return Object.keys(result).map(function (key) {
        return key + '=' + params[key]
    }).join('&');
}

router.post('/', async (req, res) => {

    console.log(`##### /pp`);
    console.log(req.body);

});

router.get('/', async (req, res) => {

    console.log(`##### /pp`);
    console.log(`req.host : ${req.hostname}`);
    console.log(`req.get : ${req.get('host')}`);
    console.log(`req.protocol : ${req.protocol}`);
})


// const requestGame = async (req) => {

//     const params = req.body;
//     const token = await IHelper.BuildToken(16);
//     const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
//     const bResult = await IHelper.UpdateToken(strAgentID, token, req.body.strAgentCode, req.body.strSecretCode);

//     console.log(`##### token update to ${token}`);

//     const secureLogin = IAccount.cAccount;
//     const symbol = params.symbol ?? '101';
//     const language = IAccount.cLanguage;

//     console.log(`req.protocol : ${req.protocol}`);

//     const data = makeParamsEx({ language, secureLogin, symbol, token });
//     const hash = md5(`${data}${IAccount.cSecretKey}`);

//     //const apiUrl = 'https://api-sg13.ppgames.net/IntegrationService/v3/http/CasinoGameAPI';

//     let error = "0";
//     let url = 'url';

//     try {
//         const headers = {
//             "Content-Type": "application/x-www-form-urlencoded",
//             "Cache-Control": "no-cache",
//         };

//         const res = await axios.post(
//             IAccount.cAPIURL + '/game/url/',
//             `${data}&hash=${hash}`,
//             { headers }
//         );

//         error = res.data.error;
//         url = res.data.gameURL;

//     } catch (err) {
//         console.log('err', err);
//     }

//     return { error, url, token };
// }

const requestGame = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {

    //const params = req.body;
    const token = await IHelper.BuildToken(16);
    const strAgentID = `${strAgentCode}-${strID}`;
    const bResult = await IHelper.UpdateToken(strAgentID, token, strAgentCode, strSecretCode, strReturnURL);

    const secureLogin = IAccount.cAccount;
    //const symbol = strGameKey ?? '101';
    let symbol = '101';
    if ( strGameKey != '' )
        symbol = strGameKey;
    const language = IAccount.cLanguage;

    const data = makeParamsEx({ language, secureLogin, symbol, token });
    const hash = md5(`${data}${IAccount.cSecretKey}`);

    let error = "0";
    let url = 'url';

    const apiUrl = 'https://api-sg13.ppgames.net/IntegrationService/v3/http/CasinoGameAPI';

    try {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        };

        const res = await axios.post(
            apiUrl + '/game/url/',
            `${data}&hash=${hash}`,
            { headers }
        );

        error = res.data.error;
        url = res.data.gameURL;

        console.log(`####################################### ${url}`);

    } catch (err) {
        //console.log('err', err);

        console.log(`Pragmatic Play : GetGameURL Error`);
    }

    return { error, url, token };
}

let GetGameURL = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {

    const { error, url, token } = await requestGame(strAgentCode, strID, strSecretCode, strGameKey, strReturnURL);

    console.log(`/pragmatic/game`);
    console.log(url);

    if (error != "0") {
        let objectData = {eResult:'Error', eCode:'Server System Error'};
        return objectData;
    }

    let objectData = {eResult:'OK', strURL:url, strID:strID, strToken:token};
    //res.send(objectData);
    return objectData;
}

router.post('/game', async (req, res) => { //(goPPGame();)

    console.log(`##################################################/pp/game`);
    console.log(req.body);

    const { error, url, token } = await requestGame(req);

    console.log(`/pragmatic/game`);
    console.log(url);

    if (error != "0") {
        // console.log('game error', error);
        // return res.status(400).send({ error });
        let objectData = {eResult:'Error', eCode:'Server System Error'};

        return res.send(objectData);
    }

    let objectData = {eResult:'OK', strURL:url, strID:req.body.strID, strToken:token};
    res.send(objectData);

    //
    // const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
    // const bResult = await IHelper.UpdateToken(strAgentID, token, req.body.strAgentCode, req.body.strSecretCode);
    // if ( bResult == true )
    // {
    //     let objectData = {eResult:'OK', strURL:url, strID:req.body.strID, strToken:token};
    //     res.send(objectData);
    // }
    // else
    // {
    //     let objectData = {eResult:'Error', eCode:'Invalid Agent'};
    //     res.send(objectData);
    // }
})

let GetSlotList = async () => {
    
    const secureLogin = 'iipcorp_iipkr';

    const data = makeParamsEx({ secureLogin });
    const hash = md5(`${data}${IAccount.cSecretKey}`);

    const apiUrl = IAccount.cAPIURL;

    let gameList = [];
    let error = "0";
    let description = 'url';

    try {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        };

        const res = await axios.post(
            apiUrl + '/getCasinoGames/',
            `${data}&hash=${hash}`,
            { headers }
        );

        gameList = res.data.gameList;
        error = res.data.error;
        description = res.data.description;

    } catch (err) {
        console.log('err', err);
    }

    // gameList.forEach((element) => {
    //     //element.imgUrl = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.gameID}.png`;
    //     element.thumbnail = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.gameID}.png`;
    // });

    let listGames = [];
    for ( let i in gameList )
    {
        //console.log(gameList[i]);
        if ( gameList[i].typeDescription == 'Video Slots' )
        {
            const objectGame = {
                id:gameList[i].gameID,
                title:gameList[i].gameName, 
                thumbnail:`https://api-sg0.ppgames.net/game_pic/rec/325/${gameList[i].gameID}.png`, 
            }
            listGames.push(objectGame);
        }
    }

    //res.render('pp/slot', { gameList });
    //res.send({eResult:'OK', data:gameList});
    //res.send({eResult:'OK', data:listGames});
    return {eResult:'OK', data:listGames};
}

router.post('/request_listsm', async (req, res) => {

    console.log(`##################################################/pp/request_listsm`);
    console.log(req.body);

    const secureLogin = 'iipcorp_iipkr';

    const data = makeParamsEx({ secureLogin });
    const hash = md5(`${data}${IAccount.cSecretKey}`);

    const apiUrl = IAccount.cAPIURL;

    let gameList = [];
    let error = "0";
    let description = 'url';

    try {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        };

        const res = await axios.post(
            apiUrl + '/getCasinoGames/',
            `${data}&hash=${hash}`,
            { headers }
        );

        gameList = res.data.gameList;
        error = res.data.error;
        description = res.data.description;

    } catch (err) {
        console.log('err', err);
    }

    // gameList.forEach((element) => {
    //     //element.imgUrl = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.gameID}.png`;
    //     element.thumbnail = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.gameID}.png`;
    // });

    let listGames = [];
    for ( let i in gameList )
    {
        //console.log(gameList[i]);
        if ( gameList[i].typeDescription == 'Video Slots' )
        {
            const objectGame = {
                id:gameList[i].gameID,
                title:gameList[i].gameName, 
                thumbnail:`https://api-sg0.ppgames.net/game_pic/rec/325/${gameList[i].gameID}.png`, 
            }
            listGames.push(objectGame);
        }
    }

    //res.render('pp/slot', { gameList });
    //res.send({eResult:'OK', data:gameList});
    res.send({eResult:'OK', data:listGames});
})

router.post('/authenticate', async (req, res) => {

    console.log(`##################################################/pp/authenticate`);
    console.log(req.body);
    /*  Request Params
        hash,
        token,
        providerId,
        gameId,
        ipAddress,
        chosenBalance,
        launchingType,
        previousToken,
    */

    /* Response Params
        userId,
        currency,
        cash,
        bonus,
        token,          //  Optional
        country,        //  Optional
        jurisdiction,   //  Optional
        betLimits,      //  Optional
        extraInfo,      //  Optional
        error,
        description,
    */

    const data = req.body;

    let hash = data.hash;

    let providerId = data.providerId;
    let token = data.token;

    const params = makeParamsEx({ providerId, token });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { pragmaticToken: token } });
    const user = await IHelper.GetUserFromToken(IAccount.cVender, data.token);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    const strAgentID = `${user.strAgentCode}-${user.strID}`;

    console.log(`strAgnetID : ${strAgentID}`);

    return res.json({
        //userId: user.strID,
        userId:strAgentID,
        currency: IAccount.cCurrency,
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        token: token,
        error: 0,
        description: "Success",
    });
});

router.post('/balance', async (req, res) => {
    
    console.log(`##################################################/pp/balance`);
    console.log(req.body);

    /*  Request Params
        hash,
        providerId,
        userId,
        token,
    */
    /* Response Params
        currency,
        cash,
        bonus,
        totalBalance
        error,
        description,
    */

    const data = req.body;

    let hash = data.hash;
    let providerId = data.providerId;
    let token = data.token;
    let userId = data.userId;

    const params = makeParamsEx({ providerId, token, userId });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    // const transaction = await db.transactionPP.findOne({ where: { userId: data.hash,eState:'BET' } });
    // console.log("hash:" + hash)
    // if(transaction!== null){
    //      await ApiBetting.ProcessEnd('http://165.22.102.70:3030', transaction.id , transaction.gameid, user.strNickname);
    //      console.log("컴플리트")
    // }

    return res.json({
        currency: IAccount.cCurrency,
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        error: 0,
        description: "Success",
    });
});

router.post('/bet', async (req, res) => {
    
    console.log(`##################################################/pp/bet`);
    console.log(req.body);
    
    const data = req.body;

    console.log(data);
    /*  Request Params

        hash,
        userId,
        gameId,
        roundId,
        
        amount,
        reference,
        providerId,
        timestamp,
        roundDetails,

        -- optional
        bonusCode ,
        platform,
        language,
        jackpotContribution,
        jackpotDetails,
        jackpotId,
        token,
        ipAddress,
    */

    /* Response Params

        transactionId,
        currency,
        cash,
        bonus
        usedPromo,
        error,
        description,
    */

    let hash = data.hash;

    let userId = data.userId;
    let gameId = data.gameId;
    let roundId = data.roundId;
    let amount = data.amount;
    let reference = data.reference;
    let providerId = data.providerId;
    let timestamp = data.timestamp;
    let roundDetails = data.roundDetails;
    //--optional
    let bonusCode = data.bonusCode;
    let platform = data.platform;
    let language = data.language;
    let jackpotContribution = data.jackpotContribution;
    let jackpotDetails = data.jackpotDetails;
    let jackpotId = data.jackpotId;
    let token = data.token;
    let ipAddress = data.ipAddress;

    const params = makeParamsEx({ userId, gameId, roundId, amount, reference, providerId, timestamp, roundDetails, bonusCode, platform, language, jackpotContribution, jackpotDetails, jackpotId, token, ipAddress });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    if (0 > amount) {//베팅값이 없을경우
        //return res.error(-11, "Bet Amount < 0");
        return res.status(-11).send({error:'Bet Amount < 0'});
    }

    //let cUserCashOrigin = 0;
    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    //cUserCashOrigin = user.iCash;
    
    //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
    const transaction = await IHelper.GetBet(IAccount.cVender, data.reference);
    if (transaction !== null) {
        return res.json({
            transactionId: transaction.id,
            currency: IAccount.cCurrency,
            cash: +user.iCash.toFixed(2),
            bonus: 0,
            usedPromo: 0,
            error: 0,
            description: "Success",
        });
    }

    const iAmount = +amount;
    if (user.iCash < iAmount) {
        //return res.error(1, "Insufficient balance");
        return res.status(1).send({error:'Insufficient balance'});
    }

    // user.iCash -= iAmount;
    // await db.Users.update({ iCash: user.iCash }, { where: { strID: userId } });

    // UpdateUserPageCash(userId, user.iCash);

    // let eState = 'BET';

    // const newTransaction = await db.transactionPP.create({
    //     hash, userId, gameId, roundId, amount, reference, providerId, timestamp, roundDetails, bonusCode, platform, language, jackpotContribution, jackpotDetails, jackpotId, token, ipAddress, eState
    // });
   
    // const bet = await db.transactionPP.findOne({ where: { reference: data.reference } });
    // const str = bet.roundDetails;
    // const spinbet = bet.amount;

    // const btype = betting(str);
    // console.log("btype" + btype);

    let cGameCode = 0;
    let eType = 'LIVE';
    
    if(roundDetails == "spin"){
        cGameCode = 200;
        eType = 'SM';
    }
    else{
    }

    //const processbet = await IHelper.ProcessBet(eType, IAccount.cVender, IAccount.cGameType, data.hash, data.token, data.userId, data.gameId, data.reference, data.roundId, 'BET', cGameCode, amount, data.roundDetails, cGameCode, cGameCode);
    const processbet = await IHelper.ProcessBet(data.userId, eType, IAccount.cVender, data.gameId, '', data.roundId, amount, cGameCode, data.roundDetails, data.reference, cGameCode);

    const objectRet = {
        transactionId: processbet.iBetID,
        currency: IAccount.cCurrency,
        //cash: +user.iCash.toFixed(2),
        cash:processbet.iCash.toFixed(2),
        bonus: 0,
        usedPromo: 0,
        error: 0,
        description: "Success",
    };
    console.log(objectRet);
    return res.json(objectRet);
});

router.post('/result', async (req, res) => {
    
    console.log(`##################################################/pp/result`);
    console.log(req.body);

    const data = req.body;

    /*  Request Params

        hash,
        userId,
        gameId,
        roundId,
        amount,
        reference,
        providerId,
        timestamp,
        roundDetails,

        -- optional
        bonusCode ,
        platform,
        token,
        ipAddress,
        promoWinAmount,
        promoWinReference,
        promoCampaignID,
        promoCampaignType,

    */

    /* Response Params

        transactionId,
        currency,
        cash,
        bonus,
        error,
        description,
    */

        let hash = data.hash;

        let userId = data.userId;
        let gameId = data.gameId;
        let roundId = data.roundId;
        let amount = data.amount;
        let reference = data.reference;
        let providerId = data.providerId;
        let timestamp = data.timestamp;
        let roundDetails = data.roundDetails;
        //--optional
        let bonusCode = data.bonusCode;
        let platform = data.platform;
        let token = data.token;
        let ipAddress = data.ipAddress;
        let promoWinAmount = data.promoWinAmount;
        let promoWinReference = data.promoWinReference;
        let promoCampaignID = data.promoCampaignID;
        let promoCampaignType = data.promoCampaignType;
    
        const params = makeParamsEx({ userId, gameId, roundId, amount, reference, providerId, timestamp, roundDetails, bonusCode, platform, token, ipAddress, promoWinAmount, promoWinReference, promoCampaignID, promoCampaignType });
        const checkHash = md5(`${params}${IAccount.cSecretKey}`);
    
        if (checkHash != hash) {
            //return res.error(5, "Invalid Hash");
            return res.status(5).send({error:'Invalid Hash'});
        }
    
        if (0 > amount) {
            //return res.error(-11, "Bet Amount < 0");
            return res.status(-11).send({error:'Bet Amount < 0'});
        }
    
        //const user = await db.Users.findOne({ where: { strID: userId } });
        const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
        if (user == null) {
            //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
            return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
        }
    
        //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
        const transaction = await IHelper.GetBet(IAccount.cVender, data.reference);
        if (transaction !== null) {
            return res.json({
                transactionId: transaction.strTransactionID,
                currency: IAccount.cCurrency,
                cash: +user.iCash.toFixed(2),
                bonus: 0,
                error: 0,
                description: "Success",
            });
        }
    
        // const iAmount = +amount;
        // user.iCash += iAmount;
    
        // const iPromoAmount = +promoWinAmount;
        // if( 0 < iPromoAmount) {
        //     user.iCash += iPromoAmount;
        // }
    
        //UpdateUserPageCash(userId, user.iCash);
    
        // const newTransaction = await db.transactionPP.create({
        //     hash, userId, gameId, roundId, amount, reference, providerId, timestamp, roundDetails,
        //     bonusCode, platform, token, ipAddress, eState: 'WIN', promoWinAmount, promoWinReference, promoCampaignID, promoCampaignType
        // });
        
        // const oldTransaction = await db.transactionPP.findOne({ where: { userId:data.userId, roundId:data.roundId ,eState:'WIN'} });
        // if(newTransaction){
    
        //     let iGameCode = 0;
        //     if ( roundDetails == 'spin' )
        //         iGameCode = 200;
    
        //     await ApiBetting.ProcessCreateWin('', iGameCode, 'Pragmatic', roundId, gameId, iGameCode,  amount, user.iCash, user.iCash, reference, user.strNickname, user.strGroupID, user.iClass);
    
        // }
    
        let eType = 'LIVE';
        let iGameCode = 0;
        if ( roundDetails == 'spin' )
        {
            iGameCode = 200;
            eType = 'SM';
        }

        let cWin = parseInt(data.amount);
        if ( data.promoWinAmount != undefined  )
            cWin += parseInt(data.promoWinAmount);
    
        //const processwin = await IHelper.ProcessWin(eType, IAccount.cVender, IAccount.cGameType, '',  data.token, data.userId, gameId, reference, roundId, 'WIN', iGameCode, amount, roundDetails, iGameCode);
        const processwin = await IHelper.ProcessWin(data.userId, eType, IAccount.cVender, data.gameId, '', data.roundId, cWin, 0, data.roundDetails, data.reference, iGameCode);
        //const bet = await IHelper.GetBet(IAccount.cVender, data.reference);

        if(processwin != null)
        {
            return res.json({
                transactionId: reference,
                currency: IAccount.cCurrency,
                //cash: +user.iCash.toFixed(2),
                cash:processwin.iCash.toFixed(2),
                bonus: 0,
                error: 0,
                description: "Success",
            });
        }
});

router.post('/bonuswin', async (req, res) => {
    
    console.log(`##################################################/pp/bonuswin`);
    console.log(req.body);

    const data = req.body;

    /*  Request Params

        hash,
        userId,
        amount,
        reference,
        providerId,
        timestamp,

        -- optional
        bonusCode ,
        roundId,
        gameId,
        token,
    */

    /* Response Params

        transactionId,
        currency,
        cash,
        bonus,
        error,
        description,
    */

    let hash = data.hash;

    let userId = data.userId;
    let amount = data.amount;
    let reference = data.reference;
    let providerId = data.providerId;
    let timestamp = data.timestamp;
    //--optional
    let bonusCode = data.bonusCode;
    let roundId = data.roundId;
    let gameId = data.gameId;
    let token = data.token;

    const params = makeParamsEx({ userId, amount, reference, providerId, timestamp, bonusCode, roundId, gameId, token });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    if (0 > amount) {
        //return res.error(-11, "Bet Amount < 0");
        return res.status(-11).send({error:'Bet Amount < 0'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
    const transaction = await IHelper.GetBet(IAccount.cVender, data.reference);
    if (transaction !== null) {
        return res.json({
            transactionId: transaction.id,
            currency: IAccount.cCurrency,
            cash: +user.iCash.toFixed(2),
            bonus: 0,
            error: 0,
            description: "Success",
        });
    }

    // const newTransaction = await db.transactionPP.create({
    //     hash, userId, gameId, roundId, amount, reference, providerId, timestamp, bonusCode, token, eState: 'WIN'
    // });

    const eType = 'LIVE';
    const iBonusGameCode = 0;
    //const processwin = await IHelper.ProcessWin(eType, IAccount.cVender, IAccount.cGameType, hash,  token, user.strID, gameId, reference, roundId, 'WIN', iBonusGameCode, amount, '', iBonusGameCode);
    const processwin = await IHelper.ProcessWin(data.userId, 'LIVE', IAccount.cVender, data.gameId, '', data.roundId, data.amount, 0, 'BONUS', data.reference, 0);
    //const bet = await IHelper.GetBet(IAccount.cVender, data.reference);

    return res.json({
        transactionId: processwin.iBetID,
        currency: IAccount.cCurrency,
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        error: 0,
        description: "Success",
    });
});

router.post('/jackpotwin', async (req, res) => {
    
    console.log(`##################################################/pp/jackpotwin`);
    console.log(req.body);

    const data = req.body;

    /*  Request Params

        hash,
        providerId,
        timestamp,
        userId,
        gameId,
        roundId,
        jackpotId,
        jackpotDetails,
        amount,
        reference,

        -- optional
        platform,
        token,
    */

    /* Response Params

        transactionId,
        currency,
        cash,
        bonus,
        error,
        description,
    */

    let hash = data.hash;

    let providerId = data.providerId;
    let timestamp = data.timestamp;
    let userId = data.userId;
    let gameId = data.gameId;
    let roundId = data.roundId;
    let jackpotId = data.jackpotId;
    let jackpotDetails = data.jackpotDetails;
    let amount = data.amount;
    let reference = data.reference;

    let platform = data.platform;
    let token = data.token;

    const params = makeParamsEx({ providerId, timestamp, userId, gameId, roundId, jackpotId, jackpotDetails, amount, reference, platform, token });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    if (0 > amount) {
        //return res.error(-11, "Bet Amount < 0");
        return res.status(-11).send({error:'Bet Amount < 0'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
    const transaction = await IHelper.GetBet(IAccount.cVender, data.reference);
    if (transaction !== null) {
        return res.json({
            transactionId: transaction.id,
            currency: IAccount.cCurrency,
            cash: +user.iCash.toFixed(2),
            bonus: 0,
            error: 0,
            description: "Success",
        });
    }

    // const iAmount = +amount;
    // user.iCash += iAmount;
    // //await db.Users.update({ iCash: user.iCash }, { where: { strID: userId } });

    // UpdateUserPageCash(userId, user.iCash);

    // const newTransaction = await db.transactionPP.create({
    //     hash, userId, gameId, roundId, amount, reference, providerId, timestamp, platform, jackpotDetails, jackpotId, token
    // });

    const eType = 'LIVE';
    const iJackpotGameCode = 0;
    //const processwin = await IHelper.ProcessWin(eType, IAccount.cVender, IAccount.cGameType, hash, token, user.strID, gameId, reference, roundId, 'WIN', iJackpotGameCode, amount, '', iJackpotGameCode);
    //const bet = await IHelper.GetBet(IAccount.cVender, data.reference);

    const processwin = await IHelper.ProcessWin(data.userId, 'LIVE', IAccount.cVender, data.gameId, '', data.roundId, data.amount, 0, 'JACKPOT', data.reference, 0);

    return res.json({
        transactionId: processwin.iBetID,
        currency: IAccount.cCurrency,
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        error: 0,
        description: "Success",
    });
});

router.post('/endround', async (req, res) => {
    
    console.log(`##################################################/pp/endround`);
    console.log(req.body);

    const data = req.body;
    /*  Request Params

        hash,
        userId,
        gameId,
        providerId,
        
        -- optional
        
        bonusCode,
        platform,
        token,
        roundDetails,
        win,
    */
    /* Response Params

        cash,
        bonus,
        error,
        description,
    */

    let hash = data.hash;

    let userId = data.userId;
    let gameId = data.gameId;
    let providerId = data.providerId;
    let roundId = data.roundId;
    let bonusCode = data.bonusCode;
    let platform = data.platform;
    let token = data.token;
    let roundDetails = data.roundDetails;
    let win = data.win;    
    
    const params = makeParamsEx({gameId,providerId,roundId,userId});
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    return res.json({
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        error: 0,
        description: "Success",
    });
});

router.post('/refund', async (req, res) => {
    
    console.log(`##################################################/pp/refund`);
    console.log(req.body);

    const data = req.body;
    /*  Request Params

        hash,
        userId,
        reference,
        providerId,

        -- optional
        platform,
        amount,
        gameId,
        roundId,
        timestamp,
        roundDetails,
        bonusCode,
        token,
    */

    /* Response Params

        transactionId,
        error,
        description,
    */

    let hash = data.hash;

    let userId = data.userId;
    let reference = data.reference;
    let providerId = data.providerId;

    let platform = data.platform;
    let amount = data.amount;
    let gameId = data.gameId;
    let roundId = data.roundId;
    let timestamp = data.timestamp;
    let roundDetails = data.roundDetails;
    let bonusCode = data.bonusCode;
    let token = data.token;

    const params = makeParamsEx({ userId, reference, providerId, platform, amount, gameId, roundId, timestamp, roundDetails, bonusCode, token });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
    const transaction = await IHelper.GetBet(IAccount.cVender, reference);
    if (transaction === null) {
        return res.json({
            transactionId: 0,
            error: 0,
            description: "non-existing transaction",
        });
    }

    await IHelper.ProcessCancel(data.userId, 'LIVE', IAccount.cVender, reference, providerId);

        return res.json({
        transactionId: transaction.id,
        error: 0,
        description: "Success",
    });

    // // 이미 refund 일때는 리턴
    // if(transaction.eType === 'REFUND') {
    //     return res.json({
    //         transactionId: transaction.id,
    //         error: 0,
    //         description: "Success",
    //     });
    // }
    // if(transaction.eType != 'REFUND'){

    //     let eType = 'LIVE';
    //     let iGameCode = 0;
    //     if ( transaction.eGameType == 'SM' )
    //     {
    //         eType = 'SM';
    //         iGameCode = 200;
    //     }

    //     let iRefundAmount = 0;
    //     if ( transaction.eType == 'BET')
    //     {
    //         //user.iCash += Number(transaction.amount);
    //         iRefundAmount = parseInt(transaction.strAmount);
    //     }
    //     else if ( transaction.eType == 'WIN' )
    //     {
    //         //user.iCash -= Number(transaction.amount);
    //         iRefundAmount = -parseInt(transaction.strAmount);
    //     }

    //     //await ApiBetting.ProcessCancel('http://165.22.102.70:3030', reference, iGameCode, transaction.userId);
    //     //const processbet = await IHelper.ProcessCancel(eType, IAccount.cVender, IAccount.cGameType, '', '', data.userId, gameId, reference, roundId, 'REFUND', '', amount, roundDetails);
    //     const processcancel = await IHelper.ProcessCancel(data.userId, eType, IAccount.cVender, data.gameId, data.roundId, iRefundAmount, 0, '', reference, iGameCode);
    // }

    // // UpdateUserPageCash(userId, user.iCash);

    // // await db.transactionPP.update( { eState: 'REFUND' }, { where: { reference: data.reference } });

    // const bet = await IHelper.GetBet(IAccount.cVender, reference);

    // return res.json({
    //     transactionId: bet.id,
    //     error: 0,
    //     description: "Success",
    // });
});

router.post('/getbalancepergame', async (req, res) => {
    
    console.log(`##################################################/pp/getbalancepergame`);
    console.log(req.body);

    const data = req.body;
    /* Request Params

        hash,
        userId,
        providerId,
        gameIdList

        -- optional
        token,
        platform,
    */

    /* Response Params

        gamesBalances,
        totalBalance,
        error,
        description,
    */

    let hash = data.hash;

    let userId = data.userId;
    let providerId = data.providerId;
    let gameIdList = data.gameIdList;

    let token = data.token;
    let platform = data.platform;

    const params = makeParamsEx({ userId, providerId, gameIdList, token, platform });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    // do something...

    return res.json({
        gamesBalances: 0,
        totalBalance: 0,
        error: 0,
        description: "Success",
    });
});

router.post('/promowin', async (req, res) => {
    
    console.log(`##################################################/pp/promowin`);
    console.log(req.body);
    const data = req.body;
    /* Request Params

        hash,
        providerId,
        timestamp,
        userId,
        campaignId,
        campaignType,
        amount,
        currency,
        reference,

        -- optional
        dataType,
    */
    /* Response Params

        transactionId,
        currency,
        cash,
        bonus,
        error,
        description,
    */

    let hash = data.hash;

    let providerId = data.providerId;
    let timestamp = data.timestamp;
    let userId = data.userId;
    let campaignId = data.campaignId;
    let campaignType = data.campaignType;
    let amount = data.amount;
    let currency = data.currency;
    let reference = data.reference;

    let dataType = data.dataType;

    const params = makeParamsEx({ providerId, timestamp, userId, campaignId, campaignType, amount, currency, reference, dataType });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
    const transaction = await IHelper.GetBet(IAccount.cVender, data.reference);
    if (transaction !== null) {
        return res.json({
            transactionId: transaction.id,
            currency: IAccount.cCurrency,
            cash: +user.iCash.toFixed(2),
            // cash: user.iCash,
            bonus: 0,
            error: 0,
            description: "Success",
        });
    }

    // const iAmount = +amount;
    // user.iCash += iAmount;
    // //await db.Users.update({ iCash: user.iCash }, { where: { strID: userId } });

    // UpdateUserPageCash(userId, user.iCash);

    // const newTransaction = await db.transactionPP.create({
    //     hash, userId, amount, reference, providerId, timestamp,campaignId, campaignType
    // });
    const eType = 'LIVE';
    let iJackpotGameCode = 0;
    //const processwin = await IHelper.ProcessWin(eType, IAccount.cVender, IAccount.cGameType, hash, '', user.strID, campaignId, reference, campaignType, 'WIN', iJackpotGameCode, amount, '', iJackpotGameCode);
    const processwin = await IHelper.ProcessWin(data.userId, 'LIVE', IAccount.cVender, data.gameId, '', data.roundId, data.amount, 0, 'PROMOWIN', data.reference, 0);
    //const bet = await IHelper.GetBet(IAccount.cVender, data.reference);

    return res.json({
        transactionId: processwin.iBetID,
        currency: IAccount.cCurrency,
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        error: 0,
        description: "Success",
    });
});

router.post('/sessionexpired', async (req, res) => {
    
    console.log(`##################################################/pp/sessionexpired`);
    console.log(req.body);

    const data = req.body;
    /* Request Params

        hash,
        providerId,
        sessionId,
        playerId,

        -- optional
        token,
    */

    /* Response Params

        error,
        description,
    */

    let hash = data.hash;

    let providerId = data.providerId;
    let sessionId = data.sessionId;
    let playerId = data.playerId;

    let token = data.token;
    // 예제없음
    const params = makeParamsEx({ providerId, sessionId, playerId, token });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    // do something...

    return res.json({
        error: 0,
        description: "Success",
    });
});

router.post('/adjustment', async (req, res) => {
    
    console.log(`##################################################/pp/adjustment`);
    console.log(req.body);
    const data = req.body;

    /* Request Params

        hash,
        userId,
        gameId,
        token,
        roundId,
        amount,
        reference,
        providerId,
        validBetAmount,
        timestamp

    */
    /* Response Params

        transactionId,
        currency,
        cash,
        bonus,
        error,
        description,
    */
    let hash = data.hash;

    let userId = data.userId;
    let gameId = data.gameId;
    let token = data.token;
    let roundId = data.roundId;
    let amount = data.amount;
    let reference = data.reference;
    let providerId = data.providerId;
    let validBetAmount = data.validBetAmount;
    let timestamp = data.timestamp;

    const params = makeParamsEx({ userId, gameId, token, roundId, amount, reference, providerId, validBetAmount, timestamp });
    const checkHash = md5(`${params}${IAccount.cSecretKey}`);

    if (checkHash != hash) {
        //return res.error(5, "Invalid Hash");
        return res.status(5).send({error:'Invalid Hash'});
    }

    //const user = await db.Users.findOne({ where: { strID: userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user == null) {
        //return res.error(4, "Player authentication failed due to invalid, not found or expired token");
        return res.status(4).send({error:'Player authentication failed due to invalid, not found or expired token'});
    }

    //const transaction = await db.transactionPP.findOne({ where: { reference: data.reference } });
    const transaction = await IHelper.GetBet(IAccount.cVender, data.reference);
    if (transaction !== null) {
        return res.json({
            transactionId: transaction.id,
            currency: IAccount.cCurrency,
            cash: +user.iCash.toFixed(2),
            bonus: 0,
            error: 0,
            description: "Success",
        });
    }

    // const iAmount = +amount;
    // if ( Math.sign(iAmount) && user.iCash < Math.abs(iAmount)) {
    //     return res.error(1, "Insufficient funds");
    // }

    // user.iCash += iAmount;
    // await db.Users.update({ iCash: user.iCash }, { where: { strID: userId } });

    // UpdateUserPageCash(userId, user.iCash);

    // const newTransaction = await db.transactionPP.create({
    //     hash, userId, gameId, roundId, amount, reference, providerId, timestamp, 
    // });
    const eType = 'LIVE';
    let iJackpotGameCode = 0;
    //const processwin = await IHelper.ProcessWin(eType, IAccount.cVender, IAccount.cGameType, hash, '', user.strID, gameId, reference, roundId, 'WIN', iJackpotGameCode, amount, '', iJackpotGameCode);
    const processwin = await IHelper.ProcessWin(data.userId, 'LIVE', IAccount.cVender, data.gameId, '', data.roundId, data.amount, 0, 'ADJUST', data.reference, 0);
    //const bet = await IHelper.GetBet(IAccount.cVender, data.reference);

    return res.json({
        transactionId: processwin.iBetID,
        currency: IAccount.cCurrency,
        cash: +user.iCash.toFixed(2),
        bonus: 0,
        error: 0,
        description: "Success",
    });
});

module.exports = {
    router:router, 
    GetGameURL:GetGameURL,
    GetSlotList:GetSlotList,
};
