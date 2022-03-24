<template>
    <div class="userInfo">
        <n-button
            round
            size="small"
            class="save-button"
            text-color="#3e3e3e"
            @click="onSaveEdited"
            v-show="isEdited && !isUserIcon"
        >
            儲存
        </n-button>
        <img
            @click="handleEdited"
            v-show="!isEdited"
            class="editIcon"
            src="../../assets/Images/chatroom/edit-round.svg"
            alt="編輯"
        />
        <div class="userPhoto">
            <n-avatar
                class="userImg"
                :size="72"
                round
                object-fit="cover"
                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                :src="img"
            />
        </div>
        <p v-show="isEdited" class="change-title" @click="onChangeAvatar">更換大頭照</p>
        <div v-show="isEdited && !isUserIcon">
            <n-input class="input" v-model:value="userInfo.name" type="text" />
            <n-input class="input" v-model:value="userInfo.mobile" type="text" />
            <div class="tags-group" v-if="userInfo.tag.length > 0">
                <n-tag
                    v-for="tag in userInfo.tag"
                    :key="tag"
                    round
                    closable
                    @close="handleClose(tag)"
                >
                    #{{ tag }}
                </n-tag>
            </div>
            <div class="add-input-wrap">
                <n-input class="add-input" v-model:value="tag" type="text" placeholder="新增標籤">
                    <template #suffix>
                        <n-button
                            round
                            size="small"
                            class="add-tag-button"
                            text-color="#fff"
                            @click="addTag"
                        >
                            新增
                        </n-button>
                    </template>
                </n-input>
            </div>
            <h4 class="service-log">客服紀錄</h4>
            <div class="service-content">
                <n-input v-model:value="userInfo.description" type="textarea" />
            </div>
        </div>
        <div v-show="!isEdited">
            <div class="userName">{{ userInfo.name }}</div>
            <p class="phone-number">
                {{ "+" + String(userInfo.mobile).slice(0, 3) }}
                {{ String(userInfo.mobile).slice(-9) }}
            </p>
            <div class="tags-group" v-if="userInfo.tag.length > 0">
                <n-tag v-for="tag in userInfo.tag" round :key="tag"> #{{ tag }} </n-tag>
            </div>
            <h4 class="service-log">客服紀錄</h4>
            <p class="service-content">
                {{ userInfo.description || "無客服紀錄" }}
            </p>
        </div>

        <div v-show="isUserIcon">
            <n-grid class="img-group" :x-gap="16" :y-gap="8" :cols="3">
                <n-grid-item v-for="icon in imgList" :key="icon">
                    <n-avatar
                        class="iconImg"
                        :class="{ active: icon.split('/')[3] == img.split('/')[5] }"
                        @click="onClickChoose"
                        round
                        :size="56"
                        object-fit="cover"
                        :src="icon"
                    />
                </n-grid-item>
            </n-grid>
            <div class="btn-wrap">
                <n-button
                    round
                    size="small"
                    class="save-button"
                    text-color="#3e3e3e"
                    @click="onSaveAvatar"
                >
                    儲存
                </n-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar, NInput, NButton, NPopover, NGrid, NGridItem, NTag } from "naive-ui";
