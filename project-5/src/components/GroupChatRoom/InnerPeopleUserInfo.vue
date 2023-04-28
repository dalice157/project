<template>
    <n-modal
        class="internalUserInfo-model"
        :mask-closable="false"
        v-model:show="internalPeopleInfoSwitch"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <div class="background"></div>
            <div class="closeBtn" @click.prevent="internalPeopleInfoSwitch = false">
                <img :src="closeIcon" alt="關閉" />
            </div>
            <div class="user__photo">
                <n-avatar
                    round
                    :size="75"
                    object-fit="cover"
                    :src="`${config.fileUrl}${innerPeopleInfo.icon}`"
                    v-if="innerPeopleInfo.icon"
                />
                <n-avatar round :size="75" object-fit="cover" :src="user_pic_default" v-else />
            </div>
            <div class="info">
                <h1 class="info__name">{{ innerPeopleInfo.name }}</h1>
                <p class="info__phone">{{ innerPeopleInfo.mobile }}</p>
                <div class="info__description">
                    <p class="key">帳號</p>
                    <p class="value">{{ innerPeopleInfo.account }}</p>
                </div>
                <div class="info__description">
                    <p class="key">Email</p>
                    <p class="value">{{ innerPeopleInfo.email }}</p>
                </div>
                <div class="info__description">
                    <p class="key">部門</p>
                    <p class="value">{{ innerPeopleInfo.department }}</p>
                </div>
                <div class="info__description">
                    <p class="key">職稱</p>
                    <p class="value">{{ innerPeopleInfo.role }}</p>
                </div>
                <div class="info__description">
                    <p class="key">公司電話</p>
                    <p class="value">{{ innerPeopleInfo.telephone }}</p>
                </div>
                <div class="info__description">
                    <p class="key">分機</p>
                    <p class="value">{{ innerPeopleInfo.ext }}</p>
                </div>
            </div>
            <ul class="container__call">
                <!-- @click.prevent="onPhoneCallModal(info.chatroomID)" -->
                <!-- <li class="call--web">
                    <span class="icon"><img :src="phoneIcon" alt="語音通話" /></span>
                    <p class="text">語音通話</p>
                </li> -->
                <!-- @touchend.prevent="gotoChat(info.eventID, info.chatroomID, info.mobile)" -->
                <li @click="openNewChatroom">
                    <span class="icon"><img :src="messageIcon" alt="傳送訊息" /></span>
                    <p class="text">傳送訊息</p>
                </li>
            </ul>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { defineComponent, ref, toRef, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { NModal, NCard, NAvatar } from "naive-ui";
import config from "@/config/config";

import phoneIcon from "@/assets/Images/groupChat/phone-round.svg";
import messageIcon from "@/assets/Images/groupChat/message-round.svg";
import { useApiStore } from "@/store/api";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { DO_CALL_NAME } from "@/util/commonUtil";
import user_pic_default from "@/assets/Images/mugShot/User-round.svg";
import closeIcon from "@/assets/Images/groupChat/close-round_w.svg";

const route = useRoute();
const router = useRouter();
//model store
const modelStore = useModelStore();
const { gotoChat } = modelStore;
const { internalPeopleInfoSwitch, innerPeopleInfo, phoneCallModal } = storeToRefs(modelStore);
//api store
const apiStore = useApiStore();
const { addGroup } = apiStore;
//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;
//群聊聊天室 針對單一 User 打電話
// const onPhoneCallModal = (chatroomID) => {
//     phoneCallModal.value = true;
//     doCall(chatroomID);
// };
const userName = localStorage.getItem("userName");
const accountID = localStorage.getItem("accountID");
// 針對單一後台使用者聊天
const openNewChatroom = () => {
    // console.log("innerPeopleInfo", innerPeopleInfo.value);
    let name = userName + "," + innerPeopleInfo.value.account;
    let internelMember = accountID + "," + String(innerPeopleInfo.value.accountID);
    const addData = {
        name,
        icon: "",
        internelMember,
    };
    console.log("addData", addData);
    addGroup(addData);
    internalPeopleInfoSwitch.value = false;
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-modal-mask {
    background-color: transparent;
}
.internalUserInfo-model.n-modal {
    .n-card {
        background: transparent;
    }
}
.internalUserInfo-model.n-card {
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
            border: 1px solid $border-line;
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
.internalUserInfo-model.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    height: 472px;
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
    .internalUserInfo-model.n-card.n-modal {
        width: 70%;
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
            color: $gray-1;
            text-align: center;
            font-size: $font-size-16;
            font-weight: 500;
        }
        &__phone {
            color: $gray-3;
            text-align: center;
            font-size: $font-size-14;
            font-weight: 400;
        }
        &__description {
            color: $gray-3;
            font-size: $font-size-14;
            font-weight: 400;
            display: flex;
            .key {
                width: 60px;
            }
            .value {
                margin-left: 50px;
                color: $gray-1;
                font-size: $font-size-14;
                font-weight: 400;
            }
        }
    }
    &__call {
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
</style>
