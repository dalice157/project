import React from 'react';
import { Card } from 'antd';
import {
  ServiceNo,
  PublishDate,
  UpdateDate,
  Evaluate,
} from '../../../components/member/gig/ContentField';
import './Content.scss';
import { dateFormat } from '../../../util/formatUtil';

const Content = (props) => {
  const {
    gigId, createDate, modifyDate, reviewScore, basicId, reviewCount
  } = props;
  const initialData = {
    serviceNo: gigId,
    publishDate: dateFormat(createDate, true),
    updateDate: dateFormat(modifyDate, true),
    reviewScore: reviewScore,
    reviewCount: reviewCount,
  };
  return (
    <Card className="group">
      <ServiceNo serviceNo={ initialData.serviceNo } />
      <PublishDate publishDate={ initialData.publishDate } />
      <UpdateDate updateDate={ initialData.updateDate } />
      <Evaluate reviewScore={ initialData.reviewScore } reviewCount={ initialData.reviewCount } basicId={ basicId } />
    </Card>
  );
};

export default Content;
