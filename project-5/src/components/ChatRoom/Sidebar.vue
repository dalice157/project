<template>
    <div class="logo">
        <div class="logoImg"></div>
    </div>
    <div class="search">
        <ChatRecordSearch />
    </div>
    <ChatRecordList />
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordList from "@/components/ChatRecord/ChatRecordMessage.vue";
//api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

//router
const route = useRoute();

const eventID = computed(() => route.params.id);
//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";

.search {
    padding: 15px;
}

.logo {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;

    .logoImg {
        width: 125px;
        height: 40px;
        background: url("~@/assets/Images/talkOD-logo.png") center no-repeat;
        background-size: 100%;
        text-indent: -9999px;
        white-space: nowrap;
        line-height: 0;
    }
}
</style>
