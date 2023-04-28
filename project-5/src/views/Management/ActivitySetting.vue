<template>
    <n-grid x-gap="12" :cols="2" class="activitySetting">
        <n-grid-item class="channel">
            <!--活動頻道 -->
            <div class="channel__title">
                <h2>活動頻道</h2>
                <img id="guide4" :src="addIcon" alt="編輯" @click="addChannel" />
            </div>
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    class="search"
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
            <n-scrollbar style="max-height: calc(100vh - 335px)">
                <div class="channel__list">
                    <ul v-if="filterChannel.length > 0">
                        <li v-show="chatStore.isShowGuide7" id="guide7" class="demoChannel"></li>
                        <li v-for="channel in filterChannel" :key="channel.eventID">
                            <div class="channel__avatar">
                                <img :src="`${config.fileUrl}${channel.icon}`" alt="#" />
                            </div>
                            <p class="channel__name">
                                {{ channel.name }}
                                <n-icon
                                    v-if="channel.preset == '1'"
                                    size="20"
                                    color="#f9935c"
                                    style="margin-left: 5px"
                                >
                                    <shield-checkmark-outline />
                                </n-icon>
                            </p>
                            <div class="channel__edit">
                                <img
                                    :src="editIcon"
                                    @click.stop="goEditChannel(channel.eventID)"
                                    alt="edit"
                                />
                            </div>
                            <div class="channel__more">
                                <img
                                    :src="moreIcon"
                                    @click.stop="channelPopUp(channel)"
                                    alt="more"
                                />
                            </div>
                            <div class="channel__popUp">
                                <ul class="channel__UL" v-if="channel.popUpBoolean">
                                    <!-- <li @click="goEditChannel(channel.eventID)">編輯活動頻道</li> -->
                                    <li @click="goAutoReply(channel.eventID)">自動回覆訊息</li>
                                    <li @click="goAutoReplyList(channel.eventID)">
                                        自動回覆訊息列表
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <h2 class="channel--empty" v-else>尚無活動頻道</h2>
                </div>
            </n-scrollbar>
        </n-grid-item>
        <n-grid-item class="staff">
            <!-- 客服人員 -->
            <div class="staff__title">
                <h2>客服人員</h2>
            </div>
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    class="search"
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
            <n-scrollbar style="max-height: calc(100vh - 335px)">
                <div class="staff__list">
                    <ul v-if="filterStaff.length > 0">
                        <li v-for="staff in filterStaff" :key="staff.accountID">
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
                    <h2 class="staff--empty" v-else>尚無客服人員</h2>
                </div>
            </n-scrollbar>
        </n-grid-item>
    </n-grid>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import { NInput, NConfigProvider, NGrid, NGridItem, NScrollbar, NIcon } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useApiStore } from "@/store/api";
import { useModelStore } from "@/store/model";
import { isProduction, isStaging } from "@/util/commonUtil";
import config from "@/config/config";
import { ShieldCheckmarkOutline } from "@vicons/ionicons5";
import addIcon from "@/assets/Images/chatroom/add-circle.svg";
import searchIcon from "@/assets/Images/manage/search.svg";
import moreIcon from "@/assets/Images/manage/more.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";
import { useChatStore } from "@/store/chat";

const chatStore = useChatStore();
const apiStore = useApiStore();
const { getCustomServiceStaffList, getEventListApi, autoReplyMsgList } = apiStore;
const { staffList, eventList } = storeToRefs(apiStore);

const modelStore = useModelStore();
const { channelArrayPopUp } = storeToRefs(modelStore);
//router
const router = useRouter();
const route = useRoute();

//v-model
const searchChannel = ref("");
const searchStaff = ref("");
onMounted(() => {
    // getEventListApi();
    getCustomServiceStaffList();
});

//搜尋頻道陣列
const filterChannel = computed(() => {
    let arr = eventList.value.filter((p: any) => {
        return p.name.toLowerCase().includes(searchChannel.value.toLowerCase());
    });
    return arr;
});
watch(
    filterChannel,
    () => {
        channelArrayPopUp.value = filterChannel.value;
    },
    { deep: true }
);
//搜尋客服陣列
const filterStaff = computed(() => {
    let arr = staffList.value.filter((p: any) => {
        return p.name.toLowerCase().includes(searchStaff.value.toLowerCase());
    });

    return arr;
});

