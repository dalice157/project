<template>
    <div class="phone">
        <div class="keyVision">
            <div class="avatar">
                <n-avatar
                    round
                    :size="150"
                    object-fit="cover"
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    :src="`${config.serverUrl}/image/${eventInfo.icon}`"
                />
            </div>
            <div class="clientName">
                <p>{{ eventInfo.name }}</p>
            </div>
            <div class="callStatus">
                <p>撥號中</p>
            </div>
        </div>
        <div class="functionBar">
            <n-icon size="70" color="#fff">
                <mic-off-outline />
            </n-icon>
            <n-icon size="70" color="red">
                <router-link to="/chat/:id">
                    <call-outline />
                </router-link>
            </n-icon>
            <n-icon size="70" color="#fff">
                <videocam-outline />
            </n-icon>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted } from "vue";
import { useApiStore } from "../store/api";
import { storeToRefs } from "pinia";
import { NAvatar, NIcon } from "naive-ui";
import { MicOffOutline, CallOutline, VideocamOutline } from "@vicons/ionicons5";
import config from "../config/config";

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.phone {
    height: calc(100vh - 60px);
    background-color: #fff;
    .keyVision {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .avatar {
            margin-top: -3em;
            margin-bottom: 2em;
        }
        .clientName {
            p {
                font-size: 50px;
                color: #727272;
            }
        }
        .callStatus {
            margin-top: 2em;
            font-size: 20px;
        }
    }
    .functionBar {
        width: 100%;
        height: 20%;
        background-color: #bebbb6;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .n-icon {
            cursor: pointer;
            a {
                color: $danger;
            }
        }
    }
}
@media (max-width: 768px) {
    .phone {
        height: calc(100vh - 66px);
    }
}
</style>
