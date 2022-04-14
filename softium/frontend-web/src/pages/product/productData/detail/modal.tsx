import React, { useImperativeHandle, useState } from 'react';
import { Button, Modal, Tabs } from 'antd';

const DetailModal = (props: any) => {
  const { fields, onOk } = props;
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState(false);
  const [data, setData] = useState<any>({});
  const [detailTabs, setDetailTabs] = useState([]);

  const toggleVisible = (bool: boolean) => {
    setVisible(bool);
    onOk && onOk();
  };

  const updateParams = (params: any) => {
    setParams(params);
  };

  useImperativeHandle(props.cRef, () => ({
    visible: toggleVisible,
    params: updateParams,
    setDetailTabs,
  }));

  return (
    <Modal
      centered={true}
      maskClosable={false}
      destroyOnClose
      onCancel={() => toggleVisible(false)}
      footer={[
        <Button key="primary" onClick={() => toggleVisible(false)}>
          确定
        </Button>,
      ]}
      className="modal-width"
      title="详情"
      visible={visible}
    >
      <div className="modal-height">
        <Tabs defaultActiveKey="0" type="card">
          {(detailTabs || []).map((item: any, index: number) => {
            return (
              <Tabs.TabPane tab={item.title} key={index}>
                <item.component
                  data={data}
                  params={params}
                  fields={fields}
                  metadata={props.metadata}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </Modal>
  );
};

export default DetailModal;
