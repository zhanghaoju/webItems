import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  DatePicker,
  Drawer,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
} from 'antd';
import {
  getInstitutionPocket,
  getInventorySupplementDetailList,
  getInventorySupplementList,
  getSupplementQuery,
} from '@/services/monthDataManagement/inspectDataManagement';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { formatChinaStandardTimeToDate } from '@/utils/formatTime';
import { FormInstance } from 'antd/lib/form';
import { transformArray } from '@/utils/transform';
import storage from '@/utils/storage';
import { Table } from '@vulcan/utils';

interface SupplementMonthMonitorProps {
  supplementModalVisible: boolean;
  setSupplementModalVisible: (visible: boolean) => void;
  periodId: any;
  institutionCode: any;
  institutionName: any;
}

interface GithubIssueItem {
  institutionCode?: string;
  createTime?: string;
  fileName?: string;
  rowcount?: string;
  inventoryDate?: string;
  standardInstitutionCode?: string;
  standardInstitutionName?: string;
  standardProductCode?: string;
  standardProductName?: string;
  standardProductSpec?: string;
  standardProducer?: string;
  productQuantityFormat?: string;
  productUnitFormat?: string;
  fromInstitutionCode?: string;
  fromInstitutionName?: string;
  productCode?: string;
  productName?: string;
  productSpec?: string;
  originalProducer?: string;
  productQuantity?: string;
  productUnit?: string;
  failCause?: string;
  dataStatus?: string;
}

const { Option } = Select;
const { RangePicker } = DatePicker;

