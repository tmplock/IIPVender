
const express = require('express');
const router = express.Router();

const IHelper = require('../helpers/IHelpers');
const IHelperVivo = require('../helpers/IHelperVivo');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const db = require('../db');

let IAccount = 
{
    cVender: 'VIVO',
    cCurrency: 'KRW',
    cGameURL : 'http://games.vivogaming.com',
    cServerID : 6401748,
    cOperatorID : 3004307,
    cPassKey : "7f1c5d",
    cApplication : "lobby",
    cLanguage : "KR",
    cGameType : 'LIVE'
};

const data = 'type:bets,desc:[{"c":"Plyr","a":"2000.0"},{"c":"Tie","a":"0.0"}],validBetAmt:2000';
const object = data.substring(data.indexOf('[')+1, data.indexOf(']'));
const array = object.split('},{')

for ( let i in array )
{
    const temp = `{${array[i]}`;
    console.log(temp);
    //console.log(array[i]);
    //const t = JSON.parse(array[i]);
    //console.log(t);
}
//const object = JSON.loads(data);
//console.log(object);

router.get('/', async (req, res) => {

    console.log(`##### /vivo`);
    // console.log(req.body);

    // const ret = await db.transactionVivo.create({strBrand:'iip'});
    // console.log(`ret : ${ret.id}`);

});

router.post('/', async (req, res) => {

    console.log(`##### /vivo`);
    console.log(req.body);

});

