<template>
    <div class="profileBackground">
        <div class="profile">
            <div class="profile__avatar">
                <h1>頭像設定</h1>
                <img :src="profileIcon" v-if="!profile.icon" />
                <img :src="`${config.fileUrl}${profile.icon}`" alt="大頭像" v-else />
            </div>
            <div class="profile__setting">
                <img :src="editIcon" @click="gotoEditProfile" />
                <div class="profile__setting--status">
                    <div class="leftBlock">
                        <h1><span>*</span>帳號</h1>
                        <p>{{ profile.account }}</p>
                        <h1><span>*</span>手機號碼</h1>
                        <p>{{ profile.mobile }}</p>
                        <h1>部門</h1>
                        <p>{{ profile.department || "---" }}</p>
                        <h1>公司電話</h1>
                        <p>{{ profile.telephone || "---" }}</p>
                    </div>
                    <div class="rightBlock">
                        <h1><span>*</span>姓名/名稱</h1>
                        <p>{{ profile.name }}</p>
                        <h1>Email</h1>
                        <p>{{ profile.email || "---" }}</p>
                        <h1>職稱</h1>
                        <p>{{ profile.role || "---" }}</p>
                        <h1>分機</h1>
                        <p>{{ profile.ext || "---" }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import profileIcon from "@/assets/Images/manage/User-round_g.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
//store
const apiStore = useApiStore();
const { profileGetData } = apiStore;
const { profile } = storeToRefs(apiStore);
//router
const router = useRouter();
const route = useRoute();

const accountID = ref(localStorage.getItem("accountID"));
const eventID = computed(() => route.params.id);
onMounted(() => {
    profileGetData(accountID.value);
});

const gotoEditProfile = () => {
    router.push(`/manage/${eventID.value}/editprofile`);
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.profileBackground {
    background-color: $bg;
    padding: 15px;
    .profile {
        background-color: $white;
        height: calc(100vh - 160px);
        display: flex;
        flex-direction: column;
        align-items: center;
        &__avatar {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 600;
                margin-top: 30px;
                margin-bottom: 15px;
            }
            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
        }
        &__setting {
            display: flex;
            flex-direction: column;
            position: relative;
            top: -20px;
            z-index: 1;
            width: 80%;
            height: 386px;
            background-color: $gray-8;
            padding: 15px;
            img {
                width: 32px;
                align-self: flex-end;
                cursor: pointer;
            }
            &--status {
                width: 70%;
                align-self: center;
                display: flex;
                justify-content: space-around;
                .leftBlock {
                    h1 {
                        color: $gray-1;
                        font-size: $font-size-16;
                        font-weight: 400;
                        margin-top: 30px;
                        margin-bottom: 7px;
                        span {
                            color: #df3636;
                        }
                    }
                    p {
                        font-size: $font-size-14;
                        font-weight: 400;
                        color: $gray-3;
                        font-family: $font-family;
                    }
                }
                .rightBlock {
                    h1 {
                        color: $gray-1;
                        font-size: $font-size-16;
                        font-weight: 400;
                        margin-top: 30px;
                        margin-bottom: 7px;
                        span {
                            color: #df3636;
                        }
                    }
                    p {
                        font-size: $font-size-14;
                        font-weight: 400;
                        color: $gray-3;
                        font-family: $font-family;
                    }
                }
            }
        }
    }
}
</style>
