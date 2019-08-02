// [NCMB] APIキー設定
var appKey = "";
var clientKey = "";

// [NCMB] SDKの初期化
var ncmb = new NCMB(appKey, clientKey);

// ログイン中の会員
var currentLoginUser;

// 【ID / PW 認証】「登録する」ボタン押下時の処理
function onIDRegisterBtn() {
    // 入力フォームからID(username)とPW(password)を取得
    var username = $("#reg_username").val();
    var password = $("#IDReg_password").val();
    // loading の表示
    $.mobile.loading('show');
    // [NCMB] user インスタンスの生成
    var user = new ncmb.User();
    // [NCMB] ID / PW で新規登録
    user.set("userName", username)
        .set("password", password)
        .signUpByAccount()
        .then(function (user) {
            /* 処理成功 */
            console.log("新規登録に成功しました");
            //ローカルストレージの消去
            //localStorage.removeItem('userName1');
            //ローカルストレージに保存
            localStorage.setItem('userName1', username);
            // [NCMB] userインスタンスでログイン
            ncmb.User.login(user)
                .then(function (user) {
                    /* 処理成功 */
                    console.log("ログインに成功しました");
                    //ローカルストレージに保存
                    localStorage.setItem('userName1', username);
                    // [NCMB] ログイン中の会員情報の取得
                    currentLoginUser = ncmb.User.getCurrentUser();
                    // フィールドを空に
                    $("#reg_username").val("");
                    $("#IDReg_password").val("");
                    // 詳細ページへ移動
                    $.mobile.changePage('#ProfilePage');
                })
                .catch(function (error) {
                    /* 処理失敗 */
                    console.log("ログインに失敗しました: " + error);
                    alert("ログインに失敗しました: " + error);
                    // フィールドを空に
                    $("#reg_username").val("");
                    $("#IDReg_password").val("");
                    // loading の表示
                    $.mobile.loading('hide');
                });
        })
        .catch(function (error) {
            /* 処理失敗 */
            console.log("新規登録に失敗しました：" + error);
            alert("新規登録に失敗しました：" + error);
            // フィールドを空に
            $("#reg_username").val("");
            $("#IDReg_password").val("");
            // loading の表示
            $.mobile.loading('hide');
        });
}

// ログインボタン押下時の処理
function onIDLoginBtn() {
    // 入力フォームからID(username)とPW(password)を取得
    var username = $("#login_username").val();
    var password = $("#IDLogin_password").val();
    // loading の表示
    $.mobile.loading('show');

    // [NCMB] ID / PW でログイン
    ncmb.User.login(username, password)
        .then(function (user) {
           //ローカルストレージに保存
            localStorage.setItem('userName1', username);
            /* 処理成功 */
            console.log("【ID / PW 認証】ログインに成功しました");
            // [NCMB] ログイン中の会員情報の取得
            currentLoginUser = ncmb.User.getCurrentUser();
            // フィールドを空に
            $("#login_username").val("");
            $("#IDLogin_password").val("");
            // 詳細ページへ移動
            $.mobile.changePage('#TopPage');
        })
        .catch(function (error) {
            /* 処理失敗 */
            console.log("ログインに失敗しました: " + error);
            alert("ログインに失敗しました: " + error);
            // フィールドを空に
            $("#login_username").val("");
            $("#IDLogin_password").val("");
            // loading の表示終了
            $.mobile.loading('hide');
        });
}


//---------------------------------------------------------------------------

// アプリ起動時
$(function () {
    $.mobile.defaultPageTransition = 'none';
    /* ID / PW */
    $("#IDLoginBtn").click(onIDLoginBtn);
    $("#IDRegisterBtn").click(onIDRegisterBtn);
      
});

// loading 表示生成
$(document).on('mobileinit', function () {
    $.mobile.loader.prototype.options;
});

// DetailPage ページが表示されるたびに実行される処理
$(document).on('pageshow', '#DetailPage', function (e, d) {
    // currentUserData を表示
    getUserData();
    // loading の表示を終了
    $.mobile.loading('hide');
});

