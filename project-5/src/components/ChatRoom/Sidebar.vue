<template>
    <div class="logo">
        <img class="logoImg" :src="logo" alt="talkOD" />
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
import logo from "@/assets/Images/talkOD-logo.svg";
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
        cursor: pointer;
    }
}
</style>
