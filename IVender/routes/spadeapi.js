
const express = require('express');
const router = express.Router();

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');
let axios = require('axios');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const db = require('../db');

/*
    http://v-ingapi.com
    korea111
    qwqw12!!
*/

// let IAccount = 
// {
//     cVender : 'SPADEAPI',
//     cLanguage : "KR",
//     cGameType : 'LIVEGAMES',
//     cAPIURL : 'https://api.spadeapi.org/api',
//     cToken : '996200b9-ef08-40da-83f9-c808a849ff18',
//     cCallbackToken : '0dc06c15-ba53-40e2-95d1-7b1cfbf6c27a',
// };

let IAccount = 
{
    cVender : 'SPADEAPI',
    cLanguage : "KR",
    cGameType : 'LIVEGAMES',
    cAPIURL : 'api.v-ingapi.com',
    cToken : '4a181510493a60d99d88922d06986b96fda7936b09f77202c35786fca45260c8',
    // cCallbackToken : '0dc06c15-ba53-40e2-95d1-7b1cfbf6c27a',
};


const headers = {
    "Authorization": "Bearer " + IAccount.cToken,
    // "Callback-Token" : IAccount.cCallbackToken,
    "Accept": "application/json",
    "Content-Type": "application/json",
};

let GetGameCode = (cGameType) => {
    
    if ( cGameType == 'slot' )
        return 200;
    
    return 0;
}

const strVenderKey = 'evolution_casino';

// router.post('/game', async (req, res) => {

//     console.log(`##################################################/spadeapi/game`);
//     console.log(req.body);

//     const strToken = await IHelper.BuildToken(16);

//     if(strToken != ''){

//         const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
//         const bResult = await IHelper.UpdateToken(strAgentID, strToken, req.body.strAgentCode, req.body.strSecretCode);
//         if(bResult == true)
//         {
//             console.log(`################################################### strAgentID : ${strAgentID}`);

//             try {
//                 const responseData = await axios.get(
//                     //IAccount.cAPIURL + `/game?vendor_key=${strVenderKey}`,
//                     IAccount.cAPIURL + `/game?vendor_key=${req.body.strGameKey}`,
//                     { headers }
//                 );

//                 console.log(responseData.data);
//                 console.log(responseData.data.data.game_list[0]);
//                 gameList= responseData.data.data.game_list;

//                 try {
//                     const gamekey = gameList[0].game_key;
//                     //let user = GetUserFromTokenAtTokenDB(strToken);

//                     //const strAgentID = `${user.strAgentCode}.${user.strID}`;

//                     console.log(`/game-url?vendor_key=${req.body.strGameKey}&game_key=${gamekey}&account=${strAgentID}`);
//                     //console.log(user);

//                     const responseData2 = await axios.get(
//                         IAccount.cAPIURL + `/game-url?vendor_key=${req.body.strGameKey}&game_key=${gamekey}&account=${strAgentID}`,
//                         { headers }
//                     );

//                     console.log(responseData2.data);

//                     //res.send(`window.open('${responseData2.data.data.url}','IIP Gaming','width='+screen.width+', height='+screen.height+', statusbar=no,scrollbars=auto,toolbar=no,resizable=no');`);
//                     //res.send(responseData2.data.data.url);
//                     let objectData = {eResult:'OK', strURL:responseData2.data.data.url, strID:req.body.strID, strToken:strToken};
//                     res.send(objectData);

//                 } catch (err) {
//                     console.log('err', err);
//                 }
//             } catch (err) {
//                 console.log('err', err);
//             }
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

