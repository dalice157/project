import { employeeList } from '../components/common/options.js';

// 遮罩會員個人資料
export function showPersonalData(value, memberDeleteStatus, dataType) {
  if (value === null || value === '') return value;
  let maskStar = '*';
  if (memberDeleteStatus === 2 || memberDeleteStatus === 3) {
    switch (dataType) {
      case 'email':
        for (let i = 0; i < value.length - 1; i++) {
          if (value.charAt(i) === '@') {
            maskStar += '@';
          } else {
            maskStar += '*';
          }
        }
        return value.charAt(0) + maskStar;
      case 'identityOrPassport':
        for (let i = 0; i < value.length - 6; i++) {
          maskStar += '*';
        }
        return value.slice(0, 3) + maskStar + value.slice(-3);
      case 'phone':
        return value.slice(0, value.length - 4) + '****';
      case 'acCellphone':
      case 'cellphone':
        return value.slice(0, value.length - 6) + '******';
      case 'address':
      case 'firstName':
        for (let i = 0; i < value.length; i++) {
          maskStar += '*';
        }
        return maskStar;
      default:
        break;
    }
    return '';
  } else {
    return value;
  }
}

export function mappingStaffName(staffNo) {
  let no;
  if ((typeof staffNo).toString() === 'number') {
    no = staffNo.toString();
  }
  if ((typeof staffNo).toString() === 'string') {
    no = staffNo;
  }

  if (no && no.length < 4) {
    no = no.padStart(4, '0');
  }

  let employeeName = '';
  employeeList.map((item) => {
    if (no === item.value) {
      employeeName = item.label;
    }
    return employeeName;
  });
  return employeeName;
}

export function isGigId(gigId) {
  if (gigId === 'Gig-Other') return true;
  const regex = /^Gig-[\d]*$/;

  return regex.test(gigId);
}

// 對齊 AC EMAIL 檢核
export const REGEX_EMAIL = /^[A-Za-z0-9_.-]+(\.[A-Za-z0-9_.-]+)*@[A-Za-z0-9_.-]+(\.[A-Za-z0-9_.-]+)*(\.[A-Za-z]{2,})$/;
