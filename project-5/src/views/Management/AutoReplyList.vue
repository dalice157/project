<template>
    <div class="autoReplyList">
        <header class="autoReplyList__header">
            <n-button type="primary" color="#f9935c" text-color="#fff" @click="gotoAutoReply"
                >建立</n-button
            >
            <n-button color="#e4e4e4" text-color="#3E3E3E" @click="gotoChannelList"
                >返回活動頻道管理</n-button
            >
        </header>
        <n-data-table
            class="autoReplyList__table"
            :bordered="false"
            :scroll-x="800"
            :columns="createColumns"
            :data="data"
            :pagination="pagination"
            :bottom-bordered="false"
        >
            <template #empty>
                <n-empty description="無自動回覆訊息"> </n-empty>
            </template>
        </n-data-table>
    </div>
</template>
<script lang="ts" setup>
import { ref, h, computed, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/store/api";
import { NButton, NDataTable, NSwitch, NEmpty } from "naive-ui";
import { storeToRefs } from "pinia";
import { parse } from "date-fns";
import { currentTime, dateFormat } from "@/util/dateUtil";

//api atroe
const apiStore = useApiStore();
const { autoReplyMsgList, inquireAutoReplyMsg, editAutoReplyMsg } = apiStore;
const { autoReplyList } = storeToRefs(apiStore);
//router 資訊
const router = useRouter();
const route = useRoute();

onMounted(() => {
    autoReplyMsgList(route.query.eventID);
});
const goToEditChannel = (eventID, autoID) => {
    inquireAutoReplyMsg(eventID, autoID);
};
const pagination = {
    pageSize: 6,
};

const createColumns = [
    {
        title: "標題",
        key: "subject",
        align: "center",
        width: 100,
    },
    {
        title: "關鍵字",
        key: "keyword",
        align: "center",
        width: 100,
        render(row) {
            let str = "";
            const keyWordArr = ref([]);
            keyWordArr.value = JSON.parse(row.keyword);
            keyWordArr.value.forEach((item) => {
                str += `${item},`;
            });
            str = str.slice(0, -1);
            return h("p", str);
        },
    },
    {
        title: "回應內容",
        key: "msg",
        render(row, index) {
            const parseMsg = JSON.parse(row.msg);
            const msgLength = parseMsg.length;
            let str = "";
            if (parseMsg[0].janusMsg.msgType === 1) {
                str += parseMsg[0].janusMsg.msgContent;
            } else if (parseMsg[0].janusMsg.msgType === 6) {
                str += parseMsg[0].janusMsg.format.ShowName;
            }
            return h(
                "p",
                {
                    class: "link hover",
                    onClick: () => goToEditChannel(row.eventID, row.autoID),
                },
                `${str}(${msgLength})`
            );
        },
    },
    {
        title: "指定日期時間",
        key: "time",
        align: "center",
        render(row, index) {
            // 日期顯示
            let strDate = "";
            const dateRange = computed(() => {
                if (row.startDate === "-28800000000") {
                    strDate += "無指定日期,";
                } else {
                    strDate += `${dateFormat(row.startDate / 1000)} ~ ${dateFormat(
                        row.endDate / 1000
                    )},`;
                }
                return strDate;
            });
            // 星期顯示
            let strWeekday = "星期";
            let weekDayArr = row.weekday.split("");
            const chineseWeekday = computed(() => {
                if (weekDayArr.length === 7 || weekDayArr.length === 0) {
                    return (strWeekday = "無指定星期");
                }
                if (row.weekday.length < 7 && row.weekday.length > 0) {
                    const weekdayObj = {
                        1: "一,",
                        2: "二,",
                        3: "三,",
                        4: "四,",
                        5: "五,",
                        6: "六,",
                        7: "日,",
                    };

                    weekDayArr.forEach((item) => {
                        strWeekday += weekdayObj[item];
                    });
                }

                return strWeekday;
            });
            // 時間區段顯示
            const startTime = computed(() => {
                if (row.statTime === "1652313600000000") {
                    return "";
                } else {
                    return currentTime(row.statTime / 1000);
                }
            });
            const endTime = computed(() => {
                if (row.endTime === "1652313600000000") {
                    return "";
                } else {
                    return currentTime(row.endTime / 1000);
                }
            });
            const noTimeText = computed(() => {
                if (startTime.value === "") {
                    return "無指定時間區段";
                } else {
                    return " ~ ";
                }
            });
            return h(
                "p",
                {
                    class: "link",
                },
                `
                ${dateRange.value}\n
                ${chineseWeekday.value}\n
                ${startTime.value}${noTimeText.value}${endTime.value}

                `
            );
        },
    },
    {
        title: "狀態",
        key: "status",
        align: "center",
        render(row, index) {
            // console.log("列表狀態開關", row.status);
            return h(NSwitch, {
                checkedValue: "1",
                uncheckedValue: "0",
                defaultValue: row.status,
                onUpdateValue: (value) => {
                    row.status = value;
                    // console.log("update status", value);
                    console.log("row data", row);
                    const innerData = {
                        subject: row.subject === "" ? "" : row.subject,
                        status: row.status,
                        startDate: row.startDate === "-28800000000" ? 0 : row.startDate * 1000,
                        endDate: row.endDate === "-28800000000" ? 0 : row.endDate * 1000,
                        startTime: row.statTime === "1652313600000000" ? 0 : row.statTime * 1000,
                        endTime: row.endTime === "1652313600000000" ? 0 : row.endTime * 1000,
                        keyWord: row.keyword,
                        msg: JSON.parse(row.msg),
                        weekday: row.weekday === "" ? 0 : row.weekday,
                        eventID: row.eventID,
                        autoID: row.autoID,
                    };
                    editAutoReplyMsg(innerData);
                },
            });
        },
    },
] as any;
const data = computed(() => {
    return autoReplyList.value;
});
watchEffect(() => {
    // console.log("data", data.value);
});

const gotoAutoReply = () => {
    route.params.id
        ? router.push(
              `/manage/${route.params.id}/activitySetting/addAutoReply?eventID=${route.query.eventID}`
          )
        : router.push(`/manage/activitySetting/addAutoReply?eventID=${route.query.eventID}`);
};
const gotoChannelList = () => {
    route.params.id
        ? router.push(`/manage/${route.params.id}/activitySetting`)
        : router.push(`/manage/activitySetting`);
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.autoReplyList__table {
    .n-data-table-wrapper {
        background-color: #fff;
    }
}
.autoReplyList__table {
    &.n-data-table .n-data-table-thead {
        background-color: $primary-4;
    }
    &.n-data-table .n-data-table-th {
        background-color: $primary-4;
        font-weight: bold;
        color: $gray-1;
        border: none;
        &.deduction {
            color: $danger;
        }
    }
    &.n-data-table .n-data-table-tr:nth-child(even) {
        background: $primary-4;
    }
    &.n-data-table .n-data-table-td {
        background: none;
        border: none;
        padding: 15px;
        vertical-align: middle;
    }
    &.n-data-table .n-data-table-tr:hover {
        background: $primary-4;
    }
    &.n-data-table .n-data-table-tr:hover .n-data-table-td {
        background: none;
    }
    .deduction {
        color: $danger;
    }
    .link {
        color: $gray-1;
        &:hover {
            color: $primary-1;
        }
        &:visited {
            color: $primary-1;
        }
    }
    .hover {
        cursor: pointer;
    }
    .subject {
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    .time {
        width: 200px;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        // overflow: hidden;
    }
}
.content {
    .n-layout-scroll-container {
        background-color: #fff;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.autoReplyList {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    min-height: calc(100vh - 140px);
    &__header {
        text-align: right;
        margin-bottom: 10px;
        button + button {
            margin-left: 8px;
        }
    }
}
</style>
