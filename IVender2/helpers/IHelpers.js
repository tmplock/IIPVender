const moment = require('moment');
const crypto = require('crypto')
const dayjs = require('dayjs')
const md5 = require('md5')
const { XMLBuilder } = require('fast-xml-parser')
const { default: axios } = require('axios');

const db = require('../db');
const redis = require('../redis');

const strCallbackURL = 'http://165.22.102.70:3070/game';

exports.AddDB = async (objectDB) => {

    await redis.SetCache(objectDB.strTransactionID, objectDB);
 }

exports.FindDB = async (strTransactionID) => {

    let data = await redis.GetCache(strTransactionID);
    if ( data != null )
    {
        return JSON.parse(data);
    }
    return null;
}

exports.makeVivoXMLResult = (request, response) => {
    const obj = {
        VGSSYSTEM: {
            REQUEST: this.toUpperKeys(request),
            TIME: dayjs().format('DD MMM YYYY HH-mm-ss'),
            RESPONSE: this.toUpperKeys(response),
        },
    }

    const builder = new XMLBuilder({
        arrayNodeName: 'VGSSYSTEM',
    })

    const result = `<?xml version="1.0" encoding="UTF-8"?>${builder.build(obj)}`
    console.log('xmlresult', result)

    return result
}

exports.toUpperKeys = (obj) => {
    return Object.keys(obj).reduce((accumulator, key) => {
        accumulator[key.toUpperCase()] = obj[key]
        return accumulator
    }, {})
}

exports.toLowerKeys = (obj) => {
    return Object.keys(obj).reduce((accumulator, key) => {
        accumulator[key.toLowerCase()] = obj[key]
        return accumulator
    }, {})
}

exports.verificationMD5Hash = (value, hash) => {
    if (md5(value) !== hash) {
        return false
    }
    return true
}

exports.getRandomBytes = async (byteSize) => {
    return await new Promise((resolve, reject) => {
        crypto.randomBytes(byteSize, (err, buffer) => {
            if (err) {
                reject(-1)
            }
            resolve(buffer.toString('hex'))
        })
    })
}

exports.makePopupUrl = (title, url) => {
    // return `window.open('${url}','${title}', 'width=1024, height=768, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no');`
    return `window.open('${url}','${title}', 'width=2200, height=1500, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no');`
}

//

let RequestAxios = async (strAddress, objectData) =>
{
    console.log(`RequestAxios ${strAddress}`);
    console.log(objectData);

    try {

        const customAxios = axios.create({});
        const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json',"Accept-Encoding": "*"}});
        console.log(response.data);
        if ( response.data.result == 'OK' )
            return {result:'OK', data:response.data};
        else if ( response.data.result == 'Error' )
            return {result:'Error', data:response.data};
        else
            return {result:'error', error:response.data.error};    
    }
    catch (error) {
        console.log('axios error', error);
        return {result:'error', error:'axios'};
    }
}

exports.RequestAxios = RequestAxios;

// exports.RequestAxios = async (strAddress, objectData) =>
// {
//     console.log(`RequestAxios ${strAddress}`);
//     console.log(objectData);

//     try {

//         const customAxios = axios.create({});
//         const response = await customAxios.post(strAddress, objectData, {headers:{ 'Content-type': 'application/json'}});
//         console.log(response.data);
//         if ( response.data.result == 'OK' )
//             return {result:'OK', data:response.data};
//         else
//             return {result:'error', error:response.data.error};    
//     }
//     catch (error) {
//         console.log('axios error', error);
//         return {result:'error', error:'axios'};
//     }
// }

