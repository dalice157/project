<template>
    <n-modal
        class="phoneCall-model"
        v-model:show="phoneCallModal"
        preset="card"
        :mask-closable="false"
    >
        <n-card :bordered="false" size="huge">
            <div class="phoneCall-model__bg">
                <div class="phoneCallAvatar">
                    <n-avatar
                        class="avatar"
                        round
                        :size="120"
                        object-fit="cover"
                        :fallback-src="user_pic_defaul"
                        :src="img"
                    />
                </div>
            </div>
            <h1 class="phoneCall-model__title">
                {{
                    filterUserInfo.name !== "" || filterUserInfo.name !== null
                        ? filterUserInfo.name
                        : null
                }}
                {{
                    filterUserInfo.name == "" || filterUserInfo.name == null
                        ? "+" +
                          String(filterUserInfo.mobile).slice(0, 3) +
                          " " +
                          String(filterUserInfo.mobile).slice(-9)
                        : null
                }}
            </h1>
            <div v-if="!isAccepted" class="phoneCall-model__phoneStatus">
                <p>撥號中</p>
                <PulseLoader color="#ffb400" size="10px"></PulseLoader>
            </div>
            <div v-if="isAccepted" class="phoneCall-model__phoneStatus">
                <p>{{ phoneTime }}</p>
                <ScaleLoader class="scale" color="#ffb400" height="20px" width="3px"></ScaleLoader>
            </div>
            <div class="phoneCall-model__function-bar">
                <div class="microphone--disable" v-if="isDisabled">
                    <img :src="isMuted ? voiceDisabled : voiceEnabled" alt="#" />
                    <p>{{ isMuted ? "開啟" : "關閉" }}</p>
                    <p>麥克風</p>
                </div>
                <div class="microphone" v-else @click="onVoice">
                    <img :src="isMuted ? voiceDisabled : voiceEnabled" alt="#" />
                    <p>{{ isMuted ? "開啟" : "關閉" }}</p>
                    <p>麥克風</p>
                </div>
                <div class="phone--close">
                    <img
                        @click="doHangup(!isAccepted ? 2 : 3, chatRoomID, route.params.id, sender)"
                        :src="closeIcon"
                        alt="掛斷"
                    />
                </div>
            </div>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { watchEffect, computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { NModal, NCard, NAvatar } from "naive-ui";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";

import { isProduction, isStaging } from "@/util/commonUtil";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { imgList } from "@/util/commonUtil";
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";
import voiceDisabled from "@/assets/Images/chatroom/voice-fill-disabled.svg";
import voiceEnabled from "@/assets/Images/chatroom/voice-fill-enabled.svg";
import closeIcon from "@/assets/Images/chatroom/close-round-red.svg";

//route
const route = useRoute();

// api store
const apiStore = useApiStore();
const { chatroomList, userInfo } = storeToRefs(apiStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { doHangup } = phoneCallStore;
const { isAccepted, phoneTime, isMuted, callPlugin, sender } = storeToRefs(phoneCallStore);

//modal store
const modelStore = useModelStore();
// const {} = modelStore;
const { phoneCallModal, info } = storeToRefs(modelStore);

const chatRoomID: any = computed(() => route.query.chatroomID);
const filterUserInfo = computed(() => {
    return chatroomList.value.find((item) => {
        return item.chatroomID === chatRoomID.value;
    });
});

const img = ref(null);
// 環境設定
const getSplit = isProduction || isStaging ? 4 : 5;
watch(
    userInfo,
    () => {
        img.value = imgList.find((item) => {
            // console.log('save item.split("/"):', item.split("/"));
            const icon =
                item.split("/")[getSplit] === "default.svg"
                    ? 0
                    : item.split("/")[getSplit].split(".")[0];
            return icon == userInfo.value.icon;
        });
    },
    { immediate: true }
);

const isDisabled = ref(false);
const preventReClickFun = () => {
    if (!isDisabled.value) {
        isDisabled.value = true;
        setTimeout(() => {
            isDisabled.value = false;
        }, 2000);
    }
};

const onVoice = () => {
    preventReClickFun();
    isMuted.value = !isMuted.value;
    callPlugin.value.send({ message: { request: "set", audio: !isMuted.value } });
};
</script>
<style lang="scss">
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";

.phoneCall-model {
    width: 375px;
    height: 600px;
    .n-card-header {
        display: none;
    }
    .n-card__content {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .n-card__content:first-child {
        padding-top: 0;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.phoneCall-model {
    &__bg {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 375px;
        height: 180px;
        background: url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
        background-size: cover;
    }
    &__title {
        @extend %h1;
        font-family: $font-family;
    }
    &__phoneStatus {
        margin-top: 10px;
        p {
            margin-bottom: 30px;
        }
    }
    &__function-bar {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
.microphone {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
    cursor: pointer;
    &--disable {
        opacity: 0.5;
        cursor: not-allowed;
        @extend .microphone;
    }
}
.phone--close {
    cursor: pointer;
}
</style>
