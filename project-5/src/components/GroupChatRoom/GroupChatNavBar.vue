<template>
    <div class="navbar" @click="closeSearchBar">
        <h2 class="title">
            內部人員({{ people.inner }})&ensp;
            <span v-if="people.outter !== 0">/&ensp; 外部人員({{ people.outter }})</span>
        </h2>
        <!-- 功能欄 -->
        <div class="chatpane">
            <router-link class="gallery" :to="`/groupChat/gallery?eventID=${route.query.eventID}`">
                <img :src="galleryIcon" alt="進入相本" draggable="false" />
            </router-link>
            <div class="search" @click.stop="searchSwitch">
                <img :src="searchIcon" alt="搜尋" draggable="false" />
            </div>
        </div>
    </div>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useGroupChatRecordStore } from "@/store/groupChatRecord";
import { useModelStore } from "@/store/model";
// import { dateFormat } from "@/util/dateUtil";
import config from "@/config/config";
import phoneIcon from "@/assets/Images/chatroom/phone.svg";
import galleryIcon from "@/assets/Images/chatroom/list.svg";
import searchIcon from "@/assets/Images/chatroom/search.svg";
import AlertPopUp from "@/components/AlertPopUp.vue";

//router
const router = useRouter();
const route = useRoute();
const eventID = computed(() => route.query.eventID);

// api store
const apiStore = useApiStore();
// const {} = apiStore;
// const {} = storeToRefs(apiStore);

//groupchat store
const groupChatRecordStore = useGroupChatRecordStore();
const { groupChatRecordMessages } = storeToRefs(groupChatRecordStore);

//search store
const searchStore = useSearchStore();
const { searchSwitch, closeSearchBar } = searchStore;

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;
const { sender } = storeToRefs(phoneCallStore);

//modal store
const modelStore = useModelStore();
const { phoneCallModal } = storeToRefs(modelStore);

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

const people = computed(() => {
    let peopleArr = groupChatRecordMessages.value.filter(
        (item) => Number(item.eventID) === Number(route.query.eventID)
    );
    let peopleObj = {
        inner: peopleArr[0]?.number_in,
        outter: peopleArr[0]?.number_ex,
    };
    return peopleObj;
});
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.hide {
    display: none;
}

.navbar {
    height: 46px;
    background-color: $primary-1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        color: $gray-1;
        @extend %h2;
        margin-left: 30px;
        .lastTime {
            font-size: $font-size-12;
            font-weight: normal;
            color: $white;
            margin-left: 20px;
            margin-right: 10px;
        }
        .time {
            font-size: $font-size-12;
            color: $white;
            display: inline-block;
            margin-left: 12px;
            font-weight: normal;
        }
    }
    .search {
        cursor: pointer;
    }
    .chatpane {
        margin-right: 0.5em;
        display: flex;
        // .change-mms {
        //     border-radius: 50px;
        //     border: 1px solid $primary-4;
        //     background-color: $primary-4;
        //     color: $gray-1;
        //     font-size: $font-size-12;
        //     padding: 5px 10px;
        //     margin-right: 10px;
        //     cursor: pointer;
        //     &:hover {
        //         background-color: $primary-5;
        //     }
        // }
        .phone-web {
            display: block;
            cursor: pointer;
        }
        .phone {
            display: none;
        }
        @media (max-width: 768px) {
            .phone-web {
                display: none;
            }
            .phone {
                display: block;
            }
        }
        a,
        .search {
            -webkit-user-drag: none;
            background-color: transparent;
            margin: 0 5px;
        }
    }
}
@media (max-width: 768px) {
    .navbar {
        width: 100%;
        height: 140px;
        background: transparent url("~@/assets/Images/chatroom/header-bg.png") no-repeat center top;
        background-size: cover;
        .back {
            display: block;
        }
    }
}
@media (max-width: 420px) {
    .navbar {
        background: transparent url("~@/assets/Images/chatroom/header-bg-s.svg") no-repeat center
            top;
        background-size: cover;
    }
}
</style>
