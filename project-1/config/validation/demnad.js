import * as yup from 'yup';

export const notFoundSchema = yup.object().shape({
  notFoundReason: yup.number().moreThan(0, '請選擇未能找到合作高手的原因'),
});

export const communitingSchema = yup.object().shape({
  foundType: yup.number().moreThan(0, '請選擇是否找到合作高手'),
  topperData: yup.array()
    .when('foundType', {
      is: val => val !== 2,
      then: yup.array().of(yup.object().shape({
        topperId: yup.string().required('請選擇合作高手'),
        price: yup.number()
          .nullable()
          .when('unit', {
            is: val => val !== -1,
            then: yup.number()
              .nullable()
              .required('請輸入金額')
              .moreThan(0, '請輸入金額'),
          })
        ,
      })),
    })
  ,
});

export const cooperatingSchema = yup.object().shape({
  topperData: yup.array().of(yup.object().shape({
    topperId: yup.string().required('請選擇合作高手'),
    price: yup.number()
      .nullable()
      .when('unit', {
        is: val => val !== -1,
        then: yup.number()
          .nullable()
          .required('請輸入金額')
          .moreThan(0, '請輸入金額'),
      })
    ,
  })),
});

export const evaluationSchema = yup.object().shape({
  gigTitle: yup.string().required('請選擇要評價的服務'),
  ranking1: yup.number().moreThan(0, '請評價溝通及處理態度'),
  ranking2: yup.number().moreThan(0, '請評價服務品質滿意度'),
  ranking3: yup.number().moreThan(0, '請評價是否推薦此高手'),
  comment: yup.string().required('請輸入評價'),
});
