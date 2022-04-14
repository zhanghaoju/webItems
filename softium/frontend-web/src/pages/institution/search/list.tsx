import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  exportInstitutionData,
  getList,
  institutionAllTemplate,
  institutionTemplate,
  institutionTypeChange,
} from '@/services/institution';
import { Button, Dropdown, Input, Menu, message, Select, Tooltip } from 'antd';
import ListTable from '../list';
import {
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
} from '@ant-design/icons/lib';
import DetailModal from '@/pages/institution/detail/modal';
import SearchForm from './searchForm';
import { useRequest } from '@@/plugin-request/request';
import {
  findByValue,
  getDictionaryByCurrentSystemCode,
  getFields,
  handleColumnsData,
  handleLikeFieldChange,
  handleOldColumns,
} from '@/pages/institution/util';
import { useAuth, VulcanFile } from '@vulcan/utils';
import { history } from '@@/core/history';
import { getLoadCommon } from '@/services/applicationInfo';
import _ from 'lodash';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import {
  getDictionary,
  getStoreDictionary,
  handleColumns,
  handleTag,
  layout1,
  setStoreDictionary,
} from '@/utils/utils';
import { institutionCategory } from '@/pages/institution/institutionCategory';
import GModal from '@/components/modal';

interface InstitutionProps {
  institution: any;
  dispatch: any;
}

const changeAttributeColumns = [
  {
    name: 'institutionName',
    label: '机构名称',
    order: 10,
    args: {
      disabled: true,
    },
  },
  {
    name: 'institutionCode',
    label: '机构编码',
    order: 20,
    args: {
      disabled: true,
    },
  },
  {
    name: 'fromType',
    label: '原始机构属性',
    order: 20,
    args: {
      type: 'select',
      span: 24,
      disabled: true,
      dictionary: 'InstitutionCategory',
    },
  },
  {
    name: 'toType',
    label: '目标机构属性',
    order: 20,
    args: {
      type: 'select',
      required: true,
      dictionary: 'InstitutionCategory',
      childKey: 'category',
    },
  },
  {
    name: 'category',
    label: '目标机构子类',
    order: 20,
    args: {
      type: 'select',
      dictionary: 'InstitutionCategory',
      parentKey: 'toType',
    },
  },
  {
    name: 'description',
    label: '描述',
    order: 20,
    itemLayout: layout1,
    args: {
      type: 'textarea',
      span: 24,
      placeholder: '请输入任务描述，最多不超过100个字',
    },
    attr: {
      maxLength: 100,
    },
  },
];

