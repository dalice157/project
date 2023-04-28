<template>
    <div id="sms_inquire_wrap">
        <div class="sms_inquire">
            <!-- <div class="inquire_title">
                <div class="inquire">
                    <h2>查詢發送紀錄</h2>
                    <n-input
                        class="sms_search"
                        v-model:value="search"
                        type="text"
                        placeholder="搜尋"
                    >
                        <template #prefix>
                            <img :src="searchIcon" alt="search" />
                        </template>
                    </n-input>
                </div>
            </div>
            <n-divider class="sms_divider" /> -->
            <n-form class="inquireCondition" :model="model" :rules="rules" ref="formRef">
                <n-form-item path="searchSend_box">
                    <n-checkbox-group v-model:value="model.searchSend_box">
                        <div class="inquireCondition1">
                            <div class="timeInquire">
                                <n-checkbox value="box_time" disabled>依發送時間查詢</n-checkbox>
                                <!-- :default-calendar-start-time="dayjs().startOf("month").valueOf()" -->
                                <n-form-item path="searchSend_date">
                                    <n-date-picker
                                        class="datePicker"
                                        v-model:value="model.searchSend_date"
                                        type="daterange"
                                        clearable
                                        size="small"
                                        :is-date-disabled="dateTimeLimit"
                                    />
                                </n-form-item>
                                <p>(可查詢三個月內的發送紀錄)</p>
                            </div>
                            <div class="phoneNumberInquire">
                                <n-checkbox value="box_phone">依接收門號查詢</n-checkbox>
                                <n-form-item path="searchSend_phone">
                                    <n-input
                                        class="input"
                                        v-model:value="model.searchSend_phone"
                                        placeholder=""
                                        size="small"
                                    >
                                    </n-input>
                                </n-form-item>
                            </div>
                            <n-button @click="onSmsSubmit" class="inquireButton">查詢</n-button>
                            <n-button
                                v-show="data.length !== 0 || detailData.length !== 0"
                                class="exportEXCEL"
                                @click="exportEXCEL('0')"
                                >匯出EXCEL</n-button
                            >
                        </div>
                        <p style="color: red" v-show="temporaryNotice">
                            因系統架構調整，自2023/1/10
                            以前將無法搜尋發送紀錄，2023/1/11起的發送紀錄，將可正常查詢。不便之處，敬請見諒！
                        </p>
                        <div class="inquireCondition2">
                            <div class="statusInquire">
                                <n-checkbox value="box_status">依接收狀態查詢</n-checkbox>
                                <n-form-item path="searchSend_send_status">
                                    <ul
                                        class="status_list"
                                        v-if="
                                            model.searchSend_box &&
                                            model.searchSend_box.includes('box_status')
                                        "
                                    >
                                        <li
                                            v-for="status in statusList"
                                            :class="{ active: status.isSelect }"
                                            :key="status.id"
                                            @click="addStatus(status.id)"
                                        >
                                            {{ status.text }}
                                        </li>
                                    </ul>
                                </n-form-item>
                            </div>
                        </div>
                    </n-checkbox-group>
                </n-form-item>
            </n-form>
            <!-- 外層一般 table -->
            <n-data-table
                v-if="tableInformation === 'normal'"
                class="sms_table"
                :bordered="false"
                :max-height="350"
                :columns="createColumns({ cancelReservationPopUp, filterDetailData })"
                :data="data"
                :pagination="outerNormalTablePagination"
                :bottom-bordered="false"
                :scroll-x="1800"
                :scrollbar-props="{ trigger: 'none' }"
            />
            <!-- 外層詳細 table -->
            <n-data-table
                v-else
                class="sms_table"
                remote
                :bordered="false"
                :scroll-x="800"
                :scrollbar-props="{ trigger: 'none' }"
                :max-height="350"
                :columns="detailDataPopUpColumns()"
                :data="detailData"
                :pagination="outerDetailTablePagination"
                :bottom-bordered="false"
                @update:page="outerTableHandlePageChange"
            />
        </div>
    </div>
    <!-- 取消預約談窗 -->
    <teleport to="body" v-if="cancelReservationPopUpIsOpen">
        <div class="mask">
            <div class="dataTable">
                <div class="cancelReservationTitle">
                    <div class="delete" @click="deleteReservationPopUp">刪除已預約的簡訊紀錄</div>
                    <img
                        class="cancelReservationCloseIcon"
                        :src="closeIcon"
                        alt="關閉"
                        @click="cancelReservationPopUpIsOpen = !cancelReservationPopUpIsOpen"
                    />
                </div>
                <n-data-table
                    class="sms_table"
                    :bordered="false"
                    :scroll-x="800"
                    :columns="cancelReservationPopUpColumns()"
                    :data="cancelReservationPopUpData"
                    :bottom-bordered="false"
                    v-model:checked-row-keys="pickUpkey"
                />
            </div>
        </div>
    </teleport>
    <!-- 刪除預約訊息 彈窗 -->
    <teleport to="body" v-if="confirmCancel">
        <div class="mask1">
            <div class="deleteChannelPopUp">
                <div class="deleteChannelConfirm">您確定要刪除此預約訊息!!</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click="cancel">取消</div>
                    <div type="button" class="confirm" @click="deleteReservation">確定</div>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 詳細資料彈窗 -->
    <teleport to="body" v-if="detailDataPopUpIsOpen">
        <div class="mask">
            <div class="dataTable">
                <div class="detailDataTitle">
                    <img
                        class="detailDataCloseIcon"
                        :src="closeIcon"
                        alt="關閉"
                        @click="closeDetailDataPopUp"
                    />
                    <n-scrollbar
                        style="
                            width: 50%;
                            max-height: 163px;
                            min-height: 163px;
                            border: 1px solid #aeaeae;
                        "
                    >
                        <div class="detailDataTime">
                            <h1>發送時間 : {{ chFullDateFormat(basicInformation.sendTime) }}</h1>
                            <n-divider dashed />
                            <h1>訊息主旨 : {{ basicInformation.subject }}</h1>
                            <n-divider dashed />
                            <h1>發送內容 : {{ basicInformation.content }}</h1>
                        </div>
                    </n-scrollbar>
                    <div class="detailDataAnalysis">
                        <h1>收訊分析:</h1>
                        <n-divider dashed />
                        <h1>
                            本次簡訊內文發出
                            <span>{{ pointCalculation(basicInformation.content).smsCount }}</span>
                            則 ; 共發出 <span>{{ basicInformation.count }}</span> 通 、
                            成功接收<span> {{ basicInformation.successReceive }} </span
                            >通，發送成功率
                            <span style="color: blue"
                                >{{
                                    (
                                        basicInformation.successReceive / basicInformation.count
                                    ).toFixed(2) * 100
                                }}
                                %
                            </span>
                            。
                        </h1>
                        <h1>
                            點擊回覆連結共
                            <span>{{ basicInformation.click }}</span> 通，連結點擊率
                            <span style="color: blue"
                                >{{
                                    basicInformation.successReceive !== 0
                                        ? (
                                              basicInformation.click /
                                              basicInformation.successReceive
                                          ).toFixed(2) * 100
                                        : 0
                                }}
                                % </span
                            >(點擊連結回覆通數/成功接收)
                        </h1>
                    </div>
                </div>
                <n-divider />
                <div style="display: flex; flex-direction: column">
                    <n-button
                        class="exportEXCEL"
                        @click="
                            exportEXCEL(
                                isTable === false ? '3' : showMoreDetailData === true ? '2' : '1',
                                basicInformation.bid
                            )
                        "
                        >匯出EXCEL</n-button
                    >
                    <n-data-table
                        v-if="isTable === true"
                        class="sms_table"
                        remote
                        :bordered="false"
                        :max-height="350"
                        :scroll-x="800"
                        :columns="
                            showMoreDetailData === true
                                ? moreDetailDataPopUpColumns({ watchContent })
                                : detailDataPopUpColumns()
                        "
                        :data="detailData"
                        :row-props="rowProps"
                        :pagination="innerTablePagination"
                        :bottom-bordered="false"
                        @update:page="innerTableHandlePageChange"
                    />
                    <n-scrollbar
                        style="max-height: 250px; min-height: 250px; border: 1px solid #aeaeae"
                        v-else
                    >
                        <div class="unclicked">
                            <p>{{ unclickedArr }}</p>
                        </div>
                    </n-scrollbar>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 詳細對話內容彈窗 -->
    <teleport to="body" v-if="chatContentPopUp">
        <div class="mask">
            <div class="wrapper">
                <div class="header">
                    <p>{{ chatContentTitle }}</p>
                </div>
                <img
                    class="detailDataCloseIcon"
                    :src="closeIcon"
                    alt="關閉"
                    @click="closeChatContentPopUp"
                />
                <n-scrollbar style="max-height: 450px">
                    <div class="detailChatContent">
                        <div
                            class="chatContent"
                            v-for="(chat, index) in chatContent"
                            :key="chat.config.id"
                        >
                            <div
                                v-if="
                                    index === 0 ||
                                    (index > 0 &&
                                        chDateFormat(chat.time) !==
                                            chDateFormat(chatContent[index - 1].time))
                                "
                            >
                                【{{ chDateFormat(chat.time) }}】
                            </div>
                            <div class="chat">
                                <div class="chatSender">
                                    <p>【{{ chTimeFormat(chat.time) }}】</p>
                                    <p
                                        v-if="chat.sender === 0 && chat.config.isSMS"
                                        style="color: red"
                                    >
                                        {{ "簡訊發送" }} :
                                    </p>
                                    <p
                                        v-if="chat.sender === 0 && chat.config.isWelcomeMsg"
                                        style="color: orange"
                                    >
                                        {{ "系統訊息" }} :
                                    </p>
                                    <p
                                        v-if="
                                            chat.sender === 0 &&
                                            !chat.config.isSMS &&
                                            !chat.config.isWelcomeMsg
                                        "
                                        style="color: Blue"
                                        :class="{
                                            changeColor: chat.change === true,
                                        }"
                                    >
                                        {{ chat.config.userName }} :
                                    </p>
                                    <p v-if="chat.sender === 1">{{ "使用者" }} :</p>
                                </div>
                                <p>&ensp;{{ chat.msgContent }}</p>
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>
        </div>
    </teleport>
    <!-- loading 彈窗 -->
    <Loading :isLoading="inquireLoading" />
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script lang="ts" setup>
import { reactive, ref, h, computed, watchEffect, watch, onBeforeUnmount } from "vue";
import {
    NForm,
    NFormItem,
    NDatePicker,
    NInput,
    NButton,
    NTag,
    NCheckboxGroup,
    NCheckbox,
    NDataTable,
    NDivider,
    NRadio,
    NScrollbar,
} from "naive-ui";
import axios from "axios";
import { useApiStore } from "@/store/api";
import dayjs from "dayjs";
import { chFullDateFormat, chDateFormat, chTimeFormat } from "@/util/dateUtil";
import { pointCalculation } from "@/util/commonUtil";
import config from "@/config/config";

