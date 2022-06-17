import React, { ReactNode, useState } from 'react';
import { connect } from 'dva';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getList } from '@/services/match';
import { history } from 'umi';
import { Button } from 'antd';
import storage from '@/utils/storge';
import AddTask from './addTask';

interface MatchProps {
  match: any;
  dispatch: any;
}

interface ColumnItemProps {
  id: String;
  category: string;
}

const Match: React.FC<MatchProps> = () => {
  const [initModal, updateModal] = useState(false);

  const setModal = (modal: boolean) => {
    updateModal(modal);
  };

  const statusEnum: any = {
    1: { text: '数据导入', status: 'import' },
    2: { text: '数据匹配', status: 'match' },
    3: { text: '数据提交', status: 'submit' },
  };

  const templateEnum: any = {
    HCO: { text: 'HCO', status: 'HCO', label: 'HCO数据导入' },
    HCP: { text: 'HCP', status: 'HCP', label: 'HCP数据导入' },
  };

  const columns: ProColumns<ColumnItemProps>[] = [
    {
      title: '任务ID',
      dataIndex: 'id',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '任务描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '任务模板',
      dataIndex: 'template',
      ellipsis: true,
      valueEnum: templateEnum,
    },
    {
      title: '任务依赖事项',
      dataIndex: 'dependencies',
      hideInSearch: true,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      ellipsis: true,
      valueEnum: statusEnum,
    },
    {
      title: '创建人',
      dataIndex: 'username',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      render: (text: ReactNode, record: any) => {
        return (
          <Button
            type="link"
            onClick={() =>
              history.push(`/match/detail/${record.id}/${record.template}`)
            }
          >
            任务处理
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<ColumnItemProps, String[]>
        columns={columns}
        form={{ autoComplete: 'off' }}
        options={false}
        scroll={{ x: 'auto' }}
        request={(params, sort, filter) => {
          return getList({
            tenantId: storage.get('userInfo').tenantId,
            ...params,
            ...sort,
            ...filter,
          });
        }}
        postData={(data: any) => data.list}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => setModal(true)}>
            添加
          </Button>,
        ]}
      />
      {initModal ? (
        <AddTask templateEnum={templateEnum} setModal={setModal} />
      ) : null}
    </>
  );
};

export default connect(({ dispatch, match }: MatchProps) => ({
  match,
  dispatch,
}))(Match);
