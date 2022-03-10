<template>
    <n-layout class="bg">
        <Headers />
        <n-layout class="bg">
            <a
                class="close"
                :href="`/chat/${route.params.id}?chatroomID=${route.query.chatroomID}&mobile=${route.query.mobile}`"
            >
                <img src="../assets/Images/chatroom/close-round.svg" />
            </a>
            <div class="noPicture" v-if="pictures.length === 0">
                <p>尚未有任何相片!!!</p>
            </div>
            <div class="picture-box" v-if="pictures.length > 0 && dateArr.length > 0">
                <div v-for="(date, index) in dateArr" :key="index">
                    <div v-if="date" class="date">{{ date }}</div>
                    <div class="picture" v-if="date">
                        <div
                            class="picture-inner"
                            :class="{ hide: date !== dayjs.unix(picture.time).format('YYYY/MM') }"
                            v-for="picture in pictures"
                            :key="picture.id"
                        >
                            <div
                                class="imgEnable"
                                v-if="
                                    picture.msgType === 6 &&
                                    !picture.isExpire &&
                                    date === dayjs.unix(picture.time).format('YYYY/MM')
                                "
                                @click="previewURL(picture.format.Fileid)"
                            >
                                <img
                                    :src="`${config.fileUrl}/fls/${
                                        picture.format.Fileid
                                    }.${picture.format.ShowName.split('.').pop()}`"
                                />
                            </div>
                            <div
                                class="imgDisable"
                                v-if="
                                    picture.msgType === 6 &&
                                    picture.isExpire &&
                                    date === dayjs.unix(picture.time).format('YYYY/MM')
                                "
                            >
                                <img src="../assets/Images/gallery/pic-disabled.svg" />
                            </div>
                            <div
                                class="picture-file-enable"
                                v-if="
                                    picture.msgType === 7 &&
                                    !picture.isExpire &&
                                    date === dayjs.unix(picture.time).format('YYYY/MM')
                                "
                            >
                                <a
                                    :href="`${config.serverUrl}/v1/file/${route.params.id}/${picture.format.Fileid}`"
                                >
                                    <img src="../assets/Images/chatroom/file-fill.svg" />
                                    <n-ellipsis
                                        style="width: 90%; max-height: 80px"
                                        :line-clamp="4"
                                        :tooltip="false"
                                        class="showName"
                                    >
                                        <p>{{ picture.format.ShowName }}</p>
                                    </n-ellipsis>
                                </a>
                            </div>
                            <div
                                class="picture-file-disable"
                                v-if="
                                    picture.msgType === 7 &&
                                    picture.isExpire &&
                                    date === dayjs.unix(picture.time).format('YYYY/MM')
                                "
                            >
                                <div>
                                    <img src="../assets/Images/chatroom/file-fill.svg" />
                                    <n-ellipsis
                                        style="width: 90%; max-height: 80px"
                                        :line-clamp="4"
                                        :tooltip="false"
                                    >
                                        <p>{{ picture.format.ShowName }}</p>
                                    </n-ellipsis>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </n-layout>
    </n-layout>
</template>

<script setup lang="ts">
import { watchEffect, onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { NEllipsis, NAvatar, NLayout } from "naive-ui";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { api as viewerApi } from "v-viewer";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import config from "@/config/config";
import { currentDate, currentMonth } from "@/util/dateUtil";
import Headers from "@/components/Headers.vue";

//router
const route = useRoute();

//api store
const apiStore = useApiStore();
const { getHistoryApi } = apiStore;
const { chatroomMsg } = storeToRefs(apiStore);

getHistoryApi(route.query.chatroomID);
const pictures: any = computed(() => {
    const set = new Set();
    return chatroomMsg.value.messageList.filter((item: any) => {
        return !set.has(item.format.Fileid) && (item.msgType === 6 || item.msgType === 7)
            ? set.add(item.format.Fileid)
            : false;
    });
});

const result: any = computed(() => {
    return pictures.value.map((pic: any, index: any) => {
        if (dayjs().isAfter(dayjs.unix(pic.format.expirationDate))) {
            // 判斷是否到失效日期
            pic.isExpire = true;
        } else {
            pic.isExpire = false;
        }
        if (
            index === 0 ||
            (index > 0 &&
                dayjs.unix(pic.time).format("YYYY/MM") !==
                    dayjs.unix(pictures.value[index - 1].time).format("YYYY/MM"))
        ) {
            return dayjs.unix(pic.time).format("YYYY/MM");
        }
    });
});

const dateArr: any = computed(() => {
    return result.value
        .filter((element: any, index: any, arr: any) => arr.indexOf(element) === index)
        .sort()
        .reverse();
});

// 圖片展示
const viewImgs: any = ref([]);
const previewURL = (fileid: string): void => {
    // console.log("pictures.value:", pictures.value);

    pictures.value.forEach((img: any) => {
        if (
            !viewImgs.value.includes(
                `${config.fileUrl}/fls/${img.format.Fileid}.${img.format.ShowName.split(".").pop()}`
            ) &&
            img.msgType === 6 &&
            !img.isExpire
        ) {
            viewImgs.value.push(
                `${config.fileUrl}/fls/${img.format.Fileid}.${img.format.ShowName.split(".").pop()}`
            );
        }
    });
    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[4].split(".")[0]))
        .indexOf(fileid);
    viewerApi({
        options: {
            initialViewIndex: viewIndex,
            movable: false,
            scalable: false,
            className: "v-wrap",
            viewed(e) {
                const fileName = e.detail.originalImage.currentSrc.split("/").pop();
                const fileId = fileName.substring(0, fileName.lastIndexOf("."));
                const wrap = document.getElementsByClassName("v-wrap");
                const div = document.createElement("div");
                const a = document.createElement("a");
                a.href = `${config.serverUrl}/v1/file/${fileId}`;
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
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";

.bg {
    height: calc(100% - 80px);
}
.date {
    font-size: $font-size-18;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 8px;
}
.picture-box {
    width: 95%;
    height: calc(100% - 80px);
    display: block;
    margin: 0px auto 0;
    overflow-y: auto;
    box-sizing: border-box;
    .picture {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        justify-items: center;
        .picture-inner {
            width: 112px;
            height: 112px;
            margin: 8px auto;
            &.hide {
                display: none;
            }
            .imgEnable {
                cursor: pointer;
                width: 100%;
                height: 100%;
                background-color: $primary-4;
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
            .imgDisable {
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
            .picture-file-enable {
                width: 112px;
                height: 112px;
                background-color: $primary-4;
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
            .picture-file-disable {
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
    }
}
.noPicture {
    height: calc(100vh - 60px);
    p {
        padding-top: 15%;
        font-size: $font-size-20;
        text-align: center;
    }
}
.close {
    position: absolute;
    top: 15px;
    right: 1em;
}
</style>
