// var IP = 'http://192.168.0.6:8763/';
// var imgIp = 'http://192.168.0.6:8763';

var IP = 'http://www.wcqxzs.com/pregnant/';
var imgIp = 'http://www.wcqxzs.com/pregnant';

// var requestErr = "请求失败!,请联系工作人员。";

var RegExpObj = {
    Reg_IDCardNo: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/, // 身份证
    Reg_TelNo: /^1[3|4|5|7|8]\d{9}$/, // 手机号
    Reg_PassWord: /^(\w){6,16}$/, // 登录密码
    Reg_Number: /^\d{6}$/, // 验证数字
    Reg_Name: /^[\u4e00-\u9fa5]{2,6}$/, //验证名字
    Reg_Text: /[0-9a-zA-Z\u4e00-\u9fa5`~!@#$^&*\\()=|{}':;',\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]/,
    Reg_email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, //邮箱
    Reg_Chinese: /^[\u4e00-\u9fa5]$/, //验证中文
};

var httpUrl = {

    "login": IP + "v1/web/wx/login", //A1 使用缓存-登录接口
    "siginInAddTelephone": IP + "v1/web/wx/siginInAddTelephone", //登录接口
    "findNewsEntity": IP + "v1/web/wx/ImportantDetail/findNewsEntity", //A1 获取知情同意书
    "addImportantDetailForFiling": IP + "v1/web/wx/patientCenter/addImportantDetailForFiling", // A2 绑定就诊卡

    "updatePregnant": IP + "v1/web/wx/patientCheck/updateSelfForFiling", //A3 基本信息-修改（登录人）
    "insertMate": IP + "v1/web/wx/patientHusbands/insertSelfForFiling", //A4 配偶信息-添加（登录人）
    "updateMate": IP + "v1/web/wx/patientHusbands/updateSelfForFiling", //A4 配偶信息-更新（登录人）
    "findMate": IP + "v1/web/wx/patientHusbands/findSelfForFiling", //A4 配偶信息-获取配偶信息
    "insertPregnancy": IP + "v1/web/wx/patientParturitionDetail/insertSelfForFiling", //A5 孕检信息-添加
    "findPregnancy": IP + "v1/web/wx/patientParturitionDetail/findSelfForFiling", //A5 孕检信息-获取信息

    "findSelfDetail": IP + "v1/web/wx/patientCenter/findSelfDetail", //B0 获取登录人详情
    "findSelf": IP + "v1/web/wx/patientHealthCheck/findSelf", //B1 体格检查-获取信息（登录人）
    "updateSelf": IP + "v1/web/wx/patientSecondCheck/updateSelf", //B2 复检记录-修改-只修改文件
    "secondFindList": IP + "v1/web/wx/patientSecondCheck/findSelfList", //B2 查询复检记录
    "highRiskFindList": IP + "v1/web/wx/patientHighRiskGrade/findSelfList", //B3 获取高危评估列表-登录人
    "findList": IP + "v1/web/wx/patientCheckForWeek/findList", //B4 预约复检-查询
    "updateRemindTime": IP + "v1/web/wx/patientCheckForWeek/updateRemindTime", //B4 预约检查-修改提醒时间
    "findListByCenterId": IP + "v1/web/wx/patientBMI/findListByCenterId", //B5 查询BMI
    "findListForSpellName": IP + "v1/web/wx/anamnesisIllness/findListForSpellName",   // 疾病模板接口
    "patientWechatAuthorization": IP + "v1/web/wx/patientWechatAuthorization/insertEntity",   // 添加授权用户
    
    "sms":IP + "/v1/web/SMS/getTelephoneNum",   // 请求验证码
    "weChatRequest": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx909973577e0f2725&redirect_uri=http://www.wcqxzs.com/maternal-weChat/newRecord/newRecord.html&response_type=code&scope=snsapi_base&state=20200#wechat_redirect",   // 授权
    "weChatRequestToUser": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx909973577e0f2725&redirect_uri=http://www.wcqxzs.com/maternal-weChat/user/user.html&response_type=code&scope=snsapi_base&state=20200#wechat_redirect",   // 授权

    // "login": IP + "login", //
};
// 登录状态
// $(function () {
//     if(!$.cookie('token')){
//         if (window.location.pathname != '/union/login/login.html'){
//             window.location = '/union/login/login.html';
//         }
//     }
// })

// 20200 操作成功
// 20207 操作失败
// 20214 服务器出错
// 20208 参数存在问题
// 20209 信息不存在
// 20210 信息已存在
// 20211 警告
// 20212 不允许被改变
// 20213 服务器出错
// 20250 未登录
// 20251 无权限
// 20252 密码错误
function HttpRequstForPost(postHttpUrl, dataType, asyncType,dataFrom, sucFn, errFn) {
    var tempLayer = layer.load();
    if (asyncType == null||asyncType.length == 0) {
        asyncType = true;
    }
    var noLogin = false;
    // 如果是登录接口，无token
    if (postHttpUrl != httpUrl.login && postHttpUrl != httpUrl.addImportantDetailForFiling && postHttpUrl != httpUrl.sms && postHttpUrl != httpUrl.siginInAddTelephone) {
        noLogin = true;
        var tempToken = dataFrom["token"];
        if (tempToken == null || tempToken.length == 0) {
            layer.msg("未登录");
            window.location = "/maternal-weChat/bindCard/bindCard.html";
            return;
        }
    }
    if (postHttpUrl != httpUrl.sms) {
        var paramsDetail = JSON.stringify(dataFrom);
        var key = createAESKey();
        paramsDetail = encrypt(paramsDetail,key);
        var newData = {
                "params":paramsDetail,
                "AESKey":key
            };
        // 编码
        var newDataEncode = escape(JSON.stringify(newData));
        newDataEncode = newDataEncode.replace('%2', '%2B');
        dataFrom = {
                "params":newDataEncode
            };
    }
    
    $.ajax({
        type: 'POST',
        url: postHttpUrl,
        xhrFields: {
            withCredentials: false
        },
        dataType: dataType,
        data: dataFrom,
        async: asyncType,
        crossDomain: true,  // 允许跨域访问
        success: function (sucData) {
            if (sucData.status == "20250") {
                myLocal.clearItem();
                window.location = "/maternal-weChat/bindCard/bindCard.html";
                layer.close(tempLayer);
                return;
            }
            //console.log(sucData);
            layer.close(tempLayer);
            sucFn(sucData);
        },
        error: function (err) {
            layer.close(tempLayer);
            layer.msg("请求失败！");
            errFn(err);
        },
    });
}

function HttpRequstFromDataForPost(postHttpUrl, dataType, asyncType, dataFrom, sucFn, errFn) {
    var tempLayer = layer.load();
    if (asyncType == null||asyncType.length == 0) {
        asyncType = true;
    }
    var noLogin = false;
    // 如果是登录接口，无token
    if (postHttpUrl != httpUrl.login && postHttpUrl != httpUrl.addImportantDetailForFiling  && postHttpUrl != httpUrl.sms && postHttpUrl != httpUrl.siginInAddTelephone) {
        noLogin = true;
        var tempToken = dataFrom.get("token");
        if (tempToken == null || tempToken.length == 0) {
            layer.msg("未登录");
            window.location = "/maternal-weChat/bindCard/bindCard.html";
            return;
        }
    }
     $.ajax({
        type: 'POST',
        url: postHttpUrl,
        xhrFields: {
            withCredentials: false
        },
        dataType: dataType,
        data: dataFrom,
        async: asyncType,
        crossDomain: true,  // 允许跨域访问
        global: false,
        processData: false, // 不处理发送的数据
        contentType: false,
        success: function (sucData) {
            if (sucData.status == "20250") {
                window.location = "/maternal-weChat/bindCard/bindCard.html";
                layer.close(tempLayer);
                return;
            }
            //console.log(sucData);
            layer.close(tempLayer);
            sucFn(sucData);
        },
        error: function (err) {
            layer.close(tempLayer);
            layer.msg("请求失败！");
            errFn(err);
        },
    });
}

function HttpRequstForGet(postHttpUrl, dataType, asyncType,dataFrom, sucFn, errFn) {
    var tempLayer = layer.load();
    if (asyncType == null||asyncType.length == 0) {
        asyncType = true;
    }
    $.ajax({
        type: 'GET',
        url: postHttpUrl,
        xhrFields: {
            withCredentials: false
        },
        dataType: dataType,
        data: dataFrom,
        async: asyncType,
        success: function (sucData) {
            if (sucData.status == "20250") {
                window.location = "/maternal-weChat/bindCard/bindCard.html";
                layer.close(tempLayer);
                return;
            }
            layer.close(tempLayer);
            sucFn(sucData);
        },
        error: function (err) {
            layer.close(tempLayer);
            layer.msg("请求失败！");
            errFn(err);
        },
    });
}

// 控制台输出语句
function debugConsole(data){
    return;
    console.log(data);
}

window.onload = function() {
    // 版权定位
    if ($('.footer').length > 0) {
        if ($('.footer').offset().top + $('.footer').outerHeight(true) > $(window).height()) {
            $('.footer').css('position', 'static');
        } else {
            $('.footer').css('position', 'fixed');
        }
    }
}

// 选择数据
// papers-证件数据  contraception-避孕方法  occupation-职业   diploma-学历文凭    marryCheck-婚检状况     marryType-婚姻状况      nation-民族       drink-饮酒        smoke-抽烟        healthType-健康状况     ketosis-酮症      早孕反应-morningSickness    edema-四肢水肿  malformation-四肢畸形   nipple-乳头    breasts-乳房 // cohesion-衔接  // presentation-先露  // position-胎位  cardiac-胎心      产检提醒 - remindDay-天      产检提醒 - remindHours-时        产检提醒 - remindMinute-分
var selectData = {
    // assayBloodType - 血型    化验检查-血型 0.O型-默认 1.A型 2.B型 3.AB型 4.RH型
    assayBloodType: [{
        "id": 0,
        "value": "O型"
    },{
        "id": 1,
        "value": "A型"
    },{
        "id": 2,
        "value": "B型"
    },{
        "id": 3,
        "value": "AB型"
    },{
        "id": 4,
        "value": "RH型"
    }],
    // 产检提醒 - remindHours-时
    remindHours: [{
        "id": 0,
        "value": "0时"
    }, {
        "id": 1,
        "value": "1时"
    }, {
        "id": 2,
        "value": "2时"
    }, {
        "id": 3,
        "value": "3时"
    }, {
        "id": 4,
        "value": "4时"
    }, {
        "id": 5,
        "value": "5时"
    }, {
        "id": 6,
        "value": "6时"
    }, {
        "id": 7,
        "value": "7时"
    }, {
        "id": 8,
        "value": "8时"
    }, {
        "id": 9,
        "value": "9时"
    }, {
        "id": 10,
        "value": "10时"
    }, {
        "id": 11,
        "value": "11时"
    }, {
        "id": 12,
        "value": "12时"
    }, {
        "id": 13,
        "value": "13时"
    }, {
        "id": 14,
        "value": "14时"
    }, {
        "id": 15,
        "value": "15时"
    }, {
        "id": 16,
        "value": "16时"
    }, {
        "id": 17,
        "value": "17时"
    }, {
        "id": 18,
        "value": "18时"
    }, {
        "id": 19,
        "value": "19时"
    }, {
        "id": 20,
        "value": "20时"
    }, {
        "id": 21,
        "value": "21时"
    }, {
        "id": 22,
        "value": "22时"
    }, {
        "id": 23,
        "value": "23时"
    }],
    // 产检提醒 - remindMinute-分
    remindMinute: [{
        "id": 0,
        "value": "00分"
    }, {
        "id": 1,
        "value": "15分"
    }, {
        "id": 2,
        "value": "30分"
    }, {
        "id": 3,
        "value": "45分"
    }],
    // 产检提醒 - remindDay-天
    remindDay: [{
        "id": 0,
        "value": "当天"
    }, {
        "id": 1,
        "value": "提前一天"
    }, {
        "id": 2,
        "value": "提前二天"
    }],
    // urineProtein-尿蛋白
    urineProtein: [{
        "id": 0,
        "value": "正常"
    }, {
        "id": 1,
        "value": "+1"
    }, {
        "id": 2,
        "value": "+2"
    }, {
        "id": 3,
        "value": "+3"
    }],
    // cardiac-胎心
    cardiac: [{
        "id": 0,
        "value": "未填写"
    }, {
        "id": 1,
        "value": "正常"
    }, {
        "id": 2,
        "value": "异常"
    }],
    // position-胎位
    position: [{
        "id": 0,
        "value": "未填写"
    }, {
        "id": 1,
        "value": "枕左前位"
    }, {
        "id": 2,
        "value": "枕右横位"
    }, {
        "id": 3,
        "value": "枕右前位"
    }],
    // presentation-先露
    presentation: [{
        "id": 0,
        "value": "未填写"
    }, {
        "id": 1,
        "value": "头先露"
    }, {
        "id": 2,
        "value": "臀先露"
    }],
    // cohesion-衔接
    cohesion: [{
        "id": 0,
        "value": "未衔接"
    }, {
        "id": 1,
        "value": "已衔接"
    }, {
        "id": 2,
        "value": "未填写"
    }],
    // breasts-乳房
    breasts: [{
        "id": 0,
        "value": "丰满"
    }, {
        "id": 1,
        "value": "扁平"
    }],
    // nipple-乳头
    nipple: [{
        "id": 0,
        "value": "凸"
    }, {
        "id": 1,
        "value": "凹"
    }],
    // malformation-四肢畸形
    malformation: [{
        "id": 0,
        "value": "正常"
    }, {
        "id": 1,
        "value": "畸形"
    }],
    // edema-四肢水肿
    edema: [{
        "id": 0,
        "value": "无"
    }, {
        "id": 1,
        "value": "轻"
    }, {
        "id": 2,
        "value": "中"
    }, {
        "id": 3,
        "value": "重"
    }],
    // 证件数据
    papers: [{
        "id": 0,
        "value": "居民身份证"
    }],
    // 避孕方法
    contraception: [{
        "id": 0,
        "value": "无"
    }, {
        "id": 1,
        "value": "避孕套"
    }, {
        "id": 2,
        "value": "避孕药"
    }, {
        "id": 3,
        "value": "避孕环"
    }],
    // 职业
    occupation: [{
        "id": 0,
        "value": "无"
    }, {
        "id": 1,
        "value": "农、牧、渔"
    }, {
        "id": 2,
        "value": "干部、职员"
    }, {
        "id": 3,
        "value": "医院、科技"
    }, {
        "id": 4,
        "value": "工人"
    }, {
        "id": 5,
        "value": "个体"
    }, {
        "id": 6,
        "value": "家务"
    }],
    // 学历文凭
    diploma: [{
        "id": 1,
        "value": "本科"
    }, {
        "id": 0,
        "value": "硕士以上"
    }, {
        "id": 2,
        "value": "大专"
    }, {
        "id": 3,
        "value": "中专及高中"
    }, {
        "id": 4,
        "value": "初中"
    }, {
        "id": 5,
        "value": "文盲"
    }],
    // 半年避孕
    contraception: [{
        "id": 0,
        "value": "未避孕"
    }, {
        "id": 1,
        "value": "口服避孕药"
    }, {
        "id": 2,
        "value": "避孕套"
    }, {
        "id": 3,
        "value": "避孕膜"
    }, {
        "id": 4,
        "value": "其他"
    }],
    // 婚检状况
    marryCheck: [{
        "id": 1,
        "value": "有"
    }, {
        "id": 0,
        "value": "无"
    }],
    // 婚姻状况
    marryType: [{
        'id': 0,
        "value": '初婚'
    }, {
        'id': 1,
        "value": '再婚'
    }, {
        'id': 2,
        "value": '其他'
    }],
    // 民族
    nation: [{
            "id": "01",
            "value": "汉族"
        }, {
            "id": "02",
            "value": "蒙古族"
        }, {
            "id": "03",
            "value": "回族"
        },
        {
            "id": "04",
            "value": "藏族"
        }, {
            "id": "05",
            "value": "维吾尔族"
        }, {
            "id": "06",
            "value": "苗族"
        },
        {
            "id": "07",
            "value": "彝族"
        }, {
            "id": "08",
            "value": "壮族"
        }, {
            "id": "09",
            "value": "布依族"
        },
        {
            "id": "10",
            "value": "朝鲜族"
        }, {
            "id": "11",
            "value": "满族"
        }, {
            "id": "12",
            "value": "侗族"
        },
        {
            "id": "13",
            "value": "瑶族"
        }, {
            "id": "14",
            "value": "白族"
        }, {
            "id": "15",
            "value": "土家族"
        },
        {
            "id": "16",
            "value": "哈尼族"
        }, {
            "id": "17",
            "value": "哈萨克族"
        }, {
            "id": "18",
            "value": "傣族"
        },
        {
            "id": "19",
            "value": "黎族"
        }, {
            "id": "20",
            "value": "傈僳族"
        }, {
            "id": "21",
            "value": "佤族"
        },
        {
            "id": "22",
            "value": "畲族"
        }, {
            "id": "23",
            "value": "高山族"
        }, {
            "id": "24",
            "value": "拉祜族"
        },
        {
            "id": "25",
            "value": "水族"
        }, {
            "id": "26",
            "value": "东乡族"
        }, {
            "id": "27",
            "value": "纳西族"
        },
        {
            "id": "28",
            "value": "景颇族"
        }, {
            "id": "29",
            "value": "柯尔克孜族"
        }, {
            "id": "30",
            "value": "土族"
        },
        {
            "id": "31",
            "value": "达斡尔族"
        }, {
            "id": "32",
            "value": "仫佬族"
        }, {
            "id": "33",
            "value": "羌族"
        },
        {
            "id": "34",
            "value": "布朗族"
        }, {
            "id": "35",
            "value": "撒拉族"
        }, {
            "id": "36",
            "value": "毛难族"
        },
        {
            "id": "37",
            "value": "仡佬族"
        }, {
            "id": "38",
            "value": "锡伯族"
        }, {
            "id": "39",
            "value": "阿昌族"
        },
        {
            "id": "40",
            "value": "普米族"
        }, {
            "id": "41",
            "value": "塔吉克族"
        }, {
            "id": "42",
            "value": "怒族"
        },
        {
            "id": "43",
            "value": "乌孜别克族"
        }, {
            "id": "44",
            "value": "俄罗斯族"
        }, {
            "id": "45",
            "value": "鄂温克族"
        },
        {
            "id": "46",
            "value": "崩龙族"
        }, {
            "id": "47",
            "value": "保安族"
        }, {
            "id": "48",
            "value": "裕固族"
        },
        {
            "id": "49",
            "value": "京族"
        }, {
            "id": "50",
            "value": "塔塔尔族"
        }, {
            "id": "51",
            "value": "独龙族"
        },
        {
            "id": "52",
            "value": "鄂伦春族"
        }, {
            "id": "53",
            "value": "赫哲族"
        }, {
            "id": "54",
            "value": "门巴族"
        },
        {
            "id": "55",
            "value": "珞巴族"
        }, {
            "id": "56",
            "value": "基诺族"
        }
    ],
    // 饮酒
    drink: [{
        "id": 0,
        "value": "否"
    }, {
        "id": 1,
        "value": "偶尔"
    }, {
        "id": 2,
        "value": "经常"
    }, ],
    // 抽烟
    smoke: [{
        "id": 0,
        "value": "否"
    }, {
        "id": 1,
        "value": "是"
    }],
    // 健康状况
    healthType: [{
        "id": 0,
        "value": "健康"
    }, {
        "id": 1,
        "value": "一般"
    }, {
        "id": 2,
        "value": "较弱"
    }],
    // 酮症
    ketosis: [{
        "id": 0,
        "value": "没有"
    }, {
        "id": 1,
        "value": "有"
    }],
    // 早孕反应
    morningSickness: [
    {
        "id": 3,
        "value": "无"
    },{
        "id": 0,
        "value": "轻"
    }, {
        "id": 1,
        "value": "中"
    }, {
        "id": 2,
        "value": "重"
    }],
    // 早孕反应
    baseType: [{
        "id": 0,
        "value": "正常"
    }, {
        "id": 1,
        "value": "异常"
    }],
    // 怀孕次数
    pregnancyNumber: [{
        "id": 0,
        "value": "0"
    }, {
        "id": 1,
        "value": "1"
    }, {
        "id": 2,
        "value": "2"
    }, {
        "id": 3,
        "value": "3"
    }, {
        "id": 4,
        "value": "4"
    }, {
        "id": 5,
        "value": "5"
    }]
}


var selectDataMap = {
    // 早孕反应
    morningSickness: 
    {
        "0": "轻",
        "1": "中",
        "2": "重",
        "3": "无"
    },
     diploma: {
        "1": "本科",
        "0": "硕士以上",
        "2": "大专",
        "3": "中专及高中",
        "4": "初中",
        "5": "文盲",
    }
}
