import React, { ReactNode, useRef, useState } from 'react';
import { Button, Form, Input, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  checkAlias,
  getAliasList,
  insertAlias,
  updateAlias,
} from '@/services/institution';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib';
import _ from 'lodash';
import { handleLikeFieldChange } from '@/pages/institution/util';

interface TableListItem {
  id: string;
  name: string;
}

const Alias = (props: any) => {
  let isInsert: boolean = true;
  const [form] = Form.useForm();
  const actionRef = useRef<any>(undefined);
  const {
    params: { record, auth },
  } = props;
  const { add, del } = auth || {};
  const [data, setData] = useState<any[]>([]);

  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
    },
    {
      title: '别名',
      dataIndex: 'name',
      ellipsis: true,
      width: '93%',
      search: false,
      render: (text: string, item: any) => {
        if (!item.name) {
          return (
            <Form form={form} autoComplete="off">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="name"
                rules={[
                  { required: true, message: '' },
                  { validator: onChange },
                ]}
              >
                <Input
                  onKeyUp={e => handleLikeFieldChange(e, form, 'name')}
                  placeholder="请输入别名"
                  ref={input => {
                    if (input != null) {
                      input.focus();
                    }
                  }}
                />
              </Form.Item>
            </Form>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      fixed: 'right',
      hideInTable: !del,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            {!record.name ? <span onClick={() => saveAlias()}>保存</span> : ''}
            {del ? (
              <Popconfirm
                placement="topRight"
                onConfirm={() => deleteAlias(record)}
                title={`您确定要删除吗？`}
                icon={<QuestionCircleOutlined />}
              >
                <span>删除</span>
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];

  const onChange = _.debounce((rule: any, value: any, callback: any) => {
    if (value) {
      checkAlias({
        name: value,
      }).then((res: any) => {
        return new Promise(() => {
          if (res.data) {
            callback('别名已存在');
          } else {
            callback();
          }
        });
      });
    } else {
      callback('请输入别名');
    }
  }, 300);

  const deleteAlias = (record: any) => {
    if (record.id) {
      record.isDeleted = 1;
      updateAlias(record).then((res: any) => {
        if (res) {
          const { current } = actionRef;
          if (current) {
            isInsert = true;
            setData([]);
            current.reload();
            message.success('删除成功');
          }
        }
      });
    } else {
      const { current } = actionRef;
      if (current) {
        isInsert = true;
        setData([]);
        current.reload();
        message.success('删除成功');
      }
    }
  };

  const saveAlias = () => {
    form.validateFields().then(values => {
      if (values) {
        values.name = values.name && values.name.replace(/(^\s+)|(\s+$)/g, '');
        insertAlias({ institutionId: record.id, ...values }).then(
          (res: any) => {
            if (res) {
              message.success('添加成功');
              form.resetFields();
              const { current } = actionRef;
              if (current) {
                isInsert = true;
                setData([]);
                current.reload();
                form.validateFields().then(values => {
                  values.name = null;
                  form.setFieldsValue(values);
                });
              }
            }
          },
        );
      }
    });
  };

  const addAlias = () => {
    if (isInsert) {
      isInsert = false;
      const { current } = actionRef;
      data.push({ name: '' });
      setData(data);
      if (current) {
        current.reload();
      }
    }
  };

  return (
    <ProTable<TableListItem>
      className="alias-container"
      form={{ autoComplete: 'off' }}
      columns={columns}
      actionRef={actionRef}
      request={() => {
        return getAliasList({
          pageSize: 100,
          counting: true,
          institutionId: record.id,
        });
      }}
      postData={(res: any) => {
        const list: any[] = res?.list ? res.list : [];
        return [...list, ...data];
      }}
      options={false}
      search={false}
      pagination={false}
      rowKey="name"
      headerTitle={
        add ? (
          <Button type="primary" onClick={() => addAlias()}>
            <PlusOutlined />
            添加别名
          </Button>
        ) : null
      }
    />
  );
};

export default Alias;
