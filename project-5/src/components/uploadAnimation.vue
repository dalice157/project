<template>
    <teleport to="body" v-if="uploadAnimationBoolean">
        <div class="mask">
            <div class="uploadAnimation animate__animated animate__bounce animate__infinite">
                <cloud-upload-outline />
                上傳中...
            </div>
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { CloudUploadOutline } from "@vicons/ionicons5";
import { useModelStore } from "@/store/model";
import { storeToRefs } from "pinia";

//modal store
const modelStore = useModelStore();
const { uploadAnimationBoolean } = storeToRefs(modelStore);
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
    display: flex;
    justify-content: center;
    align-items: center;
    .uploadAnimation {
        width: 100px;
        height: 100px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: $primary-1;
    }
}
</style>
