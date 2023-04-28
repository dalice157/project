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
                    <n-scrollbar style="max-height: 400px" trigger="none">
                        <p style="padding: 10px">{{ smsContent }}</p>
                        <p style="padding: 10px">{{ smsPhrases }}</p>
                    </n-scrollbar>
                </div>
            </div>
        </div>
        <div class="smsRecipient">
            <div class="smsRecipientInfo">
                <h2>收訊人資訊</h2>
                <p>
                    將扣除{{ smsPoint * localPhoneCount + smsPoint * 3 * globalPhoneCount }}點/<span
                        >剩餘{{
                            point - (smsPoint * localPhoneCount + smsPoint * 3 * globalPhoneCount)
                        }}點</span
                    >
                </p>
            </div>
            <div class="smsRecipientContent">
                <div class="deliveryTime">
                    <h3>發送時間</h3>
                    <p v-if="smsSendOption === 0">立即發送</p>
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
            <div class="smsPage2Button">
                <div class="smsPage2PreviousPage" @click="goPage1">上一步</div>
                <div class="smsPage2ConfirmFail" v-if="disable" :class="{ disable: disable }">
                    確認傳送
                </div>
                <div class="smsPage2Confirm" v-else @click="onSend">確認傳送</div>
            </div>
        </div>
    </div>
    <!-- 國際簡訊彈窗 -->
    <teleport to="body" v-if="hasGlobalMsg === true">
        <div class="mask">
            <div class="wrap">
                <a @click="hasGlobalMsg = false" class="close"><img :src="closeIcon" /></a>
                <p>
                    請注意！<br />您將發送的這批簡訊中，有收訊人為國際門號(非+886)，國際門號的部分將以<span>3倍點數</span>扣點。
                    <br />
                    此外，請<span>確認您的EVERY8D帳號設定有勾選「開啟國際簡訊發送」功能</span>，若沒勾選開啟，國際門號的簡訊則無法送達。
                    <br />
                    <br />
                    <span class="remark">
                        ※ 開啟國際簡訊發送的方式：登入EVERY8D簡訊發送平台 → 帳號設定 →
                        勾選【開啟國際簡訊發送】→ 確認變更
                    </span>
                </p>
                <div class="buttons">
                    <button @click="hasGlobalMsg = false" class="button">確認</button>
                </div>
            </div>
        </div>
    </teleport>
    <AlertPopUp
        :alertMessage="alertMessage"
        :alertEvent="alertEvent"
        :guideRouter="guideRouter"
        @clearAlertMessage="clearAlertMessage"
        @clearRouter="clearRouter"
    />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { NScrollbar } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import axios from "axios";
import dayjs from "dayjs";
import { clearAllCookie, tokenExpireToLogin } from "@/util/commonUtil";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import AlertPopUp from "@/components/AlertPopUp.vue";

import { useSmsStore } from "@/store/smsStore";
import { useApiStore } from "@/store/api";
import config from "@/config/config";

const route = useRoute();
const router = useRouter();
const params = route.params;
const userName = ref(localStorage.getItem("userName"));

