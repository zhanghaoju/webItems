import React from 'react';
import { Button, message, Upload, Table } from 'antd';
import './styles/index.less';
import { UploadOutlined } from '@ant-design/icons/lib';

class ImportData extends React.PureComponent<any, any> {
  params: any = {};
  fixUrl: string = '';
  hcoColumns: any[] = [
    {
      key: 'targetCode',
      dataIndex: 'targetCode',
      title: '机构编码',
    },
    {
      key: 'targetName',
      dataIndex: 'targetName',
      title: '机构名称',
    },
    {
      key: 'targetLevelName',
      dataIndex: 'targetLevelName',
      title: '机构等级',
    },
    {
      key: 'targetAddress',
      dataIndex: 'targetAddress',
      title: '机构地址',
    },
    {
      key: 'failReason',
      dataIndex: 'failReason',
      title: '导入错误原因',
    },
  ];

  constructor(props: any) {
    super(props);
    const { params } = props;
    this.params = params;
    this.fixUrl = ``;
    this.state = {
      current: 0,
      importUrl: '',
      statusData: {},
      checkStatusData: {},
      pageNo: 1,
    };
  }

  componentDidMount(): void {
    const { toggleLoading } = this.props;
    toggleLoading && toggleLoading(true);
  }

  downloadTemplate = () => {
    const url = ``;
    window.open(url);
  };

  beforeUploadTemp = (file: any) => {
    const isLt10M = file.size / 1024 / 1024 < 20;
    if (!isLt10M) {
      message.error('文件大小必须小于20M');
    }
    return isLt10M;
  };

  beforeUpload = async (file: any) => {
    const isLt10M = file.size / 1024 / 1024 < 20;
    if (!isLt10M) {
      message.error('文件大小必须小于20M');
    }
    const { toggleLoading } = this.props;
    toggleLoading && toggleLoading(true);
    this.setState({
      importUrl: ``,
    });

    return isLt10M;
  };

  onFileUpload = (info: any) => {
    if (info.file && info.file.status === 'done') {
      const response = info.file.response || {};
      if (response.success) {
        const data = response.data || {};
      }
    }
  };

  reloadAndAnalyse = async (info: any, item: any) => {
    if (info.file && info.file.status === 'done') {
      const response = info.file.response || {};
      if (response.success) {
        const data = response.data || {};
        item.fileId = data.id;
        item.fileName = data.fileOldName;
        item.fileUrl = data.fileUrl;
        item.reImport = true;
      }
    }
  };

  onPageChange = (pageNo: number) => {
    const { toggleLoading } = this.props;
    toggleLoading && toggleLoading(true);
  };

  exportErrorData = () => {
    const url = ``;
    window.open(url);
  };

  downloadFile = (fileId: number) => {
    window.open(``);
  };

  nextStep = () => {};

  render() {
    const { importUrl, pageNo } = this.state;
    return (
      <>
        <div className="match-import-container">
          <div className="match-import-head">
            <Button type="primary" ghost onClick={this.downloadTemplate}>
              下载数据模板
            </Button>
            <Upload
              name="multipartFile"
              showUploadList={false}
              action={importUrl}
              onChange={this.onFileUpload}
              beforeUpload={this.beforeUpload as any}
              accept=".xls,.xlsx"
            >
              <Button type="primary" ghost icon={<UploadOutlined />}>
                选择导入文件
              </Button>
            </Upload>
          </div>
          <div>
            {[
              {
                id: 1,
                fileName: '測試',
                fileId: 'xxx',
                errorMessage: '上傳失败',
              },
            ].map((item: any) => {
              return (
                <div className="file-item" key={item.id}>
                  <span
                    className="file-name"
                    onClick={() => {
                      this.downloadFile(item.fileId);
                    }}
                  >
                    {item.fileName}
                  </span>
                  <span className="file-error">{item.errorMessage}</span>
                  <Upload
                    name="multipartFile"
                    showUploadList={false}
                    action={importUrl}
                    onChange={info => this.reloadAndAnalyse(info, item)}
                    beforeUpload={this.beforeUpload as any}
                    accept=".xls,.xlsx"
                  >
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      icon={<UploadOutlined />}
                    >
                      重新上传
                    </Button>
                  </Upload>
                </div>
              );
            })}
          </div>
          <div className="match-import-remark">
            <span>备注：</span>
            <span>1、文件上传格式持.xls</span>
            <span>2、导入文件大小不能超过20 M</span>
          </div>
        </div>
        <div className="status-container">
          <div className="status-head">
            <div>
              <span className="title">数据导入状态：</span>
              <span>数据成功导入1888条记录</span>
            </div>
            <div>
              <Button
                type="primary"
                className="download-btn"
                onClick={this.exportErrorData}
              >
                导出
              </Button>
              <Upload
                name="multipartFile"
                showUploadList={false}
                accept=".xls,.xlsx"
                action={this.fixUrl}
                onChange={info => () => {}}
                beforeUpload={this.beforeUploadTemp}
              >
                <Button type="primary" ghost icon={<UploadOutlined />}>
                  修复数据导入
                </Button>
              </Upload>
            </div>
          </div>
          <div className="error-container">
            <Table
              columns={this.hcoColumns}
              dataSource={[]}
              size="small"
              rowKey="id"
              pagination={{
                total: 100,
                showTotal: (total: any) => `共${total}条`,
                defaultPageSize: 20,
                onChange: this.onPageChange,
                current: pageNo,
                showQuickJumper: true,
              }}
              scroll={{ y: 600 }}
            />
          </div>
          <div className="match-import-next-btn">
            <Button type="primary" onClick={this.nextStep}>
              下一步
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default ImportData;
