import React, { useImperativeHandle, useState, forwardRef } from 'react';
import { Button, Modal } from 'antd';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import './index.less';

interface ModalImportProps {
  uploadUrl: string;
  fileName?: string;
  extraData?: any;
  commitUrl: string;
  baseUrl?: string;
  title?: string;
  headers?: any;
  onOk?: any;
}

const ModalImport = forwardRef(
  (props: ModalImportProps, ref: React.Ref<any>) => {
    const [visible, setVisible] = useState(false);
    const {
      uploadUrl,
      fileName,
      extraData,
      commitUrl,
      baseUrl,
      title,
      headers,
      onOk,
    } = props;

    const toggleVisible = () => {
      setVisible(!visible);
    };

    useImperativeHandle(ref, () => ({
      visible: toggleVisible,
    }));

    const onCancel = () => {
      toggleVisible();
      onOk && onOk();
    };

    const onOkClick = () => {
      toggleVisible();
      onOk && onOk();
    };

    return (
      <Modal
        destroyOnClose
        onCancel={onCancel}
        maskClosable={false}
        footer={[
          <Button key="2" type="primary" onClick={onOkClick}>
            确定
          </Button>,
        ]}
        width="40%"
        title={title || '导入'}
        visible={visible}
      >
        <div className="configuration-month-config-territory-manage-import-modal">
          <BatchImport
            uploadUrl={uploadUrl || ''}
            fileName={fileName || 'file'}
            extraData={extraData || {}}
            headers={headers || {}}
            requestStatic={request}
            commitUrl={commitUrl || ''}
            downloadResultUrl={process.env.BASE_URL || ''}
            baseUrl={baseUrl || process.env.BASE_URL}
            onReturn={() => history.back()}
            accept={`.xls,.xlsx`}
            downloadType={'request'}
            tips="提示：单次批量导入最多支持30000条数据"
          />
        </div>
      </Modal>
    );
  },
);

export default ModalImport;
