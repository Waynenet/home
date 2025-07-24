//弹窗样式
iziToast.settings({
    timeout: 10000,
    progressBar: false,
    close: false,
    closeOnEscape: true,
    position: 'topCenter',
    transitionIn: 'bounceInDown',
    transitionOut: 'flipOutX',
    displayMode: 'replace',
    layout: '1',
    backgroundColor: '#00000040',
    titleColor: '#efefef',
    messageColor: '#efefef',
    icon: 'Fontawesome',
    iconColor: '#efefef',
});

//鼠标样式
const body = document.querySelector("body");
const element = document.getElementById("pointer");
const halfElementWidth = element.offsetWidth / 2;

function setPosition(x, y) {
    element.style.transform = `translate(${x - halfElementWidth + 19}px, ${y - halfElementWidth + 19}px)`;
}

// 监听鼠标移动，更新指针位置
body.addEventListener("mousemove", (e) => {
    window.requestAnimationFrame(() => setPosition(e.clientX, e.clientY));
});

//非桌面端去除鼠标样式
if (/Mobi|Tablet|iPad|iPhone|Android/i.test(navigator.userAgent)) {
    $('#pointer').css("display", "none");
}

// 确保 Service Worker 支持并已就绪
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready
    .then(() => {
      // 检查 controller 是否存在
      if (navigator.serviceWorker.controller) {
        // 发送版本请求
        navigator.serviceWorker.controller.postMessage({
          type: 'GET_VERSION'
        });
      } else {
        console.warn('Service Worker controller 不存在');
        $('span.img-github span').text('未激活');
      }
    })
    .catch((error) => {
      console.error('Service Worker 就绪失败:', error);
      $('span.img-github span').text('加载失败');
    });

  // 监听回复
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VERSION_INFO') {
      try {
        // 移除所有非数字和点的字符
        const cleanVersion = event.data.version.replace(/[^\d.]/g, '');
        // 更新页面元素
        $('span.img-github span').text(cleanVersion);
      } catch (e) {
        console.error('版本号处理错误:', e);
        $('span.img-github span').text('格式错误');
      }
    }
  });
} else {
  console.warn('当前浏览器不支持 Service Worker');
  $('span.img-github span').text('不支持');
}

//加载完成后执行
window.addEventListener('load', function () {

    //载入动画
    $('#loading-box').attr('class', 'loaded');
    $('#bg').css("cssText", "transform: scale(1);filter: blur(0px);transition: ease 1.5s;");
    $('.cover').css("cssText", "opacity: 1;transition: ease 1.5s;");
    $('#section').css("cssText", "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important");

    //用户欢迎
    setTimeout(function () {
        iziToast.show({
            timeout: 2500,
            icon: false,
            title: timeProcessor.getGreeting(),
            message: '欢迎来到WayneのHome'
        });
    }, 800);

    //延迟加载音乐播放器
    let element = document.createElement("script");
    element.src = "./js/music.js";
    document.body.appendChild(element);

}, false)

setTimeout(function () {
    $('#loading-text').html("字体及文件加载可能需要一定时间")
}, 3000);

//新春灯笼 （ 需要时取消注释 ）

//new_element=document.createElement("link");
//new_element.setAttribute("rel","stylesheet");
//new_element.setAttribute("type","text/css");
//new_element.setAttribute("href","./css/lantern.css");
//document.body.appendChild(new_element);
//
//new_element=document.createElement("script");
//new_element.setAttribute("type","text/javascript");
//new_element.setAttribute("src","./js/lantern.js");
//document.body.appendChild(new_element);


//获取一言
fetch('https://v1.hitokoto.cn?max_length=24')
    .then(response => response.json())
    .then(data => {
        $('#hitokoto_text').html(data.hitokoto)
        $('#from_text').html(data.from)
    })
    .catch(console.error)

let times = 0;
$('#hitokoto').click(function () {
    if (times == 0) {
        times = 1;
        let index = setInterval(function () {
            times--;
            if (times == 0) {
                clearInterval(index);
            }
        }, 1000);
        fetch('https://v1.hitokoto.cn?max_length=24')
            .then(response => response.json())
            .then(data => {
                $('#hitokoto_text').html(data.hitokoto)
                $('#from_text').html(data.from)
            })
            .catch(console.error)
    } else {
        iziToast.show({
            timeout: 2000,
            icon: "fa-solid fa-circle-exclamation",
            message: '你点太快了吧'
        });
    }
});

