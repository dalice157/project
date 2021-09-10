import React from 'react';
import { Button } from 'antd';
import './Button.scss';

const Btn = ({
  href,
  type,
  icon,
  children,
  htmlType,
  onClick,
  loading,
  target,
  size,
  dataGtmHeader,
  dataGtmIndex,
  dataGtmMarketing,
  dataGtmProfile,
  dataGtmCase,
  dataGtmJoin,
  disabled,
}) => {
  const isDisagled = type === 'disabled' ? 'disabled' : '';
  return (
    <Button
      type={type}
      icon={icon}
      href={href}
      disabled={disabled || isDisagled}
      htmlType={htmlType}
      onClick={onClick}
      loading={loading}
      target={target}
      size={size}
      data-gtm-header={dataGtmHeader}
      data-gtm-index={dataGtmIndex}
      data-gtm-marketing={dataGtmMarketing}
      data-gtm-join={dataGtmJoin}
      data-gtm-profile={dataGtmProfile}
      data-gtm-case={dataGtmCase}
    >
      {children}
    </Button>
  );
};

export default Btn;
