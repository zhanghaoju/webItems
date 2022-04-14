import React, { useState, useImperativeHandle } from 'react';
import { Input, Table, Form, InputNumber, Typography, message } from 'antd';
import { getPriceList, updatePrice } from '@/services/EditPrice';
import moment from 'moment';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <InputNumber step={0.01} autoFocus placeholder="请输入" />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditTable = (props: any) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [initLoading, setLoading] = useState<boolean>(false);
  const [initData, setData] = useState([]);

  const isEditing = (record: any) => record.periodId === editingKey;

  const edit = (record: any) => {
    if (record?.periodState != 'UnArchive') {
      message.warning('不可修改时间窗已归档的数据');
      return;
    }
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.periodId);
  };
  useImperativeHandle(props.cRef, () => ({
    data: async (data: any) => {
      setLoading(true);
      const list: any = await getList(data);
      setData(list);
    },
  }));
  const getList = (data: any) => {
    return new Promise(resolve => {
      getPriceList({
        distributorLevelId: data.distributorLevelId,
        financialYearId: data.financialYearId,
      })
        .then(res => {
          resolve(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const save = async (record: any) => {
    try {
      const row = await form.validateFields();
      const newData: any = [...initData];
      const index = newData.findIndex(
        (item: any) => record.periodId === item.periodId,
      );
      updatePrice({
        quotaScopeId: record?.id,
        ...record,
        ...row,
      }).then((res: any) => {
        message.success('开票价修改成功');
        props.actionRef.current.reload(); //刷新修改记录表格
      });
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      message.error('开票价修改失败');
      console.log('Validate Failed:', errInfo);
    }
  };
  const cancel = () => {
    setEditingKey('');
  };
  const columns = [
    {
      title: '时间窗名称',
      dataIndex: 'periodName',
      editable: false,
    },
    {
      title: '时间窗时间段',
      dataIndex: 'timeBucket',
      width: 200,
      editable: false,
    },
    {
      title: '开票价',
      dataIndex: 'value',
      editable: true,
      render: (text: any, record: any) => {
        return isNaN(parseFloat(text)) ? text : parseFloat(text).toFixed(2);
      },
    },
    {
      title: '最后修改人',
      dataIndex: 'updateByName',
      editable: false,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      render: (text: any) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
      editable: false,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right' as 'right',
      width: 120,
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record)}
              style={{ marginRight: 8 }}
            >
              保存
            </a>
            <a onClick={() => cancel()}>取消</a>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            修改
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'value' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false} autoComplete="off">
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        size="small"
        rowKey="periodId"
        loading={initLoading}
        scroll={{ x: '120%' }}
        bordered={false}
        dataSource={initData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditTable;