// currentUser のデータを表示する処理
function getUserData() {
    // 値を取得
    var objectId = currentLoginUser.get("objectId");
    var userName = currentLoginUser.get("userName");
    var mailAddress = currentLoginUser.get("mailAddress");
    var authData = JSON.stringify(currentLoginUser.get("authData"));
    var date = new Date(currentLoginUser.get("createDate"));
    var createDate = date.getFullYear() + "-"
        + ((date.getMonth() < 10) ? "0" : "") + date.getMonth() + "-"
        + ((date.getDate() < 10) ? "0" : "") + date.getDate() + "T"
        + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":"
        + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":"
        + ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds() + "."
        + ((date.getMilliseconds() < 10) ? "0" : "") + date.getMilliseconds() + "+09:00";
    // リストに追加
    $("#currentUserData").append("<tr style='border-right: 1px solid #ccc; border-left: 1px solid #ccc; color: #FFFFFF; background: #04162e;'><th scope='row' id='key'>key</th><td scope='row' id='value' style='width: 100%;'>value</td></tr>");
    $("#currentUserData").append("<tr><th>objectId</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + objectId + "'/></tr>");
    $("#currentUserData").append("<tr><th>userName</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + userName + "'/></tr>");
    $("#currentUserData").append("<tr><th>password</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='(hidden)'/></tr>");
    $("#currentUserData").append("<tr><th>mailAddress</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + mailAddress + "'/></tr>");
    $("#currentUserData").append("<tr><th>authData</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + authData + "'/></tr>");
    $("#currentUserData").append("<tr><th>createDate</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + createDate + "'/></tr>");
    // リストを更新
    $("#currentUserData").listview('refresh');
}

function onDeleteField() {
    // フィールドを空に
    $("#reg_mailAddress").val("");
}

function initTopPage() {
    $("#TopListView").empty();

    var list = getMemoList();
    for (var i in list) {
        var memo = list[i];
        var d = new Date(memo.time);
        var date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();

        $li = $("<li><a href='#' class='show'><h3></h3><p></p></a><a href='#' class='delete'>Delete</a></li>");
        $li.data("id", memo.id);
        $li.find("h3").text(date);
        $li.find("p").text(memo.text);
        $("#TopListView").prepend($li);
    }
    if (list.length == 0) {
        $li = $("<li>No memo found</li>");
        $("#TopListView").prepend($li);
    }
    $("#TopListView").listview("refresh");
}
//投稿保存（いらんやつ）
function onSaveBtn() {
    var text = $("#Memo").val();
    if (text != '') {
        // Save to local storage
        addMemo(text);
        $("#Memo").val("");
        initTopPage();
    }
    $.mobile.changePage("#TopPage", { reverse: true });
}

//投稿表示
function onShowLink() {
    var $li = $(this).parent();
    var memoTitle = $li.find("h3").text();
    var memoHtml = $li.find("p").html().replace(/\n/g, "<br>");

    $("#ShowPage h1").text(memoTitle);
    $("#ShowPage p").html(memoHtml);
    $.mobile.changePage("#ShowPage");
}

//削除
function onDeleteLink() {
    if (!confirm("投稿を削除しますか？")) {
        return;
    }
    var $li = $(this).parent();
    var id = $li.data("id");
    deleteMemo(id);

    initTopPage();

    $.mobile.changePage("#TopPage", { reverse: true });
}

var downFileName = "uploaded.jpg"; //保存File名
var upFileName = "up.jpg"; //保存File名
var ncmb = null;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.camera);
}

$(function () {
    document.getElementById("top").style.display = "none";

    ncmb = new NCMB(appKey, clientKey);
    // ボタンクリックで時刻を更新
    $('#btn').click(function (e) {
        snapPicture();
    });
});

// Base64データをBlobデータに変換
function Base64toBlob(base64) {
    var tmp = base64.split(',');
    // base64データの文字列をデコード
    var data = atob(tmp[1]);

    var mime = tmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コード
    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
    var blob = new Blob([buf], { type: mime });
    return blob;
}

// カメラ設定
function snapPicture() {
    navigator.camera.getPicture(onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    //成功した際
    function onSuccess(imageData) {
        var img = new Image();
        img.src = "data:image/jpeg;base64," + imageData;
        img.onload = function () {

            // キャンパス描画
            var image_canvas = document.getElementById("showImage");
            var ctx = image_canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 800, 800);

            var src = ctx.getImageData(0, 0, image_canvas.width, image_canvas.height);
            var dst = ctx.createImageData(image_canvas.width, image_canvas.height);
            for (var i = 0; i < src.data.length; i = i + 4) {
                var pixel = (src.data[i] + src.data[i + 1] + src.data[i + 2]) / 3;
                dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = pixel;
                dst.data[i + 3] = src.data[i + 3];
            }
            ctx.putImageData(dst, 0, 0);

            // canvasから画像生データを作成
            var jpgData = image_canvas.toDataURL('image/jpeg');
            var blob = Base64toBlob(jpgData);

            //NCMBサーバーからファイルダウンロード
            var getFile = ncmb.File.upload(upFileName, blob)
                .then(function (blob) {
                });
        }
    }
    //失敗した場合
    function onFail(message) {
        alert('写真が撮影されませんでした。: ' + message);
    }


    //洋服追加のカメラ機能
    var downFileName2 = "uploaded.jpg"; //保存File名
    var upFileName2 = "up.jpg"; //保存File名
    var ncmb = null;

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.camera);
    }

    $(function () {
        document.getElementById("top").style.display = "none";

        ncmb = new NCMB(appKey, clientKey);
        // ボタンクリックで時刻を更新
        $('#btn').click(function (e) {
            snapPicture();
        });
    });

    // Base64データをBlobデータに変換
    function Base64toBlob(base64) {
        var tmp = base64.split(',');
        // base64データの文字列をデコード
        var data = atob(tmp[1]);

        var mime = tmp[0].split(':')[1].split(';')[0];
        //  1文字ごとにUTF-16コード
        var buf = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
        // blobデータを作成
        var blob = new Blob([buf], { type: mime });
        return blob;
    }

    // カメラ設定
    function snapPicture() {
        navigator.camera.getPicture(onSuccess, onFail,
            { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
        //成功した際
        function onSuccess(imageData) {
            var img = new Image();
            img.src = "data:image/jpeg;base64," + imageData;
            img.onload = function () {

                // キャンパス描画
                var image_canvas = document.getElementById("SimpleCanvas");
                var ctx = image_canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 800, 800);

                var src = ctx.getImageData(0, 0, image_canvas.width, image_canvas.height);
                var dst = ctx.createImageData(image_canvas.width, image_canvas.height);
                for (var i = 0; i < src.data.length; i = i + 4) {
                    var pixel = (src.data[i] + src.data[i + 1] + src.data[i + 2]) / 3;
                    dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = pixel;
                    dst.data[i + 3] = src.data[i + 3];
                }
                ctx.putImageData(dst, 0, 0);

                // canvasから画像生データを作成
                var jpgData = image_canvas.toDataURL('image/jpeg');
                var blob = Base64toBlob(jpgData);

                //NCMBサーバーからファイルダウンロード
                var getFile = ncmb.File.upload(upFileName, blob)
                    .then(function (blob) {
                    });
            }
        }
        //失敗した場合
        function onFail(message) {
            alert('写真が撮影されませんでした。: ' + message);
        }
    }
}


// ファイルが選択されたら
$('input[type=file]').change(function () {

    // ファイルを取得
    file = $(this).prop('files')[0];
    // 選択されたファイルが画像かどうか判定
    if (file.type != 'image/jpeg' && file.type != 'image/png') {
        // 画像でない場合は終了
        file = null;
        blob = null;
        return;
    }

    // 画像をリサイズする
    var image = new Image();
    var reader = new FileReader();
    reader.onload = function (e) {
        image.onload = function () {
            var width, height;
            if (image.width > image.height) {
                // 横長の画像は横のサイズを指定値にあわせる
                var ratio = image.height / image.width;
                width = THUMBNAIL_WIDTH;
                height = THUMBNAIL_WIDTH * ratio;
            } else {
                // 縦長の画像は縦のサイズを指定値にあわせる
                var ratio = image.width / image.height;
                width = THUMBNAIL_HEIGHT * ratio;
                height = THUMBNAIL_HEIGHT;
            }
            // サムネ描画用canvasのサイズを上で算出した値に変更
            var canvas = $('#canvas')
                .attr('width', width)
                .attr('height', height);
            var ctx = canvas[0].getContext('2d');
            // canvasに既に描画されている画像をクリア
            ctx.clearRect(0, 0, width, height);
            // canvasにサムネイルを描画
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

            // canvasからbase64画像データを取得
            var base64 = canvas.get(0).toDataURL('image/jpeg');
            // base64からBlobデータを作成
            var barr, bin, i, len;
            bin = atob(base64.split('base64,')[1]);
            len = bin.length;
            barr = new Uint8Array(len);
            i = 0;
            while (i < len) {
                barr[i] = bin.charCodeAt(i);
                i++;
            }
            blob = new Blob([barr], { type: 'image/jpeg' });
            console.log(blob);
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

//---------------アカウント画像ボタンを押した時-------------//
function onDiviceReady() {

    var reader = new FileReader();
    reader.onload = function (e) {
        var dataUrl = reader.result;
        document.getElementById("showImage4").src = dataUrl;
    }

    // ファイルを選択したら実行
    var photo = document.getElementById("photo2");
    photo.addEventListener('change', function (e) {
        e.preventDefault();
        var file = e.target.files[0];
        document.getElementById("filename").value = file.name
        reader.readAsDataURL(file);
    }, false);

    // ファイルアップロード
    var submit = document.getElementById("button");
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        // ファイル名、ファイルデータを取得
        var fileName = document.getElementById("filename").value;
        var fileData = dataURItoBlob(document.getElementById("showImage4").src);

        // アップロード
        ncmb.File.upload(fileName, fileData)
            .then(function (res) {
                console.log(res);
            })
            .catch(function (err) {
                console.error(err);
            })
    }, false)

}

// dataURIをBlobに変換
function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}

document.addEventListener("deviceready", onDiviceReady, false);



//---------------ファイル選択ボタンを押した時-----------------//
function onDiviceReady() {

    var reader = new FileReader();
    reader.onload = function (e) {
        var dataUrl = reader.result;
        document.getElementById("showImage3").src = dataUrl;
    }

    // ファイルを選択したら実行
    var photo = document.getElementById("photo");
    photo.addEventListener('change', function (e) {
        e.preventDefault();
        var file = e.target.files[0];
        document.getElementById("filename").value = file.name
        reader.readAsDataURL(file);
    }, false);

    // ファイルアップロード
    var submit = document.getElementById("TweetButton");
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        // ファイル名、ファイルデータを取得
        var fileName = document.getElementById("filename").value;
        var fileData = dataURItoBlob(document.getElementById("showImage3").src);

        // アップロード
        ncmb.File.upload(fileName, fileData)
            .then(function (res) {
                console.log(res);
            })
            .catch(function (err) {
                console.error(err);
            })
    }, false)

}

// dataURIをBlobに変換
function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}
document.addEventListener("deviceready", onDiviceReady, false);

