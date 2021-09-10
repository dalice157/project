import * as yup from 'yup';
import dayjs from 'dayjs';
import { REGEX_EMAIL } from './commonUtil';

const assignPlaceErrorMsg = '請選擇指定地點';

const validateJoinTutorDemand = yup.object().shape({
  enableUserData: yup.object().shape({
    originCellphone: yup.string().nullable(),
    sex: yup.string()
      .required('請選擇稱謂'),
    chosenRole: yup.string(),
    birthday: yup.string()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string()
          .nullable()
          .test('birthday', '請填寫生日', value => dayjs(value).format('YYYY-MM-DD') !== '1900-01-01')
          .test('birthday', '需年滿15歲，請選擇正確日期', value => dayjs().diff(value, 'years') >= 15)
          .required('請填寫生日'),
        otherwise: yup.string().nullable(),
      }),
    identityType: yup.string()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string()
          .required('請填寫身份資料'),
      }),
    identity: yup.string().nullable()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string()
          .when('identityType', {
            is: '0',
            then: yup.string()
              .required('請填寫身份資料')
              .matches(/^[a-zA-Z][0-9]{9}$|^[a-zA-Z][abcdABCD][0-9]{8}$|^[a-zA-Z][89][0-9]{8}$/, { message: '請填寫正確身份證' }),
          })
          .when('identityType', {
            is: '1',
            then: yup.string()
              .max(15, '請填寫正確護照號碼')
              .required('請填寫身份資料'),
          }),
      }),
    roleType: yup.string()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string().notOneOf(['0'],
          '請選擇身份類別'),
      }),
    companyName: yup.string().nullable()
      .when('chosenRole', {
        is: 'company',
        then: yup.string().required('請填寫公司名稱'),
      }),
    invoice: yup.string().nullable()
      .when('chosenRole', {
        is: 'company',
        then: yup.string()
          .required('請填寫公司統編')
          .matches(/^\d{8}$/, { message: '請填寫正確統一編號' }),
      }),
    employeeCount: yup.string()
      .when('chosenRole', {
        is: 'company',
        then: yup.string()
          .notOneOf(['0'], '請選擇公司規模'),
      }),
    industry: yup.object()
      .when('chosenRole', {
        is: 'company',
        then: yup.object({
          des: yup.string()
            .required('請選擇產業類別'),
        }),
      }),
    jobTitle: yup.string()
      .when('chosenRole', {
        is: 'company',
        then: yup.string().notOneOf(['0'], '請選擇您的職務類型'),
      }),
    address: yup.string().nullable()
      .required('請完整填寫地址資料'),
    emailInfo: yup.object().shape({
      email: yup.string()
        .nullable()
        .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
        .required('請填寫電子信箱'),
    }),
    cellphone: yup.string()
      .when('originCellphone', {
        is: val => typeof val === 'string' && val.length > 0,
        then: yup.string()
          .required('請輸入行動電話')
          .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
        otherwise: yup.string()
          .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話', excludeEmptyString: true }),
      }),
    telArea: yup.string().nullable()
      .ensure()
      .max(5, '請填寫正確區碼')
      .matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
    tel: yup.string().nullable()
      .ensure()
      .when('telArea', {
        is: val => val != '',
        then: yup.string()
          .required('請輸入電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
      }),
  }),
  postAddress: yup.object({
    des: yup.string().notOneOf([yup.ref('請選擇地區'), ''], '請選擇地區'),
  }),
  spec: yup.boolean()
    .oneOf([true], '請詳細閱讀並勾選接受條款'),
  title: yup.string()
    .max(20, '案件標題最多20個字')
    .required('請填案件標題'),
  unit: yup.number()
    .nullable()
    .typeError('請填寫案件預算')
    .required('請填寫案件預算'),
  minPrice: yup.number()
    .nullable()
    .typeError('請填寫最低案件預算')
    .required('請填寫最低案件預算'),
  maxPrice: yup.number()
    .nullable()
    .typeError('請填寫最高案件預算')
    .required('請填寫最高案件預算'),
  partnerCount: yup.number()
    .typeError('請選擇需求人數')
    .required('請選擇需求人數'),
  desc: yup.string()
    .max(2000, '需求描述最多2000個字')
    .required('請填寫需求描述'),
  demandCategory: yup.array().nullable()
    .of(yup.string())
    .min(1, '請選擇案件類別')
    .max(2, '案件類別已滿 (最多二項)')
    .required('請選擇案件類別'),
  placeType: yup.string()
    .matches(/(yes|no)/)
    .required('請選擇指定服務地點'),
  // ref https://github.com/jquense/yup/issues/225#issuecomment-404335633
  assignPlace: yup.object()
    .when('placeType', {
      is: 'yes',
      then: yup.object({
        no: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
        des: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
      }),
    }),
  name: yup.string()
    .required('請填寫姓名'),
  sex: yup.string()
    .required('請選擇性別'),
  telArea: yup.string().nullable().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string().nullable()
    .when('telArea',
      {
        is: val => val != '',
        then: yup.string()
          .nullable().max(20, '請填寫正確電話號碼').min(5, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string()
          .nullable().min(5, '請填寫正確電話號碼').max(20, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
      }),
  cellphone: yup.string().nullable()
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  // --新欄位--
  experience: yup.number()
    .nullable()
    .min(0, '請選擇經驗需求')
    .required('請選擇經驗需求'),
  jobOccupation: yup.array()
    .of(yup.number())
    .min(1, '請選擇希望老師身份')
    .required('請選擇希望老師身份'),
  educationalStage: yup.number().nullable()
    .required('請選擇教學對象'),
  educationalGrade: yup.number()
    .nullable()
    .when('educationalStage', {
      is: number => typeof number === 'number' && number >= 2 && number <= 4,
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
    .nullable()
    .of(yup.number())
    .min(1, '請選擇週間')
    .required('請選擇週間'),
  classEveryWeekHourBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  classEveryWeekHourEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
  classPlace: yup.array().nullable()
    .when('placeType', {
      is: 'yes',
      then: yup.array()
        .of(yup.number())
        .min(1, '請選擇教學地點類型')
        .required('請選擇教學地點類型'),
    }),
  classWay: yup.array()
    .of(yup.number())
    .nullable()
    .required('請選擇上課方式'),
  classDuration: yup.number()
    .nullable()
    .required('請選擇上課期限'),
  contactTimeBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  contactTimeEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
});

const validateJoinCaseDemand = yup.object().shape({
  enableUserData: yup.object().shape({
    originCellphone: yup.string().nullable(),
    sex: yup.string()
      .required('請選擇稱謂'),
    chosenRole: yup.string(),
    birthday: yup.string()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string()
          .nullable()
          .test('birthday', '請填寫生日', value => dayjs(value).format('YYYY-MM-DD') !== '1900-01-01')
          .test('birthday', '需年滿15歲，請選擇正確日期', value => dayjs().diff(value, 'years') >= 15)
          .required('請填寫生日'),
        otherwise: yup.string().nullable(),
      }),
    identityType: yup.string()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string()
          .required('請填寫身份資料'),
      }),
    identity: yup.string().nullable()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string()
          .when('identityType', {
            is: '0',
            then: yup.string()
              .required('請填寫身份資料')
              .matches(/^[a-zA-Z][0-9]{9}$|^[a-zA-Z][abcdABCD][0-9]{8}$|^[a-zA-Z][89][0-9]{8}$/, { message: '請填寫正確身份證' }),
          })
          .when('identityType', {
            is: '1',
            then: yup.string()
              .max(15, '請填寫正確護照號碼')
              .required('請填寫身份資料'),
          }),
      }),
    roleType: yup.string()
      .when('chosenRole', {
        is: 'personal',
        then: yup.string().notOneOf(['0'],
          '請選擇身份類別'),
      }),
    companyName: yup.string().nullable()
      .when('chosenRole', {
        is: 'company',
        then: yup.string().required('請填寫公司名稱'),
      }),
    invoice: yup.string().nullable()
      .when('chosenRole', {
        is: 'company',
        then: yup.string()
          .required('請填寫公司統編')
          .matches(/^\d{8}$/, { message: '請填寫正確統一編號' }),
      }),
    employeeCount: yup.string()
      .when('chosenRole', {
        is: 'company',
        then: yup.string()
          .notOneOf(['0'], '請選擇公司規模'),
      }),
    industry: yup.object()
      .when('chosenRole', {
        is: 'company',
        then: yup.object({
          des: yup.string()
            .required('請選擇產業類別'),
        }),
      }),
    jobTitle: yup.string()
      .when('chosenRole', {
        is: 'company',
        then: yup.string().notOneOf(['0'], '請選擇您的職務類型'),
      }),
    address: yup.string().nullable()
      .required('請完整填寫地址資料'),
    emailInfo: yup.object().shape({
      email: yup.string()
        .nullable()
        .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
        .required('請填寫電子信箱'),
    }),
    cellphone: yup.string().nullable()
      .when('originCellphone', {
        is: val => typeof val === 'string' && val.length > 0,
        then: yup.string()
          .required('請輸入行動電話')
          .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
        otherwise: yup.string()
          .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話', excludeEmptyString: true }),
      }),
    telArea: yup.string().nullable()
      .ensure()
      .max(5, '請填寫正確區碼')
      .matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
    tel: yup.string().nullable()
      .ensure()
      .when('telArea', {
        is: val => val != '',
        then: yup.string()
          .required('請輸入電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
      }),
  }),
  postAddress: yup.object({
    des: yup.string().notOneOf([yup.ref('請選擇地區'), ''], '請選擇地區'),
  }),
  spec: yup.boolean()
    .oneOf([true], '請詳細閱讀並勾選接受條款'),
  title: yup.string()
    .max(20, '案件標題最多20個字')
    .required('請填案件標題'),
  unit: yup.number()
    .nullable()
    .typeError('請填寫案件預算')
    .required('請填寫案件預算'),
  minPrice: yup.number()
    .nullable()
    .typeError('請填寫最低案件預算')
    .required('請填寫最低案件預算'),
  maxPrice: yup.number()
    .nullable()
    .typeError('請填寫最高案件預算')
    .required('請填寫最高案件預算'),
  partnerCount: yup.number()
    .typeError('請選擇需求人數')
    .required('請選擇需求人數'),
  desc: yup.string()
    .max(2000, '需求描述最多2000個字')
    .required('請填寫需求描述'),
  demandCategory: yup.array().nullable()
    .of(yup.string())
    .min(1, '請選擇案件類別')
    .max(2, '案件類別已滿 (最多二項)')
    .required('請選擇案件類別'),
  placeType: yup.string()
    .matches(/(yes|no)/)
    .required('請選擇指定地點'),
  // ref https://github.com/jquense/yup/issues/225#issuecomment-404335633
  assignPlace: yup.object()
    .when('placeType', {
      is: 'yes',
      then: yup.object({
        no: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
        des: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
      }),
    }),
  name: yup.string()
    .required('請填寫姓名'),
  sex: yup.string()
    .required('請選擇性別'),
  telArea: yup.string().nullable().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string().nullable()
    .when('telArea',
      {
        is: val => val != '',
        then: yup.string()
          .nullable().max(20, '請填寫正確電話號碼').min(5, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string()
          .nullable().min(5, '請填寫正確電話號碼').max(20, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
      }),
  cellphone: yup.string().nullable()
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  experience: yup.number()
    .nullable()
    .min(0, '請選擇經驗需求')
    .required('請選擇經驗需求'),
  jobOccupation: yup.array()
    .of(yup.number())
    .min(1, '請選擇希望身份')
    .required('請選擇希望身份'),
  contactTimeBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  contactTimeEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
});

