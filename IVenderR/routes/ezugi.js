const express = require('express');
const router = express.Router();
const axios = require('axios');

const moment = require('moment');

const CryptoJS = require('crypto-js');
const { parseStringPromise } = require('xml2js');

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');
const {token} = require("mysql/lib/protocol/Auth");
const {parse} = require("dotenv");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
/*
  For the following step, please read this document.
	You should follow column E inside the "Production Tables" tab to add the tables.
	https://docs.google.com/spreadsheets/d/1mNXcpCOvxaYLItgntft14Z8T6y738lgMwalPgjgJkSE/edit?ts=5f0c7156#gid=0

	These are the Production Lobby URL and the Production IPs that you should whitelist.
	Prod Lobby URL: https://play.livetables.io/auth/?
	Prod server IP:	52.211.45.101, 52.30.241.55
	
	This is the operatorID for IIP for our Production environment: 10752001

	This is the SignatureHashKey for your operatorID for the Production environment
	b328ca06-0d15-44d9-9fa7-be94c9b592ad
	Let me know when you wrote it down so I can delete it from this conversation.
*/
// //  ##### Staging
// let IAccount = 
// {
//     cVender: 'EZUGI',
//     cCurrency: 'KRW',
    
//     cAPIURL : 'https://play.thefunfeed.com/auth/',
//     cGameURL : 'https://play.thefunfeed.com/auth',
//     // cAPIURL : 'https://playint.tableslive.com/auth',
//     // cGameURL : 'https://playint.tableslive.com/auth',
//     cOperatorID : 10752001,
//     cSecretCode : 'rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=',
//     cLanguage: 'kr',
//     cIP:'',
//     SignatureHashKey: '281e37ce-a8a2-4e28-8854-57fc511e2f16',
//     cAPIUSER : 'IIPUser',
//     cAPIID : '10752001-a4e1e2c9',
//     cAPIAccess : '28c65b947b57b4ca405d3aea2152fce02a5542679049646770d0f09ae774939b'
// };

//  ##### Production
let IAccount = 
{
    cVender: 'EZUGI',
    cCurrency: 'KRW',
    cAPIURL : 'https://play.livetables.io/auth/',
    cGameURL : 'https://play.livetables.io/auth/',
    cOperatorID : 10752001,
    cSecretCode : 'rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=',
    cLanguage: 'kr',
    cIP:'',
    SignatureHashKey: 'b328ca06-0d15-44d9-9fa7-be94c9b592ad',
    cAPIUSER : 'IIPUser',
    cAPIID : '10752001-a4e1e2c9',
    cAPIAccess : '28c65b947b57b4ca405d3aea2152fce02a5542679049646770d0f09ae774939b'
};

let GetErrorCode = (eCode) => {

    switch ( eCode )
    {
        case 0: // Completed successfully
        case 1: // General error
        case 2: // Saved for future use (should not be used)
        case 3: // Insufficient funds
        case 4: // Operator limit to the player 1 (can be set as BetLimit/Session Limit/Loss limit etc)
        case 5: // Operator limit to the player 2 (can be set as BetLimit/Session Limit/Loss limit etc)
        case 6: // Token not found
        case 7: // User not found
        case 8: // User blocked
        case 9: // Transaction not found
        case 10: // Transaction timed out *Ezugi system can repeat the call if error code 10 is sent by operator with authentication, credit, and rollback responses according to operator’s retries settings. The debit transaction will be converted into a rollback transaction.
        case 11: // Real balance is not enough for tipping 
    }
}

