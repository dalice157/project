import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // ES 2015

export const currentTime = () => {
    return dayjs(new Date()).format("A hh:mm");
};

export const currentDate = () => {
    return dayjs(new Date()).format("YYYY-MM-DD");
};

export const currentMonth = () => {
    return dayjs(new Date()).format("YYYY-MM");
}


export const chDateFormat = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD");
};

export const chTimeFormat = (date: string) => {
    return dayjs(date).locale("zh-tw").format("A hh:mm");
};
