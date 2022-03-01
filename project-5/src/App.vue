<template>
    <div class="all" @click="closeChatBubble">
        <router-view name="login"></router-view>
        <router-view name="container"></router-view>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useApiStore } from "@/store/api";
import { txt } from "@/util/interfaceUtil";
import config from "@/config/config";

const apiStore = useApiStore();
const { chatroomMsg } = storeToRefs(apiStore);

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    chatroomMsg.value.messageList.forEach((text: txt) => {
        text.msgFunctionStatus = false;
    });
};
</script>
<style lang="scss">
.viewer-list {
    transform: none !important;
    margin: 0 auto !important;
}
.viewer-play {
    display: none;
}
.viewer-rotate-left {
    display: none;
}
.viewer-rotate-right {
    display: none;
}
.viewer-reset {
    display: none;
}
.viewer-one-to-one {
    display: none;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.all {
    user-select: none;
    height: 100%;
    color: $gray-1;
}
</style>
