<template>
    <div class="siderWrap" @click="closeSearchBar">
        <ul class="tabsNav">
            <li class="log" :class="{ active: type === 'log' }" @click="onLog">交談紀錄</li>
            <li class="moreChat" :class="{ active: type === 'moreChat' }" @click="onMoreChat">
                更多聊天室
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
        <div v-if="type === 'default'" class="userInfo">
            <div class="userPhoto">
                <a :href="eventInfo.homeurl" target="_blank">
                    <n-avatar
                        round
                        :size="100"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${config.fileUrl}${eventInfo.icon}`"
                    />
                </a>
            </div>
            <h2 class="userName">
                {{ eventInfo.name }}
            </h2>
            <div class="description">{{ eventInfo.description }}</div>
        </div>
        <div class="log-content" v-if="type === 'log'">
            <div class="search">
                <ChatRecordSearch />
            </div>
            <ChatRecordList />
        </div>
        <div class="moreChat-content" v-if="type === 'moreChat'">
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
                <div class="btnWrap">
                    <button @click="showQaModal = false">關閉</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar, NDropdown } from "naive-ui";
import { useRoute } from "vue-router";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import MoreSeachBar from "@/components/MoreChatRoom/SearchBar.vue";
import MoreList from "@/components/MoreChatRoom/ChatRoomList.vue";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordList from "@/components/ChatRecord/ChatRecordMessage.vue";
import moreIcon from "@/assets/Images/common/more.svg";

//api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

//router
const route = useRoute();
const eventKey = computed(() => route.params.eventKey);
//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;

const type = ref("default");
const onLog = () => {
    type.value = "log";
};
const onMoreChat = () => {
    type.value = "moreChat";
};

const options = [
    {
        label: "常見問題",
        key: 1,
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
        key: 2,
        props: {
            onClick: () => {
                open("https://www.teamplus.tech/every8d-agreement/");
            },
        },
    },
];

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
    .btnWrap {
        text-align: center;
        margin-top: 20px;
        button {
            border: 1px solid $primary-1;
            background-color: $primary-1;
            color: $white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: $font-size-16;
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
.siderWrap {
    grid-area: sidebar;
    .search {
        padding: 15px;
    }
}
.tabsNav {
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
            &.moreChat {
                background-image: url("~@/assets/Images/common/more-chat-hover.svg");
            }
        }
        &.log {
            background: url("~@/assets/Images/common/log.svg") no-repeat left center;
            padding-left: 30px;
            &:hover {
                background-image: url("~@/assets/Images/common/log-hover.svg");
            }
        }
        &.moreChat {
            background: url("~@/assets/Images/common/more-chat.svg") no-repeat left center;
            background-size: 23px 23px;
            padding-left: 30px;
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

.moreChat-content,
.log-content {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    height: 100%;
}
.userInfo {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    height: calc(100% - 106px);
    background: url("~@/assets/Images/common/sider-bg.svg") no-repeat center bottom;
    .userPhoto {
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
    .userName {
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
    .siderWrap {
        display: none;
    }
}
</style>
