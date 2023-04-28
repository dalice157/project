// title顯示是否未讀
$(function () {
    // var title = $("title").html();
    // var unReadAmount = '';
    var tempTitle = "互動回覆簡訊";
    var flashFlag = true;
    setInterval(function () {
        console.log("是否有未讀訊息: ", window.hasUnread);
        if (window.hasUnread) {
            setInterval(function () {
                if (flashFlag) {
                    tempTitle = "您有未讀訊息";
                    flashFlag = !flashFlag;
                } else {
                    tempTitle = "\u200E";
                    flashFlag = !flashFlag;
                }
            }, 500);
        } else {
            tempTitle = "互動回覆簡訊";
        }
        // unReadAmount = window.hasUnread ? '您有未讀訊息' : '';
        // // tempTitle = unReadAmount;
        // if (showFlag) {
        //     tempTitle = unReadAmount;
        //     showFlag = !showFlag;
        // } else {
        //     // tempTitle = title;
        //     showFlag = !showFlag;
        // }
        $("title").html(tempTitle);
    }, 10000);
});
