import React, { Component } from 'react';
import { TreeSelect as TreeSelectCom } from 'antd';
import { catsTreeData } from '../../../util/lablesUtils.js';
import { error } from '../../../util/messageUtil.js';

const SHOW_PARENT = TreeSelectCom.SHOW_PARENT;
const defaultTreeData = catsTreeData(0);
/**
 * 服務類型
 */
class TreeSelect extends Component {
    state = {
      value: undefined,
      selectedKeys: [],
      expandedKeys: [],
      hasChildren: false
    }

    componentDidMount() {
      const { cats } = this.props;
      this.updateCats(cats);
    }

    componentDidUpdate(preProps) {
      const { cats } = this.props;
      if (cats !== preProps.cats) {
        this.updateCats(cats);
      }
    }

    updateCats = (cats) => {
      const changeStringCats = cats.map(cat => String(cat));
      this.setState({
        value: changeStringCats,
        expandedKeys: []
      });
    }

    onChange = (value, label, extra) => {
      const { expandedKeys, hasChildren } = this.state;
      const { onCatsChange, arrayHelpers } = this.props;
      const node = extra.triggerValue;
      const getTutorVal = () => {
        if (node.toString().includes('100')) {
          return node.toString().substr(3, 1);
        }
      };
      const nodeLeaf = node.toString().includes('000000') || node.toString().includes(`100${getTutorVal()}000`);

      if (!nodeLeaf) {
        if (value.length < 3) {
          onCatsChange({ arrayHelpers: arrayHelpers, cats: value });
          this.setState({ value });
        } else {
          error('cat-limit');
        }
      } else if (nodeLeaf) {
        const expandedKeysLen = (expandedKeys.filter(k => k !== node)).length;
        if (hasChildren) {
          this.setState({
            expandedKeys: expandedKeysLen > 2 ? expandedKeys.filter(k => k !== node) : expandedKeys.concat(node)
          });
        }
        this.setState({
          expandedKeys: !hasChildren ? [] : expandedKeys.concat(node)
        });
      } else {
        onCatsChange({ arrayHelpers: arrayHelpers, cats: value });
        this.setState({ value });
      }
    }

    onExpand = (expandedKeys) => {
      this.setState({ expandedKeys });
    };

    onSelect = (keys, info) => {
      const { expandedKeys } = this.state;
      this.setState({
        expandedKeys: (expandedKeys.filter(k => k === info.value)).length < 1 ? expandedKeys.concat(info.value) : expandedKeys.filter(k => k !== info.value),
        hasChildren: info.children && info.children[0].children !== undefined
      });
    }

    render() {
      const { treeData } = this.props;
      const treeProps = {
        treeData: treeData || defaultTreeData,
        value: this.state.value,
        key: this.state.value,
        treeExpandedKeys: this.state.expandedKeys,
        onChange: this.onChange,
        onTreeExpand: this.onExpand,
        multiple: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: '請選擇案件類型，最多二個',
        onSelect: this.onSelect,
        style: { width: this.props.width || '350px' },
        dropdownStyle: {
          maxHeight: 170,
          overflow: 'auto'
        },
        disabled: this.props.shouldCloseInput
      };
      return (<TreeSelectCom { ...treeProps } />);
    }
}

export default TreeSelect;
