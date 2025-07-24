function initLifeTime() {
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 6) return "凌晨好";
        if (hour < 9) return "早上好";
        if (hour < 12) return "上午好";
        if (hour < 14) return "中午好";
        if (hour < 17) return "下午好";
        if (hour < 19) return "傍晚好";
        if (hour < 22) return "晚上好";
        return "夜深了";
    }

    function updateLifeTime() {
        const now = new Date();
        const nowTime = now.getTime();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        
        // 日进度
        const todayStart = new Date(year, month, date).getTime();
        const todayPassHours = (nowTime - todayStart) / 3.6e6; // 毫秒转小时
        const todayRemainingHours = 24 - todayPassHours;
        const todayPassPercent = (todayPassHours / 24) * 100;
        
        // 周进度
        const weekDay = now.getDay() || 7; // 0(周日)转换为7
        const weekPassPercent = ((weekDay - 1) / 7) * 100;
        const weekRemainingDays = 7 - weekDay + 1;
        
        // 月进度
        const monthDays = new Date(year, month + 1, 0).getDate();
        const monthPassDays = date - 1;
        const monthPassPercent = (monthPassDays / monthDays) * 100;
        const monthRemainingDays = monthDays - monthPassDays;
        
        // 年进度
        const yearStart = new Date(year, 0, 1).getTime();
        const yearPassDays = Math.floor((nowTime - yearStart) / 8.64e7);
        const yearEnd = new Date(year + 1, 0, 1).getTime();
        const yearRemainingDays = Math.ceil((yearEnd - nowTime) / 8.64e7);
        const yearPassPercent = (yearPassDays / (yearPassDays + yearRemainingDays)) * 100;
        
        // 更新DOM
        $('#dayProgress .date-text1 span').text(Math.floor(todayPassHours));
        $('#dayProgress .date-text2 span').text(Math.ceil(todayRemainingHours));
        $('#dayProgress .progress-bar').css('width', `${Math.floor(todayPassPercent)}%`).text(`${Math.floor(todayPassPercent)}%`);
        
        $('#weekProgress .date-text1 span').text(weekDay - 1);
        $('#weekProgress .date-text2 span').text(weekRemainingDays);
        $('#weekProgress .progress-bar').css('width', `${Math.floor(weekPassPercent)}%`).text(`${Math.floor(weekPassPercent)}%`);
        
        $('#monthProgress .date-text1 span').text(monthPassDays);
        $('#monthProgress .date-text2 span').text(monthRemainingDays);
        $('#monthProgress .progress-bar').css('width', `${Math.floor(monthPassPercent)}%`).text(`${Math.floor(monthPassPercent)}%`);
        
        $('#yearProgress .date-text1 span').text(yearPassDays);
        $('#yearProgress .date-text2 span').text(yearRemainingDays);
        $('#yearProgress .progress-bar').css('width', `${Math.floor(yearPassPercent)}%`).text(`${Math.floor(yearPassPercent)}%`);
    }

    updateLifeTime();
    setInterval(updateLifeTime, 1000);
    
    // 问候语
    document.getElementById('greeting').textContent = getGreeting();
}

// 初始化
$(document).ready(initLifeTime);