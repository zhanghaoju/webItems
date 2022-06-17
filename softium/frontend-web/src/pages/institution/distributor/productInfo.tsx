import React from 'react';
import ListTable from '@/pages/institution/list';
import { getProductInfo } from '@/services/institution';

const ProductInfo = (props: any) => {
  const {
    params: { record },
  } = props;
  const columns: any = [
    {
      title: '经销商产品名称',
      dataIndex: 'name',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '经销商产品编码',
      dataIndex: 'code',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '经销商产品规格',
      dataIndex: 'specification',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardName',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardCode',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '标准产品规格',
      dataIndex: 'specification',
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
      title: '创建时间',
      dataIndex: 'createTime',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      width: '7%',
      ellipsis: true,
    },
  ];

  return (
    <div className="alias-container">
      <ListTable
        columns={columns}
        getList={getProductInfo}
        scrollX={1000}
        hideSearch={true}
        hideSelection={true}
        hasDefaultColumns={true}
        params={{ institutionId: record.id }}
      />
    </div>
  );
};

export default ProductInfo;
