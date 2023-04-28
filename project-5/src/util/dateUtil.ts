import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // ES 2015

//模板用的時間
export const currentTime = (time) => {
    return dayjs(time).format("A hh:mm");
};

export const currentDate = () => {
    return dayjs(new Date()).format("YYYY-MM-DD");
};
//local所存的時間
export const unixTime = () => {
    return dayjs().valueOf() * 1000000;
};

export const currentMonth = () => {
    return dayjs(new Date()).format("YYYY-MM");
};

export const chDateFormat = (unixTime: any) => {
    return dayjs.unix(unixTime / 1000000000).format("YYYY-MM-DD");
};

export const chTimeFormat = (date: any) => {
    return (
        dayjs(date / 1000000)
            // .locale("zh-tw")
            .format("HH:mm")
    );
};
export const chFullDateFormat = (unixTime: any) => {
    return dayjs.unix(unixTime / 1000000000).format("YYYY/MM/DD HH:mm:ss");
};

export const dateFormat = (days) => {
    return dayjs(days).format("YYYY-MM-DD");
};
