<template>
    <n-layout class="manageOuter">
        <n-layout-header class="integrateheader" style="height: 60px" bordered>
            <IntegrateHeader />
        </n-layout-header>
        <n-layout
            has-sider
            class="manage"
            position="absolute"
            style="top: 60px"
            @click="closeChatRoomBubble"
        >
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    height: calc(100vh - 60px);
                    background-color: #fff;
                "
            >
                <n-layout-sider
                    bordered
                    content-style="padding: 20px 0;"
                    class="manage__sider"
                    :class="{ closeSidebar: closeSiderBoolean === true }"
                    id="sider"
                >
                    <!-- <div class="logo">
                        <img class="logoImg" :src="logo" alt="talkOD" draggable="false" />
                    </div> -->
                    <div class="sms">
                        <h1>SMS</h1>
                        <router-link
                            id="guide8"
                            :to="
                                `${params.id}` ? `/manage/${params.id}/SMSSend` : `/manage/SMSSend`
                            "
                            :class="currentPage === 'SMSSend' ? 'active' : ''"
                            @click="onMmsReset"
                        >
                            <img :src="smsSendActiveIcon" v-if="currentPage === 'SMSSend'" />
                            <img :src="smsSendDefaultIcon" v-else />
                            <p v-show="closeSiderBoolean === false">&ensp;SMS發送</p>
                        </router-link>
                        <router-link
                            :to="
                                `${params.id}`
                                    ? `/manage/${params.id}/SMSInquire`
                                    : `/manage/SMSInquire`
                            "
                            :class="currentPage === 'SMSInquire' ? 'active' : ''"
                            @click="storeReset"
                        >
                            <img
                                :src="smsSendInquireActiveIcon"
                                v-if="currentPage === 'SMSInquire'"
                            />
                            <img :src="smsSendInquireDefaultIcon" v-else />
                            <p v-show="closeSiderBoolean === false">&ensp;SMS發送與回覆查詢</p>
                        </router-link>
                    </div>

                    <div class="mms">
                        <!-- <h1>MMS</h1> -->
                        <!-- <router-link
                        :to="`${params.id}` ? `/manage/${params.id}/MMSSend` : `/manage/MMSSend`"
                        :class="currentPage === 'MMSInquire' ? 'active' : ''"
                        @click="onSmsReset"
                    >
                        <img :src="mmsSendActiveIcon" v-if="currentPage === 'MMSInquire'" />
                        <img :src="mmsSendDefaultIcon" v-else />
                        <p v-show="closeSiderBoolean === false">&ensp; MMS發送</p>
                    </router-link> -->
                        <!-- <router-link
                            :to="
                                `${params.id}`
                                    ? `/manage/${params.id}/MMSInquire`
                                    : `/manage/MMSInquire`
                            "
                            :active-class="currentPage === 'MMSInquire' ? 'active' : ''"
                            @click="storeReset"
                        >
                            <img
                                :src="mmsSendInquireActiveIcon"
                                v-if="currentPage === 'MMSInquire'"
                            />
                            <img :src="mmsSendInquireDefaultIcon" v-else />
                            <p v-show="closeSiderBoolean === false">&ensp;MMS發送與回覆查詢</p>
                        </router-link> -->
                    </div>
                    <div class="manageSetting">
                        <h1>管理與設定</h1>
                        <router-link
                            id="guide3"
                            :to="
                                `${params.id}`
                                    ? `/manage/${params.id}/activitySetting`
                                    : `/manage/activitySetting`
                            "
                            :class="currentPage === 'ActivitySetting' ? 'active' : ''"
                            @click="storeReset"
                        >
                            <img
                                :src="channelActiveIcon"
                                v-if="currentPage === 'ActivitySetting'"
                            />
                            <img :src="channelDefaultIcon" v-else />
                            <p v-show="closeSiderBoolean === false">&ensp;活動頻道管理</p>
                        </router-link>
                        <router-link
                            v-if="adminStatus == '2'"
                            :to="
                                `${params.id}`
                                    ? `/manage/${params.id}/manageSetting`
                                    : `/manage/manageSetting`
                            "
                            :active-class="currentPage === 'ManageSetting' ? 'active' : ''"
                            @click="storeReset"
                        >
                            <img
                                :src="manageSettingActiveIcon"
                                v-if="currentPage === 'ManageSetting'"
                            />
                            <img :src="manageSettingDefaultIcon" v-else />
                            <p v-show="closeSiderBoolean === false">&ensp;管理者設定</p>
                        </router-link>
                        <!-- v-if="adminStatus == '2'" -->
                    </div>
                    <div class="groupChat">
                        <h1>群組聊天</h1>
                        <router-link
                            :to="
                                `${params.id}`
                                    ? `/manage/${params.id}/addressBookManagement`
                                    : `/manage/addressBookManagement`
                            "
                            :active-class="currentPage === 'AddressBookManagement' ? 'active' : ''"
                            @click="storeReset"
                        >
                            <img
                                :src="addressBookManagementActiveIcon"
                                v-if="currentPage === 'AddressBookManagement'"
                            />
                            <img :src="addressBookManagementDefaultIcon" v-else />
                            <p v-show="closeSiderBoolean === false">&ensp;通訊錄設定</p>
                        </router-link>
                    </div>
                </n-layout-sider>
                <div class="closeSider" @click="closeSider" v-show="closeSiderBoolean === false">
                    <img :src="collapseIcon" />
                    <p>收疊側邊欄</p>
                </div>
                <div class="openSider" @click="openSider" v-show="closeSiderBoolean === true">
                    <img :src="collapseIcon" />
                </div>
            </div>
            <n-layout
                class="content"
                :native-scrollbar="false"
                :scrollbar-props="{ trigger: 'none' }"
            >
                <Headers />
                <router-view name="manage" v-slot="{ Component }">
                    <keep-alive :include="cacheComponent">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </n-layout>
        </n-layout>
    </n-layout>
    <UploadAnimation />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { NLayout, NLayoutHeader, NLayoutSider, NMenu } from "naive-ui";
