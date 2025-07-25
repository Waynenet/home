// 使用状态对象管理全局变量
const state = {
    times: 0,
    shoemore: false,
    switchmenu: false,
    changemore: false
};

// 缓存DOM元素
const $elements = {
    linkText: $("#link-text"),
    container: $("#container"),
    loadingBox: $("#loading-box"),
    hitokotoText: $("#hitokoto_text"),
    fromText: $("#from_text"),
    social: $("#social"),
    pointer: $("#pointer"),
    bg: $("#bg"),
    cover: $(".cover"),
    section: $("#section"),
    row: $("#row"),
    menu: $("#menu"),
    box: $("#box"),
    more: $("#more"),
    rightone: $("#rightone"),
    change: $("#change"),
    change1: $("#change1"),
    close: $("#close"),
    openmore: $("#openmore"),
    closemore: $("#closemore")
};

// 防抖函数
function debounce(fn, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
}

// 版本获取
function fetchVersion() {
    if (!navigator.serviceWorker?.controller) {
        setTimeout(fetchVersion, 300);
        return;
    }

    const handleMessage = (event) => {
        if (event.data.type === "VERSION_INFO") {
            const cleanVersion = event.data.version.replace(/[^\d.]/g, "");
            $('span.img-github span').text(cleanVersion);
            navigator.serviceWorker.removeEventListener("message", handleMessage);
        }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" });
}

// 弹窗样式配置
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

// 鼠标样式
if (!/Mobi|Tablet|iPad|iPhone|Android/i.test(navigator.userAgent)) {
    const halfElementWidth = $elements.pointer[0].offsetWidth / 2;
    
    function setPosition(x, y) {
        $elements.pointer.css({
            transform: `translate(${x - halfElementWidth + 19}px, ${y - halfElementWidth + 19}px)`
        });
    }

    $(document).on("mousemove", (e) => {
        window.requestAnimationFrame(() => setPosition(e.clientX, e.clientY));
    });
} else {
    $elements.pointer.hide();
}

// 加载完成后执行
$(window).on('load', function() {
    // 载入动画
    $elements.loadingBox.addClass('loaded');
    $elements.bg.css({
        transform: "scale(1)",
        filter: "blur(0px)",
        transition: "ease 1.5s"
    });
    $elements.cover.css("opacity", 1);
    $elements.section.css({
        transform: "scale(1)",
        opacity: 1,
        filter: "blur(0px)"
    });

    // 用户欢迎
    setTimeout(() => {
        iziToast.show({
            timeout: 2500,
            icon: false,
            title: timeProcessor.getGreeting(),
            message: '欢迎来到WayneのHome'
        });
    }, 800);

    // 延迟加载音乐播放器
    if (document.readyState === "complete") {
        loadMusicPlayer();
    } else {
        window.addEventListener("load", loadMusicPlayer);
    }
});

// 加载音乐播放器
function loadMusicPlayer() {
    const script = document.createElement("script");
    script.src = "./js/music.js";
    script.async = true;
    document.body.appendChild(script);
}

// 一言功能
const fetchHitokoto = debounce(async function() {
    try {
        const response = await fetch('https://v1.hitokoto.cn?max_length=24');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        $elements.hitokotoText.text(data.hitokoto);
        $elements.fromText.text(data.from);
    } catch (error) {
        console.error('Error fetching hitokoto:', error);
        $elements.hitokotoText.text('获取一言失败');
    }
}, 1000);

$('#hitokoto').on('click', function() {
    if (state.times === 0) {
        state.times = 1;
        setTimeout(() => { state.times = 0; }, 1000);
        fetchHitokoto();
    } else {
        iziToast.show({
            timeout: 2000,
            icon: "fa-solid fa-circle-exclamation",
            message: '你点太快了吧'
        });
    }
});

// 天气功能
fetch('https://api.vvhan.com/api/weather')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        $('#wea_text').text(data.data.type);
        $('#city_text').text(data.city);
        $('#tem_low').text(data.data.low);
        $('#tem_high').text(data.data.high);
    })
    .catch(error => {
        console.error('Error fetching weather:', error);
    });

