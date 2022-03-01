<template>
    <div class="manageSetting">
        <div class="managerPermission">
            <div class="managerPermissionTitle">
                <h2>管理者權限</h2>
                <img src="../assets/Images/chatroom/add-circle.svg" alt="" @click="getCsList" />
            </div>
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    class="settingSearch"
                    v-model:value="search"
                    type="text"
                    placeholder="搜尋"
                    clearable
                >
                    <template #prefix>
                        <img src="../assets/Images/manage/search.svg" alt="#" />
                    </template>
                </n-input>
            </n-config-provider>
            <div class="adminList" v-if="filterPerson.length > 0">
                <ul>
                    <li v-for="p in filterPerson" :key="p.accountID">
                        <p>{{ p.name }}</p>
                        <n-icon size="16">
                            <close-circle-sharp @click="deletePopUp(p)" />
                        </n-icon>
                    </li>
                </ul>
            </div>
            <div class="noAdminList" v-else>
                <p>目前無管理人員!!</p>
            </div>
        </div>
    </div>
    <teleport to="body">
        <div class="mask2" v-show="showDelModal">
            <div class="deleteChannelPopUp">
                <div class="deleteChannelConfirm">您確定要刪除此管理者之管理權限!!</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click="cancelRemove">取消</div>
                    <div type="button" class="confirm" @click="removeAdmin">確定</div>
                </div>
            </div>
        </div>
    </teleport>
    <teleport to="body">
        <div class="mask" v-show="popUp === true">
            <div class="customService">
                <div class="customServiceTitle">
                    <h2>客服人員列表</h2>
                </div>
                <div class="staffList" v-if="staffList.length > 0">
                    <ul>
                        <li v-for="(staff, index) in staffList" :key="index">
                            <n-checkbox-group v-model:value="addList">
                                <div class="staffData">
                                    <p>{{ staff.name }}</p>
                                    <n-checkbox :value="staff"></n-checkbox>
                                </div>
                            </n-checkbox-group>
                        </li>
                    </ul>
                </div>
                <div class="noStaffList" v-else>
                    <p>目前尚無客服人員!!</p>
                </div>
                <div class="staffConfirm" @click="csToAdmin">確認</div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, onUpdated } from "vue";
import { NInput, NConfigProvider, NIcon, NCheckbox, NCheckboxGroup } from "naive-ui";
import { CloseCircleSharp } from "@vicons/ionicons5";
import { useApiStore } from "@/store/api";
import { storeToRefs } from "pinia";

//store
const apiStore = useApiStore();
const { getAdminList, addAdminList, removeAdminList, getCustomServiceStaffList } = apiStore;
const { adminList, staffList } = storeToRefs(apiStore);
getAdminList();

//搜尋新陣列
const adminArr: any = computed(() => adminList.value);
const search = ref("");
const filterPerson: any = computed(() => {
    const arr = adminArr.value.filter((p: any) => {
        return p.name.toLowerCase().includes(search.value.toLowerCase());
    });
    return arr;
});

//新增管理者權限
const popUp = ref(false);
const addList = ref([]);
const csList = ref([]);

const getCsList = () => {
    popUp.value = !popUp.value;
    addList.value = [];
    getCustomServiceStaffList();
};
const csToAdmin = () => {
    popUp.value = !popUp.value;
    csList.value = addList.value.map((item) => {
        return {
            accountID: item.accountID,
        };
    });
    if (csList.value.length !== 0) {
        const accounts = JSON.stringify(csList.value);
        addAdminList(accounts);
    }
};
//移除管理者權限
const showDelModal = ref(false);
const adminArray = ref([]);
const deletePopUp = (admin) => {
    showDelModal.value = true;
    const arr = ref([]);
    arr.value.push(admin);
    arr.value = arr.value.map((item) => {
        return {
            accountID: item.accountID,
        };
    });
    adminArray.value = arr.value;
    // console.log(adminArray.value);
};
const cancelRemove = () => {
    adminArray.value.pop();
    showDelModal.value = false;
};
const removeAdmin = () => {
    removeAdminList(adminArray.value);
    adminArray.value.pop();
    showDelModal.value = false;
};
const themeOverrides = {
    common: { primaryColor: "#FFb400" },
    Input: {
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
        borderRadius: "20px",
    },
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.settingSearch {
    &.n-input .n-input__input-el {
        height: 36px;
        line-height: 36px;
    }
}
.adminList {
    .n-icon {
        cursor: pointer;
        color: $gray-3;
        &:hover {
            color: $gray-2;
        }
    }
}
</style>
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
    .customService {
        width: 590px;
        height: 665px;
        background-color: $white;
        padding: 25px 0px;
        .customServiceTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 0 20px;
            h2 {
                font-family: $font-family;
                font-size: 16px;
                font-weight: 500;
                color: $gray-1;
            }
            img {
                width: 27px;
                height: 27px;
                cursor: pointer;
            }
        }
        .staffList {
            overflow-y: auto;
            height: 500px;
            ul {
                li {
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    position: relative;
                    .staffData {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    &::after {
                        position: absolute;
                        content: "";
                        width: 93%;
                        height: 1px;
                        bottom: 0;
                        background-color: #eeeeee;
                    }
                }
            }
        }
        .noStaffList {
            height: 500px;
            display: flex;
            justify-content: center;
            p {
                margin-top: 5px;
            }
        }
        .staffConfirm {
            width: 100px;
            height: 36px;
            line-height: 36px;
            border: 1px solid $gray-1;
            border-radius: 18px;
            text-align: center;
            color: $white;
            background-color: $gray-1;
            cursor: pointer;
            margin: 30px auto;
        }
    }
}
.mask2 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .deleteChannelPopUp {
        border-radius: 20px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .deleteChannelConfirm {
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
.manageSetting {
    background-color: $bg;
    padding-top: 15px;
    min-height: 89%;
    .managerPermission {
        width: 590px;
        height: 100%;
        background-color: $white;
        margin: 0 auto;
        padding: 25px 20px;
        .managerPermissionTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
            }
            img {
                width: 27px;
                height: 27px;
                cursor: pointer;
            }
        }
        .n-input {
            box-shadow: 1px 2px 4px #e3e3e3;
            font-size: $font-size-14;
            img {
                width: 14px;
                height: 14px;
            }
        }
        .adminList {
            ul {
                margin-top: 25px;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid $border-line;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    p {
                        font-size: $font-size-14;
                        color: $gray-1;
                    }
                    img {
                        width: 14px;
                        height: 14px;
                        cursor: pointer;
                    }
                }
            }
        }
        .noAdminList {
            margin-top: 25px;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
