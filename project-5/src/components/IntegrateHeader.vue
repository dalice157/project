<template>
    <!-- <div class="integrateHeaderBackground"> -->
    <div class="integrateHeader">
        <div class="integrateHeader__tab">
            <form id="form1" method="post" target="_blank">
                <div
                    class="every8dURL"
                    @click="openE8D"
                    @mousemove="hoverE8D"
                    @mouseleave="hoverTalkOD"
                    :class="{ E8Dhover: hoverStatus === 'E8D' }"
                    v-if="hostNameBoolean === true"
                >
                    <input id="token1" type="hidden" name="Authorization" value="" />
                    <input type="hidden" name="ASK" value="SSOAPIToken" />
                    <input id="account1" type="hidden" name="Account" value="" />
                    <input type="hidden" name="PageType" value="0" />
                    <img
                        draggable="false"
                        class="E8Dsmall"
                        :src="E8Dsmall"
                        v-show="hoverStatus === 'talkOD' || hoverStatus === ''"
                    />
                    <img
                        class="E8Dbig"
                        :src="E8Dbig"
                        v-show="hoverStatus === 'E8D'"
                        draggable="false"
                    />
                </div>
                <div
                    class="talkodURL"
                    @mousemove="leaveTalkOD"
                    :class="{ talkODNothover: hoverStatus === 'E8D' }"
                >
                    <img
                        class="talkODbig"
                        :src="talkODbig"
                        v-show="hoverStatus === 'talkOD' || hoverStatus === ''"
                        draggable="false"
                    />
                    <img
                        class="talkODsmall"
                        :src="talkODsmall"
                        v-show="hoverStatus === 'E8D'"
                        draggable="false"
                    />
                </div>
            </form>
        </div>
        <div class="integrateHeader__nav">
            <div style="display: flex; align-items: center" v-if="isAdmin >= 1">
                <a @click="openGuide">新手教學</a>
                <span>|</span>
            </div>
            <div style="display: flex" v-if="rechargeShow">
                <form id="form2" method="post" target="_blank">
                    <input id="token2" type="hidden" name="Authorization" value="" />
                    <input type="hidden" name="ASK" value="SSOAPIToken" />
                    <input id="account2" type="hidden" name="Account" value="" />
                    <input type="hidden" name="PageType" value="2" />
                    <a @click="recharge" target="_blank">我要儲值</a>
                </form>
                <span>|</span>
            </div>
            <a @click="logOut">登出</a>
        </div>
        <div class="integrateHeader__point">
            <p class="userName">{{ userName }}</p>
            <p class="point" id="guide11">
                剩餘點數 : <span>{{ point }}</span>
                <n-icon v-show="pointStatus === 0">
                    <refresh-outline @click="refreshPoint" />
                </n-icon>
                <n-icon v-show="pointStatus === 1">
                    <sync-outline />
                </n-icon>
            </p>
        </div>
    </div>
    <!-- </div> -->
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { NSpin, NIcon } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { clearAllCookie, tokenExpireToLogin } from "@/util/commonUtil";
import axios from "axios";

import { useApiStore } from "@/store/api";
import { RefreshOutline, SyncOutline } from "@vicons/ionicons5";
import E8Dsmall from "@/assets/Images/integrateHeader/EVERY8D 小.png";
import E8Dbig from "@/assets/Images/integrateHeader/EVERY8D大.png";
import talkODsmall from "@/assets/Images/integrateHeader/互動回覆簡訊小.png";
import talkODbig from "@/assets/Images/integrateHeader/互動回覆簡訊大.png";
import config from "@/config/config";

const apiStore = useApiStore();
const { getPoint } = apiStore;
const { point, pointStatus, isFirstLogin, isCloseMask, isCloseMask1, currentStep } =
    storeToRefs(apiStore);
const router = useRouter();
const route = useRoute();
const hoverStatus = ref("");
const i = ref(0);
const isAdmin: number | null = Number(localStorage.getItem("adminStatus"));
const userName = ref(localStorage.getItem("userName"));
const hoverTalkOD = (e) => {
    hoverStatus.value = "talkOD";
};
const hoverE8D = (e) => {
    if (e.clientX > 70 && e.clientX < 300 && e.clientY < 48 && e.clientY > 0) {
        hoverStatus.value = "E8D";
    } else {
        hoverStatus.value = "talkOD";
    }
};
const leaveTalkOD = (e) => {
    if (hostNameBoolean.value === true) {
        if (e.clientX < 218) {
            hoverStatus.value = "E8D";
        }
    }
};

