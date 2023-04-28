<template>
    <div class="addChannel">
        <div class="addChannel__wrap">
            <div class="container">
                <div class="container__introduce">
                    <div class="setting">
                        <div class="setting__icon" id="guide5">
                            <div class="avatar">
                                <h1><span>*</span>&ensp;頭像設定</h1>
                                <p>(請上傳商標或形象圖以供辨識)</p>
                            </div>
                            <n-upload
                                @change="uploadAvatar($event)"
                                :accept="avatarAccept"
                                type="file"
                            >
                                <div class="upload-avatar">
                                    <img
                                        class="upload-avatar--default"
                                        :src="photoIcon"
                                        alt="預設圖"
                                        v-if="avatarStatus === 0"
                                    />
                                    <img
                                        class="upload-avatar--active"
                                        :src="avatarURL"
                                        :alt="avatar.fileName"
                                        v-else
                                    />
                                    <!-- <img
                                        class="upload-avatar--active"
                                        :src="`${config.fileUrl}${avatar.fileid}${avatar.ext}`"
                                        :alt="avatar.fileName"
                                        v-else
                                    /> -->
                                </div>
                            </n-upload>
                        </div>
                    </div>
                    <div class="setting__function">
                        <div class="presetChannel">
                            <h1>設為預設頻道</h1>
                            <n-switch
                                v-model:value="preset"
                                checked-value="1"
                                unchecked-value="0"
                                :disabled="disabled"
                            />
                        </div>
                        <div class="freecall">
                            <h1>免費通話</h1>
                            <n-switch
                                v-model:value="callable"
                                checked-value="1"
                                unchecked-value="0"
                            />
                        </div>
                        <div class="notInteract">
                            <div>
                                <h1>拒絕對方回覆</h1>
                                <n-popover trigger="hover" placement="right">
                                    <template #trigger>
                                        <n-icon :depth="3" size="22">
                                            <help-circle-outline />
                                        </n-icon>
                                    </template>
                                    <span class="pop"
                                        >若啟用此功能，對方僅能看到您所設定的「預設訊息」且無法回覆，您於此頻道不會收到任何訊息。
                                    </span>
                                </n-popover>
                            </div>
                            <div>
                                <n-switch
                                    v-model:value="interactOption"
                                    checked-value="1"
                                    unchecked-value="0"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="setting__title" id="guide5-1">
                        <h1><span>*</span>&ensp;活動名稱</h1>
                        <n-input
                            placeholder="請輸入活動名稱"
                            maxlength="25"
                            show-count
                            v-model:value="name"
                        ></n-input>
                    </div>
                    <div class="setting__URL" id="guide5-2">
                        <h1>活動網址</h1>
                        <n-input placeholder="請輸入活動網址" v-model:value="url"></n-input>
                    </div>
                    <div class="setting__introduction" id="guide5-3">
                        <h1>簡介</h1>
                        <n-input
                            type="textarea"
                            placeholder="當使用者點擊頭像即可看到聊天室簡介"
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
                    <div class="setting__staff">
                        <div class="staff__title">
                            <h1>客服人員</h1>
                            <h2 @click="popUp = !popUp">+新增客服人員</h2>
                        </div>
                        <div class="staff__tags">
                            <p v-show="tagList.length === 0">請選擇客服人員</p>
                            <div class="staff__tag" v-for="item in tagList" :key="item.name">
                                <p v-if="item.accountID !== 0">{{ item.name }}</p>
                                <p v-else>{{ item.nickname }}</p>
                                <img
                                    class="close"
                                    v-if="item.name !== accountName"
                                    :src="closeIcon"
                                    alt="close"
                                    @click="deleteStaff(item)"
                                />
                                <img
                                    class="closeDefault"
                                    v-else
                                    :src="closeDefaultIcon"
                                    :alt="item.accountID"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="setting__welcomeMsg">
                    <div class="welcome__title">
                        <h1><span>*</span>&ensp;預設訊息</h1>
                        <p>(最少一則，最多三則)</p>
                    </div>
                    <div
                        class="welcome__messages"
                        v-for="(item, index) in welcomeMsgCount"
                        :key="item.janusMsg.config.id"
                    >
                        <!-- {{ item.janusMsg.config.id }} -->
                        <div v-if="item.janusMsg.msgType === 1">
                            <n-input
                                type="textarea"
                                placeholder="請輸入文字或點擊視窗右下角插入檔案或圖片"
                                :autosize="{
                                    minRows: 3,
                                    maxRows: 3,
                                }"
                                v-model:value="item.janusMsg.msgContent"
                            ></n-input>
                        </div>
                        <div class="welcome__messages__img" v-else-if="item.janusMsg.msgType === 6">
                            <img
                                :src="`${config.fileUrl}${item.janusMsg.format.Fileid}${item.janusMsg.format.ExtensionName}`"
                                :alt="item.janusMsg.format.ShowName"
                            />
                        </div>
                        <div
                            class="welcome__messages__file"
                            v-else-if="item.janusMsg.msgType === 7"
                        >
                            <div>
                                <div>
                                    <img :src="fileIcon" />
                                    <p>{{ item.janusMsg.format.ShowName }}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            class="welcome__messages__video"
                            v-else-if="item.janusMsg.msgType === 11"
                        >
                            <video controls playsinline width="200">
                                <source
                                    :src="`${config.fileUrl}${item.janusMsg.format.Fileid}${item.janusMsg.format.ExtensionName}`"
                                />
                            </video>
                        </div>
                        <div class="welcome__messages__function-bar">
                            <img
                                :src="delIcon"
                                alt="del"
                                @click="deleteWelcomeMsg(item.janusMsg.config.id)"
                            />
                            <div class="function-bar__upload">
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
                                <img
                                    v-show="index !== 0"
                                    :src="upward"
                                    alt="向上移"
                                    @click="moveUp(index)"
                                />
                                <img
                                    v-show="index !== welcomeMsgCount.length - 1"
                                    :src="downward"
                                    alt="向下移"
                                    @click="moveDown(index)"
                                />
                            </div>
                        </div>
                    </div>
                    <h2 id="guide6" @click="addWelcomeMsg" v-show="welcomeMsgCount.length < 3">
                        +新增預設訊息
                    </h2>
                </div>
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
                <PreviewModel
                    :welcomeMsgCount="welcomeMsgCount"
                    :interactOption="interactOption"
                    :name="name"
                    :avatar="avatarStatus === 1 ? `${avatar.fileid}${avatar.ext}` : '0'"
                />
                <div v-if="!isDisabled" class="button--save" @click="goActivityStore">確認儲存</div>
                <div v-else class="button--disabled">確認儲存</div>
            </div>
        </div>
    </div>
    <teleport to="body">
        <div class="mask" v-show="popUp === true">
            <div class="staff-model">
                <div class="staff-model__title">
                    <h2>客服人員列表</h2>
                </div>
                <p v-if="accounts.length === 0">尚無客服人員</p>
                <n-checkbox-group v-model:value="addList" class="staff-model__checkbox-group">
                    <ul>
                        <li v-for="(staff, index) in accounts" :key="index">
                            <div class="staff__checkbox">
                                <n-checkbox
                                    v-if="staff.accountID !== 0"
                                    :value="staff.name"
                                    :label="staff.name"
                                    :disabled="staff.name === accountName"
                                />
                                <n-checkbox
                                    v-else
                                    :value="staff.nickname"
                                    :label="staff.nickname"
                                    :disabled="staff.nickname === accountName"
                                />
                            </div>
                        </li>
                    </ul>
                </n-checkbox-group>
                <div class="staff-model__confirm" @click="confirmList">確認</div>
            </div>
        </div>
    </teleport>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUpdated, watch } from "vue";
