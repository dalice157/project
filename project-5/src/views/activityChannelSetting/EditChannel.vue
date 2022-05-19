<template>
    <div class="addChannel" v-if="channelEvent">
        <div class="addChannelWrap">
            <div class="addChannelSetting">
                <div class="channelIntroduce">
                    <div class="setting">
                        <div class="iconSetting">
                            <div class="iconTitle">
                                <h2><span>*</span>&ensp;頭像設定</h2>
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
                                        v-if="!channelEvent.icon"
                                    />
                                    <img
                                        class="avatarUpload"
                                        :src="`${config.fileUrl}${avatar.fileid}${avatar.ext}`"
                                        :alt="avatar.fileName"
                                        v-if="avatarStatus === 1"
                                    />
                                    <img
                                        class="avatarUpload"
                                        :src="`${config.fileUrl}${channelEvent.icon}`"
                                        alt="頻道大頭照"
                                        v-else
                                    />
                                </div>
                            </n-upload>
                        </div>
                        <div class="functionSetting">
                            <h3>功能設定</h3>
                            <div class="freecall">
                                <n-checkbox
                                    v-model:checked="callable"
                                    checked-value="1"
                                    unchecked-value="0"
                                ></n-checkbox>
                                <p>免費通話</p>
                            </div>
                        </div>
                        <div class="status">
                            <h3>活動頻道開關</h3>
                            <n-switch
                                v-model:value="status"
                                checked-value="1"
                                unchecked-value="0"
                            />
                        </div>
                    </div>
                    <div class="activityTitle">
                        <h3><span>*</span>&ensp;活動名稱</h3>
                        <n-input
                            placeholder="請輸入活動名稱"
                            maxlength="25"
                            show-count
                            v-model:value="name"
                        ></n-input>
                    </div>
                    <div class="homeURL">
                        <h3>活動網址</h3>
                        <n-input placeholder="請輸入活動網址" v-model:value="url"></n-input>
                    </div>
                    <div class="introduction">
                        <h3>簡介</h3>
                        <n-input
                            type="textarea"
                            placeholder="當使用者點及頭像即可看到聊天室簡介"
                            maxlength="100"
                            show-count
                            :autosize="{
                                minRows: 3,
                                maxRows: 3,
                            }"
                            v-model:value="description"
                        ></n-input>
                    </div>
                    <div class="customerService">
                        <div class="customerServiceTitle">
                            <h3>客服人員</h3>
                            <div class="addStaff" @click="onShowPop">+新增客服人員</div>
                        </div>
                        <div class="customServiceTagArea">
                            <p v-show="addList.length === 0">請選擇客服人員</p>
                            <div class="staffTag" v-for="item in tagList" :key="item.accountID">
                                <p v-if="item.accountID !== 0">{{ item.name }}</p>
                                <p v-else>{{ item.nickname }}</p>
                                <img
                                    :src="closeIcon"
                                    :alt="item.accountID"
                                    @click="deleteStaff(item.accountID)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="welcomeStatus">
                    <div class="welcomeTitle">
                        <h2><span>*</span>&ensp;預設訊息</h2>
                        <p>(至少一則，最多三則)</p>
                    </div>
                    <div
                        class="welcomeInput"
                        v-for="(item, index) in welcomeMsgCount"
                        :key="item.janusMsg.config.id"
                    >
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
                    <h3 @click="addWelcomeMsg" v-show="welcomeMsgCount.length < 3">
                        +新增歡迎訊息
                    </h3>
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
                >
                    取消
                </router-link>
                <div class="channelDel" @click="showDelModal = true">刪除</div>
                <PreviewModel
                    :welcomeMsgCount="welcomeMsgCount"
                    :name="name"
                    :avatar="
                        avatarStatus === 1 ? `${avatar.fileid}${avatar.ext}` : channelEvent.icon
                    "
                />
                <div v-if="!isDisabled" class="channelStore" @click="goActivity">確認儲存</div>
                <div v-else class="channelStore disabled">確認儲存</div>
            </div>
        </div>
    </div>
    <div class="addChannel" v-if="!channelEvent">
        <n-spin :show="loading"></n-spin>
    </div>
    <teleport to="body">
        <div class="mask" v-show="popUp === true">
            <div class="customService">
                <div class="customServiceTitle">
                    <h2>客服人員列表</h2>
                </div>
                <n-checkbox-group
                    class="accounts"
                    @update:checked="onUpdate"
                    v-model:value="addList"
                >
                    <ul>
                        <li v-for="staff in accounts" :key="staff.accountID">
                            <div class="staffData">
                                <n-checkbox
                                    class="staff"
                                    v-if="staff.accountID !== 0"
                                    :value="staff.accountID"
                                    :label="staff.name"
                                />
                                <n-checkbox
                                    class="staff"
                                    v-else
                                    :value="staff.accountID"
                                    :label="staff.nickname"
                                />
                            </div>
                        </li>
                    </ul>
                </n-checkbox-group>
                <div class="staffConfirm" @click="onPopUp">確認</div>
            </div>
        </div>
    </teleport>
    <teleport to="body">
        <div class="mask1" v-show="showDelModal">
            <div class="deleteChannelPopUp">
                <div class="deleteChannelConfirm">您確定要刪除此活動頻道!!</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click="showDelModal = false">取消</div>
                    <div type="button" class="confirm" @click="deleteChannel">確定</div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onUpdated, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { NInput, NEllipsis, NCheckbox, NCheckboxGroup, NUpload, NSpin, NSwitch } from "naive-ui";