let GetGameIDCodes = (eCode) => {

    switch ( eCode )
    {
        case 1: // Blackjack
        case 2: // Baccarat
        case 3: // Roulette
        case 4: // Bet on Numbers
        case 5: // Hybrid Blackjack
        case 6: // Keno
        case 7: // Automatic Roulette
        case 8: // Wheel of Dice
        case 9: // Sede
        case 10: // American Blackjack
        case 11: // American Hybrid Blackjack
        case 12: // Unlimited Blackjack
        case 13: // Lucky 7
        case 14: // Sic BO
        case 15: // Casino Hold’em
        case 16: // Bet on Teen Patti
        case 17: // Three Card Poker(NJ)/ Teen Patti
        case 18: // Roulette with JP
        case 19: // 32 Cards
        case 20: // Baccarat KO
        case 21: // Baccarat Super 6
        case 24: // Dragon Tiger
        case 25: // No Commission Baccarat
        case 26: // Baccarat Dragon Bonus
        case 27: // BaccaratQueenco
        case 28: // BaccaratPuntoBanco
        case 29: // RoulettePortomaso
        case 30: // Bet on Roulette
        case 31: // American Roulette
        case 32: // Triple Roulette
        case 38: // Andar Bahar
        case 39: // OTT Andar Bahar
        case 43: // One Day Teen Patti
        case 44: // Auto Sic Bo
        case 45: // Cricket War
        case 46: // BJ Salon Prive
        case 47: // Dream catcher (retail)
        case 48: // EZ Dealer Roulette
        case 49: // Live slots
        case 50: // One Day Teen Patti Back & Lay
        case 51: // Video Blackjack**
        case 52: // Ultimate Sic Bo
        case 53: // Royal Poker
        case 54: // Ultimate Roulette
        case 55: // Ultimate Andar Bahar
        return true; // if eCode matches any of the cases, return true
        default:
            return false; // if not, return false
    }
}

let GetDebitBetTypeID = (eCode) => {

    switch ( eCode )
    {
        case 1: //  General Bet, Poker Games, Royal Poker Games, Ultimate Roulette
        case 3: //
        case 4: // Blackjack
        case 5:
        case 6:
        case 24:    // Poker Games (Holdem, Teen Patti, Three Card Poker)
        case 8:     // Royal Poker Games
        case 9:     // 
        case 10:
        case 11:
        case 24:    //  Ultimate Roulette
        return true; // if eCode matches any of the cases, return true
        default:
            return false; // if not, return false
    }
}

let GetCreditBetTypeID = (eCode) => {

    switch ( eCode )
    {
        case 101: //  General Bet, Poker Games, Royal Poker Games, Ultimate Roulette
        case 103: //
        case 104: // Blackjack
        case 105:
        case 106:
        case 124:    // Poker Games (Holdem, Teen Patti, Three Card Poker)
        case 108:     // Royal Poker Games
        case 109:     // 
        case 110:
        case 111:
        case 124:    //  Ultimate Roulette
    }
}

let GetGameCodeFromBettingTarget = (strBetType) => {

    return IEnum.EGameCode.Baccarat;
}

// let GetTarget = (strBetType) => {

//     console.log(`##### GetBetType : ${strBetType}`);

//     return IEnum.EBettingAccount.Baccarat;
// }

let objectT = {debitAmount:50000};
objectT.debitAmount = objectT.debitAmount.toFixed(2);
let test = JSON.stringify(objectT);

let HashStringModify = (str, strToken) => {

    let index = str.indexOf(strToken);
    if ( index == -1 )
        return str;

    let strRet = str.substring(0, index);

    let iNumQuotes = 0;
    let bCalculate = true;

    for ( let i = index; i < str.length; ++ i )
    {
        if ( bCalculate == true )
        {
            if ( str[i] == '}' )
                bCalculate = false;
            if ( str[i] == '"' )
                iNumQuotes ++;
            if ( (iNumQuotes == 2 || iNumQuotes == 3) && str[i] == '"' )
                continue;
        }
        strRet += str[i];
    }
    
    return strRet;
}

console.log(test);
console.log(typeof test);
const test2 = HashStringModify(test, 'debitAmount');
console.log(test2);
console.log(typeof test2);

