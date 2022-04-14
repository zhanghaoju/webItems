import styles from "./index.less";
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Modal, Input, Form, Space, Button, Select, Upload } from 'antd';
import Icon from '@ant-design/icons';
import storage from '@/utils/storage';
// import { ElementItem } from '@/pages/application/Manger/data';

const FormItem = Form.Item
const { Option } = Select;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

interface ElementItem {
  businessType?: string
}

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit: (values: ElementItem) => void;
  listData?: any
}

const ImportPage : React.FC<IProps>  = ({visible, setVisible,onSubmit,listData}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const suffix = fileName ? <Icon onClick={(e) => clearFile(e)} type="close-circle" theme="filled"/> :
  <span/>;

  const handleUploadChange = ({file}: any) => {
    let file2:any = [file]
    setFile(file)
    setFileName(file.name)
    setFileList(file2)
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null)
    setFileName(null)
    setFileList([])
  };
  return(
    <Modal
      title={'导入'}
      visible={visible}
      destroyOnClose={true}
      width={'50%'}
      onCancel={() => setVisible(false)}
      footer={null}
    >
        <Upload
            fileList={fileList}
            beforeUpload={() => false}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={() => handleUploadChange}
        >
            <Input
                value={fileName}
                placeholder={'请选择文件'}
                suffix={suffix}
            />
        </Upload>
    </Modal>
  )
}

export default ImportPage
