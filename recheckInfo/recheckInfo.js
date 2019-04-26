$(function () {
    var fileAllArr = []; // 文件资源数组
    var fileOldArr = [];// 删除的文件路径

    // 获取数据-start
    var secondCheckArr = myLocal.getItem("secondCheckArr") ? myLocal.getItem("secondCheckArr") : [];
    renderDetails(0);
    // 绘制图片
    function renderDetails(index) {
        if (secondCheckArr.length) {
            var navHtml = ""; //导航 html 字符串
            for (var i = 0; i < secondCheckArr.length; i++) {
                navHtml += '<a class="' + (i == index ? "active" : "") + '" href="javascript:;">第 ' + (secondCheckArr.length - i) + ' 次评估</a>'
            }
            $(".navList").html(navHtml);
            $(".navBox").html(navHtml); // 渲染导航
            $(".checkDate").html(secondCheckArr[index].checkDate.split(" ")[0]); // 创建时间
            $(".gestationalWeeks").html((secondCheckArr[index].gestationalWeek ? secondCheckArr[index].gestationalWeek + '周+' : '') + (secondCheckArr[index].gestationalDay ? secondCheckArr[index].gestationalDay : index) + '天'); //孕周 - 天
            $(".makeAppointmentTime").html(secondCheckArr[index].makeAppointmentTime); // 下次预约时间
            $(".bloodPressure").html(secondCheckArr[index].bloodPressureHigh + '/' + secondCheckArr[index].bloodPressureLow); //血压-高-低
            $(".bodyWeight").html(secondCheckArr[index].bodyWeight + 'Kg'); //体重
            $(".highPalace").html(secondCheckArr[index].highPalace); //宫高
            $(".abdominalGirth").html(secondCheckArr[index].abdominalGirth); //腹围
            $(".presentation").html(selectData.presentation[secondCheckArr[index].presentation].value); //先露 0.未填写-默认 1.头先露 2.臀先露
            $(".cardiac").html(selectData.cardiac[secondCheckArr[index].cardiac].value); //胎心 0.未填写-默认
            $(".cohesion").html(selectData.cohesion[secondCheckArr[index].cohesion].value); //衔接 0.未衔接-默认 1.已衔接
            $(".edema").html(selectData.edema[secondCheckArr[index].edema].value); //浮肿 0.无-默认 1.轻 2.中 3.重
            $(".urineProtein").html(selectData.urineProtein[secondCheckArr[index].urineProtein].value); //尿蛋白 0.正常-默认 1.+1 2.+2 3.+3
            $(".malaise").html(secondCheckArr[index].malaise); //自觉不适
            $(".guideTheProcessing").html(secondCheckArr[index].guideTheProcessing); //指导处理
            if (secondCheckArr[index].imageList) {
                var imageList = eval("(" + secondCheckArr[index].imageList + ")");
                var imgHtml = '<div class="addItem">\
                <input class="addFile" type="file" multiple="multiple">\
            </div>';
                for (var i = 0; i < imageList.length; i++) {
                    imgHtml += "<div class='imgItem oldImg' imgData='" + JSON.stringify(imageList[i]) + "'>"
                    imgHtml += '<img src="' + imgIp + imageList[i].minImageURL + '" bigSrc="' + imgIp + imageList[i].maxImageURL + '" alt="">\
                        <a class="delBtn" href="javascript:;"></a>\
                    </div>'
                }
                $(".imgList").html(imgHtml);
            } else {
                $(".imgList").html('<div class="addItem">\
                    <input class="addFile" type="file" multiple="multiple">\
                </div>');
            }

        } else {
            layer.msg("暂无数据");
            // window.location = '/maternal-weChat/user/user.html';
        }
    }
    
    // 获取数据-end


    // 导航栏拖动功能-start
    var startX = 0;
    var widthX = 0;
    // 导航栏的定位 left 值的范围 [ 0 ~ -（导航栏宽度 - 显示部分的宽度）]
    $(".navBox").on({
        // 按下事件
        touchstart: function (e) {
            // startX 按下时导航栏的偏移 = 触摸点在屏幕上距离左侧的距离 - 导航栏已经偏移的距离
            startX = e.originalEvent.targetTouches[0].pageX - parseInt($(this).css('left'));
            // 获取导航栏的宽度
            widthX = $(this).width();
        },
        // 移动事件
        touchmove: function (e) {
            // moveX 触摸点移动时的位置变化
            var moveX = e.originalEvent.targetTouches[0].pageX;
            // （ moveX - startX ）导航栏的 left 值
            if (moveX - startX > 0) {
                // > 0 超出左侧边界
                $(".navBox").css({
                    "left": 0
                });
            } else if (widthX - Math.abs(moveX - startX) < $(".tabContent").width() - $(".btnBox").width()) {
                // 超出右侧边界
                $(".navBox").css({
                    "left": $(".tabContent").width() - $(".btnBox").width() - widthX
                });
            } else {
                // moveX - startX 在允许范围内
                $(".navBox").css({
                    "left": moveX - startX
                });
            }
        },
        // 抬起事件
        touchend: function () {

        }
    })
    // 导航栏拖动功能-end

    // 导航栏焦点切换-start
    $(".navBox").delegate("a", "click", function () {
        $(".navList > a").removeClass("active").eq($(this).index()).addClass("active");
        $(".navBox > a").removeClass("active").eq($(this).index()).addClass("active");
        renderDetails($(this).index());
    })
    $(".navList").delegate("a", "click", function () {
        $(".navList > a").removeClass("active").eq($(this).index()).addClass("active");
        $(".navBox > a").removeClass("active").eq($(this).index()).addClass("active");
        renderDetails($(this).index());
        $(".navListContent").hide();
    })
    $(".btnBox").click(function () {
        $(".navListContent").show();
    })
    $(".closeBtn").click(function () {
        $(".navListContent").hide();
    })
    // 导航栏焦点切换-end


    // 查看大图 - 打开
    $(".imgList").delegate(".imgItem > img", "click", function () {
        $(".bigImgContent").css("display", "flex").find("img").attr("src", $(this).attr("bigsrc"));
    });
    // 查看大图 - 关闭
    $(".bigImgContent").click(function () {
        $(this).css("display", "none");
    })

    // 上传图片-start
    // 添加图片
    $(".imgList").delegate(".addFile", "change", function () {

        var uploadFile = $(this)[0].files; // 获取文件资源
        var _html = '';
        var fileLength = 0;
        var reader = new FileReader();
        reader.readAsDataURL(uploadFile[fileLength]);
        reader.onload = function (e) {
            if (e.target.result) {
                var tempFile = uploadFile[fileLength];
                // 过滤重复
                var flag = true;
                if (tempFile.name == "image.jpg"||tempFile.name == "image.png") {
                    tempFile = new File([uploadFile[fileLength]], (new Date()).getTime() + ".png");
                }
                console.log(tempFile.name);
                for (var i = 0; i < fileAllArr.length; i++) {
                    if (fileAllArr[i].name == tempFile.name) {
                        flag = false;
                    }
                }
                if (flag) {
                    if (/(.png|.jpg|.jpeg)$/gi.test(tempFile.name)) {
                        $(".imgList").append('<div class="imgItem newImg" imgName="' + tempFile.name + '">\
                            <img src="' + e.target.result + '" alt="" bigSrc="' + e.target.result + '">\
                            <a class="delBtn" href="javascript:;"></a>\
                        </div>');
                        render(tempFile.name, e.target.result); 
                    } else {
                        layer.msg('请上传png/jpg/jpeg类型的文件');
                    }
                } else {
                    // layer.msg('重复文件已过滤');
                }
                fileLength++;
                if (fileLength < uploadFile.length) {
                    reader.readAsDataURL(uploadFile[fileLength]);
                }
            }
        }
    })
    // 添加图片-end
    // 删除图片-start
    // 2种删除
    // 删除新上传的图片
    $(".imgList").delegate(".newImg .delBtn", "click", function () {
        for (var i = 0; i < fileAllArr.length; i++) {
            if ($(this).parents(".newImg").attr("imgName") == fileAllArr[i].name) {
                fileAllArr.splice(i, 1);
            }
        }
        $(this).parents(".newImg").remove();
    })
    // 删除已有的图片
    $(".imgList").delegate(".oldImg .delBtn", "click", function () {
        var delImgData = eval("(" + $(this).parents(".oldImg").attr("imgData") + ")");
        fileOldArr.push(delImgData.maxImageURL);
        fileOldArr.push(delImgData.minImageURL);
        $(this).parents(".oldImg").remove();
    })

    // 删除图片-end

    // 上传图片-end
    $(".submitBtn").click(function () {
        layer.load();
        var postData = new FormData();
        postData.append("token", myLocal.getItem("weChatToken")); // token
        postData.append("id", secondCheckArr[$(".navBox a.active").index()].id);
        postData.append("imageList", secondCheckArr[$(".navBox a.active").index()].imageList);
        postData.append("deleteImageURLList", JSON.stringify(fileOldArr)); //删除文件url
        postData.append("ordinalNumber", secondCheckArr[$(".navBox a.active").index()].ordinalNumber); //ordinalNumber
        for (var i = 0; i < fileAllArr.length; i++) {
            postData.append("addImageFile", base64ToBlob(fileAllArr[i].value), fileAllArr[i].name);
        }
        // console.log(fileAllArr);
        HttpRequstFromDataForPost(httpUrl.updateSelf,'json',true,postData,
            function sucFn(data){
                if (data.status == 20200) {
                    HttpRequstForPost(httpUrl.secondFindList,'json',true,{
                            "token": myLocal.getItem("weChatToken"),
                        },
                        function sucFn(data){
                            if (data.status == "20200") {
                                layer.msg("上传成功");
                                var secondCheckArr = data.wxPatientSecondCheckBeanList;
                                if (secondCheckArr.length) {
                                    myLocal.setItem("secondCheckArr", secondCheckArr);
                                } else {
                                    
                                }
                            } else {
                                layer.msg("上传失败");
                            }
                        },
                        function errFn(){})
                } else {

                }
            },
            function errFn(){

            });
        // $.ajax({
        //     type: 'POST',
        //     url: httpUrl.updateSelf,
        //     dataType: 'json',
        //     data: postData,
        //     xhrFields: {
        //         withCredentials: false
        //     },
        //     crossDomain: true,
        //     global: false,
        //     processData: false, // 不处理发送的数据
        //     contentType: false,
        //     success: function (data) {
        //         //console.log(data)
        //         if (data.status == 20200) {
        //             // 复检记录-start
        //             $.ajax({
        //                 type: 'POST',
        //                 url: httpUrl.secondFindList,
        //                 dataType: 'json',
        //                 xhrFields: {
        //                     withCredentials: false
        //                 },
        //                 data: {
        //                     "token": myLocal.getItem("weChatToken"),
        //                 },
        //                 crossDomain: true,
        //                 success: function (data) {
        //                     layer.closeAll();                            
        //                     if (data.status == "20200") {
        //                         layer.msg("上传成功");
        //                         var secondCheckArr = data.wxPatientSecondCheckBeanList;
        //                         if (secondCheckArr.length) {
        //                             myLocal.setItem("secondCheckArr", secondCheckArr);
        //                         } else {
                                    
        //                         }
        //                     } else {
        //                         layer.msg("上传失败");
        //                     }
        //                 },
        //                 error: function (err) {
        //                     layer.closeAll();
        //                     console.log(err);
        //                 },
        //             })
        //         } else {

        //         }
        //     },
        //     error: function (err) {
        //         layer.closeAll();
        //         console.log(err);
        //     },
        // })
    })

    // 压缩图片
    var MAX_HEIGHT = 1250;
    function render(picname, src) {
        // console.log("render");
        // 创建一个 Image 对象
        var image = new Image();
        // 绑定 load 事件处理器，加载完成后执行
        image.onload = function () {
            // console.log("image.onload");
            // 获取 canvas DOM 对象
            var canvas = document.createElement("canvas");
            // 如果高度超标
            if (image.height > MAX_HEIGHT && image.height >= image.width) {
                // 宽度等比例缩放 *=
                image.width *= MAX_HEIGHT / image.height;
                image.height = MAX_HEIGHT;
            }
            //考录到用户上传的有可能是横屏图片同样过滤下宽度的图片。
            if (image.width > MAX_HEIGHT && image.width > image.height) {
                // 宽度等比例缩放 *=
                image.height *= MAX_HEIGHT / image.width;
                image.width = MAX_HEIGHT;
            }
            // 获取 canvas的 2d 画布对象,
            var ctx = canvas.getContext("2d");
            // canvas清屏，并设置为上面宽高
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 重置canvas宽高
            canvas.width = image.width;
            canvas.height = image.height;
            // 将图像绘制到canvas上
            ctx.drawImage(image, 0, 0, image.width, image.height);
            // !!! 注意，image 没有加入到 dom之中
            //    document.getElementById('img').src = canvas.toDataURL("image/png");
            var blob = canvas.toDataURL("image/jpeg",0.8);
            //将转换结果放在要上传的图片数组里
            fileAllArr.push({ "name": picname, "value": blob });
        };
        image.src = src;
    };
})
