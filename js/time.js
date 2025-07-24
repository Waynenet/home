// 配置对象
const config = {
    greetings: [
        { hour: 6, text: "凌晨好" },
        { hour: 9, text: "早上好" },
        { hour: 12, text: "上午好" },
        { hour: 14, text: "中午好" },
        { hour: 17, text: "下午好" },
        { hour: 19, text: "傍晚好" },
        { hour: 22, text: "晚上好" },
        { hour: 24, text: "夜深了" }
    ],
    anniversaries: {
        '5.12': "汶川大地震纪念日",
        '9.18': "九·一八事变纪念日（中国国耻日）",
        '12.13': "南京大屠杀死难者国家公祭日"
    },
    updateInterval: 1000
};

// 缓存DOM元素
const domCache = {
    greeting: document.getElementById('greeting'),
    time: document.getElementById('time'),
    dayProgress: document.querySelector('#dayProgress'),
    weekProgress: document.querySelector('#weekProgress'),
    monthProgress: document.querySelector('#monthProgress'),
    yearProgress: document.querySelector('#yearProgress'),
    change: document.querySelector('#change'),
    change1: document.querySelector('#change1')
};

// 工具函数
const utils = {
    formatTime: (num) => num < 10 ? `0${num}` : num,
    getCurrentDate: () => new Date(),
    calculatePercentage: (part, total) => (part / total * 100).toFixed(2),
    $: (selector) => document.querySelector(selector)
};

// 时间处理模块
const timeProcessor = {
    getGreeting() {
        const hour = utils.getCurrentDate().getHours();
        const greeting = config.greetings.find(g => hour < g.hour) || config.greetings[config.greetings.length - 1];
        return greeting.text;
    },
    
    updateClock() {
        const dt = utils.getCurrentDate();
        const y = dt.getFullYear();
        const mm = dt.getMonth() + 1;
        const d = dt.getDate();
        const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const day = dt.getDay();
        const h = utils.formatTime(dt.getHours());
        const m = utils.formatTime(dt.getMinutes());
        const s = utils.formatTime(dt.getSeconds());
        
        if(domCache.time) {
            domCache.time.innerHTML = `${y}&nbsp;年&nbsp;${mm}&nbsp;月&nbsp;${d}&nbsp;日&nbsp;<span class='weekday'>${weekday[day]}</span><br><span class='time-text'>${h}:${m}:${s}</span>`;
        }
    },
    
    calculateProgress() {
        const now = utils.getCurrentDate();
        const nowTime = now.getTime();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        
        // 日进度
        const todayStart = new Date(year, month, date).getTime();
        const todayPassHours = (nowTime - todayStart) / 3.6e6;
        const todayProgress = {
            passed: Math.floor(todayPassHours),
            remaining: Math.ceil(24 - todayPassHours),
            percent: utils.calculatePercentage(todayPassHours, 24)
        };
        
        // 周进度
        const weekDay = now.getDay() || 7;
        const weekProgress = {
            passed: weekDay - 1,
            remaining: 7 - weekDay + 1,
            percent: utils.calculatePercentage(weekDay - 1, 7)
        };
        
        // 月进度
        const monthDays = new Date(year, month + 1, 0).getDate();
        const monthProgress = {
            passed: date - 1,
            remaining: monthDays - (date - 1),
            percent: utils.calculatePercentage(date - 1, monthDays)
        };
        
        // 年进度
        const yearStart = new Date(year, 0, 1).getTime();
        const yearPassDays = Math.floor((nowTime - yearStart) / 8.64e7);
        const yearEnd = new Date(year + 1, 0, 1).getTime();
        const yearRemainingDays = Math.ceil((yearEnd - nowTime) / 8.64e7);
        const yearProgress = {
            passed: yearPassDays,
            remaining: yearRemainingDays,
            percent: utils.calculatePercentage(yearPassDays, yearPassDays + yearRemainingDays)
        };
        
        return { todayProgress, weekProgress, monthProgress, yearProgress };
    },
    
    updateProgressBars(progress) {
        const { todayProgress, weekProgress, monthProgress, yearProgress } = progress;
        
        const updateProgress = (element, data) => {
            if(!element) return;
            
            const passedEl = element.querySelector('.date-text1 span');
            const remainingEl = element.querySelector('.date-text2 span');
            const progressBar = element.querySelector('.progress-bar');
            
            if(passedEl) passedEl.textContent = data.passed;
            if(remainingEl) remainingEl.textContent = data.remaining;
            if(progressBar) {
                progressBar.style.width = `${data.percent}%`;
                progressBar.textContent = `${data.percent}%`;
            }
        };
        
        updateProgress(domCache.dayProgress, todayProgress);
        updateProgress(domCache.weekProgress, weekProgress);
        updateProgress(domCache.monthProgress, monthProgress);
        updateProgress(domCache.yearProgress, yearProgress);
    }
};

// 纪念日处理模块
const anniversaryProcessor = {
    checkAnniversary() {
        const date = utils.getCurrentDate();
        const mon = date.getMonth() + 1;
        const day = date.getDate();
        const key = `${mon}.${day}`;
        
        if (config.anniversaries[key]) {
            this.enableGrayscale();
            this.showAnniversaryMessage(key);
            return true;
        }
        return false;
    },
    
    enableGrayscale() {
        const style = document.createElement('style');
        style.innerHTML = 'html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}';
        document.head.appendChild(style);
    },
    
    showAnniversaryMessage(key) {
        if(domCache.change) domCache.change.innerHTML = "Silence&nbsp;in&nbsp;silence";
        if(domCache.change1) domCache.change1.innerHTML = "今天是" + config.anniversaries[key];
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                if(typeof iziToast !== 'undefined') {
                    iziToast.show({
                        timeout: 14000,
                        icon: "fa-solid fa-clock",
                        message: '今天是' + config.anniversaries[key]
                    });
                }
            }, 3800);
        });
    }
};

// 主函数
function initLifeTime() {
    // 初始化问候语
    if(domCache.greeting) {
        domCache.greeting.textContent = timeProcessor.getGreeting();
    }
    
    // 初始化时钟
    timeProcessor.updateClock();
    setInterval(timeProcessor.updateClock, config.updateInterval);
    
    // 初始化进度条
    const updateProgress = () => {
        const progress = timeProcessor.calculateProgress();
        timeProcessor.updateProgressBars(progress);
    };
    updateProgress();
    setInterval(updateProgress, config.updateInterval);
    
    // 检查纪念日
    anniversaryProcessor.checkAnniversary();
}

// 文档加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initLifeTime();
});