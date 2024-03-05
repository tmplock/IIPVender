let leadingZeros = (n, digits) => {
    let zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (let i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

let getTimeStamp = (offset)=> {
    let now = new Date();

    let d = new Date(now.setDate(now.getDate()-offset));
    let s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2);

    return s;
}

let getMonthlyStart = ()=> {
    var now = new Date();

    var s =
        leadingZeros(now.getFullYear(), 4) + '-' +
        leadingZeros(now.getMonth() + 1, 2) + '-' +
        leadingZeros(1, 2);

        console.log(s);

    return s;
}

let GetCurrentDate = () => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthlyStartDate = () => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), date.getMonth(), 1);
    //var res = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthlyEndDate = () => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    //
    let iEndDate = res.getDate();
    if ( date.getDate() < 31 )
    {
        iEndDate = date.getDate();

        res = new Date(date.getFullYear(), date.getMonth(), iEndDate);
    }

    //var res = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthly1stStartDate = () => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), date.getMonth(), 1);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthly1stEndDate = () => {
    var date = new Date(); 

    let iEndDate = 15;
    if ( date.getDate() < 15 )
        iEndDate = date.getDate();

    var res = new Date(date.getFullYear(), date.getMonth(), iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthly2ndStartDate = () => {
    var date = new Date(); 

    let iDate = 16;
    if ( date.getDate() < 16 )
        iDate = date.getDate();

    var res = new Date(date.getFullYear(), date.getMonth(), iDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetMonthly2ndEndDate = () => {
    var date = new Date(); 

    let iEndDate = 31;
    if ( date.getDate() < 31 )
        iEndDate = date.getDate();

    var res = new Date(date.getFullYear(), date.getMonth(), iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetYearlyStartDate = () => {
    var date = new Date(); 

    var res = new Date(date.getFullYear(), 0, 1);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let GetYearlyEndDate = () => {
    var date = new Date(); 

    let iEndDate = 31;
    if ( date.getDate() < 31 )
        iEndDate = date.getDate();
    let iMonth = 11;
    if ( date.getMonth() < iMonth )
        iMonth = date.getMonth();

    var res = new Date(date.getFullYear(), date.getMonth(), iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let DatePicker = () =>
{
	$(".datepicker").datepicker({
		showMonthAfterYear: true,
		changeYear: true,
		changeMonth: true,
		dateFormat: "yy-mm-dd",
		dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
		dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
		monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		MonthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
	});
}

let MonthPicker = () =>
{
    $(".monthpicker").datepicker({
        format: 'yyyy-mm',
        language: 'kr',
        minViewMode: "months",
        startView: "months",
        autoclose : true
	});
}

//

let Get1QuaterStartDate = (month) => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), month, 1);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let Get1QuaterEndDate = (month) => {
    var date = new Date(); 

    let iEndDate = 15;
    // if ( date.getDate() < 15 )
    //     iEndDate = date.getDate();

    var res = new Date(date.getFullYear(), month, iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let Get2QuaterStartDate = (month) => {
    var date = new Date(); 

    let iDate = 16;
    if ( date.getDate() < 16 )
        iDate = date.getDate();

    var res = new Date(date.getFullYear(), month, iDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

let Get2QuaterEndDate = (month) => {
    var date = new Date(); 

    let iEndDate = 0;
    //let iEndDate = 31;
    // if ( date.getDate() < 31 )
    //     iEndDate = date.getDate();

    var res = new Date(date.getFullYear(), month+1, iEndDate);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}

// let Get2QuaterEndDate = (month) => {
//     var date = new Date(); 

//     let iEndDate = 0;
//     //let iEndDate = 31;
//     // if ( date.getDate() < 31 )
//     //     iEndDate = date.getDate();

//     var res = new Date(date.getFullYear(), month, iEndDate);

//     res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

//     return res;
// }

let GetQuaterDate = (month, day) => {
    var date = new Date(); 
    var res = new Date(date.getFullYear(), month, day);

    res = new Date(+res + 3240 * 10000).toISOString().split("T")[0];

    return res;
}