exports.UpdateToken = async (strID, strToken, strLaunchToken, strAgentCode, strSecretCode, strReturnURL) => {
    
    console.log(`IHelper::UpdateToken : ${strID}, ${strToken}, strAgentCode : ${strAgentCode}, strSecretCode : ${strSecretCode}, strReturnURL : ${strReturnURL}`);

    //const user = await db.Users.findOne({where:{strAgentCode:strAgentCode, strSecretCode:strSecretCode}});
    const user = await db.Users.findOne({where:{strAgentCode:strAgentCode}});

    // let strCallbackURL = strReturnURL;
    // if ( strReturnURL != 'https://tlrp888.uk/game' && strReturnURL != 'http://tlrp888.uk/game' )
    // {
    //     strCallbackURL = 'https://tlrp888.uk/game';
    // }
        

    if ( null != user )
    {
        const token = await db.Tokens.findOne({where:{strID:strID, strAgentCode:strAgentCode}});
        if ( token == null )
        {
            await db.Tokens.create(
                {
                    strID: strID,
                    strToken: strToken,
                    strLaunchToken:strLaunchToken,
                    strAgentCode: strAgentCode,
                    strSecretCode: strSecretCode,
                    strCallbackURL: user.strCallbackURL,
                    //strCallbackURL: strCallbackURL,
                    //iAuth:0
                }
            );
            //await db.Users.update({});
        }
        else
        {
            console.log(`IHelper::UpdateToken : Updated Token to ${strToken}`);
            //await db.Tokens.update({strToken:strToken, strCallbackURL:user.strCallbackURL}, {where:{strID:strID, strAgentCode:strAgentCode}});
            await db.Tokens.update({strToken:strToken, strLaunchToken:strLaunchToken, strCallbackURL:strReturnURL, iAuth: 0}, {where:{strID:strID, strAgentCode:strAgentCode}});
            //await db.Tokens.update({strToken:strToken, strLaunchToken:strLaunchToken, strCallbackURL:strCallbackURL}, {where:{strID:strID, strAgentCode:strAgentCode}});

            //console.log(`############################################################################################## UpdateToken : ${strReturnURL}, ${strCallbackURL}`);
        }
        return true;
    }
    else
    {
        await db.Tokens.create(
            {
                strID: strID,
                strLaunchToken:strLaunchToken,
                strToken: strToken,
                strAgentCode: strAgentCode,
                strSecretCode: strSecretCode,
                strCallbackURL: user.strCallbackURL,
                //strCallbackURL: strCallbackURL,
                //iAuth:0
            }
        );
    }

    return false;
}

let GetUserFromTokenAtTokenDB = async (strToken) => {

    console.log(`IHelper::GetUserFromTokenAtTokenDB : ${strToken}`);

    let token = await db.Tokens.findOne({where:{strToken:strToken}});
    if ( token != null )
    {
        //const objectData = {strID:token.strID, strAgentCode:token.strAgentCode, strCallbackURL:token.strCallbackURL, iAuth:token.iAuth};
        const objectData = {strID:token.strID, strAgentCode:token.strAgentCode, strCallbackURL:token.strCallbackURL};

        return objectData;
    }
    return null;
}

exports.GetUserFromTokenAtTokenDB = GetUserFromTokenAtTokenDB;

let GetIDFromAgentID = (strAgentID) => {

    const array = strAgentID.split('-');
    if ( array.length != 2 )
        return null;

    return {strAgentCode:array[0], strID:array[1]};
}

let GetUserFromAgentIDAtTokenDB = async (strAgentID) => {

    // const array = strAgentID.split('.');
    // if ( array.length != 2 )
    //     return null;
    const objectID = GetIDFromAgentID(strAgentID);
    console.log(objectID);
    if ( objectID == null )
        return null;

    console.log(`GetUserFromAgentIDAtTokenDB`);

    let token = await db.Tokens.findOne({where:{strID:strAgentID}});
    console.log(token);
    if ( token != null )
    {
        //const objectData = {strID:objectID.strID, strAgentCode:token.strAgentCode, strCallbackURL:token.strCallbackURL, strToken:token.strToken, ezugiToken:token.ezugiToken};
        const objectData = {strID:objectID.strID, strAgentCode:token.strAgentCode, strCallbackURL:token.strCallbackURL, strToken:token.strToken};

        return objectData;
    }
    return null;
}

exports.BuildToken = async (byteSize) => {
    return await new Promise((resolve, reject) => {
        crypto.randomBytes(byteSize, (err, buffer) => {
            if (err) {
                reject(-1)
            }
            resolve(buffer.toString('hex'))
        })
    })
}


