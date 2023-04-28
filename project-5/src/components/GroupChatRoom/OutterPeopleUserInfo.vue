<template>
    <n-modal
        class="externalUserInfo-model"
        :mask-closable="false"
        v-model:show="externalPeopleInfoSwitch"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <div class="background"></div>
            <div class="closeBtn" @click.prevent="closeModal">
                <img :src="closeIcon" alt="關閉" />
            </div>
            <div class="user__photo">
                <n-avatar :size="75" object-fit="cover" :src="img" />
            </div>
            <div class="info" v-show="editStatus === 0">
                <div class="info__name">
                    <p v-if="outterPeopleInfo.name === ''">尚未輸入姓名/名稱</p>
                    <p v-if="outterPeopleInfo.name !== ''">{{ outterPeopleInfo.name }}</p>
                    <img :src="editIcon" @click="editName" />
                </div>
                <div class="info__mobile">
                    <p v-if="outterPeopleInfo.mobile !== ''">{{ outterPeopleInfo.mobile }}</p>
                </div>
                <ul class="container__call">
                    <!-- @click.prevent="onPhoneCallModal(info.chatroomID)" -->
                    <!-- <li class="call--web">
                        <span class="icon"><img :src="phoneIcon" alt="語音通話" /></span>
                        <p class="text">語音通話</p>
                    </li> -->
                    <!-- @touchend.prevent="gotoChat(info.eventID, info.chatroomID, info.mobile)" -->
                    <!-- <li>
                        <span class="icon"><img :src="messageIcon" alt="傳送訊息" /></span>
                        <p class="text">傳送訊息</p>
                    </li> -->
                </ul>
            </div>
            <div class="info--editName" v-show="editStatus === 1">
                <p class="chagePhoto" @click="editStatus = 2">更換大頭照</p>
                <div class="info--editName__mobile">
                    <p v-if="outterPeopleInfo.mobile !== ''">{{ outterPeopleInfo.mobile }}</p>
                </div>
                <n-input v-model:value="name" placeholder="輸入姓名/名稱">
                    <template #suffix>
                        <img
                            :src="checkIcon"
                            style="cursor: pointer"
                            v-show="name !== ''"
                            @click="patchName"
                        />
                        <img :src="cancelIcon" style="cursor: pointer" @click="editStatus = 0" />
                    </template>
                </n-input>
            </div>
            <div class="info--editPhoto" v-show="editStatus === 2">
                <n-grid class="img-group" :x-gap="16" :y-gap="8" :cols="4">
                    <n-grid-item v-for="icon in imgList" :key="icon">
                        <n-avatar
                            class="iconImg"
                            :class="{
                                active:
                                    String(icon).split('/')[getSplit] ==
                                    String(img).split('/')[getSplit],
                            }"
                            @click.stop="onClickChoose"
                            :size="56"
                            object-fit="cover"
                            :src="icon"
                        />
                    </n-grid-item>
                </n-grid>
                <div class="btn-wrap">
                    <div class="save-button" @click.stop="onSaveAvatar">儲存</div>
                </div>
            </div>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { defineComponent, ref, toRef, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { NModal, NCard, NAvatar, NInput, NGrid, NGridItem, NButton } from "naive-ui";
import config from "@/config/config";
import axios from "axios";

import phoneIcon from "@/assets/Images/groupChat/phone-round.svg";
import messageIcon from "@/assets/Images/groupChat/message-round.svg";
import { useApiStore } from "@/store/api";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { DO_CALL_NAME } from "@/util/commonUtil";
import user_pic_default from "@/assets/Images/groupChat/User default-C.svg";
import closeIcon from "@/assets/Images/groupChat/close-round_w.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";
import checkIcon from "@/assets/Images/groupChat/check_o.svg";
import cancelIcon from "@/assets/Images/groupChat/close_o.svg";
import { isProduction, isStaging, imgList } from "@/util/commonUtil";

const route = useRoute();
const router = useRouter();
//model store
const modelStore = useModelStore();
const { gotoChat } = modelStore;
const { externalPeopleInfoSwitch, outterPeopleInfo, phoneCallModal } = storeToRefs(modelStore);
//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;
//api store
const apiStore = useApiStore();
const { getGroupChatRoomInfo } = apiStore;
const { bugout, userName } = storeToRefs(apiStore);

// 環境設定
const getSplit = isProduction || isStaging ? 4 : 5;

//v-model
const name = ref("");
const img = ref(null);

//打電話
const onPhoneCallModal = (chatroomID) => {
    phoneCallModal.value = true;
    doCall(chatroomID);
};
const editStatus = ref(0);
//編輯名字
const editName = () => {
    editStatus.value = 1;
    name.value = outterPeopleInfo.value.name;
};
//確認名字
const patchName = () => {
    let icon =
        img.value.split("/")[getSplit] === "default.svg"
            ? 0
            : Number(img.value.split("/")[getSplit].split(".")[0]);

    let data = {
        accountID: outterPeopleInfo.value.accountID,
        name: name.value,
        icon,
    };
    editExternalPeopleInfo(data);
    outterPeopleInfo.value.name = name.value;
};
// 選擇圖像
const onClickChoose = (e: any) => {
    img.value = e.target.src;
};
//儲存頭貼
const onSaveAvatar = () => {
    let icon =
        img.value.split("/")[getSplit] === "default.svg"
            ? 0
            : Number(img.value.split("/")[getSplit].split(".")[0]);

    let data = {
        accountID: outterPeopleInfo.value.accountID,
        name: outterPeopleInfo.value.name,
        icon,
    };
    editExternalPeopleInfo(data);
};
//關閉彈窗
const closeModal = () => {
    editStatus.value = 0;
    externalPeopleInfoSwitch.value = false;
    outterPeopleInfo.value = "";
};
//監聽頭像
watch(outterPeopleInfo, (val) => {
    img.value = imgList.find((item) => {
        const icon =
            item.split("/")[getSplit] === "default.svg"
                ? 0
                : item.split("/")[getSplit].split(".")[0];
        return icon == val.icon;
    });
});
//編輯外部人員
const editExternalPeopleInfo = async (data) => {
    const getToken = localStorage.getItem("access_token");
    const fd = new FormData();
    fd.append("accountID", data.accountID);
    fd.append("name", data.name ? data.name : "");
    fd.append("icon", data.icon);
    await axios({
        method: "patch",
        url: `${config.serverUrl}/v1/externel/member`,
        headers: { Authorization: `Bearer ${getToken}` },
        data: fd,
    })
        .then((res) => {
            console.log("修改聊天室外部人員訊息 res", res.data);
            getGroupChatRoomInfo(route.query.eventID);
            editStatus.value = 0;
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-modal-mask {
    background-color: transparent;
}
.externalUserInfo-model.n-modal {
    .n-card {
        background: transparent;
    }
}
.externalUserInfo-model.n-card {
    .closeBtn {
        position: absolute;
        right: 0px;
        top: 20px;
        z-index: 100;
        width: 28px;
        height: 28px;
        cursor: pointer;
        img {
            width: 100%;
        }
    }
    .user__photo {
        margin-top: 35px;
        margin-bottom: 1em;
        text-align: center;
        .n-avatar {
        }
    }
    .user__name {
        text-align: center;
        @extend %h3;
    }
    > .n-card-header .n-card-header__close {
        display: none;
    }
    > .n-card__content:first-child,
    > .n-card__footer:first-child {
        padding-top: 0;
    }

    > .n-card__content {
        position: relative;
    }

    > .n-card__content,
    > .n-card__footer {
        padding: 0 15px 15px;
    }
}
.externalUserInfo-model.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    background-size: 100% auto;
    > .n-card-header {
        display: none;
    }
}

.container.n-card {
    > .n-card__content,
    > .n-card__footer {
        padding: 0;
    }
}
@media (max-width: 768px) {
    .externalUserInfo-model.n-card.n-modal {
        width: 70%;
    }
}
.info--editName {
    .n-input {
        width: 80%;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.container {
    position: relative;
    .background {
        position: absolute;
        left: -15px;
        width: 300px;
        height: 70px;
        background-color: $primary-1;
    }
    .info {
        &__name {
            color: $gray-3;
            font-size: $font-size-14;
            font-weight: 400;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                margin-left: 20px;
                cursor: pointer;
            }
        }
        &__mobile {
            color: $gray-3;
            font-size: $font-size-14;
            font-weight: 400;
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .container__call {
            margin-top: 30px;
            display: flex;
            justify-content: space-around;
            .call--web {
                display: block;
            }
            li {
                text-align: center;
                cursor: pointer;
            }
        }
    }
    .info--editName {
        display: flex;
        flex-direction: column;
        align-items: center;
        .chagePhoto {
            color: $primary-1;
            cursor: pointer;
        }
        &__mobile {
            color: $gray-3;
            font-size: $font-size-14;
            font-weight: 400;
            display: flex;
            justify-content: center;
            margin-top: 10px;
            margin-bottom: 20px;
        }
    }
    .info--editPhoto {
        .iconImg {
            cursor: pointer;
        }
        .btn-wrap {
            margin-top: 30px;
            .save-button {
                background-color: #3e3e3e;
                color: #fff;
                width: 40px;
                height: 25px;
                line-height: 25px;
                margin: 0 auto;
                border-radius: 12.5px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
}
.active {
    position: relative;
    &::before {
        content: "✔";
        position: absolute;
        width: 100%;
        height: 100%;
        color: $white;
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-size-22;
    }
    &::after {
        content: "";
        position: absolute;
        background-color: $gray-1;
        opacity: 0.6;
        width: 100%;
        height: 100%;
        z-index: 99;
    }
}
</style>
