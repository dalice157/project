<template>
    <div id="sms_inquire_wrap">
        <div class="sms_inquire">
            <div class="inquire_title">
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
            <n-divider class="sms_divider" />
            <n-form class="inquireCondition" :model="model" :rules="rules" ref="formRef">
                <n-form-item path="searchSend_box">
                    <n-checkbox-group v-model:value="model.searchSend_box">
                        <div class="inquireCondition1">
                            <div class="timeInquire">
                                <n-checkbox value="box_time" disabled>依發送時間查詢</n-checkbox>
                                <n-form-item path="searchSend_date">
                                    <n-date-picker
                                        class="datePicker"
                                        v-model:value="model.searchSend_date"
                                        type="daterange"
                                        clearable
                                        size="small"
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
                        </div>
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
            <n-data-table
                class="sms_table"
                :bordered="false"
                :scroll-x="1200"
                :columns="createColumns({ cancelReservationPopUp })"
                :data="data"
                :pagination="pagination"
                :bottom-bordered="false"
            />
        </div>
    </div>
    <teleport to="body" v-if="popUpisOpen">
        <!-- v-if="isOpen" -->
        <div class="mask">
            <div class="dataTable">
                <div>
                    <div class="delete" @click="deleteReservationPopUp">刪除已預約的簡訊紀錄</div>
                    <img :src="closeIcon" alt="關閉" @click="popUpisOpen = !popUpisOpen" />
                </div>
                <n-data-table
                    class="sms_table"
                    :bordered="false"
                    :scroll-x="800"
                    :columns="popUpColumns()"
                    :data="popUpData"
                    :bottom-bordered="false"
                    :row-key="(row) => row"
                    @update:checked-row-keys="handleCheck"
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
</template>

<script lang="ts" setup>
import { reactive, ref, h, computed } from "vue";
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
    NRadio,
} from "naive-ui";
import { useApiStore } from "@/store/api";
import dayjs from "dayjs";

import searchIcon from "@/assets/Images/manage/search.svg";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import { storeToRefs } from "pinia";

//store
const apiStore = useApiStore();
const { inquireShortMessage, deleteReservationShortMsg } = apiStore;
const { inquireSMSShortMessageList } = storeToRefs(apiStore);
//v-model

const search = ref("");
const formRef = ref(null);
const model = reactive({
    searchSend_box: ["box_time"],
    searchSend_phone: null,
    searchSend_date: [
        dayjs().startOf("date").valueOf(),
        dayjs().add(1, "days").startOf("date").valueOf(),
    ],
    searchSend_send_status: null,
}) as any;

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
    {
        id: 5,
        text: "格式錯誤",
        val: "5",
        isSelect: false,
    },
    {
        id: 6,
        text: "空號",
        val: "6",
        isSelect: false,
    },
    {
        id: 7,
        text: "逾時",
        val: "7",
        isSelect: false,
    },
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
            console.log("value:", value);
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
            console.log("value:", value);

            if (model.searchSend_box.includes("box_status") && (!value || value.length === 0)) {
                return new Error("請輸入接收狀態");
            }
        },
    },
};
const onSmsSubmit = (e: any) => {
    e.preventDefault();
    formRef.value.validate((errors) => {
        if (!errors) {
            console.log("model", model);
            const transformDate = ref([]);
            transformDate.value = model.searchSend_date.map((item) => {
                return item * 1000000;
            });
            inquireShortMessage(
                "0",
                transformDate.value,
                model.searchSend_phone,
                model.searchSend_send_status
            );
            // console.log("驗證成功, 打api", model);
        } else {
            console.log("驗證失敗, 不打api", errors);
        }
    });
};

const popUpisOpen = ref(false);
const confirmCancel = ref(false);
const cancelReservationPopUp = (rowData) => {
    if (rowData.status === 2) {
        popUpisOpen.value = !popUpisOpen.value;
        popUpData.value = [rowData];
        // console.log("rowData", rowData);
    } else {
        alert("無預約傳送訊息,無法取消!!!");
    }
};
//點進去popup帶的資料
const popUpData = ref([]);
//選中的資料
const pickUpData = ref([]);
//選取資料function
const handleCheck = (rowKey) => {
    pickUpData.value = rowKey;
    console.log("pickUpData", pickUpData.value);
};
//確定刪除彈窗
const deleteReservationPopUp = () => {
    if (pickUpData.value.length !== 0) {
        confirmCancel.value = !confirmCancel.value;
    } else {
        alert("請選取要刪除的訊息!!!");
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
    popUpisOpen.value = false;
};
const createColumns = ({ cancelReservationPopUp }) =>
    [
        {
            title: "編號",
            key: "id",
            align: "center",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link subject",
                    },
                    index + 1
                );
            },
        },
        {
            title: "發送時間",
            key: "time",
            align: "center",
            width: 100,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link subject",
                    },
                    dayjs(row.time / 1000000).format("YYYY/MM/DD")
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
            key: "text",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link content",
                    },
                    row.text
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
                        class: "link",
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
                        class: "link",
                    },
                    row.status === 0 ? 1 : 0
                );
            },
        },
        {
            title: "傳送中通數",
            key: "status",
            align: "center",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.status === 1 ? 1 : 0
                );
            },
        },
        {
            title: "預約傳送通數",
            key: "status",
            align: "center",
            render(row, index) {
                return h(
                    "a",
                    {
                        class: "link hover",
                        onClick: () => cancelReservationPopUp(row),
                    },
                    row.status === 2 ? 1 : 0
                );
            },
        },
        {
            title: "預約取消通數",
            key: "status",
            align: "center",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.status === 3 ? 1 : 0
                );
            },
        },
        {
            title: "收訊失敗",
            key: "status",
            align: "center",
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    row.status === 4 ? 1 : 0
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
const popUpColumns = () =>
    [
        {
            type: "selection",
        },
        {
            title: "發送時間",
            key: "time",
            align: "center",
            width: 100,
            render(row, index) {
                return h(
                    "p",
                    {
                        class: "link",
                    },
                    dayjs(row.time / 1000000).format("YYYY/MM/DD")
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
            title: "預約傳送通數",
            key: "status",
            align: "center",
            render(row, index) {
                return h(
                    "a",
                    {
                        class: "link hover",
                    },
                    row.status === 2 ? 1 : 0
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

const data = computed(() => {
    return inquireSMSShortMessageList.value;
});

const pagination = {
    pageSize: 6,
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
        background-color: $primary-5;
    }
    &.n-data-table .n-data-table-th {
        background-color: $primary-5;
        font-weight: bold;
        color: $gray-1;
        border: none;
        &.deduction {
            color: $danger;
        }
    }
    &.n-data-table .n-data-table-tr:nth-child(even) {
        background: $primary-5;
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
        height: 375px;
        background-color: $white;
        > div {
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
            img {
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
#sms_inquire_wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    padding: 15px 15px 0px 15px;
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
        }
        .inquireCondition2 {
            margin-top: -35px;
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