exports.GetUnixTimeStamp = () => {
    return Math.floor(new Date().getTime());
    //return Math.floor(new Date().getTime()/10);
    //return Math.floor(Date().now() / 1000);
}

// exports.GetUnixTimeStampWithTime = (strDate) => {

//     return Math.floor(new Date(strDate).getTime()/1000);
// }
exports.GetUserFromLaunchToken = async (strVender, strLaunchToken) => {

    console.log(`IHelper::GetUserFromLaunchToken : ${strLaunchToken}`);

    const token = await db.Tokens.findOne({where:{strLaunchToken:strLaunchToken}});
    if ( token )
    {
        const objectID = GetIDFromAgentID(token.strID);
        //let objectData = {strVender:strVender, strToken:token.strToken};
        let objectData = {strVender:strVender, strID:objectID.strID};
        //const cAddress = `${token.strCallbackURL}/authenticate`;
        const cAddress = `${strCallbackURL}/authenticate`;
        let res_axios = await RequestAxios(cAddress, objectData);
    
        if ( res_axios.result == 'OK' )
        {
            const strAgentID = `${token.strAgentCode}-${res_axios.data.strID}`;

            return {strAgentID:token.strID, strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strIP: res_axios.data.strIP, strToken: token.strToken};
        }
    }

    return null;
}

exports.GetUserFromToken = async (strVender, strToken) => {

    console.log(`IHelper::GetUserFromToken : ${strToken}`);

    const token = await GetUserFromTokenAtTokenDB(strToken);

    if ( token != null )
    {
        let objectData = {strVender:strVender, strToken:strToken};
        // const cAddress = 'http://localhost:3010/game/authenticate';
        //const cAddress = `${token.strCallbackURL}/authenticate`;
        const cAddress = `${strCallbackURL}/authenticate`;
        let res_axios = await RequestAxios(cAddress, objectData);
        console.log(res_axios);
    
        if ( res_axios.result == 'OK' )
        {
            const strAgentID = `${token.strAgentCode}-${res_axios.data.strID}`;

            //return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID};
            //return {strID:strAgentID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID};
            return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strIP: res_axios.data.strIP, iAuth: token.iAuth};
        }
    }

    // let objectData = {strVender:strVender, strToken:strToken};
    // const cAddress = 'http://165.22.102.70:3010/game/authenticate';
    // let res_axios = await RequestAxios(cAddress, objectData);
    // console.log(res_axios);

    // if ( res_axios.result == 'OK' )
    // {
    //     return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID};
    // }

    return null;
}

//exports.GetUserFromID = async (strVender, strID) => {
exports.GetUserFromID = async (strVender, strAgentID) => {

    const token = await GetUserFromAgentIDAtTokenDB(strAgentID);

    console.log(`GetUserFromID`);
    console.log(token);

    if ( null != token )
    {
        let objectData = {strVender:strVender, strID:token.strID};
        //const cAddress = 'http://165.22.102.70:3010/game/authenticate';
        ///const cAddress = `${token.strCallbackURL}/authenticate`;
        const cAddress = `${strCallbackURL}/authenticate`;
        let res_axios = await RequestAxios(cAddress, objectData);
        console.log(res_axios);
    
        if ( res_axios.result == 'OK' )
        {
            //return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strToken:token.strToken, ezugiToken:token.ezugiToken};
            return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strToken:token.strToken};
        }
    }
    return null;
}

exports.CheckUserFromID = async (strVender, strAgentID) => {

    const token = await GetUserFromAgentIDAtTokenDB(strAgentID);

    if ( null != token )
    {
        return token;
    }
    return null;
}

