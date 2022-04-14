import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Space } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Table } from '@vulcan/utils';
import {
  getDailySaleOriginalList,
  dailyOriginalDataSaleDelete,
  singleDailyOriginalDataSaleDelete,
  getExportQuery,
} from '@/services/dailyDataManagement/originalDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';

interface ConsignmentOriginalProps {
  ConsignmentOriginal: any;
  dispatch: any;
  location: any;
}

interface GithubIssueItem {
  isSeal: string;
  id?: string;
  fileId?: string;
  fileName?: string;
  projectName?: string;
  companyName?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  productCode?: string;
  customerName?: string;
  productName?: string;
  productSpec?: string;
  businessType?: string;
  quantity?: string;
  productUnit?: string;
  saleDate?: string;
  saleYear?: string;
}

const { Option } = Select;

const ConsignmentOriginal: React.FC<ConsignmentOriginalProps> = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileStatusValuePocket = storage.get('pocketData').dataStatusPocket;
  const [searchParams, setSearchParams] = useState({});
  useEffect(() => {}, []);

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '采集方式',
      dataIndex: 'accessType',
      valueType: 'text',
      hideInTable: true,
      valueEnum: transformArray('accessTypePocket', 'label', 'value'),
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: 150,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: 200,
    },
    {
      title: '客户编码',
      dataIndex: 'customerCode',
      valueType: 'text',
      width: 180,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      width: 200,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      width: 180,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      width: 200,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '生产厂家',
      dataIndex: 'producer',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            mode="multiple"
            allowClear
            placeholder="请选择"
            style={{ width: '100%' }}
          >
            {(fileStatusValuePocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '数据id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '上传时间',
      dataIndex: 'fileTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (text, record, _, action) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/dailyDataManagement/originalDataManagement/consignmentOriginal/detail/${record.id}?sourceTabIndex=4&sourcePage=/dataManagement/dailyDataManagement/originalDataManagement`,
            )
          }
        >
          查看
        </a>,
        <Authorized code={'dayOrgConsign-delete'}>
          <Popconfirm
            onConfirm={() => handleSingleDelete(record)}
            title={'确认删除选中数据吗？'}
          >
            <Button type="link" disabled={record.isSeal === 'Archive'}>
              删除
            </Button>
          </Popconfirm>
        </Authorized>,
      ],
    },
  ];

  const rowSelection = {
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.isSeal === 1,
      };
    },
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择需要删除的信息');
    } else {
      dailyOriginalDataSaleDelete(selectedRowData).then((res: any) => {
        if (res && res.success && res.success === true) {
          message.success('删除成功');
          actionRef?.current?.reload();
          setSelectedRowKeys([]);
        } else {
          message.warning('删除失败');
        }
      });
    }
  };

  const handleSingleDelete = (record: any) => {
    const params = [record];
    singleDailyOriginalDataSaleDelete(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('删除成功');
        actionRef?.current?.reload();
        setSelectedRowKeys([]);
      } else {
        message.warning('删除失败');
      }
    });
  };

  //导出
  const exportData = () => {
    setLoading(true);
    const params = Object.assign(searchParams, { erpFlag: 1 });
    getExportQuery(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    });
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="dataManage-day-consignmentOriginal"
            saveSearchValue
            columns={columns}
            rowSelection={{
              ...rowSelection,
            }}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            scroll={{ x: 2200 }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            formRef={ref}
            sticky={true}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getDailySaleOriginalList({
                erpFlag: 1, //0为销售，1为发货
                ...params,
                ...sort,
                ...filter,
              });
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <Space>
                {selectedRowKeys.length === 0 ? (
                  <Authorized code={'dayOrgConsign-batDel'}>
                    <Button type="primary" onClick={() => handleBatchDelete()}>
                      批量删除
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'dayOrgConsign-batDel'}>
                    <Popconfirm
                      onConfirm={() => handleBatchDelete()}
                      title={'确认删除选中数据吗？'}
                    >
                      <Button type="primary">批量删除</Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'dayOrgConsign-export'}>
                  <Button onClick={() => exportData()} loading={loading}>
                    导出
                  </Button>
                </Authorized>
              </Space>
            }
            toolBarRender={() => []}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, ConsignmentOriginal }: ConsignmentOriginalProps) => ({
    ConsignmentOriginal,
    dispatch,
  }),
)(ConsignmentOriginal);
