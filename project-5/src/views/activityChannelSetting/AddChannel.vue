<template>
    <div class="addChannel">
        <div class="addChannelWrap">
            <div class="addChannelSetting">
                <div class="channelIntroduce">
                    <div class="setting">
                        <div class="iconSetting">
                            <div class="iconTitle">
                                <h1><span>*</span>&ensp;頭像設定</h1>
                                <p>(請上傳商標或形象圖以供辨識)</p>
                            </div>
                            <n-upload
                                @change="uploadAvatar($event)"
                                :accept="imgAccept"
                                type="file"
                            >
                                <div class="addChannelUploadImg">
                                    <img
                                        class="avatarDefault"
                                        :src="photoIcon"
                                        alt="預設圖"
                                        v-if="avatarStatus === 0"
                                    />
                                    <img
                                        class="avatarUpload"
                                        :src="`${config.fileUrl}${avatar.fileid}${avatar.ext}`"
                                        :alt="avatar.fileName"
                                        v-else
                                    />
                                </div>
                            </n-upload>
                        </div>
                        <div class="functionSetting">
                            <h1>功能設定</h1>
                            <div class="freecall">
                                <n-checkbox
                                    v-model:checked="callable"
                                    checked-value="1"
                                    unchecked-value="0"
                                ></n-checkbox>
                                <p>免費通話</p>
                            </div>
                        </div>
                    </div>
                    <div class="activityTitle">
                        <h1><span>*</span>&ensp;活動名稱</h1>
                        <n-input
                            placeholder="請輸入活動名稱"
                            maxlength="25"
                            show-count
                            v-model:value="name"
                        ></n-input>
                    </div>
                    <div class="homeURL">
                        <h1>活動網址</h1>
                        <n-input placeholder="請輸入活動網址" v-model:value="url"></n-input>
                    </div>
                    <div class="introduction">
                        <h1>簡介</h1>
                        <n-input
                            type="textarea"
                            placeholder="當使用者點及頭像即可看到聊天室簡介"
                            maxlength="100"
                            show-count
                            size="small"
                            :autosize="{
                                minRows: 3,
                                maxRows: 3,
                            }"
                            v-model:value="description"
                        ></n-input>
                    </div>
                    <div class="customerService">
                        <div class="customerServiceTitle">
                            <h1>客服人員</h1>
                            <h2 @click="popUp = !popUp">+新增客服人員</h2>
                        </div>
                        <div class="customServiceTagArea">
                            <p v-show="addList.length === 0">請選擇客服人員</p>
                            <div
                                class="staffTag"
                                v-for="(item, index) in addList"
                                :key="item.accountID"
                            >
                                <p v-if="item.accountID !== 0">{{ item.name }}</p>
                                <p v-else>{{ item.nickname }}</p>
                                <img :src="closeIcon" alt="close" @click="deleteStaff(index)" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="welcomeStatus">
                    <div class="welcomeTitle">
                        <h1><span>*</span>&ensp;預設訊息</h1>
                        <p>(最少一則，最多三則)</p>
                    </div>
                    <div class="welcomeInput" v-for="(item, index) in welcomeMsgCount" :key="index">
                        <div v-if="item.janusMsg.msgType === 1">
                            <n-input
                                type="textarea"
                                placeholder="請輸入文字或點擊視窗右下角插入檔案或圖片"
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
                                @click="deleteWelcomeMsg(item.janusMsg.config.id)"
                            />
                            <div class="welcomeFunctionBarUpload">
                                <span
                                    :src="fileIcon"
                                    alt="file"
                                    v-show="item.janusMsg.msgContent === ''"
                                >
                                    <input
                                        type="file"
                                        @change="welcomeFile($event, index)"
                                        :accept="fileAccept"
                                        title="選擇檔案"
                                    />
                                </span>
                                <span
                                    :src="picIcon"
                                    alt="pic"
                                    v-show="item.janusMsg.msgContent === ''"
                                >
                                    <input
                                        type="file"
                                        @change="welcomePicture($event, index)"
                                        :accept="imgAccept"
                                        title="選擇圖片"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <h2 @click="addWelcomeMsg" v-show="welcomeMsgCount.length < 3">
                        +新增歡迎訊息
                    </h2>
                </div>
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
                <PreviewModel
                    :welcomeMsgCount="welcomeMsgCount"
                    :name="name"
                    :avatar="avatarStatus === 1 && `${avatar.fileid}${avatar.ext}`"
                />
                <div v-if="!isDisabled" class="channelStore" @click="goActivityStore">確認儲存</div>
                <div v-else class="channelStore disabled">確認儲存</div>
            </div>
        </div>
    </div>
    <teleport to="body">
        <div class="mask" v-show="popUp === true">
            <div class="customService">
                <div class="customServiceTitle">
                    <h2>客服人員列表</h2>
                </div>
                <n-checkbox-group v-model:value="addList" class="accounts">
                    <ul>
                        <li v-for="(staff, index) in accounts" :key="index">
                            <div class="staffData">
                                <n-checkbox
                                    v-if="staff.accountID !== 0"
                                    class="staff"
                                    :value="staff"
                                    :label="staff.name"
                                />
                                <n-checkbox
                                    v-else
                                    class="staff"
                                    :value="staff"
                                    :label="staff.nickname"
                                />
                            </div>
                        </li>
                    </ul>
                </n-checkbox-group>
                <div class="staffConfirm" @click="popUp = !popUp">確認</div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUpdated, watchEffect } from "vue";
