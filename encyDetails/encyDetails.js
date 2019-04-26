$(function(){
      var encyDetailsList = eval('(' + localStorage.getItem('encyDetailsList') + ')');
      console.log(encyDetailsList);

    $('.teltle').html(encyDetailsList.title);
    $('.nav').html(encyDetailsList.source);
  $('.imgUrl').attr('src',encyDetailsList.imgUrl);
  $('.article').html(encyDetailsList.article);

});