exports.GetUserFromTransactionID = async (strVender, strTransactionID) => {

    console.log(`IHelper::GetUserFromTransactionID : ${strTransactionID}`);

    let ret = await db.transactions.findOne({where:{strTransactionID:strTransactionID}});

    if ( ret != null )
    {
        const strAgentID = `${ret.strAgentCode}-${ret.strID}`;

        const token = await GetUserFromAgentIDAtTokenDB(strAgentID);

        if ( null != token )
        {
            //const objectID = GetIDFromAgentID(strAgentID);
            let objectData = {strVender:strVender, strID:ret.strID};
            // const cAddress = 'http://localhost:3010/game/authenticate';
            //const cAddress = `${token.strCallbackURL}/authenticate`;
            const cAddress = `${strCallbackURL}/authenticate`;
            let res_axios = await RequestAxios(cAddress, objectData);
            console.log(res_axios);
        
            if ( res_axios.result == 'OK' )
            {
                //const strAgentID = `${token.strAgentCode}-${res_axios.data.strID}`;

                //return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strIP: res_axios.data.strIP, iAuth: token.iAuth};
                return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strIP: res_axios.data.strIP};
            }
        }
    }

    return null;
}

exports.CheckUserFromTransactionID = async (strVender, strTransactionID) => {

    console.log(`IHelper::GetUserFromTransactionID : ${strTransactionID}`);

    let ret = await db.transactions.findOne({where:{strTransactionID:strTransactionID}});

    if ( ret != null )
    {
        const strAgentID = `${ret.strAgentCode}-${ret.strID}`;

        const token = await GetUserFromAgentIDAtTokenDB(strAgentID);

        if ( null != token )
        {
            return token;
        }
    }

    return null;
}

exports.GetBetFromID = async (strVender, strAgentID, strRoundID) => {

    const objectID = GetIDFromAgentID(strAgentID);


    let bet = await db.transactions.findOne({where:{strID:objectID.strID, strRoundID:strRoundID}});
    // let bet = null;

    // switch ( strVender )
    // {
    // case 'WE':
    //     bet = await db.transactionWE.findOne({where:{strID:strID, strRoundID:strRoundID}});
    //     break;
    // case 'EZUGI':
    //     bet = await db.transactionEzugi.findOne({where:{strID:strID, strRoundID:strRoundID}});
    //     break;
    // case 'VIVO':
    //     bet = await db.transactionVivo.findOne({where:{strID:strID, strRoundID:strRoundID}});
    //     break;
    // }

    return bet;
}

// exports.GetBetFromID = async (strVender, strID, strRoundID) => {

//     let bet = await db.transactions.findOne({where:{strID:strID, strRoundID:strRoundID}});
//     // let bet = null;

//     // switch ( strVender )
//     // {
//     // case 'WE':
//     //     bet = await db.transactionWE.findOne({where:{strID:strID, strRoundID:strRoundID}});
//     //     break;
//     // case 'EZUGI':
//     //     bet = await db.transactionEzugi.findOne({where:{strID:strID, strRoundID:strRoundID}});
//     //     break;
//     // case 'VIVO':
//     //     bet = await db.transactionVivo.findOne({where:{strID:strID, strRoundID:strRoundID}});
//     //     break;
//     // }

//     return bet;
// }

// exports.GetBet = async (strVender, strTransactionID) => {

//     let bet = await db.transactions.findOne({where:{strVender:strVender, strTransactionID:strTransactionID}});
//     return bet;
// }
// exports.GetWin = async (strVender, strTransactionID) => {

//     let bet = await db.transactions.findOne({where:{strVender:strVender, strDesc:strTransactionID}});
//     return bet;
// }

// exports.UpdateAgentCash = async (strAgentCode, iAmount) => {

//     if ( iAmount != 0 )
//         await db.Users.increment({iCash:iAmount}, {where:{strAgentCode:strAgentCode}});
// }

