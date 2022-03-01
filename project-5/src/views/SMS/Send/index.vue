<template>
    <div class="SMSSend">
        <div class="smsContent">
            <h2>輸入簡訊內容</h2>
            <n-divider></n-divider>
            <div class="smsChannel">
                <h3>發送頻道</h3>
                <n-select
                    class="selectChannel"
                    v-model:value="smsChannel"
                    :options="filterChannelList"
                    placeholder="請選擇發送頻道"
                />
            </div>
            <div class="smsSubject">
                <div class="subject">
                    <h3>簡訊主旨</h3>
                    <p>
                        (「簡訊主旨」內不會出現於訊內容中，亦不列入訊字數計算。輸入「簡訊主旨」可讓您更容易管理每一次簡訊發送作業，當您為每一次的發送予以命名，在查詢報表時，將可方便區分每一次的發送記錄。)
                    </p>
                </div>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input
                        id="input"
                        v-model:value.trim="smsSubject"
                        type="text"
                        placeholder="請輸入簡訊主旨(可不填)"
                    />
                </n-config-provider>
            </div>
            <div class="smsSendContent">
                <div class="contentTitle">
                    <h3>發送內容</h3>
                    <div class="commonMessage">+常用簡訊</div>
                </div>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input
                        ref="inputInstRef"
                        id="textarea"
                        v-model:value.trim="smsContent"
                        type="textarea"
                        placeholder="請輸入簡訊內容..."
                        :autosize="{
                            minRows: 7,
                            maxRows: 7,
                        }"
                        @focus="focusType"
                        @blur="blurJudge"
                        @input="wordCount"
                    />
                </n-config-provider>
            </div>
            <div class="messageCount">
                <div class="messageInfo">
                    <div class="wordCount">{{ smsWord }} 字</div>
                    <div class="numOfMessage">{{ smsCount }} 則</div>
                    <div class="point">{{ smsPoint }} 點</div>
                </div>
                <div class="storeCommonMessage">
                    <p>儲存至常用簡訊</p>
                </div>
            </div>
            <TimeSetting optionType="sms"></TimeSetting>
        </div>
        <div class="smsSetting">
            <OptionSetting
                :nextPageRouter="nextPageRouter"
                :demoContent="demoContent"
                @excelFile="excelFile"
                optionType="sms"
            ></OptionSetting>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "SMSSend",
    inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { NConfigProvider, NInput, NSpace, NDivider, NSelect } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import TimeSetting from "@/components/backend/TimeSetting.vue";
import OptionSetting from "@/components/backend/OptionSetting.vue";
import { useSmsStore } from "@/store/smsStore";
import { useApiStore } from "@/store/api";
//api store
const apiStore = useApiStore();
const { eventList } = storeToRefs(apiStore);

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
    smsExcelFile,
} = storeToRefs(smsStore);

//router 設置

const route = useRoute();
const params = route.params;

// const filterChannelList = computed(() => {
//     let arr = eventList.value.filter(item => item.status === 0).map((list:any)=>label:`${list.name}`,)
//     return arr;
// });
const filterChannelList = ref([]);
watchEffect(() => {
    filterChannelList.value = eventList.value.filter((item: any) => {
        return item.status === 0;
    });

    filterChannelList.value = filterChannelList.value.map((item: any) => ({
        label: `${item.name}`,
        value: parseInt(`${item.eventID}`),
    }));
});

//接收optionsetting組件傳來的excel檔
const excelFile = (value: any) => {
    smsExcelFile.value = value;
};

//textarea dom元素
const inputInstRef = ref(null);
const errorMsg = ref("");

//簡訊主旨,內容v-model
const demoContent =
    "輸入簡訊內容\n\n說明：\n１.支援『長簡訊』之發送,每則簡訊字數最多可達333（中文）字。\n２.超過333字仍可發送,系統將自動進行拆則。\n３.為使簡訊內容正常呈現於手機中,請勿在簡訊內容中填入~．^)|1>等特殊符號。";

onMounted(() => {
    if (smsContent.value === "") {
        smsContent.value = demoContent;
    }
});

