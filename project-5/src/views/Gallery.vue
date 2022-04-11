<template>
    <n-layout class="bg">
        <Headers />
        <n-layout class="bg">
            <router-link
                class="close"
                :to="`/chat/${route.params.id}?chatroomID=${route.query.chatroomID}&mobile=${route.query.mobile}`"
            >
                <img :src="closeIcon" alt="關閉" />
            </router-link>
            <div class="noPicture" v-if="pictures.length === 0">
                <p>尚未有任何相片!!!</p>
            </div>
            <div class="picture-box" v-if="pictures.length > 0 && dateArr.length > 0">
                <div v-for="(pics, index) in picArr" :key="index">
                    <div class="date">
                        {{ dayjs(pics[0].janusMsg.config.currentDate).format("YYYY/MM") }}
                    </div>
                    <div class="picture">
                        <div
                            class="picture-inner"
                            v-for="picture in pics"
                            :key="picture.janusMsg.config.id"
                        >
                            <div
                                class="imgEnable"
                                v-if="
                                    picture.janusMsg.msgType === 6 &&
                                    !picture.janusMsg.config.isExpire
                                "
                                @click="previewURL(picture.janusMsg.format.Fileid)"
                            >
                                <img
                                    :src="`${config.fileUrl}${
                                        picture.janusMsg.format.Fileid
                                    }.${picture.janusMsg.format.ShowName.split('.').pop()}`"
                                />
                            </div>

                            <div
                                class="imgDisable"
                                v-if="
                                    picture.janusMsg.msgType === 6 &&
                                    picture.janusMsg.config.isExpire
                                "
                            >
                                <img :src="picDisabled" />
                            </div>
                            <div
                                class="picture-file-enable"
                                v-if="
                                    picture.janusMsg.msgType === 7 &&
                                    !picture.janusMsg.config.isExpire
                                "
                            >
                                <a
                                    target="_blank"
                                    :href="`${config.serverUrl}/v1/file/${route.params.id}/${picture.janusMsg.format.Fileid}`"
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
                                class="picture-file-disable"
                                v-if="
                                    picture.janusMsg.msgType === 7 &&
                                    picture.janusMsg.config.isExpire
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
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import picDisabled from "@/assets/Images/gallery/pic-disabled.svg";
import fileIcon from "@/assets/Images/chatroom/file-fill.svg";

//router
const route = useRoute();

//api store
const apiStore = useApiStore();
const { getHistoryApi } = apiStore;
const { messageList } = storeToRefs(apiStore);

if (Object.keys(route.query).length > 0) {
    getHistoryApi(route.query.chatroomID);
}
const pictures: any = computed({
    get() {
        const set = new Set();
        return messageList.value.filter((item: any) => {
            return !set.has(item.janusMsg.format.Fileid) &&
                (item.janusMsg.msgType === 6 || item.janusMsg.msgType === 7)
                ? set.add(item.janusMsg.format.Fileid)
                : false;
        });
    },
    set(val) {
        messageList.value = val;
    },
});
// watchEffect(() => {
//     console.log("pictures", pictures.value);
//     console.log("result", result?.value);
//     console.log("dateArr", dateArr?.value);
//     console.log("picArr", picArr?.value);
// });

const result: any = computed(() => {
    return pictures.value.map((pic: any, index: any) => {
        if (dayjs().isAfter(dayjs(pic.janusMsg.format.expirationDate))) {
            // 判斷是否到失效日期
            pic.janusMsg.config.isExpire = true;
        } else {
            pic.janusMsg.config.isExpire = false;
        }
        return pic;
    });
});

const dateArr: any = computed(() => {
    const set = new Set();
    const arr = result.value.filter((item) =>
        !set.has(item.janusMsg.config.currentDate)
            ? set.add(item.janusMsg.config.currentDate)
            : false
    );
    return arr
        .map((pic) => {
            return { month: dayjs(pic.janusMsg.config.currentDate).format("YYYY/MM") };
        })
        .sort()
        .reverse()
        .map((date) => {
            return [date];
        });
});

const picArr: any = computed(() => {
    result.value.forEach((item) => {
        dateArr.value.forEach((date) => {
            if (dayjs(item.janusMsg.config.currentDate).format("YYYY/MM") === date[0].month) {
                date.push(item);
            }
        });
    });
    dateArr.value.forEach((item) => {
        item.shift();
    });
    return dateArr.value;
});

// 圖片展示
const viewImgs: any = ref([]);
const previewURL = (fileid: string): void => {
    // console.log("pictures.value:", pictures.value);

    pictures.value.forEach((img: any) => {
        if (
            !viewImgs.value.includes(
                `${config.fileUrl}${
                    img.janusMsg.format.Fileid
                }.${img.janusMsg.format.ShowName.split(".").pop()}`
            ) &&
            img.janusMsg.msgType === 6 &&
            !img.janusMsg.config.isExpire
        ) {
            viewImgs.value.push(
                `${config.fileUrl}${
                    img.janusMsg.format.Fileid
                }.${img.janusMsg.format.ShowName.split(".").pop()}`
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
    height: calc(100% - 90px);
}
.date {
    font-size: $font-size-18;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 8px;
}
.picture-box {
    width: 95%;
    height: calc(100% - 90px);
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
    height: calc(100vh - 80px);
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
