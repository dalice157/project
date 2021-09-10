import * as yup from 'yup';
import dayjs from 'dayjs';

import { isContainTutorCats } from '../../util/lablesUtils.js';
import { REGEX_EMAIL } from '../../util/commonUtil';

const targetErrorMsg = '請選擇教學對象';

const targetScheme = yup.number()
  .integer(targetErrorMsg)
  .min(1, targetErrorMsg)
  .max(6, targetErrorMsg)
  .typeError(targetErrorMsg);

const assignPlaceErrorMsg = '請選擇指定地點';

const validatePlan = yup.object().shape({
  telArea: yup.string()
    .nullable()
    .max(5, '請填寫正確區碼')
    .matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string()
    .nullable()
    .when('telArea',
      {
        is: val => val != '',
        then: yup.string()
          .matches(/(^([0-9]+)(?:(?:#)([0-9]+))?$)|(^$)/, { message: '請填寫正確電話號碼' })
          .min(5, '請填寫正確長度的市話號碼')
          .max(20, '請填寫正確長度的市話號碼'),
        otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
      }),
  cellphone: yup.string()
    .nullable()
    .matches(/(^[+]?[0-9]{10,15}$)|(^$)/, { message: '請填寫正確行動電話' })
    .min(10, '請填寫正確長度的手機號碼')
    .max(15, '請填寫正確長度的手機號碼'),
});

const validateCaseV1 = yup.object().shape({
  title: yup.string()
    .max(20, '案件標題最多20個字')
    .required('請填案件標題'),
  unit: yup.number()
    .typeError('請填寫案件預算')
    .required('請填寫案件預算'),
  minPrice: yup.number()
    .typeError('請填寫最低案件預算')
    .required('請填寫最低案件預算'),
  maxPrice: yup.number()
    .typeError('請填寫最高案件預算')
    .required('請填寫最高案件預算'),
  partnerCount: yup.number()
    .typeError('請選擇需求人數')
    .required('請選擇需求人數'),
  desc: yup.string()
    .max(2000, '需求描述最多2000個字')
    .required('請填寫需求描述'),
  demandCats: yup.array()
    .of(yup.number())
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
        no: yup.number()
          .required(assignPlaceErrorMsg)
          .typeError(assignPlaceErrorMsg),
        des: yup.string()
          .required(assignPlaceErrorMsg)
          .typeError(assignPlaceErrorMsg)
      })
    }),
  // ref https://github.com/jquense/yup/issues/298#issuecomment-543791550
  target: yup.number()
    .when('demandCats', {
      is: demandCats => isContainTutorCats(demandCats),
      then: targetScheme
        .required(targetErrorMsg),
      otherwise: targetScheme
        .nullable()
      // .transform((value: string, originalValue: string) => (originalValue.trim() === '' ? null : value))
    })
});

const validateCase = yup.object().shape({
  title: yup.string()
    .max(20, '案件標題最多20個字')
    .required('請填案件標題'),
  unit: yup.number()
    .typeError('請填寫案件預算')
    .required('請填寫案件預算'),
  minPrice: yup.number()
    .typeError('請填寫最低案件預算')
    .required('請填寫最低案件預算'),
  maxPrice: yup.number()
    .typeError('請填寫最高案件預算')
    .required('請填寫最高案件預算'),
  partnerCount: yup.number()
    .typeError('請選擇需求人數')
    .required('請選擇需求人數'),
  desc: yup.string()
    .max(2000, '需求描述最多2000個字')
    .required('請填寫需求描述'),
  demandCats: yup.array()
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
          .required(assignPlaceErrorMsg)
      })
    }),
  userName: yup.string()
    .required('請填寫姓名'),
  gender: yup.string()
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
});

