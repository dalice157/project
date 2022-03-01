<template>
    <div class="addChannel" v-if="channelEvent">
        <div class="addChannelWrap">
            <div class="addChannelSetting">
                <div class="channelIntroduce">
                    <div class="setting">
                        <div class="iconSetting">
                            <div class="iconTitle">
                                <h2>頭像設定</h2>
                                <p>(請上傳商標或形象圖以供辨識)</p>
                            </div>
                            <n-upload @change="uploadAvatar($event)" accept="image/*" type="file">
                                <div class="addChannelUploadImg">
                                    <img
                                        class="avatarDefault"
                                        src="../../assets/Images/manage/Photo.svg"
                                        alt="#"
                                        v-if="!channelEvent.icon"
                                    />
                                    <img
                                        class="avatarUpload"
                                        :src="`${config.fileUrl}/fls/${avatar.fileid}${avatar.ext}`"
                                        alt="#"
                                        v-if="avatarStatus === 1"
                                    />
                                    <img
                                        class="avatarUpload"
                                        :src="`${config.fileUrl}/fls/${channelEvent.icon}`"
                                        alt="#"
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
                            <n-config-provider :themeOverrides="themeOverrides">
                                <n-switch
                                    v-model:value="status"
                                    checked-value="0"
                                    unchecked-value="1"
                                />
                            </n-config-provider>
                        </div>
                    </div>
                    <div class="activityTitle">
                        <h3>活動名稱</h3>
                        <n-config-provider :themeOverrides="themeOverrides">
                            <n-input
                                placeholder="請輸入活動名稱"
                                maxlength="25"
                                show-count
                                v-model:value="name"
                            ></n-input>
                        </n-config-provider>
                    </div>
                    <div class="homeURL">
                        <h3>活動網址</h3>
                        <n-config-provider :themeOverrides="themeOverrides">
                            <n-input placeholder="請輸入活動網址" v-model:value="url"></n-input>
                        </n-config-provider>
                    </div>
                    <div class="introduction">
                        <h3>簡介</h3>
                        <n-config-provider :themeOverrides="themeOverrides">
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
                        </n-config-provider>
                    </div>
                    <div class="customerService">
                        <div class="customerServiceTitle">
                            <h3>客服人員</h3>
                            <div class="addStaff" @click="onShowPop">+新增客服人員</div>
                        </div>
                        <div class="customServiceTagArea">
                            <p v-show="addList.length === 0">請選擇客服人員</p>
                            <div class="staffTag" v-for="item in tagList" :key="item.accountID">
                                <p>{{ item.name }}</p>
                                <img
                                    src="@/assets/Images/manage/round-fill_close.svg"
                                    :alt="item.accountID"
                                    @click="deleteStaff(item.accountID)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="welcomeStatus">
                    <div class="welcomeTitle">
                        <h2>歡迎訊息</h2>
                        <p>(最多三則)</p>
                    </div>
                    <div
                        class="welcomeInput"
                        v-for="(item, index) in welcomeMsgCount"
                        :key="item.id"
                    >
                        <n-config-provider
                            :themeOverrides="themeOverrides"
                            v-if="item.MsgType === 1"
                        >
                            <n-input
                                type="textarea"
                                placeholder="請輸入歡迎訊息"
                                :autosize="{
                                    minRows: 3,
                                }"
                                v-model:value="item.MsgContent"
                            ></n-input>
                        </n-config-provider>
                        <div class="welcomeImg" v-else-if="item.MsgType === 6">
                            <img
                                :src="`${config.fileUrl}/fls/${item.Format.fileid}${item.Format.ext}`"
                                alt="#"
                            />
                        </div>
                        <div class="welcomeFile" v-else-if="item.MsgType === 7">
                            <div>
                                <div>
                                    <img src="@/assets/Images/common/file.svg" />
                                    <p>{{ item.Format.fileName }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="welcomeFunctionBar">
                            <img
                                src="../../assets/Images/manage/delete.svg"
                                alt=""
                                @click="deleteWelcomeMsg(item.id)"
                            />
                            <div class="welcomeFunctionBarUpload">
                                <span
                                    src="../../assets/Images/common/file.svg"
                                    alt=""
                                    v-show="item.MsgContent === ''"
                                >
                                    <input
                                        type="file"
                                        @change="welcomeFile($event, index)"
                                        :accept="fileAccept"
                                    />
                                </span>
                                <span
                                    src="../../assets/Images/chatroom/pic.svg"
                                    alt=""
                                    v-show="item.MsgContent === ''"
                                >
                                    <input
                                        type="file"
                                        @change="welcomePicture($event, index)"
                                        accept="image/*"
                                    />
                                </span>
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
                    :to="`/manage/${route.params.id}/activitySetting`"
                >
                    取消
                </router-link>
                <div class="channelDel" @click="showDelModal = true">刪除</div>
                <div class="channelPreview">預覽</div>
                <div class="channelStore" @click="goActivity">確認儲存</div>
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
                    <h3>客服人員列表</h3>
                </div>
                <n-checkbox-group
                    class="staffList"
                    @update:checked="onUpdate"
                    v-model:value="addList"
                >
                    <ul>
                        <li v-for="staff in staffList" :key="staff.accountID">
                            <div class="staffData">
                                <p>{{ staff.name }}</p>
                                <n-checkbox :value="staff.accountID" />
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
import { ref, reactive, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import {
    NInput,
    NConfigProvider,
    NCheckbox,
    NCheckboxGroup,
    NUpload,
    NSpin,
    NSwitch,
    NModal,
} from "naive-ui";
import { nanoid } from "nanoid";
import config from "@/config/config";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import Compressor from "compressorjs";
import { filterOptions } from "naive-ui/lib/select/src/utils";
import { useApiStore } from "@/store/api";

//router
const router = useRouter();
const route = useRoute();

const apiStore = useApiStore();
const {
    getCustomServiceStaffList,
    getActivetyCsList,
    getChannelEvent,
    sendChannelEventInfo,
    deleteChannelEventInfo,
} = apiStore;
const { staffList, channelEvent, activetyCsList, checkedCsList } = storeToRefs(apiStore);

getChannelEvent(route.query.eventID);
getCustomServiceStaffList();
getActivetyCsList(route.query.eventID);

const callable: any = computed({
    get() {
        return String(channelEvent.value.callable);
    },
    set(val) {
        channelEvent.value.callable = String(val);
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
        return channelEvent.value.description;
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
const status: any = computed({
    get() {
        return String(channelEvent.value.status);
    },
    set(val) {
        channelEvent.value.status = String(val);
    },
});
const loading = ref(false);

const popUp = ref(false);
const isChangeCheckbox = ref(false);
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
    isChangeCheckbox.value = true;
    addList.value = val;
};

// 刪除人員tag
const deleteStaff = (id: any) => {
    let getAddList = [];
    const list = tagList.value.filter((tag) => {
        return tag.accountID != id;
    });
    staffList.value.forEach((staff) => {
        Object.values(list).forEach((item: any) => {
            if (item.accountID == staff.accountID) {
                getAddList.push(staff.accountID);
            }
        });
    });
    addList.value = getAddList;
    tagList.value = list;
};

let welcomeMsg = reactive({});
const showDelModal = ref(false);

//頭像上傳功能
const avatarStatus = ref(0);
let avatar = ref({ exp: "", ext: "", fileid: "" });
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
                        };
                        avatarStatus.value = 1;
                        console.log(avatar.value);
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
const addWelcomeMsg = () => {
    welcomeMsg = {
        id: nanoid(),
        MsgContent: "",
        Format: {},
        MsgType: 1, //文字類型
    };
    if (welcomeMsgCount.value.length < 3) {
        welcomeMsgCount.value.push(welcomeMsg);
    }
};

const onShowPop = () => {
    isChangeCheckbox.value = true;
    popUp.value = true;
};

const onPopUp = () => {
    isChangeCheckbox.value = true;
    popUp.value = false;
    let list = staffList.value
        .filter((item) => {
            return addList.value.includes(item.accountID);
        })
        .sort();
    list = list.map((item) => ({
        accountID: item.accountID,
        name: item.name,
    }));
    tagList.value = list;
};

//刪除歡迎訊息
const deleteWelcomeMsg = (id: any) => {
    welcomeMsgCount.value.forEach((item, index) => {
        if (item.id === id) {
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
                            ...welcomeMsg,
                            MsgType: 6, //圖片類型
                            Format: {
                                exp: res.data.exp,
                                ext: res.data.ext,
                                fileid: res.data.fileid,
                            },
                        };
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

// 可上傳檔案類型
const fileAccept =
    "text/*, video/*, audio/*, application/*, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.templat, application/vnd.ms-word.document.macroEnabled.12, application/vnd.ms-word.template.macroEnabled.12";
//上傳檔案
const welcomeFile = (e: any, index: any) => {
    console.log(e.target.files[0]);
    welcomeMsg = {
        ...welcomeMsg,
        MsgType: 7, //檔案類型
        Format: {
            fileName: e.target.files[0].name,
            fileSize: e.target.files[0].size,
        },
    };
    welcomeMsgCount.value.splice(index, 1, welcomeMsg);
};

//前往活動管理頁面
const cslist = ref([]);
const goActivity = () => {
    Object.entries(tagList.value).forEach(([key, value]) => {
        const hasAccountID = cslist.value.some((item) => item.accountID === value.accountID);
        if (!hasAccountID) {
            cslist.value.push({ accountID: value.accountID });
        }
    });

    const bodyData = {
        icon:
            avatarStatus.value === 0
                ? channelEvent.value.icon
                : `${avatar.value.fileid}${avatar.value.ext}`,
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
};
//刪除活動頻道
const deleteChannel = () => {
    deleteChannelEventInfo(route, router);
};

const themeOverrides = {
    common: { primaryColor: "#FFb400" },
    Input: {
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
        borderRadius: "4px",
    },
};
</script>

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
    .customService {
        width: 590px;
        height: 665px;
        background-color: $white;
        padding: 25px 0px;
        .customServiceTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 0 20px;
            h3 {
                font-family: $font-family;
                font-size: 16px;
                font-weight: 500;
                color: $gray-1;
            }
            img {
                width: 27px;
                height: 27px;
                cursor: pointer;
            }
        }
        .staffList {
            overflow-y: auto;
            height: 500px;
            ul {
                li {
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    position: relative;
                    .staffData {
                        display: flex;
                        justify-content: space-between;
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
        border-radius: 20px;
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
            font-size: 16px;
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
                        margin-right: 100px;
                        .iconTitle {
                            display: flex;
                            align-items: center;
                            margin-bottom: 15px;
                            h2 {
                                font-family: $font-family;
                                @extend %h2;
                                color: $gray-1;
                                margin-right: 10px;
                            }
                            p {
                                font-family: $font-family;
                                font-size: 14px;
                                font-weight: 400;
                                color: $gray-3;
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
                            font-size: 16px;
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
                                font-size: 14px;
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
                    }
                    .n-input {
                        border: 1px solid $gray-1;
                    }
                }
                .homeURL {
                    margin-bottom: 30px;
                    h3 {
                        margin-bottom: 15px;
                    }
                    .n-input {
                        border: 1px solid $gray-1;
                    }
                }
                .introduction {
                    margin-bottom: 30px;
                    h3 {
                        margin-bottom: 15px;
                    }
                    .n-input {
                        border: 1px solid $gray-1;
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
                        border: 1px solid $gray-1;
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
                    }
                    p {
                        margin-left: 15px;
                        font-family: $font-family;
                        font-size: 14px;
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
                                background-image: url("../../assets/Images/common/file.svg");
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
                                background-image: url("../../assets/Images/chatroom/pic.svg");
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
                cursor: pointer;
                &:hover {
                    opacity: 0.7;
                }
            }
            .channelPreview {
                width: 100px;
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
            }
        }
    }
}
</style>
