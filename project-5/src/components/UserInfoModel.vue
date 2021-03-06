<template>
    <n-modal
        class="userInfo-model"
        @click.prevent="closeModal"
        v-model:show="showModal"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <div class="closeBtn" @click.prevent="closeModal">
                <img :src="closeIcon" alt="關閉" />
            </div>
            <UserInfo :info="info" />
            {{ info }}
            <div class="container__description">{{ info.description }}</div>
            <ul class="container__call">
                <li class="call--web" @click.prevent="onPhoneCallModal(info.chatroomID)">
                    <span class="icon"><img :src="phoneIcon" alt="語音通話" /></span>
                    <p class="text">語音通話</p>
                </li>
                <li
                    v-if="route.path !== '/'"
                    @touchend.prevent="gotoChat(info.eventID, info.chatroomID, info.mobile)"
                >
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
import { NModal, NCard } from "naive-ui";

import phoneIcon from "@/assets/Images/common/phone-round.svg";
import messageIcon from "@/assets/Images/common/message-round.svg";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { DO_CALL_NAME } from "@/util/commonUtil";
import UserInfo from "@/components/UserInfo.vue";
import closeIcon from "@/assets/Images/common/close-round.svg";

const route = useRoute();
const router = useRouter();
//model store
const modelStore = useModelStore();
const { closeModal, gotoChat } = modelStore;
const { showModal, info, phoneCallModal } = storeToRefs(modelStore);
//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;

const onPhoneCallModal = (chatroomID) => {
    phoneCallModal.value = true;
    doCall(chatroomID);
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.userInfo-model.n-modal {
    .n-card {
        background: transparent;
    }
}
.userInfo-model.n-card {
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
.userInfo-model.n-card.n-modal {
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
    .userInfo-model.n-card.n-modal {
        width: 70%;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.userInfo-model.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    background: $white url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
    background-size: 100% auto;
}
.container {
    &__description {
        width: 100%;
        text-align: center;
        margin: 1em auto;
        color: $gray-1;
        font-size: $font-size-14;
        font-weight: 500;
        line-height: 1.6;
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
