<template>
    <n-modal
        class="chatRecordCard"
        @click.prevent="closeModal"
        v-model:show="showModal"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <div class="closeBtn" @click.stop="closeModal">
                <img :src="closeIcon" alt="關閉" />
            </div>
            <UserInfo :info="info" />
            <div class="description">{{ info.description }}</div>
            <ul class="call_container">
                <li
                    v-if="eventInfo.callable === true"
                    class="call-phone"
                    @click.stop="onPhoneCallModal"
                >
                    <span class="icon"><img :src="phoneIcon" alt="語音通話" /></span>
                    <p class="text">語音通話</p>
                </li>
                <li v-if="route.path !== '/'" @click.stop="gotoChat(info.eventKey)">
                    <span class="icon"><img :src="messageIcon" alt="傳送訊息" /></span>
                    <p class="text">傳送訊息</p>
                </li>
            </ul>
        </n-card>
    </n-modal>
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
import { DO_CALL_NAME } from "@/util/commonUtil";
import UserInfo from "@/components/UserInfo.vue";
import closeIcon from "@/assets/Images/common/close-round.svg";

const route = useRoute();
//model store
const modelStore = useModelStore();
const { closeModal, gotoPhone, gotoChat } = modelStore;
const { showModal, info, phoneCallModal } = storeToRefs(modelStore);
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
        showModal.value = false;
        phoneCallModal.value = true;
        const getCutomer = participantList.value.filter((item) => !item.includes("DA1"))[0];
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
.chatRecordCard.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    background: $white url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
    background-size: 100% auto;
    .description {
        width: 100%;
        text-align: center;
        margin: 1em auto;
        color: $gray-1;
        font-size: $font-size-16;
        font-weight: 500;
        line-height: 1.6;
    }
    .call_container {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
        .call-phone {
            display: block;
        }
        li {
            text-align: center;
            cursor: pointer;
        }
    }
}
</style>
