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

  //省市字典
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
      message.error('获取省市字典失败');
    }
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      width: '5%',
      ellipsis: true,
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
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表单
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName', //表单
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表单
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode', //表单
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName', //表单
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName', //表格
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
    },
    {
      title: '省份',
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
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //清空城市表单数据
              form.resetFields(['cityNameList']);
              //更正省市下拉框数据
              let optionData: any = { ...dictionary, City: [] };
              setDictionary(optionData);
              //请求所选省份下城市下拉框数据、把e的值转化为name
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
      title: '城市',
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
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //把e的值转化为name
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
      title: '标准客户编码', //表单
      dataIndex: 'standardCustomerCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准客户编码', //表格
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
      width: '7%',
    },
    {
      title: '标准客户名称', //表单
      dataIndex: 'standardCustomerName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称', //表格
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
    },
    {
      title: '标准产品编码', //表单
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准产品编码', //表格
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '标准生产厂家',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '原始生产厂家',
      dataIndex: 'originalProducer', //表格
      valueType: 'text',
      width: '5%',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
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
          查看
        </a>,
      ],
    },
  ];

  //导出
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

  //重置表单
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
                erpFlag: 1, //0为销售，1为发货
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
                    导出
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