import { RouterLink, useRoute, useRouter } from "vue-router";

import UploadAnimation from "@/components/uploadAnimation.vue";
import IntegrateHeader from "@/components/IntegrateHeader.vue";
import Headers from "@/components/Headers.vue";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { storeToRefs } from "pinia";
import logo from "@/assets/Images/talkod-logo-confirm.png";
import smsSendDefaultIcon from "@/assets/Images/manage/sms.svg";
import smsSendActiveIcon from "@/assets/Images/manage/sms_y.svg";
import smsSendInquireDefaultIcon from "@/assets/Images/manage/sms-s.svg";
import smsSendInquireActiveIcon from "@/assets/Images/manage/sms-s_y.svg";
import mmsSendDefaultIcon from "@/assets/Images/manage/mms.svg";
import mmsSendActiveIcon from "@/assets/Images/manage/mms_y.svg";
import mmsSendInquireDefaultIcon from "@/assets/Images/manage/mms-s.svg";
import mmsSendInquireActiveIcon from "@/assets/Images/manage/mms-s_y.svg";
import channelDefaultIcon from "@/assets/Images/manage/channel.svg";
import channelActiveIcon from "@/assets/Images/manage/channel_y.svg";
import manageSettingDefaultIcon from "@/assets/Images/manage/user-settings.svg";
import manageSettingActiveIcon from "@/assets/Images/manage/user-settings_y.svg";
import addressBookManagementActiveIcon from "@/assets/Images/manage/contacts_y.svg";
import addressBookManagementDefaultIcon from "@/assets/Images/manage/contacts.svg";
import collapseIcon from "@/assets/Images/manage/Collapse.svg";

//store

const modelStore = useModelStore();
const { showDropdown, channelArrayPopUp, uploadAnimationBoolean } = storeToRefs(modelStore);
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
onMounted(() => {
    // getEventListApi();
});

