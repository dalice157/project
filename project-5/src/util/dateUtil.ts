import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // ES 2015

//模板用的時間
export const currentTime = (time) => {
    return dayjs(time).format("A hh:mm");
};
//local所存的時間
export const unixTime = () => {
    return dayjs().valueOf() * 1000000;
};

export const currentDate = () => {
    return dayjs(new Date()).format("YYYY-MM-DD");
};

export const currentMonth = () => {
    return dayjs(new Date()).format("YYYY-MM");
};

export const chDateFormat = (date: any) => {
    return dayjs.unix(date).format("YYYY-MM-DD");
};

export const chTimeFormat = (date: string) => {
    return dayjs(date).locale("zh-tw").format("A hh:mm");
};

export const dateFormat = (days) => {
    return dayjs(days).format("YYYY-MM-DD");
};