const validateTutorDemandV3 = yup.object().shape({
  title: yup.string()
    .max(20, '案件標題最多20個字')
    .required('請填案件標題'),
  unit: yup.number()
    .nullable()
    .typeError('請填寫案件預算')
    .required('請填寫案件預算'),
  minPrice: yup.number()
    .nullable()
    .typeError('請填寫最低案件預算')
    .required('請填寫最低案件預算'),
  maxPrice: yup.number()
    .nullable()
    .typeError('請填寫最高案件預算')
    .required('請填寫最高案件預算'),
  partnerCount: yup.number()
    .typeError('請選擇需求人數')
    .required('請選擇需求人數'),
  desc: yup.string()
    .max(2000, '需求描述最多2000個字')
    .required('請填寫需求描述'),
  demandCategory: yup.array().nullable()
    .of(yup.string())
    .min(1, '請選擇案件類別')
    .max(2, '案件類別已滿 (最多二項)')
    .required('請選擇案件類別'),
  placeType: yup.string()
    .matches(/(yes|no)/)
    .required('請選擇指定服務地點'),
  // ref https://github.com/jquense/yup/issues/225#issuecomment-404335633
  assignPlace: yup.object()
    .when('placeType', {
      is: 'yes',
      then: yup.object({
        no: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
        des: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
      }),
    }),
  name: yup.string()
    .required('請填寫姓名'),
  sex: yup.string()
    .required('請選擇性別'),
  telArea: yup.string().nullable().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string().nullable()
    .when('telArea',
      {
        is: val => val != '',
        then: yup.string()
          .nullable().max(20, '請填寫正確電話號碼').min(5, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string()
          .nullable().min(5, '請填寫正確電話號碼').max(20, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
      }),
  cellphone: yup.string().nullable()
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  // --新欄位--
  experience: yup.number()
    .nullable()
    .min(0, '請選擇經驗需求')
    .required('請選擇經驗需求'),
  jobOccupation: yup.array()
    .of(yup.number())
    .min(1, '請選擇希望老師身份')
    .required('請選擇希望老師身份'),
  educationalStage: yup.number().nullable()
    .required('請選擇教學對象'),
  educationalGrade: yup.number()
    .nullable()
    .when('educationalStage', {
      is: number => typeof number === 'number' && number >= 2 && number <= 4,
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
    .nullable()
    .of(yup.number())
    .min(1, '請選擇週間')
    .required('請選擇週間'),
  classEveryWeekHourBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  classEveryWeekHourEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
  classPlace: yup.array().nullable()
    .when('placeType', {
      is: 'yes',
      then: yup.array()
        .of(yup.number())
        .min(1, '請選擇教學地點類型')
        .required('請選擇教學地點類型'),
    }),
  classWay: yup.array()
    .of(yup.number())
    .nullable()
    .required('請選擇上課方式'),
  classDuration: yup.number()
    .nullable()
    .required('請選擇上課期限'),
  contactTimeBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  contactTimeEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
});

const validateCaseDemandV3 = yup.object().shape({
  title: yup.string()
    .max(20, '案件標題最多20個字')
    .required('請填案件標題'),
  unit: yup.number()
    .nullable()
    .typeError('請填寫案件預算')
    .required('請填寫案件預算'),
  minPrice: yup.number()
    .nullable()
    .typeError('請填寫最低案件預算')
    .required('請填寫最低案件預算'),
  maxPrice: yup.number()
    .nullable()
    .typeError('請填寫最高案件預算')
    .required('請填寫最高案件預算'),
  partnerCount: yup.number()
    .typeError('請選擇需求人數')
    .required('請選擇需求人數'),
  desc: yup.string()
    .max(2000, '需求描述最多2000個字')
    .required('請填寫需求描述'),
  demandCategory: yup.array().nullable()
    .of(yup.string())
    .min(1, '請選擇案件類別')
    .max(2, '案件類別已滿 (最多二項)')
    .required('請選擇案件類別'),
  placeType: yup.string()
    .matches(/(yes|no)/)
    .required('請選擇指定地點'),
  // ref https://github.com/jquense/yup/issues/225#issuecomment-404335633
  assignPlace: yup.object()
    .when('placeType', {
      is: 'yes',
      then: yup.object({
        no: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
        des: yup.string()
          .nullable()
          .required(assignPlaceErrorMsg),
      }),
    }),
  name: yup.string()
    .required('請填寫姓名'),
  sex: yup.string()
    .required('請選擇性別'),
  telArea: yup.string().nullable().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string().nullable()
    .when('telArea',
      {
        is: val => val != '',
        then: yup.string()
          .nullable().max(20, '請填寫正確電話號碼').min(5, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string()
          .nullable().min(5, '請填寫正確電話號碼').max(20, '請填寫正確電話號碼')
          .matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
      }),
  cellphone: yup.string().nullable()
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  experience: yup.number()
    .nullable()
    .min(0, '請選擇經驗需求')
    .required('請選擇經驗需求'),
  jobOccupation: yup.array()
    .of(yup.number())
    .min(1, '請選擇希望身份')
    .required('請選擇希望身份'),
  contactTimeBegin: yup.number()
    .nullable()
    .required('請選擇起始時間'),
  contactTimeEnd: yup.number()
    .nullable()
    .required('請選擇結束時間'),
});

const validateEditProfileToPaid = yup.object().shape({
  productNo: yup.string().nullable()
    .required('請選擇刊登方案'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  originCellphone: yup.string(),
  cellphone: yup.string()
    .required('請輸入行動電話')
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  invoiceType: yup.string().nullable()
    .when('productNo', {
      is: val => val || val !== '',
      then: yup.string().nullable()
        .required('請輸入發票類型'),
    }),
  acName: yup.string().nullable()
    .when('invoiceType', {
      is: '2',
      then: yup.string()
        .required('請填寫發票抬頭'),
    }),
  companyName: yup.string().nullable()
    .when('invoiceType', {
      is: '3',
      then: yup.string()
        .required('請填寫公司發票抬頭'),
    }),
  postNum: yup.object({
    des: yup.string().notOneOf([yup.ref('請選擇地區'), ''], '請選擇地區'),
  }),
  address: yup.string().nullable()
    .required('請完整填寫地址資料')
    .test('specialWordTest', '請正確填寫地址，不可有特殊字元符號', address => !/[~`$&+:;=\\\?@#|/'<>^*()%!_\"\[\]\{\}～＄＆＋，：；＝＼／？＠＃｜’＜＞．︿＊（）％！＂［］｛｝＿‵－]|([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/.test(address)),
  carrierType: yup.string(),
  carrierCode: yup.string().nullable()
    .when('carrierType', {
      is: val => val == '4',
      then: yup.string()
        .required('請填寫手機載具號碼')
        .matches(/\/{1}[0-9A-Z+-.]{7}$/, { message: '請填寫正確手機載具號碼' }),
    }),
  invoiceNum: yup.string().nullable()
    .when('invoiceType', {
      is: '3',
      then: yup.string()
        .required('請填寫公司統編')
        .matches(/^\d{8}$/, { message: '請填寫正確統一編號' }),
    }),
  spec: yup.boolean()
    .oneOf([true], '請詳細閱讀並勾選接受條款'),
});

const validateEditProfileToChange = yup.object().shape({
  productNo: yup.string().nullable()
    .required('請選擇刊登方案'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  originCellphone: yup.string(),
  cellphone: yup.string()
    .required('請輸入行動電話')
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  spec: yup.boolean()
    .oneOf([true], '請詳細閱讀並勾選接受條款'),
});


const validateUpgradePlan = yup.object().shape({
  invoiceType: yup.string().nullable()
    .when('productNo', {
      is: val => val || val !== '',
      then: yup.string().nullable()
        .required('請輸入發票類型'),
    }),
  acName: yup.string().nullable()
    .when('invoiceType', {
      is: '2',
      then: yup.string()
        .required('請填寫發票抬頭'),
    }),
  companyName: yup.string().nullable()
    .when('invoiceType', {
      is: '3',
      then: yup.string()
        .required('請填寫公司發票抬頭'),
    }),
  postNum: yup.object({
    no: yup.string()
      .nullable()
      .required('請選擇地區'),
    des: yup.string()
      .nullable()
      .required('請選擇地區'),
  }),
  address: yup.string().nullable()
    .required('請完整填寫地址資料')
    .test('specialWordTest', '請正確填寫地址，不可有特殊字元符號', address => !/[~`$&+:;=\\\?@#|/'<>^*()%!_\"\[\]\{\}～＄＆＋，：；＝＼／？＠＃｜’＜＞．︿＊（）％！＂［］｛｝＿‵－]|([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/.test(address)),
  carrierType: yup.string(),
  carrierCode: yup.string().nullable()
    .when('carrierType', {
      is: val => val == '4',
      then: yup.string()
        .required('請填寫手機載具號碼')
        .matches(/\/{1}[0-9A-Z+-.]{7}$/, { message: '請填寫正確手機載具號碼' }),
    }),
  invoiceNum: yup.string().nullable()
    .when('invoiceType', {
      is: '3',
      then: yup.string()
        .required('請填寫公司統編')
        .matches(/^\d{8}$/, { message: '請填寫正確統一編號' }),
    }),
});

export {
  validateTutorDemandV3,
  validateCaseDemandV3,
  validateEditProfileToPaid,
  validateEditProfileToChange,
  validateJoinTutorDemand,
  validateJoinCaseDemand,
  validateUpgradePlan,
};
