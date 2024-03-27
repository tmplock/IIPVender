const express = require('express');
const router = express.Router();
const axios = require('axios');

const CryptoJS = require('crypto-js');
const { parseStringPromise } = require('xml2js');

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');
const {token} = require("mysql/lib/protocol/Auth");
const {parse} = require("dotenv");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const { default: axios2 } = require('axios');

const db = require('../db');
/*
Hello, please refer the “Seamless Wallet” guideline, and follow the guideline flow.
您好，附檔為單一錢包的 guideline，並參考對接流程。

下面是測試環境對接的相關資訊
Test Environment Info：

＊About API＊
API URL : https://api.cqgame.games
密鑰 API Token :
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NjAzN2EzYTc2ZWViMzc2ZDNmNjE3NWIiLCJhY2NvdW50IjoiVU9fZGV2X3N3Iiwib3duZXIiOiI2NjAzN2EzYTc2ZWViMzc2ZDNmNjE3NWIiLCJwYXJlbnQiOiJzZWxmIiwiY3VycmVuY3kiOiJLUlciLCJicmFuZCI6ImNxOSIsImp0aSI6Ijg4OTExOTE1NCIsImlhdCI6MTcxMTUwMzkzMCwiaXNzIjoiQ3lwcmVzcyIsInN1YiI6IlNTVG9rZW4ifQ.eZ3P8mwVPdeEAoXfH98_rnZWEdYcAjwp_IMOgiOA5CI

＊About Back-Office 報表後台＊
報表後台 BO URL : https://bo.cqgame.games
帳號 Account：UO_dev_sw
密碼 Password：qwer1234

※ Please refer to the document then adjust the interface which is the sample of "Error Code Response", please inform us for testing after integration:
※ 請參考下列Error code Response範例文檔調整接口，完成之後請通知我司測試:

[Probability & Table 機率和牌桌]
https://hackmd.io/juByNDpcQQytCFlDzYgK1Q?view

[Sport/Lotto 體育/彩票]
https://hackmd.io/lyROjTelQtG4sxpWtjJDag?view

※　Note: 
Please provide the following information for our testing API interface.
1.test agent account：
2.test player account：
3.wallet endpoint(Wurl)：
4.wallet token(Wtoken)：

※ 註：請提供以下資訊供我方測試API接口
1.測試代理帳號：
2.測試玩家帳號：
3.回調網址(Wurl)：
4.錢包密鑰(Wtoken)：
5.幣別：

In addition, the "Wurl" and Wtoken can be edited from back office.
另外錢包接口網址(Wurl)及Wtoken可自行在後台編輯

*/
let IAccount = 
{
    cVender: 'CQ9S',
    cCurrency: 'KRW',
    cAPIURL : 'https://api.cqgame.games',
    cAPIToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NjAzN2EzYTc2ZWViMzc2ZDNmNjE3NWIiLCJhY2NvdW50IjoiVU9fZGV2X3N3Iiwib3duZXIiOiI2NjAzN2EzYTc2ZWViMzc2ZDNmNjE3NWIiLCJwYXJlbnQiOiJzZWxmIiwiY3VycmVuY3kiOiJLUlciLCJicmFuZCI6ImNxOSIsImp0aSI6Ijg4OTExOTE1NCIsImlhdCI6MTcxMTUwMzkzMCwiaXNzIjoiQ3lwcmVzcyIsInN1YiI6IlNTVG9rZW4ifQ.eZ3P8mwVPdeEAoXfH98_rnZWEdYcAjwp_IMOgiOA5CI',
    cBOURL: 'https://bo.cqgame.games',
    cBOAddress : 'https://bo.cqgame.games',
    cBOID : 'UO_dev_sw',
    cBOPassword : 'qwer1234'
};

const EErrorCode = Object.freeze({
    "eSuccess":0, 
    "eGameActionError":1002, 
    "eParameterError":1003, 
    "eTimeFormatError":1004, 
    "eInsufficientBalance":1005, 
    "ePlayerNotFound":1006, 
    "eTransactionNotFound":1014, 
    "eSystemError":1100, 
});

