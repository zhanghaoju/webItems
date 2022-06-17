import React, { ReactNode, useRef, useState } from 'react';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { Authorized } from '@vulcan/utils';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { transformToTableRequest } from '@/utils/dataConversion';
import { getContractDetailList } from '@/services/distributorContract';
import { getList } from '@/services/institution';
import _ from 'lodash';

export default () => {
  const actionRef: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [institution, setInstitution] = useState<any>({});

  const getInstitution = async (value: string) => {
    const result: any = await getList({ likeField: [value], pageSize: 40 });
    const data: any = {};
    (result.data?.list || []).map((item: any) => {
      data[item.code] = {
        text: item.name,
      };
    });
    setInstitution(data);
  };

  const columns: ProColumns<any, any>[] = [
    { title: '序号', dataIndex: 'id', width: 80, editable: false },
    {
      title: '从属机构名称',
      dataIndex: 'name',
      valueType: 'select',
      valueEnum: institution,
      fieldProps: {
        filterOption: false,
        showSearch: true,
        onSearch: _.debounce(getInstitution, 500),
        onChange: (value: string) => {
          // setDataSource([{name: 'test', code: 'test'}]);
          // actionRef.current.addEditRecord({name: institution[value].text, code: value});
          console.log(actionRef.current);
          // actionRef.current.onValuesChange((value: any, values: any)  => {
          //   console.log(values, values);
          // })
          actionRef.current.newLineRecord.defaultValue = {
            name: institution[value].text,
            code: value
          }
        },
      },
    },
    { title: '机构编码', dataIndex: 'code', editable: false },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text: ReactNode, record: any) => [
        <a key="delete" onClick={() => {}}>
          删除
        </a>,
      ],
    },
  ];

  const editSave = async (index: any, row: any, config: any) => {
    console.log(index, row, config);
  };

  return (
    <EditableProTable
      actionRef={actionRef}
      columns={columns}
      search={false}
      options={false}
      recordCreatorProps={false}
      rowKey="id"
      headerTitle={[
        <Authorized key="add" code="addDistributorContractDetail">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => actionRef.current?.addEditRecord?.({})}
          >
            添加下级机构
          </Button>
        </Authorized>,
      ]}
      pagination={{
        pageSize: 100,
      }}
      editable={{
        editableKeys,
        onChange: setEditableRowKeys,
        onSave: editSave,
      }}
      value={dataSource}
      onChange={setDataSource}
      request={(params: any, sort, filter) =>
        transformToTableRequest(
          {
            ...params,
            ...sort,
            ...filter,
            pageNo: params.current,
          },
          getContractDetailList,
        )
      }
    />
  );
};
