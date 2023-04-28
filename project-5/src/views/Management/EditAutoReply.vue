<template>
    <div class="editAutoReply">
        <div class="editAutoReply__subject">
            <h1>標題</h1>
            <n-input
                placeholder="請輸入標題(僅作為識別用，不會顯示於用戶端)"
                v-model:value="autoReplySubject"
            ></n-input>
        </div>
        <div class="editAutoReply__activate-status">
            <div>
                <h1>啟用狀態</h1>
            </div>
            <n-radio-group class="radio-group" v-model:value="statusRadio">
                <div class="active">
                    <n-radio :value="1">啟用</n-radio>
                </div>
                <div class="deactive">
                    <n-radio :value="0">停用</n-radio>
                </div>
            </n-radio-group>
        </div>
        <div class="editAutoReply__time">
            <div>
                <h1>適用日期時間</h1>
                <h1>(UTC+8)</h1>
            </div>
            <n-radio-group class="radio-group" v-model:value="timeRadio">
                <div class="agreedTime">
                    <n-radio :value="0">不指定日期時間</n-radio>
                </div>
                <div class="nonAgreedTime">
                    <n-radio :value="1">指定日期時間</n-radio>
                </div>
            </n-radio-group>
        </div>
        <div class="editAutoReply__timePicker" v-show="timeRadio === 1">
            <div class="dateRange">
                <div>
                    <h1>指定日期區間</h1>
                </div>
                <n-date-picker
                    type="daterange"
                    v-model:value="dateRange"
                    :disabled="disabled"
                    clearable
                ></n-date-picker>
            </div>
            <div class="weekdays">
                <div>
                    <h1>指定星期</h1>
                </div>
                <n-checkbox-group class="selectWeekdays" v-model:value="weekdays">
                    <n-checkbox :value="1">一</n-checkbox>
                    <n-checkbox :value="2">二</n-checkbox>
                    <n-checkbox :value="3">三</n-checkbox>
                    <n-checkbox :value="4">四</n-checkbox>
                    <n-checkbox :value="5">五</n-checkbox>
                    <n-checkbox :value="6">六</n-checkbox>
                    <n-checkbox :value="7">日</n-checkbox>
                </n-checkbox-group>
            </div>
            <div class="selectTime">
                <div>
                    <h1>指定時間區間</h1>
                </div>
                <div class="startTime">
                    <n-time-picker
                        placeholder="開始時間"
                        v-model:value="startTime"
                        format="HH:mm"
                        clearable
                    ></n-time-picker>
                </div>
                <p>至</p>
                <div class="endTime">
                    <n-time-picker
                        placeholder="結束時間"
                        v-model:value="endTime"
                        format="HH:mm"
                        clearable
                    ></n-time-picker>
                </div>
                <p
                    class="crossDay"
                    v-show="startTime > endTime && startTime !== null && endTime !== null"
                >
                    ( 跨日 )
                </p>
            </div>
        </div>
        <div class="editAutoReply__keyWord">
            <h1>關鍵字</h1>
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
            <div class="keyWordInput">
                <n-dynamic-tags v-model:value="keyWord"></n-dynamic-tags>
            </div>
        </div>
        <div class="editAutoReply__content">
            <h1><span>*</span>&thinsp;回覆內容</h1>
            <div
                class="autoReplyInput"
                v-for="(item, index) in autoReplyMsgCount"
                :key="item.janusMsg.config.id"
            >
                <!-- {{ item }} -->
                <div v-if="item.janusMsg.msgType === 1">
                    <n-input
                        type="textarea"
                        placeholder="請輸入自動回覆訊息"
                        :autosize="{
                            minRows: 3,
                        }"
                        v-model:value="item.janusMsg.msgContent"
                    ></n-input>
                </div>
                <div class="welcomeImg" v-else-if="item.janusMsg.msgType === 6">
                    <img
                        :src="`${config.fileUrl}${item.janusMsg.format.Fileid}${item.janusMsg.format.ExtensionName}`"
                        :alt="item.janusMsg.format.ShowName"
                    />
                </div>
                <div class="welcomeFile" v-else-if="item.janusMsg.msgType === 7">
                    <div>
                        <div>
                            <img :src="fileIcon" />
                            <p>{{ item.janusMsg.format.ShowName }}</p>
                        </div>
                    </div>
                </div>
                <div class="welcomeFunctionBar">
                    <img
                        :src="delIcon"
                        alt="del"
                        @click="deleteAutoReplyMsg(item.janusMsg.config.id)"
                    />
                    <div class="welcomeFunctionBarUpload">
                        <span :src="fileIcon" alt="file" v-show="item.janusMsg.msgContent === ''">
                            <input
                                type="file"
                                @change="autoReplyMsgFile($event, index)"
                                :accept="fileAccept"
                            />
                        </span>
                        <span :src="picIcon" alt="圖片" v-show="item.janusMsg.msgContent === ''">
                            <input
                                type="file"
                                @change="autoReplyMsgPicture($event, index)"
                                :accept="imgAccept"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <h2 @click="addAutoReplyMsg">+新增自動回覆訊息</h2>
        </div>
        <div class="button-group">
            <router-link
                class="button--cancel"
                :to="
                    `${route.params.id}`
                        ? `/manage/${route.params.id}/activitySetting`
                        : `/manage/activitySetting`
                "
                >取消</router-link
            >
            <div class="button--del" @click="showDelModal = true">刪除</div>
            <div class="button--save" @click="confirmStore">確認儲存</div>
        </div>
    </div>
    <teleport to="body">
        <div class="mask" v-show="showDelModal">
            <div class="popUp">
                <div class="popUp__Confirm">您確定要刪除此自動回覆訊息!!</div>
                <div class="popUp__button-group">
                    <div type="button" class="button--cancel" @click="showDelModal = false">
                        取消
                    </div>
                    <div type="button" class="button--confirm" @click="deleteMsgAPI">確定</div>
                </div>
            </div>
        </div>
    </teleport>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>