let GetErrorCode = (strErr) => {

}

// let date = require('moment')('2020-06-05T08:59:45-04').format('YYYY-DD');
// let date2 = Date('2023-11-02T13:57:29.612Z');

const IsValidateDate = (strDate) => {

    const d = new Date(strDate);

    if (Object.prototype.toString.call(d) === "[object Date]") 
    {
        // it is a date
        if (isNaN(d)) 
        { // d.getTime() or d.valueOf() will also work
          // date object is not valid
            return false;
        } 
        else 
        {
          // date object is valid
          return true;
        }
    } 
    return false;
};
console.log(IsValidateDate('2020-06-05T08:59:45-04'));
console.log(IsValidateDate('2023-11-02T13:57:29.612Z'));

let GetTimeStampRFC3339 = () => {

    const cDate = new Date();
    const cCurrentDate = cDate.toISOString();

    return cCurrentDate;
}

let GetGameURL = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {

    const cToken = await IHelper.BuildToken(20);

    console.log(`GetGameURL : ${strAgentCode}`);
    console.log(cToken);
    
    if ( cToken != '' )
    {
        const strAgentID = `${strAgentCode}-${strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, strAgentCode, strSecretCode, strReturnURL);
        if ( bResult == true )
        {
            try {

                const objectData = {
                    account:strAgentID,
                    //gamehall:'motivation',
                    gamehall:'cq9',
                    gamecode:'GINKGO01',
                    gameplat:'web',
                    lang:'en',
                    session:'',
                    app:'N',
                    detect:'N'
                }
                console.log(objectData);

                const customAxios = axios2.create({});
                // const response = await customAxios.post('https://api.motivations.games/gameboy/player/sw/gamelink', objectData, {
                //     headers:{ 'Content-type': 'application/x-www-form-urlencoded', 'Authorization':IAccount.cAPIToken}});

                const response = await customAxios.post(`${IAccount.cAPIURL}gameboy/player/sw/gamelink`, objectData, {
                    headers:{ 'Content-type': 'application/x-www-form-urlencoded', 'Authorization':IAccount.cAPIToken}});

                
                console.log(response.data);

                if ( response.data.data == null )
                {
                    return {eResult:'Error', eCode:`${response.data.status.code}:${response.data.status.message}`};
                }
                else
                {
                    console.log(response.data.data);
                    console.log(response.data.data.url);
    
                    let objectData2 = {eResult:'OK', strURL:response.data.data.url, strID:strID, strToken:cToken};
                    return objectData2;
                }
                //if ( object)
                // console.log(response.data);
                // console.log(response.data.url);
                // if ( response.data.eResult == 'OK' )

                //     return {eResult:'OK', data:response.data};
                // else
                //     return {eResult:'Error', eCode:response.data.error};    
            }
            catch (error) {
                console.log('axios error', error);
                return {eResult:'Error', eCode:'axios'};
            }

            let objectData = {eResult:'OK', strURL:url, strID:strID, strToken:cToken};
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

router.get('/player/check/:account', async (req, res) => {

    console.log(`##################################################/cq9/player/check ${req.params.account}`);
    console.log(req.query);
    /**
     * req.params.account
     */

    let bFlag = false;
    const cCurrentDate = GetTimeStampRFC3339();

    if ( req.params.account == undefined )
    {
        bFlag = false;
    }
    else
    {
        console.log(`find user from Id ${req.params.account}`)

        let user = await IHelper.GetUserFromID(IAccount.cVender, req.params.account);
    
        if(user == null)
        {
            bFlag = false;
        }
        else 
        {
            bFlag = true;
        }
    }

    const objectData = {
        "data":bFlag,
        "status": {
            "code":"0",
            "message":"Success",
            "datetime":cCurrentDate
        }
    };

    console.log(`/checkapi`);
    console.log(objectData);

    res.status(200).send(objectData);
});

