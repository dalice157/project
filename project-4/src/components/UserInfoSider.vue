<template>
    <div class="userInfo-sider" @click="closeSearchBar">
        <ul class="tabs-nav">
            <li class="log" :class="{ active: type === 'log' }" @click="onLog">交談紀錄</li>
            <li
                class="group-chat-log"
                :class="{ active: type === 'groupChatLog' }"
                @click="onGroupChatLog"
            >
                群組聊天
            </li>
            <li class="more-chat" :class="{ active: type === 'moreChat' }" @click="onMoreChat">
                找商家
            </li>
            <li class="more">
                <n-dropdown
                    class="dropdown"
                    placement="bottom-end"
                    trigger="click"
                    size="small"
                    :options="options"
                >
                    <img :src="moreIcon" />
                </n-dropdown>
            </li>
        </ul>
        <div
            v-if="
                (chatroomType === 0 && type === 'default' && eventInfo !== null) ||
                (chatroomType === 1 && type === 'default' && groupChatEvent !== null)
            "
            class="userInfo"
        >
            <div class="userInfo__photo">
                <a href="javascript:;" v-if="chatroomType === 0">
                    <n-avatar
                        round
                        :size="100"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${config.fileUrl}${eventInfo.icon}`"
                    />
                </a>
                <a href="javascript:;" v-if="chatroomType === 1">
                    <n-avatar
                        round
                        :size="100"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${config.fileUrl}${groupChatEvent.icon}`"
                    />
                </a>
                <!-- <a :href="eventInfo.homeurl" target="_blank">
                    <n-avatar
                        round
                        :size="100"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${config.fileUrl}${eventInfo.icon}`"
                    />
                </a> -->
            </div>
            <h2 class="userInfo__name" v-if="chatroomType === 0">
                {{ eventInfo.name }}
            </h2>
            <h2 class="userInfo__name" v-if="chatroomType === 1">
                {{ groupChatEvent.name }}
            </h2>
            <div class="description" v-if="chatroomType === 0">{{ eventInfo.description }}</div>
        </div>
        <div class="log__content" v-if="type === 'log'">
            <div class="search">
                <ChatRecordSearch />
            </div>
            <ChatRecordList />
        </div>
        <div class="groupChatLog__content" v-if="type === 'groupChatLog'">
            <div class="search">
                <GroupChatSearchBar />
            </div>
            <GroupChatRecordMessage />
        </div>
        <div class="more-chat__content" v-if="type === 'moreChat'">
            <div class="search">
                <MoreSeachBar />
            </div>
            <MoreList />
        </div>
    </div>
    <teleport to="body" v-if="showQaModal">
        <div class="mask">
            <div class="wrap">
                <h2 class="title">Q1若關掉對話視窗，對話就結束了嗎?</h2>
                不會。只要連結還有留存，再次點即可進入對話視窗，瀏覽先前的歷史記錄，繼續進行對話。
                <h2 class="title">Q2若關掉視窗，對話紀錄會消失嗎?</h2>
                紀錄不會消失。只要在同一個裝置開啟連結，對話紀錄便不會消失！
                <h2 class="title">Q3可以使用不同裝置開啟視窗連結嗎?</h2>
                可以。但因應資安考量，之前裝置的聊天紀錄便會消失。
                <div class="button__wrap">
                    <button @click="showQaModal = false">關閉</button>
                </div>
            </div>
        </div>
    </teleport>
    <teleport to="body" v-if="isOldModel">
        <div class="mask">
            <div class="device-code">
                <div class="close__button" @[events].stop="onCloseOldDevice">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <h2>原裝置之驗證碼</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input round v-model:value="vOldCode" readonly type="text" />
                </n-config-provider>
            </div>
        </div>
    </teleport>
    <teleport to="body" v-if="isMCodeModel">
        <div class="mask">
            <div class="device-code">
                <div class="close__button" @[events].stop="onCloseMoMode">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <h2>手機簡訊驗證碼</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input round v-model:value="mCode" readonly type="text" />
                </n-config-provider>
                <p class="ps__word">請發送上列數字簡訊至<br />0{{ mMobile }}</p>
                <n-button
                    @[events].stop="onCloseMoMode"
                    color="#e4e4e4"
                    text-color="#3e3e3e"
                    round
                    size="medium"
                    strong
                    secondary
                    >關閉</n-button
                >
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar, NDropdown, NInput, NConfigProvider, NButton } from "naive-ui";
import { useRoute } from "vue-router";
import axios from "axios";

import config from "@/config/config";
import { isProduction, isStaging } from "@/util/commonUtil";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import MoreSeachBar from "@/components/MoreChatRoom/SearchBar.vue";
import MoreList from "@/components/MoreChatRoom/ChatRoomList.vue";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordList from "@/components/ChatRecord/ChatRecordMessage.vue";
import GroupChatSearchBar from "@/components/GroupChatRecord/GroupChatSearchBar.vue";
import GroupChatRecordMessage from "@/components/GroupChatRecord/GroupChatRecordMessage.vue";
import moreIcon from "@/assets/Images/common/more.svg";
import closeIcon from "@/assets/Images/common/close-round.svg";
import { signature, withCanvasDrawing } from "@/util/deviceUtil";
import { isMobile } from "@/util/commonUtil";

const events = ref(isMobile ? "touchend" : "click");

//api store
const apiStore = useApiStore();
const {
    eventInfo,
    vOldCode,
    mCode,
    mMobile,
    isIllegalDevice,
    bugout,
    chatroomType,
    groupChatEvent,
} = storeToRefs(apiStore);

//router
const route = useRoute();
const eventKey = computed(() => route.params.eventKey);
//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;

const themeOverrides = {
    common: {},
    Input: {
        fontSize: "16px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
};

const type = ref("default");
const onLog = () => {
    type.value = "log";
};
const onGroupChatLog = () => {
    type.value = "groupChatLog";
};
const onMoreChat = () => {
    type.value = "moreChat";
};
const isOldModel = ref(false);
const isMCodeModel = ref(false);
const options = [
    //   {
    //       label: "取得簡訊驗證碼",
    //       key: 1,
    //       props: {
    //           onClick: () => {
    //               getMOCode();
    //           },
    //       },
    //   },
    //   {
    //       type: "divider",
    //       key: "d1",
    //   },
    {
        label: "取得裝置驗證碼",
        key: 2,
        props: {
            onClick: () => {
                onOpenOldDevice();
            },
        },
    },
    {
        type: "divider",
        key: "d1",
    },
    {
        label: "常見問題",
        key: 3,
        props: {
            onClick: () => {
                onQa();
            },
        },
    },
    {
        type: "divider",
        key: "d1",
    },
    {
        label: "服務條款",
        key: 4,
        props: {
            onClick: () => {
                open("https://www.teamplus.tech/every8d-agreement/");
            },
        },
    },
];
const getMOCode = () => {
    axios({
        method: "get",
        url: `${config.serverUrl}/mcode/${route.params.eventKey}?device=${withCanvasDrawing}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            mCode.value = String(res.data.code);
            mMobile.value = res.data.mobile.slice(4, 13);
            isMCodeModel.value = true;
        })
        .catch((err: any) => {
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
            bugout.value.error(
                `error-log${route.params.eventKey}`,
                err.response.request.responseURL
            );
            console.error(err);
        });
};

