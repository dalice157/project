<template>
    <div class="addAutoReply">
        <div class="addAutoReply__subject">
            <h1>標題</h1>
            <n-input
                placeholder="請輸入標題(僅作為識別用，不會顯示於用戶端)"
                v-model:value="autoReplySubject"
            ></n-input>
        </div>
        <div class="addAutoReply__status">
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
        <div class="addAutoReply__time">
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
        <div class="addAutoReply__timePicker" v-show="timeRadio === 1">
            <div class="date-range">
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
                <n-checkbox-group class="weekdays__select-weekday" v-model:value="weekdays">
                    <n-checkbox :value="1">一</n-checkbox>
                    <n-checkbox :value="2">二</n-checkbox>
                    <n-checkbox :value="3">三</n-checkbox>
                    <n-checkbox :value="4">四</n-checkbox>
                    <n-checkbox :value="5">五</n-checkbox>
                    <n-checkbox :value="6">六</n-checkbox>
                    <n-checkbox :value="7">日</n-checkbox>
                </n-checkbox-group>
            </div>
            <div class="weekdays__select-time">
                <div>
                    <h1>指定時間區間</h1>
                </div>
                <div class="start-time">
                    <n-time-picker
                        placeholder="開始時間"
                        v-model:value="startTime"
                        format="HH:mm"
                        clearable
                    ></n-time-picker>
                </div>
                <p>至</p>
                <div class="end-time">
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
        <div class="addAutoReply__keyWord">
            <h1>關鍵字</h1>
            <n-popover trigger="hover" placement="bottom">
                <template #trigger>
                    <n-icon size="20">
                        <help-circle />
                    </n-icon>
                </template>
                <span class="keyWord__pop"
                    >系統會在收到與關鍵字完全一致的訊息時自動回傳訊息，未輸入則在不符合其他關鍵字時自動回傳訊息。</span
                >
            </n-popover>
            <div class="keyWord__input">
                <n-dynamic-tags v-model:value="keyWord"></n-dynamic-tags>
            </div>
        </div>
        <div class="addAutoReply__content">
            <h1><span>*</span>&thinsp;回覆內容</h1>
            <div
                class="content"
                v-for="(item, index) in autoReplyMsgCount"
                :key="item.janusMsg.config.id"
            >
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
                <div class="content__img" v-else-if="item.janusMsg.msgType === 6">
                    <img
                        :src="`${config.fileUrl}${item.janusMsg.format.Fileid}${item.janusMsg.format.ExtensionName}`"
                        :alt="item.janusMsg.format.ShowName"
                    />
                </div>
                <div class="content__file" v-else-if="item.janusMsg.msgType === 7">
                    <div>
                        <div>
                            <img :src="fileIcon" />
                            <p>{{ item.janusMsg.format.ShowName }}</p>
                        </div>
                    </div>
                </div>
                <div class="content__function-bar">
                    <img
                        :src="delIcon"
                        alt="del"
                        @click="deleteAutoReplyMsg(item.janusMsg.config.id)"
                    />
                    <div class="function-bar__upload">
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
            <div class="button--save" @click="confirmStore">確認儲存</div>
            <!-- :to="
                    `${route.params.id}`
                        ? `/manage/${route.params.id}/activitySetting`
                        : `/manage/activitySetting`
                " -->
        </div>
    </div>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted } from "vue";
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

import AlertPopUp from "@/components/AlertPopUp.vue";
import config from "@/config/config";
import { unixTime, currentDate } from "@/util/dateUtil";
import fileIcon from "@/assets/Images/common/file.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import picIcon from "@/assets/Images/chatroom/pic.svg";
import { fileAccept, imgAccept } from "@/util/commonUtil";
import { useApiStore } from "@/store/api";
import router from "@/router";

const apiStore = useApiStore();
const { autoReplyMsgAPI, bugout } = apiStore;
//router 設定
const route = useRoute();
const params = route.params;

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

// v-model
const autoReplySubject = ref("");
const dateRange = ref(null);
const disabled = ref(false);
const statusRadio = ref(1);
const timeRadio = ref(0);
const weekdays = ref([1, 2, 3, 4, 5, 6, 7]);
const startTime = ref(null);
const endTime = ref(null);
const keyWord = ref([]);
const userName = ref(localStorage.getItem("userName"));