let GetGameURL = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {

    const cLaunchToken = await IHelper.BuildToken(20);
    const cToken = await IHelper.BuildToken(20);
    
    if ( cToken != '' )
    {
        const strAgentID = `${strAgentCode}-${strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, cLaunchToken, strAgentCode, strSecretCode, strReturnURL);
        if ( bResult == true )
        {
            const url = `${IAccount.cGameURL}/?token=${cLaunchToken}&operatorId=${IAccount.cOperatorID}&language=ko`;

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

let EqualHashKey = (req, strToken) => {
    const hashValue = req.headers['hash'] || req.get('hash');
    if (hashValue == null || hashValue == '') {
        return false;
    }
    console.log("hashValue : " + hashValue);
    console.log(req.body);
    const trimmedBody = deepTrim(req.body);
    let requestBodyString = JSON.stringify(trimmedBody, (key, value) => {
        if ( key === strToken )
        {
            // // 값이 정수인지 확인하고, 소수점 형태로 변환
            // if (Number.isInteger(value)) {
            //     return value.toString();
            // } else {
                return parseFloat(value).toFixed(2);
//            }
        }
        return value;
    });
    //let requestBodyString = JSON.stringify(trimmedBody);
    // console.log(requestBodyString);
    requestBodyString=  HashStringModify(requestBodyString, strToken);
    console.log(requestBodyString);
    var hash = CryptoJS.HmacSHA256(requestBodyString, IAccount.SignatureHashKey);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    console.log("hashInBase64 : " + hashInBase64);

    if ( hashValue == hashInBase64 )
    {
        console.log(`####################################################################################################`);
        console.log(`HASH VALUE IS SAME`);
    }
    else 
    {
        console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
        console.log(`HASH VALUE IS DIFFERENT`);        
    }

    return hashValue == hashInBase64;
}

let deepTrim = (obj) => {
    if (typeof obj == 'string') {
        return obj.replace(/\s+/g, ''); // 모든 공백을 제거
    } else if (Array.isArray(obj)) {
        return obj.map(item => deepTrim(item));
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(
                ([key, value]) => [key, deepTrim(value)]
            )
        );
    }
    return obj;
}

let compareTransactionIds = (debitTransactionId, transactionId) =>{
     // 두 id의 길이가 같지 않으면 false 반환
     if(debitTransactionId.length !== transactionId.length) return false;

     // 첫 번째 문자를 제외한 나머지 부분을 추출
     const substringId1 = debitTransactionId.substring(1);
     const substringId2 = transactionId.substring(1);
 
     // 두 문자열이 같으면 true, 다르면 false 반환
     return substringId1 == substringId2;
}

router.post('/authentication', async (req, res) => {

    console.log(`##################################################/ezugi/authentication`);
    console.log(req.body);
    /**
     * operatorId (INT11)
     * token (launch token)
     * platformId (INT10) 0 (Desktop) 2 (SmartPhone) 3 (Tablet)
     * timestamp (LONG)
     */
    let errorCode = 0;
    let errorDescription = 'OK';
    let strAgentID = '';
    let balance = 0;
    let strIP = '';
    let strNickname = '';

    //EqualHashKey(req);

    if (!EqualHashKey(req, 'None'))
    {
        errorCode = 1;
        errorDescription = 'Invalid Hash';
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            balance:balance,
            errorCode:errorCode,
            errorDescription:errorDescription,
            timestamp:IHelper.GetUnixTimeStamp()
        };
        res.send(ret);

        console.log(`##### Error 1`);
        return;
    }

    //const user = await IHelper.GetUserFromToken(IAccount.cVender, req.body.token);
    const user = await IHelper.GetUserFromLaunchToken(IAccount.cVender, req.body.token);
    if(user == null)
    {
        errorCode = 6;
        errorDescription = 'Token not found';

        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            balance:balance,
            errorCode:errorCode,
            errorDescription:errorDescription,
            timestamp:IHelper.GetUnixTimeStamp()
        };
        res.send(ret);
        console.log(`##### Error 2`);
        return;
    }
    else 
    {
        // const cToken = await IHelper.BuildToken(20);
        // strAgentID = `${user.strAgentCode}-${user.strID}`;
        // await IHelper.SetTokenIAuth(strAgentID,cToken);
        balance = parseFloat(user.iCash);
        strIP = user.strIP;
        strNickname = user.strNickname;

        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            //uid:strAgentID,
            uid:user.strAgentID,
            nickName:strNickname,
            token:user.strToken,
            language:IAccount.cLanguage,
            playerTokenAtLaunch:req.body.token,
            balance:balance,
            currency:IAccount.cCurrency,
            clientIP:strIP,
            VIP:'0',//till 5
            errorCode:errorCode,
            errorDescription:errorDescription,
            timestamp:IHelper.GetUnixTimeStamp()
        };
        res.send(ret);

        console.log(`##### Error 4`);
    }
});

