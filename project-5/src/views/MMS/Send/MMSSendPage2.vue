<template>
    <div class="MMSSendPage2">
        <div class="mmsPage2Content">
            <div class="mmsMsgInfo">
                <h2>簡訊內容</h2>
                <div class="mmsMessageInfo">
                    <div class="numOfMessage">
                        <p>{{ 0 }} KB</p>
                    </div>
                    <div class="point">
                        <p>{{ mmsPoint }} 點</p>
                    </div>
                </div>
            </div>
            <div class="mmsMsgContent">
                <div class="msgTitle">
                    <h3>簡訊主旨</h3>
                    <p>{{ mmsSubject }}</p>
                </div>
                <div class="msgContent">
                    <h3>發送內容</h3>
                    <p>{{ mmsContent }}</p>
                </div>
            </div>
        </div>
        <div class="mmsRecipient">
            <div class="mmsRecipientInfo">
                <h2>收訊人資訊</h2>
                <p>將扣除{{ mmsPoint }}點/<span>剩餘500點</span></p>
            </div>
            <div class="mmsRecipientContent">
                <div class="deliveryTime">
                    <h3>發送時間</h3>
                    <p v-if="mmsSendOption === 0">立即發送</p>
                    <p v-else>預約發送</p>
                </div>
                <div class="deliveryList">
                    <h3>發送名單</h3>
                    <p>{{ getPhones.length }}筆</p>
                </div>
            </div>
            <div class="mmsPage2Button">
                <div class="mmsPage2PreviousPage" @click="goPage1">上一步</div>
                <div class="mmsPage2ConfirmFail" v-if="disable" :class="{ disable: disable }">
                    確認傳送
                </div>
                <div class="mmsPage2Confirm" v-else @click="onSend">確認傳送</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";

import { useRoute, useRouter } from "vue-router";
import { useMmsStore } from "@/store/mmsStore";
import { useApiStore } from "@/store/api";
import config from "@/config/config";

const route = useRoute();
const router = useRouter();
const params = route.params;

const apiStore = useApiStore();
const { uploadRef, point } = storeToRefs(apiStore);

//smsStore
const mmsStore = useMmsStore();
const {
    mmsChannel,
    mmsSubject,
    mmsContent,
    mmsKB,
    mmsPoint,
    mmsSendOption,
    mmsPhoneArray,
    mmsPhoneString,
    mmsTabsType,
    mmsExcelFile,
    mmsSendTime,
    mmsUploadImgRef,
    mmsSendTimeStamp,
} = storeToRefs(mmsStore);
const getPhones: any = ref(null);
if (mmsTabsType.value === "automatic") {
    getPhones.value = uploadRef.value.valid.map((file) => `0${file.mobile}`);
} else {
    getPhones.value = mmsPhoneArray.value;
}
//確認傳送
const disable = ref(false);
const onSend = () => {
    disable.value = true;
    const newsletterDepartmentToken = localStorage.getItem("newsletterDepartmentToken");
    const getToken = localStorage.getItem("access_token");
    const sendObj = {
        token: newsletterDepartmentToken,
        text: mmsContent.value,
        type: "1",
        subject: mmsSubject.value,
        list: getPhones.value.toString(),
        sendTime: mmsSendTime.value,
        image: mmsUploadImgRef.value.file,
        eventId: mmsChannel.value,
    };
    console.log("MMS 確認傳送", sendObj);
    const fd = new FormData();
    fd.append("token", sendObj.token);
    fd.append("text", sendObj.text);
    fd.append("type", sendObj.type);
    fd.append("subject", sendObj.subject);
    fd.append("list", sendObj.list);
    fd.append("sendTime", sendObj.sendTime);
    fd.append("image", sendObj.image);
    axios({
        method: "post",
        url: `${config.serverUrl}/v1/msgs/${sendObj.eventId}`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            // console.log("MMS 確認傳送 res", res);
            point.value = res.data.point;
            alert(`資料已成功傳送!\n您剩餘的點數為: ${point.value}`);
            router.push(`/manage/${params.id}/MMSSend`);
            mmsStore.$reset();
            disable.value = false;
        })
        .catch((err) => {
            console.error(err);
            alert("傳送資料有誤, 請重新填寫");
            router.push(`/manage/${params.id}/MMSSend`);
            disable.value = false;
        });
};
// 上一頁按鈕
const goPage1 = () => {
    router.push(`/manage/${params.id}/MMSSend`);
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.MMSSendPage2 {
    position: relative;
    display: flex;
    height: calc(100% - 80px);
    background-color: $bg;
    padding: 15px;
    .mmsPage2Content {
        background-color: $white;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        height: 665px;
        display: flex;
        flex-direction: column;
        .mmsMsgInfo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            h2 {
                @extend %h2;
                color: $gray-1;
                font-family: $font-family;
            }
            .mmsMessageInfo {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 220px;
                .numOfMessage {
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                }
                .point {
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                }
            }
        }
        .mmsMsgContent {
            background-color: #f9f9f9;
            padding: 15px;
            .msgTitle {
                margin-bottom: 50px;
                h3 {
                    margin-bottom: 15px;
                    color: $gray-3;
                }
                p {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
            }
            .msgContent {
                h3 {
                    margin-bottom: 15px;
                    color: $gray-3;
                }
                p {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    div {
                        color: $danger;
                    }
                }
            }
        }
    }
    .mmsRecipient {
        background-color: $white;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        height: 665px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;

        .mmsRecipientInfo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
            h2 {
                @extend %h2;
                color: $gray-1;
                font-family: $font-family;
            }
            p {
                font-size: 14px;
                font-weight: 500;
                color: $gray-1;
                font-family: $font-family;
                span {
                    color: $danger;
                }
            }
        }
        .mmsRecipientContent {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 80px;
            .deliveryTime {
                margin-bottom: 50px;
                h3 {
                    margin-bottom: 15px;
                    color: $gray-3;
                }
                p {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
            }
            .deliveryList {
                h3 {
                    margin-bottom: 15px;
                    color: $gray-3;
                }
                p {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    div {
                        color: $danger;
                    }
                }
            }
        }
        .mmsPage2Button {
            display: flex;
            justify-content: center;
            align-items: center;
            .mmsPage2PreviousPage {
                width: 170px;
                height: 36px;
                border: 1px solid $gray-1;
                line-height: 36px;
                text-align: center;
                border-radius: 18px;
                cursor: pointer;
            }
            .mmsPage2Confirm {
                width: 200px;
                height: 36px;
                border-radius: 18px;
                line-height: 36px;
                text-align: center;
                color: $white;
                background-color: $gray-1;
                margin-left: 15px;
                cursor: pointer;
            }
            .mmsPage2ConfirmFail {
                width: 200px;
                height: 36px;
                border-radius: 18px;
                line-height: 36px;
                text-align: center;
                color: $white;
                background-color: $gray-1;
                margin-left: 15px;
                &.disable {
                    background-color: $gray-4;
                }
            }
        }
    }
}
</style>
