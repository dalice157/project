<template>
    <div class="MMSSend">
        <div class="mmsContent">
            <h2>輸入多媒體訊息內容</h2>
            <n-divider></n-divider>
            <div class="mmsChannel">
                <h3>發送頻道</h3>
                <n-select
                    class="selectChannel"
                    v-model:value="mmsChannel"
                    :options="filterChannelList"
                    placeholder="請選擇發送頻道"
                />
            </div>
            <div class="mmsSubject">
                <div class="subject">
                    <h3>訊息主旨</h3>
                    <p>
                        (「訊息主旨」內容出現於訊息內文最上方，字數限制:純英數為39字、中英數混合為15字)
                    </p>
                </div>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input
                        id="input"
                        v-model:value.trim="mmsSubject"
                        type="text"
                        placeholder="請輸入MMS訊息主旨(必填)"
                        @input="KBCount"
                    />
                </n-config-provider>
            </div>
            <div class="mmsImageInfo">
                <h3>訊息圖檔</h3>
                <n-upload
                    class="mmsImgUpload"
                    :class="{ uploadFile: mmsUploadImgRef != null }"
                    ref="uploadImg"
                    @change="handleChange($event)"
                    accept="image/*"
                >
                    圖檔上傳
                </n-upload>
                <div v-if="mmsUploadImgRef !== null" class="OnUpload">
                    <p>
                        {{ mmsUploadImgRef.name }}
                    </p>
                    <img src="@/assets/Images/manage/delete.svg" @click="clearFile" />
                </div>
                <div v-else class="notUpload">檔案名稱</div>
            </div>
            <div class="mmsSendContent">
                <div class="contentTitle">
                    <h3>發送內容</h3>
                </div>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input
                        ref="inputInstRef"
                        id="textarea"
                        v-model:value.trim="mmsContent"
                        type="textarea"
                        placeholder="請輸入簡訊內容..."
                        :autosize="{
                            minRows: 7,
                            maxRows: 7,
                        }"
                        @focus="focusType"
                        @blur="blurJudge"
                        @input="KBCount"
                    />
                </n-config-provider>
            </div>
            <div class="messageCount">
                <div class="messageInfo">
                    <div class="messageKB" v-show="mmsKB <= 300">
                        <p>{{ Math.ceil(mmsKB) }} KB</p>
                    </div>
                    <div class="messageKBWarn" v-show="mmsKB > 300">
                        <p>{{ Math.ceil(mmsKB) }} KB</p>
                    </div>
                    <div class="point">
                        <p>{{ mmsPoint }} 點</p>
                    </div>
                </div>
            </div>
            <TimeSetting optionType="mms"></TimeSetting>
        </div>
        <div class="mmsSetting">
            <OptionSetting
                :nextPageRouter="nextPageRouter"
                :demoContent="demoContent"
                @excelFile="excelFile"
                optionType="mms"
            ></OptionSetting>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "MMSSend",
    inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { NConfigProvider, NInput, NUpload, NDivider, NSelect } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import TimeSetting from "../../../components/backend/TimeSetting.vue";
import OptionSetting from "@/components/backend/OptionSetting.vue";
import { useApiStore } from "@/store/api";
import { useMmsStore } from "@/store/mmsStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();

const apiStore = useApiStore();
const { eventList } = storeToRefs(apiStore);

//mmsStore
const mmsStore = useMmsStore();
const {
    mmsChannel,
    mmsSubject,
    mmsUploadImgRef,
    mmsContent,
    mmsKB,
    mmsPoint,
    mmsSendOption,
    mmsSendTimeStamp,
    mmsSendTime,
    mmsExcelFile,
} = storeToRefs(mmsStore);

const filterChannelList = computed(() => {
    return eventList.value
        .filter((event: any) => {
            return event.status === 0;
        })
        .map((item) => ({
            label: `${item.name}`,
            value: parseInt(`${item.eventID}`),
        }));
});

//接收組件傳來的excel檔
const excelFile = (value: any) => {
    mmsExcelFile.value = value;
};

//textarea dom元素
const inputInstRef = ref(null);
const errorMsg = ref("");

//簡訊主旨,內容v-model
const demoContent =
    "輸入MMS簡訊內容\n\n說明：\n1.為使簡訊內容正常呈現於手機中,請勿在簡訊内容中填入~·^)I1>等特殊符號。\n2.訊息主旨及發送圖片為必填欄位，圖片格式僅支援 png, jpg, jpeg, gif。\n3.MMS扣點:圖檔+文案<50K→單則扣除點數3點，圖檔+文案50K~300K內→單則扣除點數5點。";

const params = route.params;

onMounted(() => {
    if (mmsContent.value === "") {
        mmsContent.value = demoContent;
    }
});

// textarea 預設文字
const focusType = (e: any) => {
    mmsContent.value =
        mmsContent.value === demoContent || mmsContent.value.includes("~·^)I1>")
            ? ""
            : e.target.value;
};
const blurJudge = (e: any) => {
    mmsContent.value = mmsContent.value === "" ? demoContent : e.target.value;
};
//計算字串Bytes數(UTF8)
const lengthInUtf8Bytes = (str) => {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);

    return str.length + (m ? m.length : 0);
};
const RoundUp = (input, num) => {
    let tmpNum = Math.floor(input);
    let _input = new Number(input);
    if (input - tmpNum <= 0 || input - Math.round(input) == 0) {
        return input;
    }
    (input * Math.pow(10, num + 1)) % 10 < 5
        ? _input.toFixed(num) + Math.pow(0.1, num)
        : _input.toFixed(num);
};

