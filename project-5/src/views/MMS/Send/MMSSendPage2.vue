<template>
    <div class="MMSSendPage2">
        <div class="mmsPage2Content">
            <div class="mmsMsgInfo">
                <h2>簡訊內容</h2>
                <div class="mmsMessageInfo">
                    <div class="numOfMessage">
                        <p>{{ Math.ceil(mmsKB) }} KB</p>
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
                    <p>{{ mmsPhrases }}</p>
                </div>
            </div>
        </div>
        <div class="mmsRecipient">
            <div class="mmsRecipientInfo">
                <h2>收訊人資訊</h2>
                <p>
                    將扣除{{ mmsPoint * validPhones?.length }}點/<span
                        >剩餘{{ point - mmsPoint * validPhones?.length }}點</span
                    >
                </p>
            </div>
            <div class="mmsRecipientContent">
                <div class="deliveryTime">
                    <h3>發送時間</h3>
                    <p v-if="mmsSendOption === 0">立即發送</p>
                    <p v-else>預約發送</p>
                </div>
                <div class="deliveryList">
                    <h3>發送名單</h3>
                    <p>
                        有效&ensp;:&ensp;{{
                            validPhoneCount
                        }}筆&ensp;&ensp;&ensp;無效&ensp;:&ensp;{{ invalidPhoneCount }}筆
                    </p>
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
    <AlertPopUp
        :alertMessage="alertMessage"
        :alertEvent="alertEvent"
        :guideRouter="guideRouter"
        @clearAlertMessage="clearAlertMessage"
        @clearRouter="clearRouter"
    />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import dayjs from "dayjs";
import { clearAllCookie, tokenExpireToLogin } from "@/util/commonUtil";

import { useRoute, useRouter } from "vue-router";
import { useMmsStore } from "@/store/mmsStore";
import { useSmsStore } from "@/store/smsStore";
import { useApiStore } from "@/store/api";
import config from "@/config/config";
import AlertPopUp from "@/components/AlertPopUp.vue";

