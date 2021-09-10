import React, { Fragment } from 'react';
// import { uaIsMobile } from 'react-device-detect';
import { Radio, Tree } from 'antd';
import styles from './Sider.scss';

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

  onSelect = (selectKeys, ele, rootKey) => {
    const { eventKey, expanded, children } = ele.node.props;
    if (children && !expanded) {
      this.onExpand([...this.state.expandedKeys, eventKey]);
    } else {
      this.onCheck(selectKeys, rootKey);
    }
  }

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
    const {
      data, onChange, value, dataType, type, disabled
    } = this.props;
    const filterRootData = type === 2 ? value.filter(item => parseInt(item) % 1000000 > 0) : [];
    // console.log('root type', type);
    // console.log('root dataType', dataType);
    // console.log('root booled:', type !== 2 && dataType !== 1);
    const rootDiversion = (type !== 2 && dataType !== 1) ? data.filter(item => item.id !== '1000000') : data;
    // console.log('root:', rootDiversion);
    console.log('value:', value);
    return (
      <Fragment>
        {type === 1
          && (
          <RadioGroup className={styles.typeText} onChange={onChange} value={value}>
              {
                rootDiversion.map(cat => (
                  <Radio key={cat.id} className={styles.radioBtn} value={cat.id}>{cat.text}</Radio>
                ))
              }
          </RadioGroup>
          )
      }
        { (type === 2)
          && (
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={[...this.state.expandedKeys]}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={(checkedKeys, node) => this.onSelect(checkedKeys, node, data.key)}
            checkedKeys={filterRootData}
            onSelect={(checkedKeys, node) => this.onSelect(checkedKeys, node, data.key)}
            selectedKeys={filterRootData}
            multiple={true}
            disabled={disabled || false}
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
