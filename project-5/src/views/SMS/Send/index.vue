<template>
    <div class="SMSSend">
        <div class="smsContent">
            <h2>輸入簡訊內容</h2>
            <n-divider></n-divider>
            <div class="smsChannel">
                <h3>發送頻道</h3>
                <n-select
                    class="selectChannel"
                    v-model:value="smsChannel"
                    :options="filterChannelList"
                    placeholder="請選擇發送頻道"
                />
            </div>
            <div class="smsSubject">
                <div class="subject">
                    <h3>簡訊主旨</h3>
                    <p>
                        (「簡訊主旨」內不會出現於訊內容中，亦不列入訊字數計算。輸入「簡訊主旨」可讓您更容易管理每一次簡訊發送作業，當您為每一次的發送予以命名，在查詢報表時，將可方便區分每一次的發送記錄。)
                    </p>
                </div>
                <n-input
                    id="input"
                    v-model:value.trim="smsSubject"
                    type="text"
                    placeholder="請輸入簡訊主旨(可不填)"
                />
            </div>
            <div class="smsSendContent">
                <div class="contentTitle">
                    <h3>發送內容</h3>
                    <div class="commonMessage" @click="getCommonList">+常用簡訊</div>
                </div>
                <n-input
                    v-model:value.trim="smsContent"
                    type="textarea"
                    placeholder="請輸入簡訊內容..."
                    :autosize="{
                        minRows: 7,
                        maxRows: 7,
                    }"
                    @focus="focusType"
                    @blur="blurJudge"
                    @input="wordCount"
                    @keydown="storeBoolean = true"
                />
                <!-- {{ errorMsg }} -->
            </div>
            <div class="messageCount">
                <div class="messageInfo">
                    <div class="wordCount">
                        {{ smsWord }} 字 &ensp;
                        <n-popover trigger="hover" placement="bottom">
                            <template #trigger>
                                <n-icon size="20">
                                    <help-circle />
                                </n-icon>
                            </template>
                            <span class="pop"
                                >系統會在收到與關鍵字完全一致的訊息時自動回傳訊息，未輸入則在不符合其他關鍵字時自動回傳訊息。</span
                            >
                        </n-popover>
                    </div>
                    <div class="numOfMessage">{{ smsCount }} 則</div>
                    <div class="point">{{ smsPoint }} 點</div>
                </div>
                <div class="storeCommonMessage" @click="storeToCommonMsg" v-show="storeBoolean">
                    <p>儲存至常用簡訊</p>
                </div>
            </div>
            <TimeSetting optionType="sms"></TimeSetting>
        </div>
        <div class="smsSetting">
            <OptionSetting
                :nextPageRouter="nextPageRouter"
                :demoContent="demoContent"
                optionType="sms"
            ></OptionSetting>
        </div>
    </div>
    <!-- 常用簡訊彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="commonMsgPopUp">
            <div class="commonMsg">
                <div class="popUpTitle">
                    <h2>常用簡訊</h2>
                    <img
                        src="@/assets/Images/chatroom/close-round.svg"
                        alt="#"
                        @click="closeCommonMsg"
                    />
                </div>
                <div class="commonMsgFunctionBar">
                    <div class="commonMsgDel" @click="removeHint">刪除</div>
                    <div class="commonMsgAdd" @click="addCommonMsg">新增</div>
                    <div
                        class="commonMsgConfirm"
                        @click="exportCommonMsg"
                        v-show="checkedVal !== null"
                    >
                        確定
                    </div>
                </div>
                <div class="Table">
                    <n-data-table
                        class="commonMsgTable"
                        :bordered="false"
                        :columns="createColumns"
                        :data="data"
                        :pagination="pagination"
                        :scroll-x="840"
                        :bottom-bordered="false"
                        :style="{ height: `50px` }"
                    />
                </div>
            </div>
        </div>
    </teleport>
    <!-- 新增常用簡訊彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="addCommonMsgPopUp">
            <div class="commonMsg">
                <div class="popUpTitle">
                    <h2>新增常用簡訊</h2>
                    <img
                        src="@/assets/Images/chatroom/close-round.svg"
                        alt="#"
                        @click="closeAddCommonMsg"
                    />
                </div>
                <div class="commonMsgFunctionBar">
                    <div class="commonMsgConfirm" @click="submitAddCommonMsg">確定</div>
                </div>
                <div class="smsSubject">
                    <div class="subject">
                        <h3>簡訊主旨</h3>
                    </div>
                    <n-input
                        id="input"
                        v-model:value.trim="subject"
                        type="text"
                        placeholder="請輸入簡訊主旨(可不填)"
                    />
                </div>
                <div class="smsSendContent">
                    <div class="contentTitle">
                        <h3>發送內容</h3>
                    </div>
                    <n-input
                        v-model:value.trim="content"
                        type="textarea"
                        placeholder="請輸入簡訊內容..."
                        :autosize="{
                            minRows: 7,
                            maxRows: 7,
                        }"
                        @focus="commonFocusType"
                        @blur="commonBlurJudge"
                        @input="commonWordCount"
                    />
                </div>
                <div class="messageCount">
                    <div class="messageInfo">
                        <div class="wordCount">{{ word }} 字</div>
                        <div class="numOfMessage">{{ count }} 則</div>
                        <div class="point">{{ point }} 點</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 編輯常用簡訊彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="editCommonMsgPopUp">
            <div class="commonMsg">
                <div class="popUpTitle">
                    <h2>編輯常用簡訊</h2>
                    <img
                        src="@/assets/Images/chatroom/close-round.svg"
                        alt="#"
                        @click="closeEditCommonMsg"
                    />
                </div>
                <div class="commonMsgFunctionBar">
                    <div class="commonMsgConfirm" @click="submitEditCommonMsg">確定</div>
                </div>
                <div class="smsSubject">
                    <div class="subject">
                        <h3>簡訊主旨</h3>
                    </div>
                    <n-input
                        id="input"
                        v-model:value.trim="subject"
                        type="text"
                        placeholder="請輸入簡訊主旨(可不填)"
                    />
                </div>
                <div class="smsSendContent">
                    <div class="contentTitle">
                        <h3>發送內容</h3>
                    </div>
                    <n-input
                        ref="editInputInstRef"
                        v-model:value.trim="content"
                        type="textarea"
                        placeholder="請輸入簡訊內容..."
                        :autosize="{
                            minRows: 7,
                            maxRows: 7,
                        }"
                        @focus="commonFocusType"
                        @blur="commonBlurJudge"
                        @input="commonWordCount"
                    />
                </div>
                <div class="messageCount">
                    <div class="messageInfo">
                        <div class="wordCount">{{ word }} 字</div>
                        <div class="numOfMessage">{{ count }} 則</div>
                        <div class="point">{{ point }} 點</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 刪除常用簡訊提示 -->
    <teleport to="body">
        <div class="mask" v-show="deleteCommonMsgPopUp">
            <div class="deleteCommonMsgPopUp">
                <div class="deleteCommonMsgConfirm">您確定要刪除此常用簡訊!!</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click="deleteCommonMsgPopUp = false">
                        取消
                    </div>
                    <div type="button" class="confirm" @click="removeCommonMsg">確定</div>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script lang="ts">
