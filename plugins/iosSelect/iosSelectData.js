
function iosSelectData(oneLevelId,twoLevelId,threeLevelId,callBack){
    // 初始化时间
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    var nowDate = now.getDate();
    // if (twoLevelId < 10) {
    //     twoLevelId = "0"+twoLevelId;
    //     twoLevelId = twoLevelId*1;
    // }
    // if (threeLevelId < 10) {
    //     threeLevelId = "0"+threeLevelId;
    //     twoLevelId = twoLevelId*1;
    // }
    // 数据初始化
    function formatYear (nowYear) {
        var arr = [];
        for (var i = nowYear - 5; i <= nowYear; i++) {
            arr.push({
                id: i + '',
                value: i
            });
        }
        return arr;
    }
    function formatMonth () {
        var arr = [];
        var tempMonth;
        for (var i = 1; i <= 12; i++) {
            if(i < 10){
                tempMonth = '0'+i;
            }else{
                tempMonth = i;
            }
            arr.push({
                id: i,
                value: tempMonth
            });
        }
        return arr;
    }
    function formatDate (count) {
        var arr = [];
        var val = "";
        for (var i = 1; i <= count; i++) {
            val = "" + i;
            if (i<10) {
                val = "0"+i;
            }
            arr.push({
                id: i,
                value: val
            });
        }
        return arr;
    }
    var yearData = function(callback) {
        // settimeout只是模拟异步请求，真实情况可以去掉
        // setTimeout(function() {
            callback(formatYear(nowYear))
        // }, 2000)
    }
    var monthData = function (year, callback) {
        // settimeout只是模拟异步请求，真实情况可以去掉
        // setTimeout(function() {
            callback(formatMonth());
        // }, 2000);
    };
    var dateData = function (year, month, callback) {
        // settimeout只是模拟异步请求，真实情况可以去掉
        // setTimeout(function() {
            if (/^(1|3|5|7|8|10|12)$/.test(month)) {
                callback(formatDate(31));
            }
            else if (/^(4|6|9|11)$/.test(month)) {
                callback(formatDate(30));
            }
            else if (/^2$/.test(month)) {
                if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                    callback(formatDate(29));
                }
                else {
                    callback(formatDate(28));
                }
            }
            else {
                throw new Error('month is illegal');
            }
    };
    console.log(oneLevelId + "-" + twoLevelId + "-" + threeLevelId);
    var iosSelect = new IosSelect(3, 
            [yearData, monthData, dateData],
            {
                title: '时间选择',
                itemHeight: 35,
                oneLevelId: oneLevelId,
                twoLevelId: twoLevelId,
                threeLevelId: threeLevelId,
                showLoading: true,
                callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                    callBack(selectOneObj, selectTwoObj, selectThreeObj);
                    // selectDateDom.attr('data-year', selectOneObj.id);
                    // selectDateDom.attr('data-month', selectTwoObj.id);
                    // selectDateDom.attr('data-date', selectThreeObj.id);
                    // showDateDom.html(selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value);
                }
        });
}