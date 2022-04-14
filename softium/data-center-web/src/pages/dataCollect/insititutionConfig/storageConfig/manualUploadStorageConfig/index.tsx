import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import { Table } from '@vulcan/utils';
import UploadTemplateConfigSetting from './uploadTemplateConfig';
import { match } from 'react-router';

const { TabPane } = Tabs;

interface ParamsProps {
  id: string;
  businessDesc: string;
}

interface UploadTemplateConfigWrapProps {
  match: match<ParamsProps>;
  source: any;
}

const UploadTemplateConfigWrap = (props: UploadTemplateConfigWrapProps) => {
  return (
    <div
      style={{
        background: '#ffffff',
        padding: '15px 0 10px 10px',
      }}
    >
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="上传模板配置" key="1">
          <UploadTemplateConfigSetting {...props} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UploadTemplateConfigWrap;
