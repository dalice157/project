<template>
    <div class="editProfileBackground">
        <div class="editProfile">
            <div class="editProfile__avatar">
                <h1>頭像設定</h1>
                <n-upload :accept="avatarAccept" @change="uploadAvatar" type="file">
                    <div class="upload-avatar">
                        <!-- 都沒圖片 -->
                        <img
                            class="upload-avatar--default"
                            :src="photoIcon"
                            alt="預設圖"
                            v-if="profileAvatarStatus === 0"
                        />
                        <!-- 剛上傳頭像顯示 -->
                        <img
                            class="upload-avatar--active"
                            :src="`${config.fileUrl}${avatar.fileid}${avatar.ext}`"
                            :alt="avatar.fileName"
                            v-if="profileAvatarStatus === 1"
                        />
                        <!-- 之前就上傳的頭像 -->
                        <img
                            class="avatarUpload"
                            :src="`${config.fileUrl}${profile.icon}`"
                            alt="頻道大頭照"
                            v-if="profileAvatarStatus === 2"
                        />
                    </div>
                </n-upload>
            </div>
            <div class="editProfile__information">
                <h1><span>*</span>姓名/名稱</h1>
                <n-input placeholder="請輸入姓名/名稱" v-model:value="name"></n-input>
                <h1><span>*</span>手機號碼</h1>
                <n-input placeholder="請輸入手機號碼" v-model:value="mobile"></n-input>
                <div class="button-group">
                    <router-link
                        class="button--cancel"
                        :to="
                            `${route.params.id}`
                                ? `/manage/${route.params.id}/profile`
                                : `/manage/profile`
                        "
                        >取消</router-link
                    >
                    <div v-if="!isDisabled" class="button--save" @click="storeEditProfile">
                        確認儲存
                    </div>
                    <div v-else class="button--disabled">確認儲存</div>
                </div>
            </div>
        </div>
    </div>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { NInput, NUpload } from "naive-ui";
import axios from "axios";
import Compressor from "compressorjs";
import { isphone } from "@/util/commonUtil";
import AlertPopUp from "@/components/AlertPopUp.vue";
import photoIcon from "@/assets/Images/manage/Photo.svg";
import profileIcon from "@/assets/Images/manage/User-square-g.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
//store
const apiStore = useApiStore();
const { profileGetData } = apiStore;
const { profile, profileAvatarStatus, bugout } = storeToRefs(apiStore);
//router
const router = useRouter();
const route = useRoute();
const accountID = ref(localStorage.getItem("accountID"));
const userName = ref(localStorage.getItem("userName"));
//上傳頭像
const avatarAccept = "image/png, image/jpeg";
const avatar = ref({ exp: "", ext: "", fileid: "", fileName: "" });
const uploadAvatar = (e: any) => {
    const file = e.file.file;
    if (!file) {
        return;
    }
    //壓縮圖片套件 compressor js
    new Compressor(file, {
        quality: 0.6,
        async success(result) {
            const fd = new FormData();
            fd.append("file", new File([result], file.name, { type: "image/*" }));
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/file`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("編輯個人頭像 res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e: any) => {
                        avatar.value = {
                            exp: res.data.exp,
                            ext: res.data.ext,
                            fileid: res.data.fileid,
                        };
                        profileAvatarStatus.value = 1;
                    };
                })
                .catch((err) => {
                    // console.error(err);
                    bugout.value.error(`error-log${userName.value}`, err.response.status);
                    bugout.value.error(`error-log${userName.value}`, err.response.data);
                    bugout.value.error(
                        `error-log${userName.value}`,
                        err.response.request.responseURL
                    );
                });
        },
        error(err) {
            console.error(err);
        },
    });
};
//編輯資料寫入
//拿編輯資料
onMounted(() => {
    profileGetData(accountID.value);
});
//v-model
const isDisabled = ref(false);
const name = computed({
    get() {
        return profile.value.name;
    },
    set(val) {
        profile.value.name = val;
    },
});
const mobile = computed({
    get() {
        return String(profile.value.mobile);
    },
    set(val) {
        profile.value.mobile = val;
    },
});
//儲存編輯資料
const storeEditProfile = async () => {
    if (profile.value.mobile === "" || profile.value.name === "") {
        alertMessage.value = `有必填欄位為空!!`;
        return;
    }
    if (!isphone(String(profile.value.mobile))) {
        alertMessage.value = `電話號碼填寫錯誤!!`;
        return;
    }
    const getToken = localStorage.getItem("access_token");
    const fd = new FormData();
    fd.append("accountID", accountID.value);
    fd.append("name", profile.value.name);
    fd.append("mobile", profile.value.mobile);
    fd.append(
        "icon",
        avatar.value.fileid !== ""
            ? String(avatar.value.fileid + avatar.value.ext)
            : String(profile.value.icon)
    );
    await axios({
        method: "patch",
        url: `${config.serverUrl}/v1/contactuser`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            isDisabled.value = false;
            route.params.id
                ? router.push(`/manage/${route.params.id}/profile`)
                : router.push(`/manage/profile`);
        })
        .catch((err) => {
            alertMessage.value = `編輯個人資料失敗,請稍後再試!!`;
            isDisabled.value = false;
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
};
//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.editProfileBackground {
    background-color: $bg;
    padding: 15px;
    .editProfile {
        background-color: $white;
        height: calc(100vh - 160px);
        display: flex;
        flex-direction: column;
        align-items: center;
        &__avatar {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 600;
                margin-top: 30px;
                margin-bottom: 15px;
            }
            .upload-avatar {
                width: 80px;
                height: 80px;
                border: 1px dashed $gray-3;
                border-radius: 50%;
                background-color: $gray-8;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &--default {
                    width: 24px;
                    height: 24px;
                }
                &--active {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                }
                .avatarUpload {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                }
            }
        }
        &__information {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 30px;
            width: 500px;
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 600;
                margin-top: 30px;
                margin-bottom: 15px;
                span {
                    color: #df3636;
                }
            }
            .button-group {
                display: flex;
                justify-content: center;
                margin-top: 30px;
                align-self: center;
                .button--cancel {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    border: 1px solid $gray-1;
                    border-radius: 18px;
                    text-align: center;
                    margin: 0 15px;
                    cursor: pointer;
                    text-decoration: none;
                    color: $gray-1;
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
                .button--disabled {
                    @extend .button--save;
                    background-color: $gray-4;
                    border: 1px solid $gray-4;
                    cursor: default;
                }
            }
        }
    }
}
</style>
