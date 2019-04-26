$(function () {
    var patientCheck = myLocal.getItem("patientCheck") ? myLocal.getItem("patientCheck") : [];
    var currentIndex;
    console.log(patientCheck)
    renderPatientCheck(0);

    function renderPatientCheck(index) {
        currentIndex = index;
        if (patientCheck.length) {
            $(".foldContent > a").addClass("foldFalse");
            $(".foldContent").css("height", "5rem");
            var navHtml = '';
            for (var i = 0; i < patientCheck.length; i++) {
                navHtml += '<a class="' + (i == index ? "active" : "") + '" href="javascript:;">孕' + patientCheck[i].gestationalWeekStart + '-' + patientCheck[i].gestationalWeekEnd + '周</a>';
            }
            $(".navList").html(navHtml);
            $(".navBox").html(navHtml); // 渲染导航
            $(".makeAppointmentTime").html(patientCheck[index].makeAppointmentTime); //预约时间
            $(".remarks").html(patientCheck[index].remarks); //温馨提醒
            $(".checkDetail").html(patientCheck[index].checkDetail); //产检须知
            $(".remindText").attr("name", patientCheck[index].id); // id
            if (patientCheck[index].remindTime && patientCheck[index].makeAppointmentTime) {
                var times = new Date(patientCheck[index].makeAppointmentTime.split(" ")[0]).getTime() - new Date(patientCheck[index].remindTime.split(" ")[0]).getTime();
                var _day = parseInt(times / 3600 / 24 / 1000);
                var _time = patientCheck[index].remindTime.split(" ")[1];
                var _hour = _time.split(":")[0];
                var _minute = _time.split(":")[1];
                // console.log(_day)
                switch (_day) {
                    case 0:
                        $(".remindText").html("当天" + _hour + ":" + _minute + "提醒产检").attr({
                            "remindDay": _day,
                            "remindHours": _hour,
                            "remindMinute": parseInt(_minute / 15)
                        });
                        break;
                    case 1:
                        $(".remindText").html("提前一天" + _hour + ":" + _minute + "提醒产检").attr({
                            "remindDay": _day,
                            "remindHours": _hour,
                            "remindMinute": parseInt(_minute / 15)
                        });
                        break;
                    case 2:
                        $(".remindText").html("提前二天" + _hour + ":" + _minute + "提醒产检").attr({
                            "remindDay": _day,
                            "remindHours": _hour,
                            "remindMinute": parseInt(_minute / 15)
                        });
                        break;
                }
            } else {
                $(".remindText").html("提前一天10:00提醒产检").attr({
                    "remindDay": 1,
                    "remindHours": 10,
                    "remindMinute": 0
                });
            }
            // wxCheckCellsBeanList
            var wxCheckCellsBeanList = patientCheck[index]["wxCheckCellsBeanList"];
            // 循环wxCheckCellsBeanList
            // console.log(wxCheckCellsBeanList);
            var itemContentDiv = $(".itemContent");
            var itemContentHtml = "";
            for (var i = wxCheckCellsBeanList.length - 1; i >= 0; i--) {
                itemContentHtml += '<a id="itemContentA'+i+'" class="active" href="javascript:;">'+ wxCheckCellsBeanList[i]["name"] +'</a> ';
            }
            itemContentDiv.html(itemContentHtml);
            itemContentAClick();
        } else {
            layer.msg("暂无数据");
            window.location = '/maternal-weChat/user/user.html';
        }
    }

    // 伸缩盒子-start
    $(".foldContent > a").click(function () {
        $(this).toggleClass("foldFalse");
        if ($(this).hasClass("foldFalse")) {
            $(".foldContent").css("height", "5rem")
        } else {
            $(".foldContent").css("height", "auto")
        }
    });
    // 伸缩盒子-end

    // 产检详情-start
    function itemContentAClick(){
        $(".itemContent > a").click(function () {
            var patientCheck = myLocal.getItem("patientCheck");
            if (patientCheck == null) {
                layer.msg("数据异常，请返回首页重新进入!");
            }
            var wxCheckCellsBeanList = patientCheck[currentIndex]["wxCheckCellsBeanList"];
            var wxCheckCellsBeanListChange = wxCheckCellsBeanList[$(this).attr("id").replace("itemContentA","")];
            myLocal.setItem("changeCheckCell",wxCheckCellsBeanListChange);
            window.location = '/maternal-weChat/patientCheckCell/checkCell.html';
        });
    }
    // 产检详情-end

    // 导航栏拖动功能-start
    var startX = 0;
    var widthX = 0;
    // 导航栏的定位 left 值的范围 [ 0 ~ -（导航栏宽度 - 显示部分的宽度）]
    $(".navBox").on({
        // 按下事件
        touchstart: function (e) {
            // startX 按下时导航栏的偏移 = 触摸点在屏幕上距离左侧的距离 - 导航栏已经偏移的距离
            startX = e.originalEvent.targetTouches[0].pageX - parseInt($(this).css('left'));
            // 获取导航栏的宽度
            widthX = $(this).width();
        },
        // 移动事件
        touchmove: function (e) {
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
        touchend: function () {
        }
    })
    // 导航栏拖动功能-end

    // 导航栏焦点切换-start
    $(".navBox").delegate("a", "click", function () {
        $(".navList > a").removeClass("active").eq($(this).index()).addClass("active");
        $(".navBox > a").removeClass("active").eq($(this).index()).addClass("active");
        renderPatientCheck($(this).index());
    })
    $(".navList").delegate("a", "click", function () {
        $(".navList > a").removeClass("active").eq($(this).index()).addClass("active");
        $(".navBox > a").removeClass("active").eq($(this).index()).addClass("active");
        renderPatientCheck($(this).index());
        $(".navListContent").hide();
    })
    $(".btnBox").click(function () {
        $(".navListContent").show();
    })
    $(".closeBtn").click(function () {
        $(".navListContent").hide();
    })
    // 导航栏焦点切换-end

    // 复检提醒 时间 选择 -start
    $(".remindBtn").click(function () {
        var example = new IosSelect(3, // 第一个参数为级联层级，演示为1
            [selectData.remindDay, selectData.remindHours, selectData.remindMinute], {
                container: '.selectContent', // 容器class
                title: '产检提醒', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: $(".remindText").attr("remindday"),//selectData.remindDay[1].id,
                twoLevelId: $(".remindText").attr("remindhours"),//selectData.remindHours[10].id,
                threeLevelId: $(".remindText").attr("remindminute"),//selectData.remindMinute[0].id,
                callback: function (selectOneObj, selectTwoObj, selectThreeObj) { // 用户确认选择后的回调函数
                    $(".remindText").html(selectOneObj.value + selectTwoObj.id + ":" + (selectThreeObj.id * 15 ? selectThreeObj.id * 15 : '00') + "提醒产检").attr({
                        "remindDay": selectOneObj.id,
                        "remindHours": selectTwoObj.id,
                        "remindMinute": selectThreeObj.id,
                    });
                    var oldTiems = new Date($(".makeAppointmentTime").html().split(" ")[0]).getTime();
                    var newTimes = oldTiems - selectOneObj.id * 24 * 3600 * 1000;
                    var newDate = new Date(newTimes);
                    var remindTime = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate() + ' ' + selectTwoObj.id + ":" + (selectThreeObj.id * 15 ? selectThreeObj.id * 15 : '00');
                    updateRemindTime($(".remindText").attr("name"), remindTime);
                },
            });
    })
    // 复检提醒 时间 选择 -end
    function updateRemindTime(id, remindTime) {

        HttpRequstForPost(httpUrl.updateRemindTime,'json',true,{
                "id": id,
                "token": myLocal.getItem("weChatToken"),
                "remindTime": remindTime,
                "weChatOpenId":myLocal.getItem("weChatOpenId"),
            },function sucFn(data){
                 if (data.status == 20200) {
                    layer.msg("设置产检成功");
                    // 查询复检提醒-start
                    $.ajax({
                        type: 'POST',
                        url: httpUrl.findList,
                        dataType: 'json',
                        xhrFields: {
                            withCredentials: true
                        },
                        data: {
                            "token": myLocal.getItem("weChatToken"),
                        },
                        crossDomain: true,
                        success: function (data) {
                            // console.log(data)
                            if (data.status == "20200") {
                                var patientCheck = data.patientCheckForWeekBeanList;
                                myLocal.setItem("patientCheck", patientCheck);
                            } else if (data.status == "20301") {}{
                                layer.msg("设置提醒时间失败，未绑定获取推送用户");
                            }
                        },
                        error: function (err) {
                            // console.log(err);
                        },
                    });
                    // 查询复检提醒-end
                } else {
                    layer.msg("设置产检失败");
                }
            },function errFn(){
                
            });
    }
})
