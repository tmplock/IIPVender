const express = require('express');
const router = express.Router();

const IHelper = require('../helpers/IHelpers');
const ITime = require('../helpers/ITime');
const IEnum = require('../helpers/IEnum');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const axios = require('axios');

let IAccount = 
{
    cVender: 'HABANERO',
    cCurrency: 'KRW',
    cGameType: 'LIVEGAMES',
    cWebServiceURL:'http://ws-test.insvr.com/hosted.asmx',
    cBrandID:'6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6',
    cAPIKey:'0FB532E4-2E04-4BC1-8BB6-3B79034A0414',
    cGameURL:'https://app-test.insvr.com/go.ashx',
    cPassKey:'uJ6m6DdxW@a3rtt',
    cLanguage:'kr',
};

let GetError = (strResponse, strError) => {
    const objectError = {
        [strResponse] : {
            "status": {
            "success": false,
            "message": strError
            }
        }
    };
    return objectError;
}

router.all('/', async (req, res) => {

    console.log(`/habanero : method (${req.method})`);

    const data = req.method == 'GET' ? req.query : req.body;
    console.log(data);

    if ( data.type == 'playerdetailrequest' )
    {
        console.log(`##### /habanero => playerdetailrequest`);

        const user = await IHelper.GetUserFromToken(IAccount.cVender, data.playerdetailrequest.token);
        if (user === null) {
            const objectError = {
                "playerdetailresponse": {
                    "status": {
                    "success": false,
                    "autherror":true,
                    "message": "Reason for failure description"
                    }
                }
            }
            res.send(objectError);
            return;
        }
    
        const strAgentID = `${user.strAgentCode}-${user.strID}`;

        const objectSuccess = {
            "playerdetailresponse": {
            "status": {
            "success": true,
            "autherror": false,
            "message": ""
            },
            "accountid": strAgentID,
            "accountname": strAgentID,
            "balance": user.iCash,
            "currencycode": IAccount.cCurrency
            }
        };
        res.send(objectSuccess);
    }
    else if ( data.type == 'fundtransferrequest' ) 
    {
        console.log(`##### /habanero => fundtransferrequest`);

        const trans = data.fundtransferrequest;
        console.log(trans);
        const array = trans.funds.fundinfo;
        console.log(array);

        let iCash = 0;

        var user = {};
        let cAmount = 0;
        if (trans.isrefund == true) {
            user = await IHelper.GetUserFromID(IAccount.cVender, trans.accountid);
        }
        else {
            user = await IHelper.GetUserFromToken(IAccount.cVender, trans.token);
            cAmount = parseInt(-array[0].amount);
        }
        if (user != null) {
            if (user.iCash < cAmount) {
                const objectError = {
                    "fundtransferresponse": {
                        "status": {
                            "success": false,
                            "nofunds": true,
                        },
                        "balance": iCash,
                        "currencycode": IAccount.cCurrency,
                    }
                };
                res.send(objectError);
                return;
            }
        }
        else
        {
            const objectError = {
                "fundtransferresponse": {
                    "status": {
                        "success": false,
                        "autherror":true
                    }
                }
            };
            res.send(objectError);
            return;
        }
       if(trans.isrefund == true){
            const strTransactionID = await IHelper.GetBet(IAccount.cVender, trans.funds.refund.originaltransferid);
            const user = await IHelper.GetUserFromID(IAccount.cVender, trans.accountid);
            //const processcancel = await IHelper.ProcessCancel('SM', IAccount.cVender, IAccount.cGameType, '', '', trans.accountid, trans.gamedetails.gametypeid, array[i].transferid, '', 'REFUND', '', cAmount, '');
            if(strTransactionID != null)
            {
                const processcancel = await IHelper.ProcessCancel(trans.accountid, 'SM', IAccount.cVender, trans.funds.refund.originaltransferid);

                if (processcancel == null) {
                    const objectFail = {
                        "fundtransferresponse": {
                            "status": {
                                "success": true,
                                "refundstatus": 2
                            },
                            "balance": user.iCash,
                            "currencycode": IAccount.cCurrency,
                        }
                    }
                    res.send(objectFail);
                    return;
                }
                else {
                    iCash = processcancel.iCash;
                    const objectSuccess = {
                        "fundtransferresponse": {
                            "status": {
                                "success": true,
                                "refundstatus": 1
                            },
                            "balance": iCash,
                            "currencycode": IAccount.cCurrency,
                        }
                    }
                    res.send(objectSuccess);
                    return;
                }
            }
            else
            {
                const objectFail = {
                    "fundtransferresponse": {
                        "status": {
                            "success": true,
                            "refundstatus": 2
                        },
                        "balance": user.iCash,
                        "currencycode": IAccount.cCurrency,
                    }
                }
                res.send(objectFail);
                return;
            }
        }
        for ( let i in array )
        {
            console.log(`Amount : ${array[i].amount}`);

            const cAmount = parseInt(array[i].amount);

            if ( array[i].isbonus == true )
            {
                let cBonusAmount = parseInt(array[i].bonusamount);
                let cAmount = parseInt(array[i].amount);
                const strTransactionID = await IHelper.GetBet(IAccount.cVender, array[i].transferid);
                if(strTransactionID == null)
                {
                    if ( cBonusAmount>=0 || cAmount >= 0)
                    {
                        //const processwin = await IHelper.ProcessWin('SM', IAccount.cVender, IAccount.cGameType, '',  '', trans.accountid, trans.bonusdetails.couponid, array[i].transferid, '', 'WIN', 0, cBonusAmount, '', 200);
                        const processwin = await IHelper.ProcessWin(trans.accountid, 'SM', IAccount.cVender, trans.gamedetails.keyname, '', trans.gamedetails.gametypeid, cAmount, 0, 'BONUS', array[i].transferid, 200);
                        if ( processwin == null )
                        {
                            console.log(`Error : fundtransferresponse 2`);
                            const objectError = GetError("fundtransferresponse", "Couldn't create a transaction at fundtransferresponse");
                            res.send(objectError);
                            return;
                        }
                        else
                        {
                            iCash = processwin.iCash;
                        }
                        }
                    else if( cBonusAmount < 0)
                    {
                        //const processbet = await IHelper.ProcessBet('SM', IAccount.cVender, IAccount.cGameType, '', '', trans.accountid, trans.gamedetails.keyname, array[i].transferid, '', 'BET', 0, -BonusAmountount, '', 200, 0);
                        const processbet = await IHelper.ProcessBet(trans.accountid, 'SM', IAccount.cVender, trans.accountid, '', trans.gamedetails.keyname, cBonusAmount, 0, '', array[i].transferid, 200);
                        if ( processbet == null )
                        {
                            console.log(`Error : fundtransferresponse 3`);
                            const objectError = GetError("fundtransferresponse", "Couldn't create a transaction at fundtransferresponse");
                            res.send(objectError);
                            return;
                        }
                        else
                        {
                            iCash = processbet.iCash;
                        }
                    }
                }
                else
                {
                    const user = await IHelper.GetUserFromID(IAccount.cVender, trans.accountid);
                    iCash = user.iCash;
                }
            }
            else
            {
                const strTransactionID = await IHelper.GetBet(IAccount.cVender, array[i].transferid);
                if(strTransactionID == null)
                {
                    if ( cAmount > 0 )  // Win/Credit
                    {
                        console.log(`########### Win : cAmount (${cAmount})`);

                        if ( array[i].jpwin == true )
                        {
                            //const processwin = await IHelper.ProcessWin('SM', IAccount.cVender, IAccount.cGameType, '',  '', trans.accountid, trans.gamedetails.gametypeid, array[i].transferid, '', 'WIN', 0, cAmount, '', 200);
                            const processwin = await IHelper.ProcessWin(trans.accountid, 'SM', IAccount.cVender, trans.gamedetails.keyname, '', trans.gamedetails.gametypeid, cAmount, 0, 'JACKPOT', array[i].transferid, 200);
                            if ( processwin == null )
                            {
                                console.log(`Error : fundtransferresponse 4`);
                                const objectError = GetError("fundtransferresponse", "Couldn't create a transaction at fundtransferresponse");
                                res.send(objectError);
                                return;
                            }
                            else
                            {
                                iCash = processwin.iCash;
                            }
                        }
                        else
                        {
                            //const processwin = await IHelper.ProcessWin('SM', IAccount.cVender, IAccount.cGameType, '',  '', trans.accountid, trans.gamedetails.gametypeid, array[i].transferid, '', 'WIN', 0, cAmount, '', 200);
                            const processwin = await IHelper.ProcessWin(trans.accountid, 'SM', IAccount.cVender, trans.gamedetails.keyname, '', trans.gamedetails.gametypeid, cAmount, 0, '', array[i].transferid, 200);
                            if ( processwin == null )
                            {
                                console.log(`Error : fundtransferresponse 5`);
                                const objectError = GetError("fundtransferresponse", "Couldn't create a transaction at fundtransferresponse");
                                res.send(objectError);
                                return;
                            }
                            else
                            {
                                iCash = processwin.iCash;
                            }
                        }
                    }
                    else if ( cAmount < 0 ) //  Bet/Debit
                    {
                        //const processbet = await IHelper.ProcessBet('SM', IAccount.cVender, IAccount.cGameType, '', '', trans.accountid, trans.gamedetails.keyname, array[i].transferid, '', 'BET', 0, -cAmount, '', 200, 0);
                        const processbet = await IHelper.ProcessBet(trans.accountid, 'SM', IAccount.cVender, trans.gamedetails.keyname, '', trans.gamedetails.gametypeid, -cAmount, 0, '', array[i].transferid, 200);
                        if ( processbet == null )
                        {
                            console.log(`Error : fundtransferresponse 6`);
                            const objectError = GetError("fundtransferresponse", "Couldn't create a transaction at fundtransferresponse");
                            res.send(objectError);
                            return;
                        }
                        else
                        {
                            iCash = processbet.iCash;
                        }
                    }
                    else
                    {
                        console.log(`amount : 0`);
                        const user = await IHelper.GetUserFromID(IAccount.cVender, trans.accountid);
                        if ( user != null )
                        {
                            console.log(`=========== user.iCash : ${user.iCash}`);
                            console.log(user);

                            iCash = user.iCash;
                        }
                        else
                        {
                            const objectError = {
                                "fundtransferresponse": {
                                    "status": {
                                        "success": false,
                                        "autherror":true
                                    }
                                }
                            };
                            res.send(objectError);
                            return;
                        }
                    }
                }
                else
                {
                    const user = await IHelper.GetUserFromID(IAccount.cVender, trans.accountid);
                    iCash = user.iCash;
                }
            }
        }

        if ( trans.funds.debitandcredit == true )
        {
            const objectSuccess = {
                "fundtransferresponse": {
                    "status": {
                        "success": true,
                        "successdebit": true,
                        "successcredit": true

                    },
                    "balance": iCash,
                    "currencycode": IAccount.cCurrency
                }
            };
            res.send(objectSuccess);
        }
        else
        {
            const objectSuccess = {
                "fundtransferresponse": {
                    "status": {
                        "success": true,
                    },
                    "balance": iCash,
                    "currencycode": IAccount.cCurrency
                }
            };
            res.send(objectSuccess);
        }
    }
    else if ( data.type == 'queryrequest' )
    {
        console.log(`##### /habanero => fundtransferrequest`);

        const strTransactionID = data.queryrequest.transferid;
        console.log(`strTransactionID : ${strTransactionID}`);
        const processrequset = await IHelper.GetBet(IAccount.cVender,strTransactionID);

        console.log("GequeryrequesttBet!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(processrequset);

        if(processrequset != null)
        {
            const objectSuccess = {
                "fundtransferresponse": {
                    "status": {
                    "success": true,
                    }
                }
            };
            res.send(objectSuccess);
        }
        else
        {
            const objectError = {
                "fundtransferresponse": {
                    "status": {
                    "success": false,
                    }
                }
            };
            res.send(objectError);
        }
    }
    else if ( data.type == 'altfundsrequest' )
    {
        const alt = data.altfundsrequest;
        const cAmount = parseInt(alt.amount);
        const strTransactionID = await IHelper.GetBet(IAccount.cVender, alt.transferid);
        if(strTransactionID == null)
        {
            //const processwin = await IHelper.ProcessWin('SM', IAccount.cVender, IAccount.cGameType, '',  '', alt.accountid, alt.altcredittype, alt.transferid, '', 'WIN', 0, cAmount, '', 200);
            const processwin = await IHelper.ProcessWin(alt.accountid, 'SM', IAccount.cVender, alt.altcredittype, '', 0, cAmount, 0, alt.description, alt.transferid, 200);

            if ( processwin != null )
            {
                const objectSuccess = {
                    "altfundsresponse": {
                    "status": {
                        "success": true
                        },
                    "balance": processwin.iCash,
                    "currencycode": IAccount.cCurrency
                    }
                }
                res.send(objectSuccess);
            }
            else
            {
                // const objectError = {
                //     "altfundsresponse": {
                //         "status": {
                //         "success": false,
                //         "message": "Couldn't create a transaction at altfundrequest"
                //         }
                //     }
                // }
                const objectError = ("altfundsresponse", "Couldn't create a transaction at altfundrequest");
                res.send(objectError);
            }
        }
        else
        {
            const user = await IHelper.GetUserFromID(IAccount.cVender, alt.accountid);
            const objectFail = {
                "altfundsresponse": {
                "status": {
                    "success": true
                    },
                "balance": user.iCash,
                "currencycode": IAccount.cCurrency,
                }
            }
            res.send(objectFail);
        }
    }
    else if(data.type == 'playerendsession')
    {
        res.status(200).send({ message: "Logout successful" });
        //window.close();
    }
});

// const objectError = GetError('altfundsresponse', 'test');
// console.log(objectError);

let GetGameURL = async (strAgentCode, strID, strSecretCode, strGameKey, strReturnURL) => {

    const cToken = await IHelper.BuildToken(16);
    if ( cToken != '' )
    {
        //const url = `https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6?keyname=SGAllForOne?token=4ca603adf8c1497bb4ce30d0b57986bb?mode=real?locale=kr`;

        //const url = `https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=${req.body.symbol}&token=${cToken}&mode=real&locale=kr`;
        const url = `https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=${strGameKey}&token=${cToken}&mode=real&locale=kr`;
        
        // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=8b6711f9-f740-497c-9a63-ebffc9f833f1&token=4cc2bd6b3d7900045d62519e395ba515&mode=real&locale=kr
        // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=8b6711f9-f740-497c-9a63-ebffc9f833f1&token=4cc2bd6b3d7900045d62519e395ba515&mode=real&locale=kr
        const strAgentID = `${strAgentCode}-${strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, strAgentCode, strSecretCode, strReturnURL);
        if ( bResult == true )
        {
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

    console.log(`##################################################/habanero/game`);
    console.log(req.body);
    
    // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6?keyname=SGAllForOne?token=4ca603adf8c1497bb4ce30d0b57986bb?mode=real?locale=kr

    // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&keyname=SGArcticWonders&mode=fun&locale=kr

    // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&keyname=HBGAMELOBBY&mode=fun&locale=kr

    // https://app-test.insvr.com/help/game?keyname=<SGArcticWonders>&locale=kr
    const cToken = await IHelper.BuildToken(16);
    if ( cToken != '' )
    {
        //const url = `https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6?keyname=SGAllForOne?token=4ca603adf8c1497bb4ce30d0b57986bb?mode=real?locale=kr`;
        const url = `https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=${req.body.symbol}&token=${cToken}&mode=real&locale=kr`;
        // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=8b6711f9-f740-497c-9a63-ebffc9f833f1&token=4cc2bd6b3d7900045d62519e395ba515&mode=real&locale=kr
        // https://app-test.insvr.com/go.ashx?brandid=6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6&brandgameid=8b6711f9-f740-497c-9a63-ebffc9f833f1&token=4cc2bd6b3d7900045d62519e395ba515&mode=real&locale=kr
        const strAgentID = `${req.body.strAgentCode}-${req.body.strID}`;
        const bResult = await IHelper.UpdateToken(strAgentID, cToken, req.body.strAgentCode, req.body.strSecretCode);
        if ( bResult == true )
        {
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

let GetSlotList = async () => {

    let gameList = [];
    try{
        const    data =  {
                'BrandId':'6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6',
                'APIKey':'0FB532E4-2E04-4BC1-8BB6-3B79034A0414',
            }

        const res = await axios.post('https://ws-test.insvr.com/jsonapi/getgames', data, {headers: {"content-type": "application/json",'Accept-Encoding': 'gzip,deflate,compress'}});

        console.log(res.data.Games[0]);
        
        for (let i in res.data.Games)
        {
            const game = res.data.Games[i];
            //gameList.push({gameID:game.BrandGameId, gameName:game.KeyName, imgUrl:`https://app-test.insvr.com/img/square/400/${game.KeyName}.png`});
            gameList.push({
                id:game.BrandGameId, 
                title:game.KeyName, 
                thumbnail:`https://app-test.insvr.com/img/square/400/${game.KeyName}.png`
            });
        }
    }
    catch (err) {
        console.log('err', err);
    }
    //res.send({eResult:'OK', data:gameList});
    return {eResult:'OK', data:gameList};
}

router.post('/request_listsm', async (req, res) => {

    console.log(`##################################################/habanero/request_listsm`);
    console.log(req.body);

    
    let gameList = [];
    try{
        
        // const res = await axios({
        //     method: 'post',
        //     url: 'https://ws-test.insvr.com/jsonapi/getgames',
        //     headers: {"content-type": "application/json",}, 
        //     data: {
        //         'BrandId':'6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6',
        //         'APIKey':'0FB532E4-2E04-4BC1-8BB6-3B79034A0414',
        //     }
        // });

        const    data =  {
                'BrandId':'6a9f57e3-8c0d-ed11-bd6e-501ac59ac9e6',
                'APIKey':'0FB532E4-2E04-4BC1-8BB6-3B79034A0414',
            }

        const res = await axios.post('https://ws-test.insvr.com/jsonapi/getgames', data, {headers: {"content-type": "application/json",'Accept-Encoding': 'gzip,deflate,compress'}});

        //console.log(res.data);
        console.log(res.data.Games[0]);

        
        
        for (let i in res.data.Games)
        {
            const game = res.data.Games[i];
            //gameList.push({gameID:game.BrandGameId, gameName:game.KeyName, imgUrl:`https://app-test.insvr.com/img/square/400/${game.KeyName}.png`});
            gameList.push({
                id:game.BrandGameId, 
                title:game.KeyName, 
                thumbnail:`https://app-test.insvr.com/img/square/400/${game.KeyName}.png`
            });
        }
        // <img class="gameimg" src="<%= gameList[i].imgUrl %>" alt="<%= gameList[i].gameName %>" onclick="GoGame('SM_PP', '<%= gameList[i].gameID %>');">
        // res.send({eResult:'OK', data:gameList});
        // return;
    }
    catch (err) {
        console.log('err', err);
    }

//     cale is optional and defaults to English (en). See the Addendum for locale codes. If no localised image
// exists, the English version will be displayed.
// Examples:
// https://app-test.insvr.com/img/oval/200/SGArcticWonders_zh-CN.png
// https://app-test.insvr.com/img/square/400/SGSirensSpell.png
// https://app-test.insvr.com/img/rect/300/SGArcticWonders.png
// https://app-test.insvr.com/img/circle/300/SGArcticWonders.png

    // const secureLogin = 'iipcorp_iipkr';

    // const data = makeParamsEx({ secureLogin });
    // const hash = md5(`${data}${IAccount.cSecretKey}`);

    // const apiUrl = IAccount.cAPIURL;

    // let gameList = [];
    // let error = "0";
    // let description = 'url';

    // try {
    //     const headers = {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "Cache-Control": "no-cache",
    //     };

    //     const res = await axios.post(
    //         apiUrl + '/getCasinoGames/',
    //         `${data}&hash=${hash}`,
    //         { headers }
    //     );

    //     gameList = res.data.gameList;
    //     error = res.data.error;
    //     description = res.data.description;

    // } catch (err) {
    //     console.log('err', err);
    // }

    // gameList.forEach((element) => {
    //     element.imgUrl = `https://api-sg0.ppgames.net/game_pic/rec/325/${element.gameID}.png`;
    // });

    //res.render('pp/slot', { gameList });
    res.send({eResult:'OK', data:gameList});
})

router.post('/auth', async (req, res) => {

    console.log(`##################################################/habanero/auth`);
    console.log(req.body);

    /*
        username : 
        passkey : 
        machinename : 
        locale : 
        brandid : 
    */


});

router.post('/tx', async (req, res) => {
    
    console.log(`##################################################/habanero/tx`);
    console.log(req.body);


});

router.post('/query', async (req, res) => {
    
    console.log(`##################################################/habanero/query`);
    console.log(req.body);



});

router.post('/altcredit', async (req, res) => {
    
    console.log(`##################################################/habanero/altcredit`);
    console.log(req.body);

});

module.exports = {
    router:router,
    GetGameURL:GetGameURL,
    GetSlotList:GetSlotList
};
