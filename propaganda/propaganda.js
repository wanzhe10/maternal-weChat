$(function () {
    var jsonArray = []
   
    $.getJSON("/maternal-weChat/js/array.json", function (data) {
        // console.log(data) 
        var array = data;
        jsonArray = array;
        var _html = '';
        $.each(array, function (indexInArray, valueOfElement) {
            console.log(valueOfElement)
            _html += "<li id= '" + valueOfElement.id + "'>" + valueOfElement.name + "</li>"
        });
    $('.uls').append(_html);
    });
    
     $('.uls').on('click', 'li', function () {
         var changeDetail = jsonArray[$(this).attr('id')];
         localStorage.setItem('propagandaData', JSON.stringify(changeDetail));
         window.location = '/maternal-weChat/classroomList/classroomList.html';
     });
 
});