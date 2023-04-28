<template>
    <teleport to="body" v-if="filePreviewModal">
        <div class="mask">
            <div class="filePreviewArea">
                <div class="closeBtn" @[events].stop="filePreviewModal = false">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <iframe
                    v-if="fileFormat === 'OFFICE'"
                    :src="`https://view.officeapps.live.com/op/embed.aspx?src=${config.serverUrl}/file/${route.params.eventKey}/${fileid}`"
                >
                </iframe>
                <div class="pdfArea" v-if="fileFormat === 'PDF'">
                    <pdf
                        class="pdf"
                        v-for="page in numPages"
                        :key="page"
                        :page="page"
                        :src="`${config.serverUrl}/file/${route.params.eventKey}/${fileid}`"
                    >
                    </pdf>
                </div>
                <div v-if="fileFormat === 'TXT'">
                    <pre>{{ text }}</pre>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { NModal, NCard } from "naive-ui";
import axios from "axios";
import pdf from "vue3-pdf";
import config from "@/config/config";

import messageIcon from "@/assets/Images/common/message-round.svg";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { isMobile } from "@/util/commonUtil";
import UserInfo from "@/components/UserInfo.vue";
import closeIcon from "@/assets/Images/common/close-round.svg";

const events = ref(isMobile ? "touchend" : "click");
//route
const route = useRoute();
//model store
const modelStore = useModelStore();
const { filePreviewModal } = storeToRefs(modelStore);

// api store
const apiStore = useApiStore();
const { preViewTxtAPI } = apiStore;
const { preViewText } = storeToRefs(apiStore);

//props
const props = defineProps({
    previewFileFormat: Object,
});
const fileFormat = ref("");
const fileid = ref("");
//微軟接口支持檔案格式
const officeARR = ref([
    ".docx",
    ".docm",
    ".dotm",
    ".dotx",
    ".doc",
    ".xlsx",
    ".xlsb",
    ".xls",
    ".xlsm",
    ".pptx",
    ".ppsx",
    ".ppt",
    ".pps",
    ".pptm",
    ".potm",
    ".ppam",
    ".potx",
    ".ppsm",
]);
//PDF套件所需參數
const loadingTask = ref(null);
const numPages = ref(null);
//txt所需參數
const text = computed(() => preViewText.value);
watch(
    () => props.previewFileFormat,
    (val) => {
        console.log("要預覽之檔案格式", val);
        if (val.ExtensionName.includes("pdf")) {
            fileid.value = val.Fileid;
            fileFormat.value = "PDF";
            // console.log("檔案為PDF !!");
            loadingTask.value = pdf.createLoadingTask(
                `${config.serverUrl}/file/${route.params.eventKey}/${fileid.value}`
            );
            loadingTask.value.promise.then((pdf) => {
                numPages.value = pdf.numPages;
            });
        } else if (officeARR.value.includes(`${val.ExtensionName}`)) {
            fileid.value = val.Fileid;
            fileFormat.value = "OFFICE";
            // console.log("檔案為 微軟格式 !!");
        } else if (val.ExtensionName === ".txt") {
            fileid.value = val.Fileid;
            fileFormat.value = "TXT";
            preViewTxtAPI(route.params.eventKey, fileid.value);
        } else {
            alert("此檔案類型不支持預覽功能!!!");
        }
    }
);
</script>

<style lang="scss" scoped>
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
    // display: flex;
    // justify-content: center;
    // align-items: center;
    .filePreviewArea {
        border-radius: 4px;
        width: 90%;
        height: 90%;
        min-height: 200px;
        padding: 28px 5px 5px 5px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .closeBtn {
            display: block;
            position: absolute;
            right: 0px;
            top: 0px;
            z-index: 100;
            width: 28px;
            height: 28px;
            cursor: pointer;
            img {
                width: 100%;
            }
        }
        iframe {
            width: 100%;
            height: 100%;
        }
        .pdfArea {
            width: 100%;
            height: 100%;
            overflow-y: scroll;
        }
    }
}
</style>
