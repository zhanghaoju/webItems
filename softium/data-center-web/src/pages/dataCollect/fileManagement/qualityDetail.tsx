import React, { useEffect, useState } from 'react';
import { Button, Tabs, Descriptions } from 'antd';
import { history } from 'umi';
import { match } from 'react-router';
import CommonListPageForQuality from './commonListPageForQuality';
import { qualityDetailLoad } from '@/services/dataUploadFileManagement';
import transformText from '@/utils/transform';

const { TabPane } = Tabs;

interface ParamsProps {
  id: string;
  businessDesc: string;
}

interface QualityDetailProps {
  match: match<ParamsProps>;
}

const QualityDetail = (props: QualityDetailProps) => {
  const {
    match: { params },
  } = props;
  const [data, setData] = useState<any>({});
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    onload();
  }, []);

  const onload = async () => {
    const res = await qualityDetailLoad({
      fileId: params.id,
    });
    setData(res.data);
    setTabs(res.data.tabName);
  };

  //质检数据查看tab控制
  const SD = tabs.filter((item: any, i: any) => {
    return item === 'SD';
  });

  const SM = tabs.filter((item: any, i: any) => {
    return item === 'SM';
  });

  const ID = tabs.filter((item: any, i: any) => {
    return item === 'ID';
  });

  const IM = tabs.filter((item: any, i: any) => {
    return item === 'IM';
  });

  const PD = tabs.filter((item: any, i: any) => {
    return item === 'PD';
  });

  const PM = tabs.filter((item: any, i: any) => {
    return item === 'PM';
  });

  const DD = tabs.filter((item: any, i: any) => {
    return item === 'DD';
  });

  const DM = tabs.filter((item: any, i: any) => {
    return item === 'DM';
  });

  return (
    <div>
      <div>
        <Descriptions
          title=""
          style={{
            width: '100%',
            minHeight: '50px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            padding: '10px 0 0 30px',
          }}
        >
          <Descriptions.Item label="文件名">{data.fileName}</Descriptions.Item>
          <Descriptions.Item label="采集方式">
            {transformText(
              'accessTypePocket',
              'label',
              'value',
              'accessType',
              data,
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Tabs defaultActiveKey="1" type="card">
        {SM.length > 0 && (
          <TabPane tab="月销售" key="1">
            <CommonListPageForQuality
              {...props}
              businessType={'SM'}
              source={1}
            />
          </TabPane>
        )}
        {PM.length > 0 && (
          <TabPane tab="月采购" key="2">
            <CommonListPageForQuality
              {...props}
              businessType={'PM'}
              source={1}
            />
          </TabPane>
        )}
        {IM.length > 0 && (
          <TabPane tab="月库存" key="3">
            <CommonListPageForQuality
              {...props}
              businessType={'IM'}
              source={1}
            />
          </TabPane>
        )}
        {DM.length > 0 && (
          <TabPane tab="月发货" key="4">
            <CommonListPageForQuality
              {...props}
              businessType={'DM'}
              source={1}
            />
          </TabPane>
        )}
        {SD.length > 0 && (
          <TabPane tab="日销售" key="5">
            <CommonListPageForQuality
              {...props}
              businessType={'SD'}
              source={1}
            />
          </TabPane>
        )}
        {PD.length > 0 && (
          <TabPane tab="日采购" key="6">
            <CommonListPageForQuality
              {...props}
              businessType={'PD'}
              source={1}
            />
          </TabPane>
        )}
        {ID.length > 0 && (
          <TabPane tab="日库存" key="7">
            <CommonListPageForQuality
              {...props}
              businessType={'ID'}
              source={1}
            />
          </TabPane>
        )}
        {DD.length > 0 && (
          <TabPane tab="日发货" key="8">
            <CommonListPageForQuality
              {...props}
              businessType={'DD'}
              source={1}
            />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default QualityDetail;