import { NInput, NCheckbox, NCheckboxGroup, NUpload, NSwitch, NPopover, NIcon } from "naive-ui";
import { HelpCircleOutline } from "@vicons/ionicons5";
import { nanoid } from "nanoid";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { storeToRefs } from "pinia";
import Compressor from "compressorjs";
import dayjs from "dayjs";
import { isProduction, tokenExpireToLogin } from "@/util/commonUtil";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { unixTime, currentDate } from "@/util/dateUtil";
import PreviewModel from "@/components/PreviewModel";
import photoIcon from "@/assets/Images/manage/Photo.svg";
import closeIcon from "@/assets/Images/manage/round-fill_close.svg";
import closeDefaultIcon from "@/assets/Images/search/round-fill_close.svg";
import fileIcon from "@/assets/Images/common/file.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import picIcon from "@/assets/Images/chatroom/pic.svg";
import upward from "@/assets/Images/manage/arrow-up-outline.svg";
import downward from "@/assets/Images/manage/arrow-down-outline.svg";
import config from "@/config/config";
import { fileAccept, imgAccept } from "@/util/commonUtil";
import AlertPopUp from "@/components/AlertPopUp.vue";

//router 資訊
const router = useRouter();
const route = useRoute();
const params = route.params;
const userName = ref(localStorage.getItem("useName"));
//api store
const apiStore = useApiStore();
// const { getAccounts } = apiStore;
const { accounts, bugout } = storeToRefs(apiStore);

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

