<template>
    <div id="mms_inquire_wrap">
        <div class="mms_inquire">
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
            <n-divider /> -->
            <n-form class="inquireCondition1" :model="model" :rules="rules" ref="formRef">
                <n-form-item path="searchSend_box">
                    <n-checkbox-group v-model:value="model.searchSend_box">
                        <n-space item-style="display: flex;">
                            <div class="timeInquire">
                                <n-checkbox value="box_time" disabled>依發送時間查詢</n-checkbox>
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
                        </n-space>
                    </n-checkbox-group>
                </n-form-item>
                <n-button @click="onMmsSubmit" class="inquireButton">查詢</n-button>
            </n-form>

            <n-data-table
                class="mms_table"
                :bordered="false"
                :scroll-x="1200"
                :columns="
                    tableInformation === 'normal'
                        ? createColumns({ cancelReservationPopUp, filterDetailData })
                        : detailDataPopUpColumns()
                "
                :data="tableInformation === 'normal' ? data : detailData"
                :pagination="pagination"
                :bottom-bordered="false"
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
                    class="mms_table"
                    :bordered="false"
                    :scroll-x="800"
                    :columns="cancelReservationPopUpColumns()"
                    :data="cancelReservationPopUpData"
                    :bottom-bordered="false"
                    :row-key="(row) => row"
                    v-model:checked-row-keys="pickUpData"
                />
            </div>
        </div>
    </teleport>
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
    <!-- 詳細資料談窗 -->
    <teleport to="body" v-if="detailDataPopUpIsOpen">
        <div class="mask">
            <div class="dataTable">
                <div class="detailDataTitle">
                    <img
                        class="detailDataCloseIcon"
                        :src="closeIcon"
                        alt="關閉"
                        @click="detailDataPopUpIsOpen = !detailDataPopUpIsOpen"
                    />
                </div>
                <n-data-table
                    class="mms_table"
                    :bordered="false"
                    :scroll-x="800"
                    :columns="detailDataPopUpColumns()"
                    :data="detailData"
                    :bottom-bordered="false"
                    :max-height="350"
                />
            </div>
        </div>
    </teleport>
    <Loading :isLoading="inquireLoading" />
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script lang="ts" setup>
import { reactive, ref, h, computed, watch, onBeforeUnmount } from "vue";
import {
    NForm,
    NFormItem,
    NDatePicker,
    NInput,
    NButton,
    NCheckboxGroup,
    NCheckbox,
    NDataTable,
    NDivider,
    NConfigProvider,
    NSpace,
} from "naive-ui";
import { useApiStore } from "@/store/api";
import { storeToRefs } from "pinia";
import searchIcon from "@/assets/Images/manage/search.svg";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import dayjs from "dayjs";
import Loading from "@/components/LoadingPage.vue";
import AlertPopUp from "@/components/AlertPopUp.vue";

//store
const apiStore = useApiStore();
const { inquireShortMessage, deleteReservationShortMsg } = apiStore;
const { inquireMMSShortMessageList, tableInformation, inquireLoading } = storeToRefs(apiStore);

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