import searchIcon from "@/assets/Images/manage/search.svg";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import { storeToRefs } from "pinia";
import Loading from "@/components/LoadingPage.vue";
import AlertPopUp from "@/components/AlertPopUp.vue";

//store
const apiStore = useApiStore();
const { inquireShortMessage, deleteReservationShortMsg, excelDownload, viewContent } = apiStore;
const {
    inquireSMSShortMessageList,
    tableInformation,
    pageCount,
    timeInterval,
    inquireLoading,
    chatContent,
} = storeToRefs(apiStore);

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

const eid = ref(localStorage.getItem("eid"));
const accountID = ref(localStorage.getItem("accountID"));
const temporaryNotice = ref(true);
//v-model
const search = ref("");
const formRef = ref(null);
const model = reactive({
    searchSend_box: ["box_time"],
    searchSend_phone: null,
    searchSend_date: [
        dayjs().subtract(1, "month").startOf("date").valueOf(),
        dayjs().startOf("date").valueOf(),
    ],
    searchSend_send_status: null,
}) as any;
//限制不能選未來時間
const dateTimeLimit = (ts) => {
    // return ts > dayjs().startOf("day").valueOf() || ts < dayjs().subtract(3, "month");
    return ts > dayjs().startOf("day").valueOf() || ts < dayjs("2023-01-11");
};
// 查詢狀態列表
const statusList = ref([
    {
        id: 0,
        text: "傳送成功",
        val: "0",
        isSelect: false,
    },
    {
        id: 1,
        text: "傳送中",
        val: "1",
        isSelect: false,
    },
    {
        id: 2,
        text: "預約",
        val: "2",
        isSelect: false,
    },
    {
        id: 3,
        text: "取消預約",
        val: "3",
        isSelect: false,
    },
    {
        id: 4,
        text: "傳送失敗",
        val: "4",
        isSelect: false,
    },
    // {
    //     id: 5,
    //     text: "格式錯誤",
    //     val: "5",
    //     isSelect: false,
    // },
    // {
    //     id: 6,
    //     text: "空號",
    //     val: "6",
    //     isSelect: false,
    // },
    // {
    //     id: 7,
    //     text: "逾時",
    //     val: "7",
    //     isSelect: false,
    // },
]);
const addStatus = (id) => {
    statusList.value.forEach((status) => {
        if (status.id === id) {
            status.isSelect = !status.isSelect;
        } else {
            status.isSelect = false;
        }
    });
    model.searchSend_send_status = statusList.value
        .filter((filterItem) => {
            return filterItem.isSelect;
        })
        .map((item) => item.val);
};

