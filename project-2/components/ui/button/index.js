import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
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
}) => {
  const isDisagled = type === 'disabled' ? 'disabled' : '';
  return (
    <Button
      type={type}
      icon={<LegacyIcon type={icon} />}
      href={href}
      disabled={isDisagled}
      htmlType={htmlType}
      onClick={onClick}
      loading={loading}
      target={target}
      size={size}
      data-gtm-header={dataGtmHeader}
      data-gtm-index={dataGtmIndex}
      data-gtm-marketing={dataGtmMarketing}
      data-gtm-profile={dataGtmProfile}
      data-gtm-case={dataGtmCase}
    >
      {children}
    </Button>
  );
};

export default Btn;
