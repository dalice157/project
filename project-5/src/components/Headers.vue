<template>
    <n-layout-header class="header" bordered>
        <h1
            class="logo"
            v-if="
                route.path == `/chat/${route.params.id}` ||
                route.path == `/gallery/${route.params.id}` ||
                route.path == `/phone/${route.params.id}`
            "
        >
            {{ eventInfo.name }}
        </h1>
        <h1 class="logo" v-else>
            {{ showTitle() }}
        </h1>
        <ul class="pages">
            <li class="btnBg">
                點數<span class="point">{{ point }}點</span>(<a class="store-value" href="#">儲值</a
                >)
            </li>
            <li class="btnBg" v-if="isAdmin == '0' || isAdmin == '1'">
                <a :href="`/manage/${params.id}/SMSSend`">管理功能</a>
            </li>
            <li class="btnBg">
                <a :href="`/chat/${params.id}`">我的聊天室</a>
            </li>
            <li v-if="!access_token">
                <a :href="`/${params.id}`">登入</a>
            </li>
            <li class="chevron" v-if="access_token">
                <a :href="`/${params.id}`">登出</a>
            </li>
        </ul>
    </n-layout-header>
</template>

<script lang="ts" setup>
import { defineComponent, watchEffect, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { NAvatar, NPopover, NIcon, NLayoutHeader } from "naive-ui";
import { ChevronDownOutline, ChevronUpOutline } from "@vicons/ionicons5";
import axios from "axios";
import { storeToRefs } from "pinia";
import config from "@/config/config";
import { useApiStore } from "@/store/api";

const route = useRoute();
const params = route.params;
const path = ref();

// api store
const apiStore = useApiStore();
const { getPoint, getEventApi } = apiStore;
const { eventInfo, point } = storeToRefs(apiStore);
const access_token = localStorage.getItem("access_token");
// adminStatus: 0-管理者, 1-tony
const isAdmin: string | null = localStorage.getItem("adminStatus");
getEventApi(route.params.id);
getPoint();

const showTitle = () => {
    if (
        route.path === `/manage/${route.params.id}/SMSSend` ||
        route.path === `/manage/${route.params.id}/SMSSendPage2`
    ) {
        return "SMS發送";
    }
    if (route.path === `/manage/${route.params.id}/SMSInquire`) {
        return "SMS發送查詢";
    }
    if (
        route.path === `/manage/${route.params.id}/MMSSend` ||
        route.path === `/manage/${route.params.id}/MMSSendPage2`
    ) {
        return "MMS發送";
    }
    if (route.path === `/manage/${route.params.id}/MMSInquire`) {
        return "MMS發送查詢";
    }
    if (route.path === `/manage/${route.params.id}/activitySetting`) {
        return "活動頻道管理";
    }

    if (route.path === `/manage/${route.params.id}/activitySetting/addCustomService`) {
        return "編輯客服人員";
    }
    if (route.path === `/manage/${route.params.id}/activitySetting/addChannel`) {
        return "新增活動頻道";
    }
    if (route.path === `/manage/${route.params.id}/activitySetting/editChannel`) {
        return "編輯活動頻道";
    }
    if (route.path === `/manage/${route.params.id}/manageSetting`) {
        return "管理者設定";
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

$headerHeight: 80px;
.userInfo {
    margin-top: 0 !important;
    .n-popover-arrow-wrapper .n-popover-arrow {
        width: 18px;
        height: 18px;
        bottom: -12px !important;
    }
}

.header-list {
    padding: 0.5em 0 1em;
    .n-divider:not(.n-divider--vertical) {
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .title {
        font-size: 12px;
        padding-top: 0.5em;
        margin-bottom: 1em;
        font-weight: 900;
    }
    .item {
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.8em;
        &:last-child {
            border-bottom: none;
        }
        a {
            text-decoration: none;
            color: #01bad4;
            &:hover {
                color: #95ecfa;
            }
        }
        + .item {
            margin-top: 0.8em;
        }
    }
}

.header {
    width: 100%;
    height: $headerHeight;
    background-color: $white;
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: #d9d9d9 0 0 3px 0;
}
.logo {
    display: flex;
    align-items: center;
    @extend %h1;
}
.pages {
    display: flex;
    align-items: center;
    li {
        + li {
            margin-left: 30px;
        }
        &.btnBg {
            border-radius: 20px;
            box-shadow: $gray-6 1px 2px 4px 0;
            background-color: $primary-4;
            padding: 10px 20px;
            @extend %h4;
            &:hover {
                background-color: $primary-5;
            }
        }

        a {
            text-decoration: none;
            color: $gray-1;
            &:hover {
                color: $gray-3;
            }

            &.store-value {
                text-decoration: underline;
            }
        }
        a.router-link-exact-active,
        a.active {
            display: flex;
            flex-direction: column;
            position: relative;
            text-align: center;
            font-weight: bold;
        }
        &.chevron {
            height: auto;
            line-height: normal;
            cursor: pointer;
            .n-icon {
                font-size: 25px;
            }
        }
    }
}
.point {
    color: $danger;
}
</style>