<script lang="ts" setup>
import { ref, reactive, watch, watchEffect, onMounted, computed } from "vue";
import {
    NInput,
    NRadioGroup,
    NRadio,
    NCheckboxGroup,
    NCheckbox,
    NDatePicker,
    NTimePicker,
    NDynamicTags,
    NIcon,
    NPopover,
} from "naive-ui";
import { HelpCircle } from "@vicons/ionicons5";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import axios from "axios";
import Compressor from "compressorjs";
import { useRoute, useRouter } from "vue-router";

import config from "@/config/config";
import { unixTime, currentDate } from "@/util/dateUtil";
import fileIcon from "@/assets/Images/common/file.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import picIcon from "@/assets/Images/chatroom/pic.svg";
import { fileAccept, imgAccept } from "@/util/commonUtil";
import { useApiStore } from "@/store/api";
import router from "@/router";
import { storeToRefs } from "pinia";
import AlertPopUp from "@/components/AlertPopUp.vue";

const apiStore = useApiStore();
const { inquireAutoReplyMsg, editAutoReplyMsg, deleteAutoReplyMsgAPI } = apiStore;
const { autoReplyList, bugout } = storeToRefs(apiStore);
const userName = ref(localStorage.getItem("userName"));
//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
// 單一自動回覆訊息
const eachAutoReplyMsg = computed({
    get() {
        const obj = ref({});
        autoReplyList?.value.forEach((item, index, arr) => {
            obj.value = arr[0];
        });
        return obj.value;
    },
    set(val) {
        autoReplyList.value[0] = val;
    },
}) as any;
//router 設定
const route = useRoute();
const params = route.params;

onMounted(() => {
    inquireAutoReplyMsg(route.query.eventID, route.query.autoID);
});

