<template>
    <teleport to="body" v-if="showUserInfoModal">
        <div class="mask">
            <div class="deviceCode">
                <div class="closeBtn" @[events].stop="closeModal">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <UserInfo :info="info" />
                <div class="description">
                    {{ info.description }}
                </div>
                <div class="homeURL" v-if="info.homeurl">
                    <p>活動網址:</p>
                    <a :href="info.homeurl" target="_blank">{{ info.homeurl }}</a>
                </div>
                <!-- <ul class="call_container">
                <li
                    v-if="eventInfo.callable === true"
                    class="call-phone"
                    @[events].stop="onPhoneCallModal"
                >
                    <span class="icon"><img :src="phoneIcon" alt="語音通話" /></span>
                    <p class="text">語音通話</p>
                </li>
                <li v-if="route.path !== '/'" @[events].stop="gotoChat(info.eventKey)">
                    <span class="icon"><img :src="messageIcon" alt="傳送訊息" /></span>
                    <p class="text">傳送訊息</p>
                </li>
            </ul> -->
            </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
import { defineComponent, ref, toRef, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { NModal, NCard } from "naive-ui";

import phoneIcon from "@/assets/Images/common/phone-round.svg";
import messageIcon from "@/assets/Images/common/message-round.svg";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";
import { useApiStore } from "@/store/api";
import { isMobile } from "@/util/commonUtil";
import UserInfo from "@/components/UserInfo.vue";
import closeIcon from "@/assets/Images/common/close-round.svg";

const events = ref(isMobile ? "touchend" : "click");

const route = useRoute();
//model store
const modelStore = useModelStore();
const { closeModal, gotoPhone, gotoChat } = modelStore;
const { showUserInfoModal, info, phoneCallModal } = storeToRefs(modelStore);
//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;

// chat store
const chatStore = useChatStore();
const { participantList, isOnline } = storeToRefs(chatStore);

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

const onPhoneCallModal = () => {
    if (isOnline.value === true) {
        showUserInfoModal.value = false;
        phoneCallModal.value = true;
        const getCutomer = participantList.value[0];
        doCall(getCutomer);
    } else {
        alert("對方已離線,電話無法撥通!!!");
    }
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.chatRecordCard.n-modal {
    .n-card {
        background: transparent;
    }
}
.chatRecordCard.n-card {
    .closeBtn {
        position: absolute;
        right: -5px;
        top: -20px;
        z-index: 100;
        width: 28px;
        height: 28px;
        cursor: pointer;
        img {
            width: 100%;
        }
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
.chatRecordCard.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    background: $white url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
    background-size: 100% auto;
    > .n-card-header {
        padding: 0;
        height: 30px;
    }
}

.container.n-card {
    > .n-card__content,
    > .n-card__footer {
        padding: 0;
    }
}
@media (max-width: 768px) {
    .chatRecordCard.n-card.n-modal {
        width: 70%;
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
    display: flex;
    justify-content: center;
    align-items: center;
    .deviceCode {
        border-radius: 4px;
        width: 280px;
        min-height: 200px;
        padding: 20px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        background: $white url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center
            top;
        background-size: 100% auto;
        .psWord {
            margin-top: 10px;
            line-height: 1.6;
        }
        .description {
            padding-top: 15px;
            width: 90%;
            margin: auto;
            word-wrap: break-word;
            line-height: 1.5;
        }
        .homeURL {
            padding-top: 15px;
            width: 90%;
            margin: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            word-break: break-word;
            p {
                display: block;
            }
        }
        .closeBtn {
            position: absolute;
            right: 10px;
            top: 10px;
            z-index: 100;
            width: 28px;
            height: 28px;
            cursor: pointer;
            img {
                width: 100%;
            }
        }
        h2 {
            @extend %h2;
            margin-bottom: 15px;
        }
    }
}
</style>
