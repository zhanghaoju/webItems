import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TheoreticalInventory } from '@/pages/dataManagement/inventory/inventoryAnalysis/data';
import { Button, Card, message, Select, Space } from 'antd';
import {
  getInventoryAnalysisList,
  exportFile,
} from '@/services/inventory/inventoryAnalysis';
import { history, useRequest } from 'umi';
import { VulcanFile } from '@vulcan/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Table } from '@vulcan/utils';
import { connect } from 'dva';
import storage from '@/utils/storage';
import { getPeriodList } from '@/services/initResource';
import { FormInstance } from 'antd/lib/form';
import { getDictionary } from '@/services/dayMatchProcess';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';
import { getFileManagementListInfo } from '@/services/dataUploadFileManagement';

interface InventoryAnalysisListProps {
  InventoryAnalysisList: any;
  dispatch: any;
  location: any;
  history: any;
}

const { Option } = Select;
const InventoryAnalysisList: React.FC<InventoryAnalysisListProps> = props => {
  const [query, setQuery] = useState<TheoreticalInventory>();
  const [subclassDealerLevelOption, setSubclassDealerLevelOption] = useState(
    [],
  );
  const [initialPeriodName, setInitialPeriodName] = useState();
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [periodList, setPeriodList] = useState([]);

  useEffect(() => {
    getPeriodListFunc();
    //调用主数据接口，获取经销商级别下拉数据
    // getDictionaryFunc();
    ref.current?.setFieldsValue({
      periodId: storage.get('defaultPeriod'),
    });
    setSearchParams({ periodId: storage.get('defaultPeriod') });
    setInitialPeriodName(storage.get('defaultPeriod'));
  }, []);

  //时间窗下拉列表
  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
    } catch (e) {
      message.warning('获取时间窗下拉数据失败');
    }
  };

  //经销商级别下拉列表--调取主数据字典
  const getDictionaryFunc = async () => {
    try {
      const res = await getDictionary({
        systemCodes: ['SubclassDealerLevel'],
      });
      if (res.data && res.data.list) {
        setSubclassDealerLevelOption(res.data.list[0].entries);
      }
    } catch (error) {
      message.error('获取经销商级别下拉列表失败');
    }
  };

  //导出
  const exportRequest = () => {
    exportFile(searchParams).then((res: any) => {
      downloadFile(res);
    });
  };

  //导入
  const importRequest = () => {
    history.push({
      pathname: '/dataManagement/inventory/inventoryAnalysis/import',
      state: {
        periodId: searchParams.periodId,
      },
    });
  };

  //重置表单
  const onReset = () => {
    ref?.current?.setFieldsValue({
      periodId: initialPeriodName,
      institutionCode: undefined,
      institutionName: undefined,
      productCode: undefined,
      productBatchNo: undefined,
      productName: undefined,
    });
  };

  const columns: ProColumns<TheoreticalInventory>[] = [
    {
      title: '时间窗',
      dataIndex: 'periodId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            showSearch
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="请选择"
            style={{ width: '100%' }}
          >
            {(periodList || []).map((res: any) => (
              <Option value={res.id}>{res.periodName}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      dataIndex: 'institutionCode',
      title: '经销商编码',
      fixed: 'left',
    },
    {
      dataIndex: 'institutionName',
      title: '经销商名称',
    },
    {
      dataIndex: 'institutionProvince',
      title: '经销商省份',
      search: false,
    },
    {
      dataIndex: 'institutionCity',
      title: '经销商城市',
      search: false,
    },
    {
      dataIndex: 'productCode',
      title: '产品编码',
    },
    {
      dataIndex: 'productBatchNo',
      title: '产品批号',
    },
    {
      dataIndex: 'productName',
      title: '产品名称',
    },
    {
      dataIndex: 'productSpec',
      title: '产品规格',
      search: false,
    },
    {
      dataIndex: 'productUnit',
      title: '产品单位',
      search: false,
    },
    {
      dataIndex: 'productManufacturer',
      title: '产品厂家',
      search: false,
    },
    {
      dataIndex: 'beginTheoryQuantity',
      title: '理论期初库存（数量）',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'fromInstitutionVolume',
      title: '上游销量',
      search: false,
    },
    {
      dataIndex: 'toInstitutionVolume',
      title: '自身销量',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'beginTheoryPrice',
      title: '理论期初库存（金额）',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【考核价】*【数量】',
    },
    {
      dataIndex: 'endTheoryQuantity',
      title: '理论期末库存（数量）',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'endTheoryPrice',
      title: '理论期末库存（金额）',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'endActualQuantity',
      title: '期末实际库存（数量）',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'endActualPrice',
      title: '期末实际库存（金额）',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'diffQuantity',
      title: '差异值（数量）',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'diffPrice',
      title: '差异值（金额）',
      search: false,
      valueType: 'digit',
      tooltip:
        '公式：【期末理论库存（调整后）- 期末实际库存】（均为数量）*【考核价】',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (dom, entity, index, action) => (
        <Space>
          <a
            onClick={() => {
              history.push({
                pathname: '/dataManagement/inventory/inventoryAnalysis/detail',
                state: entity,
              });
            }}
          >
            查看
          </a>
        </Space>
      ),
    },
  ];

  const ref = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  return (
    <Card>
      <Table<TheoreticalInventory>
        code="dataManage-month-inventoryAnalysis"
        saveSearchValue
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        beforeSearchSubmit={params => {
          setQuery(params);
          return params;
        }}
        onSubmit={params => {
          setSearchParams(params);
        }}
        onReset={() => onReset()}
        // params={searchParams}
        formRef={ref}
        headerTitle={
          <Space>
            <Authorized code={'inventoryAnalysis-export'}>
              <Button type={'primary'} onClick={() => exportRequest()}>
                <DownloadOutlined />
                导出
              </Button>
            </Authorized>
            <Authorized code={'inventoryAnalysis-import'}>
              <Button onClick={() => importRequest()}>库存调整导入</Button>
            </Authorized>
          </Space>
        }
        sticky={true}
        scroll={{ x: 4000 }}
        request={async (params, sort, filter) => {
          return getInventoryAnalysisList({
            periodId: ref.current?.getFieldValue('periodId'),
            ...params,
            ...sort,
            ...filter,
          });
        }}
        tableLayout={'fixed'}
        columns={columns}
        rowKey={'id'}
        actionRef={actionRef}
      />
    </Card>
  );
};

export default connect(
  ({ dispatch, InventoryAnalysisList }: InventoryAnalysisListProps) => ({
    InventoryAnalysisList,
    dispatch,
  }),
)(InventoryAnalysisList);
