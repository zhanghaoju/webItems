import React, { useState, useRef, useEffect } from 'react';
import { Authorized, Table } from '@vulcan/utils';
import {
  Button,
  Card,
  Select,
  Space,
  message,
  Modal,
  Form,
  Tooltip,
  DatePicker,
  Row,
  Col,
  Divider,
  Spin,
  Empty,
} from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getBillMonitorList,
  getPeriodWindow,
  getFileArrivalDetailQuery,
  getBillMonitorExportQuery,
  getDashboard,
} from '@/services/monitorReport/billMonitor';
import './style/index.less';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import storage from '@/utils/storage';
import { downloadFile } from '@/utils/exportFile.ts';
import transformText, { transformArray } from '@/utils/transform';
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;
interface BillMonitorProps {
  BillMonitor: any;
  dispatch: any;
  location: any;
  history: any;
}

interface GithubIssueItem {
  id?: string;
  institutionCode?: string;
  institutionName?: string;
  queryDate?: string;
  arriveStatusForSD?: number;
  arriveStatusForPD?: number;
  arriveStatusForID?: number;
  arriveStatusForDD?: number;
  disabled?: number;
}

const BillMonitor: React.FC<BillMonitorProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const arriveKind = storage.get('pocketData').arriveKind;
  const accessTypePocket = storage.get('pocketData').accessTypePocket;
  const [periodNamePocket, setPeriodNamePocket] = useState([]); //账期列表
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeText, setPeriodText] = useState<string>(); //账期显示文字
  const [periodId, setPeriodId] = useState<string>(); //选择的账期id
  const [selectOption, setSelectOption] = useState<any>(); //账期选中项
  const [
    fileArrivalDetailModalVisible,
    setFileArrivalDetailModalVisible,
  ] = useState(false);
  const [fileArrivalDetailData, setFileArrivalDetailData] = useState([]); //文件到达详情
  const [ifFileEmpty, setIfFileEmpty] = useState(false);
  const [queryDate, setQueryDate] = useState<any>(); //默认统计时间
  const [searchParams, setSearchParams] = useState({});
  const [fileArrivalInfo, setFileArrivalInfo] = useState({
    billTotalCount: '', //打单总家数
    billArrivalCount: '', //已到达家数
    billUnArrivalCount: '', //未到达家数
    billArrivalRatio: '', //已到达家数占比
    billUnArrivalRatio: '', //未到达家数占比
    arrivedSD: '', //已到达销售
    arrivedPD: '', //已到达采购
    arrivedID: '', //已到达库存
    arrivedDD: '', //已到达发货
    updateTime: '', //更新时间
  });
  const [form] = Form.useForm();
  const handleCancel = () => {
    setVisible(false);
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '数据id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      width: '30%',
    },
    {
      title: '统计日期',
      dataIndex: 'queryDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      width: '8%',
    },
    {
      title: '打单采集方式', //查询条件
      dataIndex: 'collectType',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(accessTypePocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '经销商编号',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '9%',
    },
    {
      title: '销售状态', //查询条件
      dataIndex: 'arriveStatusForSD',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(arriveKind || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '采购状态', //查询条件
      dataIndex: 'arriveStatusForPD',
      valueType: 'text',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(arriveKind || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '库存状态', //查询条件
      dataIndex: 'arriveStatusForID',
      valueType: 'text',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(arriveKind || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '发货状态', //查询条件
      dataIndex: 'arriveStatusForDD',
      valueType: 'text',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(arriveKind || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    /*{
      title: '是否空文件',
      dataIndex: 'fileIsEmpty',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(whetherNot || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },*/
    {
      title: '打单采集方式',
      dataIndex: 'collectType',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
      valueEnum: transformArray('accessTypePocket', 'label', 'value'),
    },
    {
      title: '销售',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      children: [
        {
          title: '是否到达',
          dataIndex: 'SD_isArrive',
          key: 'SD_isArrive',
          width: 100,
          valueEnum: transformArray('whetherNot', 'label', 'value'),
        },
        {
          title: '文件行数',
          dataIndex: 'SD_recentCount',
          key: 'SD_recentCount',
          width: 100,
        },
      ],
    },
    {
      title: '采购',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      children: [
        {
          title: '是否到达',
          dataIndex: 'PD_isArrive',
          key: 'PD_isArrive',
          width: 100,
          valueEnum: transformArray('whetherNot', 'label', 'value'),
        },
        {
          title: '文件行数',
          dataIndex: 'PD_recentCount',
          key: 'PD_recentCount',
          width: 100,
        },
      ],
    },
    {
      title: '库存',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      children: [
        {
          title: '是否到达',
          dataIndex: 'ID_isArrive',
          key: 'ID_isArrive',
          width: 100,
          valueEnum: transformArray('whetherNot', 'label', 'value'),
        },
        {
          title: '文件行数',
          dataIndex: 'ID_recentCount',
          key: 'ID_recentCount',
          width: 100,
        },
      ],
    },
    {
      title: '发货',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      children: [
        {
          title: '是否到达',
          dataIndex: 'DD_isArrive',
          key: 'DD_isArrive',
          width: 100,
          valueEnum: transformArray('whetherNot', 'label', 'value'),
        },
        {
          title: '文件行数',
          dataIndex: 'DD_recentCount',
          key: 'DD_recentCount',
          width: 100,
        },
      ],
    },
    {
      title: '文件到达详情',
      hideInSearch: true,
      valueType: 'option',
      fixed: 'right',
      width: '6%',
      render: (text, record, _, action) => [
        <a type="link" onClick={() => viewFileArrivalDetail(record)}>
          查看
        </a>,
      ],
    },
  ];

  const fileArrivalDetailColumns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: any, record: any, _: any) => [
        <a
          type="link"
          onClick={() =>
            history.push({
              pathname: `/dataCollect/fileManagement`,
              state: { fileName: record.fileName },
            })
          }
        >
          {record.fileName}
        </a>,
      ],
    },
    {
      title: '实际采集方式',
      dataIndex: 'accessType',
      key: 'accessType',
      render: (text: any, record: any, _: any) => [
        <span>
          {transformText(
            'accessTypePocket',
            'label',
            'value',
            'accessType',
            record,
          )}
        </span>,
      ],
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (text: any, record: any, _: any) => [
        <span>
          {transformText(
            'businessTypeValuePocket',
            'label',
            'value',
            'businessDesc',
            record,
          )}
        </span>,
      ],
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      key: 'fileStatus',
      render: (text: any, record: any, _: any) => [
        <span>
          {transformText(
            'fileStatusPocket',
            'label',
            'value',
            'fileStatus',
            record,
          )}
        </span>,
      ],
    },
  ];

  //默认账期
  useEffect(() => {
    if (ref.current) {
      ref.current.setFieldsValue({
        //四个查询状态默认未到达
        arriveStatusForSD: 0,
        arriveStatusForPD: 0,
        arriveStatusForID: 0,
        arriveStatusForDD: 0,
      });
      setSearchParams({
        //默认查询参数
        arriveStatusForSD: 0,
        arriveStatusForPD: 0,
        arriveStatusForID: 0,
        arriveStatusForDD: 0,
      });
    }
    const current = moment(); //不带参数就是当前日期
    setQueryDate(moment(current).unix() * 1000);
    //默认账期显示
    getPeriodWindow().then(res => {
      //如果是从工作台跳转过来，销售年月赋值为带过来的账期，否则为页面初始化默认账期
      if (state && state.periodId) {
        setPeriodId(state.periodId);
        //拿到默认账期后才能调文件到达概况接口
        getFileDashboardList(state.periodId, moment(current).unix() * 1000);
        res?.data?.periods.forEach((item: any) => {
          if (item.value === state.periodId) {
            setPeriodText(item.label);
          }
        });
        history.replace({});
      } else {
        setPeriodId(storage.get('defaultPeriod'));
        //拿到默认账期后才能调文件到达概况接口
        getFileDashboardList(
          storage.get('defaultPeriod'),
          moment(current).unix() * 1000,
        );
        res?.data?.periods.forEach((item: any) => {
          if (item.value === storage.get('defaultPeriod')) {
            setPeriodText(item.label);
          }
        });
      }
      setPeriodNamePocket(res?.data?.periods);
    });
  }, []);

  //设置账期被选中值
  const handleChange = (value: any, option: any) => {
    setSelectOption(option);
  };

  //可选日期小于等于当前日期
  const disabledRange = (current: any) => {
    return current && current > moment().endOf('day');
  };

  //文件到达情况--选完日期之后的回调
  const onFileArrivalDateChange = (value: any) => {
    const queryDate = moment(value).unix() * 1000; //时间戳格式
    setSearchParams({ queryDate: queryDate, periodId: periodId }); //带着日期,财年刷表格
    actionRef?.current?.reload(); //刷新表格
    setQueryDate(queryDate);
    getFileDashboardList(periodId, queryDate);
  };

  //选择账期后的提交
  const handleOk = () => {
    form.validateFields().then(res => {
      setPeriodId(res.periodId); //切换弹窗内默认账期值
      setSearchParams({ periodId: res.periodId }); //带着财年刷表格
      const item: any = _.find(periodNamePocket, ['value', res.periodId]) || {};
      setPeriodText(item.label); //切换默认账期显示文字
      setVisible(false); //关闭弹窗
      actionRef?.current?.reload(); //刷新表格
      getFileDashboardList(res.periodId, queryDate); //刷新文件到达概况
      message.success('提交成功');
    });
  };

  //文件到达概况
  const getFileDashboardList = async (periodId: any, queryDate: any) => {
    setLoading(true);
    try {
      const res: any = await getDashboard({
        periodId: periodId,
        queryDate: queryDate,
        dataScope: 'DAY',
      });
      setFileArrivalInfo({
        billTotalCount: res.data.allBillPrint,
        billArrivalCount: res.data.arrived, //已到达家数
        billArrivalRatio: res.data.arrivedRatio, //已到达占比
        billUnArrivalCount: res.data.unArrive, //未到达家数
        billUnArrivalRatio: res.data.unArriveRatio, //未到达占比
        arrivedSD: res.data.arrivedSD, //已到达销售
        arrivedPD: res.data.arrivedPD, //已到达采购
        arrivedID: res.data.arrivedID, //已到达库存
        arrivedDD: res.data.arrivedDD, //已到达发货
        updateTime: res.data.updateTime, //更新时间
      });
      setIfFileEmpty(false);
      setLoading(false);
    } catch (e) {
      setIfFileEmpty(true);
      setLoading(false);
    }
  };

  //查看--文件到达详情
  const viewFileArrivalDetail = (record: any) => {
    const params = {
      periodId: periodId,
      queryDate: queryDate,
      institutionCode: record.institutionCode,
    };
    getFileArrivalDetailQuery(params).then((response: any) => {
      setFileArrivalDetailData(response.data);
      setFileArrivalDetailModalVisible(true);
    });
  };

  //导出
  const billMonitorExport = () => {
    const params = Object.assign(searchParams, {
      queryDate: queryDate,
      periodId: periodId,
      dataScope: 'DAY',
    });
    getBillMonitorExportQuery(params).then((res: any) => {
      downloadFile(res);
    });
  };

  //重置
  const onReset = () => {
    setSearchParams({});
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="billMonitor">
      <div className="periodTimeWindow">
        <Row>
          <Col span={12}>
            {timeText}
            <Button
              type="link"
              onClick={() => {
                setVisible(true);
                form.setFieldsValue({
                  periodId: periodId,
                });
              }}
            >
              切换
            </Button>
          </Col>
          <Col
            span={12}
            style={{ textAlign: 'end', fontSize: 16, fontWeight: 'normal' }}
          >
            <span>
              数据更新时间:{fileArrivalInfo.updateTime + '\xa0\xa0\xa0'}
            </span>
          </Col>
        </Row>
      </div>
      <Modal
        title="月份"
        visible={visible}
        destroyOnClose={true}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            提交
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item
            label="月份"
            name="periodId"
            labelCol={{ span: 5, offset: 2 }}
            wrapperCol={{ span: 14 }}
          >
            <Select
              showSearch
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="请选择"
              onChange={(value, option) => {
                handleChange(value, option);
              }}
            >
              {(periodNamePocket || []).map((item: any) => {
                return (
                  <Select.Option
                    value={item?.value}
                    key={item.value}
                    name={item.label}
                  >
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div className="fileArrivalSurvey">
        <Spin spinning={loading}>
          <Card
            title="文件到达概况"
            bordered={false}
            extra={
              <DatePicker
                defaultValue={moment()}
                allowClear={false}
                disabledDate={disabledRange}
                onChange={value => onFileArrivalDateChange(value)}
                style={{ width: 220 }}
              />
            }
          >
            {ifFileEmpty ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>所选日期没有监控数据，请切换日期进行查看</span>
                }
              />
            ) : (
              <Row className="fileArrivalSurvey-row">
                <Col span={7}>
                  <div
                    style={{
                      color: '#4fa8f7',
                      fontSize: 30,
                    }}
                  >
                    {fileArrivalInfo.billTotalCount}
                  </div>
                  <div>打单总家数</div>
                </Col>
                <Divider type="vertical" />
                <Col span={8}>
                  <Row>
                    <Col span={8} offset={4}>
                      <div>
                        <span
                          style={{
                            color: '#9AE747',
                            fontSize: 30,
                          }}
                        >
                          {fileArrivalInfo.billArrivalCount}
                        </span>
                        <span className="fileArrivalSurvey-accountDivider">
                          /
                        </span>
                        <span>{fileArrivalInfo.billArrivalRatio}%</span>
                      </div>
                      <div>已到达家数和占比</div>
                    </Col>
                    <Col span={12} style={{ margin: 'auto', marginLeft: 0 }}>
                      <div style={{ textAlign: 'start' }}>
                        <span>
                          销售:
                          <span style={{ color: '#9AE747' }}>
                            {fileArrivalInfo.arrivedSD}
                          </span>
                        </span>
                        <Divider type="vertical" style={{ height: 14 }} />
                        <span>
                          采购:
                          <span style={{ color: '#9AE747' }}>
                            {fileArrivalInfo.arrivedPD}
                          </span>
                        </span>
                      </div>
                      <div style={{ textAlign: 'start' }}>
                        <span>
                          库存:
                          <span style={{ color: '#9AE747' }}>
                            {fileArrivalInfo.arrivedID}
                          </span>
                        </span>
                        <Divider type="vertical" style={{ height: 14 }} />
                        <span>
                          发货:
                          <span style={{ color: '#9AE747' }}>
                            {fileArrivalInfo.arrivedDD}
                          </span>
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Divider type="vertical" />
                <Col span={7}>
                  <div>
                    <span style={{ color: 'red', fontSize: 30 }}>
                      {fileArrivalInfo.billUnArrivalCount}
                    </span>
                    <span className="fileArrivalSurvey-accountDivider">/</span>
                    <span>{fileArrivalInfo.billUnArrivalRatio}%</span>
                  </div>
                  <div>未到达家数和占比</div>
                </Col>
              </Row>
            )}
          </Card>
        </Spin>
      </div>
      {ifFileEmpty ? null : (
        <div>
          <Card title="经销商明细" bordered={false}>
            <div className="search-result-list">
              <Table<GithubIssueItem>
                code="monitorReport-dayBillMonitor"
                columns={columns}
                bordered
                pagination={{
                  defaultPageSize: 10,
                  showQuickJumper: true,
                }}
                sticky={true}
                scroll={{ x: 1800 }}
                search={{
                  span: 8,
                  labelWidth: 160,
                  defaultCollapsed: false,
                }}
                formRef={ref}
                actionRef={actionRef}
                onSubmit={params => {
                  setSearchParams(params);
                }}
                onReset={() => onReset()}
                // params={searchParams}
                request={(params, sort, filter) => {
                  return getBillMonitorList({
                    //这里对默认账期做处理是规避了异步请求导致页面首次加载获取不到setState里面的参数。频繁切换页面时，该页面首次加载取不到set的periodId值，导致缺少该值。
                    //解决方案：本页面账期取值优先级 本页面自己set或者用户自己切换得到的账期  > 工作台传过来的账期 >  顶部导航选择的全局默认账期
                    // periodId: periodId,
                    periodId: periodId
                      ? periodId
                      : state && state.periodId
                      ? state.periodId
                      : storage.get('defaultPeriod'),
                    queryDate: queryDate,
                    dataScope: 'DAY',
                    ...searchParams,
                    ...params,
                    ...sort,
                    ...filter,
                  }).then((response: any) => {
                    return {
                      total: response.data.total,
                      data: response.data.list,
                      success: response.success,
                    };
                  });
                }}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                  <Space>
                    <Button type="primary" onClick={() => billMonitorExport()}>
                      导出
                    </Button>
                  </Space>
                }
              />
            </div>
          </Card>
          <Modal
            title="到达详情"
            width={1000}
            visible={fileArrivalDetailModalVisible}
            onCancel={() => setFileArrivalDetailModalVisible(false)}
            onOk={() => setFileArrivalDetailModalVisible(false)}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => setFileArrivalDetailModalVisible(false)}
              >
                确定
              </Button>,
            ]}
          >
            <ProTable
              search={false}
              options={false}
              pagination={{ hideOnSinglePage: true }}
              columns={fileArrivalDetailColumns}
              dataSource={fileArrivalDetailData}
            />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default connect(({ dispatch, BillMonitor }: BillMonitorProps) => ({
  BillMonitor,
  dispatch,
}))(BillMonitor);
