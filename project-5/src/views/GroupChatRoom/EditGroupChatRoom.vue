<template>
    <div class="addGroupChatRoomWrapper">
        <n-scrollbar style="max-height: calc(100vh - 170px)">
            <div class="addGroupChatRoom">
                <div class="groupChatHeader">
                    <n-upload @change="uploadAvatar($event)" :accept="avatarAccept" type="file">
                        <div class="upload-avatar">
                            <!-- 有自訂頭貼 -->
                            <img
                                class="upload-avatar--active"
                                :src="`${config.fileUrl}${avatar.fileid}${avatar.ext}`"
                                :alt="avatar.fileName"
                                v-if="avatarStatus === 1 && avatar.fileid !== ''"
                            />
                            <!-- 群聊群組僅有內部人員頭貼 -->
                            <img
                                class="upload-avatar--active"
                                :src="`${config.fileUrl}internalPeopleDefault.svg`"
                                :alt="avatar.fileName"
                                v-if="
                                    avatarStatus === 1 &&
                                    avatar.fileid === '' &&
                                    outterPeople === null
                                "
                            />
                            <!-- 群聊群組有含外部人員頭貼 -->
                            <img
                                class="upload-avatar--active"
                                :src="`${config.fileUrl}externalPeopleDefault.svg`"
                                :alt="avatar.fileName"
                                v-if="
                                    avatarStatus === 1 &&
                                    avatar.fileid === '' &&
                                    outterPeople !== null
                                "
                            />
                        </div>
                    </n-upload>
                    <div class="groupChatTitle">
                        <div class="groupChatName">
                            <h1>群組名稱</h1>
                            <p>
                                群組總人數:{{
                                    innerPeople.length +
                                    (outterPeople !== null ? outterPeople.length : 0)
                                }}
                            </p>
                        </div>
                        <n-input placeholder="請輸入群組交談室名稱" v-model:value="name"></n-input>
                    </div>
                </div>
                <div class="groupChatContent">
                    <div class="memberArea">
                        <div class="innerMemberArea">
                            <div class="innerMemberArea--header">
                                <h1>內部人員({{ innerPeople.length }})</h1>
                                <div class="innerInvite" @click="selectInnerPeoplePopUp = true">
                                    <img :src="innerInviteIcon" />
                                    <p>邀請</p>
                                </div>
                            </div>
                            <n-scrollbar style="max-height: 450px">
                                <div class="innerMemberArea--list">
                                    <div
                                        class="member"
                                        v-for="people in innerPeople"
                                        :key="people.accountID"
                                    >
                                        <img
                                            v-if="!people.owner"
                                            :src="deleteIcon2"
                                            class="deleteIcon2"
                                            @click="deletePerson2(people.accountID)"
                                        />
                                        <img
                                            :src="`${config.fileUrl}${people.icon}`"
                                            v-if="people.icon"
                                            :class="{ owner: people.owner }"
                                        />
                                        <img
                                            :src="profileIcon"
                                            v-else
                                            :class="{ owner: people.owner }"
                                        />
                                        <div class="member__profile">
                                            <h1>{{ people.account }}</h1>
                                            <p v-if="people.owner">(建立人)</p>
                                            <div class="department" v-else>
                                                <p v-if="people.department">
                                                    {{ people.department }}
                                                </p>
                                                <p v-if="people.role">
                                                    {{ people.role }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </n-scrollbar>
                        </div>
                        <n-divider vertical />
                        <div class="outterMemberArea">
                            <div class="outterMemberArea--header">
                                <h1>
                                    外部人員({{ outterPeople !== null ? outterPeople.length : 0 }})
                                </h1>
                                <div class="outterInvite" @click="openOutterPopUp">
                                    <img :src="outterInviteIcon" />
                                    <p>邀請</p>
                                </div>
                            </div>
                            <n-scrollbar style="max-height: 450px">
                                <div class="outterMemberArea--list">
                                    <div
                                        class="member"
                                        v-for="people in outterPeople"
                                        :key="people.accountID"
                                    >
                                        <!-- <img v-if="people.icon" :src="`${config.fileUrl}${people.icon}`" /> -->
                                        <img v-if="people.icon === '0'" :src="defaultUserIcon" />
                                        <img
                                            v-else
                                            :src="`${config.fileUrl}icon/${people.icon}.png`"
                                        />
                                        <div>
                                            <h1>
                                                {{ people.name ? people.name : people.accountID }}
                                            </h1>
                                            <p>{{ people.role }}</p>
                                        </div>
                                    </div>
                                </div>
                            </n-scrollbar>
                        </div>
                    </div>
                    <div class="groupChatContent__buttonGroup">
                        <div class="button--cancel" @click="goGroupChat">取消</div>
                        <div class="button--save" @click="edtiRoom">確定</div>
                    </div>
                </div>
            </div>
        </n-scrollbar>
    </div>
    <!-- 邀請內部人員彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="selectInnerPeoplePopUp">
            <div class="innerPeoplePopUp">
                <div class="chooseInnerPeople">
                    <div class="chooseInnerPeople__title">
                        <h1>
                            選擇內部成員
                            <span>{{ selectInnerPeople.length }}人</span>
                        </h1>
                        <p>(群組人數:內部{{ selectInnerPeople.length }}外部0)</p>
                    </div>
                    <div class="chooseInnerPeople__tabs">
                        <n-tabs class="tabs" type="card" :on-update:value="changeTabs">
                            <n-tab-pane name="people" tab="人員">
                                <n-input
                                    class="selectPeople"
                                    placeholder="搜尋姓名、部門、職稱等..."
                                    v-model:value="searchPeople"
                                >
                                    <template #prefix> <img :src="searchIcon" /></template>
                                </n-input>
                                <n-checkbox
                                    label="全選"
                                    class="selectAll"
                                    @update:checked="selectAll"
                                    :checked="isAll"
                                    v-show="searchPeople === ''"
                                />
                                <n-checkbox-group
                                    class="selectInnerPeople"
                                    v-model:value="selectInnerPeople"
                                >
                                    <n-scrollbar style="max-height: 450px">
                                        <div
                                            class="allPeople"
                                            :class="{ search: searchPeople !== '' }"
                                        >
                                            <div
                                                class="innerPeopleList"
                                                v-for="people in filterInnerPeople"
                                                :key="people.accountID"
                                            >
                                                <div class="eachPeople">
                                                    <n-checkbox
                                                        :value="people.accountID"
                                                        :disabled="people.accountID === owner"
                                                    />
                                                    <img
                                                        v-if="people.icon"
                                                        :src="`${config.fileUrl}${people.icon}`"
                                                    />
                                                    <img v-else :src="profileIcon" />
                                                    <div class="eachPeople__profile">
                                                        <h1>
                                                            {{
                                                                people.name
                                                                    ? people.name
                                                                    : people.account
                                                            }}
                                                        </h1>
                                                        <div class="department">
                                                            <p v-if="people.department">
                                                                {{ people.department }}
                                                            </p>
                                                            <p v-if="people.role">
                                                                {{ people.role }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </n-scrollbar>
                                </n-checkbox-group>
                            </n-tab-pane>
                            <n-tab-pane name="department" tab="部門">
                                <n-input
                                    class="searchDepartment"
                                    placeholder="搜尋姓名、部門、職稱等..."
                                    v-model:value="searchPeople"
                                >
                                    <template #prefix> <img :src="searchIcon" /></template>
                                </n-input>
                                <n-scrollbar style="max-height: 450px">
                                    <div class="allDepartment" v-show="searchPeople === ''">
                                        <div
                                            class="departmentList"
                                            v-for="(department, index) in internalDepartmentPeople"
                                            :key="department.name"
                                        >
                                            <div
                                                class="departmentList__title"
                                                @click="department.isOpen = !department.isOpen"
                                                :class="{ open: department.isOpen }"
                                            >
                                                <div class="title">
                                                    <img
                                                        :src="departmentDefaultIcon"
                                                        v-show="!department.isOpen"
                                                    />
                                                    <img
                                                        :src="departmentActivetIcon"
                                                        v-show="department.isOpen"
                                                    />
                                                    <p>{{ department.name }}</p>
                                                </div>
                                                <img
                                                    class="arrow"
                                                    :src="arrowDownIcon"
                                                    v-show="!department.isOpen"
                                                />
                                                <img
                                                    class="arrow"
                                                    :src="arrowUpIcon"
                                                    v-show="department.isOpen"
                                                />
                                            </div>
                                            <div v-show="department.isOpen">
                                                <n-checkbox
                                                    label="全選"
                                                    class="eachDepartMentSelectAll"
                                                    :checked="eachDepartmentIsAll(index)"
                                                    @update:checked="
                                                        eachDepartmentSelectAll($event, index)
                                                    "
                                                />
                                                <n-checkbox-group
                                                    class="selectInternalDepartmentPeople"
                                                    v-model:value="selectInternalDepartmentPeople"
                                                >
                                                    <div
                                                        class="departmentList__content"
                                                        v-for="member in department.member"
                                                        :key="member.accountID"
                                                    >
                                                        <div class="eachPeople">
                                                            <n-checkbox
                                                                :value="member.accountID"
                                                                :disabled="
                                                                    member.accountID === owner
                                                                "
                                                            />
                                                            <img
                                                                v-if="member.icon"
                                                                :src="`${member.fileUrl}${member.icon}`"
                                                            />
                                                            <img v-else :src="profileIcon" />
                                                            <div class="eachPeople__profile">
                                                                <h1>
                                                                    {{
                                                                        member.name
                                                                            ? member.name
                                                                            : member.account
                                                                    }}
                                                                </h1>
                                                                <div class="department">
                                                                    <p v-if="department.name">
                                                                        {{ department.name }}
                                                                    </p>
                                                                    <p v-if="member.role">
                                                                        {{ member.role }}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </n-checkbox-group>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 有關鍵字時 列表呈現 -->
                                    <n-checkbox-group
                                        class="selectInnerPeople"
                                        v-model:value="selectInnerPeople"
                                    >
                                        <div
                                            class="allPeople"
                                            :class="{ search: searchPeople !== '' }"
                                            v-show="searchPeople !== ''"
                                        >
                                            <div
                                                class="innerPeopleList"
                                                v-for="people in filterInnerPeople"
                                                :key="people.accountID"
                                            >
                                                <div class="eachPeople">
                                                    <n-checkbox
                                                        :value="people.accountID"
                                                        :disabled="people.accountID === owner"
                                                    />
                                                    <img
                                                        v-if="people.icon"
                                                        :src="`${config.fileUrl}${people.icon}`"
                                                    />
                                                    <img v-else :src="profileIcon" />
                                                    <div class="eachPeople__profile">
                                                        <h1>
                                                            {{
                                                                people.name
                                                                    ? people.name
                                                                    : people.account
                                                            }}
                                                        </h1>
                                                        <div class="department">
                                                            <p v-if="people.department">
                                                                {{ people.department }}
                                                            </p>
                                                            <p v-if="people.role">
                                                                {{ people.role }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </n-checkbox-group>
                                </n-scrollbar>
                            </n-tab-pane>
                        </n-tabs>
                    </div>
                </div>
                <div class="alreadyChooseInnerPeople">
                    <div class="alreadyChooseInnerPeople__title">
                        <h1>已選擇內部成員 ({{ selectInnerPeople.length }})</h1>
                        <img :src="closeIcon" @click="cancelStoreInnerPeople" />
                    </div>
                    <n-scrollbar style="max-height: 450px">
                        <div class="alreadyChooseInnerPeople__list">
                            <div
                                class="choosedPeople"
                                v-for="people in choosedPeople"
                                :key="people.accountID"
                            >
                                <div class="eachPeople">
                                    <img
                                        v-if="people.icon"
                                        :src="`${config.fileUrl}${people.icon}`"
                                    />
                                    <img v-else :src="profileIcon" />
                                    <div class="eachPeople__profile">
                                        <h1>{{ people.name ? people.name : people.account }}</h1>
                                        <div class="department">
                                            <p v-if="people.department">
                                                {{ people.department }}
                                            </p>
                                            <p v-if="people.role">
                                                {{ people.role }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <img
                                    class="deletePerson"
                                    :src="deleteIcon"
                                    @click="deletePerson(people.accountID)"
                                    v-if="people.accountID !== owner"
                                />
                            </div>
                        </div>
                    </n-scrollbar>
                    <div class="alreadyChooseInnerPeople__buttonGroup">
                        <div class="button--cancel" @click="cancelStoreInnerPeople">取消</div>
                        <div class="button--save" @click="storeInnerPeople">確定</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>

    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, h } from "vue";
import {
    NUpload,
    NInput,
    NTabs,
    NTabPane,
    NCheckboxGroup,
    NCheckbox,
    NDivider,
    NPopover,
    NIcon,
    NDataTable,
    NConfigProvider,
    NEmpty,
    NRadio,
    NRadioGroup,
    NScrollbar,
} from "naive-ui";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { HelpCircleOutline } from "@vicons/ionicons5";
import config from "@/config/config";
import Compressor from "compressorjs";
import { storeToRefs } from "pinia";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { useGroupChatStore } from "@/store/groupChat";
import { pointCalculation } from "@/util/commonUtil";
import AlertPopUp from "@/components/AlertPopUp.vue";

import UploadAnimation from "@/components/uploadAnimation.vue";
import photoIcon from "@/assets/Images/manage/Photo.svg";
import innerInviteIcon from "@/assets/Images/groupChat/plus_o.svg";
import outterInviteIcon from "@/assets/Images/groupChat/plus_y.svg";
import searchIcon from "@/assets/Images/groupChat/search.svg";
import profileIcon from "@/assets/Images/groupChat/User default-B.svg";
import defaultUserIcon from "@/assets/Images/groupChat/User default-C.svg";
import fileIcon from "@/assets/Images/common/file.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import deleteIcon from "@/assets/Images/groupChat/round-fill_close.svg";
import deleteIcon2 from "@/assets/Images/groupChat/round-fill_close_g.svg";
import closeIcon from "@/assets/Images/groupChat/close-round.svg";
import departmentDefaultIcon from "@/assets/Images/groupChat/department.svg";
import departmentActivetIcon from "@/assets/Images/groupChat/department-enabled.svg";
import arrowUpIcon from "@/assets/Images/groupChat/arrow-up.svg";
import arrowDownIcon from "@/assets/Images/groupChat/arrow-down.svg";

const accountID = ref(Number(localStorage.getItem("accountID")));
//路由
const router = useRouter();
const route = useRoute();
//api store
const apiStore = useApiStore();
const {
    addressBookList,
    uploadRef,
    invalidList,
    commonMsgList,
    point,
    labelChannelList,
    tagList,
    addhttps,
    eventID,
    bugout,
    innerPeople,
    outterPeople,
    internalDepartmentPeople,
} = storeToRefs(apiStore);
const {
    excelVerification,
    getCommonMsgList,
    addCommonMsgObj,
    removeCommonMsgObj,
    editCommonMsgObj,
    getTagList,
    editGroup,
} = apiStore;
//groupChat store
const groupChatStore = useGroupChatStore();
const {
    groupChatSubject,
    groupChatContent,
    groupChatPoint,
    groupChatCount,
    groupChatWord,
    phoneArray,
    phoneNumberList,
    selectInnerPeoplePopUp,
    selectOutterPeoplePopUp,
} = storeToRefs(groupChatStore);
//modal store
const modelStore = useModelStore();
const { uploadAnimationBoolean } = storeToRefs(modelStore);
//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
//v-model
const name = ref("");
const searchPeople = ref("");
const searchDepartment = ref("");
// 內部彈窗總人員 checkboxGroup
const selectInnerPeople = ref([]);
// 內部彈窗部門人員分類 checkboxGroup
const selectInternalDepartmentPeople = ref([]);
//頭像上傳
const avatarAccept = "image/png, image/jpeg";
const avatarStatus = ref(0);
const avatar = ref({ exp: "", ext: "", fileid: "", fileName: "" });
const uploadAvatar = (e) => {
    const file = e.file.file;
    if (!file) {
        return;
    }
    //壓縮圖片套件 compressor js
    new Compressor(file, {
        quality: 0.6,
        async success(result) {
            //呼叫api
            const fd = new FormData();
            // console.log("file.name:", file);
            fd.append("file", new File([result], file.name, { type: "image/*" }));
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/file`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    // console.log("avatar res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        avatar.value = {
                            exp: res.data.exp,
                            ext: res.data.ext,
                            fileid: res.data.fileid,
                            fileName: file.name,
                        };
                        avatarStatus.value = 1;
                    };
                })
                .catch((err) => {
                    // console.error(err);
                    bugout.value.error(`error-log${userName.value}`, err.response.status);
                    bugout.value.error(`error-log${userName.value}`, err.response.data);
                    bugout.value.error(
                        `error-log${userName.value}`,
                        err.response.request.responseURL
                    );
                });
        },
        error(err) {
            console.error(err);
        },
    });
};

//彈窗內部人員總列表
const filterInnerPeople = computed(() => {
    return addressBookList.value.filter((item) => {
        return item.name
            .trim()
            .toLowerCase()
            .includes(`${searchPeople.value.trim().toLowerCase()}`);
    });
});

onMounted(() => {
    addressBookGetData();
    getTagList();
});
//內部人員列表
const addressBookGetData = async () => {
    const getToken = localStorage.getItem("access_token");
    const fd = new FormData();
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/contact`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            // console.log("addressBookGetData res", res.data.contact);
            addressBookList.value = res.data.contact;
        })
        .catch((err) => {
            this.bugout.error(`error-log${this.userName}`, err.response.status);
            this.bugout.error(`error-log${this.userName}`, err.response.data);
            this.bugout.error(`error-log${this.userName}`, err.response.request.responseURL);
        });
};
//切換 tab 清空 搜尋關鍵字
const changeTabs = () => {
    searchPeople.value = "";
};
//總人員判斷有無全選
const isAll = computed(() => {
    return selectInnerPeople.value.length === addressBookList.value.length;
});
//總人員全選,全不選
const selectAll = (e) => {
    if (e === true) {
        selectInnerPeople.value = addressBookList.value.map((item) => item.accountID);
    } else {
        selectInnerPeople.value = selectInnerPeople.value.filter(
            (people) => people === owner.value
        );
    }
};
const eachDepartmentAccountID = ref([]);
//部門人員判斷有無全選
const eachDepartmentIsAll = (index) => {
    return eachDepartmentAccountID.value[index].every((element) =>
        selectInternalDepartmentPeople.value.includes(element)
    );
};
//部門人員全選,全不選
const eachDepartmentSelectAll = (e, index) => {
    if (e === true) {
        selectInternalDepartmentPeople.value = selectInternalDepartmentPeople.value.concat(
            eachDepartmentAccountID.value[index].filter((e) => {
                return selectInternalDepartmentPeople.value.indexOf(e) === -1;
            })
        );
    } else {
        selectInternalDepartmentPeople.value = selectInternalDepartmentPeople.value.filter(
            (item) => {
                return (
                    eachDepartmentAccountID.value[index].indexOf(item) === -1 ||
                    item === owner.value
                );
            }
        );
    }
};
//已選擇內部成員陣列
const choosedPeople = computed(() => {
    return addressBookList.value.filter((item) => {
        return selectInnerPeople.value.indexOf(item.accountID) !== -1;
    });
});
//內部人員彈窗刪除人
const deletePerson = (accountID) => {
    selectInnerPeople.value = selectInnerPeople.value.filter((item) => {
        return item !== accountID;
    });
};
//內部人員首頁刪除人
const deletePerson2 = (accountID) => {
    selectInnerPeople.value = selectInnerPeople.value.filter((item) => {
        return item !== Number(accountID);
    });
    innerPeople.value = innerPeople.value.filter((item) => {
        return Number(item.accountID) !== Number(accountID);
    });
};
//取消
const cancelStoreInnerPeople = () => {
    selectInnerPeople.value = innerPeople.value.map((people) => Number(people.accountID));
    selectInnerPeoplePopUp.value = false;
};
//儲存內部人員
const storeInnerPeople = () => {
    const choosedPeopleWithoutme = ref([]);
    //已選擇內部成員去除建立者
    choosedPeopleWithoutme.value = choosedPeople.value.filter(
        (people) => people.accountID !== owner.value
    );
    //外面內部成員只留建立者
    innerPeople.value = innerPeople.value.filter(
        (people) => Number(people.accountID) === owner.value
    );
    innerPeople.value = innerPeople.value.concat(choosedPeopleWithoutme.value);
    selectInnerPeoplePopUp.value = false;
};

//返回群聊首頁
const goGroupChat = () => {
    router.push(`/groupChat/chat?eventID=${route.query.eventID}`);
};
//確定編輯
const edtiRoom = () => {
    if (name.value === "") {
        alertMessage.value = "尚有 群組名稱 尚未填寫";
        return;
    }
    let innerPeopleString = innerPeople.value.map((p) => p.accountID);
    innerPeopleString = innerPeopleString.toString();
    let icon = avatar.value.fileid + avatar.value.ext;
    const patchData = {
        name: name.value,
        icon: avatar.value.fileid ? icon : "",
        internelMember: innerPeopleString,
        eventID: route.query.eventID,
    };
    editGroup(patchData);
    router.push(`/groupChat/chat?eventID=${route.query.eventID}`);
};
const demoContent =
    "輸入簡訊內容\n\n說明：\n１.支援『長簡訊』之發送,每則簡訊字數最多可達333（中文）字。\n２.超過333字仍可發送,系統將自動進行拆則。\n３.為使簡訊內容正常呈現於手機中,請勿在簡訊內容中填入~．^)|1>等特殊符號。";
//邀請外部人員彈窗
const openOutterPopUp = () => {
    selectOutterPeoplePopUp.value = 1;
    groupChatContent.value = demoContent;
};
//聊天室擁有者
const owner = ref(null);
//取得個別聊天室資訊
const getGroupChatRoomInfo = async () => {
    const getToken = localStorage.getItem("access_token");
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/grouproom/${route.query.eventID}`,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            console.log("getGroupChatRoomInfo res", res.data);
            innerPeople.value = res.data.inter;
            outterPeople.value = res.data.exter;
            selectInnerPeople.value = innerPeople.value.map((p) => Number(p.accountID));
            let ownerArr = innerPeople.value.filter((people) => people.owner);
            owner.value = Number(ownerArr[0].accountID);
            name.value = res.data.event.name;
            avatar.value = {
                exp: "",
                ext: res.data.event.icon !== "" ? "." + res.data.event.icon.split(".")[1] : "",
                fileid: res.data.event.icon !== "" ? res.data.event.icon.split(".")[0] : "",
                fileName: "",
            };
            getInternalDepartmentPeople();
            console.log("取得個別聊天室資訊 avatar", avatar.value);
            avatarStatus.value = 1;
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
};
// 內部邀請彈窗 選擇內部部門人員
const getInternalDepartmentPeople = async () => {
    const getToken = localStorage.getItem("access_token");
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/grouproom/department/members`,
        headers: { Authorization: `Bearer ${getToken}` },
    })
        .then((res) => {
            console.log("getInternalDepartmentPeople res", res.data.data);
            internalDepartmentPeople.value = res.data.data;
            internalDepartmentPeople.value = internalDepartmentPeople.value.map((item) => {
                return {
                    ...item,
                    isOpen: false,
                };
            });
            // console.log("internalDepartmentPeople", internalDepartmentPeople.value);
            eachDepartmentAccountID.value = internalDepartmentPeople.value.reduce(
                (initialArr, item, index, arr) => {
                    initialArr[index] = arr[index].member.map((member) => member.accountID);
                    return initialArr;
                },
                []
            );
            // console.log("初始化各部門ID eachDepartmentAccountID", eachDepartmentAccountID.value);
            selectInternalDepartmentPeople.value.push(innerPeople.value[0].accountID);
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
};
//同步人員及部門兩個 checkboxGroup 綁定的陣列
watch(selectInnerPeople, (newVal) => {
    selectInternalDepartmentPeople.value = newVal;
});
watch(selectInternalDepartmentPeople, (newVal) => {
    selectInnerPeople.value = newVal;
});
onMounted(() => {
    getGroupChatRoomInfo();
});

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
.chooseInnerPeople__tabs {
    .tabs {
        &.n-tabs {
            margin-bottom: 40px;
            .n-tabs-tab__label {
                font-size: $font-size-14;
            }
            .n-tabs-nav {
                .n-tabs-tab {
                    color: $gray-3;
                    background-color: $primary-3;
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

            .n-tab-pane {
                width: 100%;
                background-color: $gray-8;
                border-radius: 0px 4px 4px 4px;
                display: flex;
                flex-direction: column;
            }
        }
        .n-input {
            width: 90%;
            border-radius: 20px;
            margin: 0 auto;
        }
        .n-checkbox {
            align-items: center;
        }
    }
}
.selectLabel {
    display: flex;
    .n-input {
        width: 90%;
        border-radius: 20px;
        margin: 0 auto;
    }
}
.SMS_content {
    .n-divider:not(.n-divider--vertical) {
        margin-top: 14.5px;
        margin-bottom: 14.5px;
    }
}
.SMS_setting {
    .n-divider:not(.n-divider--vertical) {
        margin-top: 14.5px;
        margin-bottom: 14.5px;
    }
}
.SMS_setting {
    .tabs {
        &.n-tabs {
            margin-bottom: 40px;
            .n-tabs-tab__label {
                font-size: $font-size-14;
            }
            .n-tabs-nav {
                .n-tabs-tab {
                    color: $gray-3;
                    background-color: $primary-3;
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

            .n-tab-pane {
                width: 100%;
                background-color: $gray-8;
                border-radius: 0px 4px 4px 4px;
                padding-bottom: 20px;
            }
        }
    }
}
.manual__type-area {
    .n-input.n-input--textarea {
        --n-border: 1px solid #8b8b8b !important;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.addGroupChatRoomWrapper {
    width: 100%;
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 45px;
    .addGroupChatRoom {
        background-color: $white;
        padding: 30px;
        border-radius: 4px;
        .groupChatHeader {
            display: flex;
            margin-bottom: 30px;
            .upload-avatar {
                width: 80px;
                height: 80px;
                border: 1px dashed $gray-3;
                background-color: $gray-8;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                &--default {
                    width: 24px;
                    height: 24px;
                }
                &--active {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                }
            }
            .groupChatTitle {
                width: 100%;
                margin-left: 15px;
                .groupChatName {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    h1 {
                        color: $gray-1;
                        font-size: $font-size-16;
                        font-family: $font-family;
                        font-weight: 400;
                    }
                    p {
                        color: $gray-3;
                        font-size: $font-size-16;
                        font-weight: 400;
                        font-family: $font-family;
                    }
                }
            }
        }
        .groupChatContent {
            .memberArea {
                width: 100%;
                min-height: 500px;
                display: flex;
                justify-content: center;
                .innerMemberArea {
                    width: 40%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    &--header {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        h1 {
                            color: $primary-1;
                            font-size: $font-size-16;
                            font-weight: 500;
                            font-family: $font-family;
                            margin-right: 30px;
                        }
                        .innerInvite {
                            width: 80px;
                            height: 40px;
                            background-color: $primary-3;
                            border-radius: 19.5px;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            img {
                                margin-right: 5px;
                            }
                            p {
                                color: $primary-1;
                                font-family: $font-family;
                            }
                        }
                    }
                    &--list {
                        width: 100%;
                        margin-top: 15px;
                        // max-height: 450px;
                        // overflow-y: auto;
                        .member {
                            display: flex;
                            align-items: center;
                            margin: 10px 0;
                            .deleteIcon2 {
                                width: 14px;
                                height: 14px;
                                margin-right: 10px;
                                cursor: pointer;
                            }
                            img {
                                width: 42px;
                                height: 42px;
                                border-radius: 50%;
                                &.owner {
                                    margin-left: 24px;
                                }
                            }
                            &__profile {
                                margin-left: 10px;
                                h1 {
                                    color: $gray-1;
                                    font-size: $font-size-14;
                                    font-weight: 400;
                                    font-family: $font-family;
                                    margin-bottom: 5px;
                                }
                                p {
                                    color: $gray-3;
                                    font-size: $font-size-14;
                                    font-family: $font-family;
                                    font-weight: 400;
                                }
                                .department {
                                    display: flex;
                                    > p {
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }
                    }
                }
                .outterMemberArea {
                    width: 40%;
                    max-height: 450px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding-left: 120px;
                    &--header {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        h1 {
                            color: #ffb400;
                            font-size: $font-size-16;
                            font-family: $font-family;
                            font-weight: 500;
                            margin-right: 30px;
                        }
                        .outterInvite {
                            width: 80px;
                            height: 40px;
                            background-color: #fff1cf;
                            border-radius: 19.5px;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            img {
                                margin-right: 5px;
                            }
                            p {
                                color: #ffb400;
                                font-family: $font-family;
                            }
                        }
                    }
                    &--list {
                        width: 100%;
                        margin-top: 15px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        // overflow-y: auto;
                        .member {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            img {
                                width: 42px;
                                height: 42px;
                                border-radius: 4px;
                            }
                            > div {
                                margin-left: 10px;
                                h1 {
                                    color: $gray-1;
                                    font-size: $font-size-14;
                                    font-weight: 400;
                                    font-family: $font-family;
                                    margin-left: 5px;
                                    margin-bottom: 1px;
                                }
                                p {
                                    color: $gray-3;
                                    font-size: $font-size-14;
                                    font-family: $font-family;
                                    font-weight: 400;
                                }
                            }
                        }
                    }
                }
            }
            &__buttonGroup {
                display: flex;
                justify-content: center;
                margin-top: 20px;
                .button--cancel {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    border: 1px solid $gray-1;
                    border-radius: 18px;
                    text-align: center;
                    margin: 0 15px;
                    cursor: pointer;
                    text-decoration: none;
                    color: $gray-1;
                }

                .button--save {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    border: 1px solid $gray-1;
                    border-radius: 18px;
                    text-align: center;
                    color: $white;
                    background-color: $gray-1;
                    margin: 0 15px;
                    cursor: pointer;
                }
                .button--invite {
                    width: 200px;
                    height: 36px;
                    line-height: 36px;
                    border: 1px solid $gray-1;
                    border-radius: 18px;
                    text-align: center;
                    color: $white;
                    background-color: $gray-1;
                    margin: 0 15px;
                    cursor: pointer;
                }
            }
        }
    }
}
//垂直分割線
.groupChatContent {
    .n-divider.n-divider--vertical {
        height: auto;
    }
}
// 內部人員彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .innerPeoplePopUp {
        background-color: #fff;
        width: 660px;
        height: 700px;
        display: flex;
        padding: 30px 20px;
        .chooseInnerPeople {
            width: 50%;
            border-right: 1px solid #d7d7d7;
            &__title {
                display: flex;
                flex-direction: column;
                align-items: center;
                h1 {
                    color: $gray-1;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                    margin-bottom: 5px;
                    span {
                        color: $gray-3;
                        font-size: $font-size-14;
                        font-family: $font-family;
                        font-weight: 400;
                    }
                }
                p {
                    color: $gray-3;
                    font-size: $font-size-14;
                    font-family: $font-family;
                    font-weight: 400;
                    margin-bottom: 15px;
                }
            }
            &__tabs {
                .selectPeople {
                    img {
                        width: 14px;
                        height: 14px;
                    }
                }
                .selectAll {
                    margin: 15px 0;
                    margin-left: 15px;
                }
                .selectInnerPeople {
                    .allPeople {
                        // overflow-y: auto;
                        // height: 455px;
                        .innerPeopleList {
                            display: flex;
                            margin-bottom: 10px;
                            .eachPeople {
                                display: flex;
                                align-items: center;
                                height: 40px;
                                margin-left: 15px;
                                img {
                                    width: 42px;
                                    height: 42px;
                                    margin-right: 10px;
                                    margin-left: 15px;
                                    border-radius: 50%;
                                }
                                &__profile {
                                    h1 {
                                        color: $gray-1;
                                        font-size: $font-size-14;
                                        font-weight: 400;
                                        font-family: $font-family;
                                    }
                                    .department {
                                        display: flex;
                                        p {
                                            color: $gray-3;
                                            font-size: $font-size-14;
                                            font-family: $font-family;
                                            font-weight: 400;
                                            margin-right: 5px;
                                            margin-top: 5px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .searchDepartment {
                    img {
                        width: 14px;
                        height: 14px;
                    }
                }
                .selectInternalDepartmentPeople {
                }
                .allDepartment {
                    padding: 10px;
                    // overflow-y: auto;
                    // height: 455px;
                    .departmentList {
                        &__title {
                            border: 1px solid $primary-3;
                            margin: 10px 0;
                            padding: 10px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            cursor: pointer;
                            .title {
                                display: flex;
                                align-items: center;
                                img {
                                    width: 20px;
                                }
                                p {
                                    margin-left: 10px;
                                }
                            }
                            .arrow {
                                width: 16px;
                            }
                            &.open {
                                color: $primary-1;
                            }
                        }
                        &__content {
                            display: flex;
                            margin: 10px 0;
                            .eachPeople {
                                display: flex;
                                align-items: center;
                                height: 40px;

                                img {
                                    width: 42px;
                                    height: 42px;
                                    margin-right: 10px;
                                    margin-left: 15px;
                                    border-radius: 50%;
                                }
                                &__profile {
                                    h1 {
                                        color: $gray-1;
                                        font-size: $font-size-14;
                                        font-weight: 400;
                                        font-family: $font-family;
                                    }
                                    .department {
                                        display: flex;
                                        p {
                                            color: $gray-3;
                                            font-size: $font-size-14;
                                            font-family: $font-family;
                                            font-weight: 400;
                                            margin-right: 5px;
                                            margin-top: 5px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .allPeople {
                    // overflow-y: auto;
                    // height: 455px;
                    &.search {
                        margin-top: 30px;
                    }
                    .innerPeopleList {
                        display: flex;
                        margin-bottom: 10px;
                        .eachPeople {
                            display: flex;
                            align-items: center;
                            height: 40px;
                            margin-left: 15px;
                            img {
                                width: 42px;
                                height: 42px;
                                margin-right: 10px;
                                margin-left: 15px;
                                border-radius: 50%;
                            }
                            &__profile {
                                h1 {
                                    color: $gray-1;
                                    font-size: $font-size-14;
                                    font-weight: 400;
                                    font-family: $font-family;
                                }
                                .department {
                                    display: flex;
                                    p {
                                        color: $gray-3;
                                        font-size: $font-size-14;
                                        font-family: $font-family;
                                        font-weight: 400;
                                        margin-right: 5px;
                                        margin-top: 5px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .alreadyChooseInnerPeople {
            width: 50%;
            &__title {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                h1 {
                    color: $gray-1;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                    margin-bottom: 15px;
                }
                img {
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    top: -10px;
                }
            }
            &__list {
                padding: 15px;
                // overflow-y: auto;
                // height: 540px;
                .choosedPeople {
                    width: fit-content;
                    border: 1px solid $primary-3;
                    margin: 10px 0;
                    padding: 10px;
                    position: relative;
                    .eachPeople {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        img {
                            width: 42px;
                            height: 42px;
                            margin-right: 10px;
                            border-radius: 50%;
                        }
                        &__profile {
                            h1 {
                                color: $gray-1;
                                font-size: $font-size-14;
                                font-weight: 400;
                                font-family: $font-family;
                            }
                            .department {
                                display: flex;
                                p {
                                    color: $gray-3;
                                    font-size: $font-size-14;
                                    font-family: $font-family;
                                    font-weight: 400;
                                    margin-right: 5px;
                                    margin-top: 5px;
                                }
                            }
                        }
                    }
                    .deletePerson {
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        cursor: pointer;
                    }
                }
            }
            &__buttonGroup {
                display: flex;
                justify-content: center;
                margin-top: 20px;
                .button--cancel {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    border: 1px solid $gray-1;
                    border-radius: 18px;
                    text-align: center;
                    margin: 0 15px;
                    cursor: pointer;
                    text-decoration: none;
                    color: $gray-1;
                }

                .button--save {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    border: 1px solid $gray-1;
                    border-radius: 18px;
                    text-align: center;
                    color: $white;
                    background-color: $gray-1;
                    margin: 0 15px;
                    cursor: pointer;
                }
            }
        }
    }
}
//外部人員彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .outterPeoplePopUp {
        width: 90%;
        height: 80vh;
        display: flex;
        .SMS_content {
            width: 50%;
            background-color: $white;
            border-radius: 4px;
            padding: 20px;
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 500;
                font-family: $font-family;
            }
            .subject {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                h3 {
                    margin-right: 5px;
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
            }
            .contentTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                h3 {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    span {
                        color: red;
                        margin-right: 5px;
                    }
                }
                .commonMessage {
                    width: 72px;
                    height: 25px;
                    line-height: 25px;
                    background-color: $primary-1;
                    border-radius: 12.5px;
                    color: $white;
                    font-size: $font-size-12;
                    font-weight: 400;
                    font-family: $font-family;
                    text-align: center;
                    cursor: pointer;
                }
            }
            .inputWrap {
                border: 1px solid $gray-3;
                border-radius: 5px;
                margin-top: 10px;
                margin-bottom: 15px;
            }
            .messageCount {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                .messageInfo {
                    margin-top: 15px;
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: flex-start;
                    .wordCount {
                        width: 100px;
                        padding: 10px 0;
                        margin-right: 5px;
                        border-radius: 20px;
                        background-color: $primary-3;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .numOfMessage {
                        width: 100px;
                        padding: 10px 0;
                        margin-right: 5px;
                        border-radius: 20px;
                        background-color: $primary-3;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .point {
                        width: 100px;
                        padding: 10px 0;
                        border-radius: 20px;
                        background-color: $primary-3;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
        .SMS_setting {
            width: 50%;
            background-color: $white;
            margin-left: 20px;
            border-radius: 4px;
            padding: 20px;
            position: relative;
            .closeIcon {
                width: 28px;
                position: absolute;
                right: 20px;
                top: 20px;
                cursor: pointer;
            }
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 500;
                font-family: $font-family;
            }
            h3 {
                color: $gray-3;
                font-size: $font-size-14;
                font-weight: 400;
                font-family: $font-family;
                margin-bottom: 5px;
                text-align: right;
            }
            .manual {
                &__type-area {
                    .n-input {
                        width: 100%;
                        margin-bottom: 10px;
                    }
                }
                &__msg-groupChatCount {
                    color: $danger;
                }
                &__instructions {
                    h4 {
                        color: $gray-1;
                        font-size: $font-size-14;
                        font-weight: 400;
                        margin-top: 5px;
                        margin-bottom: 15px;
                    }
                    p {
                        line-height: 1.4;
                        margin-bottom: 10px;
                    }
                    .instructions__list {
                        list-style-type: decimal;
                        margin-left: 22px;
                        li {
                            color: $gray-1;
                            font-size: $font-size-14;
                            font-weight: 400;
                            font-family: $font-family;
                            line-height: 1.5;
                            margin-bottom: 10px;
                        }
                    }
                }
                .exceedAlert {
                    color: $danger;
                    margin-top: 5px;
                }
            }
            .automatic {
                padding: 0 15px 15px;
                .upload {
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
                    &__file {
                        max-width: 286px;
                        display: flex;
                        align-items: center;
                        margin: 0 auto;
                        .n-upload {
                            max-width: 90px;
                        }
                    }
                    &__img {
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
                    &__text {
                        a {
                            text-decoration: none;
                            h2 {
                                font-size: $font-size-16;
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
                            font-size: $font-size-16;
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
                &__instructions {
                    padding: 10px;
                    h4 {
                        color: $gray-1;
                        font-size: $font-size-14;
                        font-weight: 600;
                        font-family: $font-family;
                        margin-bottom: 10px;
                        margin-top: 20px;
                    }

                    span {
                        color: $danger;
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    a {
                        text-decoration: none;
                    }
                    .instructions__list {
                        list-style-type: decimal;
                        margin-left: 22px;
                        li {
                            color: $gray-1;
                            font-size: $font-size-14;
                            font-weight: 400;
                            font-family: $font-family;
                            line-height: 1.5;
                            margin-bottom: 10px;
                        }
                    }
                }
                &__name-list {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    > div {
                        display: flex;
                        align-items: center;

                        p + p {
                            margin-left: 30px;
                        }
                    }
                    img {
                        cursor: pointer;
                    }
                }
                .exceedAlert {
                    color: $danger;
                }
            }
            .selectLabel {
                padding: 15px;
                height: 425px;
                display: flex;
                .selectChannel {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    .title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 15px;
                        h1 {
                            color: $gray-1;
                            font-size: $font-size-16;
                            font-weight: 500;
                            font-family: $font-family;
                            margin-right: 5px;
                        }
                        p {
                            color: $gray-3;
                            font-size: $font-size-14;
                            font-family: $font-family;
                            font-weight: 400;
                        }
                    }
                    img {
                        width: 14px;
                        height: 14px;
                    }
                    .allChannel {
                        overflow-y: auto;
                        height: 300px;
                        margin-top: 20px;
                        .channelList {
                            display: flex;
                            margin-top: 20px;
                            margin-bottom: 10px;
                            .eachChannel {
                                display: flex;
                                align-items: center;
                                height: 40px;
                                margin-left: 15px;
                                img {
                                    width: 42px;
                                    height: 42px;
                                    margin-right: 10px;
                                    margin-left: 15px;
                                    border-radius: 50%;
                                }
                                &__profile {
                                    h1 {
                                        color: $gray-1;
                                        font-size: $font-size-14;
                                        font-weight: 400;
                                        font-family: $font-family;
                                    }
                                }
                            }
                        }
                    }
                }
                .label {
                    width: 50%;
                    overflow-y: auto;
                    .title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        h1 {
                            color: $gray-1;
                            font-size: $font-size-16;
                            font-weight: 500;
                            font-family: $font-family;
                        }
                    }
                    .tags {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        border-radius: 4px;
                        padding: 0 5px;
                        // overflow-y: auto;
                        > p {
                            margin-left: 5px;
                            color: $gray-4;
                        }
                        .tag {
                            width: fit-content;
                            background-color: $white;
                            height: 25px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border-radius: 20px;
                            border: 1px solid $primary-3;
                            padding: 5px 10px;
                            margin: 5px 5px;
                            cursor: pointer;
                            &.active {
                                background-color: $primary-3;
                            }
                        }
                    }
                }
            }
            .labelCount {
                h1 {
                    text-align: center;
                    margin-top: 5px;
                }
                .alert {
                    color: red;
                }
                p {
                    margin-top: 5px;
                    color: red;
                    text-align: center;
                }
                .confirm {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    margin: auto;
                    text-align: center;
                    background-color: $gray-1;
                    border-radius: 18px;
                    cursor: pointer;
                    margin-top: 20px;
                    p {
                        display: inline;
                        font-size: $font-size-14;
                        font-weight: 400;
                        font-family: $font-family;
                        color: #fff;
                    }
                }
            }
            .next-page {
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
                    font-size: $font-size-14;
                    font-weight: 400;
                    font-family: $font-family;
                    color: #fff;
                }
            }
        }
    }
}
//外部人員確認談窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .outterPeopleConfirm {
        width: 90%;
        height: 80vh;
        display: flex;
        .SMS_content {
            width: 50%;
            background-color: $white;
            margin-left: 20px;
            border-radius: 4px;
            padding: 20px;
            position: relative;
            .contentTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                h1 {
                    color: $gray-1;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                }
                .messageCount {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    .messageInfo {
                        margin-top: 15px;
                        margin-bottom: 15px;
                        display: flex;
                        justify-content: flex-start;
                        .wordCount {
                            width: 100px;
                            padding: 10px 0;
                            margin-right: 5px;
                            border-radius: 20px;
                            background-color: $primary-3;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .numOfMessage {
                            width: 100px;
                            padding: 10px 0;
                            margin-right: 5px;
                            border-radius: 20px;
                            background-color: $primary-3;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .point {
                            width: 100px;
                            padding: 10px 0;
                            border-radius: 20px;
                            background-color: $primary-3;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
            }
            .contentWrap {
                background-color: #f9f9f9;
                padding: 15px;
                .subject {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
                .content {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
            }
        }
        .SMS_recipientInformation {
            width: 50%;
            background-color: $white;
            margin-left: 20px;
            border-radius: 4px;
            padding: 20px;
            position: relative;
            .informationTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                h1 {
                    color: $gray-1;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                }
                img {
                    cursor: pointer;
                }
            }
            .contentWrap {
                background-color: #f9f9f9;
                padding: 15px;
                margin-bottom: 60px;
                .time {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
                .list {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
                .alertPoint {
                    color: red;
                }
            }
            .outterPopUpButton {
                display: flex;
                justify-content: center;
                align-items: center;
                .previousPage {
                    width: 170px;
                    height: 36px;
                    border: 1px solid $gray-1;
                    line-height: 36px;
                    text-align: center;
                    border-radius: 18px;
                    cursor: pointer;
                }
                .confirm {
                    width: 200px;
                    height: 36px;
                    border-radius: 18px;
                    line-height: 36px;
                    text-align: center;
                    color: $white;
                    background-color: $gray-1;
                    margin-left: 15px;
                    cursor: pointer;
                }
            }
        }
    }
}
//簡訊服務條款彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        border-radius: 5px;
        width: 900px;
        min-height: 658px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        &__title {
            position: relative;
            h2 {
                text-align: center;
                margin-bottom: 30px;
                @extend %h2;
            }
            img {
                position: absolute;
                right: -20px;
                top: -20px;
                cursor: pointer;
            }
        }
        .instructions__list {
            list-style-type: decimal;
            margin-left: 22px;
            li {
                color: $gray-1;
                font-size: $font-size-14;
                font-weight: 400;
                font-family: $font-family;
                line-height: 1.5;
                margin-bottom: 10px;
            }
        }
        &__confirm {
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
//無效名單彈窗
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
            font-size: $font-size-16;
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
        justify-content: center;
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
// 常用簡訊
.mask {
    .commonMsg {
        border-radius: 5px;
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
            font-size: $font-size-16;
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
    .commonMsgFunctionBar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;
        .commonMsgDel {
            text-align: center;
            width: 100px;
            height: 36px;
            line-height: 36px;
            border-radius: 18px;
            border: 1px solid $danger;
            color: $danger;
            cursor: pointer;
        }
        .commonMsgAdd {
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
        .commonMsgConfirm {
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
//新增常用簡訊
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
        font-size: $font-size-12;
        font-weight: 400;
        font-family: $font-family;
    }
}
.mask {
    .commonMsg {
        border-radius: 5px;
        width: 900px;
        height: 700px;
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
                font-size: $font-size-16;
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
        .smsSubject {
            width: 60%;
            margin: 0 auto;
            margin-top: 30px;
            margin-bottom: 30px;
            .subject {
                display: flex;
                margin-bottom: 15px;
                h3 {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    display: inline-block;
                    min-width: 56px;
                }
                p {
                    font-size: $font-size-12;
                    font-weight: 400;
                    color: $gray-3;
                    font-family: $font-family;
                    line-height: 1.6;
                }
            }
        }
        .smsSendContent2 {
            width: 60%;
            margin: 0 auto;
            .lazyWrap {
                display: flex;
                justify-content: flex-start;
                width: 200px;
            }

            .contentTitle {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                h3 {
                    font-size: $font-size-14;
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
                    font-size: $font-size-12;
                    font-weight: 400;
                    font-family: $font-family;
                    text-align: center;
                    cursor: pointer;
                }
                .n-input {
                    font-size: $font-size-12;
                }
            }
        }

        .messageCount {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-left: 170px;
            .messageInfo {
                margin-top: 15px;
                margin-bottom: 15px;
                display: flex;
                justify-content: flex-start;
                .wordCount {
                    width: 100px;
                    padding: 10px 0;
                    margin-right: 5px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .numOfMessage {
                    width: 100px;
                    padding: 10px 0;
                    margin-right: 5px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .point {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
}
// 刪除常用簡訊彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .deleteCommonMsgPopUp {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .deleteCommonMsgConfirm {
            font-size: $font-size-16;
            color: $gray-1;
            letter-spacing: -0.1px;
            min-width: 342px;
            text-align: left;
            line-height: 22px;
        }
        .buttonContainer {
            margin-top: 20px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            & .cancel {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $white;
                color: $gray-5;
                margin-right: 16px;
                &:hover,
                &:active {
                    background: $gray-4;
                    color: $white;
                }
            }
            & .confirm {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: rgba(223, 54, 54, 0.7);
                color: $white;
                &:hover,
                &:active {
                    background-color: #df3636;
                }
            }
        }
    }
}
</style>