//驗證規則
const rules = {
    searchSend_date: {
        type: "array",
        validator(rule: any, value: any) {
            if (!value) {
                return new Error("請輸入時間區間");
            }
        },
    },
    searchSend_phone: {
        type: "string",
        validator(rule: any, value: any) {
            if (model.searchSend_box.includes("box_phone") && !value) {
                return new Error("請輸入門號");
            } else if (
                model.searchSend_box.includes("box_phone") &&
                !/(^[+]?[0-9]{10,15}$)|(^$)/.test(value)
            ) {
                return new Error("請填寫正確格式的行動電話");
            }
        },
    },
    searchSend_send_status: {
        type: "array",
        validator(rule: any, value: any) {
            if (model.searchSend_box.includes("box_status") && (!value || value.length === 0)) {
                return new Error("請輸入接收狀態");
            }
        },
    },
};
// 判斷第一層 table 顯示的 data 及 column
watch(
    tableInformation,
    (newVal, oldVal) => {
        if (newVal === "detail") {
            detailData.value = [];
            detailData.value = data.value;
            outerDetailTablePagination.pageCount = Math.ceil(pageCount.value / 10);
        }
    },
    { deep: true }
);
// 查詢按鈕
const onSmsSubmit = (e: any) => {
    temporaryNotice.value = false;
    e.preventDefault();
    inquireLoading.value = true;
    formRef.value.validate((errors) => {
        if (!errors) {
            const transformDate = ref([]);
            model.searchSend_date[1] += 86400000;
            transformDate.value = model.searchSend_date.map((item) => {
                return item * 1000000;
            });
            inquireShortMessage(
                "0",
                transformDate.value,
                model.searchSend_box.includes("box_phone") ? model.searchSend_phone : null,
                model.searchSend_box.includes("box_status") ? model.searchSend_send_status : null,
                model.searchSend_box.includes("box_phone") ||
                    model.searchSend_box.includes("box_status")
                    ? "1"
                    : null
            );
            outerDetailTablePagination.page = 1;
            model.searchSend_date[1] -= 86400000;
        } else {
            inquireLoading.value = false;
        }
    });
};
//匯出excel
const exportEXCEL = (format, bid?) => {
    let postObject;
    if (format === "0") {
        postObject = {
            type: "0",
            start: Number(model.searchSend_date[0] + "000000"),
            end: Number(model.searchSend_date[1] + "000000"),
            format,
            bid,
            mobile: model.searchSend_box.includes("box_phone") ? model.searchSend_phone : "",
            status: model.searchSend_box.includes("box_status") ? model.searchSend_send_status : "",
        };
        console.log("第一層 excel post 資料", postObject);
    } else if (format === "1" || format === "2") {
        postObject = {
            type: "0",
            start: Number(model.searchSend_date[0] + "000000"),
            end: Number(model.searchSend_date[1] + "000000"),
            format,
            bid,
            status: basicInformation.value.status !== 5 ? basicInformation.value.status : -1,
        };
    } else {
        postObject = {
            type: "0",
            start: Number(model.searchSend_date[0] + "000000"),
            end: Number(model.searchSend_date[1] + "000000"),
            format,
            bid,
            status: basicInformation.value.status !== 5 ? basicInformation.value.status : -1,
            mobile: unclickedArr.value,
        };
        console.log("第二層 excel post 資料", postObject);
    }
    postObject.end += 86400000000000;
    excelDownload(postObject);
};
// 取消預約傳送
const cancelReservationPopUpIsOpen = ref(false);
const confirmCancel = ref(false);
const cancelReservationPopUp = (rowData) => {
    // console.log("rowData", rowData);
    if (rowData.tag[2] >= 1) {
        cancelReservationPopUpIsOpen.value = !cancelReservationPopUpIsOpen.value;
        cancelReservationPopUpData.value = [rowData];
        cancelReservationPopUpData.value = cancelReservationPopUpData.value.map((item, index) => {
            return {
                ...item,
                key: index,
            };
        });
        // 直接帶入選中資料
        pickUpData.value = cancelReservationPopUpData.value;
        // console.log("預約傳送點進去代的資料", pickUpData.value);
    } else {
        alertMessage.value = "無預約傳送訊息,無法取消!!!";
    }
};
//點進去popup帶的資料
const cancelReservationPopUpData = ref([]);
//選中的資料
const pickUpData = ref([]);
const pickUpkey = ref([0, 1]);
//確定刪除彈窗
const deleteReservationPopUp = () => {
    if (pickUpData.value.length !== 0) {
        confirmCancel.value = !confirmCancel.value;
    } else {
        alertMessage.value = "請選取要刪除的訊息!!!";
    }
};
//取消刪除簡訊
const cancel = () => {
    confirmCancel.value = !confirmCancel.value;
};
//確定刪除簡訊
const deleteReservation = () => {
    deleteReservationShortMsg("0", pickUpData.value[0]);
    confirmCancel.value = false;
    cancelReservationPopUpIsOpen.value = false;
};
const basicInformation = ref({});
// status 5 顯示 table 須為何種 column
const showMoreDetailData = ref(false);
// status 6 顯示開關
const isTable = ref(true);
const unclickedArr = ref([]);
//第二層 table api
const innerTableGetData = (status, batchId, page) => {
    const getToken = localStorage.getItem("access_token");
    const fd = new FormData();
    fd.append("start", timeInterval.value[0]);
    fd.append("end", timeInterval.value[1]);
    fd.append("type", "0");
    fd.append("status", status);
    fd.append("batchId", batchId);
    fd.append("page", page);
    axios({
        method: "post",
        url: `${config.serverUrl}/v1/msgdetail`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            console.log("第二層table res", res.data.list);
            detailData.value = res.data.list;
            isTable.value = true;
            if (status === 5) {
                showMoreDetailData.value = true;
            }
            if (status === 6) {
                isTable.value = false;
                unclickedArr.value = res.data.list.reduce((arr, item) => {
                    arr.push(item.mobile);
                    return arr;
                }, []);
                unclickedArr.value = unclickedArr.value.toString();
            }
            innerTablePagination.pageCount = Math.ceil(basicInformation.value.showCount / 10);
            innerTablePagination.page = Number(page);
            detailDataPopUpIsOpen.value = true;
            setTimeout(() => {
                inquireLoading.value = false;
            }, 300);
        })
        .catch((err) => {
            console.log("第二層table err");
            setTimeout(() => {
                inquireLoading.value = false;
            }, 300);
        });
};
// 過濾第一層資料到第二層
const filterDetailData = (status, row, showCount, Information) => {
    //有數字才顯示table
    if (showCount >= 1) {
        basicInformation.value = Information;
        basicInformation.value.status = status;
        basicInformation.value.showCount = Number(showCount);
        innerTableGetData(status, row.batch, "1");
    } else {
        alertMessage.value = "無詳細資料可查尋!!";
    }
};
// 第一層資料
const data = computed(() => {
    return inquireSMSShortMessageList.value;
});
// 查看詳細資料
const detailDataPopUpIsOpen = ref(false);
//詳細資料彈窗 關閉
const closeDetailDataPopUp = () => {
    detailDataPopUpIsOpen.value = false;
    showMoreDetailData.value = false;
};
const detailData = ref([]);
//查看內容 彈窗開關
const chatContentPopUp = ref(false);
const closeChatContentPopUp = () => {
    detailDataPopUpIsOpen.value = true;
    chatContentPopUp.value = false;
};
const chatContentTitle = ref("");
//查看內容
const watchContent = (row) => {
    // console.log("chatContent row", row);
    chatContentTitle.value = row.name !== "" ? row.name : row.mobile;
    viewContent(row.chatroomID);
    detailDataPopUpIsOpen.value = false;
    chatContentPopUp.value = true;
};

