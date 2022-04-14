import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Space } from 'antd';
import { Table } from '@vulcan/utils';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getDailyInventoryOriginalList,
  dailyOriginalDataInventoryDelete,
  singleDailyOriginalDataInventoryDelete,
  getInventoryDayExportQuery,
} from '@/services/dailyDataManagement/originalDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';

interface InventoryOriginalProps {
  InventoryOriginal: any;
  dispatch: any;
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

const InventoryOriginal: React.FC<InventoryOriginalProps> = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const fileStatusValuePocket = storage.get('pocketData').dataStatusPocket;
  const periodNameValuePocket = storage.get('pocketData').periodNamePocket;

  useEffect(() => {}, []);

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '库存日期', //表格
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      width: 120,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '库存日期', //表单
      dataIndex: 'inventoryDate',
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
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: 100,
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/dailyDataManagement/originalDataManagement/inventoryOriginal/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataManagement/dailyDataManagement/originalDataManagement`,
            )
          }
        >
          查看
        </a>,
        record.isSeal === 'Archive' ? (
          <Authorized code={'dayOrgInve-delete'}>
            <Button type="link" disabled={record.isSeal === 'Archive'}>
              删除
            </Button>
          </Authorized>
        ) : (
          <Authorized code={'dayOrgInve-delete'}>
            <Popconfirm
              onConfirm={() => handleSingleDelete(record)}
              title={'确认删除选中数据吗？'}
            >
              <Button type="link" disabled={record.isSeal === 'Archive'}>
                删除
              </Button>
            </Popconfirm>
          </Authorized>
        ),
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
      dailyOriginalDataInventoryDelete(selectedRowData).then((res: any) => {
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
    singleDailyOriginalDataInventoryDelete(params).then((res: any) => {
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
    getInventoryDayExportQuery(searchParams).then((res: any) => {
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
            code="dataManage-day-inventoryOriginal"
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
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            sticky={true}
            scroll={{ x: 2200 }}
            formRef={ref}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getDailyInventoryOriginalList({
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
                  <Authorized code={'dayOrgInve-batDel'}>
                    <Button type="primary" onClick={() => handleBatchDelete()}>
                      批量删除
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'dayOrgInve-batDel'}>
                    <Popconfirm
                      onConfirm={() => handleBatchDelete()}
                      title={'确认删除选中数据吗？'}
                    >
                      <Button type="primary">批量删除</Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'dayOrgInve-export'}>
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
  ({ dispatch, InventoryOriginal }: InventoryOriginalProps) => ({
    InventoryOriginal,
    dispatch,
  }),
)(InventoryOriginal);