watchEffect(() => {
    // 關鍵字長度限制
    keyWord.value.forEach((item, idx) => {
        if (item.length > 30) {
            keyWord.value.splice(idx, 1);
            alertMessage.value = "關鍵字不得超過30位數";
        }
    });
});
//自動回覆訊息陣列
const autoReplyMsgCount = ref([]);
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
            chatroomID: "",
            msgType: 1,
            sender: 0, // 0:客服, 1:使用者
            msgContent: "",
            time: unixTime(),
            type: 2, //1:簡訊 2: 文字
            format: {},
            config: {
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
        console.log("gif檔!!!");
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
        console.log("圖片非 gif 檔!!!");
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
        console.log("標題", autoReplySubject.value);
        console.log("啟用狀態", statusRadio.value);
        // console.log("適用日期時間", timeRadio.value);
        console.log("datarange", dateRange.value);
        console.log("開始日期", dateRange.value === null ? 0 : dateRange.value[0] * 1000000);
        console.log("結束日期", dateRange.value === null ? 0 : dateRange.value[1] * 1000000);
        console.log("開始時間", startTime.value * 1000000);
        console.log("結束時間", endTime.value * 1000000);
        console.log(
            "指定日期",
            weekdays.value.length === 0 ? 0 : weekdays.value.toString().replace(/,/gi, "")
        );
        console.log("關鍵字", keyWord.value);
        console.log("回覆內容", autoReplyMsgCount.value);
        const autoReplyData = {
            subject: autoReplySubject.value,
            status: statusRadio.value,
            startDate: dateRange.value === null ? 0 : dateRange.value[0] * 1000000,
            endDate: dateRange.value === null ? 0 : dateRange.value[1] * 1000000,
            startTime: startTime.value === 0 ? 0 : startTime.value * 1000000,
            endTime: endTime.value === 0 ? 0 : endTime.value * 1000000,
            keyWord: keyWord.value,
            msg: autoReplyMsgCount.value,
            weekday: weekdays.value.length === 0 ? 0 : weekdays.value.toString().replace(/,/gi, ""),
            eventID: route.query.eventID,
        };
        autoReplyMsgAPI(autoReplyData);
        route.params.id
            ? router.push(`/manage/${route.params.id}/activitySetting`)
            : router.push(`/manage/activitySetting`);
    }
};
</script>
<style lang="scss">
.n-popover {
    width: 350px;
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
.radio-group {
    display: flex;
    flex-direction: column;
    .active {
        margin-bottom: 20px;
    }
    .agreedTime {
        margin-bottom: 20px;
    }
}

.keyWord {
    &__input {
        width: 50%;
        border: 1px solid $gray-3;
        border-radius: 6px;
        padding: 10px;
        display: flex;
        align-items: center;
    }
    &__pop {
        line-height: 1.6;
    }
}

.date-range {
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
    &__select-weekday {
        margin-left: 28px;
    }

    &__select-time {
        display: flex;
        // justify-content: center;
        align-items: center;
        margin-top: 20px;
        > div {
            margin-right: 5px;
        }
        p {
            margin-right: 5px;
        }
        .crossDay {
            color: red;
        }
    }
}
.addAutoReply {
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
    &__status {
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
    }
    &__content {
        margin-top: 20px;
        h1 {
            margin-bottom: 20px;
            span {
                color: red;
            }
        }

        h2 {
            width: 130px;
            cursor: pointer;
            color: $primary-1;
        }
    }
}
.content {
    width: 50%;
    min-height: 120px;
    border: 1px solid $gray-3;
    margin-bottom: 15px;
    background-color: $gray-8;
    .n-input {
        background-color: $gray-8;
        --border: transparent !important;
    }
    &__img {
        padding: 5px 5px;
        img {
            max-height: 80px;
        }
    }
    &__file {
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
    &__function-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        img {
            cursor: pointer;
        }
    }
}
.function-bar__upload {
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
.button-group {
    margin-top: 50px;
    margin-bottom: 50px;
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
