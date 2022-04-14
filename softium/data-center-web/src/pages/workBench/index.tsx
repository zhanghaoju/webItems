import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Select,
  message,
  Modal,
  Form,
  Row,
  Col,
  Divider,
  Spin,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import {
  getWorkBenchList,
  getPeriodWindow,
} from '@/services/workBench/workBench';
import { history } from 'umi';
import _ from 'lodash';
import { connect } from 'dva';
import './style/index.less';
import { formatChinaStandardTimeToDate } from '@/utils/formatTime';
import transformText from '@/utils/transform';
import storage from '@/utils/storage';

interface WorkBenchProps {
  WorkBench: any;
  dispatch: any;
  location: any;
  history: any;
}

const WorkBench: React.FC<WorkBenchProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [form] = Form.useForm();
  const [periodNamePocket, setPeriodNamePocket] = useState([]); //账期列表
  const [periodId, setPeriodId] = useState<string>(); //选择的账期id
  const [periodText, setPeriodText] = useState<string>(); //账期显示文字
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [periodRangeTimeInfo, setPeriodRangeTimeInfo] = useState({
    isSeal: '', //封板状态
    uploadBeginTime: '', //正常上传开始时间
    uploadEndTime: '', //正常上传结束时间
  });
  const [billInfo, setBillInfo] = useState({
    billTotalCount: '', //打单总家数
    billArrivalCount: '', //已到达家数
    billUnArrivalCount: '', //未到达家数
    billUnArrivalRatio: '', //未到达家数占比
  });
  const [interceptInfo, setInterceptInfo] = useState({
    billPrintUntreated: '', //日期拦截未处理
    billPrintTotal: '', //日期拦截总数
    periodUntreated: '', //打单拦截未处理
    periodTotal: '', //打单拦截未总数
  });
  const [matchInfo, setMatchInfo] = useState({
    institutionUnTreated: '', //经销商未匹配
    institutionTotal: '', //经销商总数
    organizationUnTreated: '', //机构未匹配
    organizationTotal: '', //机构总数
    productUnTreated: '', //产品未匹配
    productTotal: '', //产品总数
    productUnitUnTreated: '', //单位未匹配
    productUnitTotal: '', //单位总数
  });

  useEffect(() => {
    //默认账期显示
    getPeriodWindow().then(res => {
      // setPeriodText(res?.data?.defaultSelect?.label);
      // setPeriodId(res?.data?.defaultSelect?.value);
      setPeriodId(storage.get('defaultPeriod'));
      res?.data?.periods.forEach((item: any) => {
        if (item.value === storage.get('defaultPeriod')) {
          setPeriodText(item.label);
        }
      });
      setPeriodNamePocket(res?.data?.periods);
      loadWorkBench({ periodId: storage.get('defaultPeriod') });
    });
  }, []);

  //load
  const loadWorkBench = (periodId: any) => {
    setLoading(true);
    getWorkBenchList(periodId).then((res: any) => {
      if (res && res.success && res.success === true) {
        setPeriodRangeTimeInfo({
          isSeal: transformText(
            'sealKind',
            'label',
            'value',
            'isSeal',
            res.data.periodModule,
          ),
          uploadBeginTime: formatChinaStandardTimeToDate(
            res.data.periodModule.uploadBeginTime,
          ), //正常上传开始时间
          uploadEndTime: formatChinaStandardTimeToDate(
            res.data.periodModule.uploadEndTime,
          ), //正常上传结束时间
          /* supplementBeginTime: formatChinaStandardTimeToDate(
            res.data.periodModule.uploadEndTime,
          ), //补量上传开始时间
          supplementEndTime: formatChinaStandardTimeToDate(
            res.data.periodModule.supplementEndTime,
          ), //补量上传结束时间*/
        });
        // setBillInfo({
        //   billTotalCount: res.data.billPrintMonitorModule.allBillPrint, //打单总家数
        //   billArrivalCount: res.data.billPrintMonitorModule.arrived, //已到达家数
        //   billUnArrivalCount: res.data.billPrintMonitorModule.unArrive, //未到达家数
        //   billUnArrivalRatio: res.data.billPrintMonitorModule.unArriveRatio, //未到达占比
        // });
        setInterceptInfo({
          billPrintUntreated: res.data.interceptModule.period.untreated, //日期拦截未处理
          billPrintTotal: res.data.interceptModule.period.total, //日期拦截总数
          periodUntreated: res.data.interceptModule.billPrint.untreated, //打单拦截未处理
          periodTotal: res.data.interceptModule.billPrint.total, //打单拦截未总数
        });
        setMatchInfo({
          institutionUnTreated: res.data.matchModule.fromInstitution.untreated, //经销商未匹配
          institutionTotal: res.data.matchModule.fromInstitution.total, //经销商总数
          organizationUnTreated: res.data.matchModule.toInstitution.untreated, //机构未匹配
          organizationTotal: res.data.matchModule.toInstitution.total, //机构总数
          productUnTreated: res.data.matchModule.product.untreated, //产品未匹配
          productTotal: res.data.matchModule.product.total, //产品总数
          productUnitUnTreated: res.data.matchModule.productUnit.untreated, //单位未匹配
          productUnitTotal: res.data.matchModule.productUnit.total, //单位总数
        });
      }
      setLoading(false);
    });
  };

  //默认模板下载
  const downDefaultTemplate = () => {
    //跳转至上传数据
    history.push(`/dataCollect/uploadData`);
  };

  //经销商模板配置
  const jumpToInstitutionConfig = () => {
    //跳转至经销商模板配置列表页面
    history.push(
      `/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig`,
    );
  };

  //上传记录查看
  const jumpToFileManagement = () => {
    //跳转至文件管理页面
    history.push(`/dataCollect/fileManagement`);
  };

  //选择账期后的提交
  const handleOk = () => {
    form.validateFields().then(res => {
      setPeriodId(res.periodId); //切换弹窗内默认账期值
      const item: any = _.find(periodNamePocket, ['value', res.periodId]) || {};
      setPeriodText(item.label); //切换默认账期显示文字
      setVisible(false); //关闭弹窗
      loadWorkBench({ periodId: res.periodId }); //load页面
      message.success('提交成功');
    });
  };

  //查看数据到达情况
  const jumpToBillMonitor = () => {
    //跳转打单监控
    history.push({
      pathname: `/dataCollect/monitorReport/monthBillMonitor`,
      state: { periodId: periodId },
    });
  };

  //数据上传
  const jumpToUploadData = () => {
    //跳转数据上传
    history.push({
      pathname: `/dataCollect/uploadData`,
      state: { periodId: periodId },
    });
  };

  //拦截处理
  const jumpToDateRuleIntercept = () => {
    //跳转月数据处理日期规则拦截并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '1' },
      state: { periodId: periodId },
    });
  };

  //匹配处理
  const jumpToInstitutionMatch = () => {
    //跳转月数据处理经销商匹配并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '2' },
      state: { periodId: periodId },
    });
  };

  //数据核查
  const jumpToMonthInspectData = () => {
    //跳转月数据处理核查数据并带上所选账期
    history.push({
      pathname: `/dataManagement/monthlyDataManagement/inspectDataManagement`,
      state: { periodId: periodId },
    });
  };

  //日期拦截
  const jumpToDateIntercept = () => {
    //跳转月数据处理日期规则拦截并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '1' },
      state: { periodId: periodId },
    });
  };

  //打单拦截
  const jumpToBillIntercept = () => {
    //跳转月数据处理日期规则拦截并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '3' },
      state: { periodId: periodId },
    });
  };

  //机构匹配
  const jumpToOrganizationMatch = () => {
    //跳转月数据处理机构匹配并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '4' },
      state: { periodId: periodId },
    });
  };

  //产品匹配
  const jumpToProductMatch = () => {
    //跳转月数据处理产品匹配并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '5' },
      state: { periodId: periodId },
    });
  };

  //单位匹配
  const jumpToUnitMatch = () => {
    //跳转月数据处理产品匹配并带上所选账期
    history.push({
      pathname: `/dataWash/toDoProcess/monthDataProcess`,
      query: { sourceTabIndex: '6' },
      state: { periodId: periodId },
    });
  };

  return (
    <Spin spinning={loading}>
      <div className="workBench">
        <Row
          gutter={24}
          style={{ marginLeft: 0, marginRight: 0, height: '30%' }}
        >
          {/*便捷操作*/}
          <Col span={18} style={{ paddingLeft: 0 }}>
            <Card
              title="便捷操作"
              bordered={false}
              className="workBench-simpleOperation-card"
            >
              <Row gutter={52}>
                <Col span={8}>
                  <div
                    className="simpleOperation-wrap"
                    onClick={() => downDefaultTemplate()}
                  >
                    <img src={require('./icon/templateDownload.png')} />
                    <span>默认模板下载</span>
                    <RightOutlined />
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    className="simpleOperation-wrap"
                    onClick={() => jumpToInstitutionConfig()}
                  >
                    <img src={require('./icon/templateConfig.png')} />
                    <span>经销商模板配置</span>
                    <RightOutlined />
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    className="simpleOperation-wrap"
                    onClick={() => jumpToFileManagement()}
                  >
                    <img src={require('./icon/uploadRecord.png')} />
                    <span>上传记录查看</span>
                    <RightOutlined />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          {/*账期*/}
          <Col span={6} style={{ paddingRight: 0 }}>
            <Card
              title={periodText + '\xa0\xa0\xa0' + periodRangeTimeInfo.isSeal}
              bordered={false}
              className="workBench-period-card"
              extra={
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
              }
            >
              <Modal
                title="机构及月份"
                visible={visible}
                destroyOnClose={true}
                onCancel={() => {
                  setVisible(false);
                }}
                onOk={handleOk}
                footer={[
                  <Button
                    key="back"
                    onClick={() => {
                      setVisible(false);
                    }}
                  >
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
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="请选择"
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
              <Row style={{ alignItems: 'baseline', marginTop: 13 }}>
                <Divider type="vertical" />
                <Col>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    DDI采集日期
                  </div>
                  <div style={{ marginTop: 10, color: '#ACACBC' }}>
                    {periodRangeTimeInfo.uploadBeginTime} -{' '}
                    {periodRangeTimeInfo.uploadEndTime}
                  </div>
                </Col>
                {/*<Divider*/}
                {/*  type="vertical"*/}
                {/*  style={{ borderRight: '4px #FAAD14 solid' }}*/}
                {/*/>*/}
                {/*<Col span={10}>*/}
                {/*  <div style={{ fontSize: 16, fontWeight: 'bold' }}>*/}
                {/*    补量上传*/}
                {/*  </div>*/}
                {/*  <div style={{ marginTop: 10, color: '#ACACBC' }}>*/}
                {/*    {periodRangeTimeInfo.supplementBeginTime} -{' '}*/}
                {/*    {periodRangeTimeInfo.supplementEndTime}*/}
                {/*  </div>*/}
                {/*</Col>*/}
              </Row>
            </Card>
          </Col>
        </Row>
        <Card
          title="工作栏"
          bordered={false}
          className="workBench-toolBar-card"
        >
          <Row gutter={16}>
            <Col span={5}>
              <div
                className="workBench-toolBar-wrap"
                onClick={() => jumpToBillMonitor()}
              >
                <div className="imagetest">
                  <img src={require('./icon/dataArrival.png')} />
                </div>
                <span>查看数据到达情况</span>
                <RightOutlined />
              </div>
            </Col>
            <Col span={5}>
              <div
                className="workBench-toolBar-wrap"
                onClick={() => jumpToUploadData()}
              >
                <img src={require('./icon/dataUpload.png')} />
                <span style={{ cursor: 'pointer' }}>数据上传</span>
                <RightOutlined />
              </div>
            </Col>
            <Col span={5}>
              <div
                className="workBench-toolBar-wrap"
                onClick={() => jumpToDateRuleIntercept()}
              >
                <img src={require('./icon/interceptProcessing.png')} />
                <span style={{ cursor: 'pointer' }}>拦截处理</span>
                <RightOutlined />
              </div>
            </Col>
            <Col span={5}>
              <div
                className="workBench-toolBar-wrap"
                onClick={() => jumpToInstitutionMatch()}
              >
                <img src={require('./icon/matchProcessing.png')} />
                <span style={{ cursor: 'pointer' }}>匹配处理</span>
                <RightOutlined />
              </div>
            </Col>
            <Col span={5}>
              <div
                className="workBench-toolBar-wrap"
                onClick={() => jumpToMonthInspectData()}
              >
                <img src={require('./icon/dataVerification.png')} />
                <span style={{ cursor: 'pointer' }}>数据核查</span>
                <RightOutlined />
              </div>
            </Col>
          </Row>
        </Card>
        <Card
          title="待办处理"
          bordered={false}
          className="workBench-matchProcessing-card"
          style={{ height: '30%' }}
        >
          <Row className="matchProcessing-row" wrap={false}>
            <Col span={4}>
              <div>
                <span
                  style={{
                    color: '#5288FF',
                    fontSize: 40,
                    cursor: 'pointer',
                  }}
                  onClick={() => jumpToDateIntercept()}
                >
                  {interceptInfo.billPrintUntreated}
                </span>
                <span>/</span>
                <span>{interceptInfo.billPrintTotal}</span>
              </div>
              <div style={{ color: '#ACACBC' }}>日期拦截</div>
            </Col>
            <Divider type="vertical" />
            <Col span={4}>
              <div>
                <span
                  style={{ color: '#5288FF', fontSize: 40, cursor: 'pointer' }}
                  onClick={() => jumpToInstitutionMatch()}
                >
                  {matchInfo.institutionUnTreated}
                </span>
                <span>/</span>
                <span>{matchInfo.institutionTotal}</span>
              </div>
              <div style={{ color: '#ACACBC', cursor: 'pointer' }}>
                经销商匹配
              </div>
            </Col>
            <Divider type="vertical" />
            <Col span={4}>
              <div>
                <span
                  style={{
                    color: '#5288FF',
                    fontSize: 40,
                    cursor: 'pointer',
                  }}
                  onClick={() => jumpToBillIntercept()}
                >
                  {interceptInfo.periodUntreated}
                </span>
                <span>/</span>
                <span>{interceptInfo.periodTotal}</span>
              </div>
              <div style={{ color: '#ACACBC' }}>打单拦截</div>
            </Col>
            <Divider type="vertical" />
            <Col span={4}>
              <div>
                <span
                  style={{ color: '#5288FF', fontSize: 40, cursor: 'pointer' }}
                  onClick={() => jumpToOrganizationMatch()}
                >
                  {matchInfo.organizationUnTreated}
                </span>
                <span>/</span>
                <span>{matchInfo.organizationTotal}</span>
              </div>
              <div style={{ color: '#ACACBC' }}>机构匹配</div>
            </Col>
            <Divider type="vertical" />
            <Col span={4}>
              <div>
                <span
                  style={{ color: '#5288FF', fontSize: 40, cursor: 'pointer' }}
                  onClick={() => jumpToProductMatch()}
                >
                  {matchInfo.productUnTreated}
                </span>
                <span>/</span>
                <span>{matchInfo.productTotal}</span>
              </div>
              <div style={{ color: '#ACACBC' }}>产品匹配</div>
            </Col>
            <Divider type="vertical" />
            <Col span={4}>
              <div>
                <span
                  style={{ color: '#5288FF', fontSize: 40, cursor: 'pointer' }}
                  onClick={() => jumpToUnitMatch()}
                >
                  {matchInfo.productUnitUnTreated}
                </span>
                <span>/</span>
                <span> {matchInfo.productUnitTotal}</span>
              </div>
              <div style={{ color: '#ACACBC' }}>单位匹配</div>
            </Col>
          </Row>
        </Card>
      </div>
    </Spin>
  );
};

export default connect(({ dispatch, WorkBench }: WorkBenchProps) => ({
  WorkBench,
  dispatch,
}))(WorkBench);
