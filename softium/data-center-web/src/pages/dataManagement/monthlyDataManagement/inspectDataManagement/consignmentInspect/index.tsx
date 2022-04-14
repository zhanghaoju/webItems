import React, { useEffect, useRef, useState } from 'react';
import { Table } from '@vulcan/utils';
import { Button, message, Modal, Popconfirm, Select, Space, Spin } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  getCancelMatchQuery,
  getCleanBtnStatusQuery,
  getCleanDetailList,
  getDataCleanQuery,
  getInspectDataExportRequest,
  getSaleInspectList,
  getUntreatedPeriod,
} from '@/services/monthDataManagement/inspectDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';
import { FormInstance } from 'antd/lib/form';
import '../index.less';
import _ from 'lodash';
import { getPeriodList } from '@/services/initResource';
import { getDictionary } from '@/services/matchProcess';

interface ConsignmentInspectProps {
  ConsignmentInspect: any;
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

const ConsignmentInspect: React.FC<ConsignmentInspectProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [cleanDetailModalVisible, setCleanDetailModalVisible] = useState(false);
  const [cleanDetailData, setCleanDetailData] = useState([]);
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [dataId, setDataId] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const fileStatusValuePocket = storage.get('pocketData').failCausePocket;
  const periodNameValuePocket = storage.get('pocketData').periodNamePocket;
  const baseInspectStatusPocket = storage.get('pocketData').baseInspectStatus;
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);

  useEffect(() => {
    getPeriodListFunc();
    getDictionaryFunc({ systemCodes: ['Region'] });
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
      getCleanBtnStatusQuery().then((res: any) => {
        if (res && res.success && res.success === true) {
          setDisabledForIsSeal(res.data.cleanButton); //为true，置灰，false可点
        }
      });
    }
  };

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
      title: '销售年月',
      dataIndex: 'periodId',
      width: '6%',
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
      ellipsis: true,
      width: '6%',
      fixed: 'left',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      width: '5%',
      hideInSearch: true,
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
      width: '5%',
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
      width: '5%',
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
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
      width: '5%',
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
      title: '清洗失败原因',
      dataIndex: 'failCause',
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
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(baseInspectStatusPocket || []).map((res: any) => (
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
      width: '5%',
      fixed: 'right',
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect/detail/${record.id}?sourceTabIndex=4&sourcePage=/dataManagement/monthlyDataManagement/inspectDataManagement`,
            )
          }
        >
          查看
        </a>,
        <Button type="link" onClick={() => handleCleanDetailList(record)}>
          清洗详情
        </Button>,
      ],
    },
  ];

  //清洗项column
  const cleanDetailColumns = [
    {
      title: '清洗项',
      dataIndex: 'cleanOptions',
      key: 'cleanOptions',
    },
    {
      title: '清洗状态',
      dataIndex: 'cleanStatus',
      key: 'cleanStatus',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        if (
          record.ifMatch === 'SUCCESS' &&
          !(record.cleanType === 'DATE' || record.cleanType === 'BILL_PRINT')
        ) {
          return (
            <Popconfirm
              title="你确定撤销吗?"
              onConfirm={() => handleCancelMatch(record)}
            >
              <Button type="link" style={{ marginLeft: -16 }}>
                撤销匹配
              </Button>
            </Popconfirm>
          );
        } else if (
          record.ifMatch === 'SUCCESS' &&
          (record.cleanType === 'DATE' || record.cleanType === 'BILL_PRINT')
        ) {
          return <span>-</span>;
        } else {
          return (
            <Button type="link" disabled={true} style={{ marginLeft: -16 }}>
              撤销匹配
            </Button>
          );
        }
      },
    },
  ];

  //清洗详情
  const handleCleanDetailList = (record: any) => {
    setDataId(record.id);
    getCleanDetailList({ id: record.id }).then((response: any) => {
      if (response && response.success && response.success === true) {
        setCleanDetailModalVisible(true);
        if (response.data.length > 0) {
          response.data.forEach((item?: any, i?: any) => {
            item.ifMatch = item.cleanStatus;
            item.cleanStatus = transformText(
              'matchStatusPocket',
              'label',
              'value',
              'cleanStatus',
              item,
            );
          });
        }
        setCleanDetailData(response.data);
      }
    });
  };

  //撤销匹配
  const handleCancelMatch = (record: any) => {
    const params = {
      id: dataId,
      cleanType: record.cleanType,
      businessType: 'SM',
    };
    setLoading(true);
    getCancelMatchQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        //撤销匹配成功后延迟两秒再次调清洗详情接口刷新当前数据的所有清洗详情数据
        setTimeout(async () => {
          try {
            const response = await getCleanDetailList({ id: dataId });
            if (response.data.length > 0) {
              response.data.forEach((item?: any, i?: any) => {
                item.ifMatch = item.cleanStatus;
                item.cleanStatus = transformText(
                  'matchStatusPocket',
                  'label',
                  'value',
                  'cleanStatus',
                  item,
                );
              });
            }
            setCleanDetailData(response.data);
            setLoading(false);
          } catch (e) {
            setLoading(false);
            message.error('撤销匹配失败！');
          }
        }, 2000);
      } else {
        setLoading(false);
        message.error('撤销匹配失败！');
      }
    });
  };

  //导出
  const saleInspectExport = () => {
    setExportLoading(true);
    const checkedPeriodId = searchParams.periodId;
    const item: any = _.find(periodList, ['id', checkedPeriodId]) || {};
    const params = Object.assign(
      { erpFlag: 1, periodName: item.periodName },
      searchParams,
    );
    getInspectDataExportRequest(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
      }, 3000);
    });
  };

  //全部数据清洗
  const allDataClean = () => {
    const params = { businessType: 'DM', periodId: '' };
    if (searchParams.periodId === '') {
      //为空取默认账期
      params.periodId = ref?.current?.getFieldValue('periodId');
    } else {
      params.periodId = searchParams.periodId;
    }
    setDisabledForIsSeal(true);
    getDataCleanQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('清洗成功');
      }
    });
  };

  //重置表单
  const onReset = () => {
    ref?.current?.resetFields();
    ref?.current?.setFieldsValue({
      periodId: initialPeriodName,
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
            code="dataManage-month-consignmentInspect"
            saveSearchValue
            tableAlertRender={false}
            onSubmit={params => {
              setSearchParams(params);
              //提交查询时设置全局按钮状态控制变量
              setaArchiveFunc(archiveStatus);
            }}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            sticky={true}
            scroll={{ x: 4200 }}
            actionRef={actionRef}
            formRef={ref}
            onReset={() => {
              onReset();
              //在这里做页面重置时判断账期是否已经封板
              let item: any = periodList.filter((i: any) => {
                return searchParams.periodId === i.id;
              });
              setaArchiveFunc(item[0].isSeal);
            }}
            request={(params, sort, filter) => {
              return getSaleInspectList({
                periodId: ref?.current?.getFieldValue('periodId'),
                provinceNameList: province,
                cityNameList: regionData.city,
                erpFlag: 1, //0为销售，1为发货
                ...params,
                ...sort,
                ...filter,
              });
            }}
            headerTitle={
              <Space>
                <Authorized code={'monthInsConsign-allClean'}>
                  <Button
                    type="primary"
                    key={'export'}
                    onClick={() => allDataClean()}
                    disabled={disabledForIsSeal}
                  >
                    全部数据清洗
                  </Button>
                </Authorized>
                <Authorized code={'monthInsConsign-export'}>
                  <Button
                    type="default"
                    key={'export'}
                    onClick={() => saleInspectExport()}
                    loading={exportLoading}
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
        <div>
          <Modal
            className="inspectData-cleanDetail"
            title="清洗详情"
            width={750}
            visible={cleanDetailModalVisible}
            onCancel={() => {
              setLoading(false);
              setCleanDetailModalVisible(false);
            }}
            onOk={() => setCleanDetailModalVisible(false)}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  setCleanDetailModalVisible(false);
                  actionRef?.current?.reload();
                }}
              >
                确定
              </Button>,
            ]}
          >
            <Spin spinning={loading}>
              <ProTable
                columns={cleanDetailColumns}
                dataSource={cleanDetailData}
                pagination={false}
                search={false}
                options={false}
              />
            </Spin>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, ConsignmentInspect }: ConsignmentInspectProps) => ({
    ConsignmentInspect,
    dispatch,
  }),
)(ConsignmentInspect);
