<template>
    <div class="addCustomService">
        <!--客服人員 -->
        <div class="customService">
            <div class="customServiceTitle">
                <h2>客服人員</h2>
                <h2>{{ staffEvents.accountName }}</h2>
            </div>
            <div class="csList" v-if="showEvents.length > 0">
                <ul>
                    <li
                        v-for="channel in showEvents"
                        :key="channel.eventID"
                        @mouseenter="channelHoverIndex = channel.eventID"
                        @mouseleave="channelHoverIndex = '0'"
                        :class="{ hoverEffect: channelHoverIndex === channel.eventID }"
                    >
                        <div class="channelTitle">
                            <img :src="`${config.fileUrl}/fls/${channel.icon}`" alt="" />
                            <p class="channelName">{{ channel.name }}</p>
                        </div>
                        <div class="channelSetting" @click="onDelList(channel)">
                            <n-icon size="16">
                                <close-circle-sharp />
                            </n-icon>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="noCslist" v-else>
                <h2>此客服人員目前尚無管理頻道!!</h2>
            </div>
            <div class="buttonGroup">
                <div class="channelCancel" @click="goActivity">取消</div>
                <div class="channelStore" @click="onSendList">確認儲存</div>
            </div>
        </div>
        <!-- 管理頻道 -->
        <div class="manageChannel">
            <div class="manageChannelTitle">
                <h2>新增管理頻道</h2>
            </div>
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    class="searchInput"
                    v-model:value="searchChannel"
                    type="text"
                    placeholder="搜尋"
                >
                    <template #prefix>
                        <img src="../../assets/Images/manage/search.svg" alt="#" />
                    </template>
                </n-input>
            </n-config-provider>
            <div class="channelList" v-if="addEvents.length > 0">
                <ul>
                    <li
                        v-for="channel in addEvents"
                        :key="channel.eventID"
                        @mouseenter="stafflHoverIndex = channel.eventID"
                        @mouseleave="stafflHoverIndex = '0'"
                        :class="{ hoverEffect: stafflHoverIndex === channel.eventID }"
                    >
                        <div class="channelTitle">
                            <img :src="`${config.fileUrl}/fls/${channel.icon}`" alt="" />
                            <p class="channelName">{{ channel.name }}</p>
                        </div>
                        <div class="channelSetting" @click="addChannel(channel)">
                            <img src="../../assets/Images/manage/add-circle.svg" alt="#" />
                        </div>
                    </li>
                </ul>
            </div>
            <div class="noChannelList" v-else>
                <h2>目前尚無管理頻道可新增!!</h2>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from "vue";
import { NInput, NConfigProvider, NIcon } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { CloseCircleSharp } from "@vicons/ionicons5";

import config from "@/config/config";
import { useApiStore } from "@/store/api";

//router
const router = useRouter();
const route = useRoute();

const apiStore = useApiStore();
const { sendEvents, getEvents } = apiStore;
const { eventList, staffEvents } = storeToRefs(apiStore);
getEvents(route.query.accountID);

//v-model
const searchChannel = ref("");
const channelHoverIndex = ref("0");
const stafflHoverIndex = ref("0");

//搜尋新陣列
const isPush = ref(false);

const getEventList = computed(() => {
    const list = Object.values(showEvents.value).map((item) => item.eventID);
    const arr = eventList.value.filter((event) => !list.includes(event.eventID));
    return arr;
});
const addEvents = computed(() => {
    const arr = getEventList.value.filter((p: any) => {
        return p.name.includes(searchChannel.value);
    });
    return arr;
});
const showEvents = computed(() => staffEvents.value.events || []);

const addChannel = (info) => {
    isPush.value = true;
    showEvents.value.push(info);
    console.log(showEvents.value);
};

const onDelList = (info) => {
    showEvents.value.forEach((event, index) => {
        if (event.eventID === info.eventID) {
            showEvents.value.splice(index, 1);
        }
    });
};

const onSendList = () => {
    let getEventIdList = [];
    if (showEvents.value.length > 0) {
        getEventIdList = Object.values(showEvents.value).map((item) => {
            return {
                eventID: item.eventID,
            };
        });
    }
    isPush.value = false;
    sendEvents(route.query.accountID, getEventIdList, router);
};

//前往活動頻道管理
const params = route.params;
const goActivity = () => {
    router.push(`/manage/${params.id}/activitySetting`);
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

.addCustomService {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    min-height: calc(100% - 80px);
    .customService {
        width: 50%;
        height: 100%;
        background-color: $white;
        padding: 25px 0px;
        border-radius: 4px;
        .customServiceTitle {
            margin-bottom: 20px;
            padding: 0 20px;

            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
                margin-bottom: 10px;
            }
        }
        .csList {
            margin-bottom: 30px;
            ul {
                padding: 0 20px;
                max-height: calc(100vh - 295px);
                overflow-y: auto;
                background-color: #f9f9f9;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 68px;

                    .channelTitle {
                        display: flex;
                        align-items: center;
                        font-size: $font-size-14;
                        font-weight: 600;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        img {
                            width: 48px;
                            height: 48px;
                            margin-right: 15px;
                            border-radius: 50%;
                        }
                    }
                    .channelSetting {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                }
            }
        }
        .noCslist {
            display: flex;
            justify-content: center;
            margin-top: 50px;
            margin-bottom: 50px;
            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
                margin-bottom: 10px;
            }
        }
        .buttonGroup {
            display: flex;
            justify-content: center;
            .channelCancel {
                width: 100px;
                height: 36px;
                line-height: 36px;
                border: 1px solid $gray-1;
                border-radius: 18px;
                text-align: center;
                margin: 0 15px;
                cursor: pointer;
            }
            .channelStore {
                width: 200px;
                height: 36px;
                line-height: 36px;
                border: 1px solid $gray-1;
                border-radius: 18px;
                text-align: center;
                color: $white;
                background-color: $gray-1;
                margin: 0 15px;
                cursor: pointer;
            }
        }
    }
    .manageChannel {
        width: 50%;
        height: 100%;
        background-color: $white;
        padding: 25px 0px;
        margin-left: 15px;
        border-radius: 4px;
        .manageChannelTitle {
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
        .channelList {
            ul {
                padding: 0 20px;
                max-height: calc(100vh - 250px);
                overflow-y: auto;
                background-color: #f9f9f9;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 68px;

                    .channelTitle {
                        display: flex;
                        align-items: center;
                        font-size: $font-size-14;
                        font-weight: 600;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        img {
                            width: 48px;
                            height: 48px;
                            margin-right: 15px;
                            border-radius: 50%;
                        }
                    }
                    .channelSetting {
                        display: flex;
                        align-items: center;
                        img {
                            width: 20.5px;
                            height: 20.5px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .noChannelList {
            display: flex;
            justify-content: center;
            margin-top: 50px;
            margin-bottom: 50px;
            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
            }
        }
    }
}
</style>