// v-model
const showDelModal = ref(false);
const autoReplySubject = computed({
    get() {
        return eachAutoReplyMsg.value.subject;
    },
    set(val) {
        eachAutoReplyMsg.value.subject = val;
    },
}) as any;
const dateRange = computed({
    get() {
        const arr =
            !eachAutoReplyMsg.value.startDate || eachAutoReplyMsg.value.startDate === "-28800000000"
                ? null
                : [eachAutoReplyMsg.value.startDate / 1000, eachAutoReplyMsg.value.endDate / 1000];
        return arr;
    },
    set(val) {
        // console.log("datarange", val);
        let daterange = val === null ? null : [val[0], val[1]];
        eachAutoReplyMsg.value.startDate = daterange === null ? 0 : daterange[0] * 1000;
        eachAutoReplyMsg.value.endDate = daterange === null ? 0 : daterange[1] * 1000;
    },
}) as any;
const disabled = ref(false);
const statusRadio = computed({
    get() {
        return +eachAutoReplyMsg.value.status;
    },
    set(val) {
        eachAutoReplyMsg.value.status = val.toString();
    },
}) as any;
const timeRadio = ref(0);
const isApiData = ref(true);
watch(
    () => eachAutoReplyMsg.value.weekday,
    (newVal, oldVal) => {
        if (newVal !== oldVal && oldVal !== undefined) {
            isApiData.value = false;
        }
    }
);
watchEffect(() => {
    if (
        (eachAutoReplyMsg?.value.weekday?.length === 7 ||
            eachAutoReplyMsg?.value.weekday?.length === 0) &&
        eachAutoReplyMsg.value.startDate === "-28800000000" &&
        eachAutoReplyMsg.value.statTime === "1652313600000000" &&
        isApiData.value
    ) {
        timeRadio.value = 0;
    } else {
        timeRadio.value = 1;
    }
});
const weekdays = computed({
    get() {
        const weekday = ref([]);
        weekday.value =
            eachAutoReplyMsg.value.weekday === "" || eachAutoReplyMsg.value.weekday === "1234567"
                ? [1, 2, 3, 4, 5, 6, 7]
                : eachAutoReplyMsg.value?.weekday.split("");
        weekday.value = weekday.value.map((item) => {
            return Number(item);
        });

        return weekday.value;
    },
    set(val: any) {
        val = val.map((item) => {
            return item.toString();
        });
        let str = "";
        val.forEach((item) => {
            str += item;
        });

        eachAutoReplyMsg.value.weekday = str;
    },
}) as any;
const startTime = computed({
    get() {
        const time =
            !eachAutoReplyMsg.value.statTime ||
            eachAutoReplyMsg.value.statTime === "1652313600000000"
                ? null
                : eachAutoReplyMsg.value.statTime / 1000;
        return time;
    },
    set(val: any) {
        eachAutoReplyMsg.value.statTime = val * 1000;
    },
}) as any;
const endTime = computed({
    get() {
        const time =
            !eachAutoReplyMsg.value.endTime || eachAutoReplyMsg.value.endTime === "1652313600000000"
                ? null
                : eachAutoReplyMsg.value.endTime / 1000;
        return time;
    },
    set(val: any) {
        eachAutoReplyMsg.value.endTime = val * 1000;
    },
}) as any;
const keyWord = computed({
    get() {
        let keywordArr = eachAutoReplyMsg.value.keyword
            ? JSON.parse(eachAutoReplyMsg.value.keyword)
            : [];
        return keywordArr;
    },
    set(val) {
        eachAutoReplyMsg.value.keyword = JSON.stringify(val);
    },
}) as any;

//自動回覆訊息陣列
const autoReplyMsgCount: any = computed({
    get() {
        let arr = ref([]);
        arr.value = !eachAutoReplyMsg.value.msg ? [] : JSON.parse(eachAutoReplyMsg.value.msg);

        return arr.value;
    },
    set(val) {
        eachAutoReplyMsg.value.msg = JSON.stringify(val);
    },
});

