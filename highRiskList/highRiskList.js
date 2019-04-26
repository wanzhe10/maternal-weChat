$(function() {
    // 渲染列表-start
    var highRiskArr = myLocal.getItem("highRiskArr") ? myLocal.getItem("highRiskArr") : [];
    if (highRiskArr.length) {
        for (var i = 0; i < highRiskArr.length; i++) {
            var _html = '';
            for (var i = 0; i < highRiskArr.length; i++) {
                var totalNum = eval("(" + highRiskArr[i].totalNum + ")");
                _html += '<div class="itemBox">\
                    <div class="titleBox">\
                        <p><span class="monthText">' + highRiskArr[i].createDate.split(" ")[0] + '</span>|<span class="manyText">第' + (highRiskArr[i].checkNumber) + '次评估</span></p>\
                        <a href="/maternal-weChat/highRiskInfo/highRiskInfo.html">查看详情</a>\
                    </div>\
                    <div class="contentBox">\
                        <div class="topBox">评估时间：<span>' + highRiskArr[i].createDate.split(" ")[0] + '</span>孕周: <span>' + highRiskArr[i].newAgeOfMenarche + '周+' + (highRiskArr[i].newAgeOfMenarcheDay ? highRiskArr[i].newAgeOfMenarcheDay : 0) + '天</span></div>\
                        <div class="centerBox">\
                            <div>\
                                <p class="titleText">评估信息：</p>\
                                <p class="contentText">\
                                    <span>绿色（<i>' + totalNum.green + '</i>）项</span>\
                                    <span>黄色（<i>' + totalNum.yellow + '</i>）项</span>\
                                    <span>橙色（<i>' + totalNum.orange + '</i>）项</span>\
                                    <span>红色（<i>' + totalNum.red + '</i>）项</span>\
                                    <span>紫色（<i>' + totalNum.purple + '</i>）项</span>\
                                </p>\
                            </div>\
                            <div>\
                                <p class="titleText">备注信息 :</p>\
                                <p class="contentText">' + highRiskArr[i].remarks + '</p>\
                            </div>\
                        </div>\
                        <div class="bottomBox">\
                            <p>检查医生 : <img class="signatureImg" src="' + imgIp + highRiskArr[i].patientDoctorSignatureImageMin + '" alt="" bigSrc="' + imgIp + highRiskArr[i].patientDoctorSignatureImage + '"/></p>\
                        </div>\
                    </div>\
                </div>'
            }
            $(".mainContent").html(_html);
        }
    } else {
        layer.msg("暂无数据");
        window.location = '/maternal-weChat/user/user.html';
    }
    // 渲染列表-end
    // 查看大图 - 打开
    $(".mainContent").delegate(".signatureImg", "click", function() {
        $(".bigImgContent").css("display", "flex").find("img").attr("src", $(this).attr("bigSrc"));
    });
    // 查看大图-关闭
    $(".bigImgContent").click(function() {
        $(this).css("display", "none");
    })

})