router.post('/game', async (req, res) => {

    console.log(`##################################################/spadeapi/game`);
    console.log(req.body);

    const strToken = await IHelper.BuildToken(16);

    if(strToken != ''){

        const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, strToken, req.body.strAgentCode, req.body.strSecretCode);
        if(bResult == true)
        {
            console.log(`################################################### strAgentID : ${strAgentID}`);

            try {

                const responseData = await axios.get(
                    //IAccount.cAPIURL + `/game?vendor_key=${strVenderKey}`,
                    IAccount.cAPIURL + `/game?vendor_key=${req.body.strGameKey}`,
                    { headers }
                );

                console.log(responseData.data);
                console.log(responseData.data.data.game_list[0]);
                gameList= responseData.data.data.game_list;

                try {
                    const gamekey = gameList[0].game_key;
                    //let user = GetUserFromTokenAtTokenDB(strToken);

                    //const strAgentID = `${user.strAgentCode}.${user.strID}`;

                    console.log(`/game-url?vendor_key=${req.body.strGameKey}&game_key=${gamekey}&account=${strAgentID}`);
                    //console.log(user);

                    const responseData2 = await axios.get(
                        IAccount.cAPIURL + `/game-url?vendor_key=${req.body.strGameKey}&game_key=${gamekey}&account=${strAgentID}`,
                        { headers }
                    );

                    console.log(responseData2.data);

                    //res.send(`window.open('${responseData2.data.data.url}','IIP Gaming','width='+screen.width+', height='+screen.height+', statusbar=no,scrollbars=auto,toolbar=no,resizable=no');`);
                    //res.send(responseData2.data.data.url);
                    let objectData = {eResult:'OK', strURL:responseData2.data.data.url, strID:req.body.strID, strToken:strToken};
                    res.send(objectData);

                } catch (err) {
                    console.log('err', err);
                }
            } catch (err) {
                console.log('err', err);
            }
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

router.post('/gamesm', async (req, res) => {

    console.log(`##################################################/spadeapi/gamesm`);
    console.log(req.body);
    try {
        const data = req.body;
        const cVender = data.strGameKey;
        const responseData = await axios.get(
            IAccount.cAPIURL + `/game-url?vendor_key=${cVender}&game_key=${data.symbol}&account=${req.body.strID}`,
            { headers }
        );

        let objectData = {eResult:'OK', strURL:responseData.data.data.url, strID:req.body.strID, strToken:''};
        //res.send(`window.open('${responseData.data.data.url}','IIP Gaming','width='+screen.width+', height='+screen.height+', statusbar=no,scrollbars=auto,toolbar=no,resizable=no');`);
        //res.send(responseData.data.data.url);
        res.send(objectData);

    } catch (err) {
        console.log('err', err);
    }
});

router.post('/request_listsm', async (req, res) => {

    console.log(`##################################################/spadeapi/request_listsm`);
    console.log(req.body);

    const responseData = await axios.get(
        IAccount.cAPIURL + `/game?vendor_key=${req.body.strGameKey}`,
        { headers }
    );
    console.log(responseData.data);
    console.log(responseData.data.data.game_list[0]);
    
    let gameList= responseData.data.data.game_list;

    gameList.forEach((element) => {
        element.imgUrl = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.game_key}.png`;
    });

    //res.render('pp/slot', { gameList });
    res.send({eResult:'OK', data:gameList});
})

router.post('/balance', async (req, res) => {

    console.log(`##################################################/spadeapi/balance`);
    console.log(req.body);

    // if ( null == dbuser )
    // {
    //     console.log(`/Evolution/SpadeApi DB USER : null`);

    //     res.json({'result':cCheck, 'status':'Invalid User'});
    //     return;
    // }
})


router.post('/', async (req, res) => {

    console.log(`##################################################/spadeapi`);
    console.log(req.body);

//    console.log(req.headers['callback-token']);
    console.log(req.headers);
    console.log(req.body);

    // if ( IAccount.cCallbackToken != req.headers['callback-token'] )
    // {
    //     res.json({'result':100, 'status':'Invalid Callback Token'});
    //     return;
    // }

    const paramData = req.body;

    console.log(`/Evolution/SpadeApi req.body.check : ${paramData.check}`);

    const iID = paramData.data.account;
    let listCheck = paramData.check.split(',');

    console.log(`listCheck : ${listCheck.length}`);
    console.log(listCheck);

    let dbuser = null;

    for ( let i in listCheck )
    {
        const cCheck = listCheck[i];
        console.log(`Current Check : ${cCheck}`);

        switch ( cCheck )
        {
        case '21':
            {
                //dbuser = await db.Users.findOne({where:{strID:iID}});
                dbuser = await IHelper.GetUserFromID(IAccount.cVender, iID);
                if ( null == dbuser )
                {
                    console.log(`/Evolution/SpadeApi DB USER : null`);
        
                    res.json({'result':cCheck, 'status':'Invalid User'});
                    return;
                }
            }
            break;
        case '22':
            {
                //if ( dbuser.eState != 'NORMAL' )
                if ( dbuser.strID == '' )
                {
                    res.json({'result':cCheck, 'status':'Invalid User State'});
                    return;
                }
            }
            break;
        case '31':
            {
                const cAmount = parseInt(paramData.data.amount);
                console.log(`##### 31 => cAmount : ${cAmount}, user.iCash : ${dbuser.iCash}`);
                if ( dbuser.iCash < cAmount )
                {
                    //res.json({'result':cCheck, 'status':'Invalid User Cash', 'data':user.iCash});
                    res.json({'result':cCheck, 'status':'ERROR', 'data':{'balance':dbuser.iCash}});
                    return;
                }
            }
            break;
        case '41':
            {
                //let query = await db.BettingRecords.findOne({where:{iTransactionID:paramData.data.transaction_id}});
                const query = await IHelper.GetBet(IAccount.cVender, paramData.data.transaction_id);
                if ( query != null )
                {
                    res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
                    return;           
                }
            }
            break;
        case '42':
            {
                const transactionID = paramData.data.transaction_id;

                console.log(`42 transactionID : ${transactionID}`);

                //let query = await db.BettingRecords.findOne({where:{iTransactionID:transactionID}});
                const query = await IHelper.GetBet(IAccount.cVender, transactionID);
                if ( query != null )
                {
                    bet = query;
                }
                else {

                    console.log(`##### 42 returns error`);

                    res.json({'result':cCheck, 'status':'Invalid Transaction : No Exist', 'data':{'balance':dbuser.iCash}});
                    return;
                }
            }
            break;
        }
    }
    

    //  All the things have no problem
    console.log(`####################################################### Command : ${paramData.command}`);

    //let objectResponse = {};

    const transaction_id = paramData.data.transaction_id;
    const strTransactionTimestamp = paramData.timestamp;
    const iAmount = parseInt(paramData.data.amount);
    const iGame = paramData.data.game;
    const iGameID = paramData.data.game_id;
    const account = paramData.data.account;
    const iGameType = paramData.data.game_type;
    const iRoundID = paramData.data.round_id;
    const strVender = paramData.data.vendor;

    let eType = 'LIVE';
    let iGameCode = 0;
    if ( iGameType == 'slot' )
    {
        iGameCode = 200;
        eType = 'SM';
    }        

    switch ( paramData.command )
    {
    case 'authenticate':
        console.log(`authenticate`);
        
        res.json({'result':0, 'status':'OK', 'data':{'account':iID, 'nickname':dbuser.strID, 'balance':dbuser.iCash}});
        break;
    case 'balance':
        console.log(`balance iCash : ${dbuser.iCash}`);
        res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
        break;
    case 'bet':
        {
            // await ApiBetting.ProcessCreate('', iGameCode, strVender, iRoundID, iGameID, 0, iAmount, dbuser.iCash, dbuser.iCash, transaction_id, dbuser.strNickname, dbuser.strGroupID, dbuser.iClass);
            // await ApiBetting.ProcessEnd('', transaction_id , iGameCode, dbuser.strNickname);
            //await IHelper.ProcessBet(eType, IAccount.cVender, IAccount.cGameType, '', '', iID, iGameID, transaction_id, iRoundID, 'BET', 0, iAmount, '', iGameCode, 0);
            await IHelper.ProcessBet(account, eType, IAccount.cVender, iGameID, iRoundID, iAmount, 0, '', paramData.data.transaction_id, iGameCode);

            //dbuser = await db.Users.findOne({where:{strID:iID}});
            dbuser = await IHelper.GetUserFromID(IAccount.cVender, iID);
            console.log(`########## => cash after bet : ${dbuser.iCash}`);

            //UpdateUserPageCash(dbuser.strID, dbuser.iCash);

            res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
        }
        break;
    case 'win':
        {
            if(iAmount >  0){
                //await ApiBetting.ProcessCreateWin('', iGameCode, strVender, iRoundID, iGameID, 0, parseInt(iAmount), dbuser.iCash, dbuser.iCash, transaction_id, dbuser.strNickname, dbuser.strGroupID, dbuser.iClass);
                console.log(`########## => cash before win : ${dbuser.iCash}`);
                //await IHelper.ProcessWin(eType, IAccount.cVender, IAccount.cGameType, '', '', iID, iGameID, transaction_id, iRoundID, 'WIN', 0, iAmount, '', iGameCode);
                await IHelper.ProcessWin(account, eType, IAccount.cVender, iGameID, iRoundID, iAmount, 0, '', paramData.data.transaction_id, iGameCode);
                
                //dbuser = await db.Users.findOne({where:{strID:iID}});
                dbuser = await IHelper.GetUserFromID(IAccount.cVender, iID);
                console.log(`########## => cash after win : ${dbuser.iCash}`);

                //UpdateUserPageCash(dbuser.strID, dbuser.iCash);
            }
            res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
        }
        break;
    case 'cancel':
        {
            //let bet = await db.BettingRecords.findOne({where:{iTransactionID:paramData.data.transaction_id}});
            let bet = await IHelper.GetBet(IAccount.cVender, paramData.data.transaction_id);

            if ( null != bet )
            {
                //console.log(`========================> bet transaction : ${bet.iTransactionID} Complete : ${bet.iComplete} `);

                if ( bet.eState != 'REFUND' )
                {
                    //console.log(`========================> bet iWin : ${bet.iWin} Complete : ${bet.iComplete} `);
                    if ( parseInt(bet.strAmount) > 0 )
                    {   
                        //console.log(`#################################################################################################### => Cancel : iWin : ${bet.strAmount} userCash : ${dbuser.iCash}`);

                        //await IHelper.ProcessCancel(eType, IAccount.cVender, IAccount.cGameType, '', '', dbuser.strID, iGameID, paramData.data.transaction_id, iRoundID, 'REFUND', 0, bet.strAmount, '');
                        await IHelper.ProcessCancel(account, eType, IAccount.cVender, paramData.data.transaction_id);

                        // await db.BettingRecords.update({iComplete:2, iWin:0}, {where:{iTransactionID:paramData.data.transaction_id}});
                        // await db.Users.decrement({iCash:parseInt(bet.iWin)}, {where:{strID:iID}});
                        // dbuser = await db.Users.findOne({strID:iID});
                        dbuser = await IHelper.GetUserFromID(IAccount.cVender, iID);

                        // console.log(`########## => Cancel Complete : iWin : ${bet.iWin} userCash : ${dbuser.iCash}`);

                        res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
                    }
                    // else if ( parseInt(bet.iBetting) > 0 )
                    // {
                    //     //console.log(`#################################################################################################### => Cancel : iBetting : ${bet.iBetting} userCash : ${dbuser.iCash}`);

                    //     // await db.BettingRecords.update({iComplete:2, iBetting:0}, {where:{iTransactionID:paramData.data.transaction_id}});
                    //     // await db.Users.increment({iCash:parseInt(bet.iBetting)}, {where:{strID:iID}});
                    //     // dbuser = await db.Users.findOne({where:{strID:iID}});

                    //     // console.log(`########## => Cancel Complete : iBetting : ${bet.iBetting} userCash : ${dbuser.iCash}`);
                    //     dbuser = await IHelper.GetUserFromID(IAccount.cVender, iID);

                    //     res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
                    // }
                    else
                    {
                        res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
                    }
                }
                else
                {
                    res.json({'result':0, 'status':'OK', 'data':{'balance':dbuser.iCash}});
                }
            }
            else
            {
                res.json({'result':99, 'status':'Error : Invalid Transaction', 'data':{'balance':dbuser.iCash}});
            }
        }
        break;
    case 'status':
        {
            const transactionID = paramData.data.transaction_id;
            //let query = await db.BettingRecords.findOne({where:{iTransactionID:transactionID}});
            const query = await IHelper.GetBet(IAccount.cVender, transactionID);

            console.log(`##### status : iComplete : ${query.iComplete}, iWin : ${query.iWin}, iCash : ${dbuser.iCash}`);

            if ( query.eState == 'REFUND' )
            {
                console.log(`/Status : Bet CANCEL (iCash : ${dbuser.iCash})`);
                res.json({'result':0, 'status':'OK', 'data':{'account':iID, 'transaction_id':transactionID, 'transaction_status':'CANCELED'}});
            }
            else
            {
                //res.json({'result':0, 'status':'OK', 'data':{'account':iID, 'transaction_id':transactionID, 'transaction_status':'OK'}});
                res.json({'result':0, 'status':'OK', 'data':{'account':iID, 'transaction_id':transactionID, 'transaction_status':'CANCELED'}});
            }
        }
        break;
    }
});

module.exports = router;