// ------------------------------------------- table column ---------------------------------------------
// 一般資料 table column
const createColumns = ({ cancelReservationPopUp, filterDetailData }) =>
    [
        {
            title: "編號",
            key: "id",
            align: "center",
            width: 100,
            render(row, index) {
                return h("p", {}, index + 1);
            },
        },
        {
            title: "發送時間",
            key: "time",
            align: "center",
            width: 110,
            render(row, index) {
                return h("p", {}, dayjs(row.time / 1000000).format("YYYY/MM/DD"));
            },
        },
        {
            title: "訊息主旨",
            key: "subject",
            align: "center",
            width: 110,
            render(row, index) {
                return h("p", {}, row.subject);
            },
        },
        {
            title: "活動頻道",
            key: "event",
            align: "center",
            width: 110,
            render(row, index) {
                return h("p", {}, row.event);
            },
        },
        {
            title: "發送簡訊內容",
            key: "text",
            align: "center",
            width: 200,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: " content scroll",
                    },
                    row.text
                );
            },
        },
        {
            title: "發送通數",
            key: "count",
            align: "center",
            width: 80,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(-1, row, row.count, {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.count
                );
            },
        },
        {
            title: "成功接收",
            key: "tag",
            align: "center",
            width: 80,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(0, row, row.tag[0], {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.tag[0]
                );
            },
        },
        {
            title: "成功率",
            key: "successfulPercent",
            align: "center",
            width: 80,
            render(row, index) {
                return h("p", {}, (row.tag[0] / row.count).toFixed(2) * 100 + "%");
            },
        },
        {
            title: "傳送中通數",
            key: "tag",
            align: "center",
            width: 100,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(1, row, row.tag[1], {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.tag[1]
                );
            },
        },
        {
            title: "預約傳送通數",
            key: "tag",
            align: "center",
            width: 110,
            render(row, index) {
                return h(
                    "a",
                    {
                        class: "link clickable hover",
                        onClick: () => cancelReservationPopUp(row),
                    },
                    row.tag[2]
                );
            },
        },
        {
            title: "預約取消通數",
            key: "tag",
            align: "center",
            width: 110,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(3, row, row.tag[3], {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.tag[3]
                );
            },
        },
        {
            title: "收訊失敗",
            key: "tag",
            align: "center",
            width: 80,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(4, row, row.tag[4], {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.tag[4]
                );
            },
        },
        {
            title: "點擊連結回覆通數",
            key: "click",
            align: "center",
            width: 150,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(5, row, row.click, {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.click
                );
            },
        },
        {
            title: "連結未回覆通數",
            key: "click_not",
            align: "center",
            width: 150,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link clickable hover",
                        onClick: () =>
                            filterDetailData(6, row, row.click_not, {
                                sendTime: row.time,
                                subject: row.subject,
                                content: row.text,
                                count: row.count,
                                click: row.click,
                                successReceive: row.tag[0],
                                bid: row.batch,
                            }),
                    },
                    row.click_not
                );
            },
        },
        {
            title: "連結點擊率",
            key: "clickThroughRate",
            align: "center",
            width: 100,
            render(row, index) {
                return h(
                    "p",
                    {},
                    row.tag[0] !== 0 ? (row.click / row.tag[0]).toFixed(2) * 100 + "%" : 0 + "%"
                );
            },
        },
        {
            title: "發送扣點",
            key: "cost",
            align: "center",
            width: 80,
            className: "deduction",
            render(row, index) {
                return h("p", {}, row.cost);
            },
        },
    ] as any;
