$(function () {
    // tab 切换 - start
    $('.tabContent > a').click(function () {
        var _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.content .item').hide().eq(_index).show();
    })
    // tab 切换 - end
    // 处理教育程度
    // var diplomaMap = new Map();
    // for (var i = selectData.diploma.length - 1; i >= 0; i--) {
    //     diplomaMap.set(selectData.diploma[i].id + '',selectData.diploma[i].value);
    // }
    //console.log(diplomaMap.get(0));
    // 第一个tab 查询基本信息 - start
    HttpRequstForPost(httpUrl.findSelfDetail,'json',true,{
            "token": myLocal.getItem("weChatToken"),
        },
        function sucFn(data){
            if (data.status == 20200) {
                $(".expectedText").html(data.parturitionDetailDueDate); //  预产期
                $(".lastMenstruationText").html(data.parturitionDetailLastMenstruation); //     末次月经
                data.newAgeOfMenarcheDay ? $(".pregnantDay").html((data.newAgeOfMenarche ? data.newAgeOfMenarche + '周+' : '') + data.newAgeOfMenarcheDay + '天') : null; // 孕妇现孕周 - 天
                $(".pregnantName").html(data.wxPatientCheckBean.name); //姓名
                $(".idCardType").html(selectData.papers[data.wxPatientCheckBean.idCardType].value); //证件类型
                $(".idCard").html(data.wxPatientCheckBean.idCard); //证件号
                data.wxPatientCheckBean.telephone ? $(".telephone").html(data.wxPatientCheckBean.telephone) : null; //  电话
                $(".birthdayDate").html(data.wxPatientCheckBean.birthdayDate); //       出生日期
                $(".jobCompanyName").html(data.wxPatientCheckBean.jobCompanyName); //       出生日期
                $(".age").html(data.wxPatientCheckBean.age); // 年龄
                $(".marryType").html(selectData.marryType[data.wxPatientCheckBean.marryType].value); //婚姻状况 0 初婚-默认 1 再婚 2其他
                $(".marryAge").html(data.wxPatientCheckBean.marryAge); //   结婚年龄
                $(".lastWeight").html(data.wxPatientCheckBean.lastWeight); //   孕前体重
                // $(".contraception").html(data.wxPatientCheckBean.contraception); //  孕前避孕
                $(".contraception").html(selectData.contraception[data.wxPatientCheckBean.contraception].value); // 孕前避孕 0.未避孕-默认 1.口服避孕药 2.避孕套 3.避孕膜 4.其他
                $(".job").html(selectData.occupation[data.wxPatientCheckBean.job].value); //    工作 0 无-默认 1.农、牧、渔 2.干部、职员 3
                $(".education").html(selectDataMap.diploma[data.wxPatientCheckBean.education]); //教育程度 0 硕士以上 1本科-默认 2大专 3中
                // $(".diplomaInput").attr("name", data.wxPatientCheckBean.education); //教育程度 0 硕士以上 1本科-默认 2大专 3中
                $(".areaText").html(data.wxPatientCheckBean.idCardAddressProvince + data.wxPatientCheckBean.idCardAddressCity + data.wxPatientCheckBean.idCardAddressCounty); //    身份证所在地-省 - 市 -县
                $(".newAddr").html(data.wxPatientCheckBean.newAddressProvince + data.wxPatientCheckBean.newAddressCity + data.wxPatientCheckBean.newAddressCounty + data.wxPatientCheckBean.newAddressRemarks); // 现住址 省-市-县-详情
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
            } else {
                layer.msg("查询失败");
            }
        },function errFn(err){
            console.log(err);
        })
    // 第一个tab 查询基本信息 - end
    // 第二个tab 配偶信息 - start
    HttpRequstForPost(httpUrl.findMate,'json',true,{
            "token": myLocal.getItem("weChatToken"),
        },function sucFn(data){
            if (data.status == 20200) {
                $(".mateName").html(data.name); //姓名
                $(".mateIdCard").html(data.idCard); //证件号码
                $(".mateIdCardType").html(selectData.papers[data.idCardType].value); //证件类型
                $(".mateBirthdayDate").html(data.birthdayDate); //出生日期
                $(".mateAge").html(data.age); //年龄
                $(".mateTelephone").html(data.telephone); //电话
                $(".healthTypeInput").html(selectData.healthType[data.healthType].value); //健康状况 0 健康-默认 1 一般 2 较弱
                $(".educationInput").html(selectDataMap.diploma[data.education]); //教育程度 0 硕士以上 1本科-默认 2大专
                // $(".educationInput").html(diplomaMap.get(data.education)); //教育程度 0 硕士以上 1本科-默认 2大专
                $(".mateOccupationInput").html(selectData.occupation[data.job].value); //工作 0 无-默认 1.农、牧、渔 2.干部、
                $(".mateMarryAge").html(data.marryAge); //结婚年龄
                $(".mateMarryType").html(selectData.marryType[data.marryType].value); //婚姻状况
                //吸烟
                if (data.smoke > 0) {
                    $(".smokeInput").html("是");
                    $(".smokeBox").css("display", "flex");
                    $(".smokeNum").html(data.smoke);
                } else {
                    $(".smokeInput").html("否");
                    $(".smokeBox").css("display", "none");
                }
                $(".drinkInput").html(selectData.drink[data.drink].value); //饮酒 0 否-默认 1.偶尔 2.经常
                $(".patientHistory").html((data.patientHistory == null || data.patientHistory.length == 0)?"无":data.patientHistory); //家族史
                $(".mateAreaInput").html(data.newAddressProvince + data.newAddressCity + data.newAddressCounty + data.newAddressRemarks); //现住址-省份 -市 -县-详情
            } else { }
        },function errFn(err){
            onsole.log(err);
        });
    // 第二个tab 配偶信息 - end
    // 第三个tab 孕产信息 - start
    HttpRequstForPost(httpUrl.findPregnancy,'json',true,{
            "token": myLocal.getItem("weChatToken"),
        },function sucFn(data){
             if (data.status == 20200) {
                $(".firstCheckDate").html(data.firstCheckDate); // 初诊日期
                $(".lastMenstruation").html(data.lastMenstruation); // 末次月经
                $(".dueDate").html(data.dueDate); //    预产期
                $(".menstrualHistoryAge").html(data.menstrualHistoryAge); // 月经史-初潮-岁
                $(".menstrualHistoryDay").html(data.menstrualHistoryDay); // 月经史-周次
                $(".pregnancyNumber").html(data.pregnancyNumber); // 怀孕次数
                $(".morningSickness").html(selectDataMap.morningSickness[data.morningSickness]); // 早孕反应程度 0轻-默认、1中、2中 3无
                $(".ketosis").html(selectData.ketosis[data.ketosis].value); // 酮症 0没有-默认 1有
                // $(".familyHistory").html(data.familyHistory); // 家族史
                // $(".nowHistory").html(data.nowHistory); // 现病史
                $(".familyHistory").html((data.familyHistory == null || data.familyHistory.length == 0)?"无":data.familyHistory); //家族史
                $(".nowHistory").html((data.nowHistory == null || data.nowHistory.length == 0)?"无":data.nowHistory); //现病史

                // 怀孕次数
                var tempArr = data.wxPatientParturitionDetailHistoryBeanList;
                if (tempArr.length > 0) {
                    $(".pregnancyContent").show();
                    var _navHtml = '';
                    var _bodyHtml = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        _navHtml += '<a class="' + (i == 0 ? "active" : "") + '" href="javascript:;">胎次:' + tempArr[i].number + '</a>';
                        _bodyHtml += '<div class="pregnancyItem '+(i == 0 ? "active" : "")+'">\
                        <div class="baseBox">\
                            <p class="">'+ tempArr[i].productionDate + '</p><p>孕' + (tempArr[i].ageOfMenarche?tempArr[i].ageOfMenarche+"周+":"")+ (tempArr[i].ageOfMenarcheDay?tempArr[i].ageOfMenarcheDay+"天":"0天")+ '</p><p>' + (tempArr[i].productionAbortion == 0 ? "自然分娩" : "人工分娩") + '</p><p>孕产年龄 : ' + tempArr[i].productionOfAge + '</p><p>婴儿性别 : ' + (tempArr[i].babySex == 0 ? "男" : "女") + '</p>\
                        </div>\
                        <div class="remarkBox">\
                            <p>备注信息 : '+ tempArr[i].remarks + '</p>\
                        </div>\
                    </div>';
                    }
                    $(".pregnancyTab").html(_navHtml);
                    $(".pregnancyBox").html(_bodyHtml);
                } else {
                    $(".pregnancyContent").hide();
                }
                
                //孕前是否用药 0 没有-默认 1
                if (data.parturitionFrontPharmacy == 0) {
                    $(".parturitionFrontPharmacy").html("否");
                } else if (data.parturitionFrontPharmacy == 1) {
                    $(".parturitionFrontPharmacy").html("是");
                }

                //宠物接触 0 没有-默认 1 有
                if (data.animalContact == 0) {
                    $(".animalContact").html("没有");
                } else if (data.animalContact == 1) {
                    $(".animalContact").html("有");
                }

                //病毒感染 0 0 无-默认 1 有
                if (data.virusInfection == 0) {
                    $(".virusInfection").html("无");
                } else if (data.virusInfection == 1) {
                    $(".virusInfection").html("有");
                }

                //接触放射线 0 不是-默认 1 是
                if (data.contactRadioactiveRays == 0) {
                    $(".contactRadioactiveRays").html("无");
                } else if (data.contactRadioactiveRays == 1) {
                    $(".contactRadioactiveRays").html("有");
                }

                //接触毒物 0 不是-默认 1 是
                if (data.contactToxic == 0) {
                    $(".contactToxic").html("无");
                } else if (data.contactToxic == 1) {
                    $(".contactToxic").html("有");
                }
            } else {

            }
        },function errFn(err){
             console.log(err);
        });
   
    $(".pregnancyTab").delegate("a", "click", function(){
        var _index = $(this).index();
        $(this).addClass("active").siblings("a").removeClass("active");
        $(".pregnancyBox > div").hide().eq(_index).show();
    })
    // 第三个tab 孕产信息 - end
    // 第四个tab 体格检查 - start
    HttpRequstForPost(httpUrl.findSelf,'json',true,{
            "token": myLocal.getItem("weChatToken"),
        },function sucFn(data){
            if (data.status == 20200) {
                $(".bloodPressure").html(data.baseBloodPressureHigh + '/' + data.baseBloodPressureLow); //血压 收缩压-舒张压
                $(".baseHeight").html(data.baseHeight); //身高 cm
                $(".baseWeight").html(data.baseWeight); //体重 kg
                $(".baseSpinalLimbsDeformity").html(selectData.malformation[data.baseSpinalLimbsDeformity].value); //脊柱四肢-畸形 0正常-默认 1畸
                $(".baseSpinalLimbsEdema").html(selectData.edema[data.baseSpinalLimbsEdema].value); //脊柱四肢-水肿 0无-默认 1轻 2中 3重
                $(".baseHeartRate").html(data.baseHeartRate == 0 ? "正常":"异常"); //心率（次/分） 0.未填写
                $(".baseLung").html(data.baseLung == 0?"正常":"异常"); //肺部 0.未见异常-默认
                $(".baseAbdomenLiver").html(data.baseAbdomenLiver == 0?"正常":"异常"); //腹部-肝 0.未见异常-默认
                $(".baseAbdomenSpleen").html(data.baseAbdomenSpleen == 0?"正常":"异常"); //腹部-脾 0.未见异常-默认
                $(".breasts").html(selectData.breasts[data.baseBreasts].value); //乳房 0.丰满-默认 1.扁平
                $(".nipple").html(selectData.nipple[data.baseNipple].value); //乳头 0.凸-默认 1.凹
                $(".obstetricsVulva").html(data.obstetricsVulva == 0?"正常":"异常"); //妇科检查-外阴 0.正常-默认 1.异常
                $(".obstetricsVagina").html(data.obstetricsVagina == 0 == 0?"通畅":"异常"); //妇科检查-阴道 0.通畅-默认
                $(".obstetricsCervix").html(data.obstetricsCervix == 0?"正常":"异常"); //妇科检查-宫颈 0.光滑-默认
                $(".obstetricsCorpus").html(data.obstetricsCorpus == 0?"正常":"异常"); //妇科检查-宫体 0.未见异常-默认
                $(".obstetricsPairsAttachment").html(data.obstetricsPairsAttachment == 0?"正常":"异常"); //妇科检查-双附件 0.未见异常-默
                // $(".assayUrineProtein").html(selectData.urineProtein[data.assayUrineProtein].value); //化验检查-尿蛋白 未填写-默认
                $(".assayUrineProtein").html(data.assayUrineProtein); //化验检查-尿蛋白 
                $(".assayHemoglobin").html(data.assayHemoglobin); //化验检查-血红蛋白 
                $(".assayBloodPlatelet").html(data.assayBloodPlatelet); //化验检查-血小板 
                $(".assayBloodType").html(selectData.assayBloodType[data.assayBloodType].value); //化验检查-血型 0.O型-默认 1.A型 2.B
                $(".obstetricsHeight").html(data.obstetricsHeight+' cm'); //产科检查-宫底高度
                $(".obstetricsAbdominalGirth").html(data.obstetricsAbdominalGirth+' cm'); //产科检查-腹围
                $(".obstetricsFirstDew").html(selectData.presentation[data.obstetricsFirstDew].value); //产科检查-先露 0.未填-默认 1.先头露 2.
                $(".obstetricsPlacental").html(selectData.position[data.obstetricsPlacental].value); //产科检查-胎位 0.未填-默认 1.枕左前位 2.枕右横位 3.枕右前位
                $(".obstetricsFetalHeart").html(data.obstetricsFetalHeart + ' 次/分'); //产科检查-胎心（次/分）
                $(".obstetricsTransversePelvicDiameter").html(data.obstetricsTransversePelvicDiameter+' cm'); //产科检查-骨盆口横径
                $(".primaryDiagnosis").html(data.primaryDiagnosis); //初步诊断
                $(".disposal").html(data.disposal); //处置
            } else {

            }
        },
        function errFn(err){});
    // $.ajax({
    //     type: 'POST',
    //     url: httpUrl.findSelf,
    //     dataType: 'json',
    //     data: {
    //         "token": myLocal.getItem("weChatToken"),
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function (data) {
    //         console.log(data)
    //         if (data.status == 20200) {
    //             $(".bloodPressure").html(data.baseBloodPressureHigh + '/' + data.baseBloodPressureLow); //血压 收缩压-舒张压
    //             $(".baseHeight").html(data.baseHeight); //身高 cm
    //             $(".baseWeight").html(data.baseWeight); //体重 kg
    //             $(".baseSpinalLimbsDeformity").html(selectData.malformation[data.baseSpinalLimbsDeformity].value); //脊柱四肢-畸形 0正常-默认 1畸
    //             $(".baseSpinalLimbsEdema").html(selectData.edema[data.baseSpinalLimbsEdema].value); //脊柱四肢-水肿 0无-默认 1轻 2中 3重
    //             $(".baseHeartRate").html(data.baseHeartRate == 0 ? "正常":"异常"); //心率（次/分） 0.未填写
    //             $(".baseLung").html(data.baseLung == 0?"正常":"异常"); //肺部 0.未见异常-默认
    //             $(".baseAbdomenLiver").html(data.baseAbdomenLiver == 0?"正常":"异常"); //腹部-肝 0.未见异常-默认
    //             $(".baseAbdomenSpleen").html(data.baseAbdomenSpleen == 0?"正常":"异常"); //腹部-脾 0.未见异常-默认
    //             $(".breasts").html(selectData.breasts[data.baseBreasts].value); //乳房 0.丰满-默认 1.扁平
    //             $(".nipple").html(selectData.nipple[data.baseNipple].value); //乳头 0.凸-默认 1.凹
    //             $(".obstetricsVulva").html(data.obstetricsVulva == 0?"正常":"异常"); //妇科检查-外阴 0.正常-默认 1.异常
    //             $(".obstetricsVagina").html(data.obstetricsVagina == 0 == 0?"通畅":"异常"); //妇科检查-阴道 0.通畅-默认
    //             $(".obstetricsCervix").html(data.obstetricsCervix == 0?"正常":"异常"); //妇科检查-宫颈 0.光滑-默认
    //             $(".obstetricsCorpus").html(data.obstetricsCorpus == 0?"正常":"异常"); //妇科检查-宫体 0.未见异常-默认
    //             $(".obstetricsPairsAttachment").html(data.obstetricsPairsAttachment == 0?"正常":"异常"); //妇科检查-双附件 0.未见异常-默
    //             // $(".assayUrineProtein").html(selectData.urineProtein[data.assayUrineProtein].value); //化验检查-尿蛋白 未填写-默认
    //             $(".assayUrineProtein").html(data.assayUrineProtein); //化验检查-尿蛋白 
    //             $(".assayHemoglobin").html(data.assayHemoglobin); //化验检查-血红蛋白 
    //             $(".assayBloodPlatelet").html(data.assayBloodPlatelet); //化验检查-血小板 
    //             $(".assayBloodType").html(selectData.assayBloodType[data.assayBloodType].value); //化验检查-血型 0.O型-默认 1.A型 2.B
    //             $(".obstetricsHeight").html(data.obstetricsHeight+' cm'); //产科检查-宫底高度
    //             $(".obstetricsAbdominalGirth").html(data.obstetricsAbdominalGirth+' cm'); //产科检查-腹围
    //             $(".obstetricsFirstDew").html(selectData.presentation[data.obstetricsFirstDew].value); //产科检查-先露 0.未填-默认 1.先头露 2.
    //             $(".obstetricsPlacental").html(selectData.position[data.obstetricsPlacental].value); //产科检查-胎位 0.未填-默认 1.枕左前位 2.枕右横位 3.枕右前位
    //             $(".obstetricsFetalHeart").html(data.obstetricsFetalHeart + ' 次/分'); //产科检查-胎心（次/分）
    //             $(".obstetricsTransversePelvicDiameter").html(data.obstetricsTransversePelvicDiameter+' cm'); //产科检查-骨盆口横径
    //             $(".primaryDiagnosis").html(data.primaryDiagnosis); //初步诊断
    //             $(".disposal").html(data.disposal); //处置
    //         } else {

    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // });
    // 第四个tab 体格检查 - end

    // 完成按钮-start
    $('.submitBtn').click(function () {
        window.location = '/maternal-weChat/user/user.html'
    })
    // 完成按钮-end

})
