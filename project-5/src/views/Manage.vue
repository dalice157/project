<template>
    <n-layout class="manage" has-sider>
        <n-layout-sider bordered content-style="padding: 20px 0;">
            <div class="logo">
                <div class="logoImg"></div>
                <h1>溝通雲</h1>
            </div>
            <div class="sms">
                <h1>SMS</h1>
                <router-link
                    :to="`/manage/${params.id}/SMSSend`"
                    :class="
                        $route.name === 'SMSSend' || $route.name === 'SMSSendPage2' ? 'active' : ''
                    "
                    >SMS發送</router-link
                >
                <router-link
                    :to="`/manage/${params.id}/SMSInquire`"
                    :class="$route.name === 'SMSInquire' ? 'active' : ''"
                    >SMS發送查詢</router-link
                >
            </div>

            <div class="mms">
                <h1>MMS</h1>
                <router-link
                    :to="`/manage/${params.id}/MMSSend`"
                    :class="
                        $route.name === 'MMSSend' || $route.name === 'MMSSendPage2' ? 'active' : ''
                    "
                    >MMS發送</router-link
                >
                <router-link
                    :to="`/manage/${params.id}/MMSInquire`"
                    :active-class="$route.name === 'MMSInquire' ? 'active' : ''"
                    >MMS發送查詢</router-link
                >
            </div>
            <div class="manageSetting">
                <router-link
                    :to="`/manage/${params.id}/activitySetting`"
                    :class="
                        $route.name === 'ActivitySetting' ||
                        $route.name === 'AddChannel' ||
                        $route.name === 'AddCustomService' ||
                        $route.name === 'EditChannel'
                            ? 'active'
                            : ''
                    "
                    >活動頻道管理</router-link
                >
                <router-link
                    :to="`/manage/${params.id}/manageSetting`"
                    :active-class="$route.name === 'ManageSetting' ? 'active' : ''"
                    >管理者設定</router-link
                >
            </div>
        </n-layout-sider>
        <n-layout>
            <Headers />
            <router-view name="manage" v-slot="{ Component }">
                <keep-alive :include="['SMSSend', 'MMSSend']">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </n-layout>
    </n-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted, h } from "vue";
import { NLayout, NLayoutSider, NMenu } from "naive-ui";
import { RouterLink, useRoute } from "vue-router";

import Headers from "@/components/Headers.vue";
import { useApiStore } from "@/store/api";
import config from "@/config/config";

const apiStore = useApiStore();
const { getEventListApi } = apiStore;
getEventListApi();

const route = useRoute();
const pathPage = route.path.split("/")[3];
const params = route.params;
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
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: $primary-1;
                }
                h1 {
                    color: $primary-1;
                    font-size: $font-family;
                    font-weight: 400;
                    font-size: 18px;
                    margin-left: 15px;
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
</style>
