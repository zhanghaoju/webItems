import React, { useEffect, useState } from 'react';
import { Descriptions, Form, message, Modal } from 'antd';
import { edit, getDetail } from '@/services/product/terminalPrice';
import { getColumns, handleColumnsData } from '@/pages/institution/util';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import './index.less';

interface PropsParams {
  detailCodes: any;
  detail: any;
  type: string;
  visible: boolean;
  setVisible: Function;
}

const TerminalEdit = (props: PropsParams) => {
  const [form] = Form.useForm();
  const { visible, detailCodes, type, setVisible, detail } = props;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [pageInfo, setPageInfo] = useState<any>({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [columns, setColumns] = useState<any[]>([]);

  const defaultColumns: ProColumns[] = [
    {
      title: '生效日期',
      dataIndex: 'startDate',
      valueType: 'date',
      width: 150,
      order: 30,
      editable: () => false,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      valueType: 'date',
      width: 150,
      order: 30,
      editable: () => false,
    },
    {
      title: '考核价',
      dataIndex: 'evaluationPrice',
      width: 100,
      order: 30,
      sorter: true,
      formItemProps: {
        rules: [
          {
            pattern: /^[0-9]+(.[0-9]{1,4})?$/,
            message: '数字并且小数保留四位',
          },
        ],
      },
    },
    {
      title: '开票价',
      dataIndex: 'invoicePrice',
      width: 100,
      order: 40,
      sorter: true,
      formItemProps: {
        rules: [
          {
            pattern: /^[0-9]+(.[0-9]{1,4})?$/,
            message: '数字并且小数保留四位',
          },
        ],
      },
    },
    {
      title: '折扣率',
      dataIndex: 'discount',
      width: 100,
      order: 40,
      formItemProps: {
        rules: [
          {
            pattern: /^[0-9]+(.[0-9]{1,4})?$/,
            message: '数字并且小数保留四位',
          },
        ],
      },
    },
    {
      title: '销售价',
      dataIndex: 'price',
      width: 120,
      order: 50,
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入',
          },
          {
            pattern: /^[0-9]+(.[0-9]{1,4})?$/,
            message: '数字并且小数保留四位',
          },
        ],
      },
    },
    {
      title: '备注1',
      dataIndex: 'remark1',
      width: 200,
      order: 60,
    },
    {
      title: '备注2',
      dataIndex: 'remark2',
      width: 200,
      order: 70,
    },
    {
      title: '备注3',
      dataIndex: 'remark3',
      width: 200,
      order: 80,
    },
    {
      title: '备注4',
      dataIndex: 'remark4',
      width: 200,
      order: 90,
    },
    {
      title: '备注5',
      dataIndex: 'remark5',
      width: 200,
      order: 100,
    },
  ];

  useEffect(() => {
    const request = async () => {
      const fields: any = await getColumns('t_sfe_terminal_price');
      if (type === 'edit') {
        defaultColumns.push({
          title: '操作',
          valueType: 'option',
          width: 100,
          fixed: 'right',
          render(text, entity, _, action) {
            return (
              <a
                onClick={() => {
                  action?.startEditable?.(entity.id);
                }}
              >
                修改
              </a>
            );
          },
        });
      }
      const column = await handleColumnsData(defaultColumns, fields.allFields);
      setColumns(column);
    };
    request().then();
  }, []);

  const editSave = async (key: any, row: any) => {
    await edit({ ...row });
    message.success('编辑成功');
  };

  if (columns.length === 0) return null;

  return (
    <Modal
      className="terminal-modal"
      title={type === 'view' ? '查看' : '编辑'}
      onCancel={() => setVisible(false)}
      onOk={() => setVisible(false)}
      visible={visible}
      centered
      width="60%"
    >
      <Descriptions>
        <Descriptions.Item label="产品编码">
          {detail?.productCode}
        </Descriptions.Item>
        <Descriptions.Item label="产品名称">
          {detail?.productName}
        </Descriptions.Item>
        <Descriptions.Item label="规格">
          {detail?.specification}
        </Descriptions.Item>
        <Descriptions.Item label="上游">
          {detail?.upInstitutionName}
        </Descriptions.Item>
        <Descriptions.Item label="终端">
          {detail?.terminalName}
        </Descriptions.Item>
      </Descriptions>
      <EditableProTable<ProColumns>
        options={false}
        search={false}
        request={async (params, sort: any, filter) => {
          const sorter: any = {};
          for (const t in sort) {
            sorter[t] =
              sort[t] === 'ascend'
                ? 'ASC'
                : sort[t] === 'descend'
                ? 'DESC'
                : '';
          }
          return getDetail({
            ...detailCodes,
            order: sorter,
            ...{ ...params, pageNo: params.current, counting: true },
            ...filter,
          });
        }}
        rowKey="id"
        recordCreatorProps={false}
        postData={(data: any) => {
          setPageInfo({
            pageSize: data.pageSize,
            current: data.pageNum,
            total: data.total,
          });
          return data.list;
        }}
        editable={{
          form,
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
          onSave: editSave,
        }}
        pagination={{
          ...pageInfo,
          showQuickJumper: true,
        }}
        scroll={{ x: 1500 }}
        columns={columns}
      />
    </Modal>
  );
};

export default TerminalEdit;
