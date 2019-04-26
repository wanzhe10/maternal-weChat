$(function() {
    // 获取数据-start
    var highRiskArr = myLocal.getItem("highRiskArr") ? myLocal.getItem("highRiskArr") : [];
    renderDetails(0);

    function renderDetails(index) {
        if (highRiskArr.length) {
            var navHtml = ""; //导航 html 字符串
            for (var i = 0; i < highRiskArr.length; i++) {
                navHtml += '<a class="' + (i == index ? "active" : "") + '" href="javascript:;">第 ' + (highRiskArr[i].checkNumber) + ' 次评估</a>';
            }
            $(".navList").html(navHtml);
            $(".navBox").html(navHtml); // 渲染导航
            $(".createDate").html(highRiskArr[index].createDate.split(" ")[0]); // 创建时间
            $(".gestationalWeeks").html((highRiskArr[index].newAgeOfMenarche ? highRiskArr[index].newAgeOfMenarche + '周+' : '') + (highRiskArr[index].newAgeOfMenarcheDay ? highRiskArr[index].newAgeOfMenarcheDay : index) + '天'); //孕周 - 天
            $(".totalPoints").html(highRiskArr[index].totalPoints + '分'); // 总分
            var detailsArr = eval("(" + highRiskArr[index].details + ")");
            if (detailsArr.purple.length > 0) {
                $(".riskBox").html("传染病").addClass("level4");
            } else if (detailsArr.red.length > 0) {
                $(".riskBox").html("高风险").addClass("level3");
            } else if (detailsArr.orange.length > 0) {
                $(".riskBox").html("较高风险").addClass("level2");
            } else if (detailsArr.yellow.length > 0) {
                $(".riskBox").html("一般风险").addClass("level1");
            } else if (detailsArr.green.length > 0) {
                $(".riskBox").html("低风险").addClass("level0");
            }
            $(".green").html(detailsArr.green.join() ? detailsArr.green.join() : '无');
            $(".yellow").html(detailsArr.yellow.join() ? detailsArr.yellow.join() : '无');
            $(".orange").html(detailsArr.orange.join() ? detailsArr.orange.join() : '无');
            $(".red").html(detailsArr.red.join() ? detailsArr.red.join() : '无');
            $(".purple").html(detailsArr.purple.join() ? detailsArr.purple.join() : '无');
            $(".patientsImg").attr({
                "src": imgIp + highRiskArr[index].patientSignatureImageMin,
                "bigSrc": imgIp + highRiskArr[index].patientSignatureImage
            })
            $(".doctorImg").attr({
                "src": imgIp + highRiskArr[index].patientDoctorSignatureImageMin,
                "bigSrc": imgIp + highRiskArr[index].patientDoctorSignatureImage
            })
        } else {
            layer.msg("暂无数据");
            window.location = '/maternal-weChat/user/user.html';
        }
    }

    // 获取数据-end



    // 导航栏拖动功能-start
    var startX = 0;
    var widthX = 0;
    // 导航栏的定位 left 值的范围 [ 0 ~ -（导航栏宽度 - 显示部分的宽度）]
    $(".navBox").on({
        // 按下事件
        touchstart: function(e) {
            // startX 按下时导航栏的偏移 = 触摸点在屏幕上距离左侧的距离 - 导航栏已经偏移的距离
            startX = e.originalEvent.targetTouches[0].pageX - parseInt($(this).css('left'));
            // 获取导航栏的宽度
            widthX = $(this).width();
        },
        // 移动事件
        touchmove: function(e) {
            // moveX 触摸点移动时的位置变化
            var moveX = e.originalEvent.targetTouches[0].pageX;
            // （ moveX - startX ）导航栏的 left 值
            if (moveX - startX > 0) {
                // > 0 超出左侧边界
                $(".navBox").css({
                    "left": 0
                });
            } else if (widthX - Math.abs(moveX - startX) < $(".tabContent").width() - $(".btnBox").width()) {
                // 超出右侧边界
                $(".navBox").css({
                    "left": $(".tabContent").width() - $(".btnBox").width() - widthX
                });
            } else {
                // moveX - startX 在允许范围内
                $(".navBox").css({
                    "left": moveX - startX
                });
            }
        },
        // 抬起事件
        touchend: function() {

        }
    })

    // 导航栏拖动功能-end

    // 导航栏焦点切换-start
    $(".navBox").delegate("a", "click", function() {
        $(".navList > a").removeClass("active").eq($(this).index()).addClass("active");
        $(".navBox > a").removeClass("active").eq($(this).index()).addClass("active");
        renderDetails($(this).index());
    })
    $(".navList").delegate("a", "click", function() {
        $(".navList > a").removeClass("active").eq($(this).index()).addClass("active");
        $(".navBox > a").removeClass("active").eq($(this).index()).addClass("active");
        renderDetails($(this).index());
        $(".navListContent").hide();
    })
    $(".btnBox").click(function() {
        $(".navListContent").show();
    })
    $(".closeBtn").click(function() {
        $(".navListContent").hide();
    })
    // 导航栏焦点切换-end


    // 查看大图 - 打开
    $(".signatureImg").click(function() {
        $(".bigImgContent").css("display", "flex").find("img").attr("src", $(this).attr("bigSrc"));
    });
    // 查看大图 - 关闭
    $(".bigImgContent").click(function() {
        $(this).css("display", "none");
    })

})
