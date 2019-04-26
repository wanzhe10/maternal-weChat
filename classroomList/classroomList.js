$(function () {
    var encyDetailsArray = [];
    localStorage.getItem('propagandaData');
    var propagandaData = eval('(' + localStorage.getItem('propagandaData') + ')');
    var listData = propagandaData.class
    encyDetailsArray = listData;
      var _html = '';
    $.each(listData, function (index, value) {
        _html += '<li class="clearfix" id="' + value.id+ '">\
            <div>\
            <h3>'+value.title+'</h3> \
            <p>'+value.source+'</p>\
             </div> \
             <img src = "'+value.imgUrl+'"alt = "" >\
            </li>'
    });
    $('.uls').append(_html);
    $('.uls').on('click','li',function(){
          var encyDetailsList = encyDetailsArray[$(this).attr('id')];
          localStorage.setItem('encyDetailsList', JSON.stringify(encyDetailsList));
          console.log(encyDetailsList)
          window.location = '/maternal-weChat/encyDetails/encyDetails.html';
          });
});