router.get('/transaction/balance/:account', async (req, res) => {

    console.log(`##################################################/cq9/transaction/balance ${req.params.account}`);
    console.log(req.query);
    /**
     * account : req.params.account
     * gamecode : query
     */

    const cCurrentDate = GetTimeStampRFC3339();
    let iBalance = 0;
    let eErrorCode = EErrorCode.SystemError;
    let objectRet = null;

    //if ( req.params.account == null || req.params.account == undefined || req.query.gamecode == null || req.query.gamecode == undefined )
    if ( req.params.account == undefined )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else
    {
        const user = await IHelper.GetUserFromID(IAccount.cVender, req.params.account);
        if ( user == null )
        {
            eErrorCode = EErrorCode.ePlayerNotFound;
        }
        else
        {
            iBalance = user.iCash;
            eErrorCode = EErrorCode.eSuccess;
            objectRet = {
                "balance":parseFloat(iBalance),
                "currency":IAccount.cCurrency
            };
        }
    }

    let objectData = {
        "data": objectRet,
        "status":{
            "code":eErrorCode.toString(),
            "message":"Success",
            "datetime":cCurrentDate
        }
    }

    //console.log(objectData);

    res.status(200).send(objectData);
});

router.post('/transaction/game/rollout', async (req, res) => {

    console.log(`##################################################/cq9/transaction/game/rollout`);
    console.log(req.body);
    /**
     * account
     * eventTime 
     * gamehall
     * gamecode
     * roundid
     * amount
     * mtcode
     * session (optional)
     */
    
    let iBalance = 0;
    let eErrorCode = EErrorCode.SystemError;
    const eType = 'LIVE';
    const cCurrentDate = GetTimeStampRFC3339();
    let objectRet = null;

    if ( req.body.account == undefined || req.body.eventTime == undefined || req.body.gamehall == undefined || req.body.gamecode == undefined 
        || req.body.roundid == undefined || req.body.amount == undefined || req.body.mtcode == undefined )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( parseFloat(req.body.amount) < 0 )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( false == IsValidateDate(req.body.eventTime) )
    {
        eErrorCode = EErrorCode.eTimeFormatError;
    }
    else
    {
        const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
        if ( transaction != null )
        {
            iBalance = transaction.strBalance;
            eErrorCode = EErrorCode.eSuccess;
            objectRet = {
                "balance":parseFloat(iBalance),
                "currency":IAccount.cCurrency
            };
        }
        else
        {
            let user = await IHelper.CheckUserFromID(IAccount.cVender, req.body.account);
            if ( user == null )
            {
                eErrorCode = EErrorCode.ePlayerNotFound;
            }
            else
            {
                const processbet = await IHelper.ProcessBet(req.body.account, eType, IAccount.cVender, req.body.gamehall, '', req.body.roundid, req.body.amount, 0, req.body.eventTime, req.body.mtcode, 0);

                if(processbet == null)
                {
                    eErrorCode = EErrorCode.eSystemError;
                }
                else
                {
                    //if ( user.iCash < parseFloat(req.body.amount) )
                    if ( processbet.iCash < 0 )
                    {
                        eErrorCode = EErrorCode.eInsufficientBalance;
                    }
                    else
                    {
                        iBalance = processbet.iCash;
                        eErrorCode = EErrorCode.eSuccess;
                        objectRet = {
                            "balance":parseFloat(iBalance),
                            "currency":IAccount.cCurrency
                        };
                    }
                }
            }
        }
    }

    let objectData = {
        "data": objectRet, 
        "status":{
            "code":eErrorCode.toString(),
            "message":"Success",
            "datetime":cCurrentDate
        }
    }
    res.status(200).send(objectData);
});

