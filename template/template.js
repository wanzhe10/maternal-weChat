function getAnamnesisIllness(relodDate,anamnesisIllness){
	var tempMap = {};
	var anamnesisIllnessMap = myLocal.getItem("anamnesisIllnessMap");
	if (anamnesisIllnessMap == null) {
		HttpRequstForPost(httpUrl.findListForSpellName,
			'json',true,{
				"token": myLocal.getItem("weChatToken"),	// 请求token
				"spellName": '', 
			},
			function sucFn(sucData){
				var tempMap = {"A":[],"B":[],"C":[],"D":[],"E":[],"F":[],"G":[],"H":[],"I":[],"J":[],"K":[],"L":[],"M":[],
						   "N":[],"O":[],"P":[],"Q":[],"R":[],"S":[],"T":[],"U":[],"V":[],"W":[],"X":[],"Y":[],"Z":[]};
				if (sucData.status == "20200") {
					var tempList = sucData.wxAnamnesisIllnessBeanList;
					for (var i = tempList.length - 1; i >= 0; i--) {
						var spellName = tempList[i].spellName.substring(0,1);
						var spellNameUpper = spellName.toUpperCase();
						var tempArr = tempMap[spellNameUpper];
						tempArr.push(JSON.parse('{"name":"'+tempList[i].anamnesisIllnessName+'","spellName":"'+tempList[i].spellName+'"}'));
					}
					myLocal.setItem("anamnesisIllnessMap", tempMap);
					anamnesisIllness(tempMap);
				}
			},
			function errFn(err){

			});
	}else{
		anamnesisIllness(anamnesisIllnessMap);
	}
}