<template>
    <n-config-provider
        class="all"
        :theme-overrides="themeOverrides"
        :locale="zhTW"
        :date-locale="dateZhCN"
    >
        <router-view name="login"></router-view>
        <!--監聽route query change寫法 1 <router-view name="container":key="route.query"></router-view> -->

        <router-view name="container" v-slot="{ Component }">
            <keep-alive include="ChatRoom">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { NConfigProvider, GlobalThemeOverrides, dateZhCN } from "naive-ui";

import { useApiStore } from "@/store/api";
import zhTW from "@/assets/js/zhTW";
import config from "@/config/config";

const apiStore = useApiStore();

const route = useRoute();

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#ffb400",
    },
    Input: {
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
        border: "1px solid #8b8b8b",
        borderRadius: "5px",
    },
    Button: {
        textColor: "#ffb400",
    },
    Checkbox: {
        colorChecked: "orange",
        borderChecked: "1px solid rgb(224, 224, 230)",
        borderFocus: "1px solid rgb(224, 224, 230)",
        boxShadowFocus: "transparent",
    },
    Radio: {
        dotColorActive: "#ffb400",
        boxShadowHover: "inset 0 0 0 1px #ffb400",
        boxShadowFocus: "inset 0 0 0 1px #ffb400",
        boxShadowActive: "inset 0 0 0 1px #ffb400",
    },
    // ...
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
    color: $gray-1;
    height: 100%;
}
</style>