//hostName 判斷
const hostNameBoolean = ref(false);
onMounted(() => {
    if (window.location.hostname === "talkod.teamplus.tech") {
        hostNameBoolean.value = true;
    } else {
        hostNameBoolean.value = false;
    }
});
const rechargeShow = ref(false);
onMounted(() => {
    if (
        window.location.hostname.includes("teamplus.tech") ||
        window.location.hostname.includes("e8d.tw") ||
        window.location.hostname.includes("localhost")
    ) {
        rechargeShow.value = true;
    }
});
//開E8D新視窗
const E8DURL = ref(null);
const openE8D = async () => {
    const getToken = localStorage.getItem("access_token");
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/every8d`,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res: any) => {
            // console.log("LoginE8D res", res.data);
            document.getElementById("token1").value = res.data.token;
            document.getElementById("account1").value = localStorage.getItem("userName");
            E8DURL.value = res.data.siteUrl;
            document.getElementById("form1").action = `${E8DURL.value}Common/VerifyHandler.ashx`;
            document.getElementById("form1").submit();
        })
        .catch((err: any) => {
            console.log("LoginE8D err", err);
            tokenExpireToLogin(err);
        });
};
//打開新手教學
const openGuide = () => {
    if (route.params.id) {
        router.push(`/manage/${route.params.id}/SMSSend`);
    } else {
        router.push(`/manage/SMSSend`);
    }
    setTimeout(() => {
        isFirstLogin.value = true;
        isCloseMask.value = false;
        isCloseMask1.value = false;
        currentStep.value = 1;
    }, 300);
};
//儲值
const recharge = async () => {
    const getToken = localStorage.getItem("access_token");
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/every8d`,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res: any) => {
            // console.log("LoginE8D res", res.data);
            document.getElementById("token2").value = res.data.token;
            document.getElementById("account2").value = localStorage.getItem("userName");
            E8DURL.value = res.data.siteUrl;
            document.getElementById("form2").action = `${E8DURL.value}Common/VerifyHandler.ashx`;
            document.getElementById("form2").submit();
        })
        .catch((err: any) => {
            console.log("LoginE8D err", err);
            tokenExpireToLogin(err);
        });
};

// 刷新點數
const refreshPoint = () => {
    pointStatus.value = 1;
    point.value = "---";
    setTimeout(() => {
        getPoint();
    }, 500);
};
//登出api
const logoutAPI = async () => {
    const getToken = localStorage.getItem("access_token");
    await axios({
        method: "post",
        url: `${config.serverUrl}/v1/logout`,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            console.log("logoutAPI res", res);
            clearAllCookie("/autoLogin");
            location.href = "/";
        })
        .catch((err) => {
            console.log("logoutAPI err", err);
        });
};
// 登出
const logOut = () => {
    logoutAPI();
};
</script>
<style lang="scss" scoped>
// .integrateHeaderBackground {
//     min-height: 60px;
.integrateHeader {
    width: 100%;
    height: 60px;
    background-image: url("~@/assets/Images/integrateHeader/sent_a1_04.jpg");
    display: flex;
    justify-content: space-between;
    &__tab {
        position: relative;
        .every8dURL {
            cursor: pointer;
            position: absolute;
            z-index: 3;
            left: 50px;
            top: 13px;
            &.E8Dhover {
                top: -1px;
                z-index: 5;
            }
        }
        .talkodURL {
            cursor: pointer;
            position: absolute;
            z-index: 4;
            left: 155px;
            top: 0px;
            &.talkODNothover {
                top: 12px;
                left: 265px;
            }
            .talkODbig {
                width: 306px;
                height: 59px;
            }
        }
    }
    &__nav {
        position: absolute;
        right: 350px;
        top: 25px;
        display: flex;
        form {
            display: inline;
            a {
                cursor: pointer;
                color: white;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        span {
            margin-left: 4px;
            margin-right: 4px;
            color: white;
        }
        a {
            cursor: pointer;
            color: white;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    &__point {
        width: 200px;
        height: 60px;
        background-image: url("~@/assets/Images/integrateHeader/sent_a1_06.jpg");
        position: absolute;
        top: 0px;
        right: 100px;
        display: flex;
        justify-content: center;
        .userName {
            position: absolute;
            top: 5px;
        }
        .point {
            color: #666;
            position: absolute;
            top: 30px;
            display: flex;
            align-items: center;
            span {
                color: #900;
                margin-right: 5px;
                margin-left: 5px;
            }
            .n-icon {
                cursor: pointer;
            }
        }
    }
}
// }
</style>