// textarea 預設文字
const focusType = (e: any) => {
    if (smsContent.value === demoContent || smsContent.value.includes("~ ` ^ { } [ ] | < >")) {
        smsContent.value = "";
    } else {
        smsContent.value = e.target.value;
    }
};
const blurJudge = (e: any) => {
    if (smsContent.value === "") {
        smsContent.value = demoContent;
    } else {
        smsContent.value = e.target.value;
    }
};
// == 檢查是否有中文 ....
const editsend_hasChinese = (str: string) => {
    if (str.length > 0) {
        for (var i = 0; i < str.length; i++) {
            console.log("str:", str.charCodeAt(i) > 127);

            if (str.charCodeAt(i) > 127) {
                return true;
            }
        }
    }
    return false;
};

/*檢查發送內容是否有無法輸入字元*/
const isPureEnglishCheck = (str: string) => {
    /*
                含全形字元時
                這是發送測試~`^{}[]|\\
                純英文時候 ~=- `=@ ^=  {=(
                }=)
                [=<
                ]=>
                |=/
                /=/
	        */
    var isOk = true;
    var checkCharArray = ["`", "^"];
    var checkCharArrayLength = checkCharArray.length;
    var strLength = str.length;
    for (var i = 0; i < checkCharArrayLength; i++) {
        for (var j = 0; j < strLength; j++) {
            if (checkCharArray[i] == str.charAt(j)) {
                isOk = false;
            }
        }
    }
    return isOk;
};

const wordCount = () => {
    const hasCh = editsend_hasChinese(smsContent.value);
    let tempCharge = 0;
    let remainder = 0;
    smsWord.value = smsContent.value.length;
    if (smsContent.value === demoContent) {
        smsContent.value = "";
    }

    if (hasCh) {
        //有中文字判斷點數
        if (smsWord.value > 333) {
            tempCharge = Math.floor(smsWord.value / 333);
            remainder = smsWord.value - tempCharge * 333;
            if (remainder <= 70) {
                smsPoint.value = tempCharge * 5 + 1;
            } else {
                smsPoint.value = tempCharge * 5 + Math.ceil(remainder / 67);
            }
        } else if (smsWord.value <= 333 && smsWord.value > 70) {
            smsPoint.value = Math.ceil(smsWord.value / 67);
        } else if (smsWord.value <= 70 && smsWord.value > 0) {
            smsPoint.value = 1;
        } else {
            smsPoint.value = 0;
        }
        //有中文字判斷則數
        if (smsWord.value > 333) {
            if (smsWord.value <= 656) {
                smsCount.value = 2;
            } else {
                var length = smsWord.value - 656;
                smsCount.value = 2 + Math.ceil(length / 328);
            }
        } else if (smsWord.value <= 333 && smsWord.value > 0) {
            smsCount.value = 1;
        } else {
            smsCount.value = 0;
        }
    } else if (isPureEnglishCheck(smsContent.value)) {
        errorMsg.value = "純英文發送內容時不可有`^";
        // console.log("純英文發送內容時不可有`^");
        //純英數判斷點數
        if (smsWord.value > 765) {
            tempCharge = Math.floor(smsWord.value / 765);
            remainder = smsWord.value - tempCharge * 765;
            if (remainder <= 160) {
                smsPoint.value = tempCharge * 5 + 1;
            } else {
                smsPoint.value = tempCharge * 5 + Math.ceil(remainder / 153);
            }
        } else if (smsWord.value <= 765 && smsWord.value > 160) {
            smsPoint.value = Math.ceil(smsWord.value / 153);
            console.log("smsPoint.value", smsWord.value);
        } else if (smsWord.value <= 160 && smsWord.value > 0) {
            smsPoint.value = 1;
        } else {
            smsPoint.value = 0;
        }
        // if (editsend_messageLength > 765) {
        //     var tempCharge = Math.floor(editsend_messageLength / 765);
        //     var remainder = editsend_messageLength - (tempCharge * 765);
        //     if (remainder <= 160) {
        //         editsend_messageCost = tempCharge * 5 + 1;
        //     } else {
        //         editsend_messageCost = tempCharge * 5 + Math.ceil(remainder / 153);
        //     }
        // } else if (editsend_messageLength <= 160) {
        //     editsend_messageCost = 1;
        // } else {
        //     editsend_messageCost = Math.ceil(editsend_messageLength / 153);
        // }
        //純英數計算長簡訊的發送則數
        if (smsWord.value > 765) {
            if (smsWord.value <= 1520) {
                smsCount.value = 2;
            } else {
                let length: number = smsWord.value - 1520;
                smsCount.value = 2 + Math.ceil(length / 760);
            }
        } else if (smsWord.value <= 765 && smsWord.value > 0) {
            smsCount.value = 1;
        } else {
            smsCount.value = 0;
        }
        // if (editsend_messageLength > 765) {
        //     if (editsend_messageLength <= 1520) {
        //         editsend_messageNum = 2;
        //     } else {
        //         var length = editsend_messageLength - 1520;
        //         editsend_messageNum = 2 + Math.ceil(length / 760);
        //     }
        // } else {
        //     editsend_messageNum = 1;
        // }
    }
};

