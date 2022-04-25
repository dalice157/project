<template>
    <div class="addAutoReply">
        <div class="autoReplySubject">
            <h1>標題</h1>
            <n-input placeholder="請輸入標題(僅作為識別用，不會顯示於用戶端)"></n-input>
        </div>
        <div class="addAutoReplyTime">
            <div>
                <h1>適用日期時間</h1>
                <h1>(UTC+8)</h1>
            </div>
            <n-radio-group class="autoReplyRadioGroup" v-model:value="radio">
                <div class="agreedTime">
                    <n-radio :value="0">不指定日期時間</n-radio>
                </div>
                <div class="nonAgreedTime">
                    <n-radio :value="1">指定日期時間</n-radio>
                </div>
            </n-radio-group>
        </div>
        <div class="autoReplyTimePicker" v-show="timePopUp">
            <div class="dateRange">
                <n-date-picker type="daterange" clearable></n-date-picker>
            </div>
            <div class="selectTime">
                <div class="startTime">
                    <n-time-picker placeholder="開始時間" format="h:mm" clearable></n-time-picker>
                </div>
                <p>至</p>
                <div class="endTime">
                    <n-time-picker placeholder="結束時間" format="h:mm" clearable></n-time-picker>
                </div>
            </div>
        </div>
        <div class="autoReplyKeyWord">
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
                <n-dynamic-tags></n-dynamic-tags>
            </div>
        </div>
        <div class="autoReplyContent">
            <h1>回覆內容</h1>
            <div class="autoReplyInput" v-for="(item, index) in autoReplyMsgCount" :key="item.id">
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
        <div class="channelButtonGroup">
            <router-link
                class="channelCancel"
                :to="
                    `${route.params.id}`
                        ? `/manage/${route.params.id}/activitySetting`
                        : `/manage/activitySetting`
                "
                >取消</router-link
            >
            <router-link
                class="channelStore"
                :to="
                    `${route.params.id}`
                        ? `/manage/${route.params.id}/activitySetting`
                        : `/manage/activitySetting`
                "
                >確認儲存</router-link
            >
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted } from "vue";
import {
    NInput,
    NRadioGroup,
    NRadio,
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

//router 設定
const route = useRoute();
const params = route.params;

const radio = ref(0);
const timePopUp = ref(false);
watchEffect(() => {
    if (radio.value === 1) {
        timePopUp.value = true;
    } else {
        timePopUp.value = false;
    }
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
                replyObj: "",
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
                replyObj: "",
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
const autoReplyMsgPicture = (e: any, index: any) => {
    console.log(e);
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) {
        return;
    }
    //壓縮圖片套件 compressor js
    new Compressor(file, {
        quality: 0.6,
        success(result) {
            //呼叫api
            const fd = new FormData();
            // console.log("file.name:", file);
            fd.append("file", new File([result], file.name, { type: "image/*" }));
            const getToken = localStorage.getItem("access_token");
            axios({
                method: "post",
                url: `${config.serverUrl}/v1/file`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    // console.log("img res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e: any) => {
                        image.value = e.target.result;
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
                                    expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                                },
                            },
                        };
                        console.log("welcomeMsg pic:", autoReplyMsg);

                        autoReplyMsgCount.value.splice(index, 1, autoReplyMsg);
                    };
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        error(err) {
            console.error(err);
        },
    });
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
            console.error(err);
        });
    autoReplyMsgCount.value.splice(index, 1, autoReplyMsg);
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
.addAutoReply {
    padding: 50px;
    .autoReplySubject {
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
    .addAutoReplyTime {
        display: flex;
        > div {
            margin-right: 35px;
            h1 {
                margin-bottom: 5px;
            }
        }
        .autoReplyRadioGroup {
            display: flex;
            flex-direction: column;
            .agreedTime {
                margin-bottom: 20px;
            }
            .nonAgreedTime {
            }
        }
    }
    .autoReplyTimePicker {
        width: 50%;
        margin-left: 123px;
        margin-top: 20px;
        .dateRange {
        }
        .selectTime {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            p {
                margin-left: 5px;
                margin-right: 5px;
            }
        }
    }
    .autoReplyKeyWord {
        display: flex;
        align-items: center;
        margin-top: 20px;

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
    .autoReplyContent {
        margin-top: 20px;
        h1 {
            margin-bottom: 20px;
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
    .channelButtonGroup {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        .channelCancel {
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

        .channelStore {
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
}
</style>