//active page 管理
const currentPage = ref("");
watch(
    route,
    () => {
        // sms發送頁
        if (route.name === "SMSSend" || route.name === "SMSSendPage2") {
            currentPage.value = "SMSSend";
        } else if (route.name === "SMSInquire") {
            currentPage.value = "SMSInquire";
        } else if (route.name === "MMSSend" || route.name === "MMSSendPage2") {
            currentPage.value = "MMSSend";
        } else if (route.name === "MMSInquire") {
            currentPage.value = "MMSInquire";
        } else if (route.name === "ManageSetting") {
            currentPage.value = "ManageSetting";
        } else if (route.name === "AddressBookManagement") {
            currentPage.value = "AddressBookManagement";
        } else if (route.name === "Profile" || route.name === "EditProfile") {
            currentPage.value = "";
        } else {
            currentPage.value = "ActivitySetting";
        }
    },
    { immediate: true }
);
// adminStatus: 0-客服, 1-管理者,
const adminStatus: string | null = localStorage.getItem("adminStatus");
//監聽路由變化
// onBeforeRouteUpdate((to, from) => {
//     console.log(to);
//     console.log(from);
// });
// 全局關閉聊天室清單 活動頻道彈窗
const closeChatRoomBubble = () => {
    showDropdown.value = false;
    channelArrayPopUp.value.forEach((p) => {
        p.popUpBoolean = false;
    });
};
//側邊欄開關
const closeSiderBoolean = ref(false);
const closeSider = () => {
    closeSiderBoolean.value = true;
};
const openSider = () => {
    closeSiderBoolean.value = false;
};
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.manageOuter {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}
a {
    -webkit-user-drag: none;
    img {
        -webkit-user-drag: none;
    }
}
.manage {
    height: 100%;
    display: flex;
    flex-direction: column;
    &__sider {
        width: 240px !important;
        max-height: calc(100vh - 120px);
        .n-layout-sider-scroll-container {
            overflow-y: auto;
            min-width: 240px !important;
            .logo {
                display: flex;
                margin-top: 20px;
                margin-bottom: 80px;
                justify-content: center;
                align-items: center;
                .logoImg {
                    width: 85%;
                    // height: 80%;
                    cursor: pointer;
                }
            }

            .active {
                background-color: $primary-3;
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
                margin-top: 60px;
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
                    display: flex;
                    align-items: center;
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
                    display: flex;
                    align-items: center;
                }
            }
            .manageSetting {
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
                    display: flex;
                    align-items: center;
                }
            }
            .groupChat {
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
                    display: flex;
                    align-items: center;
                }
            }
        }

        &.closeSidebar {
            width: 114px !important;
            .n-layout-sider-scroll-container {
                min-width: 114px !important ;
                .sms {
                    h1 {
                        margin-left: 0px;
                        display: flex;
                        justify-content: center;
                    }
                }
                .mms {
                    h1 {
                        margin-left: 0px;
                        display: flex;
                        justify-content: center;
                    }
                }
                .manageSetting {
                    h1 {
                        margin-left: 0px;
                        display: flex;
                        justify-content: center;
                    }
                }
            }
        }
    }
    .closeSider {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid $gray-5;
        cursor: pointer;
        img {
            margin-right: 5px;
        }
    }
    .openSider {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid $gray-5;
        cursor: pointer;
        img {
            transform: rotate(180deg);
        }
    }
}
#sider {
    .n-layout-sider-scroll-container::-webkit-scrollbar-track {
        border-radius: 5px;
        cursor: pointer;
    }
}

#sider {
    .n-layout-sider-scroll-container::-webkit-scrollbar {
        width: 5px;
    }
}

#sider {
    .n-layout-sider-scroll-container::-webkit-scrollbar-thumb {
        border-radius: 5px;
        cursor: pointer;
        -webkit-box-shadow: inset 5px 5px 5px $gray-4;
    }
}
</style>
