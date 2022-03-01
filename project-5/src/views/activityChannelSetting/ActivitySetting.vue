<template>
    <div class="activitySetting">
        <!--活動頻道 -->
        <div class="activityChannel">
            <div class="activityChannelTitle">
                <h2>活動頻道</h2>
                <img src="../../assets/Images/chatroom/add-circle.svg" alt="" @click="addChannel" />
            </div>
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    class="searchInput"
                    clearable
                    v-model:value="searchChannel"
                    type="text"
                    placeholder="搜尋"
                >
                    <template #prefix>
                        <img src="../../assets/Images/manage/search.svg" alt="#" />
                    </template>
                </n-input>
            </n-config-provider>
            <div class="mememberList">
                <ul>
                    <li
                        v-for="channel in filterChannel"
                        :key="channel.eventID"
                        @mouseenter="channelHoverIndex = channel.eventID"
                        @mouseleave="channelHoverIndex = '0'"
                        :class="{ hoverEffect: channelHoverIndex === channel.eventID }"
                    >
                        <div class="channelTitle">
                            <img :src="`${config.fileUrl}/fls/${channel.icon}`" alt="#" />
                        </div>
                        <p class="channelName">{{ channel.name }}</p>
                        <div class="channelSetting">
                            <a
                                :href="`/manage/${route.params.id}/activitySetting/editChannel?eventID=${channel.eventID}`"
                            >
                                <img src="../../assets/Images/manage/edit-round.svg" alt="#" />
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 客服人員 -->
        <div class="customService">
            <div class="customServiceTitle">
                <h2>客服人員</h2>
            </div>
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    class="searchInput"
                    clearable
                    v-model:value="searchStaff"
                    type="text"
                    placeholder="搜尋"
                >
                    <template #prefix>
                        <img src="../../assets/Images/manage/search.svg" alt="#" />
                    </template>
                </n-input>
            </n-config-provider>
            <div class="staffList">
                <ul v-if="filterStaff.length > 0">
                    <li
                        class="staffData"
                        v-for="staff in filterStaff"
                        :key="staff.accountID"
                        @mouseenter="stafflHoverIndex = staff.accountID"
                        @mouseleave="stafflHoverIndex = '0'"
                        :class="{ hoverEffect: stafflHoverIndex === staff.accountID }"
                    >
                        <p>{{ staff.name }}</p>
                        <p>
                            {{ staff.events }}
                        </p>
                        <div class="staffSetting">
                            <router-link
                                :to="`/manage/${route.params.id}/activitySetting/addCustomService?accountID=${staff.accountID}`"
                            >
                                <img
                                    src="../../assets/Images/manage/edit-round.svg"
                                    :alt="staff.name"
                                />
                            </router-link>
                        </div>
                    </li>
                </ul>
                <h2 class="staffEmpty" v-else>尚無客服人員</h2>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from "vue";
import { NInput, NConfigProvider } from "naive-ui";
import { useRoute, useRouter } from "vue-router";

import { useApiStore } from "@/store/api";
import { storeToRefs } from "pinia";
import config from "@/config/config";

const apiStore = useApiStore();
const { getCustomServiceStaffList, getEventListApi } = apiStore;
const { staffList, eventList } = storeToRefs(apiStore);

//router
const router = useRouter();
const route = useRoute();

//v-model
const searchChannel = ref("");
const searchStaff = ref("");
const channelHoverIndex = ref("0");
const stafflHoverIndex = ref("0");
const loading = ref(false);

getEventListApi();
getCustomServiceStaffList();

//搜尋新陣列
let filterStaff = computed(() => {
    let arr = staffList.value.filter((p: any) => {
        p.events = p.events.split(",").join("/");
        return p.name.toLowerCase().includes(searchStaff.value.toLowerCase());
    });
    return arr;
});

const filterChannel = computed(() => {
    let arr = eventList.value.filter((p: any) => {
        return p.name.toLowerCase().includes(searchChannel.value.toLowerCase());
    });
    return arr;
});

//前往新增頻道
const params = route.params;
const addChannel = () => {
    router.push(`/manage/${params.id}/activitySetting/addChannel`);
};
const themeOverrides = {
    common: { primaryColor: "#FFb400" },
    Input: {
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
        borderRadius: "20px",
    },
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.searchInput {
    &.n-input .n-input__input-el {
        font-size: $font-size-14;
        height: 36px;
        line-height: 36px;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
// li hover
.hoverEffect {
    background-color: #fffaed;
}

.activitySetting {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    min-height: calc(100% - 80px);
    .activityChannel {
        width: 50%;
        height: 100%;
        background-color: $white;
        padding: 25px 0px;
        border-radius: 4px;
        .activityChannelTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 0 20px;

            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
            }
            img {
                width: 27px;
                height: 27px;
                cursor: pointer;
            }
        }
        .n-config-provider {
            width: 95%;
            margin: 0 auto;
            .n-input {
                box-shadow: 1px 2px 4px #e3e3e3;
                font-size: 12px;
                width: 100%;
                // margin-left: 30px;
                margin-bottom: 10px;

                img {
                    width: 14px;
                    height: 14px;
                }
            }
        }
        .mememberList {
            ul {
                padding: 0 20px;
                max-height: calc(100vh - 250px);
                overflow-y: auto;
                li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 15px 10px;
                    position: relative;
                    border-bottom: 1px solid $border-line;
                    .channelTitle {
                        display: flex;
                        align-items: center;
                        img {
                            width: 48px;
                            height: 48px;
                            margin-right: 15px;
                            border-radius: 50%;
                        }
                    }
                    .channelName {
                        font-size: $font-size-14;
                        font-weight: 600;
                        width: 85%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-right: 10px;
                    }
                    .channelSetting {
                        display: flex;
                        align-items: center;
                        img {
                            width: 32px;
                            height: 32px;
                            cursor: pointer;
                        }
                        img + img {
                            width: 24px;
                            height: 24px;
                            margin-left: 15px;
                        }
                    }
                }
            }
        }
    }
    .customService {
        width: 50%;
        height: 100%;
        background-color: $white;
        padding: 25px 0px;
        margin-left: 15px;
        border-radius: 4px;
        .customServiceTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 0 20px;

            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
            }
            img {
                width: 27px;
                height: 27px;
                cursor: pointer;
            }
        }
        .n-config-provider {
            width: 95%;
            margin: 0 auto;
            .n-input {
                box-shadow: 1px 2px 4px #e3e3e3;
                font-size: 12px;
                width: 100%;
                // margin-left: 30px;
                margin-bottom: 10px;

                img {
                    width: 14px;
                    height: 14px;
                }
            }
        }
        .staffList {
            .staffEmpty {
                @extend %h2;
                text-align: center;
                padding: 35%;
                width: 100%;
                height: calc(100vh - 240px);
            }
            ul {
                padding: 0 20px;
                max-height: calc(100vh - 250px);
                overflow-y: auto;
                .staffData {
                    padding: 15px 10px;
                    border-bottom: 1px solid $border-line;
                    position: relative;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    p {
                        width: 80%;
                        height: 20px;
                        line-height: 20px;
                        margin-right: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        &:first-child {
                            width: 15%;
                            font-size: $font-size-14;
                            font-weight: 600;
                            margin-right: 15px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    img {
                        width: 32px;
                        height: 32px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
