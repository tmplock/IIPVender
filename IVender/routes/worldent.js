/*
7.2.List of Currencies
Currency Code Currency Name Currency Ratio
AUD Australian Dollar 1:1
ARS Argentina Piso 1:1
BRL Brazilian Real 1:1
CAD Canadian Dollar 1:1
CLP Chilean Peso 1:1
COP Colombia Picasso 1:1
RMB Chinese Yuan 1:1
RUB Russia Ruble 1:1
EUR European Euro 1:1
GBP Pound Sterling 1:1
INR Indian Rupee 1:1
JPY Japanese Yen 1:1
JPY100 Japanese Yen 100:1
JPY1000 Japanese Yen 1000:1
KRW South Korean Won 1:1
KRW1000 South Korean Won 1:1000
MMK Myanmar Kyat 1:1000
MMK1 Myanmar Kyat 1:1
MXN Mexican Peso 1:1
MYR Malaysian Ringgit 1:1
SGD Singapore Dollar 1:1
Copyright © 2021 World Entertainment page 32
THB Thai Baht 1:1
TRY Turkey Lira 1:1
USD United States Dollar 1:1
USD10 United States Dollar 10:1
VND Vietnamese Dong 1:1000
VND1 Vietnamese Dong 1:1
IDR Indonesia Rupiah 1:1000
IDR1 Indonesia Rupiah 1:1
TWD Taiwan Dollar 1:1
TWD100 Taiwan Dollar 100:1
TWD1000 Taiwan Dollar 1000:1
ZAR South African Rand 1:1
HKD HSBC 1:1

7.3.Bet Status Description
Code Description
new Bet Has Been Placed
complete Already payout
cancel Transaction Has Been Canceled
processing processing

7.4.Language Parameter Description
Parameter Language
en English
zh Traditional Chinese
cn Simplified Chinese
th Thai
vi Vietnamese
ko Korean
ja Japan

7.5.Game Category Description
Code Description
Live Live Games
Lottery Lottery Games
Electronic Electronic Games
Sportbook Sports Betting
Chess Chess Game
Blockchain Blockchain Games

7.6.Game Type Description
Code Description
BAC Classic Baccarat
BAS Speed Baccarat
BAM Squeeze Baccarat
DT Dragon Tiger
DI Sic-bo
RO Roulette
LW Lucky Wheel
ROL GOF Roulette
DIL GOF Sic-bo
RC Racing
LO Lottery
BAB Blockchain Baccarat
DTB Blockchain Dragon Tiger
BAMB Blockchain Squeeze Baccarat
BASB Blockchain Speed Baccarat
LWB Blockchain Lucky Wheel
DIB Blockchain Sic-bo
ROB Blockchain Roulette
OXB Blockchain Bull Bull
ZJHB Blockchain Win Three Cards
BAA Traditional Baccarat
Copyright © 2021 World Entertainment page 35
DTS Speed Dragon Tiger
BAL GOF Baccarat
*/

const express = require('express');
const router = express.Router();

// const ApiHelper = require('../helpers/ApiHelper')
// const ApiBetting = require('../helpers/ApiBetting')
// const db = require('../models');

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// const path = require('path');
// router.use(express.static(path.join(__dirname, '../', 'public')));

// const { isLoggedIn, isNotLoggedIn } = require('./middleware');
// const { route } = require('express/lib/application');
const db = require('../db');

let GetTransactionNumber = async () => {

    // let strDate = ITime.GetDateStampPure();
    //let strToken = await IHelper.BuildToken(9);

    // return `${strDate}${strToken}`;

    //return 

    //return Math.floor(Math.random()*10000000000).toString();
    let str = await IHelper.BuildToken(16);
    return str;
}