//v-model
const search = ref("");
const formRef = ref(null);
const model = reactive({
    searchSend_box: ["box_time"],
    searchSend_date: [
        dayjs().subtract(1, "day").startOf("date").valueOf(),
        dayjs().startOf("date").valueOf(),
    ],
    searchSend_phone: "",
}) as any;
//限制不能選未來時間
const dateTimeLimit = (ts) => {
    return ts > dayjs().startOf("day").valueOf();
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
};
// 判斷第一層table鎖鑰顯示的data 及 column
watch(
    tableInformation,
    (newVal, oldVal) => {
        // console.log("tableInformation newVal", newVal);
        // console.log("tableInformation oldVal", oldVal);
        if (newVal === "detail") {
            detailData.value = [];
            detailData.value = data.value.reduce((arr, item) => {
                return arr.concat(item.data);
            }, []);
            console.log("detailData", detailData.value);
        }
    },
    { deep: true }
);
// 查詢按鈕
const onMmsSubmit = (e: any) => {
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
                "1",
                transformDate.value,
                model.searchSend_box.includes("box_phone") ? model.searchSend_phone : null,
                null
            );
            model.searchSend_date[1] -= 86400000;
            // console.log("驗證成功, 打api", model);
        } else {
            inquireLoading.value = false;
            console.log("驗證失敗, 不打api", errors);
        }
    });
};
// 取消預約傳送
const cancelReservationPopUpIsOpen = ref(false);
const confirmCancel = ref(false);
const cancelReservationPopUp = (rowData) => {
    if (rowData.statusCount[2] >= 1) {
        cancelReservationPopUpIsOpen.value = !cancelReservationPopUpIsOpen.value;
        cancelReservationPopUpData.value = [rowData];
        console.log("預約傳送點進去代的資料", cancelReservationPopUpData.value);
        // 直接帶入選中資料
        pickUpData.value = cancelReservationPopUpData.value;
    } else {
        alertMessage.value = "無預約傳送訊息,無法取消!!!";
    }
};
//點進去popup帶的資料
const cancelReservationPopUpData = ref([]);
//選中的資料
const pickUpData = ref([]);
//選取資料function
// const handleCheck = (rowKey) => {
//     pickUpData.value = rowKey;
//     console.log("pickUpData", pickUpData.value);
// };
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
    deleteReservationShortMsg("1", pickUpData.value[0]);
    confirmCancel.value = false;
    cancelReservationPopUpIsOpen.value = false;
};
// 過濾第一層資料到第二層
const filterDetailData = (status, data, showCount) => {
    // console.log("過濾第一層資料到第二層 data", data);
    //有資料才顯示詳細table
    if (showCount >= 1) {
        // 過濾 data 條件
        if (status === -1) {
            detailData.value = data;
        } else {
            detailData.value = data.filter((item) => item.status === status);
        }
        detailDataPopUpIsOpen.value = true;
    } else {
        alertMessage.value = "無詳細資料可查尋";
    }
};
// 查看詳細資料
const detailDataPopUpIsOpen = ref(false);
const detailData = ref([]);
//------------------------------------------- table column ---------------------------------------------
// 一般資料 table column
const createColumns = ({ cancelReservationPopUp, filterDetailData }) => [
    {
        title: "編號",
        key: "id",
        align: "center",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link",
                },
                index + 1
            );
        },
    },
    {
        title: "發送時間",
        key: "sendTime",
        align: "center",
        width: 100,
        render(row, index) {
            return h(
                "p",
                {
                    class: "link subject",
                },
                dayjs(row.sendTime / 1000000).format("YYYY/MM/DD")
            );
        },
    },
    {
        title: "訊息主旨",
        key: "subject",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link subject",
                },
                row.subject
            );
        },
    },
    {
        title: "發送內容",
        key: "content",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link content",
                },
                row.content
            );
        },
    },
    {
        title: "成功率",
        key: "successfulPercent",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link",
                },
                (row.statusCount[0] / row.count).toFixed(2) * 100 + "%"
            );
        },
    },
    {
        title: "發送通數",
        key: "count",
        align: "center",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link hover",
                    onClick: () => filterDetailData(-1, row.data, row.count),
                },
                row.count
            );
        },
    },
    {
        title: "成功接收",
        key: "status",
        align: "center",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link hover",
                    onClick: () => filterDetailData(0, row.data, row.statusCount[0]),
                },

                row.statusCount[0]
            );
        },
    },
    {
        title: "傳送中",
        key: "statusCount",
        align: "center",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link hover",
                    onClick: () => filterDetailData(1, row.data, row.statusCount[1]),
                },

                row.statusCount[1]
            );
        },
    },
    {
        title: "預約傳送",
        key: "statusCount",
        align: "center",
        render(row, index) {
            return h(
                "a",
                {
                    class: "link hover",
                    onClick: () => cancelReservationPopUp(row),
                },

                row.statusCount[2]
            );
        },
    },
    {
        title: "預約取消",
        key: "statusCount",
        align: "center",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link hover",
                    onClick: () => filterDetailData(3, row.data, row.statusCount[3]),
                },

                row.statusCount[3]
            );
        },
    },
    {
        title: "收訊失敗",
        key: "statusCount",
        align: "center",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link hover",
                    onClick: () => filterDetailData(4, row.data, row.statusCount[4]),
                },

                row.statusCount[4]
            );
        },
    },
    {
        title: "發送扣點",
        key: "totalCost",
        align: "center",
        className: "deduction",
        render(row, index) {
            return h(
                "p",
                {
                    class: "link",
                },
                row.totalCost
            );
        },
    },
];
//取消預約傳送 table column
const cancelReservationPopUpColumns = () =>
    [
        {
            type: "selection",
            disabled(row) {
                return row;
            },
        },
        {
            title: "發送時間",
            key: "sendTime",
            align: "center",
            width: 100,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    dayjs(row.sendTime / 1000000).format("YYYY/MM/DD")
                );
            },
        },
        {
            title: "訊息主旨",
            key: "subject",
            align: "center",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.subject
                );
            },
        },
        {
            title: "發送內容",
            key: "content",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.content
                );
            },
        },

        {
            title: "預約傳送通數",
            key: "statusCount",
            align: "center",
            render(row, index) {
                return h(
                    "a",
                    {
                        class: "link hover",
                    },
                    row.statusCount[2]
                );
            },
        },

        {
            title: "發送扣點",
            key: "totalCost",
            align: "center",
            className: "deduction",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.totalCost
                );
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
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    index + 1
                );
            },
        },
        {
            title: "門號",
            key: "mobile",
            align: "center",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.mobile
                );
            },
        },
        {
            title: "發送內容",
            key: "text",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.text
                );
            },
        },

        {
            title: "接收狀態",
            key: "status",
            align: "center",
            render(row, index) {
                return h(
                    "a",
                    {
                        class: "link",
                    },
                    row.status === 0
                        ? "成功接收"
                        : row.status === 1
                        ? "傳送中"
                        : row.status === 2
                        ? "預約傳送"
                        : row.status === 3
                        ? "預約取消"
                        : "收訊失敗"
                );
            },
        },
        {
            title: "收訊時間",
            key: "receivedTime",
            align: "center",
            render(row, index) {
                return h(
                    "a",
                    {
                        class: "link",
                    },
                    dayjs(row.receivedTime / 1000000).format("YYYY/MM/DD")
                );
            },
        },

        {
            title: "發送扣點",
            key: "cost",
            align: "center",
            className: "deduction",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.cost
                );
            },
        },
    ] as any;
