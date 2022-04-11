<template>
    <div class="userInfo">
        <n-button
            round
            size="small"
            class="save-button"
            text-color="#3e3e3e"
            @click.stop="onSaveEdited"
            v-show="isEdited && !isUserIcon"
        >
            儲存
        </n-button>
        <img
            @click.stop="handleEdited"
            v-show="!isEdited"
            class="editIcon"
            :src="editIcon"
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
        <p v-show="isEdited" class="change-title" @click.stop="onChangeAvatar">更換大頭照</p>
        <div v-show="isEdited && !isUserIcon">
            <n-input
                class="input"
                v-model:value="userInfo.name"
                type="text"
                placeholder="請輸入暱稱"
            />
            <n-input
                class="input"
                v-model:value="userInfo.mobile"
                type="text"
                placeholder="請輸入電話"
            />
            <div class="tags-group edit">
                <n-dynamic-tags round v-model:value="tags" />
            </div>
            <h4 class="service-log">客服紀錄</h4>
            <div class="service-content">
                <n-input
                    v-model:value="userInfo.description"
                    type="textarea"
                    placeholder="請輸入..."
                />
            </div>
        </div>
        <div v-show="!isEdited">
            <div class="userName">{{ userInfo.name }}</div>
            <p class="phone-number">
                {{ "+" + String(userInfo.mobile).slice(0, 3) }}
                {{ String(userInfo.mobile).slice(-9) }}
            </p>
            <div class="tags-group view" v-if="tags.length > 0">
                <n-dynamic-tags round v-model:value="tags" :closable="false" />
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
                        :class="{ active: String(icon).split('/')[5] == String(img).split('/')[5] }"
                        @click.stop="onClickChoose"
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
                    @click.stop="onSaveAvatar"
                >
                    確定
                </n-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar, NInput, NButton, NDynamicTags, NGrid, NGridItem, NTag } from "naive-ui";
import { useRouter, useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import config from "@/config/config";
import editIcon from "@/assets/Images/chatroom/edit-round.svg";

const imgList = [
    `${config.fileUrl}icon/default.svg`,
    `${config.fileUrl}icon/1.png`,
    `${config.fileUrl}icon/2.png`,
    `${config.fileUrl}icon/3.png`,
    `${config.fileUrl}icon/4.png`,
    `${config.fileUrl}icon/5.png`,
    `${config.fileUrl}icon/6.png`,
    `${config.fileUrl}icon/7.png`,
    `${config.fileUrl}icon/8.png`,
    `${config.fileUrl}icon/9.png`,
    `${config.fileUrl}icon/10.png`,
    `${config.fileUrl}icon/11.png`,
    `${config.fileUrl}icon/12.png`,
];

const route = useRoute();

// api store
const apiStore = useApiStore();
const { getChatroomUserInfoApi, sendUserInfo } = apiStore;
const { chatroomList, userInfo } = storeToRefs(apiStore);

//search store
const searchStore = useSearchStore();
const { searchSwitch } = searchStore;

const isEdited = ref(false);
const img = ref(null);
const showPopover = ref(false);
const tags = ref([]);
const isUserIcon = ref(false);

const chatroomID = computed(() => route.query.chatroomID);

// 開啟修改
const handleEdited = () => {
    isEdited.value = true;
};
onMounted(() => {
    tags.value = userInfo.value.tag;
});
watch(userInfo, () => {
    tags.value = userInfo.value.tag;
});

watchEffect(() => {
    img.value = imgList.find((item) => {
        const icon = item.split("/")[5] === "default.svg" ? 0 : item.split("/")[5].split(".")[0];
        return icon == userInfo.value.icon;
    });
});

watch(
    () => route.query,
    () => {
        isEdited.value = false;
        isUserIcon.value = false;
    }
);

// 儲存
const onSaveEdited = () => {
    if (userInfo.value.name === "") {
        alert("暱稱不能為空!!!");
    } else {
        const infoObj = {
            chatroomID: chatroomID.value,
            name: userInfo.value.name,
            mobile: Number(userInfo.value.mobile),
            icon:
                img.value.split("/")[5] === "default.svg"
                    ? 0
                    : img.value.split("/")[5].split(".")[0],
            tag: tags.value.length === 0 ? userInfo.value.tag : tags.value,
            description: userInfo.value.description,
            eventID: route.params.id,
        };
        sendUserInfo(infoObj);
        isEdited.value = false;
    }
};

// 選擇圖像
const onClickChoose = (e: any) => {
    console.log("src:", e.target.src);

    img.value = e.target.src;
    showPopover.value = false;
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
    &.view {
        .n-dynamic-tags {
            > div {
                &:last-child {
                    display: none !important;
                }
            }
        }
    }
    &.edit {
        .n-dynamic-tags {
            > div {
                &:last-child {
                    padding-top: 5px !important;
                    padding-bottom: 5px !important;
                    display: block !important;
                    width: 100% !important;
                    .n-button {
                        width: 100%;
                        justify-content: flex-start;
                        &::after {
                            content: "新增標籤";
                            color: $gray-2;
                            margin-left: 5px;
                        }
                    }
                    &:hover {
                        .n-button {
                            &::after {
                                color: $primary-1;
                            }
                        }
                        .n-button .n-button__border {
                            border-color: $primary-1;
                        }
                        .n-button .n-button__state-border {
                            border-color: $primary-1;
                        }
                        .n-button .n-button__icon {
                            color: $primary-1;
                        }
                    }
                }
            }
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