// 链接提示文字配置
const linkHints = {
    github: "去 Github 看看",
    email: "来封 Email", 
    telegram: "请打电报",
    twitter: "你懂的 ~",
    phone: "不一定在线哦"
};

// 社交区域悬停效果
$elements.social.hover(
    function() {
        $(this).css({
            background: "rgb(0 0 0 / 25%)",
            borderRadius: "6px",
            backdropFilter: "blur(5px)"
        });
        $elements.linkText.show();
    },
    function() {
        $(this).css({
            background: "none",
            borderRadius: "6px", 
            backdropFilter: "none"
        });
        $elements.linkText.hide();
    }
);

// 单个链接提示效果
Object.entries(linkHints).forEach(([id, hint]) => {
    $(`#${id}`).hover(
        () => $elements.linkText.text(hint),
        () => $elements.linkText.text("通过这里联系我")
    );
});

// 更多页面切换
$('#switchmore').on('click', function() {
    state.shoemore = !state.shoemore;
    if (state.shoemore && $(document).width() >= 990) {
        $elements.container.addClass('mores');
        $elements.change.html("Oops&nbsp;!");
        $elements.change1.html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
    } else {
        $elements.container.removeClass('mores');
        $elements.change.html("Hello&nbsp;World&nbsp;!");
        $elements.change1.html("把空间让，敞开的窗。将时间藏，露天的黄。");
    }
});

// 更多页面关闭按钮
$elements.close.on('click', function() {
    $('#switchmore').trigger('click');
});

// 移动端菜单栏切换
$('#switchmenu').on('click', function() {
    state.switchmenu = !state.switchmenu;
    if (state.switchmenu) {
        $elements.row.addClass('menus');
        $elements.menu.html("<i class='fa-solid fa-xmark'></i>");
    } else {
        $elements.row.removeClass('menus');
        $elements.menu.html("<i class='fa-solid fa-bars'></i>");
    }
});

// 更多弹窗页面
$elements.openmore.on('click', function() {
    $elements.box.show();
    $elements.row.hide();
    $elements.more.hide();
});

$elements.closemore.on('click', function() {
    $elements.box.hide();
    $elements.row.show();
    $elements.more.show();
});

// 移动端切换功能区
$('#changemore').on('click', function() {
    state.changemore = !state.changemore;
    $elements.rightone.toggleClass('mobile', state.changemore);
});

// 监听网页宽度
const handleResize = debounce(function() {
    if (window.innerWidth >= 600) {
        $elements.row.removeClass('menus');
        $elements.menu.html("<i class='fa-solid fa-bars'></i>");
        $elements.rightone.removeClass('mobile');
    }

    if (window.innerWidth <= 990) {
        $elements.container.removeClass('mores');
        $elements.change.html("Hello&nbsp;World&nbsp;!");
        $elements.change1.html("把空间让，敞开的窗。将时间藏，露天的黄。");
        $elements.box.hide();
        $elements.row.show();
        $elements.more.show();
    }
}, 200);

window.addEventListener('resize', handleResize);

// 更多页面显示关闭按钮
$elements.more.on({
    mouseenter: () => {
        $elements.close.add($elements.openmore).addClass("show-buttons");
    },
    mouseleave: () => {
        $elements.close.add($elements.openmore).removeClass("show-buttons");
    }
});

$(".box-wrapper").on({
    mouseenter: () => {
        $elements.closemore.addClass("show-buttons");
    },
    mouseleave: () => {
        $elements.closemore.removeClass("show-buttons");
    }
});

// 屏蔽右键
document.oncontextmenu = function() {
    iziToast.show({
        timeout: 2000,
        icon: "fa-solid fa-circle-exclamation",
        message: '为了浏览体验，本站禁用右键'
    });
    return false;
};

// 初始加载
document.addEventListener('DOMContentLoaded', fetchVersion);
setTimeout(() => $('#loading-text').html("字体及文件加载可能需要一定时间"), 3000);