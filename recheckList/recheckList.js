$(function() {
    // 渲染列表-start
    var secondCheckArr = myLocal.getItem("secondCheckArr") ? myLocal.getItem("secondCheckArr") : [];
    if (secondCheckArr.length) {
        console.log(secondCheckArr[0])
        var _html = '';
        for (var i = 0; i < secondCheckArr.length; i++) {
            var imageList = eval("(" + secondCheckArr[i].doctorImg + ")")
            _html += '<div class="itemBox">\
                <div class="titleBox">\
                    <p><span class="month">' + secondCheckArr[i].checkDate.split(" ")[0] + '</span>|<span class="serialNum">第 ' + secondCheckArr[i].ordinalNumber + ' 次产检</span></p>\
                    <a href="/maternal-weChat/recheckInfo/recheckInfo.html">查看详情</a>\
                </div>\
                <div class="item">\
                    <p><span>检查时间 :</span>' + secondCheckArr[i].checkDate.split(" ")[0] + '</p>\
                </div>\
                <div class="item">\
                    <p><span>孕 周 :</span><span>' + (secondCheckArr[i].gestationalWeek ? secondCheckArr[i].gestationalWeek + '周+' : '') + (secondCheckArr[i].gestationalDay ? secondCheckArr[i].gestationalDay : 0) + '天</span></p>\
                </div>\
                <div class="item">\
                    <p><span>体  重 :</span>' + secondCheckArr[i].bodyWeight + 'Kg</p>\
                    <p><span>血  压 :</span>' + secondCheckArr[i].bloodPressureHigh + '/' + secondCheckArr[i].bloodPressureLow + ' mmHg</p>\
                </div>\
                <div class="item">\
                    <p><span>胎 位 :</span><span>' + selectData.position[secondCheckArr[i].position].value + '</span></p>\
                    <p><span>胎 心 :</span><span>' + selectData.cardiac[secondCheckArr[i].cardiac].value + '</span></p>\
                </div>\
                <div class="bottomBox">\
                    <p>评估医生 : <img class="signatureImg" src="' + imgIp + imageList.minImageURL + '" alt="" bigSrc="' + imgIp + imageList.maxImageURL + '"/></p>\
                </div>\
            </div>'
        }
        $(".container").html(_html);
    } else {
        layer.msg("暂无数据");
        window.location = '/maternal-weChat/user/user.html';
    }
    // 渲染列表-end


    // 查看大图 - 打开
    $(".container").delegate(".signatureImg", "click", function() {
        $(".bigImgContent").css("display", "flex").find("img").attr("src", $(this).attr("bigSrc"));
    });
    // 查看大图-关闭
    $(".bigImgContent").click(function() {
        $(this).css("display", "none");
    })
})