const avatarAccept = "image/png, image/jpeg";
const isPreview = ref(false);
const onOpenPreview = () => {
    isPreview.value = true;
};
const onClosePreview = () => {
    isPreview.value = false;
};

//v-model
const callable = ref("0");
const interactOption = ref("0");
const preset = ref(route.query.adminCount == "0" ? "1" : "0");
const disabled = ref(route.query.adminCount == "0" ? true : false);
const name = ref("");
const description = ref("");
const url = ref("");
//監聽 拒絕對方回覆或免費通話只能擇一開啟
watch(callable, (val) => {
    if (val === "1") {
        interactOption.value = "0";
    }
});
watch(interactOption, (val) => {
    if (val === "1") {
        callable.value = "0";
    }
});
//頭像上傳功能
const avatarStatus = ref(0);
const avatar = ref({ exp: "", ext: "", fileid: "", fileName: "" });
const uploadAvatar = (e: any) => {
    const file = e.file.file;
    if (!file) {
        return;
    }
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
                    console.log("uploadAvatar res:", res);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = (e: any) => {
                    //     // avatarStatus.value = 1;
                    // };
                    avatar.value = {
                        exp: res.data.exp,
                        ext: res.data.ext,
                        fileid: res.data.fileid,
                        fileName: file.name,
                    };
                    downloadPicture();
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
};
const avatarURL = ref(null);
let i = 0;
//取圖片路徑
const downloadPicture = async () => {
    console.log("avatar", avatar.value);
    await axios({
        method: "get",
        url: `${config.serverUrl}/file/${avatar.value.fileid}${avatar.value.ext}`,
        responseType: "blob",
    })
        .then((res) => {
            // console.log("avatarDownload res", res);
            i = 0;
            const url = window.URL.createObjectURL(new Blob([res.data]));
            avatarURL.value = url;
            avatarStatus.value = 1;
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            if (i < 3) {
                i++;
                setTimeout(() => {
                    downloadPicture();
                    console.log(`下載圖片失敗第${i}次`);
                }, 1000);
            } else {
                i = 0;
                alertMessage.value = "網路異常,請重新上傳";
            }
        });
};

const popUp = ref(false);
const addList = ref([]);
const tagList = ref([]);
const accountName = ref(localStorage.getItem("account"));

//總客服人員api
const getAccounts = async () => {
    const getToken = localStorage.getItem("access_token");
    const accountID = Number(localStorage.getItem("accountID"));
    await axios
        .get(`${config.serverUrl}/v1/accounts`, {
            headers: {
                Authorization: `Bearer ${getToken}`,
            },
        })
        .then((res: any) => {
            accounts.value = res.data.accounts;
            console.log("總客服人員", accounts.value);
            //自動帶入創建者
            let list;
            list = accounts.value.filter((account) => {
                if (account.accountID == "0") {
                    return account.nickname === accountName.value;
                } else {
                    return account.name === accountName.value;
                }
            });
            // 標籤
            tagList.value = list;
            //checkbox 勾選
            addList.value = list.map((item) => item.name);
        })
        .catch((err: any) => {
            bugout.value.error(`error-log${this.userName}`, err.response.status);
            bugout.value.error(`error-log${this.userName}`, err.response.data);
            bugout.value.error(`error-log${this.userName}`, err.response.request.responseURL);
            if (err.response && err.response.data.msg === "沒有管理人員") {
                accounts.value = [];
            }
            console.error("getAccounts err", err.response);
            tokenExpireToLogin(err);
        });
};
getAccounts();

//新增客服人員 儲存按鈕
const confirmList = () => {
    let list;
    list = accounts.value
        .filter((account) => {
            if (account.accountID !== 0) {
                return addList.value.includes(`${account.name}`);
            } else {
                return addList.value.includes(`${account.nickname}`);
            }
        })
        .map((account) => {
            if (account.name === accountName.value) {
                return {
                    ...account,
                    owner: true,
                };
            } else {
                return {
                    ...account,
                    owner: false,
                };
            }
        });
    tagList.value = list;
    tagList.value.sort((a, b) => b.owner - a.owner);
    popUp.value = !popUp.value;
};
// 刪除人員tag
const deleteStaff = (item: any) => {
    console.log("deleteStaff prop", item);
    // 變更checkbox陣列
    addList.value = addList.value.filter((list) => {
        if (item.accountID !== 0) {
            return item.name !== list;
        } else {
            return item.nickname !== list;
        }
    });
    // 變更tag陣列
    tagList.value = tagList.value.filter((tag) => {
        if (item.accountID !== 0) {
            return item.name !== tag.name;
        } else {
            return item.nickname !== tag.nickname;
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
                replyObj: {},
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: true,
                isWelcomeMsg: true,
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
                replyObj: {},
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: true,
                isWelcomeMsg: true,
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
const imageReload = ref(0);
const welcomePicture = async (e: any, index: any) => {
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
                reader.onload = (e: any) => {
                    let image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        welcomeMsg = {
                            janusMsg: {
                                msgType: 6, //圖片類型
                                sender: 0, // 0:客服, 1:使用者
                                msgContent: "",
                                time: unixTime(),
                                type: 2, //1:簡訊 2: 文字
                                format: {
                                    Fileid: res.data.fileid,
                                    ShowName: fileName,
                                    ExtensionName: res.data.ext,
                                    FileSize: file.size,
                                    width: image.width,
                                    height: image.height,
                                    expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                                },
                                config: {
                                    chatroomID: "",
                                    id: nanoid(),
                                    isReply: false,
                                    replyObj: {},
                                    currentDate: currentDate(),
                                    isExpire: false,
                                    isPlay: false,
                                    isRead: true,
                                    isWelcomeMsg: true,
                                    msgFunctionStatus: false,
                                    msgMoreStatus: false,
                                    recallPopUp: false,
                                    recallStatus: false,
                                },
                            },
                        };
                        // console.log("welcomeMsg pic:", welcomeMsg);
                        welcomeMsgCount.value.splice(index, 1, welcomeMsg);
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
                        reader.onload = (e: any) => {
                            let image = new Image();
                            image.src = e.target.result;
                            image.onload = function () {
                                welcomeMsg = {
                                    janusMsg: {
                                        sender: 0, // 0:客服, 1:使用者
                                        msgContent: "",
                                        time: unixTime(),
                                        type: 2, //1:簡訊 2: 文字
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
                                        config: {
                                            chatroomID: "",
                                            id: nanoid(),
                                            isReply: false,
                                            replyObj: {},
                                            currentDate: currentDate(),
                                            isExpire: false,
                                            isPlay: false,
                                            isRead: true,
                                            isWelcomeMsg: true,
                                            msgFunctionStatus: false,
                                            msgMoreStatus: false,
                                            recallPopUp: false,
                                            recallStatus: false,
                                        },
                                    },
                                };
                                console.log("welcomeMsg pic:", welcomeMsg);

                                welcomeMsgCount.value.splice(index, 1, welcomeMsg);
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
const welcomeFile = async (e: any, index: any) => {
    // console.log(e);
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) {
        return;
    }
    //影片檔案
    if (file.type.includes("video")) {
        const fd = new FormData();
        fd.append("file", new File([file], fileName, { type: file.type }));
        const getToken = localStorage.getItem("access_token");
        await axios({
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
                            sender: 0, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: 2, //1:簡訊 2: 文字
                            msgType: 11, //影片類型
                            format: {
                                Fileid: res.data.fileid,
                                ShowName: fileName,
                                ExtensionName: res.data.ext,
                                FileSize: file.size,
                                expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                            },
                            config: {
                                chatroomID: "",
                                id: nanoid(),
                                isReply: false,
                                replyObj: {},
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: true,
                                isWelcomeMsg: true,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                            },
                        },
                    };
                    // console.log("welcomeMsg file:", welcomeMsg);

                    welcomeMsgCount.value.splice(index, 1, welcomeMsg);
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
        // welcomeMsgCount.value.splice(index, 1, welcomeMsg);
    } else {
        //一般檔案
        const fd = new FormData();
        fd.append("file", new File([file], fileName, { type: file.type }));
        const getToken = localStorage.getItem("access_token");
        await axios({
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
                            sender: 0, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: 2, //1:簡訊 2: 文字
                            msgType: 7, //圖片類型
                            format: {
                                Fileid: res.data.fileid,
                                ShowName: fileName,
                                ExtensionName: res.data.ext,
                                FileSize: file.size,
                                expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                            },
                            config: {
                                chatroomID: "",
                                id: nanoid(),
                                isReply: false,
                                replyObj: {},
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: true,
                                isWelcomeMsg: true,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                            },
                        },
                    };
                    // console.log("welcomeMsg file:", welcomeMsg);
                    welcomeMsgCount.value.splice(index, 1, welcomeMsg);
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
        // welcomeMsgCount.value.splice(index, 1, welcomeMsg);
    }
};
// 向上移
const moveUp = (index) => {
    welcomeMsgCount.value.forEach((item, i, arr) => {
        if (i === index) {
            [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        }
    });
};
// 向下移
const moveDown = (index) => {
    welcomeMsgCount.value.forEach((item, i, arr) => {
        if (i === index) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    });
};

//Chat store
const chatStore = useChatStore();
const { textPlugin, participantList } = storeToRefs(chatStore);

const isDisabled = ref(false);
const inValid = ref(false);
//確認儲存
const goActivityStore = async () => {
    isDisabled.value = true;
    inValid.value = false;
    if (welcomeMsgCount.value.length === 0) {
        inValid.value = true;
    }
    welcomeMsgCount.value.forEach((msg) => {
        if (msg.janusMsg.msgType === 1 && msg.janusMsg.msgContent === "") {
            inValid.value = true;
        }
    });
    if (name.value === "" || inValid.value === true || avatarStatus.value !== 1) {
        isDisabled.value = false;
        const channelName = name.value === "" ? "活動名稱、" : "";
        const avatar = avatarStatus.value !== 1 ? "頭像、" : "";
        const welcomeMsg = inValid.value ? "預設訊息" : "";
        alertMessage.value = `尚有 ${channelName}${avatar}${welcomeMsg} 欄位未填寫!!`;
    } else {
        const accountID = localStorage.getItem("accountID") || "[]";
        const channelDataObj = {
            accountID: parseFloat(accountID), // 4
            icon: `${avatar.value.fileid}${avatar.value.ext}`,
            callable: parseInt(callable.value),
            dialogue: interactOption.value,
            name: name.value,
            homeurl: url.value,
            description: description.value,
            cslist: JSON.stringify(tagList.value),
            messageList: JSON.stringify(welcomeMsgCount.value),
            preset: preset.value,
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
        fd.append("dialogue", channelDataObj.dialogue);
        fd.append("messageList", channelDataObj.messageList);
        fd.append("preset", channelDataObj.preset);
        const getToken = localStorage.getItem("access_token");
        await axios({
            method: "post",
            url: `${config.serverUrl}/v1/event`,
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
                alertMessage.value = `新增頻道失敗,請稍後再試!!`;
                isDisabled.value = false;
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
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
.setting__introduction .n-input {
    max-width: 100%;
}
.setting__introduction .n-input .n-input-wrapper {
    padding-right: 0px;
}
.setting__introduction .n-input.n-input--textarea .n-input-word-count {
    // right: 30px;
}
.setting__introduction .n-input.n-input--textarea {
    border: 1px solid #8b8b8b;
    padding-bottom: 20px;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.staff__checkbox {
    display: flex;
    align-items: center;
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
}
.staff-model {
    width: 400px;
    background-color: $white;
    border-radius: 5px;
    padding: 25px 0px 10px;
    display: flex;
    flex-direction: column;
    > p {
        margin: 0 auto;
        font-family: $font-family;
        font-size: $font-size-16;
        color: $gray-1;
    }
    &__title {
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
    &__checkbox-group {
        overflow-y: auto;
        min-height: 200px;
        max-height: 350px;
        ul {
            li {
                padding: 20px;
                position: relative;

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
    &__confirm {
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

.addChannel {
    background-color: $bg;
    padding: 15px 15px 45px 15px;
    min-height: calc(100vh - 140px);
    margin-bottom: 30px;
    &__wrap {
        width: 100%;
        background-color: $white;
        margin: 0 auto;
        padding: 30px 50px;
    }
}
.button-group {
    display: flex;
    justify-content: center;
    .button--cancel {
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

    .button--save {
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
    .button--disabled {
        @extend .button--save;
        background-color: $gray-4;
        border: 1px solid $gray-4;
        cursor: default;
    }
}
.setting {
    margin-bottom: 30px;
    &__icon {
        .avatar {
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
                .upload-avatar {
                    width: 80px;
                    height: 80px;
                    border: 1px dashed $gray-3;
                    background-color: $gray-8;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;

                    &--default {
                        width: 24px;
                        height: 24px;
                    }
                    &--active {
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
    &__function {
        display: flex;
        justify-content: space-between;
        background-color: $gray-8;
        padding: 15px 30px;
        .presetChannel {
            margin-top: 3px;
            margin-right: 15px;
            h1 {
                font-family: $font-family;
                font-size: $font-size-16;
                font-weight: 400;
                color: $gray-1;
                margin-bottom: 17px;
            }
        }
        .freecall {
            margin-top: 3px;
            margin-right: 15px;
            h1 {
                font-family: $font-family;
                font-size: $font-size-16;
                font-weight: 400;
                color: $gray-1;
                margin-bottom: 17px;
            }
        }
        .notInteract {
            // margin-left: 15px;
            > div {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                h1 {
                    font-family: $font-family;
                    font-size: $font-size-16;
                    font-weight: 400;
                    color: $gray-1;
                }
            }
        }
    }
    &__title {
        margin-bottom: 30px;
        h1 {
            margin-bottom: 15px;
            span {
                color: red;
            }
        }
    }
    &__URL {
        margin-bottom: 30px;
        h1 {
            margin-bottom: 15px;
        }
    }
    &__introduction {
        margin-bottom: 30px;
        h1 {
            margin-bottom: 15px;
        }
    }
    &__staff {
        .staff__title {
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
        .staff__tags {
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
        }
        .staff__tag {
            background-color: $primary-3;
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
            .close {
                margin-left: 5px;
                cursor: pointer;
            }
            .closeDefault {
                margin-left: 5px;
            }
        }
    }
    &__welcomeMsg {
        margin-left: 100px;
        width: 45%;
        h2 {
            display: inline-block;
            float: right;
            cursor: pointer;
            color: $primary-1;
            padding-right: 10px;
        }
    }
}
.container {
    display: flex;
    margin-bottom: 60px;
    &__introduce {
        width: 640px;
    }
}
.welcome {
    &__title {
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
    &__messages {
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
        &__video {
            padding: 5px 5px;
        }
        &__function-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            img {
                cursor: pointer;
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
                img {
                    width: 24px;
                    height: 24px;
                }
            }
        }
    }
}
</style>
