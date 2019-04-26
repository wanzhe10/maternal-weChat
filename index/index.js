$(function () {
    var requestData;
    var loginInfo = myLocal.getItem("loginInfo");
    console.log(loginInfo.number);
    console.log(loginInfo.name);
    if (loginInfo != null) {
        HttpRequstForPost(httpUrl.login, 'json', true,{
                "username": myLocal.getItem("loginInfo").number,
                "password": myLocal.getItem("loginInfo").name,
            }, function sucFn(data){
                if (data.status == 20200) {
                    // 登录成功
                    myLocal.setItem("weChatToken", data.token);
                    if (data.isFiling == 2) {
                        window.location = "/maternal-weChat/newRecord/newRecord.html";
                    } else {
                        // 判断是否需要授权
                        // 进行授权
                        window.location = "/maternal-weChat/user/user.html";
                    }
                } else {
                    // 登录失败
                }
            },function errFn(){

            })
    }else{
        // window.location = httpUrl.weChatRequest;
        //  $.ajax({
        //     type: 'GET',
        //     url: httpUrl.weChatRequest,
        //     // xhrFields: {
        //     //     withCredentials: false
        //     // },
        //     dataType: 'json',
        //     data: null,
        //     async: true,
        //     success: function (sucData) {
        //         // layui.msg(data);
        //     },
        //     error: function (err) {
                
        //     },
        // });
        // 进行授权
        // HttpRequstForGet(httpUrl.weChatRequest,'json',true,{},
        // function sucFn(data){
        //     layui.msg(data);
        //     // console.log(data);
        // },
        // function errFn(err){

        // });
    }
})