//取消預約傳送 table column
const cancelReservationPopUpColumns = () =>
    [
        {
            type: "selection",
            multiple: false,
            disabled(row) {
                return row;
            },
        },
        {
            title: "發送時間",
            key: "time",
            align: "center",
            width: 100,
            render(row, index) {
                return h("p", {}, dayjs(row.time / 1000000).format("YYYY/MM/DD"));
            },
        },
        {
            title: "訊息主旨",
            key: "subject",
            align: "center",
            render(row, index) {
                return h("p", {}, row.subject);
            },
        },
        {
            title: "發送內容",
            key: "text",
            align: "center",
            width: 150,
            render(row, index) {
                return h("p", { class: " content scroll" }, row.text);
            },
        },

        {
            title: "預約傳送通數",
            key: "tag",
            align: "center",
            render(row, index) {
                return h("a", {}, row.tag[2]);
            },
        },

        {
            title: "發送扣點",
            key: "cost",
            align: "center",
            className: "deduction",
            render(row, index) {
                return h("p", {}, row.cost);
            },
        },
    ] as any;
// 詳細資料 table column
const detailDataPopUpColumns = () =>
    [
        {
            title: "編號",
            key: "index",
            align: "center",
            width: 80,
            render(row, index) {
                return h("p", {}, index + 1);
            },
        },
        {
            title: "門號",
            key: "mobile",
            align: "center",
            width: 120,
            render(row, index) {
                return h("p", {}, row.mobile);
            },
        },
        {
            title: "發送內容",
            key: "text",
            align: "center",
            width: 150,
            render(row, index) {
                return h("p", { class: " content scroll" }, row.text);
            },
        },
        {
            title: "接收狀態",
            key: "status",
            align: "center",
            width: 80,
            render(row, index) {
                return h(
                    "a",
                    {},
                    row.status
                    // row.status === 0
                    //     ? "成功接收"
                    //     : row.status === 1
                    //     ? "傳送中"
                    //     : row.status === 2
                    //     ? "預約傳送"
                    //     : row.status === 3
                    //     ? "預約取消"
                    //     : "收訊失敗"
                );
            },
        },
        {
            title: "收訊時間",
            key: "reportTime",
            align: "center",
            width: 120,
            render(row, index) {
                return h(
                    "a",
                    {},
                    dayjs(row.reportTime / 1000000 || row.time / 1000000).format(
                        "YYYY/MM/DD HH:mm:ss"
                    )
                );
            },
        },
        {
            title: "發送扣點",
            key: "cost",
            align: "center",
            className: "deduction",
            width: 80,
            render(row, index) {
                return h("p", {}, row.cost);
            },
        },
    ] as any;