// //exports.CreateBet = async (eGameType, strAgentCode, strVender, strUnique, strHash, strID, strGameType, strGameID, strRoundID, strAmount, strDesc, strTarget, strTimeStamp, strDetail, strTransactionID, eType, eState) => {
// exports.CreateBet = async (strAgentCode, strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, strBalance, strTarget, strDesc, strTransactionID, eType, eState) =>
// {
//     let ret = await db.transactions.create(
//         {
//             strAgentCode:strAgentCode,
//             strID:strID,
//             eGameType:eGameType,
//             strVender:strVender,
//             iGameCode:iGameCode,
//             strGameID:strGameID,
//             strTableID:strTableID,
//             strRoundID:strRoundID,
//             strAmount:strAmount,
//             strBalance:strBalance,
//             strTarget:strTarget,
//             strDesc:strDesc,
//             strTransactionID:strTransactionID, 
//             eType:eType,
//             eState:eState,
//         });
//     return ret;
// }
// //}

//exports.ProcessBet = async (eGameType, strVender, strGameType, strHash, strToken, strAgentID, strGameID, strBetID, strRoundID, strBetType, strTarget, strAmount, strDesc, iGameCode, iBetAccount) => {
//exports.ProcessBet = async (eGameType, strVender, strAgentID, strGameID, strBetID, strRoundID, strBetType, strTarget, strAmount, strDesc, iGameCode, iBetAccount) => {

/*
*/
exports.AxiosBet = async (cAddress, strAgentCode, strID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

    try {

        let objectData = {
            strID:strID, 
            strToken:'', 
            iGameCode:iGameCode, 
            strVender:strVender, 
            strGameID:strGameID, 
            strTableID:strTableID,
            strRoundID:strRoundID, 
            strTransactionID:strTransactionID, 
            strTarget:strTarget, 
            strAmount:strAmount, 
            strDesc:strDesc
        };

        const res_axios = await RequestAxios(cAddress, objectData);

        console.log('########## Axios Bet')
        console.log(res_axios.data);

        if ( res_axios.result != undefined && res_axios.result != null && res_axios.result == 'OK' )
        //if ( res_axios.res)
        {
            return res_axios.data;            
        }
        else if ( res_axios.result != undefined && res_axios.result != null && res_axios.result == 'Error' )
        {
            return res_axios.data;            
        }
        else
        {
            return null;
        }


    } catch (err) {
        console.error(`Error occurred when requesting to ${cAddress}: ${err}`);
        return null;
    }
}

// exports.ProcessBet = async (strAgentID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

//     const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
//     console.log(token);
//     if ( null != token )
//     {
//         const cAddress = `${token.strCallbackURL}/bet`;
//         const req = await this.AxiosBet(cAddress, token.strAgentCode, token.strID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode);
//         console.log(`##### ProcessBet : ${req.result}`);
//         if ( req != null )
//         {
//             console.log(`ProcessBet : ${req.result}`);
//             if ( req.result == 'OK' )
//             {
//                 //await this.UpdateAgentCash(token.strAgentCode, -parseFloat(strAmount));
//                 const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, req.iCash, strTarget, strDesc, strTransactionID, 'BET', 'COMPLETE');
//                 return {iCash:req.iCash, iBetID:bet.id, eState:'COMPLETE', createdAt:bet.createdAt};
//             }
//             else
//             {
//                 return {iCash:-99999, iBalance:req.iCash};
//             }
//         }
//         else
//         {
//             const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, 0, strTarget, strDesc, strTransactionID, 'BET', 'PENDING');
//             return {iCash:0, iBetID:bet.id, eState:'PENDING', createdAt:bet.createdAt};
//         }
//     }

//     return null;
// }

exports.AxiosWin = async (cAddress, strAgentCode, strID, eGameType, strVender, strGameID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

    let objectData = {
        strID:strID, 
        strToken:'', 
        strVender:strVender, 
        strGameID:strGameID, 
        strRoundID:strRoundID, 
        strTransactionID:strTransactionID, 
        strTarget:strTarget, 
        strAmount:strAmount, 
        strDesc:strDesc, 
        iGameCode:iGameCode
    };
    try {
        const res_axios = await RequestAxios(cAddress, objectData);
        if ( res_axios.result != undefined && res_axios.result != null && res_axios.result == 'OK' )
        {
            return res_axios.data;            
        }
        else
        {
            return null;
        }
    } catch (err) {
        console.error(`Error occurred when requesting to ${cAddress}: ${err}`);
        return null;
    }
}

