import React from 'react';
import ListTable from '@/pages/institution/list';
import { getInstitutionInfo } from '@/services/institution';

const InstitutionInfo = (props: any) => {
  const {
    params: { record },
  } = props;
  const columns: any = [
    {
      title: '经销商机构名称',
      dataIndex: 'name',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '经销商机构编码',
      dataIndex: 'code',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '标准机构编码',
      dataIndex: 'standardCode',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '标准下游机构类型',
      dataIndex: 'institutionCategory',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      width: '7%',
      ellipsis: true,
    },
  ];

  return (
    <div className="alias-container">
      <ListTable
        columns={columns}
        getList={getInstitutionInfo}
        scrollX={1000}
        hideSearch={true}
        hideSelection={true}
        hasDefaultColumns={true}
        params={{ institutionId: record.id }}
      />
    </div>
  );
};

export default InstitutionInfo;