let tryRequest = async (maxRetries, fn) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.log(`Attempt ${i + 1} failed. Retrying after 30 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 30000));  // Wait for 30 seconds
        }
    }
    throw new Error('Internal Server Error');
}

let GetGameCodeFromGameID = (strGameID) => {

    const listGameCodes = [
        "BAC",// Classic Baccarat - 0
        "BAS",// Speed Baccarat - 1
        "BAM",// Squeeze Baccarat - 2
        "DT",// Dragon Tiger - 3
        "DI",// Sic-bo - 4
        "RO",// Roulette - 5
        "LW",// Lucky Wheel - 6
        "ROL",// GOF Roulette - 7
        "DIL",// GOF Sic-bo - 8
        "RC",// Racing - 9
        "LO",// Lottery - 10
        "BAB",// Blockchain Baccarat - 11
        "DTB",// Blockchain Dragon Tiger - 12
        "BAMB",// Blockchain Squeeze Baccarat - 13
        "BASB",// Blockchain Speed Baccarat - 14
        "LWB",// Blockchain Lucky Wheel - 15
        "DIB",// Blockchain Sic-bo - 16
        "ROB",// Blockchain Roulette - 17
        "OXB",// Blockchain Bull Bull - 18
        "ZJHB",// Blockchain Win Three Cards - 19
        "BAA",// Traditional Baccarat - 20
        "DTS",// Speed Dragon Tiger - 21
        "BAL",// GOF Baccarat - 22
    ];

    for ( let i in listGameCodes )
    {
        if ( -1 != strGameID.indexOf(listGameCodes[i]) )
        {
            //if ( i == 0 || i == 1 || i == 2 || i == 11 || i == 13 || i == 14 || i == 20 || i == 22 )
            //    return 
        }
    }

    return IEnum.EGameCode.Baccarat;
}

let GetGameCodeFromBettingTarget = (strBetType) => {

    switch (strBetType)
    {
        //7.7.1.Baccarat Series
        case "BANKER": // Banker
        case "PLAYER": // Player/Super Six Player
        case "TIE": // Tie/Super Six Tie
        case "BANKER_PAIR": // Banker Pair/Super Six Banker Pair
        case "PLAYER_PAIR": // Player Pair/Super Six Player Pair
        case "SUPER_SIX": // Super Six
        case "SUPER_SIX_BANKER": // Super Six Banker
        case "ANY_PAIR": // Any Pair
        case "PERFECT_PAIR": // Perfect Pair
        case "BANKER_BINGO": // Banker Bingo
        case "PLAYER_BINGO": // Player Bingo
        case "DRAGON_SEVEN": // Dragon Seven
        case "PANDA_EIGHT": // Panda Eight
        case "SUPER_TIE_0": // Super Tie 0
        case "SUPER_TIE_1": // Super Tie 1
        case "SUPER_TIE_2": // Super Tie 2
        case "SUPER_TIE_3": // Super Tie 3
        case "SUPER_TIE_4": // Super Tie 4
        case "SUPER_TIE_5": // Super Tie 5
        case "SUPER_TIE_6": // Super Tie 6
        case "SUPER_TIE_7": // Super Tie 7
        case "SUPER_TIE_8": // Super Tie 8
        case "SUPER_TIE_9": // Super Tie 9
            return IEnum.EGameCode.Baccarat;
        //7.7.2.Dragon Tiger Series
        case "DRAGON": // Dragon
        case "TIGER": // Tiger
        //case "TIE": // Tie
        //7.7.3.Roulette Series
        case "DIRECT": // Direct
        case "SEPARATE": // Separate
        case "STREET": // Street
        case "CORNER": // Corner
        case "LINE": // Line
        case "ROW": // ROW_1 (1_4_7_10_13_16_19_22_25_28_31_34) ROW_2 (2_5_8_11_14_17_20_23_26_29_32_35) ROW_3 (3_6_9_12_15_18_21_24_27_30_33_36)
        case "DOZEN": //   DOZEN_1_12 (1_2_3_4_5_6_7_8_9_10_11_12) DOZEN_13_24(13_14_15_16_17_18_19_20_21_22_23_24) DOZEN_25_36 (25_26_27_28_29_30_31_32_33_34_35_36)
        case "RED": // Red
        case "BLACK": // Black
        case "ODD": // Odd
        case "EVEN": // Even
        case "SMALL": // Small
        case "BIG": // Big
        case "ZERO_GAME": // Zero Game
        case "NEIGHBORS_OF_ZERO": // Neighbors Of Zero
        case "ORPHANS": // Orphans
        case "THE_THIRD": // The Third
        case "EVEN": // Even
        case "SMALL": // Small
        case "BIG": // Big
        case "ZERO_GAME": // Zero Game
        case "NEIGHBORS_OF_ZERO": // Neighbors Of Zero
        case "ORPHANS": // Orphans
        case "THE_THIRD": // The Third
            return IEnum.EGameCode.Baccarat;
        //7.7.4.Lucky Wheel Series
        case "LW_0": // East Wind
        case "LW_1": // South Wind
        case "LW_2": // West Wind
        case "LW_3": // North Wind
        case "LW_4": // White Dragon
        case "LW_5": // Red Dragon
        case "LW_6": // Green Dragon
            return IEnum.EGameCode.Baccarat;
        //7.7.5.Sic-bo Series
        case "SMALL": // Small
        case "BIG": // Big
        case "ODD": // Odd
        case "EVEN": // Even
        case "SPECIFIC": // Specific Dice(1~6), Example": SPECIFIC_6 Specific Dice 6
        case "DOUBLE": // Double, Example": DOUBLE_6 Double 6
        case "TRIPLE": // Triple, Example": TRIPLE_6 Triple 6
        case "TRIPLE_ALL": // Any Triple
        case "SUM": // Total, Example": SUM_17 Total 17
        case "COMBINE": // Combination, Example": COMBINE_1_2 Dice combination (1,2)
            return IEnum.EGameCode.Baccarat;
        //7.7.6.BullBull Series
        case "BANKER1_MUL": // Banker1 Double
        case "BANKER1_NOR": // Banker1 Equal
        case "BANKER2_MUL": // Banker2 Double
        case "BANKER2_NOR": // Banker2 Equal
        case "BANKER3_MUL": // Banker3 Double
        case "BANKER3_NOR": // Banker3 Equal
        case "PLAYER1_MUL": // Player1 Double
        case "PLAYER1_NOR": // Player1 Equal
        case "PLAYER2_MUL": // Player2 Double
        case "PLAYER2_NOR": // Player3 Equal
        case "PLAYER3_MUL": // Player3 Double
        case "PLAYER3_NOR": // Player3 Equal
            return IEnum.EGameCode.Baccarat;
        //7.7.7.Win Three Cards Series
        case "DRAGON": // Gold
        case "PHOENIX": // Silver
        case "PAIR": // Pair
        case "LEOPARD": // 3 of kind
        case "STRAIGHT_FLUSH": // Straight Flush
        case "FLUSH": // Flush
        case "STRAIGHT": // Straight
            return IEnum.EGameCode.Baccarat;
        //7.7.8.Lottery (Baccarat)
        // BANKER": // Banker
        // PLAYER": // Player
        // TIE": // Tie
        // BANKER_PAIR": // Banker Pair
        // PLAYER_PAIR": // Player Pair
        
    }
    return IEnum.EGameCode.Baccarat;
}

let GetTarget = (strBetType) => {

    console.log(`##### GetBetType : ${strBetType}`);

    switch (strBetType)
    {
        //7.7.1.Baccarat Series
        case "BANKER": // Banker
            return IEnum.EBettingAccount.Banker;
        case "PLAYER": // Player/Super Six Player
            return IEnum.EBettingAccount.Player;
        case "TIE": // Tie/Super Six Tie
            return IEnum.EBettingAccount.Tie;
        case "BANKER_PAIR": // Banker Pair/Super Six Banker Pair
            return IEnum.EBettingAccount.BankerPair;
        case "PLAYER_PAIR": // Player Pair/Super Six Player Pair
            return IEnum.EBettingAccount.PlayerPair;
        case "SUPER_SIX": // Super Six
        case "SUPER_SIX_BANKER": // Super Six Banker
        case "ANY_PAIR": // Any Pair
        case "PERFECT_PAIR": // Perfect Pair
        case "BANKER_BINGO": // Banker Bingo
        case "PLAYER_BINGO": // Player Bingo
        case "DRAGON_SEVEN": // Dragon Seven
        case "PANDA_EIGHT": // Panda Eight
        case "SUPER_TIE_0": // Super Tie 0
        case "SUPER_TIE_1": // Super Tie 1
        case "SUPER_TIE_2": // Super Tie 2
        case "SUPER_TIE_3": // Super Tie 3
        case "SUPER_TIE_4": // Super Tie 4
        case "SUPER_TIE_5": // Super Tie 5
        case "SUPER_TIE_6": // Super Tie 6
        case "SUPER_TIE_7": // Super Tie 7
        case "SUPER_TIE_8": // Super Tie 8
        case "SUPER_TIE_9": // Super Tie 9
            return IEnum.EBettingAccount.Baccarat;
        //7.7.2.Dragon Tiger Series
        case "DRAGON": // Dragon
        case "TIGER": // Tiger
            return IEnum.EBettingAccount.DragonTiger;
        //case "TIE": // Tie
        //7.7.3.Roulette Series
        case "DIRECT": // Direct
        case "SEPARATE": // Separate
        case "STREET": // Street
        case "CORNER": // Corner
        case "LINE": // Line
        case "ROW": // ROW_1 (1_4_7_10_13_16_19_22_25_28_31_34) ROW_2 (2_5_8_11_14_17_20_23_26_29_32_35) ROW_3 (3_6_9_12_15_18_21_24_27_30_33_36)
        case "DOZEN": //   DOZEN_1_12 (1_2_3_4_5_6_7_8_9_10_11_12) DOZEN_13_24(13_14_15_16_17_18_19_20_21_22_23_24) DOZEN_25_36 (25_26_27_28_29_30_31_32_33_34_35_36)
        case "RED": // Red
        case "BLACK": // Black
        case "ODD": // Odd
        case "EVEN": // Even
        case "SMALL": // Small
        case "BIG": // Big
        case "ZERO_GAME": // Zero Game
        case "NEIGHBORS_OF_ZERO": // Neighbors Of Zero
        case "ORPHANS": // Orphans
        case "THE_THIRD": // The Third
        case "EVEN": // Even
        case "SMALL": // Small
        case "BIG": // Big
        case "ZERO_GAME": // Zero Game
        case "NEIGHBORS_OF_ZERO": // Neighbors Of Zero
        case "ORPHANS": // Orphans
        case "THE_THIRD": // The Third
            return IEnum.EBettingAccount.Roulette;
        //7.7.4.Lucky Wheel Series
        case "LW_0": // East Wind
        case "LW_1": // South Wind
        case "LW_2": // West Wind
        case "LW_3": // North Wind
        case "LW_4": // White Dragon
        case "LW_5": // Red Dragon
        case "LW_6": // Green Dragon
            return IEnum.EBettingAccount.Baccarat;
        //7.7.5.Sic-bo Series
        case "SMALL": // Small
        case "BIG": // Big
        case "ODD": // Odd
        case "EVEN": // Even
        case "SPECIFIC": // Specific Dice(1~6), Example": SPECIFIC_6 Specific Dice 6
        case "DOUBLE": // Double, Example": DOUBLE_6 Double 6
        case "TRIPLE": // Triple, Example": TRIPLE_6 Triple 6
        case "TRIPLE_ALL": // Any Triple
        case "SUM": // Total, Example": SUM_17 Total 17
        case "COMBINE": // Combination, Example": COMBINE_1_2 Dice combination (1,2)
            return IEnum.EBettingAccount.Baccarat;
        //7.7.6.BullBull Series
        case "BANKER1_MUL": // Banker1 Double
        case "BANKER1_NOR": // Banker1 Equal
        case "BANKER2_MUL": // Banker2 Double
        case "BANKER2_NOR": // Banker2 Equal
        case "BANKER3_MUL": // Banker3 Double
        case "BANKER3_NOR": // Banker3 Equal
        case "PLAYER1_MUL": // Player1 Double
        case "PLAYER1_NOR": // Player1 Equal
        case "PLAYER2_MUL": // Player2 Double
        case "PLAYER2_NOR": // Player3 Equal
        case "PLAYER3_MUL": // Player3 Double
        case "PLAYER3_NOR": // Player3 Equal
            return IEnum.EBettingAccount.Baccarat;
        //7.7.7.Win Three Cards Series
        case "DRAGON": // Gold
        case "PHOENIX": // Silver
        case "PAIR": // Pair
        case "LEOPARD": // 3 of kind
        case "STRAIGHT_FLUSH": // Straight Flush
        case "FLUSH": // Flush
        case "STRAIGHT": // Straight
            return IEnum.EBettingAccount.Baccarat;
        //7.7.8.Lottery (Baccarat)
        // BANKER": // Banker
        // PLAYER": // Player
        // TIE": // Tie
        // BANKER_PAIR": // Banker Pair
        // PLAYER_PAIR": // Player Pair
        
    }
    return IEnum.EBettingAccount.Baccarat;
}

