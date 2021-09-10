import React from 'react';
import { Dropdown } from 'antd';


const DropdownCom = ({
  className, overlay, overlayClassName, overlayStyle, placement, children, visible, onClick
}) => {
  if (visible === true || visible == false) {
    return (
      <Dropdown
        className={className}
        overlay={overlay}
        placement={placement}
        trigger={['click']}
        visible={visible}
        onClick={onClick}
        overlayClassName={overlayClassName}
        overlayStyle={overlayStyle}
      >
        {children}
      </Dropdown>
    );
  } else {
    return (
      <Dropdown
        className={className}
        overlay={overlay}
        placement={placement}
        trigger={['click']}
      >
        {children}
      </Dropdown>
    );
  }
};

export default DropdownCom;
