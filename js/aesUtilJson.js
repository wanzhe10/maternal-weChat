/**
 * 加密（需要先加载lib/aes/aes.min.js文件）
 * @param word
 * @returns {*}
 */
function encrypt(word,key){
    var key = CryptoJS.enc.Utf8.parse(key);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    	mode:CryptoJS.mode.ECB,
    	padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

/**
 * 解密
 * @param word
 * @returns {*}
 */
function decrypt(word,key){
    var key = CryptoJS.enc.Utf8.parse(key);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
    	mode:CryptoJS.mode.ECB,
    	padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

//产生随机数函数
function createAESKey(){
    var rnd = "";
    for(var i = 0; i < 16; i++)
        rnd += Math.floor(Math.random()*10);
    return rnd;
}