import axios from "axios";
import Compressor from "compressorjs";
import dayjs from "dayjs";

import { unixTime, currentDate } from "@/util/dateUtil";
import config from "@/config/config";
import { useApiStore } from "@/store/api";
import PreviewModel from "@/components/PreviewModel";
import photoIcon from "@/assets/Images/manage/Photo.svg";
import closeIcon from "@/assets/Images/manage/round-fill_close.svg";
import fileIcon from "@/assets/Images/common/file.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import picIcon from "@/assets/Images/chatroom/pic.svg";
import upward from "@/assets/Images/manage/arrow-up-outline.svg";
import downward from "@/assets/Images/manage/arrow-down-outline.svg";
import { fileAccept, imgAccept } from "@/util/commonUtil";

//router
const router = useRouter();
const route = useRoute();

//store
const apiStore = useApiStore();
const {
    getAccounts,
    getActivetyCsList,
    getChannelEvent,
    sendChannelEventInfo,
    deleteChannelEventInfo,
} = apiStore;
const { accounts, channelEvent, activetyCsList, checkedCsList, isDisabled } = storeToRefs(apiStore);

getChannelEvent(route.query.eventID);
getAccounts();
getActivetyCsList(route.query.eventID);

watch(
    () => route.query,
    () => {
        if (Object.keys(route.query).length > 0) {
            getChannelEvent(route.query.eventID);
            getAccounts();
            getActivetyCsList(route.query.eventID);
        }
    }
);
console.log("channelEvent:", channelEvent.value);

const callable: any = computed({
    // 0:關閉 1:開啟通話
    get() {
        return String(channelEvent.value.callable);
    },
    set(val) {
        channelEvent.value.callable = String(val);
    },
});
const status: any = computed({
    // 0:關閉 1:開啟活動 2:刪除活動
    get() {
        return String(channelEvent.value.status);
    },
    set(val) {
        channelEvent.value.status = String(val);
    },
});
const name: any = computed({
    get() {
        return channelEvent.value.name;
    },
    set(val) {
        channelEvent.value.name = val;
    },
});
const url: any = computed({
    get() {
        return channelEvent.value.homeurl;
    },
    set(val) {
        channelEvent.value.homeurl = val;
    },
});
const description: any = computed({
    get() {
        return channelEvent.value.description.slice(0, 100);
    },
    set(val) {
        channelEvent.value.description = val;
    },
});
const welcomeMsgCount: any = computed({
    get() {
        return channelEvent.value.messageList || [];
    },
    set(val) {
        channelEvent.value.messageList = val;
    },
});

const loading = ref(false);

const popUp = ref(false);
const addList: any = computed({
    get() {
        return checkedCsList.value;
    },
    set(val) {
        checkedCsList.value = val;
    },
});
const tagList: any = computed({
    get() {
        return activetyCsList.value;
    },
    set(val) {
        activetyCsList.value = val;
    },
});

// 新增更新客服人員
const onUpdate = (val) => {
    addList.value = val;
};