export default {
    name: "SMSSend",
    inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { onMounted, ref, watch, computed, h, reactive } from "vue";
import {
    NConfigProvider,
    NInput,
    NSpace,
    NDivider,
    NSelect,
    NDataTable,
    NRadio,
    NIcon,
    NPopover,
} from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import TimeSetting from "@/components/backend/TimeSetting.vue";
import OptionSetting from "@/components/backend/OptionSetting.vue";
import { useSmsStore } from "@/store/smsStore";
import { useApiStore } from "@/store/api";
import editIcon from "@/assets/Images/manage/edit-round.svg";
import { pointCalculation } from "@/util/commonUtil";
import config from "@/config/config";
import { HelpCircle } from "@vicons/ionicons5";

//router 設置
const route = useRoute();
const params = route.params;

//api store
const apiStore = useApiStore();
const { eventList, uploadRef: getUploadFile, commonMsgList } = storeToRefs(apiStore);
const { getCommonMsgList, addCommonMsgObj, removeCommonMsgObj, editCommonMsgObj } = apiStore;
//smsStore
const smsStore: any = useSmsStore();
const { smsChannel, smsSubject, smsContent, smsWord, smsCount, smsPoint } = storeToRefs(smsStore);
// 常用簡訊彈窗
const commonMsgPopUp = ref(false);
//新增常用簡訊彈窗
const addCommonMsgPopUp = ref(false);
//編輯常用簡訊彈窗
const editCommonMsgPopUp = ref(false);
//刪除常用訊息彈窗
const deleteCommonMsgPopUp = ref(false);
//常用簡訊v-model
const dataID = ref("");
const subject = ref("");
const content = ref("");
const word = ref(0);
const count = ref(0);
const point = ref(0);

//常用簡訊功能
onMounted(() => {
    if (content.value === "") {
        content.value = demoContent;
    }
});
const commonFocusType = (e: any) => {
    content.value =
        content.value === demoContent || content.value.includes("~ ` ^ { } [ ] | < >")
            ? ""
            : e.target.value;
};
const commonBlurJudge = (e: any) => {
    content.value = content.value === "" ? demoContent : e.target.value;
};
const commonWordCount = () => {
    if (content.value === demoContent || !content.value) {
        content.value = "";
        word.value = 0;
        point.value = 0;
        count.value = 0;
        return;
    }
    count.value = pointCalculation(content.value).smsCount;
    point.value = pointCalculation(content.value).point;
    word.value = content.value.length;
};

//關閉常用訊息
const closeCommonMsg = () => {
    commonMsgPopUp.value = !commonMsgPopUp.value;
    checkedVal.value = null;
};
//刪除提示
const removeHint = () => {
    if (checkedVal.value === null) {
        alert("您尚未選擇要刪除之訊息!!!");
    } else {
        deleteCommonMsgPopUp.value = !deleteCommonMsgPopUp.value;
    }
};
//刪除常用訊息
const removeCommonMsg = () => {
    deleteCommonMsgPopUp.value = !deleteCommonMsgPopUp.value;
    removeCommonMsgObj(checkedVal.value);
    checkedVal.value = null;
};
//新增常用簡訊切換
const addCommonMsg = () => {
    addCommonMsgPopUp.value = !addCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
};
//關閉新增常用簡訊
const closeAddCommonMsg = () => {
    subject.value = "";
    content.value = demoContent;
    word.value = 0;
    count.value = 0;
    point.value = 0;
    checkedVal.value = null;
    addCommonMsgPopUp.value = !addCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
};
//新增訊息
const submitAddCommonMsg = () => {
    if (content.value !== "" && content.value !== demoContent) {
        const addNewCommonMsg = {
            subject: subject.value,
            content: content.value,
        };
        const accountID = localStorage.getItem("accountID");
        addCommonMsgObj(accountID, addNewCommonMsg);
    }
    subject.value = "";
    content.value = demoContent;
    word.value = 0;
    count.value = 0;
    point.value = 0;
    checkedVal.value = null;
    addCommonMsgPopUp.value = !addCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
};
//常用訊息確定
const exportCommonMsg = () => {
    commonMsgPopUp.value = !commonMsgPopUp.value;
    if (checkedVal.value !== null) {
        smsSubject.value = exportData.subject;
        smsContent.value = exportData.content;
    }
    exportData.subject = "";
    exportData.content = "";
    checkedVal.value = null;
    wordCount();
};
//編輯常用簡訊帶入資料
const editCommonMsg = (data) => {
    editCommonMsgPopUp.value = !editCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
    subject.value = data.subject;
    content.value = "";
    content.value = data.content;
    dataID.value = data.smsID;
    checkedVal.value = null;
    commonWordCount();
};
//關閉編輯訊息
const closeEditCommonMsg = () => {
    editCommonMsgPopUp.value = !editCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
    subject.value = "";
    content.value = demoContent;
    dataID.value = "";
    checkedVal.value = null;
    word.value = 0;
    point.value = 0;
    count.value = 0;
};
//送出編輯訊息
const submitEditCommonMsg = () => {
    if (content.value === demoContent) {
        alert("請填寫編輯內容!!!!");
    } else {
        editCommonMsgObj(dataID.value, subject.value, content.value);
        subject.value = "";
        content.value = demoContent;
        dataID.value = "";
        checkedVal.value = null;
        word.value = 0;
        point.value = 0;
        count.value = 0;
        editCommonMsgPopUp.value = !editCommonMsgPopUp.value;
        commonMsgPopUp.value = !commonMsgPopUp.value;
    }
};
//取得常用訊息列表
const getCommonList = () => {
    commonMsgPopUp.value = !commonMsgPopUp.value;
    const accountID = localStorage.getItem("accountID");
    getCommonMsgList(accountID);
};
//儲存至常用訊息
const storeBoolean = ref(false);
const storeToCommonMsg = () => {
    if (smsContent.value !== "" && smsContent.value !== demoContent) {
        const addNewCommonMsg = {
            subject: smsSubject.value,
            content: smsContent.value,
        };
        const accountID = localStorage.getItem("accountID");
        addCommonMsgObj(accountID, addNewCommonMsg);
        alert("已儲存至常用訊息");
        storeBoolean.value = false;
    } else {
        alert("請填寫要儲存的內容");
        storeBoolean.value = false;
    }
};
//dataTable
const createColumns = [
    {
        key: "choose",
        align: "center",
        render(row, index) {
            return h(NRadio, {
                name: "radioChoose",
                value: row.smsID,
                onChange: () => chooseOne(row),
                checked: row.smsID === checkedVal.value,
            });
        },
    },
    {
        title: "標題",
        key: "subject",
        align: "left",
        render(row, index) {
            return h(
                "div",
                {
                    class: "subject",
                },
                row.subject
            );
        },
    },
    {
        title: "簡訊內容",
        key: "content",
        align: "left",
        render(row, index) {
            return h(
                "div",
                {
                    class: "content",
                },
                row.content
            );
        },
    },
    {
        key: "edit",
        align: "right",
        render(row, index) {
            return h(
                "img",
                {
                    class: "edit",
                    src: editIcon,
                    onClick: () => {
                        editCommonMsg(row);
                    },
                },
                row.edit
            );
        },
    },
] as any;
const data: any = computed({
    get() {
        return commonMsgList.value;
    },
    set(val) {
        commonMsgList.value = val;
    },
});
const pagination = {
    pageSize: 9,
};
const checkedVal = ref(null);
const exportData = reactive({
    subject: "",
    content: "",
});
//單選選中資料
const chooseOne = (row: any) => {
    checkedVal.value = row.smsID;
    exportData.subject = row.subject;
    exportData.content = row.content;
};

//textarea dom元素
const errorMsg = ref("");

//簡訊主旨,內容v-model
const demoContent =
    "輸入簡訊內容\n\n說明：\n１.支援『長簡訊』之發送,每則簡訊字數最多可達333（中文）字。\n２.超過333字仍可發送,系統將自動進行拆則。\n３.為使簡訊內容正常呈現於手機中,請勿在簡訊內容中填入~．^)|1>等特殊符號。";

onMounted(() => {
    if (smsContent.value === "") {
        smsContent.value = demoContent;
    }
});

watch(
    () => route.path,
    () => {
        if (smsContent.value === "") {
            smsContent.value = demoContent;
        }
    }
);

// textarea 預設文字
const focusType = (e: any) => {
    smsContent.value =
        smsContent.value === demoContent || smsContent.value.includes("~ ` ^ { } [ ] | < >")
            ? ""
            : e.target.value;
};
const blurJudge = (e: any) => {
    smsContent.value = smsContent.value === "" ? demoContent : e.target.value;
};

const wordCount = () => {
    if (smsContent.value === demoContent || !smsContent.value) {
        smsContent.value = "";
        smsWord.value = 0;
        smsPoint.value = 0;
        smsCount.value = 0;
        return;
    }
    smsCount.value = pointCalculation(smsContent.value).smsCount;
    smsPoint.value = pointCalculation(smsContent.value).point;
    smsWord.value = smsContent.value.length;
};

const uploadRef = computed({
    get() {
        return getUploadFile.value;
    },
    set(val) {
        getUploadFile.value = val;
    },
});
onMounted(() => {
    uploadRef.value = null;
});

const filterChannelList = computed(() => {
    return eventList.value
        .filter((event: any) => {
            return event.status === 1;
        })
        .map((item) => ({
            label: `${item.name}`,
            value: parseInt(`${item.eventID}`),
        }));
});

//下一頁按鈕
const nextPageRouter = `/manage/${params.id}/SMSSendPage2`;
//更改naive-ui主題
const themeOverrides = {
    common: {},
    Input: {
        border: "1px solid #8b8b8b ",
        borderRadius: "4px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-radio {
    --box-shadow-active: inset 0 0 0 1px#ffb400 !important;
    --box-shadow-focus: inset 0 0 0 1px #ffb400 !important;
    --box-shadow-hover: inset 0 0 0 1px #ffb400 !important;
    --dot-color-active: #ffb400 !important;
}
.SMSSend {
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }
}
.mmsImgUpload {
    & .n-upload-file-list {
        display: none;
    }
}
.selectChannel {
    .n-base-selection {
        --border: 1px solid #8b8b8b !important;
        --border-active: 1px solid #8b8b8b !important;
        --border-focus: 1px solid #8b8b8b !important;
        --border-hover: 1px solid #e4e4e4 !important;
        --border-radius: 4px !important;
        --box-shadow-active: none !important;
        --box-shadow-focus: none !important;
        --caret-color: #3e3e3e !important;
        --option-text-color-active: #ffb400 !important;
    }
}
.n-data-table .n-data-table__pagination {
    justify-content: center;
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
}
.commonMsgTable {
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
        vertical-align: middle;
    }
    &.n-data-table .n-data-table-tr:hover {
        background: $primary-4;
    }
    &.n-data-table .n-data-table-tr:hover .n-data-table-td {
        background: none;
    }
    .subject {
        width: 190px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    .content {
        width: 440px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    .edit {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
// 常用簡訊
.mask {
    .commonMsg {
        width: 900px;
        height: 700px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .popUpTitle {
        position: relative;
        h2 {
            text-align: center;
            margin-bottom: 60px;
            font-size: 16px;
            font-weight: 500;
            color: $gray-1;
        }
        img {
            position: absolute;
            right: 0;
            top: 0;
            width: 32px;
            height: 32px;
            cursor: pointer;
        }
    }
    .commonMsgFunctionBar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;
        .commonMsgDel {
            text-align: center;
            width: 100px;
            height: 36px;
            line-height: 36px;
            border-radius: 18px;
            border: 1px solid $danger;
            color: $danger;
            cursor: pointer;
        }
        .commonMsgAdd {
            width: 100px;
            height: 36px;
            background-color: $white;
            line-height: 36px;
            color: $gray-1;
            border: 1px solid $gray-1;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
        .commonMsgConfirm {
            width: 100px;
            height: 36px;
            background-color: $gray-1;
            line-height: 36px;
            color: $white;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
    }
}
//新增常用簡訊
.mask {
    .commonMsg {
    }
    .popUpTitle {
        position: relative;
        h2 {
            text-align: center;
            margin-bottom: 60px;
            font-size: 16px;
            font-weight: 500;
            color: $gray-1;
        }
        img {
            position: absolute;
            right: 0;
            top: 0;
            width: 32px;
            height: 32px;
            cursor: pointer;
        }
    }
    .smsSubject {
        width: 60%;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 30px;
        .subject {
            display: flex;
            margin-bottom: 15px;
            h3 {
                font-size: 14px;
                font-weight: 400;
                color: $gray-1;
                font-family: $font-family;
                margin-top: 5px;
                margin-right: 10px;
                display: inline-block;
                min-width: 56px;
            }
            p {
                font-size: 12px;
                font-weight: 400;
                color: $gray-3;
                font-family: $font-family;
                line-height: 1.6;
            }
        }
    }
    .smsSendContent {
        width: 60%;
        margin: 0 auto;
        .contentTitle {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            h3 {
                font-size: 14px;
                font-weight: 400;
                color: $gray-1;
                font-family: $font-family;
            }
            .commonMessage {
                width: 72px;
                height: 25px;
                line-height: 25px;
                background-color: $primary-1;
                border-radius: 12.5px;
                color: $white;
                font-size: 12px;
                font-weight: 400;
                font-family: $font-family;
                text-align: center;
                cursor: pointer;
            }
            .n-input {
                font-size: 12px;
            }
        }
    }
    .messageCount {
        width: 60%;
        margin: 0 auto;
        margin-top: 15px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .messageInfo {
            display: flex;
            justify-content: space-around;
            width: 330px;
            .wordCount {
                width: 100px;
                padding: 10px 0;
                border-radius: 20px;
                background-color: $primary-4;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .numOfMessage {
                width: 100px;
                padding: 10px 0;
                border-radius: 20px;
                background-color: $primary-4;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .point {
                width: 100px;
                padding: 10px 0;
                border-radius: 20px;
                background-color: $primary-4;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .storeCommonMessage {
            width: 100px;
            height: 25px;
            line-height: 25px;
            background-color: $primary-1;
            border-radius: 12.5px;
            text-align: center;
            cursor: pointer;
            p {
                color: $white;
                font-size: 12px;
                font-weight: 400;
                font-family: $font-family;
            }
        }
    }
}
// 刪除常用簡訊彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .deleteCommonMsgPopUp {
        border-radius: 20px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .deleteCommonMsgConfirm {
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
.SMSSend {
    position: relative;
    display: flex;
    height: calc(100% - 80px);
    background-color: $bg;
    padding: 15px;
    .smsContent {
        background-color: $white;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        overflow-y: auto;
        h2 {
            @extend %h2;
            color: $gray-1;
            font-family: $font-family;
        }
        .smsChannel {
            h3 {
                font-size: 14px;
                font-weight: 400;
                color: $gray-1;
                font-family: $font-family;
                margin-bottom: 15px;
            }
        }
        .smsSubject {
            margin-top: 30px;
            margin-bottom: 30px;
            .subject {
                display: flex;
                margin-bottom: 15px;
                h3 {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    margin-top: 5px;
                    margin-right: 10px;
                    display: inline-block;
                    min-width: 56px;
                }
                p {
                    font-size: 12px;
                    font-weight: 400;
                    color: $gray-3;
                    font-family: $font-family;
                    line-height: 1.6;
                }
            }
        }
        .smsSendContent {
            .contentTitle {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                h3 {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
                .commonMessage {
                    width: 72px;
                    height: 25px;
                    line-height: 25px;
                    background-color: $primary-1;
                    border-radius: 12.5px;
                    color: $white;
                    font-size: 12px;
                    font-weight: 400;
                    font-family: $font-family;
                    text-align: center;
                    cursor: pointer;
                }
                .n-input {
                    font-size: 12px;
                }
            }
        }
        .messageCount {
            margin-top: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .messageInfo {
                display: flex;
                justify-content: space-around;
                width: 330px;
                .wordCount {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .numOfMessage {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .point {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .storeCommonMessage {
                width: 100px;
                height: 25px;
                line-height: 25px;
                background-color: $primary-1;
                border-radius: 12.5px;
                text-align: center;
                cursor: pointer;
                p {
                    color: $white;
                    font-size: 12px;
                    font-weight: 400;
                    font-family: $font-family;
                }
            }
        }
    }
    .smsSetting {
        background-color: #fff;
        margin-left: 15px;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
    }
}
</style>