//計算主旨+內容大小(KB)
const mmsContentLen = ref(0);
const mmsSubjectLen = ref(0);
const KBCount = () => {
    mmsContentLen.value =
        mmsContent.value !== demoContent
            ? lengthInUtf8Bytes(mmsContent.value) / 1024
            : lengthInUtf8Bytes("") / 1024;
    // console.log("mmsContentLen.value", mmsContentLen.value);
    // mmsContentLen.value = Number(parseFloat(RoundUp(mmsContentLen.value, 3)).toFixed(3));
    if (mmsSubject.value) {
        mmsSubjectLen.value = lengthInUtf8Bytes(`<主旨 : ${mmsSubject.value} >`) / 1024;
        mmsSubjectLen.value = Number(parseFloat(RoundUp(mmsSubjectLen.value, 3)).toFixed(3));
    } else {
        mmsSubjectLen.value = 0;
    }
    if (
        !mmsSubject.value &&
        (mmsContent.value === demoContent || mmsContent.value === "") &&
        uploadFileSize.value === 0
    ) {
        mmsKB.value = 0;
    } else {
        mmsKB.value = mmsSubjectLen.value + mmsContentLen.value + uploadFileSize.value + 2;
        mmsKB.value = Number(
            mmsKB.value.toString().substring(0, mmsKB.value.toString().lastIndexOf(".") + 3)
        );
    }
    // console.log("MMSkb.value:", mmsKB.value);
};

//下一頁按鈕
const nextPageRouter = `/manage/${params.id}/MMSSendPage2`;
watchEffect(() => {
    //點數判斷
    if (mmsKB.value < 50 && mmsKB.value > 0) {
        mmsPoint.value = 3;
    } else if (mmsKB.value >= 50 && mmsKB.value < 300) {
        mmsPoint.value = 5;
    } else if (mmsKB.value === 0) {
        mmsPoint.value = 0;
    }
});
//上傳圖片功能
const uploadFileSize = ref(0);
const handleChange = ({ fileList }) => {
    mmsUploadImgRef.value = fileList[fileList.length - 1];
    uploadFileSize.value = Math.round((mmsUploadImgRef.value.file.size / 1024) * 100) / 100;
    mmsKB.value = mmsSubjectLen.value + mmsContentLen.value + uploadFileSize.value + 2;
    mmsKB.value = Number(
        mmsKB.value.toString().substring(0, mmsKB.value.toString().lastIndexOf(".") + 3)
    );
    // console.log("MMSkb.value:", mmsKB.value);
};
const clearFile = () => {
    mmsUploadImgRef.value = null;
    uploadFileSize.value = 0;
    mmsKB.value = mmsSubjectLen.value + mmsContentLen.value + uploadFileSize.value;
    mmsKB.value = Number(
        mmsKB.value.toString().substring(0, mmsKB.value.toString().lastIndexOf(".") + 3)
    );
    // console.log("MMSkb.value:", mmsKB.value);
};

//更改naive-ui主題
const themeOverrides = {
    common: {},
    Select: {
        border: "1px solid #000",
        borderRadius: "4px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
    Input: {
        fontSize: "18px",
        border: "1px solid #8b8b8b",
        borderRadius: "4px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        height: "40px",
        boxShadowFocus: "none",
    },
};
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
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

.MMSSend {
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }
}
.mmsImgUpload {
    display: flex;
    align-items: center;
    &.uploadFile {
        // width: calc(100% - 56px);
    }
    .n-upload-trigger {
        width: 70px;
        height: 25px;
        line-height: 25px;
        margin-right: 15px;
        margin-left: 15px;
        border-radius: 12px;
        background-color: $primary-1;
        color: $white;
        font-size: $font-size-12;
        text-align: center;
        cursor: pointer;
        padding: 0 10px;
    }
    .n-upload-file-list {
        // width: calc(100% - 100px);
        background-color: $gray-8;
        margin: 0;
        display: none;
    }
    .n-upload-file-info {
        padding: 0;
    }
    .n-upload-file-info__thumbnail {
        display: none;
    }
    .n-upload-file-info__name {
        > span {
            font-size: $font-size-14 !important;
            font-weight: 500;
        }
    }
    .n-upload-file-info__action {
        padding: 0;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.MMSSend {
    position: relative;
    display: flex;
    height: calc(100% - 80px);
    background-color: $bg;
    padding: 15px;
    .mmsContent {
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
        .mmsChannel {
            h3 {
                font-size: 14px;
                font-weight: 400;
                color: $gray-1;
                font-family: $font-family;
                margin-bottom: 15px;
            }
        }
        .mmsSubject {
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
        .mmsImageInfo {
            display: flex;
            justify-mmscontent: flex-start;
            align-items: center;
            margin-bottom: 30px;
        }
        .mmsSendContent {
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
                justify-content: flex-start;
                width: 330px;
                .messageKB {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 15px;
                }
                .messageKBWarn {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-4;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 15px;
                    p {
                        color: red;
                    }
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
    .mmsSetting {
        background-color: #fff;
        margin-left: 15px;
        padding: 25px 20px;
        width: 50%;
        border-radius: 4px;
        .nextPage {
            width: 170px;
            height: 36px;
            line-height: 36px;
            margin: auto;
            text-align: center;
            background-color: $gray-1;
            border-radius: 18px;
            cursor: pointer;
            p {
                display: inline;
                font-size: 14px;
                font-weight: 400;
                font-family: $font-family;
                color: #fff;
            }
        }
    }
    .OnUpload {
        width: calc(100% - 160px);
        background-color: $gray-8;
        padding: 10px;
        font-size: $font-size-14;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
            cursor: pointer;
        }
    }
    .notUpload {
        background-color: $gray-8;
        width: calc(100% - 160px);
        padding: 10px;
        font-size: $font-size-14;
        font-weight: 500;
    }
}
</style>
