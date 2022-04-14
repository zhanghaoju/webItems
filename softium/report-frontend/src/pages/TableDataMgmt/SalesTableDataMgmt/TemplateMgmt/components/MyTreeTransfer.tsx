import React, { FC, useImperativeHandle, useState } from 'react';
import { Transfer, Tree } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { TreeDataType } from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
import difference from 'lodash/difference';

interface MyTreeTransferProps {
  dataSource?: TreeDataType[];
  targetKeys: string[];
  onChange: (keys: string[]) => void;
}
const MyTreeTransfer = () => {
  const { treeData, targetKeys, setTargetKeys, defaultFields } = useModel(
    'TableDataMgmt.SalesTableDataMgmt.TemplateMgmt.useTemplateMgmtModel',
  );
  const parentNodeCode: string[] = [];
  for (let item of treeData) {
    parentNodeCode.push(item.key as string);
  }

  // const isChecked = (selectedKeys: string[], eventKey: string) => {
  //   return selectedKeys.indexOf(eventKey) !== -1;
  // };

  const generateTree = (
    treeNodes: TreeDataType[] = [],
    checkedKeys: string[],
  ): any[] => {
    return treeNodes?.map(({ children, ...props }) => {
      return {
        ...props,
        children: generateTree(children, checkedKeys),
      };
    });
  };
  const TreeTransfer: React.FC<MyTreeTransferProps> = ({
    dataSource,
    targetKeys,
    ...restProps
  }) => {
    const transferDataSource: any[] = [];
    function flatten(list: TreeDataType[] = []) {
      list?.forEach((item: any) => {
        transferDataSource.push(item);
        flatten(item?.children);
      });
    }
    flatten(dataSource);
    const dataSourceData = generateTree(dataSource, targetKeys);
    return (
      <Transfer
        {...restProps}
        showSearch={true}
        operations={['添加', '移除']}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        render={item => item.title}
        showSelectAll={false}
        onSearch={(dir, val) => {
          if (dir === 'left') {
            const newDeptList = dataSourceData
              .filter(
                item =>
                  item.children.filter(
                    (e: { title: string | string[] }) =>
                      e.title.indexOf(val) > -1,
                  ).length > 0 || val.length == 0,
              )
              .map(item => {
                item = Object.assign({}, item);
                if (item.children) {
                  item.children = item.children.filter(
                    (res: { title: string | string[] }) =>
                      res.title.indexOf(val) > -1,
                  );
                }
                return item;
              });
            dataSource = newDeptList;
          }
        }}
      >
        {({
          direction,
          disabled,
          onItemSelect,
          selectedKeys,
          onItemSelectAll,
        }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys];
            return (
              <Tree
                blockNode
                checkable
                disabled={disabled}
                // checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, targetKeys)}
                onCheck={(keys, { checked, node: { key } }) => {
                  const diffKeys = checked
                    ? difference(keys as string[], checkedKeys)
                    : difference(checkedKeys, keys as string[]);
                  //将父节点移除，不能被选择到右侧，不然在移除子节点时，必须先把父节点移除，才可以吧子节点移除
                  let arr = difference(diffKeys, parentNodeCode);

                  if (typeof key === 'string') {
                    onItemSelectAll(arr, checked);
                  }
                }}
                // onSelect={(keys, { node: { key } }) => {
                //   console.log('onCheck', keys);
                //   if (typeof key === 'string') {
                //     onItemSelectAll(keys as string[], !isChecked(checkedKeys, key));
                //   }
                // }}
              />
            );
          }
        }}
      </Transfer>
    );
  };

  const onChange = (keys: string[]) => {
    setTargetKeys(keys);
  };
  return (
    <>
      <TreeTransfer
        dataSource={treeData}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </>
  );
};
export default MyTreeTransfer;
