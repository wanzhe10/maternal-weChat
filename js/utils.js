!(function(win, doc){
    win.myLocal = new Object();
    myLocal.setItem = function(localKey, data) {
        localKey = "maternal-weChat-" + localKey;
        window.localStorage.setItem(localKey, JSON.stringify(data));
    }
    myLocal.getItem = function(localKey, data) { 
        localKey = "maternal-weChat-" + localKey;
        var localValue = "";
        try{                
            localValue = window.localStorage.getItem(localKey);
        }catch(e){
            localValue = "";
        }
        if (localKey == "maternal-weChat-webChatToken") {
            try {
                var tempToken = JSON.parse(localValue);
                return tempToken;
            } catch(e) {
                return localValue;
            }
        }
        localValue = window.localStorage.getItem(localKey);
        if (localValue != null && localValue != "" && localValue != "undefined") {
            return JSON.parse(localValue);
        }
        return localValue;
    }
    myLocal.deleteItem = function(localKey) {
        window.localStorage.removeItem(localKey);
    }
    myLocal.clearItem = function() {
        window.localStorage.clear();
    }
})(window, document);


// 网络请求失败弹窗
function createPregnantLayerAlert(detailStr){
    layer.alert(detailStr);
}

// 计算预产产期 孕周 和 孕天
function expectedAndWeek(lastMenstruationDate,expectedDateStr,newWeekAndDay){
    var tempDate = new Date(Date.parse(lastMenstruationDate));
    var tempDateTime = tempDate.getTime();
    var dayTime = 1000*60*60*24;
    var tempDateRange = dayTime*280;
    var lastDateTime = new Date(tempDateTime + tempDateRange);
    // 预产期字符串
    var expectedText = lastDateTime.getFullYear() + '-' + (lastDateTime.getMonth()+1) + '-' + lastDateTime.getDate();
    // layer.msg("123456");
    // 计算现孕周
    var nowDate = new Date().getTime();
    var nowDateRange = nowDate-tempDateTime;
    var nowDateRangeDays = nowDateRange/dayTime;
    var nowDateRangeWeek = Math.floor(nowDateRangeDays/7);
    var nowDateRangeDay = Math.floor(nowDateRangeDays%7 * 1);
    expectedDateStr(expectedText);
    newWeekAndDay(nowDateRangeWeek,nowDateRangeDay);
    // console.log(expectedText,nowDateRangeWeek,nowDateRangeDay);
}

// base64转二进制
function base64ToBlob(urlData) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    console.log(mime);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    var doctorImageName = new Blob([ab], {
        type: mime
    });
    return doctorImageName;
}

// url提取参数
// function getQueryString(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//     var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
//     var r = window.location.search.substr(1).match(reg);
//     var q = window.location.pathname.substr(1).match(reg_rewrite);
//     if(r != null){
//         return unescape(r[2]);
//     }else if(q != null){
//         return unescape(q[2]);
//     }else{
//         return null;
//     }
// }

// 授权本地缓存openId
// function UploadOpenIdForWeChatCode(successFn,errorFn){
//     successFn("null");
//     errorFn("state");
//     return;

//     var weChatOpenIdDetail = myLocal.getItem("weChatOpenIdDetail");
//     var weChatOpenIdType = myLocal.getItem("weChatOpenIdType");
//     if(weChatOpenIdDetail == null || weChatOpenIdType == 0){
//         var state = getQueryString("state");
//         var code = getQueryString("code");
//         // return errorFn("state:"+state+",code:"+code);
//         if (state != 20200) {
//             successFn(null);
//             errorFn("state:"+state+",code:"+code);
//         }
//         HttpRequstForPost(httpUrl.patientWechatAuthorization, 'json', false,{
//             "token": myLocal.getItem("weChatToken"),
//             "code": code,
//         }, function sucFn(data){
//             successFn(data);
//         }, function errFn(){
//             layer.close(layerIndex);
//             errorFn(layerIndex);
//             // console.log(err);
//         }) 
//     } 
// }

