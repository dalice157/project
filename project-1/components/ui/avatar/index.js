import React from 'react';
import { Avatar } from 'antd';
import 'antd/dist/antd.css';
import styles from './Avatar.scss';

const Avatars = ({ size, userImg, alt }) => (
  <div className={styles.avatar}>
    <Avatar size={size} src={userImg} alt={alt} icon="user" />
  </div>
);

export default Avatars;