router.post('/debit', async (req, res) => {
    
    console.log(`##################################################/ezugi/debit`);
    console.log(req.body);
    /**
     * serverId : INT(11)
     * operatorId : INT(11)
     * token : VARCHAR(250), session token
     * uid : VARCHAR(50), strID
     * transactionId : CHAR(50), 
     * roundId : BIGINT(18)
     * gameId : TINYINT(4)
     * tableId : INT(11)
     * currency : 
     * debitAmount : DOUBLE(25,2)
     * betTypeID : TINYINT(4)
     * seatId : VARCHAR(10)
     * platformId : INT(10)
     * timestamp : LONG
    */

    let errorCode = 0;
    let errorDescription = 'OK';
    let balance = 0;
    let strNickname = '';

    const eType = 'LIVE';

    //EqualHashKey(req);
    let user = await IHelper.GetUserFromID(IAccount.cVender, req.body.uid);
    if(user == null)
    {
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            uid:req.body.uid,
            roundId:req.body.roundId,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:7,
            errorDescription:'User not found',
            timestamp:IHelper.GetUnixTimeStamp()
        }
        res.send(ret);

        console.log(`##### Error 1`);
        return;
    }
    const debitAmount2 = parseFloat(req.body.debitAmount);
    const balance2 = parseFloat(user.iCash);
    if (balance2 < debitAmount2) {
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            roundId:req.body.roundId,
            uid:req.body.uid,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:3,
            errorDescription:'Insufficient funds',
            timestamp:IHelper.GetUnixTimeStamp()
        }
        res.send(ret);
        
        console.log(`##### Error 2`);
        return;
    }

    if (!EqualHashKey(req, 'debitAmount'))
    //if (!EqualHashKey(req, 'None'))
    {
        errorCode = 1;
        errorDescription = 'Invalid Hash';
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            uid:req.body.uid,
            roundId:req.body.roundId,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:errorCode,
            errorDescription:errorDescription,
            timestamp:IHelper.GetUnixTimeStamp()
        };
        res.send(ret);

        console.log(`##### Error 3`);
        return;
    }

    if(!GetGameIDCodes(req.body.gameId))
    {
        errorCode = 1;
        errorDescription = 'Unknown Game ID';
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            uid:req.body.uid,
            roundId:req.body.roundId,
            token:req.body.token,//session token
            balance:parseFloat(user.iCash),
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:errorCode,
            errorDescription:errorDescription,
            timestamp:IHelper.GetUnixTimeStamp()
        };
        res.send(ret);

        console.log(`##### Error 4`);
        return;
    }
    else if(!GetDebitBetTypeID(req.body.betTypeID))
    {
        errorCode = 1;
        errorDescription = 'Invalid Bet Type';
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            uid:req.body.uid,
            roundId:req.body.roundId,
            token:req.body.token,//session token
            balance:parseFloat(user.iCash),
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:errorCode,
            errorDescription:errorDescription,
            timestamp:IHelper.GetUnixTimeStamp()
        };
        res.send(ret);

        console.log(`##### Error 5`);
        return;
    }
    //else if (user.ezugiToken != req.body.token) {
    else if ( user.strToken != req.body.token ) 
    {
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            uid:req.body.uid,
            roundId:req.body.roundId,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:6,
            errorDescription:'Token not found',
            timestamp:IHelper.GetUnixTimeStamp()
        }
        res.send(ret);

        console.log(`##### Error 6`);

        console.log(user);
        console.log(req.body);
        return;
    }

    strNickname = user.strNickname;
    balance = parseFloat(user.iCash);

    const debitAmount = parseFloat(req.body.debitAmount);
    if (debitAmount < 0) {
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            roundId:req.body.roundId,
            uid:req.body.uid,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:1,
            errorDescription:'Negative amount',
            timestamp:IHelper.GetUnixTimeStamp()
        }
        res.send(ret);

        console.log(`##### Error 7`);
        return;
    }

    // check Insufficient funds(11)
    if (balance < debitAmount) {
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            roundId:req.body.roundId,
            uid:req.body.uid,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:3,
            errorDescription:'Insufficient funds',
            timestamp:IHelper.GetUnixTimeStamp()
        }
        res.send(ret);

        console.log(`##### Error 8`);
        return;
    }

    let strTime = new moment().format('YYYY-MM-DD HH:mm:ss');
    //const strTransactionID = await IHelper.GetBet(IAccount.cVender, req.body.transactionId);

    const transaction = await IHelper.FindDB(req.body.transactionId);

    if (transaction == null)
    {
        const processbet = await IHelper.ProcessBet2(req.body.uid, eType, IAccount.cVender, req.body.gameId, req.body.tableId, req.body.roundId, req.body.debitAmount, 0, req.body.tableId, req.body.transactionId, 0);

        if(processbet == null)
        {
            errorCode = 1;
            errorDescription = 'Negative amount';
        }
        else
        {
            // user = await IHelper.GetUserFromID(IAccount.cVender, req.body.uid);
            // balance = parseFloat(user.iCash);
            balance = processbet.iCash;
            strTime = processbet.createdAt;
        }
    }
    else
    {
        if (transaction.eState == 'EXCEPTION')
        {
            console.log(`Debit after Rollback(7)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            errorCode = 1;
            errorDescription = 'Debit after rollback';
        }
        else
        {
            console.log(`Transaction has already processed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            errorCode = 0;
            errorDescription = 'Transaction has already processed';
        }
    }

    let ret = {
        operatorId:parseInt(IAccount.cOperatorID),
        roundId:req.body.roundId,
        uid:req.body.uid,
        nickname:strNickname,
        token:req.body.token,//session token
        balance:balance,
        transactionId:req.body.transactionId,
        currency:IAccount.cCurrency,
        bonusAmount:0,
        errorCode:errorCode,
        errorDescription:errorDescription,
        timestamp:IHelper.GetUnixTimeStamp()
    }

    console.log(`##### /ezugi/debig`);
    console.log(ret);

    res.send(ret);
});

