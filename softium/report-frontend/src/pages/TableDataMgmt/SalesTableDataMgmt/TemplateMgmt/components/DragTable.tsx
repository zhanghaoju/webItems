import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { FormInstance, Popconfirm } from 'antd';
import { ProColumns } from '@ant-design/pro-table';
import { Button, Input, Table, Typography, Form } from 'antd';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import {
  addIndex,
  getEditcustomFields,
  myThroughKey,
  transformTree,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/utils';
import { useModel } from '@@/plugin-model/useModel';
import { tableDataType } from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
import './drag.less';

export interface DragTableRef {
  submit: () => any;
}

export interface DragTableProps {
  actionRef:
    | React.MutableRefObject<DragTableRef | undefined>
    | ((actionRef: DragTableRef) => void);
}
const DragTable: React.FC<DragTableProps> = ({ actionRef }) => {
  const {
    treeData,
    targetKeys,
    dragTreeData,
    setDragTreeData,
    editTempList,
  } = useModel(
    'TableDataMgmt.SalesTableDataMgmt.TemplateMgmt.useTemplateMgmtModel',
  );

  const [form] = Form.useForm();

  useEffect(() => {
    let dataSource = transformTree(treeData, targetKeys, editTempList);
    setDragTreeData(dataSource);
    let obj = getEditcustomFields(dataSource, targetKeys);
    form.setFieldsValue(obj);
  }, [editTempList]);

  const dataList = addIndex(dragTreeData, 0);
  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortContainer = SortableContainer((props: any) => <tbody {...props} />);
  const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (oldIndex !== newIndex) {
      let dataList = addIndex(dragTreeData, 0);
      let oldItem = dataList[oldIndex];
      let newItem = dataList[newIndex];
      let newData = myThroughKey(dragTreeData, newItem, oldItem);
      setDragTreeData(JSON.parse(JSON.stringify(newData)));
    }
  };
  const DraggableBodyRow = (props: any) => {
    const { className, style, ...restProps } = props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataList.findIndex(
      x => x.fieldCode === restProps['data-row-key'],
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const DraggableContainer = (props: any) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  // const onChange = (e:any,record:tableDataType) => {
  //   let newData = JSON.parse(JSON.stringify(dragTreeData));
  //   let value = e.target.value;
  //   let changeById = (arrData:tableDataType[],fieldCode:string)=>{
  //     return arrData.map((item)=>{
  //       if(item.fieldCode === fieldCode){
  //         item.customFieldName = value;
  //       }else {
  //         if(item.children && item.children?.length > 0){
  //           changeById(item.children,record.fieldCode as string);
  //         }
  //       }
  //     })
  //   }
  //   changeById(newData,record?.fieldCode || '');
  //   setDragTreeData(newData);
  //   // setTempLateData(newData);
  //   e.stopPropagation();
  // };
  useImperativeHandle(actionRef, () => ({
    submit,
  }));
  /**
   * ?????????????????????
   */
  const submit = () => {
    let data = form.getFieldsValue();
    return data;
  };
  /**
   * ??????????????????
   * @param record
   */
  const del = (record: tableDataType) => {
    let delById = (arrData: tableDataType[], fieldCode: string) => {
      return arrData.filter(item => {
        if (item.fieldCode === fieldCode) {
          return false;
        } else {
          if (item.children && item.children?.length > 0) {
            item.children = delById(item.children, fieldCode);
          }
          return true;
        }
      });
    };
    let datas = delById(dragTreeData, record?.fieldCode as string);
    setDragTreeData(datas);
  };

  const columns: ProColumns<tableDataType>[] = [
    {
      title: '????????????',
      dataIndex: 'fieldName',
      width: '20%',
      editable: false,
    },
    {
      title: '???????????????',
      dataIndex: 'customFieldName',
      render: (text, record) => {
        return (
          <Form.Item
            style={{ marginBottom: '0' }}
            name={'customFieldName' + record?.fieldCode}
            initialValue={record.customFieldName}
            rules={[{ required: true, message: '????????????????????????!' }]}
          >
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: '??????',
      valueType: 'option',
      width: '15%',
      render: (text, record) => {
        return (
          <Popconfirm
            onConfirm={() => {
              del(record);
            }}
            key="popconfirm"
            title={`????????????????`}
            okText="???"
            cancelText="???"
          >
            <a key={'detail'}>??????</a>
          </Popconfirm>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'sort',
      width: '15%',
      editable: false,
      render: () => <DragHandle />,
    },
  ];

  return (
    <>
      <Form form={form}>
        <ProTable
          // headerTitle="???????????????"
          // formRef={ref}
          columns={columns}
          rowKey="fieldCode"
          search={false}
          dataSource={dragTreeData}
          pagination={false}
          toolBarRender={false}
          expandable={{ defaultExpandAllRows: true }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </Form>
    </>
  );
};

export default DragTable;
