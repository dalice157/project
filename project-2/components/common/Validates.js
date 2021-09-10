import * as yup from 'yup';
import { REGEX_EMAIL } from '../../util/commonUtil';


const miniumSalary = 1;

const validateActiveMember = yup.object().shape({
  pid: yup.string().required('請輸入必填欄位'),
});

const validateAcManual = yup.object().shape({
  pid: yup.string().required('請輸入必填欄位'),
});

const validateAcEmail = yup.object().shape({
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: 'email格式不正確' })
    .required('請輸入必填欄位'),
});

const validateMember = yup.object().shape({
  acCellphone: yup.string().test({
    name: 'acCellphone',
    test(acCellphone) {
      const { telArea: acTelArea, tel: acTel } = this.parent.topperVerifyForm;
      if (!acCellphone && (!acTelArea || !acTel)) {
        return this.createError({
          message: '手機或室內電話需擇一填寫',
          path: this.path,
        });
      }

      if (acCellphone) {
        if (!acCellphone.match(/^[+]?[0-9]{10,15}$/)) {
          return this.createError({
            message: '請填寫正確行動電話',
            path: this.path,
          });
        }
      }

      return true;
    },
  }),
  areaData: yup.object({
    no: yup.string()
      .nullable()
      .required('請選擇地區'),
    desc: yup.string()
      .nullable()
      .required('請選擇地區'),
  }),
  industryData: yup.object().when('topperVerifyForm.chosenRole', {
    is: 'company',
    then: yup.object({
      no: yup.string()
        .nullable()
        .required('請選擇產業類別'),
      desc: yup.string()
        .nullable()
        .required('請選擇產業類別'),
    }),
  }),
  topperVerifyForm: yup.object().shape({
    sex: yup.string().nullable().required('請選擇性別'),
    birthday: yup.string().required('請選擇生日'),
    emailInfo: yup.object().shape({
      email: yup.string()
        .nullable()
        .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
        .required('請填寫電子信箱'),
    }),
    invoiceRecord: yup.object().when('chosenRole', {
      is: 'company',
      then: yup.object().shape({
        invoiceNum: yup
          .string()
          .ensure()
          .required('請填寫統一編號')
          .matches(/^[0-9]{8}$/, {
            message: '請填寫正確統編，應為8位半形數字',
          }),
        companyName: yup.string().nullable().required('請填寫公司名稱'),
        employeeCount: yup.number().test('employeeCount', '請選擇員工人數', value => value !== 0).required('請選擇員工人數'),
        jobTitle: yup.number().test('jobTitle', '請選擇職稱', value => value !== 0).required('請選擇職稱'),
      }),
    }),
    address: yup.string().ensure().required('請填寫正確地址'),
    telArea: yup
      .string()
      .ensure()
      .max(5, '請填寫正確區碼')
      .matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
    tel: yup
      .string()
      .ensure()
      .when('telArea', {
        is: val => val !== '',
        then: yup
          .string()
          .required('請填寫正確電話號碼')
          .min(5, '不得少於5碼')
          .max(20, '不得超過20碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, {
            message: '請填寫正確電話號碼',
          }),
        otherwise: yup.string().ensure().oneOf([''], '請填寫正確電話號碼'),
      }),
    roleType: yup.number().when('chosenRole', {
      is: 'personal',
      then: yup.number().required().min(1, '請選擇身分類別'),
    }),
  }),
});

