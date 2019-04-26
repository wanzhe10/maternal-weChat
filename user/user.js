$(function () {
    var xData = [];
    var yData = [];
    var requestLayer = layer.load();
    var lastIndex = 0;
    var reqErrType = false;

    // 授权-start
    UploadOpenIdForWeChatCode(function successFn(sucData) {
        // layer.alert(sucData);
        if (sucData != null && (sucData.status == "20200" || sucData.status == "20300")) {
            myLocal.setItem("weChatOpenIdDetails", sucData.openId);
            myLocal.setItem("weChatOpenIdType", "1");
        } else {
        }
    }, function errorFn(errData) {
        // layer.alert(errData);
    })
    // 授权-end
    // return;
    // tab切换 - start
    $('.tabContnet > a').click(function () {
        if (reqErrType) {
            layer.msg("请点击右上角，刷新当前页，重新请求!");
            return;
        }
        var _index = $(this).index();
        if (lastIndex == _index) {
            layer.msg("已显示当前内容!");
            return;
        }
        lastIndex = _index;
        switch (_index) {
            case 0:
                requestSecondFindList();
                break;
            case 1:
                findWeekCheckList();
                break;
            case 2:
                findHighRiskFindList();
                break;
            case 3:
                requestBMI();
                break;
        }
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.content .item').removeClass('active').eq(_index).addClass('active');
        // if (_index == $('.tabContnet > a').length - 1) {
        //     if (xData.length > 0) {
        //         renderChart(xData, yData);
        //     }
        // }
    })

    // 渲染 BMI 图表
    function renderChart(xData, yData) {
        var xTempData = [];
        for (var index = 13; index < 43; index++) {
            xTempData.push(index)
        }
        var myChart = echarts.init($(".echartsContent")[0]);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '标题'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
            },
            grid: {
                left: '2%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                nameLocation: 'center',
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        var tempInt = value * 1;
                        if (tempInt % 2 == 0 || tempInt == 13)//如果类目项的文字大于3,
                        {
                            return value;
                        } else {
                            return "";
                        }
                    }

                },
                data: xTempData
            }],
            yAxis: [{
                type: 'value',
                nameLocation: 'center',
                min: 10,
                max: 50,
                splitNumber: 8
            }],

            toolbox: {
                show: true,
                orient: 'vertical',
                itemSize: 1,
                itemGap: 2
            },
            series: [{
                type: 'line',
                stack: '',
                color: "#77cae5",
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: yData
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };
    // tab切换 - end

    // 获取基本信息 - start
    HttpRequstForPost(httpUrl.findSelfDetail, 'json', true, {
        "token": myLocal.getItem("weChatToken"),
    }, function sucFn(data) {
        // 授权
        //window.location = httpUrl.weChatRequest;

        reqErrType = false;
        if (data.status == 20200) {
            $(".pregnantNameText").html(data.wxPatientCheckBean.name); //姓名
            data.wxPatientCheckBean.telephone ? $(".telephoneText").html(data.wxPatientCheckBean.telephone) : null; //  电话
            $(".expectedText").html(data.parturitionDetailDueDate); //  预产期
            $(".lastMenstruationText").html(data.parturitionDetailLastMenstruation); //     末次月经
            data.newAgeOfMenarcheDay ? $(".pregnantDay").html((data.newAgeOfMenarche ? data.newAgeOfMenarche + '周+' : '') + data.newAgeOfMenarcheDay + '天') : null; // 孕妇现孕周 - 天
            $(".lastWeight").html(data.wxPatientCheckBean.lastWeight); //   孕前体重
            $(".filingDate").html(data.filingDate); //  建档时间
            $(".parturitionDetailNowHistory").html(data.parturitionDetailNowHistory); //    既往病史
            // data.highRiskClass 高危等级 0.无-默认 1.黄 2.橙 3.红 4.紫
            switch (data.highRiskClass) {
                case '0':
                    $(".risk").html("低风险").addClass("level0");
                    break;
                case '1':
                    $(".risk").html("一般风险").addClass("level1");
                    break;
                case '2':
                    $(".risk").html("较高风险").addClass("level2");
                    break;
                case '3':
                    $(".risk").html("高风险").addClass("level3");
                    break;
                case '4':
                    $(".risk").html("传染病").addClass("level4");
                    break;
            }
            // 请求复检记录
            requestSecondFindList();
        } else {
            $(".firstStep").attr("dataFlag", 0);
        }
    }, function errFn(errData) {
        reqErrType = true;
        layer.closeAll('loading');
    })
    // return;
    // 获取基本信息 - end

    // 复检记录-start
    function requestSecondFindList() {
        HttpRequstForPost(httpUrl.secondFindList, 'json', true, {
            "token": myLocal.getItem("weChatToken"),
        }, function sucFn(data) {
            if (data.status == "20200") {
                var secondCheckArr = data.wxPatientSecondCheckBeanList;
                if (secondCheckArr.length) {
                    myLocal.setItem("secondCheckArr", secondCheckArr);
                    $(".checkDate").html(secondCheckArr[0].checkDate.split(" ")[0]); //检查日期
                    $(".gestational").html((secondCheckArr[0].gestationalWeek ? secondCheckArr[0].gestationalWeek + '周+' : '') + (secondCheckArr[0].gestationalDay ? secondCheckArr[0].gestationalDay : 0) + '天'); //孕周-周-天
                    $(".bloodPressure").html(secondCheckArr[0].bloodPressureHigh + '/' + secondCheckArr[0].bloodPressureLow); //血压-高-低
                    $(".bodyWeight").html(secondCheckArr[0].bodyWeight); //体重
                    $(".presentation").html(selectData.presentation[secondCheckArr[0].presentation].value); //露 0.未填写-默认 1.头先露 2.臀先露
                    $(".abdominalGirth").html(secondCheckArr[0].abdominalGirth); //腹围
                    $(".highPalace").html(secondCheckArr[0].highPalace); //宫高
                    $(".cohesion").html(selectData.cohesion[secondCheckArr[0].cohesion].value); //衔接 0.未衔接-默认 1.已衔接
                    $(".malaise").html(secondCheckArr[0].malaise); //自觉不适
                } else {
                    $(".content .item").eq(0).html('<p class="noData">暂无复检记录</p>')
                }
            } else {
                $(".content .item").eq(0).html('<p class="noData">暂无复检记录</p>')
            }
        }, function errFn() {

        })
    }

    // 复检记录-end
    // 查询复检提醒-start
    function findWeekCheckList() {
        HttpRequstForPost(httpUrl.findList, 'json', true, {
            "token": myLocal.getItem("weChatToken"),
        }, function sucFn(data) {
            if (data.status == "20200") {
                var patientCheck = data.patientCheckForWeekBeanList;
                myLocal.setItem("patientCheck", patientCheck);
                $(".makeAppointmentTime").html(patientCheck[0].makeAppointmentTime);// 预约时间
                $(".checkDetail").html(patientCheck[0].checkDetail); // 产检须知
                $(".remarks").html(patientCheck[0].remarks); // 温馨提醒
            } else {
                $(".content .item").eq(1).html('<p class="noData">暂无复检提醒</p>');
            }
        }, function errFn() {

        })
    }

    // 查询复检提醒-end

    // 查询高危列表-start
    function findHighRiskFindList() {
        HttpRequstForPost(httpUrl.highRiskFindList, 'json', true, {
            "token": myLocal.getItem("weChatToken"),
        }, function sucFn(data) {
            if (data.status == "20200") {
                console.log(data);
                var highRiskArr = data.wxPatientHighRiskGradeBeanList;
                if (highRiskArr.length) {
                    myLocal.setItem("highRiskArr", highRiskArr);
                    $(".highRiskDate").html(highRiskArr[0].createDate);
                    var totalNum = eval("(" + highRiskArr[0].totalNum + ")");
                    $(".totalNum").html('<span>绿色(' + totalNum.green + ')项</span><span>黄色(' + totalNum.yellow + ')项</span><span>橙色(' + totalNum.orange + ')项</span><span>红色(' + totalNum.red + ')项</span><span>紫色(' + totalNum.purple + ')项</span>');
                    var details = eval("(" + highRiskArr[0].details + ")");
                    $(".details").html('<span>绿色：' + details.green.join() + '</span><span>黄色：' + details.yellow.join() + '</span><span>橙色：' + details.orange.join() + '</span><span>红色：' + details.red.join() + '</span><span>紫色：' + details.purple.join() + '</span>')
                } else {
                    $(".content .item").eq(2).html('<p class="noData">暂无高危评估记录</p>');
                }
            } else {
                $(".content .item").eq(2).html('<p class="noData">暂无高危评估记录</p>');
            }
        }, function errFn() {

        })
    }

    // 查询高危列表-end

    // 查询BMI值 - start
    function requestBMI() {
        HttpRequstForPost(httpUrl.findListByCenterId, 'json', true, {
            "token": myLocal.getItem("weChatToken"),
        }, function sucFn(data) {
            var tempData = [];
            if (data.status == "20200") {
                var BMIArr = data.templateDiagnoseBeanList;
                var a;
                var isErr = false;
                for (var i = 0; i < BMIArr.length; i++) {
                    var tempArr = [];
                    a = JSON.parse(BMIArr[i].newAgeOfMenarche);
                    a = a * 1 - 13;
                    if (a < 0) {
                        isErr = true;
                        continue;
                    }
                    tempArr.push(a);
                    tempArr.push(BMIArr[i].details);
                    tempData.push(tempArr);
                }
                renderChart(xData, tempData);
                if (isErr) {
                    layer.msg("数据异常，怀孕13周以前数据无法显示！");
                }
            } else {
                $(".content .item").eq(3).html('<p class="noData">暂无BMI记录</p>');
            }
        }, function errFn() {

        })
    }

    // 查询BMI值 - end

    $('.recheckBtn').click(function () {
        window.location = '/maternal-weChat/recheckList/recheckList.html';
    })

    $('.highRiskBtn').click(function () {
        window.location = '/maternal-weChat/highRiskList/highRiskList.html';
    })

})