router.post('/transaction/game/rollin', async (req, res) => {

    console.log(`##################################################/cq9/transaction/game/rollin`);
    console.log(req.body);
    /**
     * account
     * eventTime
     * gamehall
     * gamecode
     * roundid
     * bet
     * win
     * roomfee (optional)
     * amount
     * mtcode
     * createTime
     * rake
     * gametype
     */
    let eErrorCode = EErrorCode.eSystemError;
    const eType = 'LIVE';
    let iBalance = 0;
    const cCurrentDate = GetTimeStampRFC3339();
    let objectRet = null;

    if ( req.body.account == undefined || req.body.eventTime == undefined || req.body.gamehall == undefined || req.body.gamecode == undefined || 
        req.body.roundid == undefined || req.body.amount == undefined || req.body.mtcode == undefined || req.body.account == undefined || 
        req.body.win == undefined || req.body.bet == undefined || req.body.createTime == undefined || req.body.gametype == undefined || req.body.rake == undefined )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( parseFloat(req.body.amount) < 0 )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( false == IsValidateDate(req.body.eventTime) || false == IsValidateDate(req.body.createTime))
    {
        eErrorCode = EErrorCode.eTimeFormatError;
    }
    else
    {
        const tokenuser = await db.Tokens.findOne({where:{strID:req.body.account}});
        if ( tokenuser == null )
        {
            eErrorCode = EErrorCode.ePlayerNotFound;
        }
        else
        {
            const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
            if ( transaction != null )
            {
                iBalance = transaction.strBalance;
                eErrorCode = EErrorCode.eSuccess;
                objectRet = {
                    "balance":parseFloat(iBalance),
                    "currency":IAccount.cCurrency
                };
            }
            else
            {
                const cWin = parseFloat(req.body.amount);
    
                //const processwin = await IHelper.ProcessWin(req.body.account, eType, IAccount.cVender, req.body.gamehall, req.body.roundid, cWin, 0, req.body.gamecode, req.body.mtcode, 0);
                const processwin = await IHelper.ProcessWin(req.body.account, eType, IAccount.cVender, req.body.gamehall, '', req.body.roundid, cWin, 0, req.body.createTime, req.body.mtcode, 0);
                if(processwin == null)
                {
                    eErrorCode = EErrorCode.eSystemError;
                }
                else
                {
                    let user = await IHelper.CheckUserFromID(IAccount.cVender, req.body.account);
                    if(user == null)
                    {
                        eErrorCode = EErrorCode.ePlayerNotFound;
                    }
                    else
                    {
                        iBalance = processwin.iCash;
                        eErrorCode = EErrorCode.eSuccess;
                        objectRet = {
                            "balance":parseFloat(iBalance),
                            "currency":IAccount.cCurrency
                        };
                    }
                }
            }
        }        
    }

    let objectData = {
        "data":objectRet,
        "status":{
            "code":eErrorCode.toString(),
            "message":"Success",
            "datetime":cCurrentDate
        }
    }
    res.status(200).send(objectData);
});