import { NInput, NCheckbox, NCheckboxGroup, NUpload } from "naive-ui";
import { nanoid } from "nanoid";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { storeToRefs } from "pinia";
import Compressor from "compressorjs";
import dayjs from "dayjs";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { unixTime, currentDate } from "@/util/dateUtil";
import PreviewModel from "@/components/PreviewModel";
import photoIcon from "@/assets/Images/manage/Photo.svg";
import closeIcon from "@/assets/Images/manage/round-fill_close.svg";
import fileIcon from "@/assets/Images/common/file.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import picIcon from "@/assets/Images/chatroom/pic.svg";
import config from "@/config/config";
import { fileAccept, imgAccept } from "@/util/commonUtil";

//router 資訊
const router = useRouter();
const route = useRoute();
const params = route.params;

//store 使用
const apiStore = useApiStore();
const { getAccounts } = apiStore;
const { accounts } = storeToRefs(apiStore);
getAccounts();

const isPreview = ref(false);
const onOpenPreview = () => {
    isPreview.value = true;
};
const onClosePreview = () => {
    isPreview.value = false;
};

//v-model
const callable = ref("0");
const name = ref("");
const description = ref("");
const url = ref("");

//頭像上傳功能
const avatarStatus = ref(0);
let avatar = ref({ exp: "", ext: "", fileid: "", fileName: "" });
const uploadAvatar = (e: any) => {
    const file = e.file.file;
    // console.log(e.file.file);
    // const fileName = file.name;
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
                    // console.log("avatar res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e: any) => {
                        avatar.value = {
                            exp: res.data.exp,
                            ext: res.data.ext,
                            fileid: res.data.fileid,
                            fileName: file.name,
                        };
                        avatarStatus.value = 1;
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

const popUp = ref(false);
const addList = ref([]);
//給submit api 的cslist
const csList = ref([]);
onUpdated(() => {
    csList.value = addList.value.map((item) => {
        if (item.accountID === 0) {
            return {
                accountID: item.accountID,
                nickname: item.nickname,
                name: item.name,
            };
        }
        return {
            accountID: item.accountID,
            name: item.name,
        };
    });
});
// 刪除人員tag
const deleteStaff = (i: any) => {
    addList.value.forEach((_, index) => {
        if (index === i) {
            addList.value.splice(index, 1);
        }
    });
};

//歡迎訊息數量
const welcomeMsgCount = ref([]);
let welcomeMsg = reactive({});
const addWelcomeMsg = () => {
    welcomeMsg = {
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
    if (welcomeMsgCount.value.length < 3) {
        welcomeMsgCount.value.push(welcomeMsg);
    }
};
//歡迎訊息預設值
onMounted(() => {
    welcomeMsg = {
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
    welcomeMsgCount.value.push(welcomeMsg);
});

//刪除歡迎訊息
const deleteWelcomeMsg = (id: any) => {
    welcomeMsgCount.value.forEach((item, index) => {
        if (item.janusMsg.config.id === id) {
            welcomeMsgCount.value.splice(index, 1);
        }
    });
};

//上傳圖片
const image = ref();
const welcomePicture = (e: any, index: any) => {
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
                        welcomeMsg = {
                            janusMsg: {
                                //@ts-ignore
                                ...welcomeMsg.janusMsg,
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
                        console.log("welcomeMsg pic:", welcomeMsg);

                        welcomeMsgCount.value.splice(index, 1, welcomeMsg);
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
const welcomeFile = (e: any, index: any) => {
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
                welcomeMsg = {
                    janusMsg: {
                        //@ts-ignore
                        ...welcomeMsg.janusMsg,
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
                console.log("welcomeMsg file:", welcomeMsg);

                welcomeMsgCount.value.splice(index, 1, welcomeMsg);
            };
        })
        .catch((err) => {
            console.error(err);
        });
    welcomeMsgCount.value.splice(index, 1, welcomeMsg);
};

//Chat store
const chatStore = useChatStore();
const { textPlugin, participantList } = storeToRefs(chatStore);

const isDisabled = ref(false);
//確認儲存
const goActivityStore = () => {
    const inValid = ref(false);
    if (welcomeMsgCount.value.length === 0) {
        inValid.value = true;
    }
    welcomeMsgCount.value.forEach((msg) => {
        if (msg.janusMsg.msgType === 1 && msg.janusMsg.msgContent === "") {
            inValid.value = true;
        }
    });
    if (name.value === "" || inValid.value === true || avatarStatus.value !== 1) {
        const channelName = name.value === "" ? "活動名稱、" : "";
        const avatar = avatarStatus.value !== 1 ? "頭像、" : "";
        const welcomeMsg = inValid.value ? "歡迎訊息" : "";
        alert(`尚有 ${channelName}${avatar}${welcomeMsg} 欄位未填寫!!`);
    } else {
        const accountID = localStorage.getItem("accountID") || "[]";
        const channelDataObj = {
            accountID: parseFloat(accountID), // 4
            icon: `${avatar.value.fileid}${avatar.value.ext}`,
            callable: parseInt(callable.value),
            name: name.value,
            homeurl: url.value,
            description: description.value,
            cslist: JSON.stringify(csList.value),
            messageList: JSON.stringify(welcomeMsgCount.value),
        };
        console.log("塞api資料", channelDataObj);
        const fd = new FormData();
        fd.append("accountID", JSON.stringify(channelDataObj.accountID));
        fd.append("icon", channelDataObj.icon);
        fd.append("callable", JSON.stringify(channelDataObj.callable));
        fd.append("name", channelDataObj.name);
        fd.append("homeurl", channelDataObj.homeurl);
        fd.append("description", channelDataObj.description);
        fd.append("cslist", channelDataObj.cslist);
        fd.append("messageList", channelDataObj.messageList);
        const getToken = localStorage.getItem("access_token");
        isDisabled.value = true;
        axios({
            method: "post",
            url: `${config.serverUrl}/v1/Event`,
            data: fd,
            headers: { Authorization: `Bearer ${getToken}` },
        })
            .then((res) => {
                console.log("confirm res", res);
                let msg = {
                    request: "create",
                    room: res.data.id,
                    permanent: true,
                };
                textPlugin.value.send({ message: msg });
                isDisabled.value = false;
                params.id
                    ? router.push(`/manage/${params.id}/activitySetting`)
                    : router.push(`/manage/activitySetting`);
            })
            .catch((err) => {
                isDisabled.value = false;
                console.error(err);
            });
    }
};
</script>
<style lang="scss">
@import "~@/assets/scss/var";
.staff {
    &.n-checkbox .n-checkbox-box .n-checkbox-box__border {
        border: 1px solid #aaa;
    }
}
.staffData {
    .n-ellipsis {
        color: $gray-1;
    }
}
.n-upload-file-list {
    display: none;
}
.introduction .n-input {
    max-width: 100%;
}
.introduction .n-input .n-input-wrapper {
    padding-right: 0px;
}
.introduction .n-input.n-input--textarea .n-input-word-count {
    right: 30px;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.staff {
    margin-right: 10px;
}

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

    .customService {
        width: 400px;
        background-color: $white;
        border-radius: 5px;
        padding: 25px 0px 10px;
        .customServiceTitle {
            display: flex;
            align-items: center;
            padding: 0 20px 10px;
            h2 {
                font-family: $font-family;
                font-size: $font-size-16;
                font-weight: 600;
                color: $gray-1;
            }
        }
        .accounts {
            overflow-y: auto;
            min-height: 200px;
            max-height: 350px;
            ul {
                li {
                    padding: 20px;
                    position: relative;
                    .staffData {
                        display: flex;
                        align-items: center;
                    }

                    &::after {
                        position: absolute;
                        content: "";
                        width: 93%;
                        height: 1px;
                        bottom: 0;
                        background-color: #eeeeee;
                    }
                }
            }
        }
        .staffConfirm {
            width: 100px;
            height: 36px;
            line-height: 36px;
            border: 1px solid $gray-1;
            border-radius: 18px;
            text-align: center;
            color: $white;
            background-color: $gray-1;
            cursor: pointer;
            margin: 30px auto;
        }
    }
}

.addChannel {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    min-height: calc(100% - 80px);
    .addChannelWrap {
        width: 90%;
        background-color: $white;
        margin: 0 auto;
        padding: 30px 50px;

        .addChannelSetting {
            display: flex;
            margin-bottom: 60px;
            .channelIntroduce {
                width: 640px;

                .setting {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    .iconSetting {
                        .iconTitle {
                            margin-bottom: 15px;
                            h1 {
                                font-family: $font-family;
                                font-size: $font-size-16;
                                font-weight: 400;
                                color: $gray-1;
                                margin-right: 10px;
                                span {
                                    color: red;
                                }
                            }
                            p {
                                font-family: $font-family;
                                font-size: $font-size-14;
                                font-weight: 400;
                                color: $gray-3;
                                margin-top: 8px;
                            }
                        }
                        .n-upload {
                            width: 80px;
                            & .n-upload-trigger {
                                width: 80px;
                                border-radius: 50%;
                                .addChannelUploadImg {
                                    width: 80px;
                                    height: 80px;
                                    border: 1px dashed $gray-3;
                                    background-color: $gray-8;
                                    border-radius: 50%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    cursor: pointer;
                                    .avatarUpload {
                                        width: 80px;
                                        height: 80px;
                                        border-radius: 50%;
                                    }
                                }
                            }
                            & .n-upload-file-list {
                                display: none !important;
                            }
                        }
                    }
                    .functionSetting {
                        h1 {
                            font-family: $font-family;
                            font-size: $font-size-16;
                            font-weight: 400;
                            color: $gray-1;
                            margin-right: 10px;
                            margin-bottom: 17px;
                        }
                        .freecall {
                            display: flex;
                            align-items: center;
                            p {
                                margin-left: 15px;
                                font-family: $font-family;
                                font-size: $font-size-14;
                                font-weight: 400;
                                color: $gray-3;
                            }
                        }
                    }
                }
                .activityTitle {
                    margin-bottom: 30px;
                    h1 {
                        margin-bottom: 15px;
                        span {
                            color: red;
                        }
                    }
                }
                .homeURL {
                    margin-bottom: 30px;
                    h1 {
                        margin-bottom: 15px;
                    }
                }
                .introduction {
                    margin-bottom: 30px;
                    h1 {
                        margin-bottom: 15px;
                    }
                }
                .customerService {
                    .customerServiceTitle {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        h1 {
                            margin-bottom: 15px;
                        }
                        h2 {
                            color: $primary-1;
                            cursor: pointer;
                        }
                    }
                    .customServiceTagArea {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        border: 1px solid $gray-3;
                        min-height: 34px;
                        border-radius: 4px;
                        padding: 0 5px;
                        // overflow-y: auto;
                        > p {
                            margin-left: 5px;
                            color: $gray-4;
                        }
                        .staffTag {
                            background-color: $primary-4;
                            height: 25px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border-radius: 20px;
                            padding: 5px 10px;
                            margin: 5px 5px;
                            p {
                                color: $gray-1;
                            }
                            img {
                                margin-left: 5px;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .welcomeStatus {
                margin-left: 100px;
                width: 45%;
                .welcomeTitle {
                    display: flex;
                    h1 {
                        font-family: $font-family;
                        font-size: $font-size-16;
                        font-weight: 400;
                        color: $gray-1;
                        margin-right: 10px;
                        margin-bottom: 17px;
                        span {
                            color: red;
                        }
                    }
                    p {
                        margin-left: 15px;
                        font-family: $font-family;
                        font-size: $font-size-14;
                        font-weight: 400;
                        color: $gray-3;
                    }
                }
                .welcomeInput {
                    width: 100%;
                    min-height: 100px;
                    border: 1px solid $gray-3;
                    margin-bottom: 15px;
                    background-color: $gray-8;
                    &:focus {
                        outline: none;
                    }
                    &:empty:before {
                        content: attr(data-placeholder);
                        color: $gray-3;
                    }
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
                    text-align: right;
                    cursor: pointer;
                    color: $primary-1;
                }
            }
        }
        .channelButtonGroup {
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
                &.disabled {
                    background-color: $gray-4;
                    border: 1px solid $gray-4;
                    cursor: default;
                }
            }
        }
    }
}
</style>