//投稿内容の保存(投稿ボタンを押した時)
function tweetClick() {

    //--------投稿内容保存-----------//
    var TweetDetails = ncmb.DataStore("FashionTweetDetails");
    var tweetDetails = new TweetDetails();
    var tweetText = $('#points').val();

    //投稿の内容
    tweetDetails.set("tweetdetails",tweetText);
    //投稿の写真
    tweetDetails.set("tweetImg", document.getElementById("filename").value);
    tweetDetails.save()
        .then(function (tweetDetails) {
            // -------保存後の処理(データストアデータ取得)------//
                SetTweetTable();
        });
}


//loadされている画像をデータストア内の画像データに変換
function ChangeImages(){
 console.log("ChangeImages");
     let reader = new FileReader();
   $('#tb1 tbody tr').each(function(){
   let row = $(this);
   let file_name = row.attr('data-post-image');
   console.log("file_name > " + file_name);
   ncmb.File.download(file_name,'blob')
   .then(function(blob){
     reader.onload = function(){
       row.find('.post-image img').attr('src',reader.result);
     }
     reader.onerror = function() {
       alert("画像がありません");
     }
     reader.readAsDataURL(blob);
   })
   .catch(function(err) {
     alert("画像がありません");
   })
});
}

function ChangeImages1(){
     let reader = new FileReader();
   $('#tb2 tbody tr').each(function(){
   let row = $(this);
   let file_name = row.attr('data-post-image1');
   ncmb.File.download(file_name,'blob')
   .then(function(blob){
     reader.onload = function(){
       row.find('.post-image1 img').attr('src',reader.result);
     }
     reader.onerror = function() {
       alert("読み込みエラー");
     }
     reader.readAsDataURL(blob);
   })
   .catch(function(err) {
     alert("読み込み失敗");
   })
});
}

