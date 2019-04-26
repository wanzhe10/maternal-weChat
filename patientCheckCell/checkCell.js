$(function () {
	// 获取选择的信息
	var changeCheckCell = myLocal.getItem("changeCheckCell");
	initHtml();

	function initHtml(){
		// 处理changeCheckCell
		//console.log(changeCheckCell);
		// 获取name
		var titleSpan = $(".titleSpan");
		titleSpan.html(changeCheckCell["name"]+"是什么意思");
		var titleDetailDiv = $(".titleDetailDiv");
		var checkDetail = changeCheckCell["checkDetail"];
		var checkDetailJSON = JSON.parse(checkDetail);
		var firstBoxDivHTML = "";
		for(var tempKey in checkDetailJSON){
			firstBoxDivHTML += '<div class="titleDetail">';
			firstBoxDivHTML += '<span class="spanTitle">'+tempKey+'</span>';
			firstBoxDivHTML += '<span class="spanTitleDetail">'+checkDetailJSON[tempKey]+'</span>'
			firstBoxDivHTML += '</div>';
        }
        titleDetailDiv.html(firstBoxDivHTML);
		var secondTitleDetail = $(".secondTitleDetail");
        var checkDetailRemarks = changeCheckCell["remarks"];
        var checkDetailRemarksHTML = '<span class="secondTitleSpan">'+checkDetailRemarks+'</span>';
        secondTitleDetail.html(checkDetailRemarksHTML);
	}

})