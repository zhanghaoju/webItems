import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Space } from 'antd';
import { Table } from '@vulcan/utils';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getInventoryOriginalList,
  monthlyOriginalDataInventoryDelete,
  singleMonthlyOriginalDataInventoryDelete,
  getInventoryExportQuery,
} from '@/services/monthDataManagement/originalDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';
import _ from 'lodash';
import { getPeriodList } from '@/services/initResource';

interface InventoryOriginalProps {
  InventoryOriginal: any;
  dispatch: any;
  location: any;
  history: any;
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
  const {
    history,
    location: { state },
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [loading, setLoading] = useState(false);
  const fileStatusValuePocket = storage.get('pocketData').dataStatusPocket;
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);

  useEffect(() => {
    getPeriodListFunc();
    //如果是从工作台跳转过来，销售年月赋值为带过来的账期，否则为页面初始化默认账期
    if (state && state.periodId) {
      ref?.current?.setFieldsValue({
        periodId: state.periodId,
      });
      setSearchParams({ periodId: state.periodId });
      history.replace({});
    } else {
      ref?.current?.setFieldsValue({
        periodId: storage.get('defaultPeriod'),
      });
      setSearchParams({ periodId: storage.get('defaultPeriod') });
    }
    setInitialPeriodName(storage.get('defaultPeriod'));
  }, []);

  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
      //在这里做页面首次load时判断账期是否已经封板
      let item: any = null;
      if (state && state.periodId) {
        item = res.data.filter((i: any) => {
          return state.periodId === i.id;
        });
      } else {
        item = res.data.filter((i: any) => {
          return storage.get('defaultPeriod') === i.id;
        });
      }
      setaArchiveStatus(item[0].isSeal);
      setaArchiveFunc(item[0].isSeal);
    } catch (e) {
      message.warning('获取账期下拉数据失败');
    }
  };

  const setaArchiveFunc = (status: any) => {
    if (status === 'Archive') {
      setDisabledForIsSeal(true);
    } else {
      setDisabledForIsSeal(false);
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '销售年月',
      dataIndex: 'periodId',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            showSearch
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              ref?.current?.setFieldsValue({
                periodId: e,
              });
              periodList.forEach((i: any) => {
                if (e === i.id) {
                  setaArchiveStatus(i.isSeal);
                }
              });
            }}
          >
            {(periodList || []).map((res: any) => (
              <Option value={res.id}>{res.periodName}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '库存日期', //表格
      dataIndex: 'inventoryDate',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
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
      width: 180,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      ellipsis: true,
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
      ellipsis: true,
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
      width: 100,
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
      width: 90,
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/monthlyDataManagement/originalDataManagement/inventoryOriginal/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataManagement/monthlyDataManagement/originalDataManagement`,
            )
          }
        >
          查看
        </a>,
        record.isSeal === 'Archive' ? (
          <Authorized code={'monthOrgInve-delete'}>
            <Button type="link" disabled={record.isSeal === 'Archive'}>
              删除
            </Button>
          </Authorized>
        ) : (
          <Authorized code={'monthOrgInve-delete'}>
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
      monthlyOriginalDataInventoryDelete(selectedRowData).then((res: any) => {
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
    singleMonthlyOriginalDataInventoryDelete(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('删除成功');
        actionRef?.current?.reload();
        setSelectedRowKeys([]);
      } else {
        message.warning('删除失败');
      }
    });
  };

  //重置表单
  const onReset = () => {
    ref?.current?.setFieldsValue({
      periodId: initialPeriodName,
    });
  };

  const exportData = () => {
    setLoading(true);
    const checkedPeriodId = searchParams.periodId;
    const item: any = _.find(periodList, ['id', checkedPeriodId]) || {};
    const params = Object.assign({ periodName: item.periodName }, searchParams);
    getInventoryExportQuery(params).then((res: any) => {
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
            code="dataManage-month-inventoryOriginal"
            saveSearchValue
            tableAlertRender={false}
            columns={columns}
            rowSelection={{
              ...rowSelection,
            }}
            sticky={true}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            scroll={{ x: 2200 }}
            formRef={ref}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getInventoryOriginalList({
                periodId: ref?.current?.getFieldValue('periodId'),
                ...params,
                ...sort,
                ...filter,
              });
            }}
            onSubmit={params => {
              setSearchParams(params);
              //提交查询时设置全局按钮状态控制变量
              setaArchiveFunc(archiveStatus);
            }}
            onReset={() => {
              onReset();
              //在这里做页面重置时判断账期是否已经封板
              let item: any = periodList.filter((i: any) => {
                return searchParams.periodId === i.id;
              });
              setaArchiveFunc(item[0].isSeal);
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <Space>
                {selectedRowKeys.length === 0 ? (
                  <Authorized code={'monthOrgInve-batDel'}>
                    <Button
                      type="primary"
                      onClick={() => handleBatchDelete()}
                      disabled={disabledForIsSeal}
                    >
                      批量删除
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'monthOrgInve-batDel'}>
                    <Popconfirm
                      onConfirm={() => handleBatchDelete()}
                      title={'确认删除选中数据吗？'}
                      disabled={disabledForIsSeal}
                    >
                      <Button type="primary" disabled={disabledForIsSeal}>
                        批量删除
                      </Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'monthOrgInve-export'}>
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
