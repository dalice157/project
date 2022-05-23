<template>
    <div class="phone">
        <div class="phon__vision">
            <n-avatar
                class="avatar"
                round
                :size="120"
                object-fit="cover"
                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                :src="`${config.fileUrl}${eventInfo.icon}`"
            />
            <div class="name">
                <h1>{{ eventInfo.name }}</h1>
            </div>
            <div v-if="!isAccepted" class="call-status">
                <p>撥號中</p>
                <PulseLoader color="#ffb400" size="10px"></PulseLoader>
            </div>
            <div v-if="isAccepted" class="call-status">
                <p>{{ phoneTime }}</p>
                <ScaleLoader class="scale" color="#ffb400" height="20px" width="3px"></ScaleLoader>
            </div>
        </div>
        <div class="phone__function-bar">
            <div class="phone__microphone">
                <img :src="voiceFillDisabled" alt="voice--disabled" />
                <p>關閉</p>
                <p>麥克風</p>
            </div>
            <div class="close">
                <router-link :to="`/${eventKey}`">
                    <img
                        @[events]="doHangup(!isAccepted ? 2 : 3, eventID(route.params.eventKey))"
                        :src="closeIcon"
                        alt="掛斷"
                    />
                </router-link>
            </div>
            <div class="phone__speaker" @[events]="speakerBoolean = !speakerBoolean">
                <img
                    :src="notificationDisabled"
                    alt="notification--disabled"
                    v-show="!speakerBoolean"
                />
                <p v-show="!speakerBoolean">開啟</p>
                <p v-show="!speakerBoolean">擴音</p>
                <img
                    :src="notificationEnalbed"
                    alt="notification--enalbed"
                    v-show="speakerBoolean"
                />
                <p v-show="speakerBoolean" style="color: #ffb400">關閉</p>
                <p v-show="speakerBoolean" style="color: #ffb400">擴音</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar } from "naive-ui";
import { useRoute } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";

import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";
import config from "@/config/config";
import { eventID, isMobile } from "@/util/commonUtil";
import voiceFillDisabled from "@/assets/Images/chatroom/voice-fill-disabled.svg";
import closeIcon from "@/assets/Images/chatroom/close-round-red.svg";
import notificationDisabled from "@/assets/Images/chatroom/notification-fill-disabled.svg";
import notificationEnalbed from "@/assets/Images/chatroom/notification-fill-enabled.svg";

const events = ref(isMobile ? "touchend" : "click");

// api store
const apiStore = useApiStore();
const { getBackendApi } = apiStore;
const { eventInfo } = storeToRefs(apiStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { doHangup } = phoneCallStore;
const { isAccepted, phoneTime } = storeToRefs(phoneCallStore);

//router
const route = useRoute();
const eventKey = computed(() => route.params.eventKey);
//擴音boolean
const speakerBoolean = ref(false);
//拿取後端api
getBackendApi(eventKey.value);
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.phone {
    grid-area: body;
    width: 100%;
    height: 100%;
    background: url("~@/assets/Images/phone/phone-bg.svg") no-repeat center top;
    position: relative;
    &__vision {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding-top: 50px;
        .name {
            margin-top: 15px;
            h1 {
                @extend %h1;
                font-family: $font-family;
                color: $gray-1;
            }
        }
        .call-status {
            margin-top: 15px;
            p {
                @extend %h4;
                font-family: $font-family;
                color: $gray-1;
                margin-bottom: 64px;
            }
        }
    }

    &__function-bar {
        width: 100%;
        padding-bottom: 50px;
        background-color: $white;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    &__microphone {
        text-align: center;
        p {
            margin-top: 10px;
            font-size: $font-size-10;
            font-family: $font-family;
            color: $gray-1;
        }
        p + p {
            margin-top: 2px;
        }
    }
    &__speaker {
        p {
            margin-top: 10px;
            font-size: $font-size-10;
            font-family: $font-family;
            color: $gray-1;
        }
        p + p {
            margin-top: 2px;
        }
    }
    .avatar {
        margin: 0 auto;
    }
}
@media (max-width: 768px) {
    .phone {
        width: 100%;
        height: 100%;
        background: url("~@/assets/Images/phone/phone-bg-428.svg") no-repeat center top;
    }
}
</style>
