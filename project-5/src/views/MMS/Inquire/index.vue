<template>
    <div id="mms_inquire_wrap">
        <div class="mms_inquire">
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
                            <img src="../../../assets/Images/manage/search.svg" alt="#" />
                        </template>
                    </n-input>
                </div>
            </div>
            <n-divider />
            <n-form class="inquireCondition1" :model="model" :rules="rules" ref="formRef">
                <n-form-item path="searchSend_box">
                    <n-checkbox-group v-model:value="model.searchSend_box">
                        <n-space item-style="display: flex;">
                            <div class="timeInquire">
                                <n-checkbox value="box_time">依發送時間查詢</n-checkbox>
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
                        </n-space>
                    </n-checkbox-group>
                </n-form-item>
                <n-button @click="onMmsSubmit" class="inquireButton">查詢</n-button>
            </n-form>

            <n-data-table
                class="mms_table"
                :bordered="false"
                :scroll-x="1200"
                :columns="createColumns"
                :data="data"
                :pagination="pagination"
                :bottom-bordered="false"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, h } from "vue";
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

const search = ref("");

const createColumns = [
    {
        title: "編號",
        key: "id",
        align: "center",
    },
    {
        title: "發送時間",
        key: "time",
        align: "center",
        width: 100,
    },
    {
        title: "訊息主旨",
        key: "subject",
        render(row, index) {
            return h(
                "a",
                {
                    class: "link subject",
                    href: "javascript:;",
                    target: "_blank",
                    title: row.subject,
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
                "a",
                {
                    class: "link content",
                    href: "javascript:;",
                    target: "_blank",
                    title: row.content,
                },
                row.content
            );
        },
    },
    {
        title: "發送通數",
        key: "totalSent",
        align: "center",
        render(row, index) {
            return h(
                "a",
                {
                    class: "link",
                    href: "javascript:;",
                    target: "_blank",
                },
                row.totalSent
            );
        },
    },
    {
        title: "已傳送",
        key: "success",
        align: "center",
        render(row, index) {
            return h(
                "a",
                {
                    class: "link",
                    href: "javascript:;",
                    target: "_blank",
                },
                row.success
            );
        },
    },
    {
        title: "預約傳送通數",
        key: "totalAppointmentDelivery",
        align: "center",
        render(row, index) {
            return h(
                "a",
                {
                    class: "link",
                    href: "javascript:;",
                    target: "_blank",
                },
                row.totalAppointmentDelivery
            );
        },
    },
    {
        title: "預約取消通數",
        key: "totalAppointmentCancellation",
        align: "center",
        render(row, index) {
            return h(
                "a",
                {
                    class: "link",
                    href: "javascript:;",
                    target: "_blank",
                },
                row.totalAppointmentCancellation
            );
        },
    },
    {
        title: "發送扣點",
        key: "deduction",
        align: "center",
        className: "deduction",
    },
] as any;

const data = [
    {
        key: 0,
        id: "1",
        time: "2021/12/11 15:14:20",
        subject:
            "週年慶優惠活動週年慶優惠活動週年慶優惠活動週年慶優惠活動週年慶優惠活動週年慶優惠活動週年慶優惠活動",
        content: "最新優惠活動優惠活動快截止了，要買要快喔  http://e8d.tw/sample",
        totalSent: 1000,
        success: 800,
        totalSending: 8,
        totalAppointmentDelivery: 8,
        totalAppointmentCancellation: 8,
        fail: 50,
        deduction: 456,
    },
    {
        key: 1,
        id: "2",
        time: "2021/12/11 15:14:20",
        subject: "預約取消通數預約取消通數預約取消通數",
        content: "DaliceDaliceDaliceDalice",
        totalSent: 1000,
        success: 800,
        totalSending: 8,
        totalAppointmentDelivery: 8,
        totalAppointmentCancellation: 8,
        fail: 50,
        deduction: 234,
    },
    {
        key: 2,
        id: "3",
        time: "2021/12/11 15:14:20",
        subject: "Dalice Brown",
        content: "DaliceDaliceDaliceDalice",
        totalSent: 1000,
        success: 800,
        totalSending: 8,
        totalAppointmentDelivery: 8,
        totalAppointmentCancellation: 8,
        fail: 50,
        deduction: 222,
    },
    {
        key: 3,
        id: "4",
        time: "2021/12/11 15:14:20",
        subject: "Dalice Brown",
        content: "DaliceDaliceDaliceDalice",
        totalSent: 1000,
        success: 800,
        totalSending: 8,
        totalAppointmentDelivery: 8,
        totalAppointmentCancellation: 8,
        fail: 50,
        deduction: 111,
    },
    {
        key: 4,
        id: "5",
        time: "2021/12/11 15:14:20",
        subject: "Dalice Brown",
        content: "DaliceDaliceDaliceDalice",
        totalSent: 1000,
        success: 800,
        totalSending: 8,
        totalAppointmentDelivery: 8,
        totalAppointmentCancellation: 8,
        fail: 50,
        deduction: 233,
    },
    {
        key: 5,
        id: "6",
        time: "2021/12/11 15:14:20",
        subject: "Dalice Brown",
        content: "DaliceDaliceDaliceDalice",
        totalSent: 1000,
        success: 800,
        totalSending: 8,
        totalAppointmentDelivery: 8,
        totalAppointmentCancellation: 8,
        fail: 50,
        deduction: 123,
    },
];

const formRef = ref(null);

const model = reactive({
    searchSend_box: ["box_time"],
    searchSend_date: [Date.now(), Date.now()],
    searchSend_phone: null,
}) as any;

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
};

const onMmsSubmit = (e: any) => {
    e.preventDefault();
    formRef.value.validate((errors) => {
        if (!errors) {
            console.log("驗證成功, 打api", model);
        } else {
            console.log("驗證失敗, 不打api", errors);
        }
    });
};
const pagination = {
    pageSize: 6,
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
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
#mms_inquire_wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: calc(100% - 80px);
    padding: 15px 15px 0px 15px;
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
