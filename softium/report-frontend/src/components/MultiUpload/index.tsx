import React from 'react';
import { Modal, Upload } from 'antd';
import { UploadProps } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';

export interface MultiUploadProps extends UploadProps {}

const MultiUpload: React.FC<MultiUploadProps> = ({
  action,
  name,
  data,
  fileList,
}) => {
  const getBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        // onPreview={this.handlePreview}
        // onChange={this.handleChange}
      >
        {uploadButton}
      </Upload>
      {/*<Modal*/}
      {/*  visible={previewVisible}*/}
      {/*  title={previewTitle}*/}
      {/*  footer={null}*/}
      {/*  onCancel={this.handleCancel}*/}
      {/*>*/}
      {/*  <img alt="example" style={{ width: '100%' }} src={previewImage} />*/}
      {/*</Modal>*/}
    </>
  );
};