// 第一層資料
const data = computed(() => {
    return inquireMMSShortMessageList.value.map((item) => {
        return {
            ...item,
            // text: item.text.split(" ")[0],
            // time: item.sendTime,
            // subject: item.subject,
            // text: item.content,
            // count: item.count,
            // status: item.statusCount,
            // cost: item.totalCost,
        };
    });
});
onBeforeUnmount(() => {
    inquireMMSShortMessageList.value = [];
});
const pagination = {
    pageSize: 6,
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.mms_inquire .n-data-table__pagination {
    position: relative;
    margin-top: 25px;
}
.mms_search {
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
}

.inquireButton {
    width: 100px;
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
    text-align: center;
    background-color: $gray-1;
    color: $white;
    cursor: pointer;
    margin-left: 82px;

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
        border: none;
    }
    &.n-button:not(.n-button--disabled):hover {
        background-color: $gray-2;
        color: $gray-8;
    }
    &.n-button:not(.n-button--disabled):focus {
        background-color: $gray-2;
        color: $gray-8;
    }
    &.n-button:not(.n-button--disabled):focus .n-button__border {
        border: none;
    }
    &.n-button:not(.n-button--disabled):focus .n-button__state-border {
        border: none;
    }
}
.mms_exportButton {
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
.mms_table {
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
    .content {
        width: 200px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .dataTable {
        padding: 10px;
        width: 800px;
        height: 505px;
        background-color: $white;
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
        .detailDataTitle {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 30px;
            .detailDataCloseIcon {
                cursor: pointer;
            }
        }
    }
}
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
#mms_inquire_wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 140px);
    padding: 15px 15px 45px 15px;
    margin-bottom: 30px;
    background-color: $bg;
    .mms_inquire {
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
            margin-top: -45px;
            margin-bottom: -10px;
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
                .n-checkbox {
                    margin-left: 15px;
                }
                .input {
                    width: 150px;
                    // height: 26px;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>
