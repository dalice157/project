<template>
    <div class="addGroupChatRoomWrapper">
        <n-scrollbar style="max-height: calc(100vh - 170px)">
            <div class="addGroupChatRoom">
                <div class="groupChatHeader">
                    <n-upload @change="uploadAvatar($event)" :accept="avatarAccept" type="file">
                        <span style="color: red">*</span>
                        <div class="upload-avatar">
                            <img
                                class="upload-avatar--default"
                                :src="photoIcon"
                                alt="預設圖"
                                v-if="avatarStatus === 0"
                            />
                            <img
                                class="upload-avatar--active"
                                :src="`${config.fileUrl}${avatar.fileid}${avatar.ext}`"
                                :alt="avatar.fileName"
                                v-else
                            />
                        </div>
                    </n-upload>
                    <div class="groupChatTitle">
                        <div class="groupChatName">
                            <h1>群組名稱 <span style="color: red">*</span></h1>
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
                                            <h1>
                                                {{ people.name ? people.name : people.account }}
                                            </h1>
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
                    </div>
                    <div class="groupChatContent__buttonGroup">
                        <div class="button--cancel" @click="goGroupChat">取消</div>
                        <div class="button--save" @click="addGroupChatRoom(false)">確定建群</div>
                        <div class="button--invite" @click="addGroupChatRoom(true)">
                            確定建群並邀請外部人員
                        </div>
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
                                    class="searchPeople"
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
                                                        :disabled="people.accountID === accountID"
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
                                    <!-- 無關鍵字 部門未展開時 -->
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
                                                                    member.accountID === accountID
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
                                                        :disabled="people.accountID === accountID"
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
                                    v-if="people.accountID !== accountID"
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
    addGroup,
    getTagList,
    // getInternalDepartmentPeople,
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
const userName = ref(localStorage.getItem("userName"));
//v-model
const name = ref("");
const searchPeople = ref("");
// const searchDepartment = ref("");
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
        return (
            item.name.trim().toLowerCase().includes(`${searchPeople.value.trim().toLowerCase()}`) ||
            item.department
                .trim()
                .toLowerCase()
                .includes(`${searchPeople.value.trim().toLowerCase()}`) ||
            item.role.trim().toLowerCase().includes(`${searchPeople.value.trim().toLowerCase()}`)
        );
    });
});

//建立新頻道先加自己
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
            console.log("addressBookGetData res", res.data.contact);
            addressBookList.value = res.data.contact;
            let arr = [];
            arr = res.data.contact
                .filter((item) => {
                    return item.accountID === accountID.value;
                })
                .map((item) => {
                    return {
                        ...item,
                        owner: true,
                    };
                });
            innerPeople.value = arr;
            selectInnerPeople.value.push(innerPeople.value[0].accountID);
            getInternalDepartmentPeople();
        })
        .catch((err) => {
            this.bugout.error(`error-log${userName.value}`, err.response.status);
            this.bugout.error(`error-log${userName.value}`, err.response.data);
            this.bugout.error(`error-log${userName.value}`, err.response.request.responseURL);
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
            console.log("初始化各部門ID eachDepartmentAccountID", eachDepartmentAccountID.value);
            selectInternalDepartmentPeople.value.push(innerPeople.value[0].accountID);
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
};
//切換 tab 清空 搜尋關鍵字
const changeTabs = () => {
    searchPeople.value = "";
};
//同步人員及部門兩個 checkboxGroup 綁定的陣列
watch(selectInnerPeople, (newVal) => {
    selectInternalDepartmentPeople.value = newVal;
});
watch(selectInternalDepartmentPeople, (newVal) => {
    selectInnerPeople.value = newVal;
});
//總人員判斷有無全選
const isAll = computed(() => {
    return selectInnerPeople.value.length === addressBookList.value.length;
});
//總人員全選,全不選
const selectAll = (e) => {
    if (e === true) {
        selectInnerPeople.value = addressBookList.value.map((item) => item.accountID);
    } else {
        selectInnerPeople.value = selectInnerPeople.value.filter((people) => {
            return people === accountID.value;
        });
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
                    item === accountID.value
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
        return item !== accountID;
    });
    innerPeople.value = innerPeople.value.filter((item) => {
        return item.accountID !== accountID;
    });
};
//取消
const cancelStoreInnerPeople = () => {
    selectInnerPeople.value = innerPeople.value.map((item) => item.accountID);
    selectInnerPeoplePopUp.value = false;
};
//儲存內部人員
const storeInnerPeople = () => {
    //只留創建人
    innerPeople.value = innerPeople.value.filter((_, index) => {
        return index === 0;
    });
    innerPeople.value = innerPeople.value.concat(choosedPeople.value);
    //去重
    innerPeople.value = innerPeople.value.reduce((arr, people) => {
        const repeatPeople = arr.some((item) => item.accountID === people.accountID);
        if (!repeatPeople) {
            arr.push(people);
        }
        return arr;
    }, []);
    selectInnerPeoplePopUp.value = false;
    console.log("新增 innerPeople", innerPeople.value);
};

//返回群聊首頁
const goGroupChat = () => {
    innerPeople.value = [];
    router.push(`/groupChat`);
};
//創建群組
const addGroupChatRoom = (inviteOutterPeople) => {
    if (name.value === "" || avatar.value.fileid === "") {
        const channelName = name.value === "" ? "'活動名稱'" : "";
        const avatarIcon = avatar.value.fileid === "" ? "'頭像'" : "";
        alertMessage.value = `尚有欄位 ${channelName} ${avatarIcon} 未填寫`;
        return;
    }
    let innerPeopleString = innerPeople.value.map((p) => p.accountID);
    innerPeopleString = innerPeopleString.toString();
    let icon = avatar.value.fileid + avatar.value.ext;
    const addData = {
        name: name.value,
        icon,
        internelMember: innerPeopleString,
    };
    // console.log("新增群組資訊", addData);
    addGroup(addData);
    innerPeople.value = [];
    router.push("/groupChat");
    if (inviteOutterPeople === true) {
        openOutterPopUp();
    }
};

const demoContent =
    "輸入簡訊內容\n\n說明：\n１.支援『長簡訊』之發送,每則簡訊字數最多可達333（中文）字。\n２.超過333字仍可發送,系統將自動進行拆則。\n３.為使簡訊內容正常呈現於手機中,請勿在簡訊內容中填入~．^)|1>等特殊符號。";
//邀請外部人員彈窗
const openOutterPopUp = () => {
    selectOutterPeoplePopUp.value = 1;
    groupChatContent.value = demoContent;
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
    // padding-bottom: 45px;
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
                    width: 30%;
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
                        // max-height: 400px;
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
                    max-height: 400px;
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
                        margin-top: 15px;
                        display: flex;
                        justify-content: flex-start;
                        .member {
                            display: flex;
                            align-items: center;
                            img {
                                width: 42px;
                                height: 42px;
                                border-radius: 50%;
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
                // 人員tab
                .searchPeople {
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
                // 部門tab
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
</style>
