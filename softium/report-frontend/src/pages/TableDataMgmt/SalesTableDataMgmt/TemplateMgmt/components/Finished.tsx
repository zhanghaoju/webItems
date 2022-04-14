import React from 'react';
import { Button, Result } from 'antd';
import { history } from 'umi';
import storage from '@/utils/storage';

export default () => {
  const onClick = () => {
    //打开模板列表
    storage.set('template', 'open');
    history.push({
      pathname: '/table-data-mgmt/sales/sales-query/terminal',
    });
  };
  return (
    <>
      <Result
        status="success"
        title="创建成功"
        subTitle="您的模板已创建成功，可前往模板列表查看详情"
        extra={[
          <Button type="primary" onClick={onClick}>
            前往模板列表
          </Button>,
        ]}
      />
    </>
  );
};
