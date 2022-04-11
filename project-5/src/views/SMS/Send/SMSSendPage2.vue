<template>
    <div class="SMSSendPage2">
        <div class="smsPage2Content">
            <div class="smsMsgInfo">
                <h2>簡訊內容</h2>
                <div class="smsMessageInfo">
                    <div class="wordCount">
                        <p>{{ smsWord }} 字</p>
                    </div>
                    <div class="numOfMessage">
                        <p>{{ smsCount }} 則</p>
                    </div>
                    <div class="point">
                        <p>{{ smsPoint }} 點</p>
                    </div>
                </div>
            </div>
            <div class="smsMsgContent">
                <div class="msgTitle">
                    <h3>簡訊主旨</h3>
                    <p>{{ smsSubject }}</p>
                </div>
                <div class="msgContent">
                    <h3>發送內容</h3>
                    <p>{{ smsContent }}</p>
                </div>
            </div>
        </div>
        <div class="smsRecipient">
            <div class="smsRecipientInfo">
                <h2>收訊人資訊</h2>
                <p>將扣除{{ smsPoint }}點/<span>剩餘500點</span></p>
            </div>
            <div class="smsRecipientContent">
                <div class="deliveryTime">
                    <h3>發送時間</h3>
                    <p v-if="smsSendOption === 0">立即發送</p>
                    <p v-else>預約發送</p>
                </div>
                <div class="deliveryList">
                    <h3>發送名單</h3>
                    <p>{{ getPhones.length }}筆</p>
                </div>
            </div>
            <div class="smsPage2Button">
                <div class="smsPage2PreviousPage" @click="goPage1">上一步</div>
                <div class="smsPage2ConfirmFail" v-if="disable" :class="{ disable: disable }">
                    確認傳送
                </div>
                <div class="smsPage2Confirm" v-else @click="onSend">確認傳送</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import axios from "axios";

import { useSmsStore } from "@/store/smsStore";
import { useApiStore } from "@/store/api";
import config from "@/config/config";

const route = useRoute();
const router = useRouter();
const params = route.params;

const apiStore = useApiStore();
const { uploadRef, point } = storeToRefs(apiStore);

//smsStore
const smsStore = useSmsStore();
const {
    smsChannel,
    smsSubject,
    smsContent,
    smsWord,
    smsCount,
    smsPoint,
    smsSendOption,
    smsSendTimeStamp,
    smsSendTime,
    smsPhoneString,
    smsPhoneArray,
    smsTabsType,
    smsExcelFile,
} = storeToRefs(smsStore);

// 上一頁按鈕
const goPage1 = () => {
    params.id ? router.push(`/manage/${params.id}/SMSSend`) : router.push(`/manage/SMSSend`);
};
const getPhones: any = ref(null);
if (smsTabsType.value === "automatic") {
    getPhones.value = uploadRef.value.valid.map((file) => `0${file.mobile}`);
} else {
    getPhones.value = smsPhoneArray.value;
}

//確認傳送
const disable = ref(false);
const onSend = () => {
    disable.value = true;
    const newsletterDepartmentToken = localStorage.getItem("newsletterDepartmentToken");
    const sendObj = {
        token: newsletterDepartmentToken,
        text: smsContent.value,
        type: "0",
        subject: smsSubject.value,
        list: getPhones.value.toString(),
        sendTime: smsSendTime.value,
        eventId: smsChannel.value,
    };
    console.log("SMS 確認傳送", sendObj);
    const fd = new FormData();
    fd.append("token", sendObj.token);
    fd.append("text", sendObj.text);
    fd.append("type", sendObj.type);
    fd.append("subject", sendObj.subject);
    fd.append("list", sendObj.list);
    fd.append("sendTime", sendObj.sendTime);
    const getToken = localStorage.getItem("access_token");
    axios({
        method: "post",
        url: `${config.serverUrl}/v1/msgs/${sendObj.eventId}`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            console.log("SMS 確認傳送 res", res);
            point.value = res.data.point;
            alert(`資料已成功傳送!\n您剩餘的點數為: ${point.value}`);
            params.id
                ? router.push(`/manage/${params.id}/SMSSend`)
                : router.push(`/manage/SMSSend`);
            smsStore.$reset();
            disable.value = false;
        })
        .catch((err) => {
            console.error(err);
            alert("傳送失敗, 請重新填寫");
            params.id
                ? router.push(`/manage/${params.id}/SMSSend`)
                : router.push(`/manage/SMSSend`);
            disable.value = false;
        });
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.SMSSendPage2 {
    position: relative;
    display: flex;
    height: calc(100vh - 80px);
    background-color: $bg;
    padding: 15px;
    .smsPage2Content {
        background-color: $white;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        height: 665px;
        display: flex;
        flex-direction: column;
        word-break: break-all;
        word-wrap: break-word;
        .smsMsgInfo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            h2 {
                @extend %h2;
                color: $gray-1;
                font-family: $font-family;
            }
            .smsMessageInfo {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 330px;
                .wordCount {
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                }
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
        .smsMsgContent {
            background-color: #f9f9f9;
            padding: 15px;
            .msgTitle {
                margin-bottom: 50px;
                h3 {
                    margin-bottom: 15px;
                    color: $gray-3;
                }
                p {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
            }
            .msgContent {
                max-width: 530px;
                h3 {
                    margin-bottom: 15px;
                    color: $gray-3;
                }
                p {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    line-height: 1.6;
                    div {
                        color: $danger;
                    }
                }
            }
        }
    }
    .smsRecipient {
        background-color: $white;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        height: 665px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;

        .smsRecipientInfo {
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
                font-size: $font-size-14;
                font-weight: 500;
                color: $gray-1;
                font-family: $font-family;
                span {
                    color: $danger;
                }
            }
        }
        .smsRecipientContent {
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
                    font-size: $font-size-14;
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
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    div {
                        color: $danger;
                    }
                }
            }
        }
        .smsPage2Button {
            display: flex;
            justify-content: center;
            align-items: center;
            .smsPage2PreviousPage {
                width: 170px;
                height: 36px;
                border: 1px solid $gray-1;
                line-height: 36px;
                text-align: center;
                border-radius: 18px;
                cursor: pointer;
            }
            .smsPage2Confirm {
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
            .smsPage2ConfirmFail {
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
