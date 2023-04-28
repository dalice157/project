<template>
    <n-config-provider
        class="all"
        :theme-overrides="themeOverrides"
        :locale="zhTW"
        :date-locale="dateZhTW"
    >
        <router-view name="login"></router-view>
        <!--監聽route query change寫法 1 <router-view name="container":key="route.query"></router-view> -->
        <router-view name="container" v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { NConfigProvider, GlobalThemeOverrides, zhTW, dateZhTW } from "naive-ui";

import { useApiStore } from "@/store/api";
// import zhTW from "@/assets/js/zhTW";
import config from "@/config/config";

const apiStore = useApiStore();

const route = useRoute();

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#f9935c",
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
        textColor: "#f9935c",
    },
    Checkbox: {
        colorChecked: "orange",
        borderChecked: "1px solid rgb(224, 224, 230)",
        borderFocus: "1px solid rgb(224, 224, 230)",
        boxShadowFocus: "transparent",
    },
    Radio: {
        dotColorActive: "#f9935c",
        boxShadowHover: "inset 0 0 0 1px #f9935c",
        boxShadowFocus: "inset 0 0 0 1px #f9935c",
        boxShadowActive: "inset 0 0 0 1px #f9935c",
    },
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

.guide2,
.guide3,
.guide4,
.guide5,
.guide6 {
    background: white url("~@/assets/Images/common/guide-pages-bg.png") no-repeat top left !important;
    background-size: cover !important;
    height: 200px !important;
    text-align: center;
    padding-top: 70px !important;
}

.guide2 .driver-popover-description,
.guide3 .driver-popover-description,
.guide4 .driver-popover-description,
.guide5 .driver-popover-description,
.guide6 .driver-popover-description {
    font-weight: bold !important;
}

.guide6 .driver-popover-description {
    margin-top: -30px;
}

.driver-close-btn,
.driver-prev-btn,
.driver-next-btn {
    position: absolute;
    bottom: 20px;
    background: #ffb400 !important;
    color: #fff !important;
    border: none !important;
    text-shadow: none !important;
}

.driver-close-btn {
    left: 20px;
}

.driver-prev-btn {
    right: 90px;
}

.driver-next-btn {
    right: 20px;
}

.driver-prev-btn.driver-disabled {
    display: none !important;
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
