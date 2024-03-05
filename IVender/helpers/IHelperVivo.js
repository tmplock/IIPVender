const crypto = require('crypto');
const dayjs = require('dayjs');
const md5 = require('md5');
const { XMLBuilder } = require('fast-xml-parser');

exports.ProcessTargetForBackOffice = (target) => {
    // switch ( target )
    // {

    // }
    return target;
}

exports.GetBettingTargetFromGamdID = (iGameID) => {

    if(iGameID == 1){//룰렛
        return 400;
    }
    else if(iGameID == 4){//블랙 잭
        return 500;
    }
    else if(iGameID == 18){//드래곤 타이거
        return 600;
    }
    else if ( iGameID == 202 ) {//  Casino Holdem
        return 700;
    }
    else if ( iGameID == 218 ) {    //  Teen Patti
        return 800;
    }
    return 1000;
}

exports.GetBettingInfo = (str, iGameID, iAmount) => {

    let ret = [];

    if ( iGameID == 2 )
    {
        let temp = str.split(',');
        //console.log(temp);
    
        for (let i in temp)
        {
            let temp2 = temp[i].split('-');
            //console.log(temp2);
    
            let object = {target:this.ProcessTargetForBackOffice(parseInt(temp2[0])), chip:parseInt(temp2[1])};
    
            ret.push(object);
        }
    }
    else
    {
        ret.push({target:GetBettingTargetFromGamdID(iGameID), chip:iAmount});
    }

    return ret;
};

exports.GetBettingTargetFromWin = (str, iGameID, iAmount) => {

    let ret = [];

    if ( iGameID == 2 )
    {
        let first = str.indexOf('WINS;');
        let end = str.indexOf(':CARDS');
    
        console.log(`GetBettingTargetFromWin : ${first}, ${end}`);
    
        let test = str.substr(first+5, end-first-5);
        //console.log(test);
    
        if ( test == '' )
            console.log('no wins');
        else
        {
            console.log('wins');
    
            let temp = test.split(',');
    
            //console.log(temp);
    
            for (let i in temp)
            {
                let temp2 = temp[i].split('-');
                //console.log(temp2);
    
                let object = {target:parseInt(temp2[0]), win:parseInt(temp2[1])};
    
                ret.push(object);
            }
        }
    }
    else
    {
        ret.push({target:this.GetBettingTargetFromGamdID(iGameID), win:iAmount});
    }

    return ret;
}

exports.GetWinAccount = (str) => {

    let first = str.indexOf('>');

    let test = str.substr(first+1, str.length);

    return test;
}

exports.GetGameCode = (iTarget, iGameID) => {

    if(iGameID == 1){//룰렛
        return 0;
    }
    else if(iGameID == 4){//블랙 잭
        return 0;
    }
    else if(iGameID == 18){//드래곤 타이거
        return 0;
    }
    else if ( iGameID == 202 ) {    // Casino Holdem
        return 0;
    }
    else if ( iGameID == 218 ) {    //  Teen Patti
        return 0;
    }

    if(iTarget == 1){//플레이어
         return 0;
    }
    else if(iTarget == 2){ //뱅커
        return 0;
    }
    else if(iTarget == 3){ //타이
        return 0;
    }
    else if(iTarget == 4){//플레이어페어
        return 0;
    }
    else if(iTarget == 5){//뱅커페어
        return 0;
    }
    else if(iTarget == 6){//플레이어보너스
        return 0;
    }
    else if(iTarget == 7){//뱅커보너스
        return 0;
    }
    else if(iTarget == 8){//퍼펙트페어
        return 0;
    }
    else if(iTarget == 9){//이더페어
        return 0;
    }
    else if(iTarget == 19){//플레이어 언더
        return 100;
    }
    else if(iTarget == 18){//플레이어 오버
        return 100;
    }
    else if(iTarget == 16){//뱅커 언더
        return 100;
    }
    else if(iTarget == 17){//뱅커 오버
        return 100;
    }
    // else if(iTarget == 14){//플레이어 언더
    //     return 100;
    // }
    // else if(iTarget == 12){//플레이어 오버
    //     return 100;
    // }
    // else if(iTarget == 15){//뱅커 언더
    //     return 100;
    // }
    // else if(iTarget == 13){//뱅커 오버
    //     return 100;
    // }

    return 0;
}

exports.GetBettingTarget = (iTarget, iGameID) => {

    if(iGameID == 1){//룰렛
        return 400;
    }
    else if(iGameID == 4){//블랙 잭
        return 500;
    }
    else if(iGameID == 18){//드래곤 타이거
        return 600;
    }
    else if ( iGameID == 202 ) {//  Casino Holdem
        return 700;
    }
    else if ( iGameID == 218 ) {    //  Teen Patti
        return 800;
    }

    if(iTarget == 1){//플레이어
         return 1;
    }
    else if(iTarget == 2){ //뱅커
        return 2;
    }
    else if(iTarget == 3){ //타이
        return 0;
    }
    else if(iTarget == 4){//플레이어페어
         return 3;
    }
    else if(iTarget == 5){//뱅커페어
        return 4;
    }
    else if(iTarget == 6){//플레이어보너스
        return 7;
    }
    else if(iTarget == 7){//뱅커보너스
        return 8;
    }
    else if(iTarget == 8){//퍼펙트페어
        return 6;
    }
    else if(iTarget == 9){//이더페어
        return 5;
    }
    // else if(iTarget == 14){//플레이어 언더
    //     return 100;
    // }
    // else if(iTarget == 12){//플레이어 오버
    //     return 101;
    // }
    // else if(iTarget == 15){//뱅커 언더
    //     return 102;
    // }
    // else if(iTarget == 13){//뱅커 오버
    //     return 103;
    // }
    else if(iTarget == 19){//플레이어 언더
        return 100;
    }
    else if(iTarget == 18){//플레이어 오버
        return 101;
    }
    else if(iTarget == 16){//뱅커 언더
        return 102;
    }
    else if(iTarget == 17){//뱅커 오버
        return 103;
    }
    
    return 999;
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