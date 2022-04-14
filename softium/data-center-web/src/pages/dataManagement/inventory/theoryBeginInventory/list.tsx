import React, { useEffect, useRef, useState } from 'react';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Card, message, Select, Space } from 'antd';
import { useRequest, history } from 'umi';
import { Table, VulcanFile } from '@vulcan/utils';
import {
  getTheoryBeginInventoryList,
  exportFile,
  downloadTemplate,
} from '@/services/inventory/theoryBeginInventory';
import { connect } from 'dva';
import { getPeriodList } from '@/services/initResource';
import storage from '@/utils/storage';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';
import { Authorized } from '@vulcan/utils';

interface TheoreticalInventoryListProps {
  TheoreticalInventoryList: any;
  dispatch: any;
  location: any;
  history: any;
}

interface OpeningInventory {
  institutionCode?: string;
  institutionName?: string;
  institutionProvince?: string;
  institutionCity?: string;
  productCode?: string;
  productName?: string;
  productSpec?: string;
  theoryBeginInventory?: number;
  periodId?: string;
  pageSize?: number;
  pageNo?: number;
}

const { Option } = Select;

const TheoreticalInventoryList: React.FC<TheoreticalInventoryListProps> = props => {
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [periodList, setPeriodList] = useState([]);

  useEffect(() => {
    getPeriodListFunc();
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

  //数据导入
  const handleImport = () => {
    history.push({
      pathname: '/dataManagement/inventory/theoryBeginInventory/import',
      state: {
        periodId: searchParams.periodId,
      },
    });
  };

  //导出
  const exportRequest = () => {
    exportFile(searchParams).then((res: any) => {
      downloadFile(res);
    });
  };

  //下载模板
  const downloadTemplateRequest = useRequest(downloadTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  //重置表单
  const onReset = () => {
    ref?.current?.setFieldsValue({
      periodId: initialPeriodName,
      institutionCode: undefined,
      institutionName: undefined,
      productCode: undefined,
      productName: undefined,
    });
  };

  const columns: ProColumns<OpeningInventory>[] = [
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
      dataIndex: 'productName',
      title: '产品名称',
    },
    {
      dataIndex: 'productSpec',
      title: '产品规格',
      search: false,
    },
    {
      dataIndex: 'productBatchNo',
      title: '产品批号',
      search: false,
    },
    {
      dataIndex: 'beginTheoryValue',
      title: '理论期初库存',
      search: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'updateByName',
      title: '维护人',
      search: false,
    },
    {
      dataIndex: 'updateTime',
      title: '维护时间',
      search: false,
      valueType: 'dateTime',
    },
  ];

  const ref = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  return (
    <Card>
      <Table<OpeningInventory>
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        code="dataManage-month-theoryBegin"
        saveSearchValue
        onSubmit={params => {
          setSearchParams(params);
        }}
        // params={searchParams}
        headerTitle={
          <Space>
            <Authorized code={'theoryBegin-dataImport'}>
              <Button type={'primary'} onClick={() => handleImport()}>
                {'数据导入'}
              </Button>
            </Authorized>
            <Authorized code={'theoryBegin-export'}>
              <Button onClick={() => exportRequest()}>导出</Button>
            </Authorized>
            <Authorized code={'theoryBegin-down'}>
              <Button
                onClick={() => downloadTemplateRequest.run()}
                loading={downloadTemplateRequest.loading}
              >
                下载模板
              </Button>
            </Authorized>
          </Space>
        }
        request={(params, sort, filter) => {
          return getTheoryBeginInventoryList({
            periodId: ref.current?.getFieldValue('periodId'),
            ...params,
            ...sort,
            ...filter,
          });
        }}
        onReset={() => {
          onReset();
        }}
        tableLayout={'fixed'}
        columns={columns}
        rowKey={'id'}
        formRef={ref}
        actionRef={actionRef}
      />
    </Card>
  );
};

export default connect(
  ({ dispatch, TheoreticalInventoryList }: TheoreticalInventoryListProps) => ({
    TheoreticalInventoryList,
    dispatch,
  }),
)(TheoreticalInventoryList);