router.post('/rollback', async (req, res) => {

    console.log(`##################################################/ezugi/rollback`);
    console.log(req.body);
    /**
     * serverId : INT(11)
     * operatorId : INT(11)
     * token : VARCHAR(250)
     * uid : VARCHAR(50)
     * transactionId : CHAR(50)
     * roundId : BIGINT(18)
     * gameId : TINYINT(4)
     * tableId : INT(11)
     * currency : CHAR(4)
     * rollbackAmount : DOUBLE(25,2)
     * seatId : VARCHAR(10)
     * platformId : INT(10)
     * timestamp : LONG
     */
    let errorCode = 0;
    let errorDescription = 'ok';
    let balance = 0;

    const eType = 'LIVE';
    const cGameType = 'LIVEGAMES';
    const cAmount = parseFloat(req.body.rollbackAmount);

    const user = await IHelper.GetUserFromID(IAccount.cVender, req.body.uid);
    if (user == null)
    {
        let ret = {
            operatorId:parseInt(IAccount.cOperatorID),
            uid:req.body.uid,
            roundId:req.body.roundId,
            token:req.body.token,//session token
            balance:balance,
            transactionId:req.body.transactionId,
            currency:IAccount.cCurrency,
            errorCode:7,
            errorDescription:'User not found',
            timestamp:IHelper.GetUnixTimeStamp()
        }
        res.send(ret);
        return;
    }
    balance = parseFloat(user.iCash);

    //const bet = await IHelper.GetBet(IAccount.cVender, req.body.transactionId);
    const bet = await IHelper.FindDB(req.body.transactionId);
    if (bet != null) {
        const fBetAmount = parseFloat(bet.strAmount);

        if (fBetAmount != cAmount) {
            errorCode = 1;
            errorDescription = 'Invalid amount';

            let ret = {
                operatorId:parseInt(IAccount.cOperatorID),
                roundId:req.body.roundId,
                uid:req.body.uid,
                nickname:user.strNickname,
                token:req.body.token,
                balance:balance,
                transactionId:req.body.transactionId,
                currency:req.body.currency,
                errorCode:errorCode,
                errorDescription:errorDescription,
                timestamp:IHelper.GetUnixTimeStamp()
            }
            res.send(ret);
            return;

        } else if (bet.eType == 'REFUND') {
            errorCode = 0;
            errorDescription = 'Transaction already processed';

            let ret = {
                operatorId:parseInt(IAccount.cOperatorID),
                roundId:req.body.roundId,
                uid:req.body.uid,
                nickname:user.strNickname,
                token:req.body.token,
                balance:balance,
                transactionId:req.body.transactionId,
                currency:req.body.currency,
                errorCode:errorCode,
                errorDescription:errorDescription,
                timestamp:IHelper.GetUnixTimeStamp()
            }
            res.send(ret);
            return;

        } else {
            //const processcancel = await IHelper.ProcessCancel(req.body.uid, eType, IAccount.cVender, req.body.transactionId);
            const processcancel = await IHelper.ProcessCancel2(req.body.uid, req.body.transactionId);

            if (processcancel != null) {

                if (user != null) {
                    balance = parseFloat(processcancel.iCash);
                } else {
                    errorCode = 7;
                    errorDescription = 'User not found';
                }
            } else {
                errorCode = 1;
                errorDescription = 'Negative amount';
            }
        }
    }
    else
    {
        //await IHelper.ProcessException2(req.body.uid, eType, IAccount.cVender, req.body.gameId, '', req.body.roundId, req.body.debitAmount, 0, '', req.body.transactionId, 0);
        errorCode = 9;
        errorDescription = 'Transaction not found'
    }

    let ret = {
        operatorId:parseInt(IAccount.cOperatorID),
        roundId:req.body.roundId,
        uid:req.body.uid,
        nickname: user.strNickname,
        token:req.body.token,
        balance:balance,
        transactionId:req.body.transactionId,
        currency:req.body.currency,
		bonusAmount:0,
        errorCode:errorCode,
        errorDescription:errorDescription,
        timestamp:IHelper.GetUnixTimeStamp()
    }
    res.send(ret);
});