// exports.ProcessWin = async (strAgentID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

//     const token = await GetUserFromAgentIDAtTokenDB(strAgentID);

//     if ( null != token )
//     {
//         const cAddress = `${token.strCallbackURL}/win`;
//         const req = await this.AxiosBet(cAddress, token.strAgentCode, token.strID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode);
//         if ( req != null )
//         {
//             //await this.UpdateAgentCash(token.strAgentCode, -parseFloat(strAmount));
//             const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, req.iCash, strTarget, strDesc, strTransactionID, 'WIN', 'COMPLETE');
//             return {iCash:req.iCash, eState:'COMPLETE', createdAt:bet.createdAt};
//         }
//         else
//         {
//             const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, 0, strTarget, strDesc, strTransactionID, 'WIN', 'PENDING');
//             return {iCash:0, eState:'PENDING', createdAt:bet.createdAt};
//         }
//     }

//     return null;
// }

exports.AxiosCancel = async (cAddress, strID, strVender, strTransactionID, strGameID, strRound, eType) => {

    let objectData = {
        strVender:strVender, 
        strID:strID,
        strTransactionID:strTransactionID,
        strGameID:strGameID,
        strRound:strRound,
        eType:eType
    };

    try {
        const res_axios = await RequestAxios(cAddress, objectData);
        if ( res_axios.result != undefined && res_axios.result != null && res_axios.result == 'OK' )
        {
            return res_axios.data;            
        }
        else
        {
            return null;
        }
    } catch (err) {
        console.error(`Error occurred when requesting to ${cAddress}: ${err}`);
        return null;
    }
}

// exports.ProcessCancel = async (strAgentID, eGameType, strVender, strTransactionID) => {
//     console.log("ProcessCancel !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//     console.log(strAgentID);
//     console.log(strTransactionID);
//     const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
//     //transactionID

//     if ( null != token )
//     {
//         const cAddress = `${token.strCallbackURL}/cancel`;
//         const req = await this.AxiosCancel(cAddress, token.strAgentCode, token.strID, eGameType, strVender, strTransactionID);

//         if ( req != null )
//         {
//             let list = await db.transactions.findAll({where:{strTransactionID:strTransactionID}});
//             for ( let i in list )
//             {
//                 if ( list[i].eType == 'BET' )
//                 {
//                     await this.UpdateAgentCash(token.strAgentCode, parseFloat(list[i].strAmount));
//                 }
//                 else if ( list[i].eType == 'WIN' )
//                 {
//                     await this.UpdateAgentCash(token.strAgentCode, -parseFloat(list[i].strAmount));
//                 }
//             }

//             await db.transactions.update({eType:'REFUND', strBalance:req.iCash}, {where:{strTransactionID:strTransactionID}});

//             //await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, 0, '', '', 0, 0, '', '', strTransactionID, 'REFUND', 'COMPLETE');
//             return {iCash:req.iCash, eState:'COMPLETE'};
//         }
//         else
//         {
//             return null;
//         }
//     }
//     return null;    
// }
// exports.ProcessCancel = async (strAgentID, eGameType, strVender, strTransactionID) => {
//     console.log("ProcessCancel !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//     console.log(strAgentID);
//     console.log(strTransactionID);
//     const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
//     //transactionID

//     if ( null != token )
//     {
//         const cAddress = `${token.strCallbackURL}/cancel`;

//         let refund = await db.transactions.findOne({where:{strTransactionID:strTransactionID}});
//         if ( refund != null )
//         {
//             if ( refund.eType == 'BET' )
//             {
//                 //await this.UpdateAgentCash(token.strAgentCode, parseFloat(refund.strAmount));
//             }
//             else if ( refund.eType == 'WIN' )
//             {
//                 //await this.UpdateAgentCash(token.strAgentCode, -parseFloat(refund.strAmount));
//             }
    
