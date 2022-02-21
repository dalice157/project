<template>
    <div class="phone">
        <div class="keyVision">
            <n-avatar
                class="avatar"
                round
                :size="120"
                object-fit="cover"
                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                :src="`${config.fileUrl}/fls/${eventInfo.icon}`"
            />
            <div class="clientName">
                <h1>{{ eventInfo.name }}</h1>
            </div>
            <div v-if="!isAccepted" class="callStatus">
                <p>撥號中</p>
                <PulseLoader color="#ffb400" size="10px"></PulseLoader>
            </div>
            <div v-if="isAccepted" class="callStatus">
                <p>{{ phoneTime }}</p>
                <ScaleLoader class="scale" color="#ffb400" height="20px" width="3px"></ScaleLoader>
            </div>
        </div>
        <div class="phoneFunctionbar">
            <div class="phoneMicrophone">
                <img src="../assets/Images/chatroom/voice-fill-disabled.svg" alt="#" />
                <p>關閉</p>
                <p>麥克風</p>
            </div>
            <div class="phoneClose">
                <router-link :to="`/?chatToken=${chatToken}`">
                    <img
                        @click="doHangup(!isAccepted ? 2 : 3)"
                        src="../assets/Images/chatroom/close-round-red.svg"
                        alt="掛斷"
                    />
                </router-link>
            </div>
            <div class="phoneSpeaker" @click="speakerBoolean = !speakerBoolean">
                <img
                    src="../assets/Images/chatroom/notification-fill-disabled.svg"
                    alt="#"
                    v-show="!speakerBoolean"
                />
                <p v-show="!speakerBoolean">開啟</p>
                <p v-show="!speakerBoolean">擴音</p>
                <img
                    src="../assets/Images/chatroom/notification-fill-enabled.svg"
                    alt="#"
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
import config from "@/config/config";

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
const chatToken = computed(() => route.query.chatToken);
//擴音boolean
const speakerBoolean = ref(false);
//拿取後端api
getBackendApi(chatToken.value);
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

    .avatar {
        margin: 0 auto;
    }
    .keyVision {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding-top: 50px;
        .clientName {
            margin-top: 15px;
            h1 {
                @extend %h1;
                font-family: $font-family;
                color: $gray-1;
            }
        }
        .callStatus {
            margin-top: 15px;
            p {
                @extend %h4;
                font-family: $font-family;
                color: $gray-1;
                margin-bottom: 64px;
            }
        }
    }
    .phoneFunctionbar {
        width: 100%;
        padding-bottom: 50px;
        background-color: $white;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .phoneMicrophone {
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
        .phoneSpeaker {
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