// 刪除人員tag
const deleteStaff = (id: any) => {
    let getAddList = [];
    const list = tagList.value.filter((tag) => {
        return tag.accountID !== id;
    });
    accounts.value.forEach((staff) => {
        Object.values(list).forEach((item: any) => {
            if (item.accountID === staff.accountID) {
                getAddList.push(staff.accountID);
            }
        });
    });
    addList.value = getAddList;
    tagList.value = list;
};

const showDelModal = ref(false);

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
                        console.log("avatar.value", avatar.value);
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

//歡迎訊息數量
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

//刪除歡迎訊息
const deleteWelcomeMsg = (id: any) => {
    welcomeMsgCount.value.forEach((item, index) => {
        if (item.janusMsg.config.id === id) {
            welcomeMsgCount.value.splice(index, 1);
        }
    });
};

const onShowPop = () => {
    popUp.value = true;
};
//確認按鈕
const onPopUp = () => {
    popUp.value = false;
    let list = accounts.value
        .filter((item) => {
            return addList.value.includes(item.accountID);
        })
        .sort();
    list = list.map((item) => {
        if (item.accountID === 0) {
            return {
                accountID: item.accountID,
                name: item.name,
                nickname: item.nickname,
            };
        }
        return {
            accountID: item.accountID,
            name: item.name,
        };
    });
    tagList.value = list;
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

//前往活動管理頁面
const cslist = ref([]);
const goActivity = () => {
    Object.entries(tagList.value).forEach(([key, value]) => {
        const hasAccountID = cslist.value.some(
            (item) => item.accountID === (value as any).accountID
        );
        if (hasAccountID) return;
        if ((value as any).accountID == 0) {
            cslist.value.push({
                accountID: (value as any).accountID,
                nickname: (value as any).nickname,
                name: (value as any).name,
            });
        } else {
            cslist.value.push({ accountID: (value as any).accountID });
        }
    });
    const inValid = ref(false);
    if (welcomeMsgCount.value.length === 0) {
        inValid.value = true;
    }
    welcomeMsgCount.value.forEach((msg) => {
        if (msg.janusMsg.msgType === 1 && msg.janusMsg.msgContent === "") {
            inValid.value = true;
        }
    });
    if (name.value === "" || inValid.value === true) {
        const channelName = name.value === "" ? "活動名稱、" : "";
        const welcomeMsg = inValid.value ? "預設訊息" : "";
        alert(`尚有 ${channelName}${welcomeMsg} 欄位未填寫!!`);
    } else {
        const bodyData = {
            icon: `${avatar.value.fileid}${avatar.value.ext}`,
            callable: parseInt(callable.value),
            name: name.value,
            status: parseInt(status.value),
            homeurl: url.value,
            description: description.value,
            cslist: JSON.stringify(cslist.value),
            message: JSON.stringify(welcomeMsgCount.value),
        };
        console.log("更新活動資料", bodyData);
        sendChannelEventInfo(route, bodyData, router);
    }
};
//刪除活動頻道
const deleteChannel = () => {
    deleteChannelEventInfo(route, router);
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
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.staff {
    margin-right: 10px;
}

.required {
    color: $danger;
    margin-right: 4px;
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
.addChannel {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    min-height: calc(100% - 80px);
    .status {
        h3 {
            font-size: $font-size-16;
            font-weight: 400;
            color: $gray-1;
            margin-right: 10px;
            margin-bottom: 13px;
        }
        margin-left: 1em;
    }
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
                            h2 {
                                font-family: $font-family;
                                @extend %h2;
                                color: $gray-1;
                                margin-right: 10px;
                                span {
                                    color: $danger;
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
                        h3 {
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
                    h3 {
                        margin-bottom: 15px;
                        span {
                            color: red;
                        }
                    }
                }
                .homeURL {
                    margin-bottom: 30px;
                    h3 {
                        margin-bottom: 15px;
                    }
                }
                .introduction {
                    margin-bottom: 30px;
                    h3 {
                        margin-bottom: 15px;
                    }
                }
                .customerService {
                    .customerServiceTitle {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        h3 {
                            margin-bottom: 15px;
                        }
                        .addStaff {
                            margin-bottom: 15px;
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
                    h2 {
                        font-family: $font-family;
                        @extend %h2;
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
                            img {
                                width: 24px;
                                height: 24px;
                            }
                        }
                    }
                }
                h3 {
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
            .channelDel {
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