//获取天气
fetch('https://api.vvhan.com/api/weather')
    .then(response => response.json())
    .then(data => {
        $('#wea_text').html(data.data.type)
        $('#city_text').html(data.city)
        $('#tem_low').html(data.data.low)
        $('#tem_high').html(data.data.high)
    })
    .catch(console.error)

//链接提示文字
$("#social").mouseover(function () {
    $("#social").css({
        "background": "rgb(0 0 0 / 25%)",
        'border-radius': '6px',
        "backdrop-filter": "blur(5px)"
    });
    $("#link-text").css({
        "display": "block",
    });
}).mouseout(function () {
    $("#social").css({
        "background": "none",
        "border-radius": "6px",
        "backdrop-filter": "none"
    });
    $("#link-text").css({
        "display": "none"
    });
});

$("#github").mouseover(function () {
    $("#link-text").html("去 Github 看看");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#email").mouseover(function () {
    $("#link-text").html("来封 Email");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#telegram").mouseover(function () {
    $("#link-text").html("请打电报");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#twitter").mouseover(function () {
    $("#link-text").html("你懂的 ~");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#phone").mouseover(function () {
    $("#link-text").html("不一定在线哦");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});

//更多页面切换
let shoemore = false;
$('#switchmore').on('click', function () {
    shoemore = !shoemore;
    if (shoemore && $(document).width() >= 990) {
        $('#container').attr('class', 'container mores');
        $("#change").html("Oops&nbsp;!");
        $("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
    } else {
        $('#container').attr('class', 'container');
        $("#change").html("Hello&nbsp;World&nbsp;!");
        $("#change1").html("把空间让，敞开的窗。将时间藏，露天的黄。");
    }
});

//更多页面关闭按钮
$('#close').on('click', function () {
    $('#switchmore').click();
});

//移动端菜单栏切换
let switchmenu = false;
$('#switchmenu').on('click', function () {
    switchmenu = !switchmenu;
    if (switchmenu) {
        $('#row').attr('class', 'row menus');
        $("#menu").html("<i class='fa-solid fa-xmark'></i>");
    } else {
        $('#row').attr('class', 'row');
        $("#menu").html("<i class='fa-solid fa-bars'></i>");
    }
});

//更多弹窗页面
$('#openmore').on('click', function () {
    $('#box').css("display", "block");
    $('#row').css("display", "none");
    $('#more').css("cssText", "display:none !important");
});
$('#closemore').on('click', function () {
    $('#box').css("display", "none");
    $('#row').css("display", "flex");
    $('#more').css("display", "flex");
});

//监听网页宽度
window.addEventListener('load', function () {
    window.addEventListener('resize', function () {
        //关闭移动端样式
        if (window.innerWidth >= 600) {
            $('#row').attr('class', 'row');
            $("#menu").html("<i class='fa-solid fa-bars'></i>");
            //移除移动端切换功能区
            $('#rightone').attr('class', 'row rightone');
        }

        if (window.innerWidth <= 990) {
            //移动端隐藏更多页面
            $('#container').attr('class', 'container');
            $("#change").html("Hello&nbsp;World&nbsp;!");
            $("#change1").html("把空间让，敞开的窗。将时间藏，露天的黄。");

            //移动端隐藏弹窗页面
            $('#box').css("display", "none");
            $('#row').css("display", "flex");
            $('#more').css("display", "flex");
        }
    })
})

//移动端切换功能区
let changemore = false;
$('#changemore').on('click', function () {
    changemore = !changemore;
    if (changemore) {
        $('#rightone').attr('class', 'row menus mobile');
    } else {
        $('#rightone').attr('class', 'row menus');
    }
});

//更多页面显示关闭按钮
$("#more").hover(function () {
    $('#close').css("display", "block");
    $('#openmore').css("display", "block");
}, function () {
    $('#close').css("display", "none");
    $('#openmore').css("display", "none");
})

//屏蔽右键
document.oncontextmenu = function () {
    iziToast.show({
        timeout: 2000,
        icon: "fa-solid fa-circle-exclamation",
        message: '为了浏览体验，本站禁用右键'
    });
    return false;
}