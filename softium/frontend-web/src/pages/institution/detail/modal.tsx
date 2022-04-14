import React, { useImperativeHandle, useState, useRef } from 'react';
import { Button, Modal, Tabs } from 'antd';
import HospitalDetail from '@/pages/institution/detail/detail';

const DetailModal = (props: any) => {
  const { detailTabs } = props;
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState<any>({});
  const toggleVisible = (bool: boolean) => {
    setVisible(bool);
  };

  useImperativeHandle(props.cRef, () => ({
    visible: toggleVisible,
    params: (data: any) => {
      setParams({
        extMetadata: data.extMetadata,
        record: data.record,
        category: data.category,
        auth: data.auth,
        detailFields: data.detailFields,
        toggleVisible: toggleVisible,
        width: data.width,
        handleDetail: data.handleDetail,
      });
      toggleVisible(data.visible);
    },
  }));

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      centered
      onCancel={() => toggleVisible(false)}
      footer={[
        <Button key="primary" onClick={() => toggleVisible(false)}>
          确定
        </Button>,
      ]}
      width={params.width || '80%'}
      title="详情"
      visible={visible}
    >
      <div className="detail-header">
        <h2>{params?.record?.name}</h2>
        <span>{params?.record?.code}</span>
      </div>
      {detailTabs ? (
        <Tabs defaultActiveKey="0" type="card">
          {(detailTabs || []).map((item: any, index: number) => {
            const Component = item.component;
            return (
              <Tabs.TabPane tab={item.title} key={index}>
                <div className="modal-height">
                  {visible && Component && <Component params={params} />}
                </div>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      ) : (
        <HospitalDetail params={params} />
      )}
    </Modal>
  );
};

export default DetailModal;
