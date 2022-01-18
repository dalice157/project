<template>
    <div class="siderWrap">
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
                    @select="handleSelect"
                    :options="options"
                >
                    <img src="../assets/Images/common/more.svg" />
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
                        :src="`${config.serverUrl}/image/${eventInfo.icon}`"
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
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from "vue";
import { useApiStore } from "../store/api";
import { useSearchStore } from "../store/search";
import { storeToRefs } from "pinia";
import { NAvatar, NDropdown } from "naive-ui";
import { useRoute } from "vue-router";
import config from "@/config/config";
import MoreSeachBar from "@/components/MoreChatRoom/SearchBar.vue";
import MoreList from "@/components/MoreChatRoom/ChatRoomList.vue";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordList from "@/components/ChatRecord/ChatRecordMessage.vue";

//api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

//router
const route = useRoute();
const chatToken = computed(() => route.query.chatToken);

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
    },
    {
        type: "divider",
        key: "d1",
    },
    {
        label: "服務條款",
        key: 2,
    },
];

const handleSelect = (key: any) => {
    console.log("key:", key);
    const keyObj: any = {
        1: "https://www.teamplus.tech/product/teamplus-faq/",
        2: "https://www.teamplus.tech/every8d-agreement/",
    };
    open(keyObj[key]);
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
.siderWrap {
    position: fixed;
    left: 0;
    top: 0;
    width: $siderWidth;
    height: 100vh;
    z-index: 100;
    overflow-y: auto;
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
        font-size: $font-size-16;
        font-weight: 600;
        color: $gray-1;
        cursor: pointer;
        &:hover {
            color: $primary-1;
        }
        &.active {
            color: $primary-1;
            &.log {
                background-image: url("../assets/Images/common/log-hover.svg");
            }
            &.moreChat {
                background-image: url("../assets/Images/common/more-chat-hover.svg");
            }
        }
        &.log {
            background: url("../assets/Images/common/log.svg") no-repeat left center;
            padding-left: 30px;
            &:hover {
                background-image: url("../assets/Images/common/log-hover.svg");
            }
        }
        &.moreChat {
            background: url("../assets/Images/common/more-chat.svg") no-repeat left center;
            background-size: 23px 23px;
            padding-left: 30px;
            &:hover {
                background-image: url("../assets/Images/common/more-chat-hover.svg");
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
}
.userInfo {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    height: calc(100vh - 106px);
    background: url("../assets/Images/common/sider-bg.svg") no-repeat center bottom;
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
        font-size: $font-size-14;
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
        background-image: url("../assets/Images/chatroom/leftBlock.svg");
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
