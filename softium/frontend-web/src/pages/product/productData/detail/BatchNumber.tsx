import React, { useRef, useState } from 'react';
import {
  ProColumns,
  EditableProTable,
  ActionType,
} from '@ant-design/pro-table';
import {
  Button,
  Popconfirm,
  Form,
  Modal,
  Input,
  DatePicker,
  message,
  Space,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  addProductBatchNo,
  getProductBatchNoList,
  deleteProductBatchNo,
  editProductBatchNo,
  batchDeleteProductBatchNo,
} from '@/services/product/ProductBatchNo';
import { transformToTableRequest } from '@/utils/dataConversion';
import { Authorized } from '@vulcan/utils';

export default (props: any) => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [okLoading, setOkLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { params } = props;

  const columns: ProColumns[] = [
    {
      title: '批号',
      dataIndex: 'batchNo',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入产品批号',
          },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '产品批号必须为英文或者数字组成',
          },
        ],
      },
    },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, entity, _, action) => [
        <Authorized code="productBatchNoEdit" key="editable">
          <a
            onClick={() => {
              action?.startEditable?.(entity.id);
            }}
          >
            编辑
          </a>
        </Authorized>,
        <Authorized code="productBatchNoDelete" key="delete">
          <Popconfirm
            title="确定要删除该批号？"
            onConfirm={() => deleteBatchNo(entity)}
          >
            <a>删除</a>
          </Popconfirm>
        </Authorized>,
      ],
    },
  ];

  const deleteBatchNo = async (entity: any) => {
    try {
      await deleteProductBatchNo({
        id: entity.id,
      });
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const addBatchNo = async () => {
    try {
      const values = await addForm.validateFields();
      setOkLoading(true);
      await addProductBatchNo({
        ...values,
        productCode: params.code,
      });
      setOkLoading(false);
      message.success('添加成功');
      setVisible(false);
      addForm.resetFields();
      actionRef.current?.reload();
    } catch (e) {
      console.log(e);
      setOkLoading(false);
    }
  };

  const editSave = async (key: any, row: any, newLine: any) => {
    await editProductBatchNo({ ...row });
    message.success('编辑成功');
  };

  const batchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.info('请选择需要删除的批号');
      return;
    }
    await batchDeleteProductBatchNo({
      ids: selectedRowKeys,
    });
    message.success('批量删除成功');
    actionRef.current?.reload();
    setSelectedRowKeys([]);
  };

  return (
    <>
      <EditableProTable
        actionRef={actionRef}
        search={false}
        options={false}
        headerTitle={
          <Space>
            <Authorized code="productBatchNoAdd" key="editable">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setVisible(true);
                }}
              >
                添加批号
              </Button>
            </Authorized>
            <Authorized code="productBatchNoBatchDelete" key="delete">
              <Popconfirm title="确定要删除批号？" onConfirm={batchDelete}>
                <Button>批量删除</Button>
              </Popconfirm>
            </Authorized>
          </Space>
        }
        columns={columns}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (value: any[]) => {
            setSelectedRowKeys(value);
          },
        }}
        recordCreatorProps={false}
        editable={{
          form,
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
          onSave: editSave,
        }}
        params={{
          productCode: params.code,
        }}
        request={(params: any, sort, filter) => {
          return transformToTableRequest(
            {
              ...params,
              ...sort,
              ...filter,
              pageNo: params.current,
            },
            getProductBatchNoList,
          );
        }}
        pagination={{
          pageSize: 10,
        }}
      />
      <Modal
        title="添加批号"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={addBatchNo}
        confirmLoading={okLoading}
      >
        <Form form={addForm} autoComplete="off">
          <Form.Item
            label="产品批号"
            name="batchNo"
            rules={[
              {
                required: true,
                message: '请输入产品批号',
              },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: '产品批号必须为英文或者数字组成',
              },
            ]}
          >
            <Input placeholder="请输入产品批号" />
          </Form.Item>
          <Form.Item label="生产日期" name="productionDate">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
