<template>
    <div class="addCustomService">
        <!--客服人員 -->
        <div class="staff">
            <div class="staff__title">
                <h2>客服人員</h2>
                <h2>{{ staffEvents.accountName }}</h2>
            </div>
            <div class="staff__cs-list" v-if="staffEvents.events.length > 0">
                <ul>
                    <li v-for="channel in staffEvents.events" :key="channel.eventID">
                        <div class="cs__title">
                            <img :src="`${config.fileUrl}${channel.icon}`" alt="" />
                            <p class="channelName">{{ channel.name }}</p>
                        </div>
                        <div class="cs__del" @click="onDelList(channel)">
                            <n-icon size="16">
                                <close-circle-sharp />
                            </n-icon>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="staff__not-found" v-else>
                <h2>此客服人員目前尚無管理頻道!!</h2>
            </div>
            <div class="button-group">
                <div class="button--Cancel" @click="goActivity">取消</div>
                <div class="button--save" @click="onSendList">確認儲存</div>
            </div>
        </div>
        <!-- 管理頻道 -->
        <div class="manage-channels">
            <div class="manage-channels__title">
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
                        <img :src="searchIcon" alt="search" />
                    </template>
                </n-input>
            </n-config-provider>
            <div class="manage-channels__list" v-if="filterChannel.length > 0">
                <ul>
                    <li v-for="channel in filterChannel" :key="channel.eventID">
                        <div class="list__title">
                            <img :src="`${config.fileUrl}${channel.icon}`" alt="" />
                            <p class="list__name">{{ channel.name }}</p>
                        </div>
                        <div class="list__add" @click="addChannel(channel)">
                            <img :src="addIcon" alt="add" />
                        </div>
                    </li>
                </ul>
            </div>
            <div class="manage-channels__not-found" v-else>
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
import searchIcon from "@/assets/Images/manage/search.svg";
import addIcon from "@/assets/Images/manage/add-circle.svg";

//router
const router = useRouter();
const route = useRoute();

const apiStore = useApiStore();
const { sendEvents, getEvents } = apiStore;
const { eventList, staffEvents } = storeToRefs(apiStore);
getEvents(route.query.accountID);

//v-model
const searchChannel = ref("");

//搜尋頻道陣列
const filterChannel = computed(() => {
    const list = Object.values(staffEvents.value.events).map((item) => item.eventID);
    const arr = eventList.value.filter((event) => {
        return (
            !list.includes(event.eventID) &&
            event.name.toLowerCase().includes(searchChannel.value.toLowerCase())
        );
    });
    return arr;
});

const addChannel = (info) => {
    staffEvents.value.events.push(info);
};

const onDelList = (info) => {
    staffEvents.value.events.forEach((event, index) => {
        if (event.eventID !== info.eventID) return;
        staffEvents.value.events.splice(index, 1);
    });
};

const onSendList = () => {
    let getEventIdList = [];
    if (staffEvents.value.events.length > 0) {
        getEventIdList = Object.values(staffEvents.value.events).map((item) => {
            return {
                eventID: item.eventID,
            };
        });
    }
    sendEvents(route.query.accountID, getEventIdList, router);
};

//前往活動頻道管理
const params = route.params;
const goActivity = () => {
    params.id
        ? router.push(`/manage/${params.id}/activitySetting`)
        : router.push(`/manage/activitySetting`);
};

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

.addCustomService {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    min-height: calc(100vh - 140px);
}
.manage-channels {
    width: 50%;
    height: calc(100vh - 180px);
    background-color: $white;
    padding: 25px 0px;
    margin-left: 15px;
    border-radius: 4px;
    &__title {
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
    &__list {
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
                &:hover {
                    background-color: $primary-4;
                }
            }
        }
    }

    &__not-found {
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
}
.list {
    &__title {
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
    &__add {
        display: flex;
        align-items: center;
        img {
            width: 20.5px;
            height: 20.5px;
            cursor: pointer;
        }
    }
}
.staff {
    width: 50%;
    height: calc(100vh - 180px);
    background-color: $white;
    padding: 25px 0px;
    border-radius: 4px;
    &__title {
        margin-bottom: 20px;
        padding: 0 20px;

        h2 {
            font-family: $font-family;
            @extend %h2;
            color: $gray-1;
            margin-bottom: 10px;
        }
    }
    &__cs-list {
        margin-bottom: 30px;
        ul {
            padding: 0 20px;
            max-height: calc(100vh - 335px);
            overflow-y: auto;
            background-color: #f9f9f9;
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 68px;
                &:hover {
                    background-color: $primary-4;
                }
            }
        }
    }
    &__not-found {
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
}
.button-group {
    display: flex;
    justify-content: center;
    .button--Cancel {
        width: 100px;
        height: 36px;
        line-height: 36px;
        border: 1px solid $gray-1;
        border-radius: 18px;
        text-align: center;
        margin: 0 15px;
        cursor: pointer;
    }
    .button--save {
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
.cs {
    &__title {
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
    &__del {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
}

.manage-channels__list {
    ul::-webkit-scrollbar-track {
        border-radius: 5px;
        cursor: pointer;
    }
}

.manage-channels__list {
    ul::-webkit-scrollbar {
        width: 5px;
    }
}

.manage-channels__list {
    ul::-webkit-scrollbar-thumb {
        border-radius: 5px;
        cursor: pointer;
        -webkit-box-shadow: inset 5px 5px 5px $gray-4;
    }
}
.staff__cs-list {
    ul::-webkit-scrollbar-track {
        border-radius: 5px;
        cursor: pointer;
    }
}

.staff__cs-list {
    ul::-webkit-scrollbar {
        width: 5px;
    }
}

.staff__cs-list {
    ul::-webkit-scrollbar-thumb {
        border-radius: 5px;
        cursor: pointer;
        -webkit-box-shadow: inset 5px 5px 5px $gray-4;
    }
}
</style>
