<template>
    <div class="chat-record" :class="{ 'menu--toggle': hamburgerBoolean }">
        <HamburgerBar @menuToggle="menuToggle" />
        <ChatRecordSearch />
        <div class="chat-record__main">
            <!-- 聊天室交談紀錄列表 -->
            <ChatRecordMessage @getChangeList="getChangeList" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import axios from "axios";

import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import HamburgerBar from "@/components/HamburgerBar.vue";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordMessage from "@/components/ChatRecord/ChatRecordMessage.vue";
import config from "@/config/config";
import { signature } from "@/util/deviceUtil";
import { unixTime } from "@/util/dateUtil";

const apiStore = useApiStore();
const { getEventListApi, getBackendApi, getHistoryMessage1, getHistoryMessage2 } = apiStore;
const { isIllegalDevice, historyMessageList } = storeToRefs(apiStore);
const route = useRoute();

// 彈窗 store
const modelStore = useModelStore();
const { isLoading } = storeToRefs(modelStore);
//漢堡選單
const hamburgerBoolean = ref(false);
const menuToggle = (menuBoolean: any) => {
    hamburgerBoolean.value = menuBoolean;
};

const getChangeList = (lists: any) => {
    lists.forEach((list: any) => {
        list.isfunctionPopUp = false;
    });
};
onMounted(() => {
    isLoading.value = true;
});
// 換裝置 初始化api
onMounted(() => {
    axios({
        method: "get",
        url: `${config.serverUrl}/login/${route.params.eventKey}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            isIllegalDevice.value = 0;
            isLoading.value = false;
            // getBackendApi(route.params.eventKey);
            getEventListApi(route.params.eventKey);
        })
        .catch((err: any) => {
            isLoading.value = false;
            console.error("login err", err);
            if (err.response.status === 401) {
                if (err.response.data.code === -1) {
                    isIllegalDevice.value = 1;

                    return;
                }
                if (err.response.data.code === -3) {
                    isIllegalDevice.value = 3;

                    return;
                }
            }
            if (err.response.status === 404) {
                noChatToken.value = true;
                return;
            }
        });
});
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.chat-record {
    height: 100%;
    // grid-area: body;
    display: none;
}
@media (max-width: 768px) {
    .chat-record {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        // display: grid;
        // grid:
        //     "header" 120px
        //     "main" 1fr;
        // gap: 0;
        transform: translateX(0px);
        -webkit-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        &.menu--toggle {
            transform: translateX(280px);
            -webkit-transition: all 0.7s ease-in-out;
            -o-transition: all 0.7s ease-in-out;
            transition: all 0.7s ease-in-out;
        }
        &__main {
            height: 100%;
            // grid-area: main;
        }
    }
}
</style>
