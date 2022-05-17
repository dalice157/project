<template>
    <n-layout class="manage" has-sider @click="closeChatRoomBubble">
        <n-layout-sider bordered content-style="padding: 20px 0;">
            <div class="logo">
                <img class="logoImg" @click="goHome" :src="logo" alt="talkOD" />
            </div>
            <div class="sms">
                <h1>SMS</h1>
                <router-link
                    :to="`${params.id}` ? `/manage/${params.id}/SMSSend` : `/manage/SMSSend`"
                    :class="
                        $route.name === 'SMSSend' || $route.name === 'SMSSendPage2' ? 'active' : ''
                    "
                    @click="onMmsReset"
                    >SMS發送</router-link
                >
                <router-link
                    :to="`${params.id}` ? `/manage/${params.id}/SMSInquire` : `/manage/SMSInquire`"
                    :class="$route.name === 'SMSInquire' ? 'active' : ''"
                    @click="storeReset"
                    >SMS發送查詢</router-link
                >
            </div>

            <div class="mms">
                <h1>MMS</h1>
                <router-link
                    :to="`${params.id}` ? `/manage/${params.id}/MMSSend` : `/manage/MMSSend`"
                    :class="
                        $route.name === 'MMSSend' || $route.name === 'MMSSendPage2' ? 'active' : ''
                    "
                    @click="onSmsReset"
                    >MMS發送</router-link
                >
                <router-link
                    :to="`${params.id}` ? `/manage/${params.id}/MMSInquire` : `/manage/MMSInquire`"
                    :active-class="$route.name === 'MMSInquire' ? 'active' : ''"
                    @click="storeReset"
                    >MMS發送查詢</router-link
                >
            </div>
            <div class="manageSetting">
                <router-link
                    :to="
                        `${params.id}`
                            ? `/manage/${params.id}/activitySetting`
                            : `/manage/activitySetting`
                    "
                    :class="
                        $route.name === 'ActivitySetting' ||
                        $route.name === 'AddChannel' ||
                        $route.name === 'AddCustomService' ||
                        $route.name === 'EditChannel' ||
                        $route.name === 'AddAutoReply' ||
                        $route.name === 'AutoReplyList'
                            ? 'active'
                            : ''
                    "
                    @click="storeReset"
                    >活動頻道管理</router-link
                >
                <router-link
                    v-if="adminStatus == '2'"
                    :to="
                        `${params.id}`
                            ? `/manage/${params.id}/manageSetting`
                            : `/manage/manageSetting`
                    "
                    :active-class="$route.name === 'ManageSetting' ? 'active' : ''"
                    @click="storeReset"
                    >管理者設定</router-link
                >
            </div>
        </n-layout-sider>
        <n-layout class="content">
            <Headers />
            <router-view name="manage" v-slot="{ Component }">
                <keep-alive :include="cacheComponent">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </n-layout>
    </n-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { NLayout, NLayoutSider, NMenu } from "naive-ui";
import { RouterLink, useRoute, useRouter } from "vue-router";

import Headers from "@/components/Headers.vue";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { storeToRefs } from "pinia";
import logo from "@/assets/Images/talkOD-logo.svg";

//store

const modelStore = useModelStore();
const { showDropdown } = storeToRefs(modelStore);
const smsStore = useSmsStore();
const onSmsReset = () => {
    smsStore.$reset();
};

const mmsStore = useMmsStore();
const onMmsReset = () => {
    mmsStore.$reset();
};
const storeReset = () => {
    smsStore.$reset();
    mmsStore.$reset();
};

//緩存組件陣列
const { smsCacheComponent } = storeToRefs(smsStore);
const { mmsCacheComponent } = storeToRefs(mmsStore);

const cacheComponent = computed(() => {
    return smsCacheComponent.value.concat(mmsCacheComponent.value);
});

//路由
const route = useRoute();
const router = useRouter();
const params = route.params;

const apiStore = useApiStore();
const { getEventListApi } = apiStore;
getEventListApi();

// adminStatus: 0-客服, 1-管理者,
const adminStatus: string | null = localStorage.getItem("adminStatus");
//監聽路由變化
// onBeforeRouteUpdate((to, from) => {
//     console.log(to);
//     console.log(from);
// });
// 全局關閉聊天室清單
const closeChatRoomBubble = () => {
    showDropdown.value = false;
};

//點選logo回首頁
const goHome = () => {
    router.push(`/chat`);
};
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.manage {
    // position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    .n-layout-sider {
        width: 210px !important;
        .n-layout-sider-scroll-container {
            min-width: 210px !important;
            .logo {
                display: flex;
                margin-top: 20px;
                margin-bottom: 80px;
                justify-content: center;
                align-items: center;
                .logoImg {
                    width: 125px;
                    height: 40px;
                    cursor: pointer;
                }
            }

            .active {
                background-color: $primary-4;
                color: $primary-1 !important;
                position: relative;
                font-weight: 600;
                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 6px;
                    height: 40px;
                    background-color: $primary-1;
                }
            }
            .sms {
                display: flex;
                flex-direction: column;
                h1 {
                    margin-left: 30px;
                    color: $gray-3;
                    font-size: $font-size-16;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                a {
                    text-decoration: none;
                    text-align: left;
                    height: 42px;
                    line-height: 42px;
                    font-size: $font-size-16;
                    color: $gray-1;
                    cursor: pointer;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    padding-left: 50px;
                }
            }

            .mms {
                display: flex;
                flex-direction: column;

                h1 {
                    margin-left: 30px;
                    color: $gray-3;
                    font-size: $font-size-16;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                a {
                    text-decoration: none;
                    text-align: left;
                    height: 42px;
                    line-height: 42px;
                    font-size: $font-size-16;
                    color: $gray-1;
                    cursor: pointer;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    padding-left: 50px;
                }
            }
            .manageSetting {
                display: flex;
                flex-direction: column;

                a {
                    text-decoration: none;
                    text-align: left;
                    height: 42px;
                    line-height: 42px;
                    font-size: $font-size-16;
                    color: $gray-1;
                    cursor: pointer;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    padding-left: 30px;
                }
            }
        }
    }
}
.content {
    height: 100%;
}
</style>
