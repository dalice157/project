<template>
    <div v-if="eventInfo !== null" class="gallery">
        <div class="gallery__header">
            <div class="gallery__title">
                <h1 class="name">
                    <n-avatar
                        round
                        class="avatar"
                        :size="42"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${config.fileUrl}${eventInfo.icon}`"
                    />
                    {{ eventInfo.name }}
                </h1>

                <a class="close" @[events]="goToChat">
                    <img :src="closeIcon" />
                </a>
            </div>
        </div>
        <div class="gallery__picture">
            <div v-for="(pics, index) in picArr" :key="index">
                <div class="date">
                    {{ dayjs(pics[0].janusMsg.config.currentDate).format("YYYY/MM") }}
                </div>
                <div class="picture">
                    <div
                        class="picture__inner"
                        v-for="picture in pics"
                        :key="picture.janusMsg.config.id"
                    >
                        <div
                            class="img--enable"
                            v-if="
                                picture.janusMsg.msgType === 6 && !picture.janusMsg.config.isExpire
                            "
                            @[events]="previewURL(picture.janusMsg.format.Fileid)"
                        >
                            <img
                                :src="`${config.fileUrl}${picture.janusMsg.format.Fileid}${picture.janusMsg.format.ExtensionName}`"
                            />
                        </div>
                        <div
                            class="img--disable"
                            v-else-if="
                                picture.janusMsg.msgType === 6 && picture.janusMsg.config.isExpire
                            "
                        >
                            <img :src="picDisabled" />
                        </div>

                        <div
                            class="picture-file--enable"
                            v-else-if="
                                picture.janusMsg.msgType === 7 && !picture.janusMsg.config.isExpire
                            "
                        >
                            <a
                                :href="`${config.serverUrl}/file/${route.params.eventKey}/${picture.janusMsg.format.Fileid}`"
                            >
                                <img :src="fileIcon" />
                                <n-ellipsis
                                    style="width: 90%; max-height: 80px"
                                    :line-clamp="4"
                                    :tooltip="false"
                                    class="showName"
                                >
                                    <p>{{ picture.janusMsg.format.ShowName }}</p>
                                </n-ellipsis>
                            </a>
                        </div>
                        <div
                            class="picture-file--disable"
                            v-else-if="
                                picture.janusMsg.msgType === 7 && picture.janusMsg.config.isExpire
                            "
                        >
                            <div>
                                <img :src="fileIcon" />
                                <n-ellipsis
                                    style="width: 90%; max-height: 80px"
                                    :line-clamp="4"
                                    :tooltip="false"
                                >
                                    <p>{{ picture.janusMsg.format.ShowName }}</p>
                                </n-ellipsis>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, computed, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { NEllipsis, NAvatar } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { api as viewerApi } from "v-viewer";
import axios from "axios";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import config from "@/config/config";
import { isProduction } from "@/util/commonUtil";
import { isMobile } from "@/util/commonUtil";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import picDisabled from "@/assets/Images/gallery/pic-disabled.svg";
import fileIcon from "@/assets/Images/chatroom/file-fill.svg";
import { signature } from "@/util/deviceUtil";

const events = ref(isMobile ? "touchend" : "click");

//chat store
const chatStore = useChatStore();
const { pictures, isOpenGallery } = storeToRefs(chatStore);

//api store
const apiStore = useApiStore();
const { getBackendApi } = apiStore;
const { eventInfo, isIllegalDevice } = storeToRefs(apiStore);

//router
const route = useRoute();
const router = useRouter();
const eventKey = computed(() => route.params.eventKey);

// const result: any = ref([]);
const dateArr: any = ref([]);
const picArr: any = ref([]);

axios({
    method: "get",
    url: `${config.serverUrl}/login/${route.params.eventKey}`,
    headers: { Authorization: `Bearer ${signature}` },
})
    .then((res: any) => {
        isIllegalDevice.value = false;
        getBackendApi(route.params.eventKey);
    })
    .catch((err: any) => {
        console.error(err);
        if (err.response.status === 401) {
            isIllegalDevice.value = true;
            return;
        }
    });

//獲取當天日期 判斷圖片及檔案是否失效
watchEffect(() => {
    pictures.value = JSON.parse(localStorage.getItem(`${eventKey.value}-pictures`) || "[]");
    pictures.value.forEach((pic: any, index: any) => {
        if (
            dayjs().isAfter(dayjs(pic.janusMsg.format.expirationDate)) &&
            !pic.janusMsg.config.isWelcomeMsg
        ) {
            pic.janusMsg.config.isExpire = true;
            localStorage.setItem(
                `${route.params.eventKey}-pictures`,
                JSON.stringify(pictures.value)
            );
        } else {
            pic.janusMsg.config.isExpire = false;
            localStorage.setItem(
                `${route.params.eventKey}-pictures`,
                JSON.stringify(pictures.value)
            );
        }
        if (
            index === 0 ||
            (index > 0 &&
                dayjs(pic.janusMsg.config.currentDate).format("YYYY/MM") !==
                    dayjs(pictures.value[index - 1].janusMsg.config.currentDate).format("YYYY/MM"))
        ) {
            // result.value.push(dayjs(pic.janusMsg.config.currentDate).format("YYYY/MM"));
        }
    });
    const set = new Set();
    dateArr.value = pictures.value.filter((pic) =>
        !set.has(dayjs(pic.janusMsg.config.currentDate).format("YYYY/MM"))
            ? set.add(dayjs(pic.janusMsg.config.currentDate).format("YYYY/MM"))
            : false
    );
    dateArr.value = dateArr.value.map((item) => {
        return {
            month: dayjs(item.janusMsg.config.currentDate).format("YYYY/MM"),
        };
    });
    dateArr.value.reverse();
    // console.log("dateArr", dateArr.value);
    picArr.value = dateArr.value.map((date) => {
        return [date];
    });
    // console.log("picArr", picArr.value);
    pictures.value.forEach((pic) => {
        picArr.value.forEach((item) => {
            if (dayjs(pic.janusMsg.config.currentDate).format("YYYY/MM") === item[0].month) {
                item.push(pic);
            }
        });
    });
    picArr.value.forEach((item) => {
        item.shift();
    });
});
//圖片展示
const getSplit = isProduction ? 3 : 4;
const viewImgs: any = ref([]);
const previewURL = (fileid: string): void => {
    pictures.value.forEach((img: any) => {
        if (
            !viewImgs.value.includes(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            ) &&
            img.janusMsg.msgType === 6 &&
            !img.janusMsg.config.isExpire
        ) {
            viewImgs.value.push(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            );
        }
    });
    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[getSplit].split(".")[0]))
        .indexOf(fileid);
    viewerApi({
        options: {
            initialViewIndex: viewIndex,
            movable: false,
            scalable: false,
            className: "v-wrap",
            viewed(e) {
                const fileName = e.detail.originalImage.currentSrc.split("/").pop();
                const wrap = document.getElementsByClassName("v-wrap");
                const div = document.createElement("div");
                const a = document.createElement("a");
                a.href = `${config.serverUrl}/file/${route.params.eventKey}/${fileid}`;
                a.target = "_blank";
                a.download = fileName;
                a.className = "download";
                a.innerHTML = `<span class="downloadImg"></span>`;
                wrap[0].appendChild(div).appendChild(a);
            },
        },
        images: viewImgs.value,
    });
};
const goToChat = () => {
    setTimeout(function () {
        router.push(`/${eventKey.value}`);
    }, 250);
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.gallery {
    grid-area: body;
    width: calc(100% - 300px);
    height: 100%;
    background-color: $white;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 300px;
    z-index: 1000;

    &__header {
        width: calc(100% - 300px);
        // width: 100%;
        height: 125px;
        background: url("~@/assets/Images/common/header-bg-pc.svg") no-repeat center top;
        background-size: cover;
        padding-top: 20px;
        position: fixed;
        right: 0;
        top: 0;
    }
    &__title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding: 0 30px;
        a {
            position: relative;
            > img {
                width: 28px;
            }
        }
        .name {
            @extend %h1;
            display: flex;
            margin: 0;
            color: $gray-1;
            align-items: center;
        }
        .avatar {
            display: inline-block;
            margin-right: 15px;
        }
    }
    &__picture {
        max-width: calc(1100px - $siderWidth);
        display: block;
        margin: 125px auto 0;
        overflow-y: auto;
        box-sizing: border-box;
    }

    .close {
        cursor: pointer;
    }
    .date {
        font-size: $font-size-18;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 8px;
    }
}
.picture {
    display: grid;
    max-width: calc(1200px - $siderWidth);
    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    justify-items: center;
    &__inner {
        width: 112px;
        height: 112px;
        margin: 8px auto;
    }
}

.picture-file {
    &--enable {
        width: 112px;
        height: 112px;
        background-color: $primary-3;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        a {
            text-decoration: none;
            padding: 5px 8px;
            display: flex;
            justify-content: space-between;
            img {
                width: 24px;
                height: 24px;
                background-color: transparent;
            }
            p {
                font-size: $font-size-12;
                font-weight: 500;
                font-family: $font-family;
                color: $gray-1;
                line-height: 1.6;
                margin-left: 4px;
                height: 100%;
                word-break: break-all;
            }
        }
    }
    &--disable {
        width: 112px;
        height: 112px;
        background-color: $gray-5;
        border-radius: 4px;
        cursor: no-drop;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
            width: 100%;
            padding: 5px 8px;
            display: flex;
            justify-content: space-between;
        }
        img {
            width: 24px;
            height: 24px;
            background-color: transparent;
        }
        p {
            font-size: $font-size-12;
            font-weight: 500;
            font-family: $font-family;
            color: $gray-1;
            line-height: 1.6;

            margin-left: 4px;
            height: 100%;
            word-break: break-all;
        }
    }
}

.img {
    &--enable {
        cursor: pointer;
        width: 100%;
        height: 100%;
        background-color: $primary-3;
        border-radius: 4px;

        /* Firefox, Chrome */
        line-height: 110px;
        white-space: nowrap;
        text-align: center;

        /* IE */
        *font-size: 100px; /* 200px * 0.9 = 180px */
        overflow: hidden;
        &:after {
            content: ".";
            font-size: 0;
            -webkit-text-size-adjust: none;
        }
        img {
            width: 100%;
            vertical-align: middle;
        }
    }
    &--disable {
        cursor: no-drop;
        width: 112px;
        height: 112px;
        background-color: $gray-5;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 32px;
            height: 32px;
        }
    }
}

@media (max-width: 768px) {
    .gallery {
        height: 100%;
        width: 100%;
        left: 0;
        &__header {
            width: 100%;
            height: 120px;
            background: url("~@/assets/Images/gallery/gallery-bg.svg") no-repeat center top;
            background-size: cover;
            padding-top: 26px;
        }
        &__title {
            display: flex;
            align-items: center;
            position: relative;
            padding: 0;
            a {
                position: absolute;
                margin-left: 15px;
                z-index: 1;
                > img {
                    width: 21px;
                }
            }
            .name {
                display: block;
                margin: 0 auto;
                font-size: $font-size-18;
                font-weight: 600;
            }
            .avatar {
                display: none;
            }
        }
        &__picture {
            width: 100%;
            display: block;
            margin: 100px auto 20px;
            overflow-y: auto;
        }

        .date {
            font-size: $font-size-16;
        }
    }
}
@media (max-width: 420px) {
    .gallery {
        &__picture {
            width: 95%;
            padding-bottom: 20px;
        }
    }
}
</style>