const validateDemand = yup.object().shape({
  demandDAO: yup.object().shape({
    offReason: yup.number().when('onlineStatusOption', {
      is: 3,
      then: yup.number().min(0, '結案退刊需填寫結案理由'),
    }),
    demandBody: yup.object().shape({
      title: yup
        .string()
        .required('請填寫案件標題')
        .ensure()
        .max(20, '標題不得超過20個字'),
      desc: yup
        .string()
        .required('請填寫需求描述')
        .ensure()
        .max(2000, '需求描述不得超過2000個字'),
      minPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .when('unit', {
          is: 0,
          then: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(1, '論件計酬最低金額為 1 元'),
          otherwise: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(miniumSalary, `最低時薪金額為: ${miniumSalary}元`),
        }),
      maxPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .test('max-should-greater-than-min', '請填寫正確金額區間', function (
          max,
        ) {
          if (!this.parent.minPrice && !max) {
            return true;
          }
          return max >= this.parent.minPrice;
        }),
    }),
    demandCategory: yup.array().required('請選擇案件類別'),
    educationalStage: yup
      .number()
      .test('should-choose-educationalStage', '請選擇教學對象', function (
        educationalStage,
      ) {
        let isTutorSkill = false;
        this.parent.demandCategory.map((cat) => {
          if (Math.floor(cat / 1000000) === 1) {
            isTutorSkill = true;
          }
          return '';
        });
        // 若選擇了家教技能卻沒填教學對象，跳錯誤訊息
        if (isTutorSkill && !educationalStage) {
          return false;
        }
        return true;
      }),
    oldSiteCaseNo: yup
      .mixed()
      .test('must-be-number', '請輸入正確數字', (oldSiteCaseNo) => {
        if (oldSiteCaseNo && oldSiteCaseNo.length > 0) {
          // 若非數字，回傳false
          return !isNaN(oldSiteCaseNo);
        }
        return true;
      }),
  }),
  name: yup.string().max(20, '最多輸入20個字').required('請填寫姓名'),
  gender: yup.string().required('請選擇性別'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  telArea: yup
    .string()
    .nullable()
    .ensure()
    .max(5, '請填寫正確區碼')
    .matches(/(^\d{1,5}$)|(^$)/, { message: '請填寫正確區碼' }),
  tel: yup
    .string()
    .nullable()
    .ensure()
    .when('telArea', {
      is: val => val !== '',
      then: yup
        .string()
        .min(5, '請填寫正確長度的室內號碼')
        .max(20, '請填寫正確長度的室內號碼')
        .matches(/(^([0-9]+)(?:(?:#)([0-9]+))?$)|(^$)/, {
          message: '請填寫正確格式的電話號碼',
        }),
      otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
    }),
  cellphone: yup
    .string()
    .nullable()
    .matches(/(^[+]?[0-9]{10,15}$)|(^$)/, {
      message: '請填寫正確格式的行動電話',
    })
    .min(10, '請填寫正確長度的手機號碼')
    .max(15, '請填寫正確長度的手機號碼'),
});

const validateTutorDemand = yup.object().shape({
  demandDAO: yup.object().shape({
    character: yup.number()
      .nullable()
      .required('請選擇案件類型'),
    offReason: yup.number().when('onlineStatusOption', {
      is: 3,
      then: yup.number().min(0, '結案退刊需填寫結案理由'),
    }),
    demandBody: yup.object().shape({
      partnerCount: yup.number()
        .typeError('請選擇需求人數')
        .required('請選擇需求人數'),
      title: yup
        .string()
        .required('請填寫案件標題')
        .ensure()
        .max(20, '標題不得超過20個字'),
      desc: yup
        .string()
        .required('請填寫需求描述')
        .ensure()
        .max(2000, '需求描述不得超過2000個字'),
      minPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .when('unit', {
          is: 0,
          then: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(1, '論件計酬最低金額為 1 元'),
          otherwise: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(miniumSalary, `最低時薪金額為: ${miniumSalary}元`),
        }),
      maxPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .test('max-should-greater-than-min', '請填寫正確金額區間', function (
          max,
        ) {
          if (!this.parent.minPrice && !max) {
            return true;
          }
          return max >= this.parent.minPrice;
        }),
    }),
    demandCategory: yup.array().required('請選擇案件類別'),
    oldSiteCaseNo: yup
      .mixed()
      .test('must-be-number', '請輸入正確數字', (oldSiteCaseNo) => {
        if (oldSiteCaseNo && oldSiteCaseNo.length > 0) {
          // 若非數字，回傳false
          return !isNaN(oldSiteCaseNo);
        }
        return true;
      }),
    demandTutorInfo: yup.object().shape({
      experience: yup.number()
        .nullable()
        .min(0, '請選擇經驗需求')
        .required('請選擇經驗需求'),
      jobOccupation: yup.array()
        .of(yup.number())
        .min(1, '請選擇希望身份')
        .required('請選擇希望身份'),
      studentTotal: yup.number()
        .nullable()
        .required('請選擇上課人數'),
      studentSex: yup.number()
        .nullable()
        .min(0, '請選擇學生性別')
        .required('請選擇學生性別'),
      classFrequencyUnit: yup.number()
        .nullable()
        .min(0, '請選擇週期種類')
        .required('請選擇週期種類'),
      classFrequencyTime: yup.number()
        .nullable()
        .min(1, '請選擇上課次數')
        .required('請選擇上課次數'),
      classFrequencyHour: yup.number()
        .nullable()
        .min(0.5, '請選擇上課時數')
        .required('請選擇上課時數'),
      classEveryWeekDay: yup.array()
        .of(yup.number())
        .min(1, '請選擇週間')
        .required('請選擇週間'),
      classEveryWeekHourBegin: yup.number()
        .nullable()
        .required('請選擇起始時間'),
      classEveryWeekHourEnd: yup.number()
        .nullable()
        .required('請選擇結束時間'),
    }),
    educationalStage: yup.number()
      .required('請選擇教學對象'),
  }),
  name: yup.string().max(20, '最多輸入20個字').required('請填寫姓名'),
  gender: yup.string().required('請選擇性別'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  telArea: yup
    .string()
    .nullable()
    .ensure()
    .max(5, '請填寫正確區碼')
    .matches(/(^\d{1,5}$)|(^$)/, { message: '請填寫正確區碼' }),
  tel: yup
    .string()
    .nullable()
    .ensure()
    .when('telArea', {
      is: val => val !== '',
      then: yup
        .string()
        .min(5, '請填寫正確長度的室內號碼')
        .max(20, '請填寫正確長度的室內號碼')
        .matches(/(^([0-9]+)(?:(?:#)([0-9]+))?$)|(^$)/, {
          message: '請填寫正確格式的電話號碼',
        }),
      otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
    }),
  cellphone: yup
    .string()
    .nullable()
    .matches(/(^[+]?[0-9]{10,15}$)|(^$)/, {
      message: '請填寫正確格式的行動電話',
    })
    .min(10, '請填寫正確長度的手機號碼')
    .max(15, '請填寫正確長度的手機號碼'),
});

const validateCaseDemand = yup.object().shape({
  demandDAO: yup.object().shape({
    character: yup.number()
      .nullable()
      .required('請選擇案件類型'),
    offReason: yup.number().when('onlineStatusOption', {
      is: 3,
      then: yup.number().min(0, '結案退刊需填寫結案理由'),
    }),
    demandBody: yup.object().shape({
      title: yup
        .string()
        .required('請填寫案件標題')
        .ensure()
        .max(20, '標題不得超過20個字'),
      desc: yup
        .string()
        .required('請填寫需求描述')
        .ensure()
        .max(2000, '需求描述不得超過2000個字'),
      minPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .when('unit', {
          is: 0,
          then: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(1, '論件計酬最低金額為 1 元'),
          otherwise: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(miniumSalary, `最低時薪金額為: ${miniumSalary}元`),
        }),
      maxPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .test('max-should-greater-than-min', '請填寫正確金額區間', function (
          max,
        ) {
          if (!this.parent.minPrice && !max) {
            return true;
          }
          return max >= this.parent.minPrice;
        }),
    }),
    demandCategory: yup.array().required('請選擇案件類別'),
    oldSiteCaseNo: yup
      .mixed()
      .test('must-be-number', '請輸入正確數字', (oldSiteCaseNo) => {
        if (oldSiteCaseNo && oldSiteCaseNo.length > 0) {
          // 若非數字，回傳false
          return !isNaN(oldSiteCaseNo);
        }
        return true;
      }),
    demandOutsourceInfo: yup.object().shape({
      experience: yup.number()
        .nullable()
        .min(0, '請選擇經驗需求')
        .required('請選擇經驗需求'),
      jobOccupation: yup.array()
        .of(yup.number())
        .min(1, '請選擇希望身份')
        .required('請選擇希望身份'),
    }),
  }),
  name: yup.string().max(20, '最多輸入20個字').required('請填寫姓名'),
  gender: yup.string().required('請選擇性別'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  telArea: yup
    .string()
    .nullable()
    .ensure()
    .max(5, '請填寫正確區碼')
    .matches(/(^\d{1,5}$)|(^$)/, { message: '請填寫正確區碼' }),
  tel: yup
    .string()
    .nullable()
    .ensure()
    .when('telArea', {
      is: val => val !== '',
      then: yup
        .string()
        .min(5, '請填寫正確長度的室內號碼')
        .max(20, '請填寫正確長度的室內號碼')
        .matches(/(^([0-9]+)(?:(?:#)([0-9]+))?$)|(^$)/, {
          message: '請填寫正確格式的電話號碼',
        }),
      otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
    }),
  cellphone: yup
    .string()
    .nullable()
    .matches(/(^[+]?[0-9]{10,15}$)|(^$)/, {
      message: '請填寫正確格式的行動電話',
    })
    .min(10, '請填寫正確長度的手機號碼')
    .max(15, '請填寫正確長度的手機號碼'),
});

const validateTutorDemandv3 = yup.object().shape({
  areaData: yup.object()
    .when('demandDAO.designatedPlace', {
      is: true,
      then: yup.object({
        areaNo: yup.string()
          .nullable()
          .required('請選擇指定地點'),
        areaDesc: yup.string()
          .nullable()
          .required('請選擇指定地點'),
      }),
    }),
  demandDAO: yup.object().shape({
    character: yup.number()
      .nullable()
      .required('請選擇案件類型'),
    offReason: yup.number().when('onlineStatusOption', {
      is: 3,
      then: yup.number().min(0, '結案退刊需填寫結案理由'),
    }),
    demandBody: yup.object().shape({
      title: yup
        .string()
        .required('請填寫案件標題')
        .ensure()
        .max(20, '標題不得超過20個字'),
      desc: yup
        .string()
        .required('請填寫需求描述')
        .ensure()
        .max(2000, '需求描述不得超過2000個字'),
      minPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .when('unit', {
          is: 0,
          then: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(1, '論件計酬最低金額為 1 元'),
          otherwise: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(miniumSalary, `最低時薪金額為: ${miniumSalary}元`),
        }),
      maxPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .test('max-should-greater-than-min', '請填寫正確金額區間', function (
          max,
        ) {
          if (!this.parent.minPrice && !max) {
            return true;
          }
          return max >= this.parent.minPrice;
        }),
    }),
    demandCategory: yup.array().required('請選擇案件類別'),
    oldSiteCaseNo: yup
      .mixed()
      .test('must-be-number', '請輸入正確數字', (oldSiteCaseNo) => {
        if (oldSiteCaseNo && oldSiteCaseNo.length > 0) {
          // 若非數字，回傳false
          return !isNaN(oldSiteCaseNo);
        }
        return true;
      }),
    demandTutorInfo: yup.object().shape({
      experience: yup.number()
        .nullable()
        .min(0, '請選擇經驗需求')
        .required('請選擇經驗需求'),
      jobOccupation: yup.array()
        .of(yup.number())
        .min(1, '請選擇希望身份')
        .required('請選擇希望身份'),
      educationalGrade: yup.number()
        .nullable()
        .when('demandDAO.educationalStage', {
          is: number => number >= 2 && number <= 4,
          then: yup.number().required('請選擇年級'),
        }),
      studentTotal: yup.number()
        .nullable()
        .required('請選擇上課人數'),
      studentSex: yup.number()
        .nullable()
        .min(0, '請選擇學生性別')
        .required('請選擇學生性別'),
      classFrequencyUnit: yup.number()
        .nullable()
        .min(0, '請選擇週期種類')
        .required('請選擇週期種類'),
      classFrequencyTime: yup.number()
        .nullable()
        .min(1, '請選擇上課次數')
        .required('請選擇上課次數'),
      classFrequencyHour: yup.number()
        .nullable()
        .min(0.5, '請選擇上課時數')
        .required('請選擇上課時數'),
      classEveryWeekDay: yup.array()
        .of(yup.number())
        .min(1, '請選擇週間')
        .required('請選擇週間'),
      classEveryWeekHourBegin: yup.number()
        .nullable()
        .required('請選擇起始時間'),
      classEveryWeekHourEnd: yup.number()
        .nullable()
        .required('請選擇結束時間'),
      classDuration: yup.number().nullable()
        .required('請選擇上課期限'),
      classWay: yup.array().nullable()
        .of(yup.number())
        .min(1, '請選擇期望上課方式')
        .required('請選擇期望上課方式'),
    }),
    educationalStage: yup.number().nullable()
      .required('請選擇教學對象'),
  }),
  name: yup.string().max(20, '最多輸入20個字').required('請填寫姓名'),
  sex: yup.string().required('請選擇性別'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  contactTimeBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  contactTimeEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
  telArea: yup.string().nullable().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string().nullable()
    .when('telArea',
      {
        is: val => val !== '',
        then: yup.string()
          .nullable().max(20, '請填寫正確電話號碼').min(5, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string()
          .nullable().min(5, '請填寫正確電話號碼').max(20, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
      }),
  cellphone: yup.string().nullable()
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
});

const validateCaseDemandv3 = yup.object().shape({
  areaData: yup.object()
    .when('demandDAO.designatedPlace', {
      is: true,
      then: yup.object({
        areaNo: yup.string()
          .nullable()
          .required('請選擇指定地點'),
        areaDesc: yup.string()
          .nullable()
          .required('請選擇指定地點'),
      }),
    }),
  demandDAO: yup.object().shape({
    character: yup.number()
      .nullable()
      .required('請選擇案件類型'),
    offReason: yup.number().when('onlineStatusOption', {
      is: 3,
      then: yup.number().min(0, '結案退刊需填寫結案理由'),
    }),
    demandBody: yup.object().shape({
      title: yup
        .string()
        .required('請填寫案件標題')
        .ensure()
        .max(20, '標題不得超過20個字'),
      desc: yup
        .string()
        .required('請填寫需求描述')
        .ensure()
        .max(2000, '需求描述不得超過2000個字'),
      minPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .when('unit', {
          is: 0,
          then: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(1, '論件計酬最低金額為 1 元'),
          otherwise: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(miniumSalary, `最低時薪金額為: ${miniumSalary}元`),
        }),
      maxPrice: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('請填寫正確金額區間')
        .test('max-should-greater-than-min', '請填寫正確金額區間', function (
          max,
        ) {
          if (!this.parent.minPrice && !max) {
            return true;
          }
          return max >= this.parent.minPrice;
        }),
    }),
    demandCategory: yup.array().required('請選擇案件類別'),
    oldSiteCaseNo: yup
      .mixed()
      .test('must-be-number', '請輸入正確數字', (oldSiteCaseNo) => {
        if (oldSiteCaseNo && oldSiteCaseNo.length > 0) {
          // 若非數字，回傳false
          return !isNaN(oldSiteCaseNo);
        }
        return true;
      }),
    demandOutsourceInfo: yup.object().shape({
      experience: yup.number()
        .nullable()
        .min(0, '請選擇經驗需求')
        .required('請選擇經驗需求'),
      jobOccupation: yup.array()
        .of(yup.number())
        .min(1, '請選擇希望身份')
        .required('請選擇希望身份'),
    }),
  }),
  name: yup.string().max(20, '最多輸入20個字').required('請填寫姓名'),
  sex: yup.string().required('請選擇性別'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  contactTimeBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  contactTimeEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
  telArea: yup.string().nullable().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string().nullable()
    .when('telArea',
      {
        is: val => val !== '',
        then: yup.string()
          .nullable().max(20, '請填寫正確電話號碼').min(5, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string()
          .nullable().min(5, '請填寫正確電話號碼').max(20, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
      }),
  cellphone: yup.string().nullable()
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
});

const validateDemandWindowId = yup.object().shape({
  demandId1: yup
    .string()
    .matches(/^\d+$/, '第一個ID含有非數字的字元')
    .required('第一個ID是必填的'),
  demandId2: yup
    .string()
    .matches(/^\d+$/, '第二個ID含有非數字的字元')
    .required('第二個ID是必填的'),
  demandId3: yup
    .string()
    .matches(/^\d+$/, '第三個ID含有非數字的字元')
    .required('第三個ID是必填的'),
});

const validateDemandWindowData = yup.object().shape({
  leftDemand: yup.object().shape({
    title: yup
      .string()
      .max(20, '標題不可超過20個字')
      .required('標題是必填的欄位'),
    demandId: yup.string().required('編號不可為空'),
    desc: yup
      .string()
      .max(2000, '說明不可超過2000個字')
      .required('說明是必填的欄位'),
  }),
  middleDemand: yup.object().shape({
    title: yup
      .string()
      .max(20, '標題不可超過20個字')
      .required('標題是必填的欄位'),
    demandId: yup.string().required('編號不可為空'),
    desc: yup
      .string()
      .max(2000, '說明不可超過2000個字')
      .required('說明是必填的欄位'),
  }),
  rightDemand: yup.object().shape({
    title: yup
      .string()
      .max(20, '標題不可超過20個字')
      .required('標題是必填的欄位'),
    demandId: yup.string().required('編號不可為空'),
    desc: yup
      .string()
      .max(2000, '說明不可超過2000個字')
      .required('說明是必填的欄位'),
  }),
});

const validateMultiSearchData = yup.object().shape({
  dateType: yup.string().required('必須選擇日期條件'),
  times: yup.object().shape({
    yearMonth: yup.string().required('必須選擇月份'),
  }),
  demandOptions: yup.object().shape({
    demandType: yup.string().required('必須選擇案件類別'),
  }),
  onlineStatus: yup.string().required('必須選擇刊登狀態'),
  depositStatus: yup.string().required('必須選擇押金狀態'),
  violationStatus: yup.string().required('必須選擇檢舉狀態'),
});

const validateReviewEditItemForm = yup.object().shape({
  demandTitle: yup.string().max(20, '標題不可超過20個字').required('請填入需求標題'),
  ranking1: yup.number().required('請選擇分數'),
  ranking2: yup.number().required('請選擇分數'),
  ranking3: yup.number().required('請選擇分數'),
  comment: yup.string().required('請填入評語'),
  memo: yup.string().required('請填入調整評價原因'),
});

const validateReviewItemForm = yup.object().shape({
  commentDate: yup.string().required('必須選擇日期條件'),
  demanderId: yup.number().when('oldSiteImport', {
    is: val => (val === undefined) || (val === false),
    then: yup.number().typeError('請填入數字').required('請填入案主編號'),
  }),
  demanderName: yup.string().required('請填入需求者姓氏'),
  demanderSex: yup.string().required('請填入稱謂'),
  demandId: yup.number().when('oldSiteImport', {
    is: val => (val === undefined) || (val === false),
    then: yup.number().typeError('請填入數字').required('請填入案件編號'),
  }),
  demandTitle: yup.string().max(20, '標題不可超過20個字').required('請填入需求標題'),
  ranking1: yup.number().required('請選擇分數'),
  ranking2: yup.number().required('請選擇分數'),
  ranking3: yup.number().required('請選擇分數'),
  comment: yup.string().required('請填入評語'),
});

const editService = yup.object().shape({
  serviceName: yup
    .string()
    .required('請填寫服務名稱')
    .max(20, '最多輸入20個字'),
  gigCats: yup.array().nullable().of(yup.number()).min(1, '請選擇服務類型')
    .required('請選擇服務類型'),
  assignPlace: yup.object().shape({
    no: yup.array().of(yup.number()).min(1, '請選擇服務地區').required('請選擇服務地區'),
  }),
  price: yup.number().typeError('請填寫服務金額').required('請填寫服務金額'),
  serviceWay: yup.array().of(yup.number()).min(1, '請選擇服務方式').required('請選擇服務方式'),
  serviceInterval: yup.array().of(yup.number()).min(1, '請選擇服務時段').required('請選擇服務時段'),

});

export {
  validateAcEmail,
  validateActiveMember,
  validateAcManual,
  validateMember,
  validateDemand,
  validateDemandWindowId,
  validateDemandWindowData,
  validateMultiSearchData,
  validateReviewItemForm,
  editService,
  validateTutorDemand,
  validateCaseDemand,
  validateTutorDemandv3,
  validateCaseDemandv3,
  validateReviewEditItemForm,
};
