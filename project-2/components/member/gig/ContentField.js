import React from 'react';

const ServiceNo = (props) => {
  const { serviceNo } = props;
  return (
    <div className="edit field">
      <p className="fieldName">服務編號</p>
      <div className="fieldContent">{serviceNo}</div>
    </div>
  );
};

const PublishDate = (props) => {
  const { publishDate } = props;
  return (
    <div className="edit field">
      <p className="fieldName">建立日期</p>
      <div className="fieldContent">{publishDate}</div>
    </div>
  );
};

const UpdateDate = (props) => {
  const { updateDate } = props;
  return (
    <div className="edit field">
      <p className="fieldName">更新日期</p>
      <div className="fieldContent">{updateDate}</div>
    </div>
  );
};

const Evaluate = (props) => {
  const { reviewScore, reviewCount, basicId } = props;
  return (
    <div className="edit field">
      <p className="fieldName">服務評價</p>
      <div className="fieldContent">
        {
          reviewCount !== 0
            ? <a href={ `/admin/member/${basicId}?tabs=review` } target="_blank" rel="noopener noreferrer">{'評價星數 '.concat(reviewScore)}</a>
            : <p>無</p>
          }
      </div>
    </div>
  );
};

export {
  ServiceNo, PublishDate, UpdateDate, Evaluate
};