router.post('/transaction/game/debit', async (req, res) => {

    console.log(`##################################################/cq9/transaction/game/debit`);
    console.log(req.body);
    /**
     * account
     * eventTime
     * gamehall
     * gamecode
     * roundid
     * amount
     * mtcode
     */

    let iBalance = 0;
    let eErrorCode = EErrorCode.SystemError;
    const eType = 'LIVE';
    let user = null;
    const cCurrentDate = GetTimeStampRFC3339();
    let objectRet = null;

    if ( req.body.account == undefined || req.body.eventTime == undefined || req.body.gamehall == undefined || req.body.gamecode == undefined
        || req.body.roundid == undefined || req.body.amount == undefined || req.body.mtcode == undefined)
    {
        eErrorCode = EErrorCode.eParameterError;        
    }
    else if ( parseFloat(req.body.amount) < 0 )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( false == IsValidateDate(req.body.eventTime) )
    {
        eErrorCode = EErrorCode.eTimeFormatError;
    }
    else
    {
        const tokenuser = await db.Tokens.findOne({where:{strID:req.body.account}});
        if ( tokenuser == null )
        {
            eErrorCode = EErrorCode.ePlayerNotFound;
        }
        else
        {
            const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
            if ( transaction != null )
            {
                iBalance = transaction.strBalance;
                eErrorCode = EErrorCode.eSuccess;
                objectRet = {
                    "balance":parseFloat(iBalance),
                    "currency":IAccount.cCurrency
                };
            }
            else
            {
                const processbet = await IHelper.ProcessBet(req.body.account, eType, IAccount.cVender, req.body.gamehall, '', req.body.roundid, req.body.amount, 0, '', req.body.mtcode, 0);
                if(processbet == null)
                {
                    eErrorCode = EErrorCode.eSystemError;
                }
                else
                {
                    user = await IHelper.CheckUserFromID(IAccount.cVender, req.body.account);
                    if ( user == null )
                    {
                        eErrorCode = EErrorCode.ePlayerNotFound;
                    }
                    else
                    {
                        //if ( user.iCash < parseFloat(req.body.amount) )
                        if ( processbet.iCash < 0 )
                        {
                            eErrorCode = EErrorCode.eInsufficientBalance;
                        }
                        else
                        {
                            iBalance = processbet.iCash;
                            eErrorCode = EErrorCode.eSuccess;
                            objectRet = {
                                "balance":parseFloat(iBalance),
                                "currency":IAccount.cCurrency
                            };
                        }
                    }
                }
            }
        }        
    }

    let objectData = 
    {
        "data":objectRet,
        "status": {
          "code": eErrorCode.toString(),
          "message": "Success",
          "datetime": cCurrentDate
        }
    };
    res.status(200).send(objectData);
});

router.post('/transaction/game/credit', async (req, res) => {

    console.log(`##################################################/cq9/transaction/game/credit`);
    console.log(req.body);
    /**
     * account
     * eventTime
     * gamehall
     * gamecode
     * roundid
     * amount
     * mtcode
     */
    
    let eErrorCode = EErrorCode.eSystemError;
    const eType = 'LIVE';
    let iBalance = 0;
    const cCurrentDate = GetTimeStampRFC3339();
    let objectRet = null;

    if ( req.body.account == undefined || req.body.eventTime == undefined || req.body.gamehall == undefined || req.body.gamecode == undefined || 
        req.body.roundid == undefined || req.body.amount == undefined || req.body.mtcode == undefined )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( parseFloat(req.body.amount) < 0 )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( false == IsValidateDate(req.body.eventTime) )
    {
        eErrorCode = EErrorCode.eTimeFormatError;
    }
    else
    {
        const tokenuser = await db.Tokens.findOne({where:{strID:req.body.account}});
        if ( tokenuser == null )
        {
            eErrorCode = EErrorCode.ePlayerNotFound;
        }
        else
        {
            const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
            if ( transaction != null )
            {
                iBalance = transaction.strBalance;
                eErrorCode = EErrorCode.eSuccess;
                objectRet = {
                    "balance":parseFloat(iBalance),
                    "currency":IAccount.cCurrency
                };
            }
            else
            {
                const processwin = await IHelper.ProcessWin(req.body.account, eType, IAccount.cVender, 
                    req.body.gamehall, '', req.body.roundid, req.body.amount, 0, req.body.gamecode, req.body.mtcode, 0);
                if(processwin == null)
                {
                    eErrorCode = EErrorCode.eSystemError;
                }
                else
                {
                    let user = await IHelper.CheckUserFromID(IAccount.cVender, req.body.account);
                    if(user == null)
                    {
                        eErrorCode = EErrorCode.ePlayerNotFound;
                    }
                    else
                    {
                        iBalance = processwin.iCash;
                        eErrorCode = EErrorCode.eSuccess;
                
                        objectRet = {
                            "balance":parseFloat(iBalance),
                            "currency":IAccount.cCurrency
                        };
                    }
                }
            }
        }        
    }

    const objectData = {
        "data": objectRet,
        "status": {
          "code": eErrorCode.toString(),
          "message": "Success",
          "datetime": cCurrentDate
        }
    };
    res.status(200).send(objectData);
});

