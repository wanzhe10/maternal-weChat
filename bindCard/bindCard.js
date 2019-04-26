$(function() {

    // 判断是否已经登录过
    var requestData;
    var loginInfo = myLocal.getItem("loginInfo");
    if (loginInfo != null) {
        HttpRequstForPost(httpUrl.login, 'json', false,{
                "username": loginInfo.number,
                "password": loginInfo.name,
                "telephone": loginInfo.telephone,
            }, function sucFn(data){
                if (data.status == 20200) {
                    // 登录成功
                    myLocal.setItem("weChatToken", data.token);
                    myLocal.setItem("weChatOpenIdType", data.openIdType);
                    var locationHtml;
                    //     locationHtml = data.isFiling == 2?"/maternal-weChat/newRecord/newRecord.html":"/maternal-weChat/user/user.html";
                    //  window.location = locationHtml;
                    //  console.log(data);
                    // return;
                    if (data.openIdType == 0) { // 未授权
                        // locationHtml = "/maternal-weChat/qrcode/qrcode.html"
                        locationHtml = data.isFiling == 2?httpUrl.weChatRequest:httpUrl.weChatRequestToUser;
                    }else{
                        locationHtml = data.isFiling == 2?"/maternal-weChat/newRecord/newRecord.html":"/maternal-weChat/user/user.html";
                    }
                    window.location = locationHtml;
                    return;
                } else if (data.status == 20402) {
                    // 未绑定电话
                    $(".name").val(loginInfo.name);
                    $(".number").val(loginInfo.number);
                    $(".telephone").val(loginInfo.telephone);
                    $(".telephone")[0].focus();
                    $("#detailContentSignUp").hide();
                    $("#detailContentSignIn").show();
                    setTimeout(function(){
                        layer.open({
                        title: '提示',
                        content: '该用户未绑定手机'
                    });
                    },1000);
                }else {
                    // 登录失败
                    layer.msg("登录失败");
                    return
                }
                
            },function errFn(){
                return;
            })
    }

    // 知情同意书id获取-start
    var importantDetailId = ''; //知情同意书id

    var verificationCode = 0;

    var verificationCodeInterval;

    // HttpRequstForGet(httpUrl.findNewsEntity, 'json', false,"", function sucFn(data){
    //      if (data.status == "20200") {
    //         importantDetailId = data.id;
    //     }
    // },function errFn(err){
    // });
    // 知情同意书id获取-end

    // 信息验证-start
    $(".name").focus(function() {
        if (!RegExpObj.Reg_Name.test($(this).val())){
            $(this).val('').parents(".item").removeClass('error');
        }
    }).blur(function() {
        if ($(this).val() == '') {
            layer.msg("请输入您的姓名");
        } else if (!RegExpObj.Reg_Name.test($(this).val())) {
            $(this).parents(".item").addClass('error');
            layer.msg("请检查姓名");
        }
    });
    $(".number").blur(function() {
        if ($(this).val() == '') {
            layer.msg("请输入您的就诊卡号");
        }
    });
    $(".telephone").blur(function() {
        if ($(this).val() == '') {
            layer.msg("请输入您的电话号码");
        }
    });
    $(".telephoneNum").blur(function() {
        if ($(this).val() == '') {
            layer.msg("请输入您的验证码");
        }
    });
    // 信息验证-end

    // 获取验证码-start
    $('.colorP').click(function() {
        if ($(".name").val() == '') {
            layer.msg("请输入您的姓名");
            return;
        } else if (!RegExpObj.Reg_Name.test($(".name").val())) {
            layer.msg("您输入正确的姓名");
            return;
        } else if ($(".number").val() == '') {
            layer.msg("请输入您的就诊卡号");
            return;
        } else if ($(".telephone").val() == '') {
            layer.msg("请输入您的手机号");
            return;
        }
        if (verificationCode != 0) {
            layer.msg(verificationCode+"秒后,可重新获取验证码.");
            return;
        }
        HttpRequstForPost(httpUrl.sms,'json',true,{"telephone": $(".telephone").val()},
            function sucFn(data){
                if (data.status == 20200) {
                    layer.msg("短信已发送,请查收。");
                    verificationCode = 120;
                    $("#againDiv").show();
                    $("#senderDiv").hide();
                    $("#requestNum").text("("+verificationCode + "s)重新发送");
                    verificationCodeInterval = window.setInterval(getLoc,1000);
                    return;
                }
                layer.msg("短信发送失败,请联系客服。");
            },function errFn(){

        });
    })
    // 获取验证码-end

    // 提交信息-start
    $('#signUpBtn').click(function() {
        if ($(".name").val() == '') {
            layer.msg("请输入您的姓名");
        } else if (!RegExpObj.Reg_Name.test($(".name").val())) {
            layer.msg("您输入正确的姓名");
        } else if ($(".number").val() == '') {
            layer.msg("请输入您的就诊卡号");
        }  else if ($(".telephone").val() == '') {
            layer.msg("请输入您的手机号");
        }else {
            HttpRequstForPost(httpUrl.addImportantDetailForFiling, 'json',true, {
                    "number": $(".number").val(), //    就诊卡号
                    "name": $(".name").val(), // 患者姓名
                    "telephone": $(".telephone").val(), //    就诊卡号
                    "verificationCode": $(".telephoneNum").val(), // 患者姓名
                    "importantDetailId": importantDetailId, //知情同意书id
                }, function sucFn(data){
                    if (data.status == 20200) {
                        myLocal.setItem("loginInfo", {
                            "name": $(".name").val(),
                            "number": $(".number").val(),
                            "telephone":$(".telephone").val(),
                            "isFiling":data.isFiling
                        })
                        myLocal.setItem("weChatToken", data.token);
                        var openIdType = data.openIdType;
                        myLocal.setItem("weChatOpenIdType", data.openIdType);
                        console.log(openIdType)
                        if (openIdType == 0) {
                            // 微信授权跳转
                            // window.location = '/maternal-weChat/newRecord/newRecord.html';
                            window.location = httpUrl.weChatRequest;
                        }else{
                            window.location = '/maternal-weChat/newRecord/newRecord.html';
                        }
                    } else if (data.status == 20210) {
                        layer.msg("姓名或卡号已存在");
                    } else if (data.status == 20401){
                        layer.msg("验证码错误");
                    } else{
                        layer.msg("绑卡失败");
                    }
            },function errFn(err){
            });
        }
    })
    $('#signInBtn').click(function() {
        if ($(".name").val() == '') {
            layer.msg("请输入您的姓名");
        } else if (!RegExpObj.Reg_Name.test($(".name").val())) {
            layer.msg("您输入正确的姓名");
        } else if ($(".number").val() == '') {
            layer.msg("请输入您的就诊卡号");
        }  else if ($(".telephone").val() == '') {
            layer.msg("请输入您的手机号");
        }else {
            HttpRequstForPost(httpUrl.siginInAddTelephone, 'json',true, {
                    "username": $(".number").val(), //    就诊卡号
                    "password": $(".name").val(), // 患者姓名
                    "telephone": $(".telephone").val(), //    就诊卡号
                    "verificationCode": $(".telephoneNum").val(), // 患者姓名
                }, function sucFn(data){
                    if (data.status == 20200) {
                        myLocal.setItem("loginInfo", {
                            "name": $(".name").val(),
                            "number": $(".number").val(),
                            "telephone":$(".telephone").val(),
                            "isFiling":data.isFiling
                        })
                        myLocal.setItem("weChatToken", data.token);
                        console.log(data.openIdType)
                        myLocal.setItem("weChatOpenIdType", data.openIdType);
                        var locationHtml;
                        //     locationHtml = data.isFiling == 2?"/maternal-weChat/newRecord/newRecord.html":"/maternal-weChat/user/user.html";
                        // window.location = locationHtml;
                        // return;
                        if (data.openIdType == 0) { // 未授权
                            locationHtml = data.isFiling == 2?httpUrl.weChatRequest:httpUrl.weChatRequestToUser;
                        }else{
                            locationHtml = data.isFiling == 2?"/maternal-weChat/newRecord/newRecord.html":"/maternal-weChat/user/user.html";
                        }
                        window.location = locationHtml;
                        return;
                        // if (data.isFiling == 2) {
                        //     window.location = "/maternal-weChat/newRecord/newRecord.html";
                        // } else {
                        //     // 判断是否需要授权
                        //     window.location = "/maternal-weChat/user/user.html";
                        // }
                    } 
            },function errFn(err){
            });
        }
    })

    // 提交信息-end
    $('.signUpSpan').click(function() {
        $("#detailContentSignUp").hide();
        $("#detailContentSignIn").show();
    });
    $('.signInSpan').click(function() {
        $("#detailContentSignIn").hide();
        $("#detailContentSignUp").show();
    });
     
    // 定时器-start
    function getLoc(){
        console.log("1")
        verificationCode -= 1;
        $("#requestNum").text("("+verificationCode + "s)重新发送");
        if (verificationCode == 0) {
            window.clearInterval(verificationCodeInterval); 
            $("#requestNum").text("重新获取");
        }
    }
    // 定时器-end
})