// setInterval(() => {

//     console.log(IHelper.GetUnixTimeStamp());
// }, 1000);

let GetTarget = (objectBet, objectWin) => {

    let listBetKey = Object.keys(objectBet);
    let listBetValue = Object.values(objectBet);

    let listWinKey = Object.keys(objectWin);
    let listWinValue = Object.values(objectWin);

    let list = {}

    for ( let i in listBetKey )
    {
        switch ( listBetKey[i] )
        {
            case 'PlayerBet':
                list[listBetKey[i]] = {iGameCode:0, iTarget:IEnum.EBetType.Player, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerBet':
                list[listBetKey[i]] = {iGameCode:0, iTarget:IEnum.EBetType.Banker, iBet:listBetValue[i], iWin:0};
                break;
            case 'TieBet':
                list[listBetKey[i]] = {iGameCode:0, iTarget:IEnum.EBetType.Tie, iBet:listBetValue[i], iWin:0};
                break;
            case 'PlayerPair':
                list[listBetKey[i]] = {iGameCode:0, iTarget:IEnum.EBetType.PlayerPair, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerPair':
                list[listBetKey[i]] = {iGameCode:0, iTarget:IEnum.EBetType.BankerPair, iBet:listBetValue[i], iWin:0};
                break;

            case 'PlayerOver':
                list[listBetKey[i]] = {iGameCode:100, iTarget:IEnum.EBetType.PlayerOver, iBet:listBetValue[i], iWin:0};
                break;
            case 'PlayerUnder':
                list[listBetKey[i]] = {iGameCode:100, iTarget:IEnum.EBetType.PlayerUnder, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerOver':
                list[listBetKey[i]] = {iGameCode:100, iTarget:IEnum.EBetType.BankerOver, iBet:listBetValue[i], iWin:0};
                break;
            case 'BankerUnder':
                list[listBetKey[i]] = {iGameCode:100, iTarget:IEnum.EBetType.BankerUnder, iBet:listBetValue[i], iWin:0};
                break;

            default:
                list[listBetKey[i]] = {iGameCode:0, iTarget:IEnum.EBetType.LiveCasino, iBet:listBetValue[i], iWin:0};
        }
    }

    for ( let i in listWinKey )
    {
        list[listWinKey[i]].iWin = listWinValue[i];
    }

    let listFinal = [];

    for ( let i in list )
    {
        listFinal.push({C:list[i].iGameCode, T:list[i].iTarget, B:list[i].iBet, W:list[i].iWin});
    }

    return listFinal;
}

let GetCards = (banker, player) => {
    // {'P':[{'C':'KC', 'N':'10'},{'C':'Ah','N':'11'},{'C':'9c','N':'9'}],'B':[{'C':'Qd','N':'10'},{'C':'6s','N':'6'}]} 형태로 만듬
    try {
        let blist = [];
        for (let i in banker) {
            blist.push({
                'C':`${banker[i].CardName}`,
                'N':`${banker[i].CardValue}`
            });
        }

        let plist = [];
        for (let i in player) {
            plist.push({
                'C':`${player[i].CardName}`,
                'N':`${player[i].CardValue}`
            });
        }
        if (blist.length > 0 && plist.length > 0) {
            return {'B': blist, 'P': plist};
        }
    } catch (err) {
    }
    return null;
}

router.post('/credit', async (req, res) => {
    
    console.log(`##################################################/ezugi/credit`);
    console.log(req.body);

    let strResult = '';
    let strDetail = '';
    if ( req.body.gameDataString != undefined && req.body.gameDataString != '' )
    {
        const rd = JSON.parse(req.body.gameDataString);
        console.log(rd);
    
        const listDetail = GetTarget(rd.BetsList, rd.WinningBets);
        console.log(`##### listDetail`);
        console.log(listDetail);
        const listResult = GetCards(rd.PlayerCards, rd.BankerCards);
        console.log(`##### listResult`);
        console.log(listResult);

        strDetail = JSON.stringify(listDetail);
        console.log(strDetail);
        strResult = JSON.stringify(listResult);
        console.log(strResult);
    }

    /** Array
     * serverId : INT(11)
     * operatorId : INT(11)
     * token : VARCHAR(250)
     * uid : VARCHAR(50)
     * transactionId : CHAR(50)
     * debitTransactionId : CHAR(50)
     * roundId : BIGINT(18)
     * gameId : TINYINT(4)
     * tableId : INT(11)
     * betTypeID : VARCHAR(3)
     * currency : CHAR(4)
     * creditAmount : DOUBLE(25.2)
     * returnReason : TINYINT(14)
     * isEndRound : BOOL
     * gameDataString : JSON
     * seatId : VARCHAR(10)
     * creditIndex : VARCHAR(10)
     * platformId : INT(10)
     * timestamp : LONG
    */

    let errorCode = 0;
    let errorDescription = 'ok';
    let balance = 0;    

    const eType = 'LIVE';
    const cGameType = 'LIVEGAMES'
    const cWinAmount = req.body.creditAmount;

    const returnReason = req.body.returnReason;
    let bet;
    let user = await IHelper.GetUserFromID(IAccount.cVender, req.body.uid);
    balance = parseFloat(user.iCash);
    if (!req.body.hasOwnProperty('debitTransactionId') || req.body.debitTransactionId == null || req.body.debitTransactionId == '')
    {
        errorCode = 9;
        errorDescription = 'Debit transaction ID not found';
        let ret = {
            operatorId: parseInt(IAccount.cOperatorID),
            roundId: req.body.roundId,
            uid: req.body.uid,
            token: req.body.token,
            balance: balance,
            transactionId: req.body.transactionId,
            currency: req.body.currency,
            bonusAmount: 0,
            errorCode: errorCode,
            errorDescription: errorDescription,
            timestamp: IHelper.GetUnixTimeStamp()
        }
        res.send(ret);
        return;
    }
    // bet = await IHelper.GetBet(IAccount.cVender, req.body.debitTransactionId);
    // const win = await IHelper.GetWin(IAccount.cVender, req.body.debitTransactionId);

    bet = await IHelper.FindDB(req.body.debitTransactionId);
    //const win = await IHelper.GetWin(IAccount.cVender, req.body.debitTransactionId);


    console.log(`cVender : ${IAccount.cVender}`);
    console.log(`req.body.transactionId : ${req.body.transactionId}`);
    console.log(`bet : ${bet}`);
    let strTime = new moment().format('YYYY-MM-DD hh:mm:ss');
    if (bet == null)
    {
        console.log(`9 Transaction not found`);
        errorCode = 9;
        errorDescription = 'Transaction not found'
    }
    else if(!compareTransactionIds(req.body.debitTransactionId,req.body.transactionId)){
        errorCode = 1;
        errorDescription = 'Debit transaction already processed';
    }
    // else if(win != null)
    // {
    //     errorCode = 0;
    //     errorDescription = 'Transaction already processed';
    // }
    // else if(bet.eState == 'PENDING' )
    // {
    //     errorCode = 1;
    //     errorDescription = 'Debit transaction already processed';
    // }
    else if (bet.eType == 'REFUND')
    {
        errorCode = 1;
        errorDescription = 'Debit transaction already processed';
    }
    else if (returnReason == 1 || returnReason == 2)
    {
        //const processcancel = await IHelper.ProcessCancel(req.body.uid, eType, IAccount.cVender, req.body.debitTransactionId);
        const processcancel = await IHelper.ProcessCancel2(req.body.uid, req.body.debitTransactionId);

        if (processcancel == null)
        {
            errorCode = 1;
            errorDescription = 'Negative amount';
        }
        else
        {
            //strTime = processcancel.createdAt;
        }
    }
    else if (returnReason == 0)
    {
        //const processwin = await IHelper.ProcessWin(req.body.uid, eType, IAccount.cVender, req.body.gameId, req.body.roundId, req.body.creditAmount, 0, req.body.debitTransactionId, req.body.transactionId, 0);
        const processwin = await IHelper.ProcessWin2(req.body.uid, eType, IAccount.cVender, req.body.gameId, req.body.tableId, req.body.roundId, req.body.creditAmount, strDetail, strResult, req.body.transactionId, 0);

        if(processwin == null)
        {
            errorCode = 1;
            errorDescription = 'Negative amount';
        }
        else
        {
            strTime = processwin.createdAt;
            balance = processwin.iCash;
        }
    }

    // user = await IHelper.GetUserFromID(IAccount.cVender, req.body.uid);
    // if(user == null)
    // {
    //     errorCode = 7;
    //     errorDescription = 'User not found';
    // }
    // else
    // {
    //     balance = parseFloat(user.iCash);
    // }


    let ret = {
        operatorId: parseInt(IAccount.cOperatorID),
        roundId: req.body.roundId,
        uid: req.body.uid,
        nickname:user.strNickname,
        token: req.body.token,
        balance: balance,
        transactionId: req.body.transactionId,
        currency: req.body.currency,
        bonusAmount: 0,
        errorCode: errorCode,
        errorDescription: errorDescription,
        timestamp: IHelper.GetUnixTimeStamp()
    }

    console.log(`########## EZUGI CREDIT : balance : ${balance}`);

    res.send(ret);
});

router.get('/reports', async (req, res) => {
    console.log("====================================ezugi/reports (get)");
    console.log(req.query)
    // const Ezugi = new EzugiClientAPI();
    // const params = {
    //   DataSet: "game_rounds",
    //   TimePeriod: "7",
    //   Limit: "50",
    //   Page: "1",
    //   Format: "xml",
    //   Compression: "4"
    // };
  
    // const result = await Ezugi.get(params);
    // res.json(result);
  });
  

module.exports = {
    router:router,
    GetGameURL:GetGameURL
};