const onCloseMoMode = () => {
    isMCodeModel.value = false;
};

const onOpenOldDevice = () => {
    axios({
        method: "get",
        url: `${config.serverUrl}/vcode/${route.params.eventKey}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            vOldCode.value = res.data.code;
            isOldModel.value = true;
        })
        .catch((err: any) => {
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
            bugout.value.error(
                `error-log${route.params.eventKey}`,
                err.response.request.responseURL
            );
            console.error(err);
        });
};

const onCloseOldDevice = () => {
    isOldModel.value = false;
};

const showQaModal: any = ref(false);
const onQa = () => {
    showQaModal.value = true;
};
</script>

<style lang="scss">
@import "../assets/scss/extend";
@import "../assets/scss/var";
.dropdown.n-dropdown-menu {
    background-color: $primary-3;
    .n-dropdown-divider {
        background-color: $white;
    }
    .n-dropdown-option .n-dropdown-option-body.n-dropdown-option-body--pending {
        background-color: $primary-3;
        opacity: 0.5;
    }
}
</style>
<style lang="scss" scoped>
@import "../assets/scss/extend";
@import "../assets/scss/var";
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    .device-code {
        border-radius: 20px;
        width: 220px;
        height: 200px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        .ps__word {
            margin-top: 10px;
            line-height: 1.6;
        }
        .close__button {
            position: absolute;
            right: -5px;
            top: -10px;
            z-index: 100;
            width: 28px;
            height: 28px;
            cursor: pointer;
            background-color: $white;
            border-radius: 50px;
            img {
                width: 100%;
            }
        }
        h2 {
            @extend %h2;
            margin-bottom: 15px;
        }
    }
    .wrap {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 1.4;
        color: rgba(0, 26, 219, 0.8);
        .title {
            @extend %h2;
            color: $black;
            margin-bottom: 10px;
            &:not(:first-child) {
                margin-top: 15px;
            }
        }
    }
    .button__wrap {
        text-align: center;
        margin-top: 20px;
        button {
            border: 1px solid $primary-1;
            background-color: $primary-1;
            color: $white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: $font-size-16;
            cursor: pointer;
        }
    }
}
@media (max-width: 320px) {
    .mask {
        .wrap {
            width: 280px;
        }
    }
}
.userInfo-sider {
    // grid-area: sidebar;
    width: 350px;
    .search {
        padding: 15px;
    }
}
.tabs-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 25px;
    padding-bottom: 25px;
    background-color: $gray-8;
    li {
        color: $gray-1;
        padding: 20px;
        font-size: $font-size-18;
        font-weight: 600;
        color: $gray-1;
        cursor: pointer;
        &:hover {
            color: $primary-1;
        }
        &.active {
            color: $primary-1;
            &.log {
                background-image: url("~@/assets/Images/common/log-hover.svg");
            }
            &.group-chat-log {
                background-image: url("~@/assets/Images/common/user group_y.svg");
            }
            &.more-chat {
                background-image: url("~@/assets/Images/common/more-chat-hover.svg");
            }
        }
        &.log {
            background: url("~@/assets/Images/common/log.svg") no-repeat top center;
            padding-top: 30px;
            &:hover {
                background-image: url("~@/assets/Images/common/log-hover.svg");
            }
        }
        &.group-chat-log {
            background: url("~@/assets/Images/common/user group.svg") no-repeat top center;
            padding-top: 30px;
            &:hover {
                background-image: url("~@/assets/Images/common/user group_y.svg");
            }
        }
        &.more-chat {
            background: url("~@/assets/Images/common/more-chat.svg") no-repeat top center;
            background-size: 23px 23px;
            padding-top: 30px;
            &:hover {
                background-image: url("~@/assets/Images/common/more-chat-hover.svg");
            }
        }
        &.more {
            padding: 0;
            img {
                width: 24px;
            }
        }
    }
}

.more-chat__content,
.groupChatLog__content,
.log__content {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    height: 100%;
}
.userInfo {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    height: calc(100% - 106px);
    background: url("~@/assets/Images/common/sider-bg.svg") no-repeat center bottom;
    &__photo {
        display: block;
        padding-top: 50px;
        padding-bottom: 20px;
        text-align: center;
        > a {
            display: inline-block;
            &:hover {
                opacity: 0.9;
            }
        }
    }
    &__name {
        text-align: center;
        @extend %h2;
    }
    .description {
        width: 80%;
        text-align: center;
        margin: 20px auto;
        color: $gray-4;
        font-size: $font-size-16;
        line-height: 1.6;
    }
    .logo {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 100px;
        img {
            width: 30px;
            height: 30px;
        }
        p {
            font-family: $font-family;
            @extend %h1;
            color: $white;
        }
    }
    .userInfoSiderBackground {
        background-image: url("~@/assets/Images/chatroom/leftBlock.svg");
        background-repeat: no-repeat;
        width: 300px;
        height: 382px;
        position: fixed;
        bottom: 0;
    }
}
@media (max-width: 768px) {
    .userInfo-sider {
        display: none;
    }
}
</style>
