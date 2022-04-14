import React, { ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Button, Space, Popconfirm, message } from 'antd';
import NewTemplate from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/NewTemplate';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TemplateList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
import { useRequest } from 'ahooks';
import {
  delTemplate,
  getTemplateList,
  exportTemplate,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/api';
import { history } from 'umi';
import { Table, VulcanFile } from '@vulcan/utils';
export interface ListTableRef {
  show: () => void;
}

export interface ListProps {
  modelRef:
    | React.MutableRefObject<ListTableRef | undefined>
    | ((modelRef: ListTableRef) => void);
}

const List: React.FC<ListProps> = ({ modelRef }) => {
  const delRequest = useRequest(delTemplate, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef?.current?.reload();
    },
  });
  const exportTemplateRequest = useRequest(exportTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  const [visible, setVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  useImperativeHandle(modelRef, () => ({
    show,
  }));

  const show = () => {
    setVisible(true);
  };

  const onOk = () => {
    setVisible(false);
  };

  const columns: ProColumns<TemplateList>[] = [
    // {
    //   title: '表名称',
    //   dataIndex: 'templateName',
    //   hideInTable: true,
    // },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      // search: false,
    },
    {
      title: '描述',
      dataIndex: 'templateDescribe',
      search: false,
      width: '30%',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      valueType: 'date',
      search: false,
    },
    {
      title: '修改日期',
      dataIndex: 'updateTime',
      valueType: 'date',
      search: false,
    },
    {
      title: '修改人',
      dataIndex: 'updateByName',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_: ReactNode, entity: TemplateList) => {
        return [
          <a
            key={'edit'}
            onClick={() => {
              history.push({
                pathname: '/table-data-mgmt/sales/template-add',
                state: {
                  type: 'edit',
                  data: entity,
                },
              });
            }}
          >
            编辑
          </a>,
          <Popconfirm
            onConfirm={() => {
              delRequest?.run({ id: entity?.id || '' });
            }}
            key="popconfirm"
            title={`确认删除吗?`}
            okText="是"
            cancelText="否"
          >
            <a key={'del'}> 删除 </a>
          </Popconfirm>,
          <a
            key={'detail'}
            onClick={() => {
              exportTemplateRequest?.run({ templateId: entity.id || '' });
            }}
          >
            下载模板
          </a>,
        ];
      },
    },
  ];
  return (
    <>
      <Button onClick={show}>查看模板</Button>
      <Modal
        width={850}
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
        title={'模板列表'}
        onOk={onOk}
      >
        <ProTable<TemplateList>
          headerTitle={
            <Space>
              <NewTemplate />
            </Space>
          }
          search={{
            labelWidth: 'auto',
            span: 12,
          }}
          actionRef={actionRef}
          toolBarRender={false}
          request={async params => {
            const res = await getTemplateList(params);
            const { list, ...others } = res?.data || {};
            return {
              ...others,
              data: list || [],
            };
          }}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          // pagination={false}
        />
      </Modal>
    </>
  );
};
export default List;
