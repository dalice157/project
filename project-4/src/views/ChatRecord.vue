<template>
    <div class="chat-record" :class="{ 'menu--toggle': hamburgerBoolean }">
        <HamburgerBar @menuToggle="menuToggle" />
        <div class="chat-record__main">
            <!-- 聊天室交談紀錄列表 -->
            <ChatRecordSearch />
            <ChatRecordMessage @getChangeList="getChangeList" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import axios from "axios";

import { useApiStore } from "@/store/api";
import HamburgerBar from "@/components/HamburgerBar.vue";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordMessage from "@/components/ChatRecord/ChatRecordMessage.vue";
import config from "@/config/config";
import { signature } from "@/util/deviceUtil";

const apiStore = useApiStore();
const { getEventListApi, getBackendApi } = apiStore;
const { isIllegalDevice } = storeToRefs(apiStore);
const route = useRoute();

//漢堡選單
const hamburgerBoolean = ref();
const menuToggle = (menuBoolean: any) => {
    hamburgerBoolean.value = menuBoolean;
};

const getChangeList = (lists: any) => {
    // console.log("=======",lists);
    lists.forEach((list: any) => {
        list.isfunctionPopUp = false;
    });
};
onMounted(() => {
    axios({
        method: "get",
        url: `${config.serverUrl}/login/${route.params.eventKey}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            isIllegalDevice.value = false;
            getBackendApi(route.params.eventKey);
            getEventListApi(route.params.eventKey);
        })
        .catch((err: any) => {
            console.error(err);
            if (err.response.status === 401) {
                isIllegalDevice.value = true;
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
    grid-area: body;
    display: none;
}
@media (max-width: 768px) {
    .chat-record {
        width: 100%;
        min-height: 100%;
        display: grid;
        grid:
            "header" 120px
            "main" 1fr;
        gap: 0;
        transform: translateX(0px);
        -webkit-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        &.menu--toggle {
            transform: translateX(250px);
            -webkit-transition: all 0.7s ease-in-out;
            -o-transition: all 0.7s ease-in-out;
            transition: all 0.7s ease-in-out;
        }
        &__main {
            grid-area: main;
        }
    }
}
</style>
