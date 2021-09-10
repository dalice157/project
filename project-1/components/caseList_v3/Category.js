import React, { Fragment } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Radio, Tree } from 'antd';
import styles from './Category.scss';

const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

class Category extends React.Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true
  };

  onExpand = (expandedKeys) => {
    // console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, rootKey) => {
    // console.log('onCheck', checkedKeys);
    let preKey = null;
    const filterKeys = checkedKeys.filter((key) => {
      const numKey = parseInt(key) % 1000;
      if (numKey === 0) {
        preKey = (key / 1000).toString();
        return true;
      } else if (preKey && !key.startsWith(preKey)) {
        return true;
      } else if (!preKey) {
        return true;
      }
      return false;
    });

    // console.log('filterKeys', filterKeys);
    // console.log('rootKey', rootKey);
    this.props.onChange(null, filterKeys.length > 0 ? filterKeys : [rootKey]);
  };

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });

  render() {
    const isMobile = uaIsMobile();
    const {
      data, onChange, value, type,
    } = this.props;
    // console.log('value:', value);
    const filterRootData = type === 2 ? value.filter(item => parseInt(item) % 1000000 > 0) : [];
    // console.log('data', data);
    return (
      <Fragment>
        {type === 1
          && (
          <RadioGroup className={styles.typeText} onChange={onChange} value={value}>
              {
                data.map(cat => (
                  <Radio key={cat.id} className={styles.radioBtn} value={cat.id}>{cat.text}</Radio>
                ))
              }
          </RadioGroup>
          )
      }
        { ((!isMobile && type === 2) || (value !== undefined && /^[100]/.test(value[0])))
          && (
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={[...this.state.expandedKeys]}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={checkedKeys => this.onCheck(checkedKeys, data.key)}
            checkedKeys={filterRootData}
            onSelect={checkedKeys => this.onCheck(checkedKeys, data.key)}
            selectedKeys={filterRootData}
            multiple={true}
          >
            {this.renderTreeNodes(data.children)}
          </Tree>
          )
      }
      </Fragment>
    );
  }
}

export default Category;