let IAccount = 
{
    cVender: 'WE',
    cGameType: 'LIVEGAMES',
    cCurrency: 'KRW',
    cAPIURL : 'https://uat-op-api.bpweg.com',
    cGameURL : 'https://uat-web-game-fe-op.bpweg.com',
    cOperatorID : 'agptarowanar36bg',
    cSecretCode : 'rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=',
};

router.post('/', async (req, res) => {

    console.log(`##### /we`);
    console.log(req.body);

});

let GetGameURL = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {
    
    const cToken = await IHelper.BuildToken(12);
    if ( cToken != '' )
    {
        const strAgentID = `${strAgentCode}-${strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, strAgentCode, strSecretCode, strReturnURL);
        if ( bResult == true )
        {
            const url = `${IAccount.cGameURL}/?token=${cToken}&operator=${IAccount.cOperatorID}&lang=ko`;

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

router.post('/game', async (req, res) => {

    console.log(`##################################################/we/game`);
    console.log(req.body);
    /*
        req.body.strAddress
    */

    const cToken = await IHelper.BuildToken(12);
    if ( cToken != '' )
    {
        const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, req.body.strAgentCode, req.body.strSecretCode);
        if ( bResult == true )
        {
            const url = `${IAccount.cGameURL}/?token=${cToken}&operator=${IAccount.cOperatorID}&lang=ko`;

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
    // const cToken = await IHelper.BuildToken(12);
    // if ( cToken != '' )
    // {
    //     //const url = `${IAccount.cGameURL}/?token=${cToken}&operator=${cOperatorID}`;
    //     const url = `${IAccount.cGameURL}/?token=${cToken}&operator=${IAccount.cOperatorID}&lang=ko`;

    //     let objectData = {eResult:'OK', strURL:url, strID:req.body.strID, strToken:cToken};

    //     res.send(objectData);
    // }
    // else
    // {
    //     let objectData = {eResult:'Error', eCode:'Server System Error'};

    //     res.send(objectData);
    // }
});

router.post('/validate', async (req, res) => {

    console.log(`##################################################/we/validate`);
    console.log(req.body);
    /**
     * token : string
     * operatorID : string
     * appSecret : string
    */

    if ( req.body.token == undefined || req.body.operatorID == undefined || req.body.appSecret == undefined )
    {
        console.log(`what the`);
        res.status(400).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Bad Request'});
        return;
    }
    if ( req.body.appSecret != IAccount.cSecretCode )
    {
        res.status(401).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Incorrect appSecret'});
        return;
    }
    
    const user = await IHelper.GetUserFromToken(IAccount.cVender, req.body.token);

    if ( user == null )
    {
        res.status(404).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Invalid Token'});
        return;
    }

    const strAgentID = `${user.strAgentCode}-${user.strID}`;

    console.log(`strAgnetID : ${strAgentID}`);

    let object = {
        'playerID':strAgentID,
        'nickname':user.strNickname,
        'currency':IAccount.cCurrency,
        'time':IHelper.GetUnixTimeStamp()
    }

    console.log(`###### /validate`);
    console.log(object);

    res.header("Content-Type", "application/x-www-form-urlencoded").send(object);
});

router.post('/balance', async (req, res) => {
    
    console.log(`##################################################/we/balance`);
    console.log(req.body);
    /**
     * token : string
     * operatorID : string
     * appSecret : string
     * playerID : string
    */

    if ( req.body.token == undefined || req.body.operatorID == undefined || req.body.appSecret == undefined || req.body.playerID == undefined )
    {
        res.status(400).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Bad Request'});
        return;
    }
    if ( req.body.appSecret != IAccount.cSecretCode )
    {
        res.status(401).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Incorrect appSecret'});
        return;
    }

    const user = await IHelper.GetUserFromToken(IAccount.cVender, req.body.token);
    if ( user == null )
    {
        res.status(404).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Invalid Token'});
        return;
    }

    let object = {
        'balance':user.iCash * 100,
        'currency':IAccount.cCurrency,
        'time':IHelper.GetUnixTimeStamp(),
    }

    res.header("Content-Type", "application/x-www-form-urlencoded").send(object);
});

router.post('/debit', async (req, res) => {
    
    console.log(`##################################################/we/debit`);
    console.log(req.body);
    /*
     * token : string
     * operatorID : string
     * appSecret : string
     * playerID : string
     * gameID : string
     * betID : string
     * gameRoundID : string
     * parentBetID : string (Not Required)
     * betType : string
     * amount : int64
     * currency : string
     * type : string (transaction type : 'Bet', 'Free Bet', 'Transfer In', 'Tip')
     * time : int (Unix)
    */

    if ( req.body.token == undefined || req.body.operatorID == undefined || req.body.appSecret == undefined || req.body.playerID == undefined || req.body.gameID == undefined || req.body.betID == undefined || 
        req.body.gameRoundID == undefined || req.body.betType == undefined || req.body.amount == undefined || req.body.currency == undefined || req.body.type == undefined || req.body.time == undefined )
    {
        res.status(400).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Bad Request'});
        //console.log(`Bad Request!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        return;
    }
    if ( req.body.appSecret != IAccount.cSecretCode )
    {
        res.status(401).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Incorrect appSecret'});
        //console.log(`Incorrect appSecret!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        return;
    }

    const user = await IHelper.GetUserFromToken(IAccount.cVender, req.body.token);
    if ( user == null )
    {
        res.status(404).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Invalid Token'});
        //console.log(`Invalid Token!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        return;
    }

    const bet = await IHelper.GetBet(IAccount.cVender, req.body.betID);
    if ( bet != null )
    {
        res.status(409).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Duplicate Transaction'});
        console.log(`Duplicate Transaction!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        return;        
    }

    const cTransactionNumber = await GetTransactionNumber();
    //const cGameType = 'LIVEGAMES'
    const cBetAmount = parseInt(req.body.amount) / 100;

    const cGameCode = GetGameCodeFromBettingTarget(req.body.betType);
    const cBetAccount = GetTarget(req.body.betType);

    const processbet = await IHelper.ProcessBet(req.body.playerID, 'LIVE', IAccount.cVender, req.body.gameID, '', req.body.gameRoundID, cBetAmount, 0, '', req.body.betID, 0);
    console.log(`################################################## /debit processbet`);
    console.log(processbet);

    if ( processbet != null )
    {
        let object = {
            'balance':processbet.iCash * 100,
            'currency':IAccount.cCurrency,
            'time':IHelper.GetUnixTimeStamp(),
            'refID':cTransactionNumber,
        }

        console.log(`################################################## /debet return object for Success`);
        console.log(object);

        res.header("Content-Type", "application/x-www-form-urlencoded").send(object);
    }
    else
    {
        res.status(410).header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Internal Server Error'});
    }
});

router.post('/credit', async (req, res) => {
    console.log(`##################################################/we/credit`);
    console.log(req.body);
    console.log(req.body.data);

    /** Array
     * operatorID : string
     * appSecret : string
     * playerID : string
     * gameID : string
     * betID : string
     * amount : int64
     * gameStatus : 
     * gameResult : 
     * currency : string
     * type : string (transaction type : 'Bet', 'Free Bet', 'Transfer In', 'Tip')
     * time : int (Unix)
    */

    const array = JSON.parse(req.body.data);
    
    let iBalance = 0;
    let response = {};
    let iStatus = 200;

    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ array length is ${array.length}`);
    for (let i in array) {
        console.log(array[i]);

        const iAmount = parseInt(array[i].amount);
        const strID = array[i].playerID;
        const gameStatus = array[i].gameStatus;
        const gameResult = array[i].gameResult;
        const gameID = array[i].gameID;
        const betID = array[i].betID; 

        try {
            if ( array[i].operatorID == undefined || array[i].appSecret == undefined || array[i].playerID == undefined || array[i].gameID == undefined || array[i].betID == undefined || 
                array[i].amount == undefined || array[i].gameStatus == undefined || array[i].gameResult == undefined || array[i].currency == undefined || array[i].type == undefined || array[i].time == undefined ) {
                response = {'error':'Bad Request'};
                iStatus = 400;
                break;
            }

            if ( array[i].appSecret != IAccount.cSecretCode ) {
                response = {'error':'Incorrect appSecret'};
                iStatus = 401;
                break;
            }

            const user = await IHelper.GetUserFromID(IAccount.cVender, array[i].playerID);
            if ( user == null ) {
                response = {'error':'Invalid Token'};
                iStatus = 404;
                break;
            }

            const cTransactionNumber = await GetTransactionNumber();
            if ( iAmount > 0 ) {
                const cWinAmount = iAmount / 100;

                const bet = await IHelper.GetBet(IAccount.cVender, betID);
                if ( bet != null )
                {
                    response = {'error':'Internal Server Error'};
                    iStatus = 410;
                    console.log(`Duplicate Transaction!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
                    break;
                }

                const processwin = await IHelper.ProcessWin(strID, 'LIVE', IAccount.cVender, gameID, '', gameResult, cWinAmount, 0, '', betID, 0);
                if ( gameStatus == 'tie' ) {
                    console.log('########## TIE');
                }

                if ( processwin == null ) {
                    response = {'error':'Internal Server Error'};
                    iStatus = 410;
                    break;
                }

                iBalance = processwin.iCash * 100;
                response = {
                    'balance': iBalance,
                    'currency': IAccount.cCurrency,
                    'time': IHelper.GetUnixTimeStamp(),
                    'refID': cTransactionNumber
                };
            }
            else {
                response = {
                    'balance': user.iCash * 100,
                    'currency': IAccount.cCurrency,
                    'time': IHelper.GetUnixTimeStamp(),
                    'refID': cTransactionNumber
                };
            }
        } catch (err) {
            response = {'error':'Internal Server Error'};
            iStatus = 410;
            break;
        }
    }

    res.status(iStatus).header("Content-Type", "application/x-www-form-urlencoded").send(response);
});

