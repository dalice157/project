<template>
    <n-grid x-gap="12" :cols="2" class="activitySetting">
        <n-grid-item>
            <!--活動頻道 -->
            <div class="activityChannel">
                <div class="activityChannelTitle">
                    <h2>活動頻道</h2>
                    <img :src="addIcon" alt="編輯" @click="addChannel" />
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
                            <img :src="searchIcon" alt="搜索" />
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
                            <!-- {{ channel }} -->
                            <div class="channelTitle">
                                <img :src="`${config.fileUrl}${channel.icon}`" alt="#" />
                            </div>
                            <p class="channelName">{{ channel.name }}</p>
                            <div class="channelSetting">
                                <img :src="moreIcon" @click="channelPopUp(channel)" alt="mroe" />
                            </div>
                            <div class="channelPopUp">
                                <ul class="channelUL" v-if="channel.popUpBoolean">
                                    <li @click="goEditChannel(channel.eventID)">編輯活動頻道</li>
                                    <!-- <li @click="goAutoReply(channel.eventID)">自動回覆訊息</li>
                                    <li @click="goAutoReplyList(channel.eventID)">
                                        自動回覆訊息列表
                                    </li> -->
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </n-grid-item>
        <n-grid-item>
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
                            <img :src="searchIcon" alt="搜索" />
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
                                    :to="
                                        `${route.params.id}`
                                            ? `/manage/${route.params.id}/activitySetting/addCustomService?accountID=${staff.accountID}`
                                            : `/manage/activitySetting/addCustomService?accountID=${staff.accountID}`
                                    "
                                >
                                    <img :src="editIcon" :alt="staff.name" />
                                </router-link>
                            </div>
                        </li>
                    </ul>
                    <h2 class="staffEmpty" v-else>尚無客服人員</h2>
                </div>
            </div>
        </n-grid-item>
    </n-grid>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from "vue";
import { NInput, NConfigProvider, NGrid, NGridItem } from "naive-ui";
import { useRoute, useRouter } from "vue-router";

import { useApiStore } from "@/store/api";
import { storeToRefs } from "pinia";
import config from "@/config/config";
import addIcon from "@/assets/Images/chatroom/add-circle.svg";
import searchIcon from "@/assets/Images/manage/search.svg";
import moreIcon from "@/assets/Images/manage/more.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";

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
const activityChannel = ref(null);

getEventListApi();
getCustomServiceStaffList();

//搜尋客服陣列
const filterStaff = computed(() => {
    let arr = staffList.value.filter((p: any) => {
        return p.name.toLowerCase().includes(searchStaff.value.toLowerCase());
    });
    return arr;
});
//搜尋頻道陣列
const filterChannel = computed(() => {
    let arr = eventList.value.filter((p: any) => {
        return p.name.toLowerCase().includes(searchChannel.value.toLowerCase());
    });

    return arr;
});

//前往新增頻道
const params = route.params;
const addChannel = () => {
    params.id
        ? router.push(`/manage/${params.id}/activitySetting/addChannel`)
        : router.push(`/manage/activitySetting/addChannel`);
};
//前往編輯活動頻道
const goEditChannel = (eventID) => {
    params.id
        ? router.push(`/manage/${route.params.id}/activitySetting/editChannel?eventID=${eventID}`)
        : router.push(`/manage/activitySetting/editChannel?eventID=${eventID}`);
};
//前往自動回覆訊息頁面
const goAutoReply = (eventID) => {
    params.id
        ? router.push(`/manage/${route.params.id}/activitySetting/addAutoReply?eventID=${eventID}`)
        : router.push(`/manage/activitySetting/addAutoReply?eventID=${eventID}`);
};
//前往自動回覆訊息列表
const goAutoReplyList = (eventID) => {
    params.id
        ? router.push(`/manage/${route.params.id}/activitySetting/autoReplyList?eventID=${eventID}`)
        : router.push(`/manage/activitySetting/autoReplyList?eventID=${eventID}`);
};
//頻道開關
const channelPopUp = (channel) => {
    filterChannel.value.forEach((p) => {
        if (p.eventID === channel.eventID) {
            p.popUpBoolean = !p.popUpBoolean;
        } else {
            p.popUpBoolean = false;
        }
    });
};
//naive ui 主題
const themeOverrides = {
    Input: {
        border: "1px solid #ececec",
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
    height: calc(100% - 80px);
    .activityChannel {
        background-color: $white;
        padding: 25px 0px;
        border-radius: 4px;
        max-height: 650px;
        overflow-y: auto;
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
                font-size: $font-size-12;
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
            position: relative;
            z-index: 0;
            ul {
                padding: 0 20px;
                li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 15px 10px;
                    position: relative;
                    border-bottom: 1px solid $border-line;
                    .channelPopUp {
                        position: absolute;
                        box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                        border-radius: 4px;
                        top: 15px;
                        right: 45px;
                        z-index: 1;
                        .channelUL {
                            background-color: $primary-4;
                            display: flex;
                            padding: 0;
                            li {
                                padding: 15px 10px;
                                text-align: center;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                color: $gray-1;
                                border-right: 1px solid $white;
                                cursor: pointer;
                            }
                            li:last-child {
                                border-right: 0px;
                            }
                        }
                    }
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
                        padding: 8px 5px 0 12px;
                        position: relative;
                        justify-content: flex-end;
                        align-items: center;
                        img {
                            width: 25px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
    .customService {
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
                font-size: $font-size-12;
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
            max-height: calc(100vh - 250px);
            .staffEmpty {
                @extend %h2;
                text-align: center;
                padding: 35%;
                width: 100%;
                height: calc(100vh - 240px);
            }
            ul {
                padding: 0 20px;
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