//下一頁按鈕
const nextPageRouter = `/manage/${params.id}/SMSSendPage2`;

//更改naive-ui主題
const themeOverrides = {
    common: {},
    Input: {
        border: "1px solid #8b8b8b ",
        borderRadius: "4px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
};

watchEffect(() => {
    smsWord.value;
});
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.SMSSend {
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }
}
.mmsImgUpload {
    & .n-upload-file-list {
        display: none;
    }
}
.selectChannel {
    .n-base-selection {
        --border: 1px solid #8b8b8b !important;
        --border-active: 1px solid #8b8b8b !important;
        --border-focus: 1px solid #8b8b8b !important;
        --border-hover: 1px solid #e4e4e4 !important;
        --border-radius: 4px !important;
        --box-shadow-active: none !important;
        --box-shadow-focus: none !important;
        --caret-color: #3e3e3e !important;
        --option-text-color-active: #ffb400 !important;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.SMSSend {
    position: relative;
    display: flex;
    height: calc(100% - 80px);
    background-color: $bg;
    padding: 15px;
    .smsContent {
        background-color: $white;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        overflow-y: auto;
        h2 {
            @extend %h2;
            color: $gray-1;
            font-family: $font-family;
        }
        .smsChannel {
            h3 {
                font-size: 14px;
                font-weight: 400;
                color: $gray-1;
                font-family: $font-family;
                margin-bottom: 15px;
            }
        }
        .smsSubject {
            margin-top: 30px;
            margin-bottom: 30px;
            .subject {
                display: flex;
                margin-bottom: 15px;
                h3 {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    margin-top: 5px;
                    margin-right: 10px;
                    display: inline-block;
                    min-width: 56px;
                }
                p {
                    font-size: 12px;
                    font-weight: 400;
                    color: $gray-3;
                    font-family: $font-family;
                    line-height: 1.6;
                }
            }
        }
        .smsSendContent {
            .contentTitle {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                h3 {
                    font-size: 14px;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
                .commonMessage {
                    width: 72px;
                    height: 25px;
                    line-height: 25px;
                    background-color: $primary-1;
                    border-radius: 12.5px;
                    color: $white;
                    font-size: 12px;
                    font-weight: 400;
                    font-family: $font-family;
                    text-align: center;
                    cursor: pointer;
                }
                .n-input {
                    font-size: 12px;
                }
            }
        }
        .messageCount {
            margin-top: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .messageInfo {
                display: flex;
                justify-content: space-around;
                width: 330px;
                .wordCount {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .numOfMessage {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .point {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .storeCommonMessage {
                width: 100px;
                height: 25px;
                line-height: 25px;
                background-color: $primary-1;
                border-radius: 12.5px;
                text-align: center;
                cursor: pointer;
                p {
                    color: $white;
                    font-size: 12px;
                    font-weight: 400;
                    font-family: $font-family;
                }
            }
        }
    }
    .smsSetting {
        background-color: #fff;
        margin-left: 15px;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
    }
}
</style>
