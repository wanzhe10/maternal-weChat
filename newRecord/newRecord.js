var newRecotTemplateDataMap = {};
var templateKeysArr = ["A","B","C","D","E","F","G","H","I","J","K","L",
                           "M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var templateListArr = [];
$(function() {
    var tabFocus = 1;
    var layerIndex = layer.load();
    var layerIndexNumber = 0;
    var anamnesisIllnessList;
    var templateOnClickStr = "";  // 模板选择str
    var templateOnClickInput;     // 模板选择div
    var templateOnClickMap;       // 模板选择div
    var classBody = $("#classBody");

    // 授权-start
    UploadOpenIdForWeChatCode(function successFn(sucData){
        if (sucData != null && (sucData.status == "20200"||sucData.status == "20300")) {
            myLocal.setItem("weChatOpenIdDetails", sucData.openId);
            myLocal.setItem("weChatOpenIdType", "1");
        }else{
        }
    },function errorFn(errData){
        // layer.alert(errData);
    })
    
    // 授权-end

    // 顶部tab切换-start
    $('.tabContent > a').click(function() {
        tabFocus = $(this).index();
        $(".submitContent > a").eq($(".submitContent > a.active").index()).click();
    })

    function switchNav(index) {
        $('.tabContent > a').removeClass("active").eq(index).addClass('active');
        $('.content .item').hide().eq(index).show();
        $(".submitContent > a").removeClass("active").eq(index).addClass('active');
        $('html,body').animate({
            scrollTop: 0
        }, 30);
    }
    // 顶部tab切换-end

    // 建档须知 - start
    // var top = 0;//给top变量一个初始值，以便下方赋值并引用。
    if (!myLocal.getItem('notice')) {
        HttpRequstForGet(httpUrl.findNewsEntity, 'json', false,"", function sucFn(data){
             layer.close(layerIndex);
                if (data.status == "20200") {
                    $(".noticeBox").html(data.detail);
                } else {
                }
        }, function errFn(){
            layer.close(layerIndex);
            console.log(err);
        }) 
        //classBody.css('overflow','hidden');
        $(".noticeContainer").show();
        // top = $(window).scrollTop();//获取页面的scrollTop；
        // $('body').css("top",-top+"px");//给body一个负的top值；
        // $('body').addClass('bodyClass');//给body增加一个类，position:fixed; 
    } else {
        $(".noticeContainer").hide();
        // $('body').removeClass('bodyClass');//去掉给body的类
        // $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
    }
    $(".noticeContainer").find('.noBtn').click(function() {
        // classBody.css('overflow','visible');
        
        $(".noticeContainer").hide();
        // 关闭微信浏览器
        WeixinJSBridge.call('closeWindow');
    })
    $(".noticeContainer").find('.yesBtn').click(function() {
        //classBody.css('overflow','visible');
        myLocal.setItem("notice", '1');
        $(".noticeContainer").hide();
    })
    // 建档须知 - end
    // 获取第一部分信息-start
    var pregnantObj = {}; // 孕妇信息
    var husbandMateObj = {}; // 配偶信息
    var wxPatientCheckBean = {};  // 基本信息
    HttpRequstForPost(httpUrl.findSelfDetail,'json',false,{
        "token": myLocal.getItem("weChatToken"),
    },function sucFn(data){
        layer.closeAll('loading');
        if (data.status == 20200) {
                pregnantObj = data;
                wxPatientCheckBean = data.wxPatientCheckBean;
                $(".firstStep").attr("dataFlag", 1);
                $(".expectedText").html(data.parturitionDetailDueDate); //  预产期
                $(".lastMenstruationText").html(data.parturitionDetailLastMenstruation); //     末次月经
                $(".lastMenstruationInput").val(data.parturitionDetailLastMenstruation); // 末次月经
                data.newAgeOfMenarcheDay ? $(".pregnantDay").html((data.newAgeOfMenarche ? data.newAgeOfMenarche + '周+' : '') + data.newAgeOfMenarcheDay + '天') : null; // 孕妇现孕周 - 天
                $(".pregnantName").val(data.wxPatientCheckBean.name); //姓名
                $(".pregnantNameText").html(data.wxPatientCheckBean.name); //姓名
                $(".papersInput").attr("name", data.wxPatientCheckBean.idCardType); //证件类型
                $(".idCard").val(data.wxPatientCheckBean.idCard); //证件号
                $(".telephone").val(data.wxPatientCheckBean.telephone); //  电话
                $(".jobCompanyName").val(data.wxPatientCheckBean.jobCompanyName); //  公司名称
                data.wxPatientCheckBean.telephone ? $(".telephoneText").html(data.wxPatientCheckBean.telephone) : null; //  电话
                $(".birthdayDate").val(data.wxPatientCheckBean.birthdayDate); //        出生日期
                $(".age").val(data.wxPatientCheckBean.age); //  年龄
                $(".diplomaInput").attr("name", data.wxPatientCheckBean.education); //教育程度 0 硕士以上 1本科-默认 2大专 3中
                $(".marryAge").val(data.wxPatientCheckBean.marryAge); //    结婚年龄
                $(".nationInput").attr("name", data.wxPatientCheckBean.nation); //  民族
                $(".lastWeight").val(data.wxPatientCheckBean.lastWeight); //    孕前体重
                $(".contraception").val(data.wxPatientCheckBean.contraception); //  孕前避孕
                $(".occupationInput").attr("name", data.wxPatientCheckBean.job); // 工作 0 无-默认 1.农、牧、渔 2.干部、职员 3
                $(".marryTypeInput").attr("name", data.wxPatientCheckBean.marryType); //婚姻状况 0 初婚-默认 1 再婚 2其他
                $(".marryCheckInput").attr("name", data.wxPatientCheckBean.marryCheck); //  婚检 0 无 1 有-默认
                
                if (data.wxPatientCheckBean.idCardAddressProvince.length>0||
                    data.wxPatientCheckBean.idCardAddressCity.length>0||
                    data.wxPatientCheckBean.idCardAddressCounty.length>0) {
                    // 处理现住址信息
                    var dataProvinceCode = '';
                    var dataCityCode = '';
                    var dataDistrictCode = '';
                    var tempStr = '';
                    getAreaDataNumberForDetails(data.wxPatientCheckBean.idCardAddressProvince,data.wxPatientCheckBean.idCardAddressCity,data.wxPatientCheckBean.idCardAddressCounty,
                        function(tempProvinces,tempCitys,tempCountys){
                            dataProvinceCode = tempProvinces;
                            dataCityCode = tempCitys;
                            dataDistrictCode = tempCountys;
                    });
                    tempStr = data.wxPatientCheckBean.idCardAddressProvince + data.wxPatientCheckBean.idCardAddressCity+ data.wxPatientCheckBean.idCardAddressCounty;
                    areAddress($(".areaInput"),tempStr);
                    $(".areaInput").val(tempStr).attr({
                        "province": data.wxPatientCheckBean.idCardAddressProvince,
                        "city": data.wxPatientCheckBean.idCardAddressCity,
                        "district": data.wxPatientCheckBean.idCardAddressCounty,
                        "data-province-code": dataProvinceCode,
                        "data-city-code": dataProvinceCode,
                        "data-district-code": dataProvinceCode
                    });
                }
                if (data.wxPatientCheckBean.newAddressProvince.length>0||
                    data.wxPatientCheckBean.newAddressCity.length>0||
                    data.wxPatientCheckBean.newAddressCounty.length>0) {
                    var newDataProvinceCode = '';
                    var newDataCityCode = '';
                    var newDataDistrictCode = '';
                    var tempStr = '';
                    getAreaDataNumberForDetails(data.wxPatientCheckBean.newAddressProvince,data.wxPatientCheckBean.newAddressCity,data.wxPatientCheckBean.newAddressCounty,
                        function(tempProvinces,tempCitys,tempCountys){
                            newDataProvinceCode = tempProvinces;
                            newDataCityCode = tempCitys;
                            newDataDistrictCode = tempCountys;
                    });
                    tempStr = data.wxPatientCheckBean.newAddressProvince + data.wxPatientCheckBean.newAddressCity + data.wxPatientCheckBean.newAddressCounty;
                    areAddress($(".presentAreaInput"),tempStr);
                    $(".presentAreaInput").val(tempStr).attr({
                        "province": data.wxPatientCheckBean.newAddressProvince,
                        "city": data.wxPatientCheckBean.newAddressCity,
                        "district": data.wxPatientCheckBean.newAddressCounty,
                        "data-province-code": newDataProvinceCode,
                        "data-city-code": newDataCityCode,
                        "data-district-code": newDataDistrictCode
                    }); 
                }
                // 现住址 省-市-县
                $(".newAddressRemarks").val(data.wxPatientCheckBean.newAddressRemarks); //  现住址-详情
            } else {
                $(".firstStep").attr("dataFlag", 0);
            }
    },function errFn(){
        layer.closeAll('loading');
    })
    // 获取第一部分信息-end
    
    // 配偶信息查询-start
    HttpRequstForPost(httpUrl.findMate,'json',false,{
        "token": myLocal.getItem("weChatToken"),
    },function sucFn(data){
        if (data.status == 20200) {
                $(".secondStep").attr("dataFlag", 1);
                husbandMateObj = data;
                $(".mateName").val(data.name); //姓名
                $(".mateInput").attr("name", data.idCardType); //身份类型 0 身份证-默认 1护照
                $(".mateIdCard").val(data.idCard); //证件号码
                $(".mateBirthdayDate").val(data.birthdayDate); //出生日期
                $(".mateAge").val(data.age); //年龄
                $(".mateTelephone").val(data.telephone); //电话
                $(".healthTypeInput").attr("name", data.healthType); //健康状况 0 健康-默认 1 一般 2 软弱
                $(".educationInput").attr("name", data.education); //教育程度 0 硕士以上 1本科-默认 2大专
                $(".mateOccupationInput").attr("name", data.job); //工作 0 无-默认 1.农、牧、渔 2.干部、
                $(".mateMarryAge").val(data.marryAge); //结婚年龄
                $(".mateMarryTypeInput").attr("name", data.marryType); //婚姻状况 0 初婚-默认 1再婚 2
                $(".mateMarryCheckInput").attr("name", data.marryCheck); //婚检 0 没有-默认 1.
                //吸烟
                if (data.smoke > 0) {
                    $(".smokeInput").val("是").attr("name", 1);
                    $(".smokeBox").css("display", "flex");
                    $(".smokeNumInput").val(data.smoke)
                } else {
                    $(".smokeInput").val("否").attr("name", 0);
                }
                $(".drinkInput").attr("name", data.drink); //饮酒 0 否-默认 1.偶尔 2.经常
                var patientHistoryStr = data.patientHistory;
                if (patientHistoryStr.length > 0) {
                    $(".patientHistory").attr({
                        "allValue":patientHistoryStr,
                    });
                    if (patientHistoryStr.length > 9) {
                        $(".patientHistory").val(patientHistoryStr.substring(0,9)+"..");
                    }else{
                        $(".patientHistory").val(patientHistoryStr);
                    }
                }
                if (data.newAddressProvince.length>0||
                    data.newAddressCity.length>0||
                    data.newAddressCounty.length>0) {
                    // 身份证所在地-省 - 市 -县
                    var dataProvinceCode;
                    var dataCityCode;
                    var dataDistrictCode;
                    var tempStr;
                    getAreaDataNumberForDetails(data.newAddressProvince,data.newAddressCity,data.newAddressCounty,
                        function(tempProvinces,tempCitys,tempCountys){
                            areaDataProvinceCode = tempProvinces;
                            areaDataCityCode = tempCitys;
                            areaDataDistrictCode = tempCountys;
                    });
                    tempStr = data.newAddressProvince + data.newAddressCity + data.newAddressCounty;
                    areAddress($(".mateAreaInput"),tempStr);
                    $(".mateAreaInput").val(data.newAddressProvince + data.newAddressCity + data.newAddressCounty).attr({
                    "province": data.newAddressProvince,
                    "city": data.newAddressCity,
                    "county": data.newAddressCounty,
                    "data-province-code": areaDataProvinceCode,
                    "data-city-code": areaDataCityCode,
                    "data-district-code": areaDataDistrictCode
                    }); 
                }
                
                //现住址-省份 -市 -县
                $(".mateNewAddressRemarks").val(data.newAddressRemarks); //现住址-详情
            } else if (data.status == 20209) {
                // 没有配偶信息
                $(".secondStep").attr("dataFlag", 0);
                husbandMateObj = data;
                husbandMateObj["idCardType"] = 0;
                husbandMateObj["healthType"] = 0;
                husbandMateObj["education"] = 1;
                husbandMateObj["job"] = 0;
                husbandMateObj["marryType"] = 0;
                husbandMateObj["marryCheck"] = 0;
                husbandMateObj["drink"] = 0;
                husbandMateObj["smokeInput"] = 0;

                $(".mateInput").attr("name", 0); //身份类型 0 身份证-默认 1护照
                $(".healthTypeInput").attr("name", 0); //健康状况 0 健康-默认 1 一般 2 软弱
                $(".educationInput").attr("name", 1); //教育程度 0 硕士以上 1本科-默认 2大专
                $(".mateOccupationInput").attr("name", 0); //工作 0 无-默认 1.农、牧、渔 2.干部、
                $(".mateMarryTypeInput").attr("name", 0); //婚姻状况 0 初婚-默认 1再婚 2
                $(".mateMarryCheckInput").attr("name", 0); //婚检 0 没有-默认 1.
                $(".smokeInput").val("否").attr("name", 0);
                $(".drinkInput").attr("name", 0); //饮酒 0 否-默认 1.偶尔 2.经常

                if (wxPatientCheckBean != null) {
                    if (wxPatientCheckBean.newAddressProvince.length>0||
                    wxPatientCheckBean.newAddressCity.length>0||
                    wxPatientCheckBean.newAddressCounty.length>0) {
                    // 身份证所在地-省 - 市 -县
                    var dataProvinceCode;
                    var dataCityCode;
                    var dataDistrictCode;
                    var tempStr;
                    getAreaDataNumberForDetails(wxPatientCheckBean.newAddressProvince,wxPatientCheckBean.newAddressCity,wxPatientCheckBean.newAddressCounty,
                        function(tempProvinces,tempCitys,tempCountys){
                            areaDataProvinceCode = tempProvinces;
                            areaDataCityCode = tempCitys;
                            areaDataDistrictCode = tempCountys;
                    });
                    tempStr = wxPatientCheckBean.newAddressProvince + wxPatientCheckBean.newAddressCity + wxPatientCheckBean.newAddressCounty;
                    areAddress($(".mateAreaInput"),tempStr);
                    $(".mateAreaInput").val(wxPatientCheckBean.newAddressProvince + wxPatientCheckBean.newAddressCity + wxPatientCheckBean.newAddressCounty).attr({
                        "province": wxPatientCheckBean.newAddressProvince,
                        "city": wxPatientCheckBean.newAddressCity,
                        "county": wxPatientCheckBean.newAddressCounty,
                        "data-province-code": areaDataProvinceCode,
                        "data-city-code": areaDataCityCode,
                        "data-district-code": areaDataDistrictCode
                    }); 
                    $(".mateNewAddressRemarks").val(wxPatientCheckBean.newAddressRemarks);
                }
                }

            } else {
                $(".secondStep").attr("dataFlag", 0);
            }
    },function errFn(){
        console.log("err");
    });
    // 配偶信息查询-end
     
    // 孕产信息-start
    initPatientParturitionDetail();
    function initPatientParturitionDetail(){
        $(".pregnancyNumber").val(0).attr("name", 0);
        $(".ketosisInput").val("没有").attr("name", 0);
        $(".morningSicknessInput").val("无").attr("name", 3);
    }
    // 孕产信息-end


    // 孕妇信息 配偶信息 选择数据渲染-start
    for (var i = 0; i < selectData.papers.length; i++) {
        if (selectData.papers[i].id == wxPatientCheckBean.idCardType) {
            $(".papersInput").val(selectData.papers[i].value);
        }
        if (selectData.papers[i].id == husbandMateObj.idCardType) {
            $(".mateInput").val(selectData.papers[i].value);
        }
    }
    // 婚检状况
    for (var i = 0; i < selectData.marryCheck.length; i++) {
        if (selectData.marryCheck[i].id == wxPatientCheckBean.marryCheck) {
            $(".marryCheckInput").val(selectData.marryCheck[i].value);
        }
        if (selectData.marryCheck[i].id == husbandMateObj.marryCheck) {
            $(".mateMarryCheckInput").val(selectData.marryCheck[i].value);
        }
    }
    // 婚姻状况
    for (var i = 0; i < selectData.marryType.length; i++) {
        if (selectData.marryType[i].id == wxPatientCheckBean.marryType) {
            $(".marryTypeInput").val(selectData.marryType[i].value);
        }
        if (selectData.marryType[i].id == husbandMateObj.marryType) {
            $(".mateMarryTypeInput").val(selectData.marryType[i].value);
        }
    }
    // 职业
    for (var i = 0; i < selectData.occupation.length; i++) {
        if (selectData.occupation[i].id == wxPatientCheckBean.job) {
            $(".occupationInput").val(selectData.occupation[i].value);
        }
        if (selectData.occupation[i].id == husbandMateObj.job) {
            $(".mateOccupationInput").val(selectData.occupation[i].value);
        }
    }
    // 学历文凭
    for (var i = 0; i < selectData.diploma.length; i++) {
        if (selectData.diploma[i].id == wxPatientCheckBean.education) {
            $(".diplomaInput").val(selectData.diploma[i].value);
        }
        if (selectData.diploma[i].id == husbandMateObj.education) {
            $(".educationInput").val(selectData.diploma[i].value);
        }
    }
    // 民族
    for (var i = 0; i < selectData.nation.length; i++) {
        if (selectData.nation[i].value == wxPatientCheckBean.nation) {
            $(".nationInput").val(selectData.nation[i].value);
        }
    }
    // 健康状况
    for (var i = 0; i < selectData.healthType.length; i++) {
        if (selectData.healthType[i].id == husbandMateObj.healthType) {
            $(".healthTypeInput").val(selectData.healthType[i].value);
        }
    }
    //  drink-饮酒
    for (var i = 0; i < selectData.drink.length; i++) {
        if (selectData.drink[i].id == husbandMateObj.drink) {
            $(".drinkInput").val(selectData.drink[i].value);
            break;
        }
    }
    //  近半年避孕访视
    for (var i = 0; i < selectData.contraception.length; i++) {
        if (selectData.contraception[i].id == wxPatientCheckBean.contraception) {
            $(".contraceptionCheckInput").val(selectData.contraception[i].value).attr("name", selectData.contraception[i].id);
            break;
        }
    }
    // 孕妇信息 配偶信息 选择数据渲染-end


    // 建档第一步 - 孕妇信息-start
    // 证件选择-start
    $(".papersSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.papers], {
                container: '.selectContent', // 容器class
                title: '证件类型', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: wxPatientCheckBean.idCardType ? wxPatientCheckBean.idCardType : selectData.papers[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    wxPatientCheckBean.idCardType = selectOneObj.id;
                    $(".papersInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })

    // 近半年避孕方法
    $(".contraceptionCheckSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.contraception], {
                container: '.selectContent', // 容器class
                title: '避孕方法选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: wxPatientCheckBean.contraception ? wxPatientCheckBean.contraception : selectData.contraception[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    wxPatientCheckBean.contraception = selectOneObj.id;
                    $(".contraceptionCheckInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })

    // 职业选择-start
    $(".occupationSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.occupation], {
                container: '.selectContent', // 容器class
                title: '职业选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: wxPatientCheckBean.job ? wxPatientCheckBean.job : selectData.occupation[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    wxPatientCheckBean.job = selectOneObj.id;
                    $(".occupationInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 职业选择-end
    // 文凭-start
    $(".diplomaSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.diploma], {
                container: '.selectContent', // 容器class
                title: '文凭选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: wxPatientCheckBean.education ? wxPatientCheckBean.education : selectData.diploma[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    wxPatientCheckBean.education = selectOneObj.id;
                    $(".diplomaInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 文凭-end
    // 婚姻状态-start
    $(".marryTypeSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.marryType], {
                container: '.selectContent', // 容器class
                title: '婚姻状态选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: wxPatientCheckBean.marryType ? wxPatientCheckBean.marryType : selectData.marryType[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    wxPatientCheckBean.marryType =  selectOneObj.id;
                    $(".marryTypeInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 婚姻状态-end
    // 婚检选择-start
    $(".marryCheckSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.marryCheck], {
                container: '.selectContent', // 容器class
                title: '婚检选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: wxPatientCheckBean.marryCheck ? wxPatientCheckBean.marryCheck : selectData.marryCheck[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                     wxPatientCheckBean.marryCheck = selectOneObj.id;
                    $(".marryCheckInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 婚检选择-end
    // 民族-start
    // 民族
    var nationTempId = 0;
    for (var i = 0; i < selectData.nation.length; i++) {
        if (selectData.nation[i].value == wxPatientCheckBean.nation) {
            nationTempId = selectData.nation[i].id;
            break;
        }
    }
    $(".nationSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.nation], {
                container: '.selectContent', // 容器class
                title: '民族选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: nationTempId ? nationTempId : selectData.nation[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    nationTempId = selectOneObj.id;
                    $(".nationInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })

    $(".areaSelect").click(function() {
        var selectContactDom = $('.areaInput');
        var oneLevelId = selectContactDom.attr('data-province-code');
        var twoLevelId = selectContactDom.attr('data-city-code');
        var threeLevelId = selectContactDom.attr('data-district-code');
        console.log(oneLevelId + ":" + twoLevelId + ":" + threeLevelId);
        var example = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
            title: '地址选择省市县',
            headerHeight: 2, // 组件标题栏高度
            itemHeight: 2, // 每个元素的高度
            itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
            cssUnit: 'rem',
            relation: [1, 1],
            addClassName: 'selectStyle', // 选择器样式订制
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
                var tempStr = selectOneObj.value + selectTwoObj.value + selectThreeObj.value;
                areAddress(selectContactDom,tempStr);
                selectContactDom.val(selectOneObj.value + selectTwoObj.value + selectThreeObj.value).attr({
                    "province": selectOneObj.value,
                    "city": selectTwoObj.value,
                    "district": selectThreeObj.value,
                })
                selectContactDom.attr('data-province-code', selectOneObj.id);
                selectContactDom.attr('data-city-code', selectTwoObj.id);
                selectContactDom.attr('data-district-code', selectThreeObj.id);
            }
        });
    })
    // 户籍地区选择-end
    // 现住址选择-start
    $(".presentAreaSelect").click(function() {
        var selectContactDom = $('.presentAreaInput');
        var oneLevelId = selectContactDom.attr('data-province-code');
        var twoLevelId = selectContactDom.attr('data-city-code');
        var threeLevelId = selectContactDom.attr('data-district-code');
        var example = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
            title: '地址选择省市县',
            headerHeight: 2, // 组件标题栏高度
            itemHeight: 2, // 每个元素的高度
            itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
            cssUnit: 'rem',
            relation: [1, 1],
            addClassName: 'selectStyle', // 选择器样式订制
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
                var tempStr = selectOneObj.value + selectTwoObj.value + selectThreeObj.value;
                areAddress(selectContactDom,tempStr);
                selectContactDom.val(selectOneObj.value + selectTwoObj.value + selectThreeObj.value).attr({
                    "province": selectOneObj.value,
                    "city": selectTwoObj.value,
                    "district": selectThreeObj.value,
                })
                selectContactDom.attr('data-province-code', selectOneObj.id);
                selectContactDom.attr('data-city-code', selectTwoObj.id);
                selectContactDom.attr('data-district-code', selectThreeObj.id);
                // 处理配偶信息
                if (husbandMateObj.status != "20200") {
                    areAddress($(".mateAreaInput"),tempStr);
                    $(".mateAreaInput").val(tempStr).attr({
                        "province": selectOneObj.value,
                        "city": selectTwoObj.value,
                        "county": selectThreeObj.value,
                    })
                    $(".mateAreaInput").attr('data-province-code', selectOneObj.id);
                    $(".mateAreaInput").attr('data-city-code', selectTwoObj.id);
                    $(".mateAreaInput").attr('data-district-code', selectThreeObj.id);
                }
            }
        });
    })
    // 现住址选择-end

    // 输入验证-start
    // 姓名
    $(".pregnantName").focus(function() {
        $(".pregnantName").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".pregnantName").val()) {
            layer.msg("请输入姓名");
        } else if (!RegExpObj.Reg_Name.test($(".pregnantName").val())) {
            $(".pregnantName").parents(".inputItem").addClass("error");
        } else {
            $(".pregnantNameText").html($(".pregnantName").val());
        }
    })
    // 身份证号
    $(".idCard").focus(function() {
        $(".idCard").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".idCard").val()) {
            layer.msg("请输入身份证号");
        } else if (!RegExpObj.Reg_IDCardNo.test($(".idCard").val())) {
            $(".idCard").parents(".inputItem").addClass("error")
        } else {
            if ($(this).val().length == 18) {
                var patientBirthday = $(this).val().substring(6, 10) + '-' + $(this).val().substring(10, 12) + '-' + $(this).val().substring(12, 14);
                $(this).val().substring(16, 17) % 2 == 1 ? patientSex = '0' : patientSex = '1';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.age').val(userage);
            } else {
                var patientBirthday = 19 + $(this).val().substring(6, 8) + '-' + $(this).val().substring(8, 10) + '-' + $(this).val().substring(10, 12);
                $(this).val().substring(14, 15) % 2 == 1 ? patientSex = '0' : patientSex = '1';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.age').val(userage);
            }
            $('.birthdayDate').val(patientBirthday);
        }
    })
    // 手机号
    $(".telephone").focus(function() {
        $(".telephone").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".telephone").val()) {
            layer.msg("请输入手机号");
        } else if (!RegExpObj.Reg_TelNo.test($(".telephone").val())) {
            $(".telephone").parents(".inputItem").addClass("error")
        } else {
            $(".telephoneText").html($(".telephone").val());
        }
    })
    // 结婚年龄
    $(".marryAge").focus(function() {
        $(".marryAge").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".marryAge").val()) {
            layer.msg("请输入结婚年龄");
        } else if ($(".marryAge").val() <= 0 || $(".marryAge").val() > $(".age").val() || $(".marryAge").val() > 150) {
            $(".marryAge").parents(".inputItem").addClass("error")
        }
    })
    // 孕前体重
    $(".lastWeight").focus(function() {
        $(".lastWeight").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".lastWeight").val()) {
            layer.msg("请输入孕前体重");
        } else if ($(".lastWeight").val() <= 0 && $(".lastWeight").val() > 230) {
            $(".lastWeight").parents(".inputItem").addClass("error")
        }
    })
    
    // 现住详细地址
    $(".newAddressRemarks").focus(function() {
        $(".newAddressRemarks").parents(".inputItem").removeClass("error");
        // newAddressRemarks
    }).blur(function() {
        if (!$(".newAddressRemarks").val()) {
            layer.msg("请输入现住详细地址");
            return;
        }
        if (husbandMateObj.status != "20200") {
            $(".mateNewAddressRemarks").val($(".newAddressRemarks").val());
        }
    })
    // 输入验证-end
    $(".firstStep").click(function() {
        if (!$(".pregnantName").val()) {
            layer.msg("请输入姓名");
        } else if (!RegExpObj.Reg_Name.test($(".pregnantName").val())) {
            $(".pregnantName").parents(".inputItem").addClass("error")
        } else if (!$(".papersInput").attr("name")) {
            layer.msg("请选择证件类型");
        } else if (!$(".idCard").val()) {
            layer.msg("请输入身份证号");
        } else if (!RegExpObj.Reg_IDCardNo.test($(".idCard").val())) {
            $(".idCard").parents(".inputItem").addClass("error")
        } else if (!$(".telephone").val()) {
            layer.msg("请输入手机号");
        } else if (!RegExpObj.Reg_TelNo.test($(".telephone").val())) {
            $(".telephone").parents(".inputItem").addClass("error")
        } else if (!$(".marryCheckInput").attr("name")) {
            layer.msg("请选择婚检");
        } else if (!$(".marryTypeInput").attr("name")) {
            layer.msg("请选择婚姻状况");
        } else if (!$(".marryAge").val()) {
            layer.msg("请输入结婚年龄");
        } else if ($(".marryAge").val() <= 0 || $(".marryAge").val() > $(".age").val() || $(".marryAge").val() > 150) {
            $(".marryAge").parents(".inputItem").addClass("error")
        } else if (!$(".lastWeight").val()) {
            layer.msg("请输入孕前体重");
        } else if ($(".lastWeight").val() <= 0 || $(".lastWeight").val() > 230) {
            $(".lastWeight").parents(".inputItem").addClass("error")
        } else if (!$(".contraceptionCheckInput").attr("name")) {
            layer.msg("请输入避孕方法");
        }
        else if (!$(".occupationInput").attr("name")) {
            layer.msg("请选择职业");
        } else if (!$(".diplomaInput").attr("name")) {
            layer.msg("请选择文化程度");
        } else if (!$(".nationInput").attr("name")) {
            layer.msg("请选择民族");
        } else if (!$(".areaInput").attr("province")) {
            layer.msg("请选择户口所在地");
        } else if (!$(".presentAreaInput").attr("province")) {
            layer.msg("请选择现住址");
        } else if (!$(".newAddressRemarks").val()) {
            layer.msg("请输入现住详细地址");
        } else {
            HttpRequstForPost(httpUrl.updatePregnant,'json',true,{
                "token": myLocal.getItem("weChatToken"),
                    "idCardType": $(".papersInput").attr("name"), //身份类型 0 身份证 默认 1 护照
                    "idCard": $(".idCard").val(), //身份号码
                    "telephone": $(".telephone").val(), //联系电话
                    "birthdayDate": $(".birthdayDate").val(), //出生日期
                    "age": $(".age").val(), //年龄
                    "sex": 1, //性别 0 男 1女-默认
                    "education": $(".diplomaInput").attr("name"), //教育程度 0 硕士以上 1本科-默认 2大专 3中专及高中 4初中 5文盲
                    "marryAge": $(".marryAge").val(), //结婚年龄
                    "nation": $(".nationInput").val(), //民族
                    "lastWeight": $(".lastWeight").val(), //孕前体重
                    "jobCompanyName": $(".jobCompanyName").val(), //
                    "contraception": $(".contraceptionCheckInput").attr("name"), //避孕方式
                    "job": $(".occupationInput").attr("name"), //工作 0 无-默认 1.农、牧、渔 2.干部、职员 3.医院、科技 4.工人 5.个体 6.家务
                    "marryType": $(".marryTypeInput").attr("name"), //婚姻状况 0 初婚-默认 1 再婚 2其他
                    "marryCheck": $(".marryCheckInput").attr("name"), //婚检 0 无 1 有-默认
                    "idCardAddressProvince": $(".areaInput").attr("province"), //户口地址-省份
                    "idCardAddressCity": $(".areaInput").attr("city"), //户口地址-城市
                    "idCardAddressCounty": $(".areaInput").attr("district"), //户口地址-县
                    "newAddressProvince": $(".presentAreaInput").attr("province"), //现住址-省份
                    "newAddressCity": $(".presentAreaInput").attr("city"), //现住址-城市
                    "newAddressCounty": $(".presentAreaInput").attr("district"), //现住址-县
                    "newAddressRemarks": $(".newAddressRemarks").val(), //现住址-详情
                },function sucFn(data){
                    if (data.status == 20200) {
                        $(".firstStep").attr("dataFlag", 1);
                        switchNav(tabFocus);
                        tabFocus += 1;
                    } else {
                        layer.msg("孕妇信息添加失败");
                        $(".firstStep").attr("dataFlag", 0);
                    }
                },function errFn(){

                })
        }
    })
    // 建档第一步 - 孕妇信息-end

    // 建档第二步 - 配偶信息 -start
    // 证件类型-start
    $(".mateSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.papers], {
                container: '.selectContent', // 容器class
                title: '证件类型', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.idCardType ? husbandMateObj.idCardType : selectData.papers[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.idCardType = selectOneObj.id;
                    $(".mateInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 证件类型-end
    // 婚检选择-start
    $(".mateMarryCheckSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.marryCheck], {
                container: '.selectContent', // 容器class
                title: '婚检选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.marryCheck ? husbandMateObj.marryCheck : selectData.marryCheck[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.marryCheck = selectOneObj.id;
                    $(".mateMarryCheckInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 婚检选择-end
    // 婚姻状态-start
    $(".mateMarryTypeSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.marryType], {
                container: '.selectContent', // 容器class
                title: '婚姻状态选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.marryType ? husbandMateObj.marryType : selectData.marryType[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.marryType = selectOneObj.id;
                    $(".mateMarryTypeInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 婚姻状态-end
    // 职业选择-start
    $(".mateOccupationSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.occupation], {
                container: '.selectContent', // 容器class
                title: '职业选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.job ? husbandMateObj.job : selectData.occupation[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.job = selectOneObj.id;
                    $(".mateOccupationInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 职业选择-end
    // 抽烟-start
    $(".smokeSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.smoke], {
                container: '.selectContent', // 容器class
                title: '抽烟选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.smoke > 0 ? selectData.smoke[1].id : selectData.smoke[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.smoke = selectData.smoke[0].id;
                    $(".smokeInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                    if (selectOneObj.id == 1) {
                        $(".smokeBox").css("display", "flex")
                    } else {
                        $(".smokeBox").css("display", "none")
                    }
                },
            });
    })
    // 抽烟-end
    // 饮酒-start
    $(".drinkSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.drink], {
                container: '.selectContent', // 容器class
                title: '饮酒选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.drink ? husbandMateObj.drink : selectData.drink[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.drink = selectOneObj.id;
                    $(".drinkInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 饮酒-end
    // 现住址选择-start
    $(".mateAreaSelect").click(function() {
        var selectContactDom = $('.mateAreaInput');
        var oneLevelId = selectContactDom.attr('data-province-code');
        var twoLevelId = selectContactDom.attr('data-city-code');
        var threeLevelId = selectContactDom.attr('data-district-code');
        var example = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
            title: '地址选择省市县',
            headerHeight: 2, // 组件标题栏高度
            itemHeight: 2, // 每个元素的高度
            itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
            cssUnit: 'rem',
            relation: [1, 1],
            addClassName: 'selectStyle', // 选择器样式订制
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
                var tempStr = selectOneObj.value + selectTwoObj.value + selectThreeObj.value;
                areAddress($(".mateAreaInput"),tempStr);
                $(".mateAreaInput").val(tempStr).attr({
                    "province": selectOneObj.value,
                    "city": selectTwoObj.value,
                    "county": selectThreeObj.value,
                })
                selectContactDom.attr('data-province-code', selectOneObj.id);
                selectContactDom.attr('data-city-code', selectTwoObj.id);
                selectContactDom.attr('data-district-code', selectThreeObj.id);
            }
        });
    })
    // 现住址选择-end
    // 文凭-start
    $(".educationSelect").click(function() {
        //  husbandMateObj.drink ? husbandMateObj.drink : selectData.drink[0].id,
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.diploma], {
                container: '.selectContent', // 容器class
                title: '文凭选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.education ? husbandMateObj.education : selectData.diploma[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.education = selectOneObj.id;
                    $(".educationInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 文凭-end
    // 健康状况-start
    $(".healthTypeSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.healthType], {
                container: '.selectContent', // 容器class
                title: '健康状况选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: husbandMateObj.healthType ? husbandMateObj.healthType : selectData.healthType[0].id,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    husbandMateObj.healthType = selectOneObj.id;
                    $(".healthTypeInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                },
            });
    })
    // 健康状况-end

    // 配偶校验-start
    // 姓名
    $(".mateName").focus(function() {
        $(".mateName").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".mateName").val()) {
            layer.msg("请输入姓名");
        } else if (!RegExpObj.Reg_Name.test($(".mateName").val())) {
            $(".mateName").parents(".inputItem").addClass("error")
        }
    })
    // 身份证号
    $(".mateIdCard").focus(function() {
        $(".mateIdCard").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".mateIdCard").val()) {
            layer.msg("请输入身份证号");
        } else if (!RegExpObj.Reg_IDCardNo.test($(".mateIdCard").val())) {
            $(".mateIdCard").parents(".inputItem").addClass("error")
        } else {
            if ($(this).val().length == 18) {
                var patientBirthday = $(this).val().substring(6, 10) + '-' + $(this).val().substring(10, 12) + '-' + $(this).val().substring(12, 14);
                $(this).val().substring(16, 17) % 2 == 1 ? patientSex = '0' : patientSex = '1';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.mateAge').val(userage);
            } else {
                var patientBirthday = 19 + $(this).val().substring(6, 8) + '-' + $(this).val().substring(8, 10) + '-' + $(this).val().substring(10, 12);
                $(this).val().substring(14, 15) % 2 == 1 ? patientSex = '0' : patientSex = '1';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.mateAge').val(userage);
            }
            $('.mateBirthdayDate').val(patientBirthday);
        }
    })
    // 手机号
    $(".mateTelephone").focus(function() {
        $(".mateTelephone").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".mateTelephone").val()) {
            layer.msg("请输入手机号");
        } else if (!RegExpObj.Reg_TelNo.test($(".mateTelephone").val())) {
            $(".mateTelephone").parents(".inputItem").addClass("error")
        }
    })
    // 结婚年龄
    $(".mateMarryAge").focus(function() {
        $(".mateMarryAge").parents(".inputItem").removeClass("error");
    }).blur(function() {
        // age
        if (!$(".mateMarryAge").val()) {
            layer.msg("请输入结婚年龄");
        } else if ($(".mateMarryAge").val() <= 0 || $(".mateMarryAge").val() > $(".mateAge").val()|| $(".mateMarryAge").val() > 150) {
            $(".mateMarryAge").parents(".inputItem").addClass("error")
        }
    })
    // 家族史 start
    $(".patientHistorySelect").click(function() {
        $(".tempContainer").css('visibility','visible');
        $("#classBody").css('overflow','hidden');
        var tempStr =  $(".patientHistory").attr("allValue");
        templateOnClickInput = $(".patientHistory");
        anamnesisIllnessChange("0",tempStr,"");
    }).blur(function() {
        // if (!$(".patientHistory").val()) {
        //     layer.msg("请输入家族史");
        // }
    })
    // 家族史-搜索

    // 现住详细地址
    $(".mateNewAddressRemarks").focus(function() {
        $(".mateNewAddressRemarks").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".mateNewAddressRemarks").val()) {
            layer.msg("请输入现住详细地址");
        }
    })
    // 配偶校验-end
    $(".secondStep").click(function() {
        if (!$(".firstStep").attr("dataFlag")) {
            layer.msg("请完善孕妇信息")
        } else if (!$(".mateName").val()) {
            layer.msg("请输入姓名");
        } else if (!RegExpObj.Reg_Name.test($(".mateName").val())) {
            $(".mateName").parents(".inputItem").addClass("error")
        } else if (!$(".mateInput").attr("name")) {
            layer.msg("请选择证件类型");
        } else if (!$(".mateIdCard").val()) {
            layer.msg("请输入身份证号");
        } else if (!RegExpObj.Reg_IDCardNo.test($(".mateIdCard").val())) {
            $(".mateIdCard").parents(".inputItem").addClass("error")
        } else if (!$(".mateTelephone").val()) {
            layer.msg("请输入手机号");
        } else if (!RegExpObj.Reg_TelNo.test($(".mateTelephone").val())) {
            $(".mateTelephone").parents(".inputItem").addClass("error")
        } else if (!$(".mateMarryCheckInput").attr("name")) {
            layer.msg("请选择婚检");
        } else if (!$(".mateMarryTypeInput").attr("name")) {
            layer.msg("请选择婚姻状况");
        } else if (!$(".mateMarryAge").val()) {
            layer.msg("请输入结婚年龄");
        } else if ($(".mateMarryAge").val() <= 0 || $(".mateMarryAge").val() > 150 || $(".mateMarryAge").val() > $(".mateAge").val()) {
            $(".mateMarryAge").parents(".inputItem").addClass("error")
        } else if (!$(".mateOccupationInput").attr("name")) {
            layer.msg("请选择职业");
        } else if (!$(".educationInput").attr("name")) {
            layer.msg("请选择文化程度");
        } else if (!$(".healthTypeInput").attr("name")) {
            layer.msg("请选择健康状况");
        } else if (!$(".smokeInput").attr("name")) {
            layer.msg("请选择抽烟状况");
        } else if (!$(".drinkInput").attr("name")) {
            layer.msg("请选择饮酒状况");
        } else if (!$(".mateAreaInput").attr("province")) {
            layer.msg("请选择现住址");
        } else if (!$(".mateNewAddressRemarks").val()) {
            layer.msg("请输入现住详细地址");
        } else {
            var httpRequest = "";
            var allData = {
                        "token": myLocal.getItem("weChatToken"),
                        "name": $(".mateName").val(), // 配偶姓名
                        "idCardType": $(".mateInput").attr("name"), //身份类型 0 身份证 默认 1 护照
                        "idCard": $(".mateIdCard").val(), //身份号码
                        "telephone": $(".mateTelephone").val(), //联系电话
                        "birthdayDate": $(".mateBirthdayDate").val(), //出生日期
                        "age": $(".mateAge").val(), //年龄
                        "education": $(".educationInput").attr("name"), //教育程度 0 硕士以上 1本科-默认 2大专 3中专及高中 4初中 5文盲
                        "marryAge": $(".mateMarryAge").val(), //结婚年龄
                        "job": $(".mateOccupationInput").attr("name"), //工作 0 无-默认 1.农、牧、渔 2.干部、职员3.医院、科技 4.工人 5.个体 6.家务
                        "marryType": $(".mateMarryTypeInput").attr("name"), //婚姻状况 0 初婚-默认 1 再婚 2其他
                        "marryCheck": $(".mateMarryCheckInput").attr("name"), //婚检 0 无 1 有-默认
                        "healthType": $(".healthTypeInput").attr("name"), //健康状况
                        "smoke": $(".smokeNumInput").val() ? $(".smokeNumInput").val() : 0, //吸烟
                        "drink": $(".drinkInput").attr("name"), //饮酒
                        "patientHistory": $(".patientHistory").attr("allValue"), //家族史
                        "newAddressProvince": $(".mateAreaInput").attr("province"), //现住址-省份
                        "newAddressCity": $(".mateAreaInput").attr("city"), //现住址-城市
                        "newAddressCounty": $(".mateAreaInput").attr("county"), //现住址-县
                        "newAddressRemarks": $(".mateNewAddressRemarks").val(), //现住址-详情
                    };
            if ($(this).attr("dataFlag") == 1) {
                httpRequest = httpUrl.updateMate;
            } else {
                httpRequest = httpUrl.insertMate;
            }
            HttpRequstForPost(httpRequest,'json',false,allData,function sucFn(data){
                if (data.status == 20200) {
                    switchNav(tabFocus);
                    tabFocus += 1;
                } else {
                    layer.msg("配偶信息修改失败");
                }
            },function errFn(){

            });
        }
    })
    // 建档第二步 - 配偶信息 -end

    // 建档第三步-孕产信息-start
    // 初诊日期-start
    var patientParturitionDetail = {};
    $('.firstCheckDateBtn').click(function() {
        var selectDateDom = $('.firstCheckDateInput');
        var oneLevelId = selectDateDom.attr('data-year');
        var twoLevelId = selectDateDom.attr('data-month');
        var threeLevelId = selectDateDom.attr('data-date');
        if (oneLevelId == null || oneLevelId.length == 0) {
            var date = new Date();
            oneLevelId = date.getFullYear();
            twoLevelId = date.getMonth()+1;
            threeLevelId = date.getDate();
        }
        iosSelectData(oneLevelId,twoLevelId,threeLevelId, 
            function callBack(selectOneObj, selectTwoObj, selectThreeObj){
                selectDateDom.attr('data-year', selectOneObj.id);
                selectDateDom.attr('data-month', selectTwoObj.id);
                selectDateDom.attr('data-date', selectThreeObj.id);
                var tempDateStr = selectOneObj.value + '-' + selectTwoObj.value + '-' + selectThreeObj.value;
                var tempDate = new Date(Date.parse(tempDateStr));
                if (tempDate > new Date()) {
                    layer.msg('请选择过往日期');
                    return;
                }
                $(".firstCheckDateInput").val(selectOneObj.value + '-' + selectTwoObj.value + '-' + selectThreeObj.value);
        });
    })
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#dateBox',
            position: 'static',
            showBottom: false,
            max: 0,
            done: function(value, date) {
                $(".firstCheckDateInput").val(value);
                layer.closeAll();
                $('.dateContent').hide();
            }
        });
    });
    // 初诊日期-end
    // 末次月经-start
    $('.lastMenstruationBtn').click(function() {
        var selectDateDom = $('.lastMenstruationInput');
        var oneLevelId = selectDateDom.attr('data-year');
        var twoLevelId = selectDateDom.attr('data-month');
        var threeLevelId = selectDateDom.attr('data-date');
        if (oneLevelId == null || oneLevelId.length == 0) {
            var date = new Date();
            oneLevelId = date.getFullYear();
            twoLevelId = date.getMonth()+1;
            threeLevelId = date.getDate();
        }
        iosSelectData(oneLevelId,twoLevelId,threeLevelId, 
            function callBack(selectOneObj, selectTwoObj, selectThreeObj){
                selectDateDom.attr('data-year', selectOneObj.id);
                selectDateDom.attr('data-month', selectTwoObj.id);
                selectDateDom.attr('data-date', selectThreeObj.id);
                var tempDateStr = selectOneObj.value + '-' + selectTwoObj.value + '-' + selectThreeObj.value;
                var tempDate = new Date(Date.parse(tempDateStr));
                if (tempDate > new Date()) {
                    layer.msg('请选择过往日期');
                    return;
                }
                $(".lastMenstruationInput").val(tempDateStr);
                $(".lastMenstruationText").html(tempDateStr);
                expectedAndWeek(tempDateStr,
                    function expectedDateStr(expectedText){
                    // layer.msg(expectedText)
                    // 预产期
                    $(".expectedText").html(expectedText);
                },function newWeekAndDay(nowDateRangeWeek,nowDateRangeDay){
                    //layer.msg(123456)
                    // 现孕周和天
                    $(".pregnantDay").html((nowDateRangeWeek ? nowDateRangeWeek + '周+' : '') + nowDateRangeDay + '天').attr({
                    "weeks": nowDateRangeWeek,
                    "day": nowDateRangeDay
                    });
                });
        });
    })

    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#menstruationDate',
            position: 'static',
            showBottom: false,
            max: 0,
            done: function(value, date) {
                $('.lastMenstruationText').html(value);
                var oldDate = new Date(value).getTime();
                var newDate = new Date().getTime();
                var countDay = parseInt((newDate - oldDate) / 1000 / 3600 / 24);
                var weeks = parseInt(countDay / 7); // 孕周
                var day = countDay % 7; // 孕天
                var expectedDate = new Date(oldDate + 3600 * 24 * 1000 * 280);
                var expectedText = expectedDate.getFullYear() + '-' + doubleZero(expectedDate.getMonth() + 1) + '-' + doubleZero(expectedDate.getDate());
                $(".expectedText").html(expectedText);
                $(".pregnantDay").html((weeks ? weeks + '周+' : '') + day + '天').attr({
                    "weeks": weeks,
                    "day": day
                });
                $(".lastMenstruationInput").val(value);
                layer.closeAll();
                $('.menstruationBox').hide();
            }
        });
    });

    // 怀孕次数-start
    $(".pregnancyNumberSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.pregnancyNumber], {
                container: '.selectContent', // 容器class
                title: '怀孕次数', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: (patientParturitionDetail == null || patientParturitionDetail.pregnancyNumber == null) ? selectData.pregnancyNumber[0].id : patientParturitionDetail.pregnancyNumber,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    $(".pregnancyNumber").val(selectOneObj.value).attr("name", selectOneObj.id);
                    patientParturitionDetail.pregnancyNumber = selectOneObj.id;
                },
            });
    })
    // 怀孕次数-end
    // 
    // 尿酮体-start
    $(".ketosisSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.ketosis], {
                container: '.selectContent', // 容器class
                title: '尿酮体选择', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: (patientParturitionDetail == null || patientParturitionDetail.ketosis == null) ? selectData.ketosis[0].id : patientParturitionDetail.ketosis,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    $(".ketosisInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                    patientParturitionDetail.ketosis = selectOneObj.id;
                },
            });
    })
    // 尿酮体-end
    // 早孕反应程度-start
    $(".morningSicknessSelect").click(function() {
        var example = new IosSelect(1, // 第一个参数为级联层级，演示为1
            [selectData.morningSickness], {
                container: '.selectContent', // 容器class
                title: '早孕反应程度', // 标题
                headerHeight: 2, // 组件标题栏高度
                itemHeight: 2, // 每个元素的高度
                itemShowCount: 5, // 每一列显示元素个数，超出将隐藏
                cssUnit: 'rem',
                addClassName: 'selectStyle', // 选择器样式订制
                oneLevelId: (patientParturitionDetail == null || patientParturitionDetail.morningSickness == null) ? selectData.morningSickness[0].id : patientParturitionDetail.morningSickness,
                callback: function(selectOneObj) { // 用户确认选择后的回调函数
                    $(".morningSicknessInput").val(selectOneObj.value).attr("name", selectOneObj.id);
                    patientParturitionDetail.morningSickness = selectOneObj.id;
                },
            });
    })
    // 早孕反应程度-end
    $(".pregnancyNumber").focus(function() {
        $(".pregnancyNumber").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".pregnancyNumber").val()) {
            layer.msg("请输入怀孕次数");
        } else if ($(".pregnancyNumber").val() < 0 || $(".pregnancyNumber").val() > 20) {
            $(".pregnancyNumber").parents(".inputItem").addClass("error");
        }
    })
    $(".menstrualHistoryAge").focus(function() {
        $(".menstrualHistoryAge").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".menstrualHistoryAge").val()) {
            layer.msg("请输入初潮年龄");
        } else if ($(".menstrualHistoryAge").val() < 0 || $(".menstrualHistoryAge").val() > 50 || $(".menstrualHistoryAge").val() >$(".age").val() ) {
            $(".menstrualHistoryAge").parents(".inputItem").addClass("error");
        }
    })
    $(".menstrualHistoryDay").focus(function() {
        $(".menstrualHistoryDay").parents(".inputItem").removeClass("error");
    }).blur(function() {
        if (!$(".menstrualHistoryDay").val()) {
            layer.msg("请输入初潮周期");
        }
    })

    // 家族史 start
    $(".pregnancyFamilyHistorySelect").click(function() {
        $(".tempContainer").css('visibility','visible');
        $("#classBody").css('overflow','hidden');
        var tempStr =  $(".pregnancyFamilyHistory").attr("allValue");
        templateOnClickInput = $(".pregnancyFamilyHistory");
        anamnesisIllnessChange("1",tempStr,"");
    }).blur(function() {
    })

    // 家族史 start
    $(".nowHistorySelect").click(function() {
        $(".tempContainer").css('visibility','visible');
        $("#classBody").css('overflow','hidden');
        var tempStr =  $(".nowHistory").attr("allValue");
        templateOnClickInput = $(".nowHistory");
        anamnesisIllnessChange("1",tempStr,"");
    }).blur(function() {
    })

    $(".thirdStep").click(function() {
        if (!$(".firstStep").attr('dataFlag')) {
            layer.msg("请完善孕妇信息");
        } else if (!$(".secondStep").attr("dataFlag")) {
            layer.msg("请完善配偶信息");
        } else if (!$(".firstCheckDateInput").val()) {
            layer.msg("请选择初诊日期");
        } else if (!$(".lastMenstruationInput").val()) {
            layer.msg("请选择末次月经日期");
        } else if (!$(".menstrualHistoryAge").val()) {
            layer.msg("请输入初潮年龄");
        } else if ($(".menstrualHistoryAge").val() < 0 || $(".menstrualHistoryAge").val() > 50 || $(".menstrualHistoryAge").val() >$(".age").val()) {
            $(".menstrualHistoryAge").parents(".inputItem").addClass("error");
        } else if (!$(".menstrualHistoryDay").val()) {
            layer.msg("请输入初潮周期");
        } else if (!$(".pregnancyNumber").val()) {
            layer.msg("请输入怀孕次数");
        } else if ($(".pregnancyNumber").attr("name") < 0 || $(".pregnancyNumber").attr("name") > 5) {
            $(".pregnancyNumber").parents(".inputItem").addClass("error");
        } else if (!$(".ketosisInput").attr("name")) {
            layer.msg("请选择尿酮体");
        } else if (!$(".morningSicknessInput").attr("name")) {
            layer.msg("请选择早孕反应程度");
        // } else if (!$(".pregnancyFamilyHistory").val()) {
        //     layer.msg("请输入家族史");
        // } else if (!$(".nowHistory").val()) {
        //     layer.msg("请输入现病史");
         } else {
            HttpRequstForPost(httpUrl.insertPregnancy,'json',true,{
                    "token": myLocal.getItem("weChatToken"),
                    "firstCheckDate": $(".firstCheckDateInput").val(), // 初诊日期
                    "lastMenstruation": $(".lastMenstruationInput").val(), //末次月经
                    "dueDate": $(".expectedText").html(), //预产期
                    "newAgeOfMenarche": $(".pregnantDay").attr("weeks"), //现孕周
                    "newAgeOfMenarcheDay": $(".pregnantDay").attr("day"), //现孕周-天
                    "menstrualHistoryAge": $(".menstrualHistoryAge").val(), //初潮
                    "menstrualHistoryDay": $(".menstrualHistoryDay").val(), //周期
                    "pregnancyNumber": $(".pregnancyNumber").val(), //怀孕次数
                    "morningSickness": $(".morningSicknessInput").attr("name"), //早孕反应程度
                    "ketosis": $(".ketosisInput").attr("name"), //酮症
                    "familyHistory": $(".pregnancyFamilyHistory").attr("allValue"), //家族史
                    "nowHistory": $(".nowHistory").attr("allValue"), //现病史
                },function sucFn(data){
                    if (data.status == 20200) {
                        layer.open({
                            title: '',
                            type: 1,
                            content: $('.successContent'),
                            closeBtn: false,
                            shadeClose: false,
                        });
                    } else {
                        layer.msg("添加失败");
                    }
                },function errFn(){

                });
        }
    })
    $(".successContent").find(".successBtn").click(function() {
        window.location = "/maternal-weChat/user/user.html";
    })
    // 建档第三部 孕产信息-end
    function doubleZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // 处理户口地址数据过长
    function areAddress(teatTextView,teatTextStr){
        if(teatTextStr.length>0 && teatTextStr.length < 11){
            teatTextView.removeClass("textareaTwo");
            teatTextView.addClass("textareaOne");
        }else if (teatTextStr.length>10) {
            teatTextView.removeClass("textareaOne");
            teatTextView.addClass("textareaTwo");
        }
    }

    // 疾病选择弹框取消按钮
    $(".noBtn").click(function() {
        $(".tempContainer").css('visibility','hidden');
        $("#classBody").css('overflow','visible');
    })
    // 疾病选择弹框确认按钮
    $(".yesBtn").click(function() {
        if (templateOnClickInput == null) {
            return;
        }
        $(".tempContainer").css('visibility','hidden');
        $("#classBody").css('overflow','visible');
        var tempStr = "";
        for(var tempKey in newRecotTemplateDataMap){
           tempStr += newRecotTemplateDataMap[tempKey]+"、";
        }
        templateOnClickInput.attr({
            "allValue":tempStr,
        });
        var patientHistoryVal;
        if (tempStr.length > 9) {
            patientHistoryVal = tempStr.substring(0,9)+"..";
        }else{
            patientHistoryVal = tempStr;
        }
        templateOnClickInput.val(patientHistoryVal);
    })
    // 疾病选择搜索按钮
    $(".tempSelect").click(function() {
        var selectInput = $(".tempTitleInput").val();
        var tempStr = "";
        for(var tempKey in newRecotTemplateDataMap){
           tempStr += newRecotTemplateDataMap[tempKey]+"、";
        }
        anamnesisIllnessChange("0",tempStr,selectInput);
    })
    // 疾病选择弹窗 
    // dataType 0为配偶信息列表 
    // dataValue 默认字符串按照、进行分割
    // findValue 查询数据
    function anamnesisIllnessChange(dataType,dataValue,findValue){
        // 将搜索栏置空
        var selectDiv = $(".tempTitleInput");
        selectDiv.val("");
        templateOnClickStr = dataValue;
        newRecotTemplateDataMap = {};
        // 将参数进行分割
        var tempDataMap = {};
        var tempDataArr = [];
        // 将span制空
        var tempChangeDetDiv = $(".tempChangeDetDiv");
        tempChangeDetDiv.empty();
        // 切割dataValue
        if (dataValue != null && dataValue.length > 0) {
            tempDataArr = dataValue.split("、");
            // 循环tempDataArr 将其放到tempDataMap中
            for (var i = tempDataArr.length - 1; i >= 0; i--) {
                tempDataMap[tempDataArr[i]] = tempDataArr[i];
            }
        }
        if (templateListArr.length > 0) {
            initTemplateDiv(templateListArr,tempDataMap,dataType,findValue);
            return;
        }

        getAnamnesisIllness('',
            function anamnesisIllness(sucData){
                templateListArr = sucData;
                initTemplateDiv(templateListArr,tempDataMap,dataType,findValue);
            })
    }

    // 渲染TemplateDic
    // sucData 数据源
    // tempDataMap str分割后的map
    // dataType 数据类型
    // resultMap 记录数据源
    // findValue 查询数据
    function initTemplateDiv(sucData,tempDataMap,dataType,findValue){
        newRecotTemplateDataType = dataType;
        // 记录选中显示的span
        var tempChangeDetDivHtml = "";
        // 取出下方内容控件
        var tempBoxDiv = $(".tempBox");
        var tempBoxHtml = "";
        var isTempBoxHtml = true;
        for (var i = 0; i < templateKeysArr.length; i++) {
            isTempBoxHtml = false;
            var keyName = templateKeysArr[i];
            var keyArr = sucData[keyName];
            var tempChangeDetailHtml = "";
            if (keyArr == null || keyArr.length == 0) {
                continue;
            }
            for (var j = 0; j< keyArr.length; j++) {
                var tempChangeDetDivValue = keyArr[j]["name"];
                var tempChangeDetDivId = "tempChangeDetDiv"+i+j;
                // 如果内容已被选中，拼接到span中 注意先后顺序
                if(tempDataMap.hasOwnProperty(tempChangeDetDivValue)){
                    newRecotTemplateDataMap[tempChangeDetDivId] = tempChangeDetDivValue;
                    tempChangeDetDivHtml += "<span class='tempChangeDetSpan' onClick = tempSpanClick('"+tempChangeDetDivId+"',this,'"+dataType+"')>"+tempChangeDetDivValue+'</span> ';
                }
                var tempChangeDetDivSpellName = keyArr[j]["spellName"];
                // 处理查询结果 依据findValue
                if (findValue.length > 0 && !tempChangeDetDivSpellName.match(RegExp(findValue))) {
                    continue;
                }
                isTempBoxHtml = true;
                if (j != 0) {
                    tempChangeDetailHtml += "<hr>";
                }else{
                    tempChangeDetailHtml += "<hr class='tempFirstHr' style='visibility:hidden'>";
                }
                tempChangeDetailHtml += '<p id = "'+tempChangeDetDivId+'" onClick = tempPClick(this,"'+dataType+'")>'+tempChangeDetDivValue+'</p>';
                if (j == keyArr.length - 1) {
                    tempChangeDetailHtml += "<hr class='tempLastHr' style='visibility:hidden'>";
                }
            }
            if (!isTempBoxHtml) {
                continue;
            }
            tempBoxHtml += "<h3 style>"+keyName+"</h3>";
            tempBoxHtml += tempChangeDetailHtml;
        }
        tempBoxDiv.html(tempBoxHtml);
        var tempChangeDetDiv = $(".tempChangeDetDiv");
        tempChangeDetDiv.html(tempChangeDetDivHtml);
    }
})

function tempPClick(dataThis,dataType){
    var changeId = $(dataThis).attr("id");
    if (newRecotTemplateDataMap.hasOwnProperty(changeId)) {
        layer.msg("请勿重复选择!");
        return;
    }
    newRecotTemplateDataMap[changeId] =  dataThis.innerHTML;
    var tempChangeDetDiv = $(".tempChangeDetDiv");
    var tempChangeDetDivHtml = "<span class='tempChangeDetSpan' onClick = tempSpanClick('"+changeId+"',this,'"+dataType+"')>"+dataThis.innerHTML+'</span> ';
    tempChangeDetDiv.append(tempChangeDetDivHtml);
}

function tempSpanClick(changeId,data,dataType){
    delete newRecotTemplateDataMap[changeId];
    data.remove();
}
