import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Space } from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getPurchaseOriginalList,
  monthlyOriginalDataPurchaseDelete,
  singleMonthlyOriginalDataPurchaseDelete,
  getUntreatedPeriod,
  getPurchaseExportQuery,
} from '@/services/monthDataManagement/originalDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import _ from 'lodash';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized, Table } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';
import { getPeriodList } from '@/services/initResource';

interface PurchaseOriginalProps {
  PurchaseOriginal: any;
  dispatch: any;
  returnTabsKey: any;
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

const PurchaseOriginal: React.FC<PurchaseOriginalProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const { returnTabsKey } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const fileStatusValuePocket = storage.get('pocketData').dataStatusPocket;
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);

  useEffect(() => {
    getPeriodListFunc();
    //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
      //????????????????????????load?????????????????????????????????
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
      message.warning('??????????????????????????????');
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
      title: '????????????',
      dataIndex: 'periodId',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
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
            placeholder="?????????"
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
      title: '????????????',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      width: 130,
      fixed: 'left',
    },
    {
      title: '????????????', //??????
      dataIndex: 'purchaseDate',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '????????????', //??????
      dataIndex: 'purchaseDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'accessType',
      valueType: 'text',
      hideInTable: true,
      valueEnum: transformArray('accessTypePocket', 'label', 'value'),
    },
    {
      title: '???????????????',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: 150,
    },
    {
      title: '???????????????',
      dataIndex: 'institutionName',
      valueType: 'text',
      ellipsis: true,
      width: 200,
    },
    {
      title: '???????????????',
      dataIndex: 'vendorCode',
      valueType: 'text',
      width: 180,
    },
    {
      title: '???????????????',
      dataIndex: 'vendorName',
      valueType: 'text',
      ellipsis: true,
      width: 200,
    },
    {
      title: '????????????',
      dataIndex: 'productCode',
      valueType: 'text',
      width: 150,
    },
    {
      title: '????????????',
      dataIndex: 'productName',
      valueType: 'text',
      ellipsis: true,
      width: 200,
    },
    {
      title: '????????????',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '????????????',
      dataIndex: 'producer',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '??????',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '??????',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '??????',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
      width: 130,
    },
    {
      title: '??????',
      dataIndex: 'fileStatus',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            mode="multiple"
            allowClear
            placeholder="?????????"
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
      title: '?????????',
      dataIndex: 'fileName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'fileTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: 100,
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/monthlyDataManagement/originalDataManagement/purchaseOriginal/detail/${record.id}?sourceTabIndex=2&sourcePage=/dataManagement/monthlyDataManagement/originalDataManagement`,
            )
          }
        >
          ??????
        </a>,
        record.isSeal === 'Archive' ? (
          <Authorized code={'monthOrgPurch-delete'}>
            <Button type="link" disabled={record.isSeal === 'Archive'}>
              ??????
            </Button>
          </Authorized>
        ) : (
          <Authorized code={'monthOrgPurch-delete'}>
            <Popconfirm
              onConfirm={() => handleSingleDelete(record)}
              title={'??????????????????????????????'}
            >
              <Button type="link" disabled={record.isSeal === 'Archive'}>
                ??????
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

  //????????????
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('??????????????????????????????');
    } else {
      monthlyOriginalDataPurchaseDelete(selectedRowData).then((res: any) => {
        if (res && res.success && res.success === true) {
          message.success('????????????');
          actionRef?.current?.reload();
          setSelectedRowKeys([]);
        } else {
          message.warning('????????????');
        }
      });
    }
  };

  //????????????
  const handleSingleDelete = (record: any) => {
    const params = [record];
    singleMonthlyOriginalDataPurchaseDelete(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('????????????');
        actionRef?.current?.reload();
        setSelectedRowKeys([]);
      } else {
        message.warning('????????????');
      }
    });
  };

  //????????????
  const onReset = () => {
    ref?.current?.setFieldsValue({
      periodId: initialPeriodName,
    });
  };

  //??????
  const exportData = () => {
    setLoading(true);
    const checkedPeriodId = searchParams.periodId;
    const item: any = _.find(periodList, ['id', checkedPeriodId]) || {};
    const params = Object.assign({ periodName: item.periodName }, searchParams);
    getPurchaseExportQuery(params).then((res: any) => {
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
            code="dataManage-month-purchaseOriginal"
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
            scroll={{ x: 2500 }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onSubmit={params => {
              setSearchParams(params);
              //???????????????????????????????????????????????????
              setaArchiveFunc(archiveStatus);
            }}
            formRef={ref}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getPurchaseOriginalList({
                periodId: ref?.current?.getFieldValue('periodId'),
                ...params,
                ...sort,
                ...filter,
              });
            }}
            onReset={() => {
              onReset();
              //?????????????????????????????????????????????????????????
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
                  <Authorized code={'monthOrgPurch-batDel'}>
                    <Button
                      type="primary"
                      onClick={() => handleBatchDelete()}
                      disabled={disabledForIsSeal}
                    >
                      ????????????
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'monthOrgPurch-batDel'}>
                    <Popconfirm
                      onConfirm={() => handleBatchDelete()}
                      title={'??????????????????????????????'}
                      disabled={disabledForIsSeal}
                    >
                      <Button type="primary" disabled={disabledForIsSeal}>
                        ????????????
                      </Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'monthOrgPurch-export'}>
                  <Button onClick={() => exportData()} loading={loading}>
                    ??????
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