import { useRouter, useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import user_pic_defaul from "@/assets/Images/chatroom/User-round.svg";
import user_pic_default_b from "@/assets/Images/user_pic_default_b.png";
import inuserimg_select3 from "@/assets/Images/inuserimg_select3.png";
import inuserimg_select4 from "@/assets/Images/inuserimg_select4.png";
import inuserimg_select5 from "@/assets/Images/inuserimg_select5.png";
import inuserimg_select6 from "@/assets/Images/inuserimg_select6.png";
import inuserimg_select7 from "@/assets/Images/inuserimg_select7.png";
import inuserimg_select8 from "@/assets/Images/inuserimg_select8.png";
import inuserimg_select9 from "@/assets/Images/inuserimg_select9.png";
import inuserimg_select10 from "@/assets/Images/inuserimg_select10.png";
import inuserimg_select11 from "@/assets/Images/inuserimg_select11.png";
import inuserimg_select12 from "@/assets/Images/inuserimg_select12.png";
import config from "@/config/config";

const imgList = [
    user_pic_defaul,
    user_pic_default_b,
    inuserimg_select3,
    inuserimg_select4,
    inuserimg_select5,
    inuserimg_select6,
    inuserimg_select7,
    inuserimg_select8,
    inuserimg_select9,
    inuserimg_select10,
    inuserimg_select11,
    inuserimg_select12,
];

const tags = ref([
    { id: 1, text: "VIP" },
    { id: 2, text: "女性" },
    { id: 3, text: "優質顧客" },
    { id: 4, text: "精選會員" },
    { id: 5, text: "每月消費" },
    { id: 6, text: "等級" },
]);

const route = useRoute();

// api store
const apiStore = useApiStore();
const { getChatroomUserInfoApi, sendUserInfo } = apiStore;
const { chatroomList, userInfo } = storeToRefs(apiStore);

//search store
const searchStore = useSearchStore();
const { searchSwitch } = searchStore;

const isEdited = ref(false);
const img = ref(user_pic_defaul);
const showPopover = ref(false);
const tag = ref("");
const isUserIcon = ref(false);

const chatroomID = computed(() => route.query.chatroomID);

// 開啟修改
const handleEdited = () => {
    isEdited.value = true;
};

const onDescriptionInput = (e) => {
    userInfo.value.description = e.target.innerText;
};

// 儲存
const onSaveEdited = () => {
    const infoObj = {
        chatroomID: chatroomID.value,
        name: userInfo.value.name,
        mobile: Number(userInfo.value.mobile),
        icon: userInfo.value.icon,
        tag: userInfo.value.tag,
        description: userInfo.value.description,
        pinTop: userInfo.value.pinTop || 0,
        eventID: route.params.id,
    };
    sendUserInfo(infoObj);
    isEdited.value = false;
};

// 選擇圖像
const onClickChoose = (e: any) => {
    console.log("e:", e.target.src.split("/").slice(4));

    img.value = e.target.src;
    showPopover.value = false;
};

// 標籤刪除
const handleClose = (removedTag: any) => {
    const tagsChange = userInfo.value.tag.filter((tag) => tag !== removedTag);
    userInfo.value.tag = tagsChange;
};

// 新增標籤
const addTag = () => {
    userInfo.value.tag.push(tag.value);
    tag.value = "";
};

// 開啟變更大頭照
const onChangeAvatar = () => {
    isUserIcon.value = true;
};
// 儲存大頭照
const onSaveAvatar = () => {
    isUserIcon.value = false;
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.save-button.n-button {
    padding: 10px;
    .n-button__border {
        border: 1px solid $gray-1;
        &:hover {
            border: 1px solid $gray-1;
        }
    }
    .n-button__state-border {
        border: none;
    }
    &:not(.n-button--disabled):hover .n-button__state-border {
        border: none;
    }
    &:not(.n-button--disabled):focus .n-button__state-border {
        border: none;
    }
}
.tags-group {
    width: 90% !important;
    margin: 20px auto 10px;
    .n-tag {
        margin: 5px 2px;
        font-size: $font-size-12;
        padding: 10px;
        color: $gray-1;
        background-color: $primary-4;
        font-weight: 400;
        .n-tag__border {
            border: 1px solid $primary-4;
        }
        .n-tag__close {
            background-color: $primary-1;
            border-radius: 50%;
            color: $white;
            font-size: $font-size-14;
            margin-left: 8px;
        }
        .n-base-icon svg {
            width: 10px;
            height: 10px;
        }
    }
}
.add-tag-button.n-button {
    background-color: $primary-1;
    &:hover {
        background-color: $primary-2;
    }
    .n-button__border {
        border: none;
        &:hover {
            border: none;
        }
    }
    .n-button__state-border {
        border: none;
    }
    &:not(.n-button--disabled):hover .n-button__state-border {
        border: none;
    }
    &:not(.n-button--disabled):focus .n-button__state-border {
        border: none;
    }
}

.add-input-wrap {
    width: 90%;
    margin: 10px auto;
    .add-input {
        .n-input-wrapper {
            padding: 4px 10px;
        }
        &:not(.n-input--disabled):hover .n-input__state-border {
            border-color: $border-line;
        }
    }
}
.service-content {
    .n-input .n-input__border,
    .n-input .n-input__state-border .n-button__state-border {
        border: none;
    }
    .n-input:not(.n-input--disabled):hover .n-input__state-border {
        border: none;
    }
    .n-input:not(.n-input--disabled):focus .n-input__state-border {
        border: none;
        box-shadow: none;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.userInfo {
    position: relative;
    .save-button {
        right: 10px;
        top: -20px;
        position: absolute;
        background-color: $gray-1;
        color: $white;
        font-size: $font-size-12;
    }
    .editIcon {
        right: 10px;
        top: -20px;
        position: absolute;
        cursor: pointer;
        font-weight: bold;
        color: #666;
        margin-left: 0.3em;
        width: 25px;
    }
    .userPhoto {
        margin-top: 30px;
        margin-bottom: 10px;
        text-align: center;
    }
    .userName {
        text-align: center;
        @extend %h2;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }

    .input {
        text-align: left;
        display: block;
        width: 90%;
        margin: auto;
        + .input {
            margin-top: 10px;
        }
    }
    .phone-number {
        width: 90%;
        text-align: center;
        margin: 10px auto;
        color: $gray-3;
        font-size: $font-size-14;
        line-height: 1.6;
    }
    .userInfoFunctionBar {
        display: flex;
        justify-content: center;

        .search {
            cursor: pointer;
            padding: 15px;
            .imgBackground {
                background-color: #eee;
                border-radius: 10%;
                margin-bottom: 10px;
                img {
                    width: 50px;
                }
            }
            p {
                text-align: center;
                color: #727272;
            }
        }
        a {
            text-decoration: none;
            .gallery {
                padding: 15px;
                .imgBackground {
                    background-color: #eee;
                    border-radius: 10%;
                    margin-bottom: 10px;
                    img {
                        width: 50px;
                    }
                }
                p {
                    text-align: center;
                    color: #727272;
                }
            }
        }
    }
}

.change-title {
    cursor: pointer;
    width: 90%;
    color: $primary-1;
    font-size: $font-size-15;
    text-align: center;
    margin: 0 auto 10px;
    font-weight: 600;
}
.userImg {
    background-color: $primary-1;
}
.iconImg {
    cursor: pointer;
}
.img-group {
    padding: 15px;
}
.service-log {
    width: 90%;
    margin: 20px auto 10px;
    @extend %h4;
}
.service-content {
    width: 90%;
    margin: 0 auto 10px;
    font-size: $font-size-14;
    color: $gray-1;
    background-color: $bg;
    line-height: 1.6;
    padding: 10px;
    .n-input--textarea {
        background-color: $bg;
    }
}
.btn-wrap {
    margin-top: 30px;
    text-align: center;
    .save-button {
        position: relative;
        right: auto;
        top: auto;
    }
}
.active {
    position: relative;
    &::before {
        content: "✔";
        position: absolute;
        width: 100%;
        height: 100%;
        color: $white;
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-size-22;
    }
    &::after {
        content: "";
        position: absolute;
        background-color: $gray-1;
        opacity: 0.6;
        width: 100%;
        height: 100%;
        z-index: 99;
    }
}
</style>