function SetTweetTable() {
  $('#tb1').empty();
    var TweetDetails = ncmb.DataStore("FashionTweetDetails");
    TweetDetails.
        limit(100).
        fetchAll()
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                $('#tb1').append(
                    $('<tr>', { 'data-post-image': results[i].tweetImg }).append(
                        $('<td>', { addClass: 'post-image' }).append('<img src = "images/oval.svg">'),
                        $('<td>', { addClass: 'post-text' }).text(results[i].tweetdetails)
                    ));
            }
            ChangeImages();
        });
}


      //洋服一覧表示
      function Photoitiran(){
        $('#tb2').empty();
        currentLoginUser = ncmb.User.getCurrentUser();
        var nowuser = localStorage.getItem("userName1");
        console.log(nowuser);
        var Photo = ncmb.DataStore("photo");
        Photo.equalTo("login",nowuser)
        .limit(100)
        .fetchAll()
        .then(function (results){
          for(var i = 0;i < results.length; i++){
            $('#tb2').append(
                    $('<tr>', { 'data-post-image1': results[i].photoimg }).append(
                    $('<td>', { addClass: 'post-image1' }).append('<img src = "images/oval.svg">')
                    ));
          }
          ChangeImages1();
        })
      }


//保存された全データをリクエストボードに表示
function SetRequestList() {
    var PostDetails = ncmb.DataStore("postanswer");
    PostDetails.
        limit(100).
        fetchAll()
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                console.log(JSON.stringify(results[i]));
                console.log(results[i].purpose);
                console.log(results[i].time);
                console.log(results[i].age);
                console.log(results[i].point);
                $('#request_list').append(
                        $('<li>', { addClass: 'request-purpose' }).text(results[i].purpose),
                        $('<li>', { addClass: 'request-time' }).text(results[i].time),
                        $('<li>', { addClass: 'request-age' }).text(results[i].age),
                        $('<li>', { addClass: 'request-point' }).text(results[i].point),
                        $('<hr>')
                    );
            }
        })
}


