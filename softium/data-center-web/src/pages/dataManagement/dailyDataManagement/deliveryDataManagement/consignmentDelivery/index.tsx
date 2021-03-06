import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Modal, Space } from 'antd';
import { Table } from '@vulcan/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getDeliveryDataExportRequest,
  getDailySaleDeliveryList,
  getDataSeal,
  getInstitutionRelyQuery,
} from '@/services/dailyDataManagement/deliveryDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';
import { FormInstance } from 'antd/lib/form';
import { getDictionary } from '@/services/monthDataManagement/inspectDataManagement';

interface ConsignmentDeliveryProps {
  ConsignmentDelivery: any;
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

const ConsignmentDelivery: React.FC<ConsignmentDeliveryProps> = props => {
  const [searchParams, setSearchParams] = useState({});
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [sealPeriodName, setSealPeriodName] = useState('');
  const [sealPeriodId, setSealPeriodId] = useState('');
  const [dataSealModal, setDataSealModal] = useState(false);
  const [initialDataSealBtnText, setInitialDataSealBtnText] = useState('');
  const [periodNameValuePocket, setPeriodNameValuePocket] = useState(
    storage.get('pocketData').periodNamePocket,
  );
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);

  useEffect(() => {
    getDictionaryFunc({ systemCodes: ['Region'] });
  }, []);

  //????????????
  const getDictionaryFunc = async (params: any) => {
    try {
      let optionData: any = { ...dictionary, City: [] };
      const res = await getDictionary(params);
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          } else {
            optionData.City = optionData.City.concat([...item.entries]);
          }
        });
      }
      setDictionary(optionData);
    } catch (error) {
      message.error('????????????????????????');
    }
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      width: '5%',
      ellipsis: true,
    },
    {
      title: '????????????',
      dataIndex: 'saleDate',
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
      title: '?????????????????????',
      dataIndex: 'fromInstitutionName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'toInstitutionName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'productName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionCode', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName', //??????
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????',
      dataIndex: 'provinceNameList',
      hideInTable: true,
      valueType: 'select',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            allowClear
            showSearch
            showArrow
            mode={'multiple'}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            labelInValue={true}
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //????????????????????????
              form.resetFields(['cityNameList']);
              //???????????????????????????
              let optionData: any = { ...dictionary, City: [] };
              setDictionary(optionData);
              //????????????????????????????????????????????????e???????????????name
              if (e.length > 0) {
                let provinceNameList: any = [];
                let params: any = [];
                e.forEach((item: any) => {
                  provinceNameList.push(item.label);
                  params.push(item.value);
                });
                getDictionaryFunc({ codes: params });
                setProvince(provinceNameList);
              } else {
                form.resetFields(['provinceNameList']);
                setProvince([]);
              }
            }}
          >
            {(dictionary.Region || []).map((res: any) => (
              <Option value={res.value}>{res.name}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'cityNameList',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            allowClear
            showSearch
            mode={'multiple'}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //???e???????????????name
              if (e.length > 0) {
                let cityNameList: any = [];
                e.forEach((i: any) => {
                  dictionary.City.forEach((j: any) => {
                    if (i === j.value) {
                      cityNameList.push(j.name);
                    }
                  });
                });
                setRegionData({ ...regionData, city: cityNameList });
              } else {
                form.resetFields(['cityNameList']);
                setRegionData({ ...regionData, city: [] });
              }
            }}
          >
            {(dictionary.City || []).map((res: any) => (
              <Option value={res.value}>{res.name}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardCustomerCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
      width: '7%',
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardCustomerName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '????????????',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '????????????',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'fromInstitutionCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'fromInstitutionName', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '??????????????????',
      dataIndex: 'toInstitutionCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '??????????????????',
      dataIndex: 'toInstitutionName', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productName', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productSpec', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '??????????????????',
      dataIndex: 'originalProducer', //??????
      valueType: 'text',
      width: '5%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'productQuantity', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productUnit', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
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
      width: '3%',
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/dailyDataManagement/deliveryDataManagement/consignmentDelivery/detail/${record.id}?sourceTabIndex=4&sourcePage=/dataManagement/dailyDataManagement/deliveryDataManagement`,
            )
          }
        >
          ??????
        </a>,
      ],
    },
  ];

  //??????
  const saleInspectExport = (filter: any) => {
    setExportLoading(true);
    Object.assign(searchParams, { erpFlag: 1 }),
      getDeliveryDataExportRequest(searchParams).then((res: any) => {
        downloadFile(res);
        setTimeout(() => {
          setExportLoading(false);
        }, 3000);
      });
  };

  //????????????
  const onReset = () => {
    ref?.current?.resetFields();
    setProvince([]);
    setRegionData({ city: [] });
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="dataManage-day-consignmentDelivery"
            saveSearchValue
            tableAlertRender={false}
            onSubmit={params => {
              setSearchParams(params);
            }}
            columns={columns}
            onReset={() => onReset()}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            sticky={true}
            scroll={{ x: 4600 }}
            formRef={ref}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getDailySaleDeliveryList({
                erpFlag: 1, //0????????????1?????????
                provinceNameList: province,
                cityNameList: regionData.city,
                ...params,
                ...sort,
                ...filter,
              });
            }}
            headerTitle={
              <Space>
                <Authorized code={'dayDelConsign-export'}>
                  <Button
                    type="primary"
                    key={'export'}
                    loading={exportLoading}
                    onClick={filter => saleInspectExport(filter)}
                  >
                    ??????
                  </Button>
                </Authorized>
              </Space>
            }
            rowKey="id"
            dateFormatter="string"
          />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, ConsignmentDelivery }: ConsignmentDeliveryProps) => ({
    ConsignmentDelivery,
    dispatch,
  }),
)(ConsignmentDelivery);
