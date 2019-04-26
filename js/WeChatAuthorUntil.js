function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if(r != null){
        return unescape(r[2]);
    }else if(q != null){
        return unescape(q[2]);
    }else{
        return null;
    }
}

// 授权本地缓存openId
function UploadOpenIdForWeChatCode(successFn,errorFn){
    var weChatOpenIdDetails = myLocal.getItem("weChatOpenIdDetails");
    var weChatOpenIdType = myLocal.getItem("weChatOpenIdType");
    if(weChatOpenIdType == 0 || weChatOpenIdDetails == null || weChatOpenIdDetails == ""){
        var state = getQueryString("state");
        var code = getQueryString("code");
        if (state == null || code == null || state != 20200) {
            successFn(null);
            errorFn("state:"+state+",code:"+code);
            return;
        }
        HttpRequstForPost(httpUrl.patientWechatAuthorization, 'json', false,{
            "token": myLocal.getItem("weChatToken"),
            "code": code,
        }, function sucFn(data){
            successFn(data);
        }, function errFn(){
            layer.close(layerIndex);
            errorFn(layerIndex);
        }) 
    } 
}