//             const req = await this.AxiosCancel(cAddress, token.strID, strVender, strTransactionID, refund.strGameID, refund.strRoundID, refund.eType);
//             if ( req != null )
//             {
//                 await db.transactions.update({eType:'REFUND', strBalance:req.iCash}, {where:{strTransactionID:strTransactionID}});
//                 return {iCash:req.iCash, eState:'COMPLETE'};
//             }
//         }
//     }
//     return null;    
// }


// exports.ProcessException = async (strAgentID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

//     const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
//     console.log(token);
//     if ( null != token )
//     {
//         await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, 0, strTarget, strDesc, strTransactionID, 'BET', 'EXCEPTION');
//     }

//     return null;
// }

let listUser = [];

let FindUser = (strAgentID) => {
     
    for ( let i in listUser )
    {
        if ( listUser[i].strAgentID == strAgentID )
        {
            console.log(`#################################################################################################### IHelper::FindUser TRUE : ${listUser.length}`);

            return listUser[i];
        }
    }
    return null;
}

let AddUser = (objectUser) => {

    console.log(`#################################################################################################### IHelper::AddUser`);
    console.log(objectUser);

    listUser.push(objectUser);

    console.log(`#################################################################################################### IHelper::AddUser Length : ${listUser.length}`);
}

exports.GetUser = async (strAgentID) => {

    let user = FindUser(strAgentID);
    if ( user == null )
    {
        const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
        if ( token != null )
        {
            //user = {strAgentID:strAgentID, strAgentCode:token.strAgentCode, strID:token.strID, strCallbackURL:token.strCallbackURL, strToken:token.strToken, ezugiToken:token.ezugiToken};
            //user = {strAgentID:strAgentID, strAgentCode:token.strAgentCode, strID:token.strID, strCallbackURL:token.strCallbackURL, strToken:token.strToken};
            user = {strAgentID:strAgentID, strAgentCode:token.strAgentCode, strID:token.strID, strCallbackURL:'https://tlrp888.uk/game', strToken:token.strToken};
            AddUser(user);
        }
        else
        {
            return null;
        }            
    }
    return user;
}

//////////
exports.ProcessBet2 = async (strAgentID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

    //const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
    const token = await this.GetUser(strAgentID);
    console.log(token);
    if ( null != token )
    {
        //const cAddress = `${token.strCallbackURL}/bet`;
        const cAddress = `${strCallbackURL}/bet`;
        const req = await this.AxiosBet(cAddress, token.strAgentCode, token.strID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode);
        console.log(`##### ProcessBet : ${req.result}`);
        if ( req != null )
        {
            console.log(`ProcessBet : ${req.result}`);
            if ( req.result == 'OK' )
            {
                //await this.UpdateAgentCash(token.strAgentCode, -parseFloat(strAmount));
                //const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, req.iCash, strTarget, strDesc, strTransactionID, 'BET', 'COMPLETE');

                const bet = {strAgentCode:token.strAgentCode, strID:token.strID, strVender:strVender, strGameID:strGameID, strTableID:strTableID, strRoundID:strRoundID, strAmount:strAmount, strDesc:strDesc, strTransactionID:strTransactionID, eType:'BET', iBalance:req.iCash};

                await this.AddDB(bet);

                //return bet;
                //return {iCash:req.iCash, iBetID:bet.id, eState:'COMPLETE', createdAt:bet.createdAt};
                return {iCash:req.iCash, createdAt:moment().format('YYYY-MM-DD HH:mm:ss')};
            }
        }
        else
        {
            // const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, 0, strTarget, strDesc, strTransactionID, 'BET', 'PENDING');
            // return {iCash:0, iBetID:bet.id, eState:'PENDING', createdAt:bet.createdAt};
            return null;
        }
    }

    return null;
}

