import React, { useImperativeHandle, useState } from 'react';
import { Button, Modal } from 'antd';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import './import.less';

const ModalImport = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<any>({});
  const {
    uploadUrl,
    fileName,
    extraData,
    commitUrl,
    baseUrl,
    title,
    headers,
    cancel,
  } = state;

  const toggleVisible = (bool: boolean) => {
    setVisible(bool);
  };
  const toggleState = (state: any) => {
    setState(state);
  };

  useImperativeHandle(props.cRef, () => ({
    visible: toggleVisible,
    state: toggleState,
  }));

  const onCancel = () => {
    toggleVisible(false);
    cancel && cancel();
  };

  return (
    <Modal
      destroyOnClose
      onCancel={onCancel}
      maskClosable={false}
      footer={[
        <Button key="2" type="primary" onClick={onCancel}>
          确定
        </Button>,
      ]}
      width="40%"
      title={title || '导入'}
      visible={visible}
    >
      <div className="import-modal">
        <BatchImport
          uploadUrl={uploadUrl || '/quota/scope/startImport' || ''}
          fileName={fileName || 'file'}
          extraData={extraData || {}}
          headers={headers || {}}
          requestStatic={request}
          commitUrl={commitUrl || '/quota/scope/commit' || ''}
          downloadResultUrl={process.env.ENTERPRISE_URL || ''}
          baseUrl={baseUrl || process.env.ENTERPRISE_URL}
          onReturn={() => history.back()}
          accept={`.xls,.xlsx`}
          downloadType={'request'}
        />
      </div>
    </Modal>
  );
};

export default ModalImport;