//能查看訊息內容的 table column
const moreDetailDataPopUpColumns = ({ watchContent }) =>
    [
        {
            title: "編號",
            key: "index",
            align: "center",
            width: 80,
            render(row, index) {
                return h("p", {}, index + 1);
            },
        },
        {
            title: "收訊門號",
            key: "mobile",
            align: "center",
            render(row, index) {
                return h("p", {}, row.mobile);
            },
        },
        {
            title: "暱稱",
            key: "name",
            align: "center",
            render(row, index) {
                return h("p", {}, row.name);
            },
        },
        {
            title: "標籤",
            key: "tag",
            align: "center",
            className: "scroll",
            render(row, index) {
                const tags = row.tag.map((tagKey) => {
                    return h(
                        NTag,
                        {
                            style: {
                                marginRight: "6px",
                            },
                            round: true,
                            bordered: false,
                        },
                        {
                            default: () => `#${tagKey}`,
                        }
                    );
                });
                return tags;
            },
        },
        {
            title: "客服紀錄",
            key: "description",
            align: "center",
            render(row, index) {
                return h("a", {}, row.description);
            },
        },
        {
            title: "收訊時間",
            key: "receivedTime",
            align: "center",
            render(row, index) {
                return h("a", {}, dayjs(row.receivedTime / 1000000).format("YYYY/MM/DD HH:mm:ss"));
            },
        },
        {
            title: "聊天室開啟時間",
            key: "lastVisit",
            align: "center",
            render(row, index) {
                return h(
                    "a",
                    {},
                    row.lastVisit !== 0
                        ? dayjs(row.lastVisit / 1000000).format("YYYY/MM/DD HH:mm:ss")
                        : ""
                );
            },
        },
        {
            title: "對話內容",
            key: "cost",
            align: "center",
            render(row, index) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => watchContent(row),
                    },
                    { default: () => "查看內容" }
                );
            },
        },
    ] as any;