exports.ProcessWin2 = async (strAgentID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

    //const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
    const token = await this.GetUser(strAgentID);

    if ( null != token )
    {
        //const cAddress = `${token.strCallbackURL}/win`;
        const cAddress = `${strCallbackURL}/win`;
        const req = await this.AxiosBet(cAddress, token.strAgentCode, token.strID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode);
        if ( req != null )
        {
            if ( req.result == 'OK' )
            {
                const win = {strAgentCode:token.strAgentCode, strID:token.strID, strVender:strVender, strGameID:strGameID, strTableID:strTableID, strRoundID:strRoundID, strAmount:strAmount, strDesc:strDesc, strTransactionID:strTransactionID, eType:'WIN', iBalance:req.iCash};
        
                await this.AddDB(win);

                return {iCash:req.iCash, createdAt:moment().format('YYYY-MM-DD HH:mm:ss')};
                //return win;
            }
            // //await this.UpdateAgentCash(token.strAgentCode, -parseFloat(strAmount));
            // const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, req.iCash, strTarget, strDesc, strTransactionID, 'WIN', 'COMPLETE');
            // return {iCash:req.iCash, eState:'COMPLETE', createdAt:bet.createdAt};
        }
        else
        {
            return null;
            // const bet = await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, 0, strTarget, strDesc, strTransactionID, 'WIN', 'PENDING');
            // return {iCash:0, eState:'PENDING', createdAt:bet.createdAt};
        }
    }

    return null;
}

//exports.ProcessCancel2 = async (strAgentID, strVender, strTransactionID, strGameID, strRoundID, eType) => {
    exports.ProcessCancel2 = async (strAgentID, strTransactionID) => {

    const token = await this.GetUser(strAgentID);

    if ( null != token )
    {
        const transaction = await this.FindDB(strTransactionID);
        if (transaction != null )
        {
            //const cAddress = `${token.strCallbackURL}/cancel`;
            const cAddress = `${strCallbackURL}/cancel`;

            const req = await this.AxiosCancel(cAddress, token.strID, transaction.strVender, transaction.strTransactionID, transaction.strGameID, transaction.strRoundID, transaction.eType);
            if ( req != null )
            {
                if ( req.result == 'OK' )
                {
                    let modify = transaction;
                    modify.eType = 'REFUND';
                    await this.AddDB(modify)

                    //await db.transactions.update({eType:'REFUND', strBalance:req.iCash}, {where:{strTransactionID:strTransactionID}});
                    return {iCash:req.iCash};
                }
            }
        }
    }
    return null;    
}

exports.ProcessException2 = async (strAgentID, eGameType, strVender, strGameID, strTableID, strRoundID, strAmount, strTarget, strDesc, strTransactionID, iGameCode) => {

    //const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
    const token = await this.GetUser(strAgentID);
    console.log(token);
    if ( null != token )
    {
        const exception = {strAgentCode:token.strAgentCode, strID:token.strID, strVender:strVender, strGameID:strGameID, strTableID:strTableID, strRoundID:strRoundID, strAmount:strAmount, strDesc:strDesc, strTransactionID:strTransactionID, eType:'EXCEPTION', iBalance:0};
        
        await this.AddDB(exception);
        //await this.CreateBet(token.strAgentCode, token.strID, eGameType, strVender, iGameCode, strGameID, strTableID, strRoundID, strAmount, 0, strTarget, strDesc, strTransactionID, 'BET', 'EXCEPTION');
    }

    return null;
}


exports.GetUserFromID2 = async (strVender, strAgentID) => {

    //const token = await GetUserFromAgentIDAtTokenDB(strAgentID);
    const token = await this.GetUser(strAgentID);
 
    console.log(`GetUserFromID`);
    console.log(token);

    if ( null != token )
    {
        let objectData = {strVender:strVender, strID:token.strID};
        //const cAddress = 'http://165.22.102.70:3010/game/authenticate';
        //const cAddress = `${token.strCallbackURL}/authenticate`;
        const cAddress = `${strCallbackURL}/authenticate`;
        let res_axios = await RequestAxios(cAddress, objectData);
        console.log(res_axios);
    
        if ( res_axios.result == 'OK' )
        {
            //return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strToken:token.strToken, ezugiToken:token.ezugiToken};
            return {strID:res_axios.data.strID, strNickname:res_axios.data.strNickname, iCash:res_axios.data.iCash, iSessionID:res_axios.iSessionID, strAgentCode:token.strAgentCode, strToken:token.strToken};
        }
    }
    return null;
}