//クリックされたリストの内容をリクエスト回答に表示
function RequestAnswer(){
window.location.href = "#ri-ans";
var PostDetails = ncmb.DataStore("postanswer");
    PostDetails.
        limit(1).
        fetchAll()
        .then(function (results) {
          $('#request_list').on('click', function(){
        var id =  $(this).attr("<li>",results);
        cnsole.log("OK！");
    });
        });
}
       
//リクエスト
      function OnButtonClick(){
        var postanswer = ncmb.DataStore("postanswer");
        var Post = new postanswer();
        var time = $('#time').val();
        var age = $('#age').val();
        var purpose = $('#purposetext').val();
        var point = $('#pointtext').val();
        alert("投稿しました")
        //console.log(time);
        //ログインユーザーの取得
        currentLoginUser = ncmb.User.getCurrentUser();
        Post.set("time",time)
          .set("age",age)
          .set("purpose",purpose)
          .set("point",point)
          .set("postuser",currentLoginUser)
          .save()
      }


//トップス登録
function insertTops() {
     navigator.camera.getPicture(onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    function onSuccess(imageData) {
        var image = document.getElementById('img1');
        image.src = "data:image/jpeg;base64," + imageData;
   var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&=~/*-+"; 
    //桁数の定義
    var len = 8;
    //ランダムな文字列の生成
    var result = "";
    for(var i=0;i<len;i++){
      result += str.charAt(Math.floor(Math.random() * str.length));
    }
    return result;
        var byteCharacters1 = toBlob(imageData);
        ncmb.File.upload(result, byteCharacters1)
            .then(function () {
                alert("アウターを登録しました")
                var Photo = ncmb.DataStore("");
                var photo = new Photo();
                currentLoginUser = ncmb.User.getCurrentUser();
                photo.set("photoimg", "outer.jpg")
                    .set("username", currentLoginUser)
                    .save();
            })
            .catch(function (error) {
                alert(JSON.stringify(error));
            });
    }
    function onFail(message) {
        alert('カメラエラーです: ' + message);
    }
}
function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ""));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    try {
        var blob = new Blob([buffer.buffer], {
            type: "image/jpeg"
        });
    } catch (e) {
        return false;
    }
    return blob;
}

//アウター登録
function insertOuter() {
    navigator.camera.getPicture(onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    function onSuccess(imageData) {
        var image = document.getElementById('img2');
        image.src = "data:image/jpeg;base64," + imageData;
        // 1~100
        var random = Math.ceil(Math.random() * 100);
        var byteCharacters1 = toBlob(imageData);
        ncmb.File.upload(random, byteCharacters1)
            .then(function () {
                alert("アウターを登録しました")
                var Photo = ncmb.DataStore("");
                var photo = new Photo();
                currentLoginUser = ncmb.User.getCurrentUser();
                photo.set("photoimg", "outer.jpg")
                    .set("username", currentLoginUser)
                    .save();
            })
            .catch(function (error) {
                alert(JSON.stringify(error));
            });
    }
    function onFail(message) {
        alert('カメラエラーです: ' + message);
    }
}
function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ""));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    try {
        var blob = new Blob([buffer.buffer], {
            type: "image/jpeg"
        });
    } catch (e) {
        return false;
    }
    return blob;
}
//ズボン登録
function insertPants() {
    navigator.camera.getPicture(onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    function onSuccess(imageData) {
        var image = document.getElementById('img3');
        image.src = "data:image/jpeg;base64," + imageData;
        // 1~100
        var random = Math.ceil(Math.random() * 100);
        var byteCharacters1 = toBlob(imageData);
        ncmb.File.upload(random, byteCharacters1)
            .then(function () {
                alert("ズボンを登録しました")
                var Photo = ncmb.DataStore("photo");
                var photo = new Photo();
                currentLoginUser = ncmb.User.getCurrentUser();
                photo.set("photoimg", "pants.jpg")
                    .set("username", currentLoginUser)
                    .save();
            })
            .catch(function (error) {
                alert(JSON.stringify(error));
            });
    }
    function onFail(message) {
        alert('カメラエラーです: ' + message);
    }
}
function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ""));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    try {
        var blob = new Blob([buffer.buffer], {
            type: "image/jpeg"
        });
    } catch (e) {
        return false;
    }
    return blob;
}
//シューズ登録
function insertShoes() {
    navigator.camera.getPicture(onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    function onSuccess(imageData) {
        var image = document.getElementById('img4');
        image.src = "data:image/jpeg;base64," + imageData;
        // 1~100
        var random = Math.ceil(Math.random() * 100);
        var byteCharacters1 = toBlob(imageData);
        ncmb.File.upload(random, byteCharacters1)
            .then(function () {
                alert("シューズを登録しました")
                var Photo = ncmb.DataStore("photo");
                var photo = new Photo();
                currentLoginUser = ncmb.User.getCurrentUser();
                photo.set("photoimg", "shoes.jpg")
                    .set("username", currentLoginUser)
                    .save();
            })
            .catch(function (error) {
                alert(JSON.stringify(error));
            });
    }
    function onFail(message) {
        alert('カメラエラーです: ' + message);
    }
}
function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ""));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    try {
        var blob = new Blob([buffer.buffer], {
            type: "image/jpeg"
        });
    } catch (e) {
        return false;
    }
    return blob;
}

function RequestSave(){
  alert("回答を送信しました");
}