let GetGameURL = async (strAgentCode, strID, strSecretCode, strReturnURL) => {

    const cToken = await IHelper.BuildToken(16);
    if ( cToken != '' )
    {
        const strAgentID = `${strAgentCode}-${strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, strAgentCode, strSecretCode, strReturnURL);
        if ( bResult == true )
        {
            const url = `${IAccount.cGameURL}/?token=${cToken}&operatorID=${IAccount.cOperatorID}&serverid=${IAccount.cServerID}&application=${IAccount.cApplication}&selectedgame=baccarat&language=${IAccount.cLanguage}`

            let objectData = {eResult:'OK', strURL:url, strID:strID, strToken:cToken};
            return objectData;
            //res.send(objectData);
        }
        else
        {
            let objectData = {eResult:'Error', eCode:'Invalid Agent'};
            return objectData;
            //res.send(objectData);
        }
    }
    else
    {
        let objectData = {eResult:'Error', eCode:'Server System Error'};
        return objectData;
        //res.send(objectData);
    }
}
//exports.GetGameURL = GetGameURL;

router.post('/game', async (req, res) => {

    console.log(`##################################################/vivo/game`);
    console.log(req.body);
    /*
        req.body.strAddress
    */

    const cToken = await IHelper.BuildToken(16);
    if ( cToken != '' )
    {
        const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, req.body.strAgentCode, req.body.strSecretCode);
        if ( bResult == true )
        {
            const url = `${IAccount.cGameURL}/?token=${cToken}&operatorID=${IAccount.cOperatorID}&serverid=${IAccount.cServerID}&application=${IAccount.cApplication}&selectedgame=baccarat&language=${IAccount.cLanguage}`

            let objectData = {eResult:'OK', strURL:url, strID:req.body.strID, strToken:cToken};
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

// router.post('/game', async (req, res) => {

//     console.log(`##################################################/vivo/game`);
//     console.log(req.body);
//     /*
//         req.body.strAddress
//     */

//     const cToken = await IHelper.BuildToken(16);
//     if ( cToken != '' )
//     {
//         const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
//         const bResult = await IHelper.UpdateToken(strAgentID, cToken, req.body.strAgentCode, req.body.strSecretCode);
//         if ( bResult == true )
//         {
//             const url = `${IAccount.cGameURL}/?token=${cToken}&operatorID=${IAccount.cOperatorID}&serverid=${IAccount.cServerID}&application=${IAccount.cApplication}&selectedgame=baccarat&language=${IAccount.cLanguage}`

//             let objectData = {eResult:'OK', strURL:url, strID:req.body.strID, strToken:cToken};
//             res.send(objectData);
//         }
//         else
//         {
//             let objectData = {eResult:'Error', eCode:'Invalid Agent'};
//             res.send(objectData);
//         }
//     }
//     else
//     {
//         let objectData = {eResult:'Error', eCode:'Server System Error'};

//         res.send(objectData);
//     }
// });

router.get('/authenticate', async (req, res) => {

    console.log(`##################################################/vivo/authenticate`);
    console.log(req.query);

    const data = req.query;

    // token, hash 를 가져온다.
    if (data.token === undefined) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 400 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    if (data.hash === undefined) {
        // throw new Error('token | hash undefined')
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 500 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // token, hash 를 검증한다.
    if (!IHelperVivo.verificationMD5Hash(data.token + IAccount.cPassKey, data.hash)) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 500 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // user table에서 해당 token을 찾는다.
    // const user = await db.Users.findOne({ where: { vivoToken: data.token } });
    // if (user === null) {
    //     const result = IHelperVivo.makeVivoXMLResult( data, { result: 'FAILED', code: 400 })
    //     return res.header("Content-Type", "application/xml").send(result)
    // }

    const user = await IHelper.GetUserFromToken(IAccount.cVender, data.token);
    if (user === null) {
        const result = IHelperVivo.makeVivoXMLResult( data, { result: 'FAILED', code: 400 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // user 에다가 vivoToken 을 'bcdc9170e317a683dbcb7bac5487a827' 로 넣어놓음.
    //console.log(user)

    const strAgentID = `${user.strAgentCode}-${user.strID}`;

    // 해당 회원이 존재하기 때문에 성공을 돌려준다.
    const result = IHelperVivo.makeVivoXMLResult( data, {
        result: 'OK',
        //userid: user.strID,
        userid: strAgentID,
        currency: 'KRW',
        balance: user.iCash.toFixed(2),
        gamesessionid: user.iSessionID,
    })
    return res.header("Content-Type", "application/xml").send(result)
});

router.get('/changebalance', async (req, res) => {
    
    console.log(`##################################################/vivo/changebalance`);
    //console.log(req.query);
    
    const data = req.method == 'GET' ? req.query : req.body;
    console.log(data);

    if (data.userId === undefined ||
        data.Amount === undefined ||
        data.TransactionID === undefined ||
        data.TrnType === undefined ||
        data.TrnDescription === undefined ||
        data.roundId === undefined ||
        data.gameId === undefined ||
        data.History === undefined ||
        data.isRoundFinished === undefined ||
        data.hash === undefined
        ) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 399 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // userId + casinoTransactionId, hash 를 검증한다.
    if (!IHelperVivo.verificationMD5Hash(data.userId+data.Amount+data.TrnType+data.TrnDescription+data.roundId+data.gameId+data.History + IAccount.cPassKey, data.hash)) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 400 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // user table에서 해당 token을 찾는다.
    //const user = await db.Users.findOne({ where: { strID: data.userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user === null) {
        const result = IHelperVivo.makeVivoXMLResult( data, { result: 'FAILED', code: 310 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    const iTransactionID = data.TransactionID;
    const iRoundID = data.roundId;
    const iGameID = data.gameId;
    const iAmount = data.Amount;
    const iTableID = data.TrnDescription;


    let cUserCashOrigin = 0;
    if ( null != user )
    {
        cUserCashOrigin = user.iCash;
    }

    const transaction = await IHelper.GetBet(IAccount.cVender, data.TransactionID);
    if (transaction !== null) {
        const result = IHelperVivo.makeVivoXMLResult( data, {
            result: 'OK',
            ecSystemTransactionID: transaction.id,
            balance: user.iCash.toFixed(2),
        })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // const amount = Number(data.Amount)
    const amount = +data.Amount;

    if( amount === 'NaN' || amount < 0) {
        console.log('insufficient funds')

        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 399 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // TrnType에 따른 유저 보유금액 차감 및 증감
    if( data.TrnType == 'BET') 
    {
        // 보유머니 체크
        if(user.iCash < amount) {
            console.log('insufficient funds')

            //const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 399 })
            const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 300 })
            return res.header("Content-Type", "application/xml").send(result)
        }
        
        user.iCash -= amount;

        //  Betting Records
        if ( data.isRoundFinished == "false" )
        {
            const processbet = await IHelper.ProcessBet(data.userId, IAccount.cGameType, IAccount.cVender, data.gameId, '', data.roundId, data.Amount, 0, data.History, data.TransactionID, 0);
            if ( processbet == null )
            {
                const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 302 })
                return res.header("Content-Type", "application/xml").send(result)
            }
        }
    }
    else if( data.TrnType == 'WIN') 
    {
        // console.log(`/vivo/changebalance/win`);
        // console.log(data);
        user.iCash += amount;

        await IHelper.ProcessWin(data.userId, IAccount.cGameType, IAccount.cVender, data.gameId, '', data.roundId, data.Amount, 0, data.History, data.TransactionID, 0);
        //const oldTransaction = await db.transactionVivo.findOne({ where: { userid:data.userId, roundid:data.roundId } });


        // const oldTransaction = await IHelper.GetBetFromID(IAccount.cVender, data.userId, data.roundId);
        // if ( oldTransaction )
        // {
        //     let winInfo = IHelperVivo.GetBettingTargetFromWin(data.History, iGameID, data.Amount);
        //     //let strWinAccount = IHelperVivo.GetWinAccount(data.History);

        //     let bInsert = false;
        //     console.log(winInfo);
        //     if ( winInfo.length > 0 ) // win 일때.
        //     {
        //         for( let i in winInfo )
        //         {
        //             if ( parseInt(winInfo[i].win) > 0 )
        //             {
        //                 bInsert = true;
        //                 const cTarget = IHelperVivo.ProcessTargetForBackOffice(winInfo[i].target);
        //                 let iGameCode = IHelperVivo.GetGameCode(cTarget, oldTransaction.gameid);
        //                 let iBettingTarget = IHelperVivo.GetBettingTarget(cTarget, oldTransaction.gameid);
        //                 console.log(winInfo[i].win);

        //                 //await IHelper.ProcessWin('LIVE', IAccount.cVender, IAccount.cGameType, '',  data.TrnDescription, data.userId, iTableID, iTransactionID, iRoundID, 'WIN', iBettingTarget, winInfo[i].win, '', iGameCode);
        //                 await IHelper.ProcessWin(data.userId, IAccount.cGameType, IAccount.cVender, data.gameId, data.roundId, winInfo[i].win, iBettingTarget, data.TrnDescription, data.TransactionID, iGameCode);
        //             }
        //         }
        //     }
        //     //else

        //     if ( false == bInsert ) // tie 일때.
        //     {
        //         console.log("tie : !!!!!!!!!!!!!!" );
        //         //await IHelper.CreateWin('LIVE', IAccount.cVender, IAccount.cGameType, '',  data.TrnDescription, data.userId, iGameID, iTransactionID, iRoundID, 'WIN', 0, data.Amount, '', 0);
        //         await IHelper.CreateWin(data.userId, IAccount.cGameType, IAccount.cVender, data.gameId, data.roundId, data.Amount, '', data.TrnDescription, data.TransactionID, 0);
        //     }

        //     console.log('################################################## VIVO WIN');
        // }

    } else if( data.TrnType == 'CANCELED_BET') {

        //await ApiBetting.ProcessCancel('', iTransactionID, 0, '');
        //const processcancel = await IHelper.ProcessCancel('LIVE', IAccount.cVender, IVender.cGameType, '', '', data.userId, iGameID, iTransactionID, iRoundID, 'REFUND', '', iAmount, data.TrnDescription);
        //const processcancel = await IHelper.ProcessCancel(data.userId, IAccount.cGameType, IAccount.cVender, data.gameId, data.roundId, data.Amount, 0, data.TrnDescription, data.TransactionID, 0);

        await IHelper.ProcessCancel(data.userId, IAccount.cGameType, IAccount.cVender, data.TransactionID);
    }
    
    const newTransaction = await IHelper.GetBet(IAccount.cVender, data.TransactionID);
    if(newTransaction === null) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 302 });
        return res.header("Content-Type", "application/xml").send(result);
    }
    else// 해당 transaction이 존재하기 때문에 성공을 돌려준다.
    {
        const result = IHelperVivo.makeVivoXMLResult( data, {
            result: 'OK',
            ecSystemTransactionID: newTransaction.id,
            balance: user.iCash.toFixed(2),
        });
        return res.header("Content-Type", "application/xml").send(result);
    }

    // 올바른 검증을 위한 키
    // http://localhost:3033/vivo/changebalance?sessionId=cl1xj462y000iuy1zamwi86h1&userId=test2&Amount=2.00&TransactionID=2&TrnType=BET&TrnDescription=GameRound:TableID=1&roundId=1&gameId=1&History=127,15;129,50&isRoundFinished=false&hash=a83121a283c561718b97a7b41f4343b0
});

router.get('/status', async (req, res) => {
    
    console.log(`##################################################/vivo/status`);
    console.log(req.query);

    const data = req.method == 'GET' ? req.query : req.body;

    console.log(data);

    // userId, casinoTransactionId, hash 를 가져온다.
    if (data.userId === undefined || data.casinoTransactionId === undefined || data.hash === undefined) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 399 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // userId + casinoTransactionId, hash 를 검증한다.
    if (!IHelperVivo.verificationMD5Hash(data.userId+data.casinoTransactionId + IAccount.cPassKey, data.hash)) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 400 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // transitions table에서 해당 id를 찾는다.
    //const transaction = await db.transactionVivo.findOne({ where: { transactionid: data.casinoTransactionId } });
    const transaction = await IHelper.GetBet(IAccount.cVender, data.casinoTransactionId);
    if (transaction === null) {
        console.log('transaction is null!!!!!!!!!!!!!!!!!!!!!');
        const result = IHelperVivo.makeVivoXMLResult( data, { result: 'FAILED', code: 302 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    //console.log(transaction)

    // 해당 transaction이 존재하기 때문에 성공을 돌려준다.
    const result = IHelperVivo.makeVivoXMLResult( data, {
        result: 'OK',
        ecSystemTransactionID: transaction.id,
    })
    return res.header("Content-Type", "application/xml").send(result)

    // 올바른 검증을 위한 키
    // http://localhost:3033/vivo/status?userId=user&casinoTransactionId=334&hash=6a52dbdc66ad7c7fe49ae3831119a487    
});

router.get('/getbalance', async (req, res) => {
    
    console.log(`##################################################/vivo/getbalance`);
    console.log(req.query);

    const data = req.method == 'GET' ? req.query : req.body;

    console.log(data);

    // userId, hash 를 가져온다.
    if (data.userId === undefined || data.hash === undefined) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 399 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // userId, hash 를 검증한다.
    if (!IHelperVivo.verificationMD5Hash(data.userId + IAccount.cPassKey, data.hash)) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 400 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    // user table에서 해당 id를 찾는다.
    //const user = await db.Users.findOne({ where: { strID: data.userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user === null) {
        const result = IHelperVivo.makeVivoXMLResult( data, { result: 'FAILED', code: 310 })
        return res.header("Content-Type", "application/xml").send(result)
    }

    //console.log(user)

    // 해당 회원이 존재하기 때문에 성공을 돌려준다.
    const result = IHelperVivo.makeVivoXMLResult( data, {
        result: 'OK',
        balance: user.iCash.toFixed(2),
    })
    return res.header("Content-Type", "application/xml").send(result)

    // 올바른 검증을 위한 키
    // http://localhost:3033/vivo/getbalance?userId=user&hash=6f882d78a53ebdbb63b5d56d2aa9ea57

});


router.get('/getbalance2', async (req, res) => {

    console.log(`##################################################/vivo/getbalance`);
    console.log(req.query);

    const data = req.method == 'GET' ? req.query : req.body;

    console.log(data);

    // userId, hash 를 가져온다.
    if (data.userId === undefined || data.hash === undefined) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 399 })
        // return res.header("Content-Type", "application/xml").send(result);
        return res.json.send(result);
    }

    // userId, hash 를 검증한다.
    if (!IHelperVivo.verificationMD5Hash(data.userId + IAccount.cPassKey, data.hash)) {
        const result = IHelperVivo.makeVivoXMLResult(data, { result: 'FAILED', code: 400 })
        return res.json.send(result);
        // return res.header("Content-Type", "application/xml").send(result)
    }

    // user table에서 해당 id를 찾는다.
    //const user = await db.Users.findOne({ where: { strID: data.userId } });
    const user = await IHelper.GetUserFromID(IAccount.cVender, data.userId);
    if (user === null) {
        const result = IHelperVivo.makeVivoXMLResult( data, { result: 'FAILED', code: 310 })
        return res.json.send(result);
        // return res.header("Content-Type", "application/xml").send(result)
    }

    //console.log(user)

    // 해당 회원이 존재하기 때문에 성공을 돌려준다.
    const result = IHelperVivo.makeVivoXMLResult( data, {
        result: 'OK',
        balance: user.iCash.toFixed(2),
    })
    return res.json.send(result);
    // return res.header("Content-Type", "application/js").send(result)

    // 올바른 검증을 위한 키
    // http://localhost:3033/vivo/getbalance?userId=user&hash=6f882d78a53ebdbb63b5d56d2aa9ea57

});

module.exports = {router:router, GetGameURL:GetGameURL};
