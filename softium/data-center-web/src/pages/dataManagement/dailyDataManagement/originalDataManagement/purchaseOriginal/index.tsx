import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Space } from 'antd';
import { Table } from '@vulcan/utils';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getDailyPurchaseOriginalList,
  dailyOriginalDataPurchaseDelete,
  singleDailyOriginalDataPurchaseDelete,
  getPurchaseDayExportQuery,
} from '@/services/dailyDataManagement/originalDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';

interface PurchaseOriginalProps {
  PurchaseOriginal: any;
  dispatch: any;
  returnTabsKey: any;
}

interface GithubIssueItem {
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

const PurchaseOriginal: React.FC<PurchaseOriginalProps> = props => {
  const { returnTabsKey } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const fileStatusValuePocket = storage.get('pocketData').dataStatusPocket;

  useEffect(() => {}, []);

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '采购日期', //表格
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
      width: 130,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '采购日期', //表单
      dataIndex: 'purchaseDate',
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
      title: '供应商编码',
      dataIndex: 'vendorCode',
      valueType: 'text',
      width: 150,
    },
    {
      title: '供应商名称',
      dataIndex: 'vendorName',
      valueType: 'text',
      width: 200,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      width: 150,
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
      hideInSearch: true,
      width: 100,
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
      hideInSearch: true,
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
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
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: 120,
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/dailyDataManagement/originalDataManagement/purchaseOriginal/detail/${record.id}?sourceTabIndex=2&sourcePage=/dataManagement/dailyDataManagement/originalDataManagement`,
            )
          }
        >
          查看
        </a>,
        <Authorized code={'dayOrgPurch-delete'}>
          <Popconfirm
            onConfirm={() => handleSingleDelete(record)}
            title={'确认删除选中数据吗？'}
          >
            <Button type="link">删除</Button>
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

  //批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择需要删除的信息');
    } else {
      dailyOriginalDataPurchaseDelete(selectedRowData).then((res: any) => {
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

  //单个删除
  const handleSingleDelete = (record: any) => {
    const params = [record];
    singleDailyOriginalDataPurchaseDelete(params).then((res: any) => {
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
    getPurchaseDayExportQuery(searchParams).then((res: any) => {
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
            code="dataManage-day-purchaseOriginal"
            saveSearchValue
            tableAlertRender={false}
            columns={columns}
            rowSelection={{
              ...rowSelection,
            }}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            sticky={true}
            scroll={{ x: 2200 }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            formRef={ref}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getDailyPurchaseOriginalList({
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
                  <Authorized code={'dayOrgPurch-batDel'}>
                    <Button type="primary" onClick={() => handleBatchDelete()}>
                      批量删除
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'dayOrgPurch-batDel'}>
                    <Popconfirm
                      onConfirm={() => handleBatchDelete()}
                      title={'确认删除选中数据吗？'}
                    >
                      <Button type="primary">批量删除</Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'dayOrgPurch-export'}>
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
  ({ dispatch, PurchaseOriginal }: PurchaseOriginalProps) => ({
    PurchaseOriginal,
    dispatch,
  }),
)(PurchaseOriginal);
