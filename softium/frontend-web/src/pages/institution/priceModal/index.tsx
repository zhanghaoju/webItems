import React, { useImperativeHandle, useState, useRef } from 'react';
import { Descriptions, Form, Select, Row, Col, Drawer, message } from 'antd';
import EditTable from '@/pages/institution/priceModal/editTable';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getEditRecord } from '@/services/EditPrice';
import { getPeriodYears } from '@/services/period';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';
import './style/index.less';

const FormItem = Form.Item;

const PriceModal = (props: any) => {
  const [priceModal, setPriceVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    current: 1,
    pageNo: 1,
    total: 0,
  });
  const [periodOption, setPeriodOption] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState<any>();
  const [paramData, setParamData] = useState<any>();
  const actionRef = useRef<any>();
  const [disId, setDisId] = useState<any>();
  const refTable: any = useRef<any>();

  const productDetailColumn: ProColumns<any>[] = [
    {
      title: '时间窗名称',
      dataIndex: 'periodName',
    },
    {
      title: '修改前值',
      dataIndex: 'oldValue',
    },
    {
      title: '修改后值',
      dataIndex: 'newValue',
    },
    {
      title: '修改人',
      dataIndex: 'updateByName',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];
  const getDictionary = (key: string) => {
    return getDictionaryBySystemCode(key) || [];
  };
  const subclassDealerLevel = getDictionary('SubclassDealerLevel');
  const priceTableLoad = (
    distributorLevelId: string,
    financialYearId: string,
  ) => {
    refTable.current.data({
      distributorLevelId,
      financialYearId,
    });
  };
  useImperativeHandle(props.cRef, () => ({
    data: async (data: any) => {
      setParamData({
        levelName: getNameByValue(subclassDealerLevel, data?.data?.level),
        productName: data?.data?.productName,
        specification: data?.data?.specification,
        distributorLevelId: data?.data?.id,
      });
      setDisId(data?.data?.id); //存储父组件传递的参数
      let periodRes = await getPeriodYears(); //获取财年
      if (periodRes?.data.length == 0) {
        message.warning('请完成财年配置后再执行该操作');
        return;
      }
      if (data.visible) {
        setPriceVisible(data.visible);
      }
      const currentYear: any = periodRes?.data.find(
        (item: any) => item.isCurrent,
      );
      setPeriodOption(periodRes?.data);
      setCurrentPeriod(currentYear?.id); //存储当前财年isCurrent
      priceTableLoad(data?.data?.id, currentYear?.id); //开票价列表初始化
    },
  }));
  const showPriceModal = () => {
    setPriceVisible(true);
  };
  const handleChange = (value: any) => {
    setCurrentPeriod(value);
    priceTableLoad(disId, value);
    actionRef.current.reload();
  };
  return (
    <Drawer
      maskClosable={true}
      destroyOnClose
      width="50%"
      visible={priceModal}
      title={'开票价管理'}
      onClose={() => {
        setPriceVisible(false);
      }}
      className="priceDrawer"
    >
      <Descriptions>
        <Descriptions.Item label="经销商等级">
          {paramData?.levelName}
        </Descriptions.Item>
        <Descriptions.Item label="产品">
          {paramData?.productName}
        </Descriptions.Item>
        <Descriptions.Item label="规格">
          {paramData?.specification}
        </Descriptions.Item>
      </Descriptions>
      <Row>
        <Col span={8}>
          <FormItem label={'选择财年'}>
            <Select
              value={currentPeriod}
              style={{ width: '100%' }}
              placeholder="请选择"
              allowClear={false}
              showSearch={true}
              onChange={handleChange}
            >
              {(periodOption || []).map((option: any) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.financialYear}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </Row>
      <EditTable cRef={refTable} actionRef={actionRef} />
      <h2 style={{ marginTop: '20px', color: '#262626' }}>
        经销商开票价修改记录
      </h2>
      <ProTable
        columns={productDetailColumn}
        form={{ autoComplete: 'off' }}
        search={false}
        options={false}
        request={(params: any) => {
          return getEditRecord({
            ...params,

            distributorLevelId: paramData?.distributorLevelId,
            financialYearId: currentPeriod,
            pageNo: params?.current,
          });
        }}
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          ...pageInfo,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        postData={(data: any) => {
          setPageInfo({
            pageSize: data.pageSize,
            current: data.pageNo,
            pageNo: data.pageNo,
            total: data.total,
          });
          return data.list;
        }}
      />
    </Drawer>
  );
};

export default PriceModal;