const apiStore = useApiStore();
const { getPoint } = apiStore;
const { uploadRef, point, bugout, addhttps } = storeToRefs(apiStore);

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
    validSMSPhoneArray,
    invalidSMSPhoneArray,
    smsTabsType,
    smsPhrases,
    smsTimelinessSetting,
    smsHour,
    smsMinute,
    smsExpireDate,
} = storeToRefs(smsStore);

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
const hasGlobalMsg: any = ref(false);
//無效電話相關資訊
const invalidPhoneCount: any = ref(0);
onMounted(() => {
    if (smsTabsType.value === "automatic") {
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
        validPhones.value = validSMSPhoneArray.value.map((item) => {
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
        invalidPhoneCount.value = invalidSMSPhoneArray.value?.length;
    }
    // 判斷是否有國際簡訊 跳彈窗
    if (globalPhoneCount.value > 0) {
        hasGlobalMsg.value = true;
    }
});

//確認傳送
const disable = ref(false);
const onSend = () => {
    disable.value = true;
    if (
        smsPoint.value * localPhoneCount.value + smsPoint.value * 3 * globalPhoneCount.value >
        point.value
    ) {
        alertMessage.value = "剩餘點數不足,請洽官網進行儲值!!!";
        disable.value = false;
        return;
    }
    const now = String(dayjs().startOf("second").valueOf());
    if (smsSendOption.value === 1 && Number(now.slice(0, 10)) + 600 > smsSendTime.value) {
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
    const sendObj = {
        text: smsContent.value,
        type: "0",
        subject: smsSubject.value,
        list: validPhones.value.toString(),
        sendTime: smsSendTime.value,
        eventId: smsChannel.value,
        phrases: smsPhrases.value,
        monthDay: smsExpireDate.value === null ? "0" : smsExpireDate.value,
        hourTime: smsHour.value === "" ? "0" : smsHour.value,
        minuteTime: smsMinute.value === "" ? "0" : smsMinute.value,
        addhttps: addhttps.value,
    };
    console.log("SMS 確認傳送", sendObj);
    const fd = new FormData();
    fd.append("text", sendObj.text);
    fd.append("type", sendObj.type);
    fd.append("subject", sendObj.subject);
    fd.append("list", sendObj.list);
    fd.append("sendTime", sendObj.sendTime);
    fd.append("phrases", sendObj.phrases);
    fd.append("monthDay", sendObj.monthDay);
    fd.append("hourTime", sendObj.hourTime);
    fd.append("minuteTime", sendObj.minuteTime);
    fd.append("addhttps", sendObj.addhttps);
    const getToken = localStorage.getItem("access_token");
    axios({
        method: "post",
        url: `${config.serverUrl}/v1/msgs/${sendObj.eventId}`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
        timeout: 0,
    })
        .then((res) => {
            console.log("SMS 確認傳送 res", res);
            point.value = res.data.point;
        })
        .catch((err) => {
            // console.error(err);
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            tokenExpireToLogin(err);
            // alert("傳送失敗, 請重新填寫");
            // getPoint();
        });

    alertMessage.value =
        "簡訊已由系統發送中，若一次發送數量較多，需消耗較長時間完成發送，發送完畢後將自動更新「剩餘點數」。請注意！發送完畢並不代表全數收訊者「成功接收」，想了解發送狀態，請至『發送查詢』頁面查詢發送紀錄。";
    alertEvent.value = "guide";
    guideRouter.value = params.id ? `/manage/${params.id}/SMSSend` : `/manage/SMSSend`;
    smsStore.$reset();
    disable.value = false;
};
// 上一頁按鈕
const goPage1 = () => {
    params.id ? router.push(`/manage/${params.id}/SMSSend`) : router.push(`/manage/SMSSend`);
};
//判斷如果重整導往第一頁
onMounted(() => {
    if (smsContent.value === "") {
        goPage1();
    }
});
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.SMSSendPage2 {
    position: relative;
    display: flex;
    min-height: calc(100vh - 80px);
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
                    + p {
                        margin-top: 8px;
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
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrap {
        position: relative;
        width: 606px;
        min-height: 200px;
        color: $gray-1;
        font-size: $font-size-18;
        border-radius: 10px;
        background: $white left top/100% no-repeat url("~@/assets/Images/common/guide-pages-bg.png");
        text-align: left;
        padding: 45px 45px 20px 45px;
        line-height: 1.4;
        .close {
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 15px;
        }
        p {
            margin-top: 50px;
            span {
                color: red;
            }
            .remark {
                color: $gray-1;
                font-size: $font-size-16;
            }
        }
        .buttons {
            display: flex;
            justify-content: space-evenly;
            .button {
                min-width: 98px;
                background-color: $primary-1;
                border-radius: 20px;
                color: $white;
                font-size: $font-size-16;
                border: none;
                padding: 8px 25px;
                margin-top: 25px;
                cursor: pointer;
                &:hover {
                    background-color: $primary-2;
                }
            }
        }
    }
}
</style>
