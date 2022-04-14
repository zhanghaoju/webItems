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
  getSaleDeliveryList,
  getUntreatedPeriod,
  getDataSeal,
  getCleanStatus,
  getInstitutionRelyQuery,
  getSaleTypeComputeQuery,
  getInsTypeComputeQuery,
} from '@/services/monthDataManagement/deliveryDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, {
  transformArray,
  transformTextToArray,
} from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';
import { FormInstance } from 'antd/lib/form';
import _ from 'lodash';
import { getPeriodList } from '@/services/initResource';
import { getDictionary } from '@/services/dayMatchProcess';

interface SaleDeliveryProps {
  SaleDelivery: any;
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

const SaleDelivery: React.FC<SaleDeliveryProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [initialPeriod, setInitialPeriod] = useState('');
  const [sealPeriodName, setSealPeriodName] = useState('');
  const [sealPeriodId, setSealPeriodId] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [dataSealModal, setDataSealModal] = useState(false);
  const [initialDataSealBtnText, setInitialDataSealBtnText] = useState('');
  const [isSealNotice, setIsSealNotice] = useState('');
  const [searchParams, setSearchParams] = useState<any>({ periodIds: [] });
  const [periodNameValuePocket, setPeriodNameValuePocket] = useState(
    storage.get('pocketData').periodNamePocket,
  );
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);
  const [dictionary, setDictionary] = useState({
    InstitutionCategory: [], //客户类型，经销商类型
    SubclassDealerLevel: [], //客户级别，经销商级别
    Region: [], //省
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);
  const [exportBeforeStatus, setExportBeforeStatus] = useState(false);

  useEffect(() => {
    getPeriodListFunc();
    getDictionaryFunc();
    getUntreatedPeriod().then((res: any) => {
      if (res && res.success === true) {
        setInitialDataSealBtnText(res.data.isSeal);
      }
    });
    //如果是从工作台跳转过来，销售年月赋值为带过来的账期，否则为页面初始化默认账期
    if (state && state.periodId) {
      ref?.current?.setFieldsValue({
        periodIds: [state.periodId],
      });
      const periodName: any =
        _.find(periodNameValuePocket, ['value', state.periodId]) || {};
      setSearchParams({ periodIds: [state.periodId] });
      setSealPeriodName(periodName.label);
      history.replace({});
    } else {
      ref?.current?.setFieldsValue({
        periodIds: [storage.get('defaultPeriod')],
      });
      const periodName: any =
        _.find(periodNameValuePocket, [
          'value',
          storage.get('defaultPeriod'),
        ]) || {};
      setSearchParams({ periodIds: [storage.get('defaultPeriod')] });
      setSealPeriodName(periodName.label);
    }
    setInitialPeriod(storage.get('defaultPeriod'));
    setSealPeriodId(storage.get('defaultPeriod')); //未查询前拿默认销售年月的id
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

  //经销商级别，经销商类型下拉列表--调取主数据字典
  const getDictionaryFunc = async () => {
    try {
      let optionData: any = { ...dictionary };
      const res = await getDictionary({
        systemCodes: ['SubclassDealerLevel', 'InstitutionCategory', 'Region'],
      });
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'SubclassDealerLevel') {
            optionData.SubclassDealerLevel = item.entries;
          }
          if (item.systemCode === 'InstitutionCategory') {
            optionData.InstitutionCategory = item.entries;
          }
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          }
        });
      }
      setDictionary(optionData);
    } catch (error) {
      message.error('获取经销商级别、经销商类型下拉列表失败');
    }
  };

  //省市字典
  const getDictionaryCity = async (params: any) => {
    try {
      let optionData: any = { ...dictionary, City: [] };
      const res = await getDictionary({
        codes: params,
      });
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
      title: '销售年月',
      dataIndex: 'periodIds',
      hideInTable: true,
      width: '6%',
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
            mode={'multiple'}
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              if (e.length > 0 && e.length <= 6) {
                ref?.current?.setFieldsValue({
                  periodIds: e,
                });
                periodList.forEach((i: any) => {
                  if (e[e.length - 1] === i.id) {
                    setaArchiveStatus(i.isSeal);
                  }
                });
              }
              if (e.length === 0) {
                setSearchParams({ periodIds: [initialPeriod] });
                ref?.current?.setFieldsValue({
                  periodIds: [initialPeriod],
                });
              }
              if (e.length > 6) {
                message.warning('最多支持选择6个时间窗');
                let arr: any = e;
                arr.pop();
                ref?.current?.setFieldsValue({
                  periodIds: arr,
                });
                periodList.forEach((i: any) => {
                  if (e[e.length - 1] === i.id) {
                    setaArchiveStatus(i.isSeal);
                  }
                });
              }
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
      fixed: 'left',
      width: '6%',
      ellipsis: true,
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
      width: '5%',
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
      dataIndex: 'fromInstitutionLevel',
      title: '经销商级别',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'请选择'}
            allowClear={true}
            style={{ width: '100%' }}
            options={dictionary.SubclassDealerLevel?.map(
              (t: { name: any; value: any }) => ({
                label: t?.name,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    {
      dataIndex: 'fromInstitutionType',
      title: '经销商类型',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'请选择'}
            allowClear={true}
            style={{ width: '100%' }}
            options={dictionary.InstitutionCategory?.map(
              (t: { name: any; value: any }) => ({
                label: t?.name,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName', //表格
      hideInSearch: true,
      valueType: 'text',
      width: '7%',
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
                getDictionaryCity(params);
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
      dataIndex: 'toInstitutionLevel',
      title: '客户级别',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'请选择'}
            allowClear={true}
            style={{ width: '100%' }}
            options={dictionary.SubclassDealerLevel?.map(
              (t: { name: any; value: any }) => ({
                label: t?.name,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    {
      dataIndex: 'toInstitutionType',
      title: '客户类型',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'请选择'}
            allowClear={true}
            style={{ width: '100%' }}
            options={dictionary.InstitutionCategory?.map(
              (t: { name: any; value: any }) => ({
                label: t?.name,
                value: t?.value,
              }),
            )}
          />
        );
      },
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
      width: '10%',
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
      title: '销售类型',
      dataIndex: 'salesType', //表格
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('saleComputeType', 'label', 'value'),
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
      title: '是否机构挂靠',
      dataIndex: 'isInstitutionAttach',
      valueEnum: transformArray('whetherNot', 'label', 'value'),
      hideInTable: true,
    },
    {
      title: '是否产品挂靠',
      dataIndex: 'isProductAttach',
      valueEnum: transformArray('whetherNot', 'label', 'value'),
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
              `/dataManagement/monthlyDataManagement/deliveryDataManagement/saleDelivery/detail/${record.id}?sourceTabIndex=1&sourcePage=/dataManagement/monthlyDataManagement/deliveryDataManagement`,
            )
          }
        >
          查看
        </a>,
      ],
    },
  ];

  //点击数据封板查验数据清洗情况
  const checkDataCleanStatus = () => {
    if (searchParams.periodIds.length === 0) {
      message.warning('请选择账期');
      return false;
    }
    if (searchParams.periodIds.length > 1) {
      message.warning('该业务按钮暂不支持多账期计算！');
      return false;
    }
    if (searchParams.periodIds.length === 1) {
      let params = { periodId: sealPeriodId };
      getCleanStatus(params).then((res: any) => {
        if (res && res.data && res.data === true) {
          setIsSealNotice('true'); //为true时不存在未清洗成功的数据，可以直接封板
          setDataSealModal(true);
        } else {
          setIsSealNotice('false'); //为false时还存在未清洗成功的数据，需提示
          setDataSealModal(true);
        }
      });
    }
  };

  //数据封板提交
  const submitDataSeal = () => {
    let params = { periodId: sealPeriodId }; //在未点击查询前，打开封板窗口，封板的应该是上次查询出的月份下的数据
    getDataSeal(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        setDataSealModal(false);
        periodNameValuePocket.forEach((item: any) => {
          if (params.periodId === item.value) {
            item.isSeal = 'Archive';
            setInitialDataSealBtnText('Archive'); //更新按钮状态，置为不可封板
            setPeriodNameValuePocket(periodNameValuePocket); //更新销售年月pocket状态，对应值的isSeal字段一并修改成封板状态
          }
        });
      }
    });
  };

  //在查询时，拿到当前被选择的销售年月，获取其isSeal值更新到控制“数据封板”按钮的setInitialDataSealBtnText
  const getDataSealStatus = (params: any) => {
    periodNameValuePocket.forEach((item: any) => {
      if (params.periodIds[0] === item.value) {
        setInitialDataSealBtnText(item.isSeal);
        setSealPeriodName(item.label);
        setSealPeriodId(item.value); //在未点击查询前，打开封板窗口，封板的应该是上次查询出的月份下的数据
      }
    });
  };

  //导出弹窗
  const exportBefore = (filter: any) => {
    setExportBeforeStatus(true);
  };

  //导出
  const saleInspectExport = (filter: any) => {
    setExportLoading(true);
    // const checkedPeriodId = searchParams.periodIds;
    // const item: any = _.find(periodList, ['id', checkedPeriodId[0]]) || {};
    const params = Object.assign(
      {
        erpFlag: 0,
        // periodName: item.periodName
      },
      searchParams,
    );
    getDeliveryDataExportRequest(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
        setExportBeforeStatus(false);
      }, 3000);
    });
  };

  //机构挂靠计算
  const instAttachCompute = () => {
    getInstitutionRelyQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('挂靠计算成功');
      } else {
        message.warning('挂靠计算失败');
      }
    });
  };

  //调拨计算
  const allotCompute = () => {
    if (searchParams.periodIds.length === 0) {
      message.warning('请选择账期');
      return false;
    }
    if (searchParams.periodIds.length > 1) {
      message.warning('该业务按钮暂不支持多账期计算！');
      return false;
    }
    if (searchParams.periodIds.length === 1) {
      getSaleTypeComputeQuery({
        businessType: 'SM',
        periodId: searchParams.periodIds[0],
      }).then((res: any) => {
        if (res && res.success && res.success === true) {
          message.success('计算成功');
        } else {
          message.warning('计算失败');
        }
      });
    }
  };

  //机构级别计算
  const insTypeCompute = () => {
    getInsTypeComputeQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('机构级别计算成功');
      } else {
        message.warning('机构级别计算失败');
      }
    });
  };

  //重置表单
  const onReset = () => {
    setSearchParams({ periodIds: [initialPeriod] });
    ref?.current?.resetFields();
    ref?.current?.setFieldsValue({
      periodIds: [initialPeriod],
    });
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
            code="dataManage-month-saleDelivery"
            saveSearchValue
            tableAlertRender={false}
            onSubmit={params => {
              setSearchParams(params);
              getDataSealStatus(params);
              //提交查询时设置全局按钮状态控制变量
              setaArchiveFunc(archiveStatus);
            }}
            // params={searchParams}
            columns={columns}
            onReset={() => {
              onReset();
              //在这里做页面重置时判断账期是否已经封板
              let item: any = periodList.filter((i: any) => {
                return searchParams.periodIds[0] === i.id;
              });
              setaArchiveFunc(item[0].isSeal);
            }}
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
              return getSaleDeliveryList({
                provinceNameList: province,
                cityNameList: regionData.city,
                erpFlag: 0, //0为销售，1为发货
                periodIds: ref?.current?.getFieldValue('periodIds'),
                ...params,
                ...sort,
                ...filter,
              });
            }}
            headerTitle={
              <Space>
                <Authorized code={'monthDelSale-export'}>
                  <Button
                    type="primary"
                    key={'export'}
                    onClick={filter => exportBefore(filter)}
                    loading={exportLoading}
                  >
                    导出
                  </Button>
                </Authorized>
                <Authorized code={'monthDelSale-seal'}>
                  <Button
                    type="default"
                    key={'export'}
                    disabled={
                      initialDataSealBtnText !== 'UnArchive' ||
                      disabledForIsSeal
                    }
                    onClick={() => {
                      checkDataCleanStatus();
                    }}
                  >
                    {initialDataSealBtnText === 'UnArchive'
                      ? '数据封板'
                      : '数据已封板'}
                  </Button>
                </Authorized>
                <Authorized code={'monthDelSale-count'}>
                  <Popconfirm
                    onConfirm={() => instAttachCompute()}
                    title={'确认进行挂靠计算吗？'}
                  >
                    <Button type="default">挂靠计算</Button>
                  </Popconfirm>
                </Authorized>
                <Authorized code={'monthDelSale-insTypeCount'}>
                  <Button type="default" onClick={() => insTypeCompute()}>
                    机构级别计算
                  </Button>
                </Authorized>
                <Authorized code={'monthDelSale-allot'}>
                  <Button type="default" onClick={() => allotCompute()}>
                    调拨计算
                  </Button>
                </Authorized>
              </Space>
            }
            rowKey="id"
            dateFormatter="string"
          />
          <Modal
            title="封板确认"
            visible={dataSealModal}
            destroyOnClose={true}
            onCancel={() => setDataSealModal(false)}
            onOk={() => setDataSealModal(false)}
            footer={[
              <Button
                htmlType="button"
                onClick={() => {
                  setDataSealModal(false);
                }}
              >
                取消
              </Button>,
              <Button
                type="primary"
                htmlType="button"
                onClick={() => submitDataSeal()}
              >
                确定
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'center' }}>
              <ExclamationCircleFilled
                style={{ fontSize: 30, color: '#ff9300' }}
              />
              {isSealNotice === 'true' ? (
                <>
                  <div style={{ color: '#FE642E', marginTop: 10 }}>
                    每个账期仅可进行一次封板
                  </div>
                  <div style={{ marginTop: 5 }}>
                    确认对账期
                    <span style={{ color: '#FE642E', fontSize: 18 }}>
                      &nbsp;&nbsp;{sealPeriodName}&nbsp; &nbsp;
                    </span>
                    的数据进行封板操作吗？
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginTop: 5 }}>
                    <span style={{ color: '#FE642E', fontSize: 18 }}>
                      &nbsp;&nbsp;{sealPeriodName}&nbsp; &nbsp;
                    </span>
                    还存在未清洗成功的数据，是否确认封板？
                  </div>
                </>
              )}
            </div>
          </Modal>
          <Modal
            title="数据导出"
            visible={exportBeforeStatus}
            destroyOnClose={true}
            onCancel={() => setExportBeforeStatus(false)}
            maskClosable={false}
            footer={[
              <Button
                htmlType="button"
                onClick={() => setExportBeforeStatus(false)}
              >
                取消
              </Button>,
              <Button
                type="primary"
                htmlType="button"
                onClick={() => saleInspectExport({})}
                loading={exportLoading}
              >
                导出
              </Button>,
            ]}
          >
            <div style={{}}>
              <div>请确认是否导出以下销售年月数据：</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <div style={{ fontWeight: 'bolder', marginTop: '20px' }}>
                  销售年月
                </div>
                {(searchParams?.periodIds || []).map((item: any) =>
                  periodList.map((i: any) => {
                    if (item === i.id) {
                      return (
                        <div style={{ marginTop: '20px' }}>{i.periodName}</div>
                      );
                    }
                  }),
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default connect(({ dispatch, SaleDelivery }: SaleDeliveryProps) => ({
  SaleDelivery,
  dispatch,
}))(SaleDelivery);