let autoReplyMsg = reactive({});
//新增自動回覆訊息
const addAutoReplyMsg = () => {
    autoReplyMsg = {
        janusMsg: {
            msgType: 1,
            sender: 0, // 0:客服, 1:使用者
            msgContent: "",
            time: unixTime(),
            type: 2, //1:簡訊 2: 文字
            format: {},
            config: {
                chatroomID: "",
                id: nanoid(),
                isReply: false,
                replyObj: {},
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
            },
        },
    };

    autoReplyMsgCount.value.push(autoReplyMsg);
};
//自動回覆訊息預設值
onMounted(() => {
    autoReplyMsg = {
        janusMsg: {
            msgType: 1,
            sender: 0, // 0:客服, 1:使用者
            msgContent: "",
            time: unixTime(),
            type: 2, //1:簡訊 2: 文字
            format: {},
            config: {
                chatroomID: "",
                id: nanoid(),
                isReply: false,
                replyObj: {},
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
            },
        },
    };
    autoReplyMsgCount.value.push(autoReplyMsg);
});
//刪除自動回覆訊息
const deleteAutoReplyMsg = (id: any) => {
    autoReplyMsgCount.value.forEach((item, index) => {
        if (item.janusMsg.config.id === id) {
            autoReplyMsgCount.value.splice(index, 1);
        }
    });
};
//上傳圖片
const image = ref();
const imageReload = ref(0);
const autoReplyMsgPicture = async (e: any, index: any) => {
    console.log(e);
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) {
        return;
    }
    if (fileName.split(".").pop() === "gif") {
        console.log("gif 檔!!!");
        const fd = new FormData();
        // console.log("file.name:", file);
        fd.append("file", new File([file], file.name, { type: "image/*" }));
        const getToken = localStorage.getItem("access_token");
        await axios({
            method: "post",
            url: `${config.serverUrl}/v1/file`,
            data: fd,
            headers: { Authorization: `Bearer ${getToken}` },
        })
            .then((res) => {
                // console.log("img res:", res);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async (e: any) => {
                    let image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        autoReplyMsg = {
                            janusMsg: {
                                //@ts-ignore
                                ...autoReplyMsg.janusMsg,
                                msgType: 6, //圖片類型
                                format: {
                                    Fileid: res.data.fileid,
                                    ShowName: fileName,
                                    ExtensionName: res.data.ext,
                                    FileSize: file.size,
                                    width: image.width,
                                    height: image.height,
                                    expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                                },
                            },
                        };
                        console.log("welcomeMsg pic:", autoReplyMsg);

                        autoReplyMsgCount.value.splice(index, 1, autoReplyMsg);
                    };
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
    } else {
        console.log("圖片非gif 檔!!!");
        //壓縮圖片套件 compressor js
        new Compressor(file, {
            quality: 0.6,
            async success(result) {
                //呼叫api
                const fd = new FormData();
                // console.log("file.name:", file);
                fd.append("file", new File([result], file.name, { type: "image/*" }));
                const getToken = localStorage.getItem("access_token");
                await axios({
                    method: "post",
                    url: `${config.serverUrl}/v1/file`,
                    data: fd,
                    headers: { Authorization: `Bearer ${getToken}` },
                })
                    .then((res) => {
                        // console.log("img res:", res);
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = async (e: any) => {
                            let image = new Image();
                            image.src = e.target.result;
                            image.onload = function () {
                                autoReplyMsg = {
                                    janusMsg: {
                                        //@ts-ignore
                                        ...autoReplyMsg.janusMsg,
                                        msgType: 6, //圖片類型
                                        format: {
                                            Fileid: res.data.fileid,
                                            ShowName: fileName,
                                            ExtensionName: res.data.ext,
                                            FileSize: file.size,
                                            width: image.width,
                                            height: image.height,
                                            expirationDate: dayjs
                                                .unix(res.data.exp)
                                                .format("YYYY-MM-DD"),
                                        },
                                    },
                                };
                                console.log("welcomeMsg pic:", autoReplyMsg);

                                autoReplyMsgCount.value.splice(index, 1, autoReplyMsg);
                            };
                        };
                    })
                    .catch((err) => {
                        // console.error(err);
                        bugout.value.error(`error-log${userName.value}`, err.response.status);
                        bugout.value.error(`error-log${userName.value}`, err.response.data);
                        bugout.value.error(
                            `error-log${userName.value}`,
                            err.response.request.responseURL
                        );
                    });
            },
            error(err) {
                console.error(err);
            },
        });
    }
};

