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

  //????????????column
  const supplementColumns: ProColumns<GithubIssueItem>[] = [
    {
      title: '?????????',
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
            message: '?????????????????????',
          },
        ],
      },
    },
    {
      title: '????????????',
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
            message: '????????????????????????',
          },
        ],
      },
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: '?????????',
      dataIndex: 'fileName',
      key: 'fileName',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: '????????????',
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
      title: '??????',
      dataIndex: 'operation',
      width: '10%',
      hideInSearch: true,
      render: (text: any, record: any) => [
        <Popconfirm
          title="???????????????????????????????????????????????????????"
          onConfirm={() => handleSupplement(record)}
        >
          <Button type="link" style={{ marginLeft: -16 }}>
            ????????????
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  //??????????????????column
  const inventoryDetailColumn: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      width: '6%',
      ellipsis: true,
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
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
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
      title: '??????????????????',
      dataIndex: 'failCause',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            mode="multiple"
            allowClear
            placeholder="?????????"
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
      title: '??????',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'right',
      width: '5%',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];

  //???????????????
  const onSearchInstitutionName = (e: any) => {
    const institutionName = { name: e };
    getInstitutionPocket(institutionName).then((res: any) => {
      //???????????????
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

  //???????????????
  const onChangeInstitution = (e: any) => {
    institutionPocket.forEach((item: any, i) => {
      if (e === item.code) {
        setFormatInstitutionName(item.code); //???????????????????????????????????????code??????
      }
    });
  };

  //????????????????????????????????????7???
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

  //???????????????--??????????????????????????????????????????yy???mm???dd??????
  const onChangeCreatTimeValue = (val: any) => {
    supplementRef.current?.setFieldsValue({ createTime: val });
    if (Array.isArray(val)) {
      const earlyValue = formatChinaStandardTimeToDate(val[0]);
      const lateValue = formatChinaStandardTimeToDate(val[1]);
      setFormatDate([earlyValue, lateValue]);
    }
  };

  //????????????
  const handleSupplement = async (record: any) => {
    try {
      const params = {
        fileId: record.id,
        standardInstitutionCode: record.institutionCode,
        periodId: periodId,
      };
      await getSupplementQuery(params);
      setSupplementModalVisible(false);
      message.success('??????');
    } catch (e) {
      message.warning('??????');
    }
  };

  //????????????
  const onReset = () => {
    setSupplementSearchParams({}); //??????????????????????????????
    setCreateTimeValue([]); //????????????????????????????????????
  };

  const supplementRef = useRef<FormInstance>();
  return (
    <Drawer
      width={'67%'}
      title="????????????"
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
        title="??????"
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
            ??????
          </Button>
        </div>
      </Drawer>
    </Drawer>
  );
};

export default SupplementMonthMonitor;