router.post('/transaction/user/payoff', async (req, res) => {

    console.log(`##################################################/cq9/transaction/game/payoff`);
    console.log(req.body);
    /**
     * account
     * eventTime
     * amount
     * mtcode
     * promoid (optional)
     * remark (optional)
     */

    let iBalance = 0;
    let eErrorCode = EErrorCode.eSystemError;
    const cCurrentDate = GetTimeStampRFC3339();
    const eType = 'LIVE';
    let objectRet = null;

    if ( req.body.account == undefined || req.body.eventTime == undefined || req.body.amount == undefined || req.body.mtcode == undefined )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( parseFloat(req.body.amount) < 0 )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    else if ( false == IsValidateDate(req.body.eventTime) )
    {
        eErrorCode = EErrorCode.eTimeFormatError;
    }
    else
    {
        const tokenuser = await db.Tokens.findOne({where:{strID:req.body.account}});
        if ( tokenuser == null )
        {
            eErrorCode = EErrorCode.ePlayerNotFound;
        }
        else
        {
            const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
            if ( transaction != null )
            {
                iBalance = transaction.strBalance;
                eErrorCode = EErrorCode.eSuccess;
                objectRet = {
                    "balance":parseFloat(iBalance),
                    "currency":IAccount.cCurrency
                };
            }
            else
            {
                const processwin = await IHelper.ProcessWin(req.body.account, eType, IAccount.cVender, 
                    'CQ9PayOff', '', req.body.promoid, req.body.amount, 0, req.body.remark, req.body.mtcode, 0);
                if(processwin == null)
                {
                    eErrorCode = EErrorCode.eSystemError;
                }
                else
                {
                    let user = await IHelper.CheckUserFromID(IAccount.cVender, req.body.account);
                    if(user == null)
                    {
                        eErrorCode = EErrorCode.ePlayerNotFound;
                    }
                    else
                    {
                        iBalance = processwin.iCash;
                        eErrorCode = EErrorCode.eSuccess;
                        objectRet = {
                            "balance":parseFloat(iBalance),
                            "currency":IAccount.cCurrency
                        };
                    }
                }
            }
        }        
    }

    const objectData = {
        "data": objectRet,
        "status": {
          "code": eErrorCode.toString(),
          "message": "Success",
          "datetime": cCurrentDate
        }
    };
    res.status(200).send(objectData);
});

// router.post('/transaction/game/refund', async (req, res) => {

//     console.log(`##################################################/cq9/transaction/game/refund`);
//     console.log(req.body);
//     /**
//      * mtcode
//      */
//     let iBalance = 0;
//     let eType = 'LIVE';
//     let eErrorCode = EErrorCode.eSystemError;
//     const cCurrentDate = GetTimeStampRFC3339();
//     let objectRet = null;

//     if ( req.body.mtcode == undefined )
//     {
//         eErrorCode = EErrorCode.eParameterError;
//     }
//     // else if ( false == IsValidateDate(req.body.eventTime) )
//     // {
//     //     eErrorCode = EErrorCode.eTimeFormatError;
//     // }
//     else
//     {
//         const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
//         if ( transaction != null )
//         {
//             iBalance = transaction.strBalance;
//             eErrorCode = EErrorCode.eSuccess;
//             objectRet = {
//                 "balance":parseFloat(iBalance),
//                 "currency":IAccount.cCurrency
//             };
//         }
//         else
//         {
//             const user = await IHelper.CheckUserFromTransactionID(IAccount.cVender, req.body.mtcode);
//             if ( user == null )
//             {
//                 eErrorCode = EErrorCode.eTransactionNotFound;
//             }
//             else
//             {
//                 const strAgentID = `${user.strAgentCode}-${user.strID}`;
        