//上傳檔案
const files = ref();
const autoReplyMsgFile = (e: any, index: any) => {
    console.log(e);
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) {
        return;
    }
    //呼叫api
    const fd = new FormData();
    // console.log("file.name:", file);
    fd.append("file", new File([file], fileName, { type: file.type }));
    const getToken = localStorage.getItem("access_token");
    axios({
        method: "post",
        url: `${config.serverUrl}/v1/file`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: any) => {
                files.value = e.target.result;
                autoReplyMsg = {
                    janusMsg: {
                        //@ts-ignore
                        ...autoReplyMsg.janusMsg,
                        msgType: 7, //圖片類型
                        format: {
                            Fileid: res.data.fileid,
                            ShowName: fileName,
                            ExtensionName: res.data.ext,
                            FileSize: file.size,
                            expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                        },
                    },
                };
                console.log("welcomeMsg file:", autoReplyMsg);

                autoReplyMsgCount.value.splice(index, 1, autoReplyMsg);
            };
        })
        .catch((err) => {
            // console.error(err);
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
    autoReplyMsgCount.value.splice(index, 1, autoReplyMsg);
};
// 確認儲存
const confirmStore = () => {
    const invalid = ref(false);
    if (autoReplyMsgCount.value.length === 0) {
        invalid.value = true;
    }
    autoReplyMsgCount.value.forEach((msg) => {
        if (msg.janusMsg.msgType === 1 && msg.janusMsg.msgContent === "") {
            invalid.value = true;
        }
    });
    if (invalid.value === true) {
        // const keyWordAlert = keyWord.value.length === 0 ? "關鍵字、" : "";
        const replyMsgAlert = invalid.value === true ? "回覆內容" : "";
        alertMessage.value = `尚有  ${replyMsgAlert} 欄位未填寫!!`;
    } else {
        console.log("eventID", route.query.eventID);
        console.log("autoID", route.query.autoID);
        console.log("標題", autoReplySubject.value);
        console.log("啟用狀態", statusRadio.value);
        // console.log("適用日期時間", timeRadio.value);
        console.log(
            "開始日期",
            dateRange.value === null || timeRadio.value === 0 ? 0 : dateRange.value[0] * 1000000
        );
        console.log(
            "結束日期",
            dateRange.value === null || timeRadio.value === 0 ? 0 : dateRange.value[1] * 1000000
        );
        console.log("開始時間", timeRadio.value === 0 ? 0 : startTime.value * 1000000);
        console.log("結束時間", timeRadio.value === 0 ? 0 : endTime.value * 1000000);
        console.log(
            "指定日期",
            weekdays.value.length === 0 ? 0 : weekdays.value.toString().replace(/,/gi, "")
        );
        console.log("關鍵字", JSON.stringify(keyWord.value));
        console.log("回覆內容", autoReplyMsgCount.value);
        const autoReplyData = {
            subject: autoReplySubject.value,
            status: statusRadio.value,
            startDate:
                dateRange.value === null || timeRadio.value === 0
                    ? 0
                    : dateRange.value[0] * 1000000,
            endDate:
                dateRange.value === null || timeRadio.value === 0
                    ? 0
                    : dateRange.value[1] * 1000000,
            startTime: timeRadio.value === 0 ? 0 : startTime.value * 1000000,
            endTime: timeRadio.value === 0 ? 0 : endTime.value * 1000000,
            keyWord: JSON.stringify(keyWord.value),
            msg: autoReplyMsgCount.value,
            weekday:
                weekdays.value.length === 0 || timeRadio.value === 0
                    ? 0
                    : weekdays.value.toString().replace(/,/gi, ""),
            eventID: route.query.eventID,
            autoID: route.query.autoID,
        };
        editAutoReplyMsg(autoReplyData);
        route.params.id
            ? router.push(`/manage/${route.params.id}/activitySetting`)
            : router.push(`/manage/activitySetting`);
    }
};
const deleteMsgAPI = () => {
    deleteAutoReplyMsgAPI(route.query.autoID);
    showDelModal.value = false;
    route.params.id
        ? router.push(`/manage/${route.params.id}/activitySetting`)
        : router.push(`/manage/activitySetting`);
};
</script>
<style lang="scss">
.n-popover {
    width: 350px;
    .pop {
        line-height: 1.6;
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
    .popUp {
        border-radius: 5px;
        width: 342px;
        height: auto;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        &__Confirm {
            font-size: 16px;
        }
        .deleteChannelConfirm {
            font-size: $font-size-16;
            color: $gray-1;
            letter-spacing: -0.1px;
            min-width: 342px;
            text-align: left;
            line-height: 22px;
        }
        &__button-group {
            margin-top: 20px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            .button--cancel {
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
            .button--confirm {
                width: 100px;
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: rgba(223, 54, 54, 0.7);
                color: $white;
                text-align: center;
                &:hover,
                &:active {
                    background-color: #df3636;
                }
            }
        }
    }
}
.radio-group {
    display: flex;
    // flex-direction: column;
    .active {
        margin-bottom: 20px;
    }
    .agreedTime {
        margin-bottom: 20px;
    }
}
.editAutoReply {
    padding: 50px;
    &__subject {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        h1 {
            width: 35px;
            margin-right: 90px;
        }
        .n-input {
            width: 50%;
        }
    }
    &__activate-status {
        display: flex;
        margin-bottom: 20px;
        > div {
            margin-right: 63px;
            h1 {
                margin-bottom: 5px;
            }
        }
    }
    &__time {
        display: flex;
        > div {
            margin-right: 35px;
            h1 {
                margin-bottom: 5px;
            }
        }
    }
    &__timePicker {
        width: 65%;
        margin-left: 123px;
        margin-top: 20px;
        .dateRange {
            display: flex;
            align-items: center;
            > div {
                margin-right: 5px;
            }
        }
        .weekdays {
            display: flex;
            align-items: center;
            margin-top: 20px;
            > div {
                margin-right: 5px;
            }
            .selectWeekdays {
                margin-left: 28px;
            }
        }
        .selectTime {
            display: flex;
            // justify-content: center;
            align-items: center;
            margin-top: 20px;
            > div {
                margin-right: 5px;
            }
            p {
                // margin-left: 5px;
                margin-right: 5px;
            }
            .crossDay {
                color: red;
            }
        }
    }
    &__keyWord {
        display: flex;
        align-items: center;
        margin-top: 20px;
        span {
            color: red;
        }
        .n-icon {
            margin-right: 60px;
        }

        .keyWordInput {
            width: 50%;
            border: 1px solid $gray-3;
            border-radius: 6px;
            padding: 10px;
            display: flex;
            align-items: center;
        }
    }
    &__content {
        margin-top: 20px;
        h1 {
            margin-bottom: 20px;
            span {
                color: red;
            }
        }
        .autoReplyInput {
            width: 50%;
            min-height: 120px;
            border: 1px solid $gray-3;
            margin-bottom: 15px;
            background-color: $gray-8;
            // &:focus {
            //     outline: none;
            // }
            // &:empty:before {
            //     content: attr(data-placeholder);
            //     color: $gray-3;
            // }
            .n-input {
                background-color: $gray-8;
                --border: transparent !important;
            }
            .welcomeImg {
                padding: 5px 5px;
                img {
                    max-height: 80px;
                }
            }
            .welcomeFile {
                padding: 5px 5px;
                > div {
                    height: 80px;
                    > div {
                        display: flex;
                        align-items: center;
                        img {
                            width: 24px;
                            height: 24px;
                        }
                    }
                }
            }
            .welcomeFunctionBar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                img {
                    cursor: pointer;
                }
                .welcomeFunctionBarUpload {
                    display: flex;
                    span {
                        display: block;
                        width: 24px;
                        height: 24px;
                        background-image: url("~@/assets/Images/common/file.svg");
                        background-size: 24px;

                        input {
                            opacity: 0;
                            border: 12px solid #00a;
                            width: 24px;
                            height: 24px;
                            cursor: pointer;
                        }
                    }
                    span + span {
                        display: block;
                        width: 24px;
                        height: 24px;
                        background-image: url("~@/assets/Images/chatroom/pic.svg");
                        background-size: 24px;
                        margin: 0 5px;

                        input {
                            opacity: 0;
                            border: 12px solid #00a;
                            width: 24px;
                            height: 24px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        h2 {
            cursor: pointer;
            color: $primary-1;
        }
    }
}
.button-group {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}
.button {
    &--cancel {
        width: 100px;
        height: 36px;
        line-height: 36px;
        border: 1px solid $gray-1;
        border-radius: 18px;
        text-align: center;
        margin: 0 15px;
        cursor: pointer;
        text-decoration: none;
        color: $gray-1;
    }
    &--del {
        text-align: center;
        width: 100px;
        border-radius: 50px;
        padding: 10px 15px;
        border: 1px solid $danger;
        color: $danger;
        margin-right: 15px;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
        }
    }
    &--save {
        text-decoration: none;
        width: 200px;
        height: 36px;
        line-height: 36px;
        border: 1px solid $gray-1;
        border-radius: 18px;
        text-align: center;
        color: $white;
        background-color: $gray-1;
        margin: 0 15px;
        cursor: pointer;
    }
}
</style>
