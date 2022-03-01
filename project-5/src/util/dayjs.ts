import dayjs from "dayjs"; // ES 2015
import "dayjs/locale/zh-tw"; // ES 2015
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.locale("zh-tw"); // 全局使用
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("zh-tw", {
    meridiem: (hour: number) => {
        return hour > 12 ? "下午" : "上午";
    },
});

export default function filtertime(value: any) {
    return dayjs().to(dayjs(value));
}