//                 const processcancel = await IHelper.ProcessCancel(strAgentID, eType, IAccount.cVender, req.body.mtcode);
        
//                 if (processcancel != null) {
            
//                     if (user != null) {
//                         iBalance = processcancel.iCash;
//                         eErrorCode = EErrorCode.eSuccess;
//                         objectRet = {
//                             "balance":parseFloat(iBalance),
//                             "currency":IAccount.cCurrency
//                         };
//                     } else {
//                         eErrorCode = EErrorCode.ePlayerNotFound;
//                     }
//                 } else {
//                     eErrorCode = EErrorCode.eSystemError;
//                 }
//             }
//         }
//     }    

//     const objectData = {
//         "data":objectRet,
//         "status": {
//           "code": eErrorCode.toString(),
//           "message": "Success",
//           "datetime": cCurrentDate
//         }
//     }
//     res.status(200).send(objectData);
// });

router.post('/transaction/game/refund', async (req, res) => {

    console.log(`##################################################/cq9/transaction/game/refund`);
    console.log(req.body);
    /**
     * mtcode
     */
    let iBalance = 0;
    let eType = 'LIVE';
    let eErrorCode = EErrorCode.eSystemError;
    const cCurrentDate = GetTimeStampRFC3339();
    let objectRet = null;

    if ( req.body.mtcode == undefined )
    {
        eErrorCode = EErrorCode.eParameterError;
    }
    // else if ( false == IsValidateDate(req.body.eventTime) )
    // {
    //     eErrorCode = EErrorCode.eTimeFormatError;
    // }
    else
    {
        //const user = await IHelper.CheckUserFromTransactionID(IAccount.cVender, req.body.mtcode);
        const transaction = await db.transactions.findOne({where:{strTransactionID:req.body.mtcode}});
        //if ( user == null )
        if ( transaction == null )
        {
            eErrorCode = EErrorCode.eTransactionNotFound;
        }
        else if ( transaction.eType == 'REFUND' )   // it's already refunded
        {
            iBalance = transaction.strBalance;
            eErrorCode = EErrorCode.eSuccess;
            objectRet = {
                "balance":parseFloat(iBalance),
                "currency":IAccount.cCurrency
            };            
        }
        else
        {
            //const user = await IHelper.CheckUserFromTransactionID(IAccount.cVender, req.body.mtcode);
            const strAgentID = `${transaction.strAgentCode}-${transaction.strID}`;
    
            const processcancel = await IHelper.ProcessCancel(strAgentID, eType, IAccount.cVender, req.body.mtcode);
    
            if (processcancel != null) {
        
                iBalance = processcancel.iCash;
                eErrorCode = EErrorCode.eSuccess;
                objectRet = {
                    "balance":parseFloat(iBalance),
                    "currency":IAccount.cCurrency
                };

            } else {
                eErrorCode = EErrorCode.eSystemError;
            }
        }
    }    

    const objectData = {
        "data":objectRet,
        "status": {
          "code": eErrorCode.toString(),
          "message": "Success",
          "datetime": cCurrentDate
        }
    }
    res.status(200).send(objectData);
});

router.post('/rounddetails', async(req, res) => {

    console.log(`/cq9/rounddetails`);
    console.log(req.body);

    let objectData = 
    {
        roundid:'GINKGO231124140000074',
        account:'iip1-user2',
        gamecode:'GINKGO01',
        gamehall:'motivation',
        gametype:'',
    }

    const customAxios = axios2.create({});
    const response = await customAxios.get('https://api.motivations.cc/gameboy/order/detail/v2', objectData, {
        headers:{ 'Content-type': 'application/x-www-form-urlencoded', 'Authorization':IAccount.cAPIToken}});


    console.log(`/rounddetails`);
    console.log(response.data);

    res.send(response.data);

});

module.exports = {
    router:router,
    GetGameURL:GetGameURL
};