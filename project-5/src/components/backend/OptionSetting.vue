<template>
    <div class="optionSetting">
        <div class="selectSetting">
            <h2>收訊人選取設定</h2>
            <n-divider></n-divider>
            <n-tabs class="setting" type="card" @update-value="onChange">
                <n-tab-pane name="automatic" tab="載入大量名單">
                    <div class="downloadList">
                        <div class="downloadArea">
                            <img
                                src="../../assets/Images/manage/delete.svg"
                                alt=""
                                v-if="uploadRef !== null"
                                @click="uploadRef = null"
                            />
                            <div class="downloadFile">
                                <n-upload ref="upload" @change="handleChange" accept=".xlsx,xls">
                                    <div class="downloadImg">
                                        <img src="../../assets/Images/common/file.svg" alt="#" />
                                    </div>
                                </n-upload>
                                <div class="downloadText">
                                    <a
                                        v-if="uploadRef === null"
                                        target="_blank"
                                        :href="`${config.fileUrl}/fls/一般大量發送範例檔.xlsx`"
                                    >
                                        <h2>下載一般大量發送範例檔</h2>
                                    </a>
                                    <h2 v-else>已上傳成功</h2>
                                    <h3 v-if="uploadRef === null">範例檔編輯完成直接上傳</h3>
                                    <p v-else>{{ fileName }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="downloadDirections" v-if="uploadRef === null">
                            <h4>【範例檔編輯說明】</h4>
                            <p>
                                1.
                                請先下載一般大量發送範例檔，將欲發送之相關資料填具於一般大量發送範例檔之各相對欄位中。
                            </p>
                            <p>
                                2.
                                Excel檔製作完成，欲儲存檔案時，請選擇Excel2003版本以上之（".xlsx"或".xls"）檔案類型儲存之。
                            </p>
                            <p>
                                3.
                                範例檔第一列的四個資料欄位（姓名/手機門號/電子郵件/傳送日期）為固定欄位，請勿任意更動其順序或刪除。
                            </p>
                            <p>
                                4.
                                匯入一般大量發送範例檔時本系統只讀取第一分頁(發送清單)中之發送資料，不會選取分頁(發送範例檔)之資料。
                            </p>
                            <h4>【注意】</h4>
                            <p>
                                大量簡訊發送前請詳讀服務條款
                                <span @click="termsPopUp = !termsPopUp">檢視</span> 及操作說明
                                <a
                                    href="https://tw.e8d.tw/every8d30/Document/%E4%BA%92%E5%8B%95%E8%B3%87%E9%80%9A%E4%BC%81%E6%A5%AD%E5%95%86%E5%8B%99%E9%9B%99%E5%90%91%E7%B0%A1%E8%A8%8A%E5%B9%B3%E5%8F%B0%E6%93%8D%E4%BD%9C%E8%AA%AA%E6%98%8E.pdf"
                                    target="_blank"
                                >
                                    <span>下載</span> 。
                                </a>
                            </p>
                        </div>
                        <div class="nameList" v-else>
                            <div>
                                <p>
                                    有效名單&ensp;:&ensp;<span>{{
                                        uploadRef.valid ? uploadRef.valid.length : 0
                                    }}</span
                                    >&ensp;筆
                                </p>
                                <p>
                                    無效名單&ensp;:&ensp;<span>{{
                                        uploadRef.invalid ? uploadRef.invalid.length : 0
                                    }}</span
                                    >&ensp;筆
                                </p>
                            </div>
                            <img
                                src="../../assets/Images/manage/edit-round.svg"
                                @click="invalidPopUp = !invalidPopUp"
                            />
                        </div>
                        <div class="nextPage" @click="nextPageList" v-show="uploadRef !== null">
                            <p>下一步</p>
                        </div>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="manual" tab="手動輸入">
                    <div class="manual">
                        <div class="manualTypeArea">
                            <n-config-provider :theme-overrides="themeOverrides">
                                <n-input
                                    v-model:value.trim="phoneNumberList"
                                    type="textarea"
                                    placeholder="請輸入手機號碼"
                                    :autosize="{
                                        minRows: 4,
                                    }"
                                />
                            </n-config-provider>
                            <div class="manualMsgCount">
                                <p>共{{ phoneArray.length }}筆</p>
                            </div>
                        </div>
                        <div class="manualDirections">
                            <h4>【手動輸入說明】</h4>
                            <p>1. 請直接於將收訊人手機號碼輸入於上方輸入欄位中。</p>
                            <p>2. 亦可將Excel中同一欄位資料複製貼入於網頁手機號碼輸入欄位中。</p>
                            <p>
                                3. 台灣地區號碼輸入範例:0912345678<br />&emsp;國際地區(含大陸地區):+8612345678。
                            </p>
                            <p>4. 多筆請以半形逗點","分隔:0912345678,0912345679,.........</p>
                        </div>
                    </div>
                    <div class="nextPage" @click="nextPageManual" v-show="phoneNumberList !== ''">
                        <p>下一步</p>
                    </div>
                </n-tab-pane>
            </n-tabs>
        </div>
    </div>
    <!-- 簡訊服務條款 -->
    <teleport to="body">
        <div class="mask" v-show="termsPopUp">
            <div class="popUp">
                <div class="popUpTitle">
                    <h2>簡訊服務條款</h2>
                    <img
                        src="../../assets/Images/chatroom/close-round.svg"
                        alt="#"
                        @click="termsPopUp = !termsPopUp"
                    />
                </div>
                <p>
                    1.&emsp;
                    您登記於本企業多功能訊息平台之手機門號，使用本訊息平台傳送文字訊息，單純只付費給本公司，您的電信業者是不會再次跟您<br />&emsp;&emsp;收取任何文字訊息費用，請安心使用。<br />
                    2.&emsp;
                    傳送文字訊息至台灣地區之行動電話門號，單則文字訊息:純英文半形文字160字、中文或中英文混合70字以內，即需扣除文字訊息<br />&emsp;&emsp;額度一點。文字訊息內容超過70字時亦可傳送，本系統將自動以長文字文字訊息方式發送，單則文字訊息最大可達333中文字(或中<br />&emsp;&emsp;英混合)，單則文字訊息實際所需扣除點數請以操作面版上實際計算之扣點資訊為主。<br />
                    3.&emsp;
                    傳送文字訊息至非台灣地區(+886)之行動電話門號，純英文半形文字160字；中文或中英文混合70字以內，則需扣除文字訊息額度<br />&emsp;&emsp;三點。<br />
                    4.&emsp; 傳送文字訊息內容若為純英文半形文字時，請勿填入特殊字元如下：~ ` ^ { } [
                    ] | \以免造成訊息顯示異常。<br />
                    5.&emsp;
                    傳送文字訊息至非台灣地區(+886)之行動電話門號，系統將自動拆則以單則文字訊息發送。<br />
                    6.&emsp;
                    若您於文字訊息平台功能列點選參數文字訊息發送時，操作面版上之點數計算規則為不含參數值之文案總字數，單則文字訊息實際<br />&emsp;&emsp;計費字數需再加上參數值之字數總合為實際計費字數。<br />
                    7.&emsp;
                    文字訊息送出後，除了號碼格式錯誤之外，其餘狀態，無論手機是否收到文字訊息，均會立即扣點，請務必小心操作傳送文字訊<br />&emsp;&emsp;息。<br />
                    8.&emsp; 文字訊息的發送時間若設定為預約時，傳送設定完成即同步扣除所需點數。<br />
                    9.&emsp; 文字訊息的發送時間若設定為預約時，將無法提供E-mail同步發送之服務。<br />
                    10.&ensp; 因操作設定不當或手機號碼輸入錯誤者，已扣款點數恕不負責。<br />
                    11.&ensp;
                    使用預約發送訊息功能時，若欲取消發送，最晚請於「預約發送時間前10分鐘」於系統中”SMS預約訊息維護”功能項中刪除預約發<br />&emsp;&emsp;送批次，若超過上述時間限制平台無法提供刪除預約訊息之服務。<br />
                    12.&ensp;
                    乙方應盡力維持訊息平台服務穩定性；基於雙方網路系統皆為向電信公司租用之線路，乙方不對網際網路傳輸之系統穩定性負任何<br />&emsp;&emsp;擔保責任。<br />
                    13.&ensp;
                    基於訊息傳送係經由各訊息中心傳送，乙方不對訊息送達與否負擔保責任；惟乙方應盡善良管理人之義務，確保訊息傳遞過程之順<br />&emsp;&emsp;暢及訊息中心回報更新之正確。
                </p>
                <div class="popUpConfirm" @click="termsPopUp = !termsPopUp">確定</div>
            </div>
        </div>
    </teleport>
    <!-- 無效名單 -->
    <teleport to="body">
        <div class="mask" v-show="invalidPopUp">
            <div class="invalidList">
                <div class="popUpTitle">
                    <h2>無效名單</h2>
                    <img
                        src="../../assets/Images/chatroom/close-round.svg"
                        alt="#"
                        @click="invalidPopUp = !invalidPopUp"
                    />
                </div>
                <div class="invalidFunctionBar">
                    <n-input
                        class="invalidSearch"
                        v-model:value="search"
                        type="text"
                        placeholder="搜尋"
                    >
                        <template #prefix>
                            <img src="@/assets/Images/manage/search.svg" />
                        </template>
                    </n-input>
                    <!-- <div class="invalidCancel">匯出</div> -->
                    <div class="invalidConfirm">確定</div>
                </div>
                <div class="invalidTable">
                    <n-data-table
                        class="sms_table"
                        :bordered="false"
                        :scroll-x="840"
                        :columns="createColumns"
                        :data="data"
                        :pagination="pagination"
                        :bottom-bordered="false"
                    />
                </div>
            </div>
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { ref, watch, computed, watchEffect } from "vue";
import { NConfigProvider } from "naive-ui";
import { NTabs, NTabPane, NInput, NButton, NIcon, NDivider, NUpload, NDataTable } from "naive-ui";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { useApiStore } from "@/store/api";
import config from "@/config/config";
import { isphone } from "@/util/commonUtil";

//smsStore
const smsStore = useSmsStore();
const {
    smsChannel,
    smsContent,
    smsSendOption,
    smsSendTimeStamp,
    smsPhoneArray,
    smsPhoneString,
    smsTabsType,
    smsExcelFile,
    smsCacheComponent,
} = storeToRefs(smsStore);

//mmsStore
const mmsStore = useMmsStore();
const {
    mmsChannel,
    mmsSubject,
    mmsUploadImgRef,
    mmsContent,
    mmsSendOption,
    mmsSendTimeStamp,
    mmsPhoneArray,
    mmsPhoneString,
    mmsTabsType,
    mmsKB,
    mmsExcelFile,
    mmsCacheComponent,
} = storeToRefs(mmsStore);

const apiStore = useApiStore();
const { excelVerification } = apiStore;
const { uploadRef, invalidList } = storeToRefs(apiStore);
//props
const props = defineProps({
    nextPageRouter: String,
    demoContent: String,
    optionType: String,
});

const onChange = (value) => {
    if (props.optionType === "sms") {
        smsTabsType.value = value;
    } else {
        mmsTabsType.value = value;
    }
};

//下一頁
const router = useRouter();
const nextPageList = () => {
    const smsValidate = () => {
        if (
            !smsChannel.value ||
            !smsContent.value ||
            smsContent.value === props.demoContent ||
            (smsSendOption.value !== 0 && !smsSendTimeStamp.value)
        ) {
            alert("仍有必填欄位尚未填寫!!");
            return;
        }
        smsCacheComponent.value.push("SMSSend");
        router.push(props.nextPageRouter);
    };
    const mmsValidate = () => {
        if (
            !mmsChannel.value ||
            !mmsSubject.value ||
            !mmsUploadImgRef.value ||
            !mmsContent.value ||
            mmsContent.value === props.demoContent ||
            (mmsSendOption.value !== 0 && !mmsSendTimeStamp.value)
        ) {
            alert("仍有必填欄位尚未填寫!!");
            return;
        }
        mmsCacheComponent.value.push("MMSSend");
        router.push(props.nextPageRouter);
    };
    props.optionType == "sms" && smsValidate();
    props.optionType == "mms" && mmsValidate();
};
const nextPageManual = () => {
    phoneReg.value = phoneArray.value.every(isphone);
    //檢查手機格式及必填欄位 有誤跳彈窗
    const smsValidate = () => {
        if (
            !smsChannel.value ||
            !smsContent.value ||
            smsContent.value === props.demoContent ||
            (smsSendOption.value !== 0 && !smsSendTimeStamp.value)
        ) {
            alert("仍有必填欄位尚未填寫!!");
            return;
        }
        if (phoneReg.value === false) {
            alert("手機號碼格式有誤");
            return;
        }
        smsPhoneString.value = phoneNumberList.value;
        smsCacheComponent.value.push("SMSSend");
        router.push(props.nextPageRouter);
    };
    const mmsValidate = () => {
        if (
            !mmsChannel.value ||
            !mmsSubject.value ||
            !mmsUploadImgRef.value ||
            !mmsContent.value ||
            mmsContent.value === props.demoContent ||
            (mmsSendOption.value !== 0 && !mmsSendTimeStamp.value)
        ) {
            alert("仍有必填欄位尚未填寫!!");
            return;
        }
        if (mmsKB.value > 300) {
            alert("請將圖文訊息調整至小於300KB！!");
            return;
        }
        if (phoneReg.value === false) {
            alert("手機號碼格式有誤");
            return;
        }

        mmsPhoneString.value = phoneNumberList.value;
        mmsCacheComponent.value.push("MMSSend");
        router.push(props.nextPageRouter);
    };

    props.optionType == "sms" && smsValidate();
    props.optionType == "mms" && mmsValidate();
};
//手動輸入textarea v-model
const phoneNumberList = ref("");
const phoneReg = ref(false);
let phoneArray = ref([]);
watch(phoneNumberList, () => {
    if (phoneNumberList.value === "") {
        phoneArray.value = [];
    } else {
        phoneArray.value = phoneNumberList.value.split(",");
        if (props.optionType == "sms") {
            smsPhoneArray.value = phoneArray.value;
        } else {
            mmsPhoneArray.value = phoneArray.value;
        }
    }
});

//excel 上傳功能
const fileName: any = ref("");
const handleChange = (e) => {
    fileName.value = e.file.file.name;
    excelVerification(e.file.file);
};

//簡訊服務條款popup
const termsPopUp = ref(false);
//無效名單popup
const invalidPopUp = ref(false);
//無效名單搜尋v-model
const search = ref("");
//dataTable
const createColumns = [
    {
        title: "資料編號",
        key: "sn",
        align: "center",
    },
    {
        title: "姓名",
        key: "name",
        align: "center",
    },
    {
        title: "收訊門號",
        key: "mobile",
        align: "center",
    },
    {
        title: "狀態",
        key: "msg",
        align: "center",
    },
] as any;

//無效資料
const data: any = computed(() => {
    if (search.value.match(/^\+?\d+$/)) {
        return invalidList.value
            .map((item) => {
                return {
                    ...item,
                    sn: item.sn + 1,
                };
            })
            .filter((item) =>
                item.mobile.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
            );
    } else {
        return invalidList.value
            .map((item) => {
                return {
                    ...item,
                    sn: item.sn + 1,
                };
            })
            .filter((item) =>
                item.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
            );
    }
});

const pagination = {
    pageSize: 9,
};
//更改naive-ui主題
const themeOverrides = {
    common: {},
    Input: {
        border: "1px solid #8b8b8b",
        borderRadius: "4px 4px 4px 4px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
    Button: {
        textColorHover: "none",
        textColorFocus: "none",
        textColorPressed: "none",
        border: "none",
        borderHover: "none",
        borderFocus: "none",
        borderPressed: "none",
        rippleColor: "none",
    },
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        width: 900px;
        height: 658px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .popUpTitle {
            position: relative;
            h2 {
                text-align: center;
                margin-bottom: 60px;
                font-size: 16px;
                font-weight: 500;
                color: $gray-1;
            }
            img {
                position: absolute;
                right: 0;
                top: 0;
                cursor: pointer;
            }
        }
        p {
            line-height: 1.4;
            font-family: $font-family;
            font-size: 14px;
            font-weight: 400;
            color: $gray-1;
            margin-bottom: 60px;
        }
        .popUpConfirm {
            width: 100px;
            height: 36px;
            margin: 0 auto;
            background-color: $gray-1;
            line-height: 36px;
            color: $white;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
        }
    }
}
.mask {
    .invalidList {
        width: 900px;
        height: 700px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .popUpTitle {
        position: relative;
        h2 {
            text-align: center;
            margin-bottom: 60px;
            font-size: 16px;
            font-weight: 500;
            color: $gray-1;
        }
        img {
            position: absolute;
            right: 0;
            top: 0;
            width: 32px;
            height: 32px;
            cursor: pointer;
        }
    }
    .invalidFunctionBar {
        display: flex;
        margin-bottom: 15px;
        .invalidSearch {
            width: 700px;
            border-radius: 20px;
            box-shadow: 1px 2px 4px 0 $gray-6;
            &.n-input .n-input__border,
            &.n-input .n-input__state-border {
                border: 1px solid $border-line;
            }
            &.n-input:not(.n-input--disabled):hover .n-input__state-border {
                border: none;
            }
            &.n-input:not(.n-input--disabled).n-input--focus {
                background-color: none;
            }
            &.n-input:not(.n-input--disabled).n-input--focus .n-input__state-border {
                border: none;
                box-shadow: none;
            }
            &.n-input .n-input__input-el,
            &.n-input .n-input__textarea-el {
                caret-color: $gray-2;
            }
        }
        .invalidCancel {
            width: 100px;
            height: 36px;
            background-color: $white;
            line-height: 36px;
            color: $gray-1;
            border: 1px solid $gray-1;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
        .invalidConfirm {
            width: 100px;
            height: 36px;
            background-color: $gray-1;
            line-height: 36px;
            color: $white;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
    }
}
.downloadFile {
    .n-upload {
        width: 80px;
        margin-right: 30px;
    }
    .n-upload-file-list {
        display: none;
    }
    .n-upload-trigger {
        width: 80px;
        border-radius: 50%;
    }
}

.optionSetting {
    background-color: $white;
    width: 100%;
    border-radius: 4px;
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .selectSetting {
        h2 {
            @extend %h2;
            color: $gray-1;
            font-family: $font-family;
        }

        .nextPage {
            width: 170px;
            height: 36px;
            line-height: 36px;
            margin: auto;
            text-align: center;
            background-color: $gray-1;
            border-radius: 18px;
            cursor: pointer;
            margin-top: 50px;
            p {
                display: inline;
                font-size: 14px;
                font-weight: 400;
                font-family: $font-family;
                color: #fff;
            }
        }
        .setting {
            &.n-tabs {
                .n-tabs-tab__label {
                    font-size: $font-size-14;
                }
                .n-tabs-nav {
                    .n-tabs-tab {
                        color: $gray-3;
                        background-color: $primary-4;
                        border: none;
                        border-top-left-radius: 4px;
                        border-top-right-radius: 4px;
                        padding: 8px 20px;
                    }
                    .n-tabs-tab--active {
                        background-color: $primary-1;
                        color: #fff;
                    }
                    .n-tabs-pad {
                        border-bottom: transparent;
                    }
                }
                margin-bottom: 40px;
                .downloadList {
                    padding: 0 15px 15px;
                    .downloadArea {
                        width: 100%;
                        padding: 10px 0;
                        border-radius: 4px;
                        background-color: $white;
                        border: 1px solid $border-line;
                        display: flex;
                        align-items: center;
                        position: relative;
                        > img {
                            position: absolute;
                            right: 10px;
                            top: 10px;
                            cursor: pointer;
                        }
                        .downloadFile {
                            width: 286px;
                            display: flex;
                            align-items: center;
                            margin: 0 auto;
                            .downloadImg {
                                cursor: pointer;
                                width: 80px;
                                height: 80px;
                                border: 1px dashed $gray-3;
                                border-radius: 50%;
                                background-color: #f9f9f9;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 30px;
                                img {
                                    width: 25px;
                                    height: 25px;
                                }
                            }
                            .downloadText {
                                a {
                                    text-decoration: none;

                                    h2 {
                                        font-size: 16px;
                                        font-weight: 400;
                                        font-family: $font-family;
                                        color: $danger;
                                        margin-bottom: 5px;
                                        &:hover {
                                            text-decoration: underline;
                                        }
                                    }
                                }
                                h2 {
                                    font-size: 16px;
                                    font-weight: 400;
                                    font-family: $font-family;
                                    color: $danger;
                                    margin-bottom: 5px;
                                }
                                h3 {
                                    @extend %h3;
                                    font-family: $font-family;
                                    color: black;
                                }
                                p {
                                    font-size: $font-size-14;
                                    font-weight: 400;
                                    font-family: $font-family;
                                    color: $gray-3;
                                }
                            }
                        }
                    }
                    .downloadDirections {
                        padding: 10px;
                        h4 {
                            color: $gray-1;
                            font-size: $font-size-14;
                            font-weight: 600;
                            font-family: $font-family;
                            margin-bottom: 10px;
                            margin-top: 20px;
                        }

                        p {
                            color: $gray-1;
                            font-size: 14px;
                            font-weight: 400;
                            font-family: $font-family;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        }
                        span {
                            color: $danger;
                            cursor: pointer;
                            text-decoration: underline;
                        }
                        a {
                            text-decoration: none;
                        }
                    }
                    .nameList {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 20px;
                        > div {
                            display: flex;
                            align-items: center;

                            > p {
                                span {
                                    // text-decoration: underline;
                                    // cursor: pointer;
                                }
                            }
                            p + p {
                                margin-left: 30px;
                                span {
                                    // text-decoration: underline;
                                    color: $danger;
                                    // cursor: pointer;
                                }
                            }
                        }
                        img {
                            cursor: pointer;
                        }
                    }
                }
                .manual {
                    padding: 10px;
                    .manualTypeArea {
                        margin-bottom: 60px;
                        .n-input {
                            width: 100%;
                            margin-bottom: 10px;
                        }
                        .manualMsgCount {
                            color: $danger;
                        }
                    }
                    .manualDirections {
                        h4 {
                            color: $gray-1;
                            font-size: 14px;
                            font-weight: 400;
                            margin-top: 5px;
                            margin-bottom: 15px;
                        }
                        p {
                            line-height: 1.4;
                            margin-bottom: 10px;
                        }
                    }
                }

                .n-tab-pane {
                    width: 100%;
                    background-color: $gray-8;

                    border-radius: 0px 4px 4px 4px;
                }
            }
        }
    }

    .nextPage {
        width: 170px;
        height: 36px;
        line-height: 36px;
        margin: auto;
        text-align: center;
        background-color: $gray-1;
        border-radius: 18px;
        cursor: pointer;
        margin-top: 50px;
        p {
            display: inline;
            font-size: 14px;
            font-weight: 400;
            font-family: $font-family;
            color: #fff;
        }
    }
}
</style>