const route = useRoute();
const router = useRouter();
const params = route.params;
const userName = ref(localStorage.getItem("userName"));
const apiStore = useApiStore();
const { getPoint } = apiStore;
const { uploadRef, point, bugout, addhttps } = storeToRefs(apiStore);
const smsStore = useSmsStore();
const { smsHour, smsMinute, smsExpireDate, smsTimelinessSetting } = storeToRefs(smsStore);
//mmsStore
const mmsStore = useMmsStore();
const {
    mmsChannel,
    mmsSubject,
    mmsContent,
    mmsKB,
    mmsPoint,
    mmsSendOption,
    mmsPhoneArray,
    validMMSPhoneArray,
    invalidMMSPhoneArray,
    mmsPhoneString,
    mmsTabsType,
    mmsExcelFile,
    mmsSendTime,
    mmsUploadImgRef,
    mmsImageWidth,
    mmsImageHeight,
    mmsPhrases,
} = storeToRefs(mmsStore);
//alert popup
const alertMessage = ref("");
const alertEvent = ref("");
const guideRouter = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
const clearRouter = () => {
    alertEvent.value = "";
    guideRouter.value = "";
};
//有效電話相關資訊
const validPhones: any = ref(null);
const validPhoneCount: any = ref(0);
const localPhoneCount: any = ref(0);
const globalPhoneCount: any = ref(0);
//無效電話相關資訊
const invalidPhoneCount: any = ref(0);
if (mmsTabsType.value === "automatic") {
    //excel 匯入
    //有效筆數
    validPhones.value = uploadRef.value?.valid.map((file) => {
        if (file.mobile.match(/^(0|\+?886)?9\d{8}$/)) {
            localPhoneCount.value++;
            return "09" + file.mobile.slice(-8);
        } else {
            globalPhoneCount.value++;
            return file.mobile;
        }
    });
    validPhoneCount.value = validPhones.value?.length;
    //無效筆數
    invalidPhoneCount.value = uploadRef.value?.invalid.length;
} else {
    //手動匯入
    //有效筆數
    validPhones.value = validMMSPhoneArray.value.map((item) => {
        if (item.match(/^(0|\+?886)?9\d{8}$/)) {
            localPhoneCount.value++;
            return "09" + item.slice(-8);
        } else {
            globalPhoneCount.value++;
            return item;
        }
    });
    validPhoneCount.value = validPhones.value?.length;
    //無效筆數
    invalidPhoneCount.value = invalidMMSPhoneArray.value?.length;
}
//確認傳送
const disable = ref(false);
const onSend = () => {
    disable.value = true;
    if (
        mmsPoint.value * localPhoneCount.value + mmsPoint.value * 3 * globalPhoneCount.value >
        point.value
    ) {
        alertMessage.value = "剩餘點數不足,請洽官網進行儲值!!!";
        disable.value = false;
        return;
    }
    const now = String(dayjs().startOf("second").valueOf());
    if (mmsSendOption.value === 1 && Number(now.slice(0, 10)) + 600 > mmsSendTime.value) {

        alertMessage.value = "預約發送時間必須大於當下時間10分鐘外!!!";
        disable.value = false;
        return;
    }
    if (
        smsTimelinessSetting.value === true &&
        smsExpireDate.value !== null &&
        Number(now.slice(0, 10)) + 1800 > smsExpireDate.value
    ) {
 
        alertMessage.value = "簡訊連結時效到期時間必須大於當下時間30分鐘外!!!";
        disable.value = false;
        return;
    }
    if (validPhoneCount.value === 0) {

        alertMessage.value = "您所輸入的有效名單數量為零，請修改名單！";
        disable.value = false;
        return;
    }
    const getToken = localStorage.getItem("access_token");
    const sendObj = {
        text: mmsContent.value,
        type: "1",
        subject: mmsSubject.value,
        list: validPhones.value.toString(),
        sendTime: mmsSendTime.value,
        image: mmsUploadImgRef.value.file,
        imageWidth: mmsImageWidth.value,
        imageHeight: mmsImageHeight.value,
        eventId: mmsChannel.value,
        phrases: mmsPhrases.value,
        monthDay: smsExpireDate.value === null ? "0" : smsExpireDate.value,
        hourTime: smsHour.value === "" ? "0" : smsHour.value,
        minuteTime: smsMinute.value === "" ? "0" : smsMinute.value,
        addhttps: addhttps.value,
    };
    console.log("MMS 確認傳送", sendObj);
    const fd = new FormData();
    fd.append("text", sendObj.text);
    fd.append("type", sendObj.type);
    fd.append("subject", sendObj.subject);
    fd.append("list", sendObj.list);
    fd.append("sendTime", sendObj.sendTime);
    fd.append("image", sendObj.image);
    fd.append("imgwidth", sendObj.imageWidth);
    fd.append("imgheight", sendObj.imageHeight);
    fd.append("phrases", sendObj.phrases);
    fd.append("monthDay", sendObj.monthDay);
    fd.append("hourTime", sendObj.hourTime);
    fd.append("minuteTime", sendObj.minuteTime);
    fd.append("addhttps", sendObj.addhttps);
    axios({
        method: "post",
        url: `${config.serverUrl}/v1/msgs/${sendObj.eventId}`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            console.log("MMS 確認傳送 res", res);
            point.value = res.data.point;

        })
        .catch((err) => {
            // console.error(err);
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            tokenExpireToLogin(err);
            // alert("傳送資料有誤, 請重新填寫");
            // alertMessage.value = "傳送資料有誤, 請重新填寫";
            // getPoint();
        });
    alertMessage.value =
        "簡訊已由系統發送中，若一次發送數量逾數百則以上，系統全部發送完畢需數分鐘，發送完畢後將自動更新「剩餘點數」。請注意！發送完畢並不代表全數收訊者「成功接收」，想了解發送狀態，請至『發送查詢』頁面查詢發送紀錄。";
    alertEvent.value = "guide";
    guideRouter.value = params.id ? `/manage/${params.id}/MMSSend` : `/manage/MMSSend`;
    mmsStore.$reset();
    disable.value = false;
};
// 上一頁按鈕
const goPage1 = () => {
    params.id ? router.push(`/manage/${params.id}/MMSSend`) : router.push(`/manage/MMSSend`);
};
//判斷如果重整導往第一頁
onMounted(() => {
    if (mmsContent.value === "") {
        goPage1();
    }
});
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
                    font-size: $font-size-14;
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
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    div {
                        color: $danger;
                    }
                    + p {
                        margin-top: 8px;
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
                font-size: $font-size-14;
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
