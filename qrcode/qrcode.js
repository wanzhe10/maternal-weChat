$(function() {
    // layer.alert("未绑定数据,请完成数据绑定",{
    //     offset: ['150px', '50px']
    // });
    // return;
    var contentW = $(window).width();
    function createQRCode(data){
        $('.qrcodeImg').qrcode({
            render: 'canvas',
            width: 200,
            height: 200,
            // foreground: "black",
            // background: "#FFF",
            text: data,
        });
    }

    function initSimpleDiv(){
        var tempNameP = $(".name")
        var layerWidth = contentW-60;
        var tempUserInfo = myLocal.getItem('loginInfo');
        if (tempUserInfo == null || tempUserInfo.length == 0) {
            // layer.alert("未绑定数据,请完成数据绑定",{
               
            // });
            // layer.alert("未绑定数据,请完成数据绑定",{
            //     area: layerWidth+"",
            //     offset: ['auto','30px']
            // });
            tempNameP.html("未绑定数据,请完成数据绑定!");
            tempNameP.css("color","red");
            return;
        }
        $('.name').html(tempUserInfo.name);
        $('.number').html(tempUserInfo.number);
        // 处理数据源
        var qrcodeText = {};
        // qrcodeText["number"] = tempUserInfo.number;
        // qrcodeText["filingType"] = tempUserInfo.isFiling;
        // createQRCode(JSON.stringify(qrcodeText));
        createQRCode(tempUserInfo.number);
    }
    initSimpleDiv();
    
})