// router.post('/credit', async (req, res) => {
    
//     console.log(`##################################################/we/credit`);
//     console.log(req.body);
//     console.log(req.body.data);
//     /** Array
//      * operatorID : string
//      * appSecret : string
//      * playerID : string
//      * gameID : string
//      * betID : string
//      * amount : int64
//      * gameStatus : 
//      * gameResult : 
//      * currency : string
//      * type : string (transaction type : 'Bet', 'Free Bet', 'Transfer In', 'Tip')
//      * time : int (Unix)
//     */

//     const array = JSON.parse(req.body.data);

//     let iAmount = 0;
//     let strID = '';
//     let gameStatus = '';
//     let gameResult = '';
//     let gameID = '';
//     let betID = '';
//     //let gameRoundID

//     console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ array length is ${array.length}`);
//     for ( let i in array )
//     {
//         console.log(array[i]);

//         iAmount += parseInt(array[i].amount);
//         strID = array[i].playerID;
//         gameStatus += array[i].gameStatus;
//         gameResult += array[i].gameResult;
//         gameID += array[i].gameID;
//         betID += array[i].betID;

//         //console.log(array[i]);

//         if ( array[i].operatorID == undefined || array[i].appSecret == undefined || array[i].playerID == undefined || array[i].gameID == undefined || array[i].betID == undefined || 
//             array[i].amount == undefined || array[i].gameStatus == undefined || array[i].gameResult == undefined || array[i].currency == undefined || array[i].type == undefined || array[i].time == undefined )
//         {
//             res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Bad Request'});
//             return;
//         }
//         if ( array[i].appSecret != IAccount.cSecretCode )
//         {
//             res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Incorrect appSecret'});
//             return;
//         }
    
