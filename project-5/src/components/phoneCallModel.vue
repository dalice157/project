<template>
    <n-modal
        class="phoneCallModel"
        v-model:show="phoneCallModal"
        preset="card"
        :mask-closable="false"
    >
        <n-card :bordered="false" size="huge" class="phoneCallContainer">
            <div class="phoneCallBackground">
                <div class="phoneCallAvatar">
                    <n-avatar
                        class="avatar"
                        round
                        :size="120"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${filterUserInfo.icon == '0' ? user_pic_defaul : ''}`"
                    />
                </div>
            </div>
            <h1 class="title">
                {{ "+" + String(filterUserInfo.mobile).slice(0, 3) }}
                {{ String(filterUserInfo.mobile).slice(-9) }}
            </h1>
            <div v-if="!isAccepted" class="phoneStatus">
                <p>撥號中</p>
                <PulseLoader color="#ffb400" size="10px"></PulseLoader>
            </div>
            <div v-if="isAccepted" class="phoneStatus">
                <p>{{ phoneTime }}</p>
                <ScaleLoader class="scale" color="#ffb400" height="20px" width="3px"></ScaleLoader>
            </div>
            <div class="phoneCallModelFunctionBar">
                <div class="phoneMicrophone">
                    <img :src="voiceDisabled" alt="#" />
                    <p>關閉</p>
                    <p>麥克風</p>
                </div>
                <div class="phoneClose">
                    <img
                        @click="doHangup(!isAccepted ? 2 : 3, chatRoomID, route.params.id)"
                        :src="closeIcon"
                        alt="掛斷"
                    />
                </div>
            </div>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { watchEffect, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { NModal, NCard, NAvatar } from "naive-ui";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";

import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import config from "@/config/config";
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";
import voiceDisabled from "@/assets/Images/chatroom/voice-fill-disabled.svg";
import closeIcon from "@/assets/Images/chatroom/close-round-red.svg";

//route
const route = useRoute();

// api store
const apiStore = useApiStore();
const { chatroomList } = storeToRefs(apiStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { doHangup } = phoneCallStore;
const { isAccepted, phoneTime } = storeToRefs(phoneCallStore);

//modal store
const modelStore = useModelStore();
const { closeModal } = modelStore;
const { phoneCallModal, info } = storeToRefs(modelStore);

const chatRoomID: any = computed(() => route.query.chatroomID);
const filterUserInfo = computed(() => {
    return chatroomList.value.find((item) => {
        return item.chatroomID === chatRoomID.value;
    });
});
</script>
<style lang="scss">
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";

.phoneCallModel {
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
        .phoneCallBackground {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 375px;
            height: 180px;
            background: url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
            background-size: cover;
        }
        .title {
            @extend %h1;
            font-family: $font-family;
        }
        .phoneStatus {
            margin-top: 10px;
            p {
                margin-bottom: 30px;
            }
        }
        .phoneCallModelFunctionBar {
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .phoneMicrophone {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 30px;
                margin-bottom: 30px;
                cursor: pointer;
            }
            .phoneClose {
                cursor: pointer;
            }
        }
    }
    .n-card__content:first-child {
        padding-top: 0;
    }
}
</style>
