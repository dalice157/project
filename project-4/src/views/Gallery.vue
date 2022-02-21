<template>
    <div class="gallery">
        <div class="galleryHeader">
            <div class="galleryTitle">
                <h1 class="name">
                    <n-avatar
                        round
                        class="avatar"
                        :size="42"
                        object-fit="cover"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        :src="`${config.fileUrl}/fls/${eventInfo.icon}`"
                    />
                    {{ eventInfo.name }}
                </h1>

                <router-link :to="`/?chatToken=${chatToken}`">
                    <img src="../assets/Images/chatroom/close-round.svg" />
                </router-link>
            </div>
        </div>
        <div class="picture-box" v-if="pictures.length > 0">
            <div v-for="(date, index) in dateArr" :key="index">
                <div class="date">{{ date }}</div>
                <div class="picture">
                    <div class="picture-inner" v-for="picture in pictures" :key="picture.id">
                        <div
                            class="imgEnable"
                            v-if="
                                picture.janusMsg.msgType === 6 &&
                                !picture.isExpire &&
                                date === dayjs(picture.currentDate).format('YYYY/MM')
                            "
                            @click="previewURL(picture.janusMsg.format.Fileid)"
                        >
                            <img
                                :src="`${config.fileUrl}/fls/${picture.janusMsg.format.Fileid}${picture.ext}`"
                            />
                        </div>
                        <div
                            class="imgDisable"
                            v-else-if="
                                picture.janusMsg.msgType === 6 &&
                                picture.isExpire &&
                                date === dayjs(picture.currentDate).format('YYYY/MM')
                            "
                        >
                            <img src="../assets/Images/gallery/pic-disabled.svg" />
                        </div>

                        <div
                            class="picture-file-enable"
                            v-else-if="
                                picture.janusMsg.msgType === 7 &&
                                !picture.isExpire &&
                                date === dayjs(picture.currentDate).format('YYYY/MM')
                            "
                        >
                            <a
                                :href="`${config.serverUrl}/file/${route.query.chatToken}/${picture.janusMsg.format.Fileid}`"
                            >
                                <img src="../assets/Images/chatroom/file-fill.svg" />
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
                            v-else-if="
                                picture.janusMsg.msgType === 7 &&
                                picture.isExpire &&
                                date === dayjs(picture.currentDate).format('YYYY/MM')
                            "
                        >
                            <div>
                                <img src="../assets/Images/chatroom/file-fill.svg" />
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
            <div class="noPicture" v-if="pictures.length === 0">
                <p>尚未有任何相片!!!</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { NEllipsis, NAvatar } from "naive-ui";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { api as viewerApi } from "v-viewer";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import config from "@/config/config";
import { localStorageMsg } from "@/util/commonUtil";
import { currentDate, currentMonth } from "@/util/dateUtil";
//chat store
const chatStore = useChatStore();
const { pictures } = storeToRefs(chatStore);

//api store
const apiStore = useApiStore();
const { getBackendApi } = apiStore;
const { eventInfo } = storeToRefs(apiStore);

//router
const route = useRoute();
const chatToken = computed(() => route.query.chatToken);

const result: any = ref([]);
const dateArr: any = ref([]);

//拿取後端api
getBackendApi(route.query.chatToken);

//獲取當天日期 判斷圖片及檔案是否失效
onMounted(() => {
    pictures.value = JSON.parse(localStorage.getItem(`${chatToken.value}-pictures`) || "[]");

    pictures.value.forEach((pic: any, index: any) => {
        if (dayjs().isAfter(dayjs(pic.expirationDate))) {
            pic.isExpire = true;
            localStorage.setItem(
                `${route.query.chatToken}-pictures`,
                JSON.stringify(pictures.value)
            );
        } else {
            pic.isExpire = false;
            localStorage.setItem(
                `${route.query.chatToken}-pictures`,
                JSON.stringify(pictures.value)
            );
        }
        if (
            index === 0 ||
            (index > 0 &&
                dayjs(pic.currentDate).format("YYYY/MM") !==
                    dayjs(pictures.value[index - 1].currentDate).format("YYYY/MM"))
            // index === 0 || (index > 0 && dayjs(arr[index].currentDate).format("YYYY/MM") !== dayjs(arr[index-1].currentDate).format("YYYY/MM"))
        ) {
            result.value.push(dayjs(pic.currentDate).format("YYYY/MM"));
        }
    });
    dateArr.value = result.value
        .filter((element: any, index: any, arr: any) => {
            return arr.indexOf(element) === index;
        })
        .sort()
        .reverse();
    // console.log("dateArr.value:", dateArr.value);
});
//圖片展示
const viewImgs: any = ref([]);
const previewURL = (fileid: string): void => {
    pictures.value.forEach((img: any) => {
        if (
            !viewImgs.value.includes(
                `${config.fileUrl}/fls/${img.janusMsg.format.Fileid}${img.ext}`
            ) &&
            img.janusMsg.msgType === 6
        ) {
            viewImgs.value.push(`${config.fileUrl}/fls/${img.janusMsg.format.Fileid}${img.ext}`);
        }
    });
    console.log("picture:", fileid);

    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[4].split(".")[0]))
        .indexOf(fileid);
    console.log("viewIndex:", viewIndex);

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
                a.href = `${config.serverUrl}/file/${chatToken.value}/${fileId}`;
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
.gallery {
    grid-area: body;
    width: 100%;
    height: 100%;
    background-color: $white;
    overflow-y: auto;

    .galleryHeader {
        width: calc(100% - 300px);
        // width: 100%;
        height: 125px;
        background: url("~@/assets/Images/common/header-bg-pc.svg") no-repeat center top;
        background-size: cover;
        padding-top: 20px;
        position: fixed;
        right: 0;
        top: 0;
        .galleryTitle {
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
    }
    .date {
        font-size: $font-size-18;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 8px;
    }
    .picture-box {
        max-width: calc(1100px - $siderWidth);
        display: block;
        margin: 125px auto 0;
        overflow-y: auto;
        box-sizing: border-box;
        .picture {
            display: grid;
            max-width: calc(1200px - $siderWidth);
            grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
            justify-items: center;
            .picture-inner {
                width: 112px;
                height: 112px;
                margin: 8px auto;
                .imgEnable {
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
        .noPicture {
            p {
                margin-top: 4em;
                font-size: $font-size-20;
                text-align: center;
            }
        }
    }
}
@media (max-width: 768px) {
    .gallery {
        height: 100%;
        .date {
            font-size: $font-size-16;
        }
        .galleryHeader {
            width: 100%;
            height: 120px;
            background: url("~@/assets/Images/gallery/gallery-bg.svg") no-repeat center top;
            background-size: cover;
            padding-top: 26px;
            .galleryTitle {
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
        }
        .picture-box {
            width: 100%;
            display: block;
            margin: 100px auto 20px;
            overflow-y: auto;

            .noPicture {
                p {
                    margin-top: 4em;
                    font-size: $font-size-20;
                    text-align: center;
                }
            }
        }
    }
}
@media (max-width: 420px) {
    .gallery {
        .picture-box {
            width: 95%;
            padding-bottom: 20px;
        }
    }
}
</style>
