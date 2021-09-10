import {
  publishData, All5Steps, All4Steps, All3Steps, All2Steps, upgradePlanStep
} from '../components/ui/step/stepData';


export function stepIterator(user, isTestUser, isFree, fromLightbox, location) {
  const isStatus = () => {
    if (location) {
      const { pathname, query } = location;
      if (pathname == '/upgrade' || pathname == '/upgrade-pay' || pathname == '/upgrade-success') {
        return upgradePlanStep;
      }
      if (pathname == '/success' || query.publish) {
        if (query.publish) {
          console.log('publish');
          return publishData;
        }
        if (query.vipPay || query.pay) {
          console.log('All5Steps');
          return All5Steps;
        }
        if (query.newFree) {
          console.log('All4Steps');
          return All4Steps;
        }
        if (query.convertFreeDepositPay) {
          console.log('All3Steps');
          return All3Steps;
        }
      }

      if (location.query.type) { // 轉換會員
        if (isFree == 'freeTrial' || location.query.memberType === 'new') { // 新會員
          return All4Steps;
        }
        if (location.query.memberType === 'trial' || location.query.memberType === 'paid') {
          return All2Steps; // 體驗或刊期會員
        }
      }
    }

    if (user) {
      const {
        status: userStatus, meta: {
          credit, deposit, tutorRemainingPoint, topperInPaymentPeriod
        }
      } = user;
      if (isTestUser) {
        console.log('isTestUser');
        if (userStatus == 2) {
          if (fromLightbox == 'true') { // 跳完提示才來
            if (isFree == 'freeTrial') {
              return All4Steps;
            }
            if (tutorRemainingPoint > 0) {
              return All2Steps; // 選擇兌換點數的方案
            } else if (tutorRemainingPoint == 0) {
              return All3Steps; // 選擇付費方案並進行付費刊登
            }
          } else { // 從編輯接案檔案來
            return publishData;
          }
        } else {
          if (isFree == 'freeTrial') {
            return All4Steps;
          }
          return All5Steps;
        }
      }
      // 發布中的體驗會員
      if (userStatus == 2 && ((credit == 1 || deposit))) {
        if (fromLightbox == 'true') { // 跳完提示才來
          if (isFree == 'freeTrial') {
            return All4Steps;
          }
          if (tutorRemainingPoint > 0) {
            return All2Steps; // 選擇兌換點數的方案
          } else if (tutorRemainingPoint == 0) {
            return All3Steps; // 選擇付費方案並進行付費刊登
          }
        } else { // 從編輯接案檔案來
          return publishData;
        }
      }
      // 發布中的付費方案會員
      if (userStatus == 2 && topperInPaymentPeriod) {
        return publishData;
      }

      // 全新未刊登
      if (userStatus != 2 && (credit != 1 || !deposit) && (tutorRemainingPoint == 0 || tutorRemainingPoint > 0)) {
        if (isFree === 'freeTrial') {
          return All4Steps; // 選擇體驗，刊登
        }
        return All5Steps; // 編輯，付費，發布
      }
      return publishData;
    }
  };

  return isStatus();
}