//前往新增頻道
const params = route.params;
const addChannel = () => {
    params.id
        ? router.push(
              `/manage/${params.id}/activitySetting/addChannel?adminCount=${eventList.value.length}`
          )
        : router.push(`/manage/activitySetting/addChannel?adminCount=${eventList.value.length}`);
};
//前往編輯活動頻道
const goEditChannel = (eventID) => {
    params.id
        ? router.push(
              `/manage/${route.params.id}/activitySetting/editChannel?eventID=${eventID}&adminCount=${eventList.value.length}`
          )
        : router.push(
              `/manage/activitySetting/editChannel?eventID=${eventID}&adminCount=${eventList.value.length}`
          );
};
//前往自動回覆訊息頁面
const goAutoReply = (eventID) => {
    params.id
        ? router.push(`/manage/${route.params.id}/activitySetting/addAutoReply?eventID=${eventID}`)
        : router.push(`/manage/activitySetting/addAutoReply?eventID=${eventID}`);
};
//前往自動回覆訊息列表
const goAutoReplyList = (eventID) => {
    autoReplyMsgList(eventID);
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
.search {
    &.n-input .n-input__input-el {
        font-size: $font-size-14;
        height: 36px;
        line-height: 36px;
    }
}
.content {
    .n-layout-scroll-container {
        background-color: #f4f4f4;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.demoChannel {
    position: relative;
    // top: 10px;
    left: 5px;
    background: url(../../assets/Images/demoChannel2.png) center no-repeat;
    background-size: cover;
    height: 60px;
}
.activitySetting {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 45px;
    margin-bottom: 30px;
    min-height: calc(100% - 160px);
}
.channel {
    background-color: $white;
    padding: 25px 0px;
    border-radius: 4px;
    &__title {
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
            margin-bottom: 10px;

            img {
                width: 14px;
                height: 14px;
            }
        }
    }
    &__avatar {
        display: flex;
        align-items: center;
        img {
            width: 48px;
            height: 48px;
            margin-right: 15px;
            border-radius: 50%;
        }
    }
    &__name {
        font-size: $font-size-14;
        font-weight: 600;
        width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 10px;
        display: flex;
        align-items: center;
        span {
            color: $gray-3;
        }
    }
    &__edit {
        padding-top: 8px;
        position: relative;
        justify-content: flex-end;
        align-items: center;
        img {
            width: 32px;
            cursor: pointer;
        }
    }
    &__more {
        padding: 8px 5px 0 15px;
        position: relative;
        justify-content: flex-end;
        align-items: center;
        img {
            width: 24px;
            cursor: pointer;
        }
    }
    &__list {
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
                &:hover {
                    background-color: $primary-4;
                }
            }
        }
        .channel--empty {
            @extend %h2;
            text-align: center;
            padding: 35%;
            width: 100%;
            min-height: calc(100vh - 240px);
        }
    }
    &__popUp {
        position: absolute;
        box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
        border-radius: 4px;
        top: 60px;
        right: 0px;
        z-index: 1;
        ul {
            padding: 0;
            background-color: $primary-3;
            li {
                padding: 15px 10px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                color: $gray-1;
                // border-right: 1px solid $white;
                cursor: pointer;
                &:hover {
                    background-color: $primary-4;
                }
            }
        }
    }
    // &__UL {
    //     // display: flex;
    //     padding: 0;
    //     li {
    //         padding: 15px 10px;
    //         text-align: center;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         color: $gray-1;
    //         // border-right: 1px solid $white;
    //         cursor: pointer;
    //     }
    //     li:last-child {
    //         // border-right: 0px;
    //     }
    // }
}
.staff {
    background-color: $white;
    padding: 25px 0px;
    margin-left: 15px;
    border-radius: 4px;
    &__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0 20px;
        h2 {
            font-family: $font-family;
            @extend %h2;
            color: $gray-1;
            line-height: 27px;
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
    &__list {
        // max-height: calc(100vh - 335px);
        // overflow-y: auto;
        ul {
            padding: 0 20px;
            li {
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
                &:hover {
                    background-color: $primary-4;
                }
            }
        }
    }
    &--empty {
        @extend %h2;
        text-align: center;
        padding: 35%;
        width: 100%;
        min-height: calc(100vh - 240px);
    }
}
</style>