const InstitutionSearch: React.FC<InstitutionProps> = () => {
  const childRef: any = useRef<any>();
  const modalRef: any = useRef<any>();
  const state = getDictionaryByCurrentSystemCode('State');
  const institutionTag = getDictionaryBySystemCode('InstitutionTag') || [];
  const [params, setParams] = useState<any>({});
  const [initOptions, setOptions] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [initLoading, setLoading] = useState(false);
  const [initColumns, setColumns] = useState<any>({ ext: [], allFields: [] });
  const stateEnum = () => {
    let newStateValueEnum: any = {};
    for (let item of state) {
      newStateValueEnum[item.value] = {
        text: item.label,
        status: item.value === 'Active' ? 'Success' : 'Error',
      };
    }
    return newStateValueEnum;
  };
  const stateValueEnum = stateEnum() || {};
  const searchExport = useAuth('searchExport');
  const searchDetail = useAuth('searchDetail');
  const changeAttribute = useAuth('searchChangeAttribute');

  const columns: any = [
    {
      title: '机构名称',
      dataIndex: 'name',
      fixed: 'left',
      order: 10,
      width: 240,
      renderFormItem: (item: any, config: any, form: any) => {
        return (
          <Input
            placeholder="请输入"
            onKeyUp={e => handleLikeFieldChange(e, form)}
          />
        );
      },
    },
    {
      title: '机构编码',
      dataIndex: 'code',
      ellipsis: true,
      fixed: 'left',
      width: 130,
      order: 30,
    },
    {
      title: 'ERP编码',
      dataIndex: 'erpCode',
      ellipsis: true,
      width: 130,
      order: 35,
    },
    {
      title: '省份',
      dataIndex: 'province',
      ellipsis: true,
      width: 100,
      order: 40,
    },
    {
      title: '城市',
      dataIndex: 'city',
      ellipsis: true,
      width: 100,
      order: 50,
    },
    {
      title: '区县',
      dataIndex: 'county',
      ellipsis: true,
      width: 100,
      order: 60,
    },
    {
      title: '地址',
      dataIndex: 'address',
      ellipsis: true,
      width: 300,
      render: (text: any, { addressInfos }: any) => {
        if ((addressInfos || []).length > 0) {
          const addressInfo = addressInfos.find((item: any) => item.isDefalut);
          text = addressInfo ? addressInfo.address : addressInfos[0].address;
        }
        return text;
      },
      order: 70,
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      ellipsis: true,
      width: '10%',
      order: 80,
    },
    {
      title: '机构子类型',
      dataIndex: 'category',
      ellipsis: true,
      width: '10%',
      order: 90,
    },
    {
      title: '机构二级类型',
      dataIndex: 'subCategory',
      ellipsis: true,
      width: '10%',
      order: 100,
    },
    {
      title: '机构属性',
      dataIndex: 'property',
      ellipsis: true,
      width: '10%',
      order: 110,
    },
    {
      title: '机构级别',
      dataIndex: 'level',
      ellipsis: true,
      width: '10%',
      order: 120,
    },
    {
      title: '业务属性',
      dataIndex: 'serviceAttribute',
      width: '10%',
      search: false,
      order: 130,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '10%',
      order: 140,
      valueEnum: stateValueEnum,
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            {state.map((item: any) => {
              return (
                <Select.Option value={item.value} key={item.value}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 240,
      ellipsis: true,
      order: 150,
    },
    {
      title: '创建源',
      dataIndex: 'source',
      width: '10%',
      order: 160,
    },
    {
      title: '标签',
      dataIndex: 'tag',
      width: '20%',
      order: 170,
      render: (text: string) => {
        if (!text) return null;
        const allStr: string[] = [];
        const res = text.split(',');
        res.forEach((item: string) => {
          allStr.push(findByValue(institutionTag, item).label);
        });
        return (
          <Tooltip title={allStr.join(',')}>
            {[...allStr].splice(0, 2).join(',')}
            {allStr.length > 2 ? '...' : ''}
          </Tooltip>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      width: 100,
      ellipsis: true,
      order: 180,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '10%',
      ellipsis: true,
      order: 190,
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
      width: 100,
      ellipsis: true,
      order: 200,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      width: '10%',
      ellipsis: true,
      order: 210,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 120,
      order: 3000,
      hideInTable: !searchDetail && !changeAttribute,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            {searchDetail && <span onClick={() => detail(record)}>查看</span>}
            {changeAttribute && (
              <span onClick={() => handleAttribute(record)}>变更属性</span>
            )}
          </div>
        );
      },
    },
  ];

  const handleAttribute = (record: any) => {
    setVisible(true);
    record.fromType =
      record.typeName === 'HealthCare' ? 'Hospital' : record.typeName;
    record.institutionCode = record.code;
    record.institutionName = record.name;
    record.category = undefined;
    setOptions({
      fields: changeAttributeColumns,
      initialValues: record,
      extFieldInfo: {
        hideExtCard: true,
      },
      attr: { title: '变更属性', okText: '提交' },
    });
  };

  const renderText = {
    source: 'InstitutionSource',
    level: 'InstitutionGrade',
    property: 'InstitutionAttribute',
    category: 'Type',
    type: 'InstitutionCategory',
  };

  const setHospitalType = () => {
    const dictionary: any = getStoreDictionary();
    const dictionaryValue: any = getDictionary('InstitutionCategory');
    dictionaryValue.forEach((item: any) => {
      item.value = item.value === 'HealthCare' ? 'Hospital' : item.value;
      const category: any = getDictionary(`${item.value}Type`);
      item.children = category || [];
    });
    dictionary.InstitutionCategory = dictionaryValue;
    setStoreDictionary(dictionary);
  };

  useEffect(() => {
    const request = async () => {
      await setHospitalType();
      await handleTag('Institution');
      const res: any = await getLoadCommon();
      const ext = (res?.data || []).filter((item: any) => item.prop === 'ext');
      const result = handleOldColumns({
        detailFields: getFields(ext),
        data: ext,
      });
      setParams({ ...params, searchErpCode: result.searchErpCode });
      setColumns({ ext: result.extMetadata, allFields: res.data });
    };
    request().then();
  }, [setParams, setColumns]);

  const detail = async (record: any) => {
    const { category, table, fields } = institutionCategory[record.typeName];
    const result: any = await handleColumns(table, fields);
    await modalRef.current.params({
      visible: true,
      record,
      extMetadata: result.extFields,
      category,
      detailFields: result.detailFields,
    });
  };

  const exportInstitution = useRequest(exportInstitutionData, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  const downloadInstitutionTemplate = async () => {
    try {
      const file: any = await institutionTemplate();
      VulcanFile.export(file);
    } catch (e) {}
  };

  const downloadInstitutionImportTemplate = async () => {
    try {
      const file: any = await institutionAllTemplate();
      VulcanFile.export(file);
    } catch (e) {
      console.log(e);
    }
  };

  const headerTitle: any = () => {
    return (
      <div className="btn-container">
        <Button
          className="btn-item"
          key="exportInstitution"
          type="primary"
          loading={initLoading}
          onClick={() => {
            setLoading(true);
            exportInstitution.run(params);
          }}
        >
          <DownloadOutlined />
          机构导出
        </Button>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() =>
                  history.push(
                    '/institution/search/institutionImport?type=code',
                  )
                }
              >
                行业库编码机构导入
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  history.push(
                    '/institution/search/institutionImport?type=institution',
                  )
                }
              >
                机构导入
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            导入 <UploadOutlined />
          </Button>
        </Dropdown>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={downloadInstitutionTemplate}>
                行业库编码导入模板
              </Menu.Item>
              <Menu.Item onClick={downloadInstitutionImportTemplate}>
                机构导入模板
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            下载模板 <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    );
  };

  const setSearchData = (data: any) => {
    const cloneData = _.clone(data);
    cloneData.type = cloneData.type ? [cloneData.type] : undefined;
    if (params.searchErpCode) {
      cloneData.likeFieldErpCode = cloneData.likeField
        ? [cloneData.likeField]
        : undefined;
      delete cloneData.likeField;
    } else {
      cloneData.likeField = cloneData.likeField
        ? [cloneData.likeField]
        : undefined;
      delete cloneData.likeFieldErpCode;
    }
    setParams({ ...params, ...cloneData });
    reload({ ...params, ...cloneData, reloadType: 'search' });
    childRef.current.reload({ ...params, ...cloneData, reloadType: 'search' });
  };

  const reload = (params: any = null) => childRef.current.reload(params);

  const submitData = (values: any, sourceData: any, setSpinning: any) => {
    values.id = sourceData.id;
    delete values.extMap;
    values.toType = values.toType === 'Hospital' ? 'HealthCare' : values.toType;
    values.fromType =
      values.fromType === 'Hospital' ? 'HealthCare' : values.fromType;
    institutionTypeChange(values)
      .then(() => {
        message.success('提交成功').then();
        setVisible(false);
        reload();
      })
      .catch(() => setSpinning(false));
  };

  if (Object.keys(params).length === 0) return null;

  return (
    <>
      <SearchForm
        setSearchData={setSearchData}
        searchErpCode={params.searchErpCode}
      />
      <ListTable
        code="institutionSearchTable"
        cRef={childRef}
        hideSearch={true}
        columns={handleColumnsData(columns, initColumns.allFields)}
        getList={getList}
        scrollX={3000}
        headerTitle={searchExport ? headerTitle : null}
        hideSelection={true}
        hasDefaultColumns={true}
        params={params}
        renderText={renderText}
      />
      <DetailModal cRef={modalRef} childRef={childRef} />
      {visible && (
        <GModal
          options={initOptions}
          visible={visible}
          callback={(values: any, sourceData: any, setSpinning: any) =>
            submitData(values, sourceData, setSpinning)
          }
          setVisible={setVisible}
        />
      )}
    </>
  );
};
export default InstitutionSearch;