//         const user = await IHelper.GetUserFromID(IAccount.cVender, array[i].playerID);
//         if ( user == null )
//         {
//             res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':"Can't credit"});
//             return;
//         }
    
//         // const bet = await IHelper.GetBet(IAccount.cVender, array[i].betID);
//         // if ( bet != null )
//         // {
//         //     res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Duplicate Transaction'});
//         //     return;
//         // }
    
//     }
   
//     // res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Internal Server Error'});
//     // return;        
//     const cTransactionNumber = await GetTransactionNumber();
//     const cGameType = 'LIVEGAMES'
//     const cWinAmount = iAmount / 100;
//     const processbet = await IHelper.ProcessWin(IAccount.cVender, cGameType, cTransactionNumber, gameStatus, strID, gameID, betID, gameStatus, 'WIN', '', cWinAmount, gameResult);

//     let object = {
//         'balance':processbet.iCash * 100,
//         'currency':IAccount.cCurrency,
//         'time':IHelper.GetUnixTimeStamp(),
//         'refID':cTransactionNumber
//     }

//     console.log(object);

//     res.header("Content-Type", "application/x-www-form-urlencoded").send(object);
// });

router.post('/rollback', async (req, res) => {
    
    console.log(`##################################################/we/rollback`);
    console.log(req.body);
    /**
     * operatorID : string
     * appSecret : string
     * playerID : string
     * gameID : string
     * betID : string
     * amount : int64
     * currency : string
     * type : string (transaction type : 'Bet', 'Free Bet', 'Transfer In', 'Tip')
     * time : int (Unix)
    */

    if ( req.body.operatorID == undefined || req.body.appSecret == undefined || req.body.playerID == undefined || req.body.gameID == undefined || req.body.betID == undefined ||
        req.body.amount == undefined || req.body.currency == undefined || req.body.type == undefined || req.body.time == undefined )
    {
        console.log(`##### Error Bad Request`);
        res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Bad Request'});
        return;
    }
    if ( req.body.appSecret != IAccount.cSecretCode )
    {
        console.log(`##### Error Incorrect appSecret`);
        res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Incorrect appSecret'});
        return;
    }

    // res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Insufficient Balance'});
    // return;  

    const user = await IHelper.GetUserFromID(IAccount.cVender, req.body.playerID);
    if ( user == null )
    {
        console.log(`##### Error Invalid Token`);
        res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Invalid Token'});
        return;
    }

    // const bet = await IHelper.GetBet(IAccount.cVender, req.body.betID);
    // if ( bet != null )
    // {
    //     res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Duplicate Transaction'});
    //     return;        
    // }
    // res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':"Can't cancel the transaction"});
    // return;  

    // res.header("Content-Type", "application/x-www-form-urlencoded").send({'error':'Internal Server Error'});
    // return;        

    const cTransactionNumber = await GetTransactionNumber();
    const cGameType = 'LIVEGAMES';
    const cAmount = parseInt(req.body.amount) / 100;

    const bet = await IHelper.GetBet(IAccount.cVender, req.body.betID);
    if ( bet == null )
    {
        console.log(`################################################## /rollback return object not found`);
        res.status(404).header("Content-Type", "application/x-www-form-urlencoded").send();
        return;
    }

    const processcancel = await IHelper.ProcessCancel(req.body.playerID, 'LIVE', IAccount.cVender, req.body.betID);

    if (processcancel == null)
    {
        console.log(`################################################## /rollback return object not found`);
        res.status(404).header("Content-Type", "application/x-www-form-urlencoded").send();
        return;
    }

    let object = {
        'balance':processcancel.iCash * 100,
        'currency':IAccount.cCurrency,
        'time':IHelper.GetUnixTimeStamp(),
        'refID':cTransactionNumber
    }

    console.log(`################################################## /rollback return object for Success`);
    console.log(object);

    res.header("Content-Type", "application/x-www-form-urlencoded").send(object);
});

module.exports = {
    router:router,
    GetGameURL:GetGameURL
};

// let array = '[{"amount":"2000000","appSecret":"rnkQegcyIt_Jh9zxYOWqrFBCKeoVRKeYywXUnc5gS8I=","betID":"CGQKFC6PTFG9C2SGLG50","currency":"KRW","gameID":"STUDIO-BAL-1","gameResult":"Player (B0 P8)","gameStatus":"win","operatorID":"agptarowanar36bg","playerID":"sss2","time":"1681213386","type":"game"}]';

// console.log(`11111111111111111111111111111111111111111111111111111111111111`);
// console.log(JSON.parse(array));
// const test = JSON.parse(array);
// console.log(test[0]);
