$.loading = function (param) {
    var option = $.extend({
        id: 'loading',      //唯一标识
        parent: 'body',     //父容器
        msg: ''             //提示信息
 
    }, param || {});
    var obj = {};
    var html = '<table id=' + option.id + ' class="loading">' +
                    '<tr>' +
                        '<td>' +
                            '<div class="circle">' +
                            '</div>' +
                            '<div class="circle1">' +
                            '</div>';
    if (option.msg) {
        html += '<div class="msg"><p class="shine">' + option.msg + '</p></div>';
    }
    html += '</td></tr></table>';
    var loading = $(html).appendTo(option.parent);
 
    return {
        play: function () {
            $('.circle,.circle1,.shine', loading).toggleClass('stop');
        },
        pause: function () {
            $('.circle,.circle1,.shine', loading).toggleClass('stop');
        },
        close: function () {
            loading.remove();
        }
    };
};