const SupplementMonthMonitor: React.FC<SupplementMonthMonitorProps> = props => {
  const {
    supplementModalVisible,
    setSupplementModalVisible,
    periodId,
    institutionCode,
    institutionName,
  } = props;
  const [institutionPocket, setInstitutionPocket] = useState([]);
  const fileStatusValuePocket = storage.get('pocketData').failCausePocket;
  const [createTimeDates, setCreateTimeDates] = useState<any>([]);
  const [createTimeValue, setCreateTimeValue] = useState<any>([]);
  const [formatDate, setFormatDate] = useState<any>();
  const [formatInstitutionName, setFormatInstitutionName] = useState('');
  const [childrenDrawerVisible, setChildrenDrawerVisible] = useState(false);
  const [supplementSearchParams, setSupplementSearchParams] = useState({});
  const [fileId, setFileId] = useState();
  const [standardInstitutionCode, setStandardInstitutionCode] = useState();

  useEffect(() => {
    setFormatInstitutionName(institutionCode);
    setSupplementSearchParams({ institutionCode: institutionCode });
    supplementRef.current?.setFieldsValue({ institutionCode: institutionName });
  }, []);

  //库存补采column
  const supplementColumns: ProColumns<GithubIssueItem>[] = [
    {
      title: '经销商',
      dataIndex: 'institutionCode',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            onSearch={onSearchInstitutionName}
            onSelect={onChangeInstitution}
            showSearch
            allowClear
          >
            {(institutionPocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '经销商为必填项',
          },
        ],
      },
    },
    {
      title: '上传日期',
      dataIndex: 'createTime',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => [
        <RangePicker
          value={createTimeValue}
          disabledDate={creatDisabledDate}
          onChange={(val: any) => {
            setCreateTimeValue(val);
            onChangeCreatTimeValue(val);
          }}
          onCalendarChange={(val: any) => setCreateTimeDates(val)}
        />,
      ],
      formItemProps: {
        rules: [
          {
            required: true,
            message: '上传日期为必填项',
          },
        ],
      },
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: '数据行数',
      dataIndex: 'rowcount',
      key: 'rowcount',
      hideInSearch: true,
      width: '10%',
      render: (text: any, record: any) => [
        <a
          type="link"
          style={{ color: '#3C9BFB' }}
          onClick={() => {
            setFileId(record.id);
            setStandardInstitutionCode(record.institutionCode);
            setChildrenDrawerVisible(true);
          }}
        >
          {record.rowcount}
        </a>,
      ],
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      hideInSearch: true,
      render: (text: any, record: any) => [
        <Popconfirm
          title="会覆盖当前月份已有库存数据，确认补采?"
          onConfirm={() => handleSupplement(record)}
        >
          <Button type="link" style={{ marginLeft: -16 }}>
            确认补采
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  //库存补采明细column
  const inventoryDetailColumn: ProColumns<GithubIssueItem>[] = [
    {
      title: '库存日期',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      width: '6%',
      ellipsis: true,
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
      dataIndex: 'standardInstitutionName', //表格
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
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
      fixed: 'right',
      width: '5%',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];

  //搜索经销商
  const onSearchInstitutionName = (e: any) => {
    const institutionName = { name: e };
    getInstitutionPocket(institutionName).then((res: any) => {
      //获取经销商
      const institutionData = res.data.list;
      const tempArray: any = [];
      if (res && res.success === true) {
        (institutionData || []).map((item: any) => {
          let obj = { label: '', value: '', code: '' };
          obj.label = item.name;
          obj.value = item.code;
          obj.code = item.code;
          tempArray.push(obj);
        });
        setInstitutionPocket(tempArray);
      }
    });
  };

  //更改经销商
  const onChangeInstitution = (e: any) => {
    institutionPocket.forEach((item: any, i) => {
      if (e === item.code) {
        setFormatInstitutionName(item.code); //设置查询参数，取该经销商的code传参
      }
    });
  };

  //限制上传日期可选择范围为7天
  const creatDisabledDate = (current: any) => {
    if (!createTimeDates || createTimeDates.length === 0) {
      return false;
    }
    const tooLate =
      createTimeDates[0] && current.diff(createTimeDates[0], 'days') > 7;
    const tooEarly =
      createTimeDates[1] && createTimeDates[1].diff(current, 'days') > 7;
    return tooEarly || tooLate;
  };

  //格式化日期--将中国标准时间转为后端需要的yy：mm：dd格式
  const onChangeCreatTimeValue = (val: any) => {
    supplementRef.current?.setFieldsValue({ createTime: val });
    if (Array.isArray(val)) {
      const earlyValue = formatChinaStandardTimeToDate(val[0]);
      const lateValue = formatChinaStandardTimeToDate(val[1]);
      setFormatDate([earlyValue, lateValue]);
    }
  };

  //确认补采
  const handleSupplement = async (record: any) => {
    try {
      const params = {
        fileId: record.id,
        standardInstitutionCode: record.institutionCode,
        periodId: periodId,
      };
      await getSupplementQuery(params);
      setSupplementModalVisible(false);
      message.success('成功');
    } catch (e) {
      message.warning('失败');
    }
  };

  //重置表单
  const onReset = () => {
    setSupplementSearchParams({}); //表格查询参数重置为空
    setCreateTimeValue([]); //表格查询表单条件重置为空
  };

  const supplementRef = useRef<FormInstance>();
  return (
    <Drawer
      width={'67%'}
      title="库存补采"
      placement="right"
      destroyOnClose={true}
      maskClosable={false}
      onClose={() => {
        setSupplementModalVisible(false);
        setCreateTimeValue([]);
      }}
      visible={supplementModalVisible}
      closable={true}
    >
      <ProTable<GithubIssueItem>
        options={false}
        bordered
        columns={supplementColumns}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        scroll={{ x: '100%', y: '52vh' }}
        search={{
          span: 8,
          labelWidth: 75,
        }}
        form={{
          ignoreRules: false,
        }}
        beforeSearchSubmit={params => {
          setSupplementSearchParams({
            createTime: formatDate,
            institutionCode: formatInstitutionName,
          });
        }}
        formRef={supplementRef}
        onReset={() => {
          onReset();
        }}
        params={supplementSearchParams}
        sticky={true}
        request={(params, sort, filter) => {
          return getInventorySupplementList({
            ...params,
            ...sort,
            ...filter,
          });
        }}
      />
      <Drawer
        title="明细"
        width={'60%'}
        closable={true}
        destroyOnClose={true}
        maskClosable={false}
        onClose={() => setChildrenDrawerVisible(false)}
        visible={childrenDrawerVisible}
      >
        <ProTable
          options={false}
          columns={inventoryDetailColumn}
          pagination={{
            defaultPageSize: 10,
            showQuickJumper: true,
          }}
          scroll={{ x: 2400, y: '65vh' }}
          search={false}
          request={(params, sort, filter) => {
            return getInventorySupplementDetailList({
              fileId: fileId,
              standardInstitutionCode: standardInstitutionCode,
              ...params,
              ...sort,
              ...filter,
            });
          }}
          rowKey="id"
          dateFormatter="string"
        />
        <div style={{ textAlign: 'end', marginRight: 24, marginTop: 40 }}>
          <Button
            key="submit"
            type="primary"
            onClick={() => setChildrenDrawerVisible(false)}
          >
            确定
          </Button>
        </div>
      </Drawer>
    </Drawer>
  );
};

export default SupplementMonthMonitor;
