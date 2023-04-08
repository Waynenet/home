// 背景图片 Cookies 
function setBgImg(bg_img) {
    if (bg_img) {
        Cookies.set('bg_img', bg_img, {
            expires: 36500
        });
        return true;
    }
    return false;
}

// 获取背景图片 Cookies
function getBgImg() {
    let bg_img_local = Cookies.get('bg_img');
    if (bg_img_local && bg_img_local !== "{}") {
        return JSON.parse(bg_img_local);
    } else {
        setBgImg(bg_img_preinstall);
        return bg_img_preinstall;
    }
}

let bg_img_preinstall = {
    "type": "1", // 1:默认背景 2:每日一图 3:随机风景 4:随机动漫
    "path": "", //自定义图片
};


// 更改背景图片
function setBgImgInit() {
    let bg_img = getBgImg();
    $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();

    switch (bg_img["type"]) {
        case "1":
            $('#bg').attr('src', `./img/background${1 + ~~(Math.random() * 10)}.webp`) //随机默认壁纸
            break;
        case "2":
            $('#bg').attr('src', 'https://api.dujin.org/bing/1920.php'); //必应每日
            break;
        case "3":
            $('#bg').attr('src', 'https://api.yimian.xyz/img?type=wallpaper'); //随机风景
            break;
        case "4":
            $('#bg').attr('src', 'https://api.yimian.xyz/img?type=moe&size=1920x1080'); //随机动漫
            break;
    }
}

$(document).ready(function () {
    // 壁纸数据加载
    setBgImgInit();
    // 设置背景图片
    $("#wallpaper").on("click", ".set-wallpaper", function () {
        let type = $(this).val();
        let bg_img = getBgImg();
        bg_img["type"] = type;
        setBgImg(bg_img);

        if (type === "1") {
            $('#bg').attr('src', `./img/background${1 + ~~(Math.random() * 10)}.webp`) //随机默认壁纸
        }
        if (type === "2") {
            $('#bg').attr('src', 'https://api.dujin.org/bing/1920.php'); //必应每日
        }
        if (type === "3") {
            $('#bg').attr('src', 'https://api.yimian.xyz/img?type=wallpaper'); //随机风景
        }
        if (type === "4") {
            $('#bg').attr('src', 'https://api.yimian.xyz/img?type=moe&size=1920x1080'); //随机动漫
        }

        iziToast.show({
            icon: "fa-solid fa-image",
            timeout: 2500,
            message: '壁纸设置成功',
        });
    });
});