const validateEdit = yup.object().shape({
  sex: yup.string()
    .required('請選擇性別'),
  identityType: yup.string(),
  invoice: yup.string()
    .when('identityType', {
      is: 'company',
      then: yup.string().required('請填寫正確統一編號')
    }),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  telArea: yup.string()
    .ensure().max(5, '請填寫正確區碼').matches(/(^\d{1,5}$|^$)/, { message: '請填寫正確區碼' }),
  tel: yup.string()
    .ensure()
    .when('telArea',
      {
        is: val => val != '',
        then: yup.string().required('請輸入電話號碼').matches(/^([0-9]+)(?:(?:#)([0-9]+))?$/, { message: '請填寫正確電話號碼' }),
        otherwise: yup.string().ensure().oneOf([''], '請輸入電話號碼'),
      }),
  cellphone: yup.string()
    .required('請填寫正確行動電話')
    .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
  spec: yup.bool()
    .test(
      'spec',
      '請詳細閱讀並勾選接受條款',
      value => value === true
    )
    .required('請詳細閱讀並勾選接受條款'),
});

const validateCaptcha = yup.object().shape({
  captcha: yup.string()
    .required('請填寫正確驗證碼'),
});

const validatePay = yup.object().shape({
  spec: yup.bool()
    .test(
      'spec',
      '請詳細閱讀並勾選接受條款',
      value => value === true
    )
    .required('請詳細閱讀並勾選接受條款')
});

const validateBrand = yup.object().shape({
  selectResume: yup.string().required('請選擇履歷'),
  specProfile: yup.bool()
    .test(
      'spec',
      '請勾選同意公開104個人檔案內容',
      value => value === true
    )
    .required('請勾選同意公開104個人檔案內容')
});

const validateBrandWithoutResume = yup.object().shape({
  specProfile: yup.bool()
    .test(
      'spec',
      '請勾選同意公開104個人檔案內容',
      value => value === true
    )
    .required('請勾選同意公開104個人檔案內容')
});


const validateDemands = yup.object().shape({
  roles: yup.array().required('請選擇案件')
});


const validateApply = yup.object().shape({
  radioGroup: yup.string().required('請選擇參考服務項目'),
});


const validateCaseUser = yup.object().shape({
  sex: yup.string()
    .required('請選擇稱謂'),
  chosenRole: yup.string(),
  birthday: yup.string()
    .when('chosenRole', {
      is: 'personal',
      then: yup.string()
        .nullable()
        .test('birthday', '請填寫生日', (value) => {
          return dayjs(value).format('YYYY-MM-DD') != '1900-01-01';
        })
        .test('birthday', '需年滿15歲，請選擇正確日期', (value) => {
          return dayjs().diff(value, 'years') >= 15;
        })
        .required('請填寫生日'),
      otherwise: yup.string().nullable()
    }),
  identityType: yup.string()
    .when('chosenRole', {
      is: 'personal',
      then: yup.string()
        .required('請填寫身份資料')
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
        })
    }),
  roleType: yup.string()
    .when('chosenRole', {
      is: 'personal',
      then: yup.string().notOneOf([yup.ref('請選擇身份類別'), '0'],
        '請選擇身份類別')
    }),
  companyName: yup.string().nullable()
    .when('chosenRole', {
      is: 'company',
      then: yup.string().required('請填寫公司名稱')
    }),
  invoice: yup.string().nullable()
    .when('chosenRole', {
      is: 'company',
      then: yup.string()
        .required('請填寫公司統編')
        .matches(/^\d{8}$/, { message: '請填寫正確統一編號' })
    }),
  employeeCount: yup.string()
    .when('chosenRole', {
      is: 'company',
      then: yup.string().notOneOf([yup.ref('請選擇'), '0'], '請選擇公司規模')
    }),
  industry: yup.object()
    .when('chosenRole', {
      is: 'company',
      then: yup.object({
        des: yup.string().notOneOf([yup.ref('請選擇產業類別'), ''], '請選擇產業類別')
      })
    }),
  jobTitle: yup.string()
    .when('chosenRole', {
      is: 'company',
      then: yup.string().notOneOf([yup.ref('請選擇'), '0'], '請選擇您的職務類型')
    }),
  postNum: yup.object({
    no: yup.string()
      .nullable()
      .required('請選擇地區'),
    des: yup.string()
      .nullable()
      .required('請選擇地區')
  }),
  address: yup.string().nullable()
    .required('請完整填寫地址資料'),
  email: yup.string()
    .nullable()
    .matches(REGEX_EMAIL, { message: '請填寫正確的格式' })
    .required('請填寫電子信箱'),
  originCellphone: yup.string(),
  cellphone: yup.string()
    .when('originCellphone', {
      is: val => val != undefined,
      then: yup.string()
        .required('請輸入行動電話')
        .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' }),
      otherwise: yup.string()
        .matches(/^[+]?[0-9]{10,15}$/, { message: '請填寫正確行動電話' })
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
  spec: yup.boolean()
    .oneOf([true], '請詳細閱讀並勾選接受條款')
});

const validateEvaluationEDM = yup.object().shape({
  communicationScore: yup.number().moreThan(0, '請評價'),
  qualityScore: yup.number().moreThan(0, '請評價'),
  recommandationScore: yup.number().moreThan(0, '請評價'),
});

const validateEvaluationTopper = yup.object().shape({
  gigTitle: yup.string()
    .min(1, '請選擇服務項目')
    .required('請選擇服務項目'),
  communicationScore: yup.number().moreThan(0, '請評價'),
  qualityScore: yup.number().moreThan(0, '請評價'),
  recommandationScore: yup.number().moreThan(0, '請評價'),
});

export {
  validateCaseV1,
  validateCase,
  validateEdit,
  validateCaptcha,
  validatePay,
  validateBrand,
  validateBrandWithoutResume,
  validateDemands,
  validateApply,
  validateCaseUser,
  validatePlan,
  validateEvaluationEDM,
  validateEvaluationTopper,
};