//rowProps
const rowProps = (row) => {
    return {
        style: "overflow:auto",
    };
};

onBeforeUnmount(() => {
    inquireSMSShortMessageList.value = [];
});

const outerNormalTablePagination = reactive({
    //一頁筆數
    pageSize: 10,
});
//外層 table 切分頁
const outerDetailTablePagination = reactive({
    //當前頁數
    page: 1,
    //總頁數
    pageCount: 1,
    pageSize: 10,
});
//外層 table 更新頁面 callback
const outerTableHandlePageChange = (page) => {
    // console.log(" 更新後的 page ", page);
    inquireLoading.value = true;
    inquireShortMessage(
        "0",
        timeInterval.value,
        model.searchSend_box.includes("box_phone") ? model.searchSend_phone : null,
        model.searchSend_box.includes("box_status") ? model.searchSend_send_status : null,
        String(page)
    );
    outerDetailTablePagination.page = page;
};
//內層 table 切分頁
const innerTablePagination = reactive({
    page: 1,
    pageSize: 100,
    pageCount: 1,
});
//內層 table 更新頁面 callback
const innerTableHandlePageChange = (page) => {
    inquireLoading.value = true;
    innerTableGetData(basicInformation.value.status, basicInformation.value.bid, String(page));
};
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.sms_inquire .n-data-table__pagination {
    position: relative;
    margin-top: 25px;
}
.inquireCondition {
    margin-top: -45px;
    margin-bottom: -65px;
}
.sms_divider {
    &.n-divider:not(.n-divider--vertical) {
        margin-top: 20px;
        margin-bottom: 30px;
    }
}
.dataTable {
    .n-divider:not(.n-divider--vertical) {
        margin-top: 0px;
        margin-bottom: 0px;
    }
}
.sms_search {
    width: 100%;
    box-shadow: 1px 2px 4px 0 $gray-6;
    &.n-input .n-input__border,
    &.n-input .n-input__state-border {
        border: 1px solid $border-line;
    }
    &.n-input:not(.n-input--disabled):hover .n-input__state-border {
        border: none;
    }
    &.n-input:not(.n-input--disabled).n-input--focus {
        background-color: none;
    }
    &.n-input:not(.n-input--disabled).n-input--focus .n-input__state-border {
        border: none;
        box-shadow: none;
    }
    &.n-input .n-input__input-el,
    &.n-input .n-input__textarea-el {
        caret-color: $primary-1;
    }
    &.n-input .n-input__input-el {
        height: 36px;
        line-height: 36px;
        font-size: $font-size-14;
    }
}
.sms_exportButton {
    width: 100px;
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
    text-align: center;
    margin-left: 266px;
    box-shadow: 0px 2px 4px 0 $gray-6;
    cursor: pointer;
    .n-button__content {
        font-size: $font-size-14;
        font-weight: 500;
    }
    .n-button__border {
        border: 1px solid $gray-1;
    }
    .n-base-wave {
        animation: none;
    }
    .n-button__state-border {
        border: none;
    }
    &.n-button:not(.n-button--disabled):hover .n-button__state-border {
        border: none;
    }
    &.n-button:not(.n-button--disabled):hover .n-button__border {
        border: 1px solid $gray-3;
    }
    &.n-button:not(.n-button--disabled):hover {
        color: $gray-3;
    }
    &.n-button:not(.n-button--disabled):focus {
        color: $gray-3;
    }
    &.n-button:not(.n-button--disabled):focus .n-button__border {
        border: 1px solid $gray-3;
    }
    &.n-button:not(.n-button--disabled):focus .n-button__state-border {
        border: none;
    }
}
.sms_table {
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
    .clickable {
        color: blue;
        text-decoration: underline;
    }
    .scroll {
        overflow: auto;
        &::-webkit-scrollbar-track {
            border-radius: 5px;
            cursor: pointer;
        }
        &::-webkit-scrollbar {
            width: 5px;
        }
        &:hover::-webkit-scrollbar-thumb {
            border-radius: 5px;
            cursor: pointer;
            -webkit-box-shadow: inset 5px 5px 5px $gray-4;
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
    .content {
        width: 150px;
        max-height: 150px;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        // overflow: hidden;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
//datatable相關彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .dataTable {
        padding: 10px;
        min-width: 850px;
        max-width: 90%;
        min-height: 539px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .detailDataTitle {
            display: flex;
            margin-top: 25px;
            margin-bottom: 30px;
            .detailDataCloseIcon {
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
            }
            .detailDataTime {
                padding: 10px;
                // border: 1px solid $gray-4;
                h1 {
                    margin: 10px 0;
                    font-size: $font-size-18;
                }
            }
            .detailDataAnalysis {
                padding: 10px;
                margin-left: 15px;
                width: 50%;
                border: 1px solid $gray-4;
                h1 {
                    margin: 10px 0;
                    font-size: $font-size-18;
                }
                h2 {
                    margin: 15px 0;
                    font-size: $font-size-14;
                }
                span {
                    color: red;
                }
            }
        }
        .exportEXCEL {
            width: 100px;
            height: 36px;
            line-height: 36px;
            border-radius: 18px;
            text-align: center;
            background-color: #36ad6a;
            color: $white;
            cursor: pointer;
            align-self: end;
            margin: 5px 0;
            margin-right: 10px;
        }
        .cancelReservationTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            .delete {
                width: 200px;
                height: 36px;
                line-height: 36px;
                border: 1px solid $gray-1;
                text-align: center;
                color: $white;
                background-color: $gray-1;
                cursor: pointer;
            }
            .cancelReservationCloseIcon {
                cursor: pointer;
            }
        }
        .unclicked {
            padding: 20px;
            word-break: break-all;
            p {
                line-height: 1.6;
            }
        }
    }
}
// 刪除預約訊息彈窗
.mask1 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .deleteChannelPopUp {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .deleteChannelConfirm {
            font-size: $font-size-16;
            color: $gray-1;
            letter-spacing: -0.1px;
            min-width: 342px;
            text-align: left;
            line-height: 22px;
        }
        .buttonContainer {
            margin-top: 20px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            & .cancel {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $white;
                color: $gray-5;
                margin-right: 16px;
                &:hover,
                &:active {
                    background: $gray-4;
                    color: $white;
                }
            }
            & .confirm {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: rgba(223, 54, 54, 0.7);
                color: $white;
                &:hover,
                &:active {
                    background-color: #df3636;
                }
            }
        }
    }
}
//查看詳細訊息內容彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .wrapper {
        min-width: 850px;
        height: 500px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .header {
            width: 100%;
            height: 40px;
            background-color: $primary-1;
            display: flex;
            align-items: center;
            padding-left: 10px;
        }
        .detailDataCloseIcon {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }
        .detailChatContent {
            display: flex;
            flex-direction: column;
            .chatContent {
                margin: 5px 0;
                .chat {
                    display: flex;
                    .chatSender {
                        display: flex;
                        .changeColor {
                            color: green !important;
                        }
                    }
                }
            }
        }
    }
}
#sms_inquire_wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 140px);
    padding: 15px 15px 45px 15px;
    margin-bottom: 30px;
    background-color: $bg;
    .sms_inquire {
        background-color: $white;
        padding: 15px;
        width: 100%;
        border-radius: 4px;
        .inquire_title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .inquire {
                width: 100%;
            }
            h2 {
                display: inline-flex;
                align-items: center;
                color: $gray-1;
                width: 96px;
                @extend %h2;
                font-family: $font-family;
                margin-right: 40px;
            }
            .n-input {
                width: 70%;
                border-radius: 20px;
                img {
                    width: 15px;
                    height: 15px;
                }
            }
            .exportButton {
                width: 100px;
                height: 36px;
                line-height: 36px;
                border: 1px solid $gray-1;
                border-radius: 18px;
                text-align: center;
                margin-left: 266px;
                cursor: pointer;
            }
        }
        .inquireCondition1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .timeInquire {
                display: flex;
                align-items: center;
                .n-checkbox-box {
                    background-color: $primary-1;
                }
                .datePicker {
                    width: 100%;
                    border-radius: 4px;
                }
                p {
                    margin-left: 15px;
                    margin-right: 50px;
                    color: $gray-3;
                }
            }
            .phoneNumberInquire {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .n-checkbox {
                    margin-left: 15px;
                }
                .input {
                    width: 150px;
                    // height: 26px;
                    border-radius: 4px;
                }
            }
            .inquireButton {
                width: 100px;
                height: 36px;
                line-height: 36px;
                border: 1px solid $gray-1;
                border-radius: 18px;
                text-align: center;
                background-color: $gray-1;
                color: $white;
                cursor: pointer;
                margin-left: 82px;
            }
            .exportEXCEL {
                width: 100px;
                height: 36px;
                line-height: 36px;
                // border: 1px solid #36ad6a;
                border-radius: 18px;
                text-align: center;
                background-color: #36ad6a;
                color: $white;
                cursor: pointer;
                margin-left: 10px;
            }
        }
        .inquireCondition2 {
            // margin-top: -35px;
            margin-bottom: 45px;
            .statusInquire {
                display: flex;
                .status_list {
                    display: flex;
                    align-items: center;
                    li {
                        display: flex;
                        align-items: center;
                        border-radius: 20px;
                        background-color: $white;
                        border: 1px solid $gray-3;
                        color: $gray-3;
                        font-size: $font-size-12;
                        padding: 2px 8px;
                        cursor: pointer;
                        + li {
                            margin-left: 15px;
                        }
                        &.active {
                            color: $white;
                            background-color: $primary-1;
                            border-color: $primary-1;
                        }
                    }
                }
            }
        }
    }
}
</style>
