function init_life_time() {
    function getAsideLifeTime() {
        /* 当前时间戳 */
        let nowDate = Date.now();
        /* 今天开始时间戳 */
        let todayStartDate = new Date(new Date().toLocaleDateString()).getTime();
        /* 今天已经过去的时间 */
        let todayPassHours = (nowDate - todayStartDate) / 1000 / 60 / 60;
        /* 今天剩余的时间 */
        let todayRemainingHours = 24 - todayPassHours + 1;
        /* 今天已经过去的时间比 */
        let todayPassHoursPercent = (todayPassHours / 24) * 100;
        $('#dayProgress .date-text1 span').html(parseInt(todayPassHours));
        $('#dayProgress .date-text2 span').html(parseInt(todayRemainingHours));
        $('#dayProgress .progress .progress-bar').css('width', parseInt(todayPassHoursPercent) + '%');
        $('#dayProgress .progress .progress-bar').html(parseInt(todayPassHoursPercent) + '%');
        /* 当前周几 */
        let weeks = {
            0: 6,
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5
        };
        let weekDay = weeks[new Date().getDay()];
        let weekDayPassPercent = (weekDay / 7) * 100;
        let weekDayRemaining = 7 - weekDay;
        $('#weekProgress .date-text1 span').html(weekDay);
        $('#weekProgress .date-text2 span').html(weekDayRemaining);
        $('#weekProgress .progress .progress-bar').css('width', parseInt(weekDayPassPercent) + '%');
        $('#weekProgress .progress .progress-bar').html(parseInt(weekDayPassPercent) + '%');
        /* 月 */
        let year = new Date().getFullYear();
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let monthAll = new Date(year, month, 0).getDate();
        let monthDate = date - 1;
        let monthRemaining = monthAll - monthDate;
        let monthPassPercent = (monthDate / monthAll) * 100;
        $('#monthProgress .date-text1 span').html(monthDate);
        $('#monthProgress .date-text2 span').html(monthRemaining);
        $('#monthProgress .progress .progress-bar').css('width', parseInt(monthPassPercent) + '%');
        $('#monthProgress .progress .progress-bar').html(parseInt(monthPassPercent) + '%');
        /* 年 */
        let startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        let yearDate = Math.floor((nowDate - startOfYear) / 86400000);
        let now = new Date();                      // 获取当前时间对象
        let currentYear = now.getFullYear();       // 获取当前年份
        let endOfYear = new Date(currentYear + 1, 0, 1);  // 明年1月1日（今年最后一天+1天）
        let remainingMs = endOfYear - now;         // 剩余毫秒数
        let remainingDays = Math.ceil(remainingMs / 86400000); // 转换为天数
        let yearPass = (yearDate / (yearDate + remainingDays)) * 100
        $('#yearProgress .date-text1 span').html(yearDate);
        $('#yearProgress .date-text2 span').html(remainingDays);
        $('#yearProgress .progress .progress-bar').css('width', parseInt(yearPass) + '%');
        $('#yearProgress .progress .progress-bar').html(parseInt(yearPass) + '%');
    }
    getAsideLifeTime();
    setInterval(() => {
        getAsideLifeTime();
    }, 1000);
}
init_life_time()

now = new Date(), hour = now.getHours()
if (hour < 6) {
    var hello = "凌晨好";
} else if (hour < 9) {
    var hello = "早上好";
} else if (hour < 12) {
    var hello = "上午好";
} else if (hour < 14) {
    var hello = "中午好";
} else if (hour < 17) {
    var hello = "下午好";
} else if (hour < 19) {
    var hello = "傍晚好";
} else if (hour < 22) {
    var hello = "晚上好";
} else {
    var hello = "夜深了";
}