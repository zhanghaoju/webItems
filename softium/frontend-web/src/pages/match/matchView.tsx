import React from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons/lib';
import './styles/index.less';
import ProTable from '@ant-design/pro-table';
import { getList } from '@/services/match';
import storage from '@/utils/storge';

export interface TableListItem {
  key: number;
  name: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  progress: number;
  money: number;
}

const columns: any[] = [
  {
    title: '匹配状态(全部)',
    key: 'confirmed',
    dataIndex: 'confirmed',
    hideInSearch: true,
  },
  {
    title: '匹配计算(全部)',
    key: 'calculated',
    dataIndex: 'calculated',
    filters: true,
    hideInSearch: true,
  },
  {
    title: '机构代码',
    key: 'code',
    dataIndex: 'code',
    hideInSearch: true,
  },
  {
    title: '机构名称',
    key: 'name',
    dataIndex: 'name',
    hideInSearch: true,
  },
  {
    title: '机构别名',
    key: 'alias',
    dataIndex: 'alias',
    hideInSearch: true,
  },
  {
    title: '省份',
    key: 'provinceName',
    dataIndex: 'provinceName',
    hideInSearch: true,
  },
  {
    title: '城市',
    key: 'cityName',
    dataIndex: 'cityName',
    hideInSearch: true,
  },
  {
    title: '区县',
    key: 'countyName',
    dataIndex: 'countyName',
    hideInSearch: true,
  },
  {
    title: '地址',
    key: 'address',
    dataIndex: 'address',
    hideInSearch: true,
  },
  {
    title: '机构类别',
    key: 'categoryDesc',
    dataIndex: 'categoryDesc',
    hideInSearch: true,
  },
  {
    title: '机构性质',
    key: 'typeDesc',
    dataIndex: 'typeDesc',
    hideInSearch: true,
  },
  {
    title: '邮编',
    key: 'zipCode',
    dataIndex: 'zipCode',
    hideInSearch: true,
  },
  {
    title: '机构电话',
    key: 'telephone',
    dataIndex: 'telephone',
    hideInSearch: true,
  },
  {
    title: '官网',
    key: 'website',
    dataIndex: 'website',
    hideInSearch: true,
  },
  {
    title: '机构状态',
    key: 'statusDesc',
    dataIndex: 'statusDesc',
    hideInSearch: true,
  },
  {
    title: '状态原因',
    key: 'statusReasonDesc',
    dataIndex: 'statusReasonDesc',
    hideInSearch: true,
  },
  {
    title: '机构简介',
    key: 'introduction',
    dataIndex: 'introduction',
    hideInSearch: true,
  },
  {
    title: '职工人数',
    key: 'staffNum',
    dataIndex: 'staffNum',
    hideInSearch: true,
  },
  {
    title: '纬度',
    key: 'latitude',
    dataIndex: 'latitude',
    hideInSearch: true,
  },
  {
    title: '经度',
    key: 'longitude',
    dataIndex: 'longitude',
    hideInSearch: true,
  },
  {
    title: '床位数',
    key: 'bedNumber',
    dataIndex: 'bedNumber',
    hideInSearch: true,
  },
  {
    title: '年门诊量',
    key: 'visits',
    dataIndex: 'visits',
    hideInSearch: true,
  },
  {
    title: '年住院量',
    key: 'hospitalization',
    dataIndex: 'hospitalization',
    hideInSearch: true,
  },
  {
    title: '机构等级',
    key: 'levelName',
    dataIndex: 'levelName',
    hideInSearch: true,
  },
  {
    title: '是否为医保药',
    key: 'isHealthInsurance',
    dataIndex: 'isHealthInsurance',
    hideInSearch: true,
  },
  {
    title: '药店面积',
    key: 'area',
    dataIndex: 'area',
    hideInSearch: true,
  },
  {
    title: '开架闭架',
    key: 'openShelfDesc',
    dataIndex: 'openShelfDesc',
    hideInSearch: true,
  },
  {
    title: '错误原因',
    key: 'failReason',
    dataIndex: 'failReason',
    hideInSearch: true,
  },
];

export default class MatchData extends React.PureComponent<any, any> {
  importUrl: string = '';
  tableListDataSource: TableListItem[] = [];

  constructor(props: any) {
    super(props);
  }

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

  render() {
    return (
      <>
        <Button type="primary" ghost>
          数据匹配任务执行
        </Button>
        <div className="status-head match-head">
          <span>
            操作执行结果: 导入数据 486 条记录匹配，精准率 85.8 % ，耗时：1分钟
          </span>
          <div>
            <Button type="primary" ghost>
              导出
            </Button>
            <Upload
              name="multipartFile"
              showUploadList={false}
              action={this.importUrl}
              onChange={this.onFileUpload}
              beforeUpload={this.beforeUpload as any}
              accept=".xls,.xlsx"
            >
              <Button type="primary" ghost icon={<UploadOutlined />}>
                导入
              </Button>
            </Upload>
          </div>
        </div>
        <div>
          <ProTable<TableListItem>
            columns={columns}
            form={{ autoComplete: 'off' }}
            rowKey="key"
            search={false}
            options={false}
            request={(params, sort, filter) => {
              // return {
              //   data: this.tableListDataSource,
              //   success: true,
              //   total: this.tableListDataSource.length,
              // };
              return getList({
                tenantId: storage.get('userInfo').tenantId,
                ...filter,
              });
            }}
            scroll={{ x: 4500 }}
            dateFormatter="string"
          />
        </div>
      </>
    );
  }
}
