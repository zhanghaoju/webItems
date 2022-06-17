import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ListTable from '../list';
import { Columns } from '@/pages/institution/Institution';
import {
  getDictionaryEnum,
  getShowErp,
  handleDictionary,
  handleOldColumns,
} from '@/pages/institution/util';
import CitySelect from '@/pages/institution/citySelect';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import {
  getNewApplyList,
  getAllCount,
  addAll,
  batchAddInstitutionDcr,
} from '@/services/newApply';
import HospitalDetail from '@/pages/institution/detail/detail';
import DetailModal from '@/pages/institution/detail/modal';
import { Authorized, useAuth } from '@vulcan/utils';
import { Button, message, Modal } from 'antd';
import {
  getStoreDictionary,
  handleColumns,
  handleTag,
  setStoreDictionary,
  getDictionary,
} from '@/utils/utils';
import InstitutionModal from '@/pages/institution/add';
import { institutionCategory } from '@/pages/institution/institutionCategory';
import { getLoadCommon } from '@/services/applicationInfo';
import { getNewApplyDetail } from '@/services/institution';

const NewApply: React.FC = () => {
  const childRef: any = useRef<any>();
  const modalRef: any = useRef<any>();
  const options = getDictionaryBySystemCode('Region') || [];
  const applyStatus = getDictionaryBySystemCode('ApplyStatus') || [];
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [detailParams, setDetailParams] = useState<any>({});
  const [fields, setFields] = useState<any>({
    extFields: [],
    detailFields: [],
    allFields: [],
    formFields: [],
  });
  const [params, setParams] = useState<any>({});
  handleDictionary(options);
  handleDictionary(applyStatus);
  const newApplyDetail = useAuth('newApplyDetail');
  const newApplyAdd = useAuth('newApplyAdd');

  const columns: Columns[] = [
    {
      title: '关键词',
      dataIndex: 'likeField',
      hideInTable: true,
      tooltip: '可查询项：机构名称、机构编码、机构别名',
      order: 80,
    },
    {
      title: '清洗后机构名称',
      dataIndex: 'newName',
      search: false,
      width: '15%',
      order: 10,
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      ellipsis: true,
      valueType: 'select',
      width: '10%',
      order: 15,
      valueEnum: getDictionaryEnum('InstitutionCategory'),
    },
    {
      title: '初次申请时间',
      dataIndex: 'createTime',
      hideInTable: true,
      width: '10%',
      order: 14,
      valueType: 'dateTimeRange',
      valueEnum: getDictionaryEnum('InstitutionCategory'),
    },
    {
      title: '清洗前机构名称',
      dataIndex: 'name',
      search: false,
      width: '15%',
      order: 20,
    },
    {
      title: '机构编码',
      dataIndex: 'code',
      ellipsis: true,
      search: false,
      width: 130,
      order: 30,
    },
    {
      title: 'ERP编码',
      dataIndex: 'erpCode',
      ellipsis: true,
      search: false,
      width: 130,
      order: 35,
    },
    {
      title: '省份',
      dataIndex: 'province',
      ellipsis: true,
      search: false,
      width: '10%',
      order: 40,
    },
    {
      title: '省份',
      dataIndex: 'provinceCode',
      ellipsis: true,
      hideInTable: true,
      width: '10%',
      valueType: 'select',
      request: () => options,
      order: 70,
    },
    {
      title: '城市',
      dataIndex: 'city',
      ellipsis: true,
      search: false,
      width: '10%',
      order: 60,
    },
    {
      title: '城市',
      dataIndex: 'cityCode',
      ellipsis: true,
      hideInTable: true,
      width: '10%',
      renderFormItem: (item: any, config: any, form: any) => {
        if (config.type === 'form') {
          return null;
        }
        const stateType = form.getFieldValue('provinceCode');
        return (
          <CitySelect
            {...config}
            state={{
              type: stateType,
            }}
            form={form}
            onChange={(value: string[]) => {
              form.validateFields().then((res: any) => {
                res.cityCode = value;
                form.setFieldsValue(res);
              });
            }}
          />
        );
      },
      order: 60,
    },
    {
      title: '区县',
      dataIndex: 'county',
      ellipsis: true,
      search: false,
      width: '10%',
      order: 70,
    },
    {
      title: '地址',
      dataIndex: 'address',
      ellipsis: true,
      search: false,
      width: '15%',
      order: 80,
    },
    {
      title: '清洗状态',
      dataIndex: 'cleanState',
      ellipsis: true,
      search: false,
      width: '10%',
      order: 80,
    },
    {
      title: '清洗结果',
      dataIndex: 'cleanResult',
      ellipsis: true,
      search: false,
      width: '10%',
      order: 80,
    },
    {
      title: '申请状态',
      dataIndex: 'applyState',
      ellipsis: true,
      request: () => applyStatus,
      width: '10%',
      order: 80,
      valueEnum: getDictionaryEnum('ApplyStatus'),
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      fixed: 'right',
      width: 100,
      hideInTable: !newApplyDetail && !newApplyAdd,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            <span onClick={() => detail(record)}>详情</span>
            {newApplyAdd && record.applyState === 'Pending' ? (
              <span onClick={() => addInstitution(record)}>添加</span>
            ) : null}
          </div>
        );
      },
    },
  ];

  const addInstitution = async (record: any) => {
    const { category, table, fields } = institutionCategory[record.type];
    const result: any = await handleColumns(table, fields);
    await setFields({
      extFields: result.extFields,
      detailFields: result.detailFields,
      formFields: result.formFields,
    });
    await setDetailParams({
      id: record.id,
      institutionCategory: category,
      dcr: true,
    });
    await setAddVisible(true);
  };

  const detailTabs: any = [{ title: '详情', component: HospitalDetail }];

  const setHospitalType = () => {
    const dictionary: any = getStoreDictionary();
    const hospitalType: any = getDictionary('HospitalType');
    hospitalType.forEach((item: any) => {
      const category: any = getDictionary(`${item.value}Category`);
      item.children = category || [];
    });
    dictionary.HospitalType = hospitalType;
    setStoreDictionary(dictionary);
  };

  useEffect(() => {
    const request = async () => {
      await setHospitalType();
      await handleTag('Institution');
      const res: any = await getLoadCommon();
      const ext = (res?.data || []).filter((item: any) => item.prop === 'ext');
      const result = handleOldColumns({
        detailFields: [],
        data: ext,
      });
      columns[0].tooltip = `可查询项：医院名称、医院编码、医院别名${getShowErp(
        res.data,
      )}`;
      setParams({ ...params, searchErpCode: result.searchErpCode });
    };
    request().then();
  }, []);

  const detail = async (record: any) => {
    const { category, table, fields } = institutionCategory[record.type];
    const result: any = await handleColumns(table, fields);
    await modalRef.current.params({
      visible: true,
      record,
      extMetadata: result.extFields,
      category,
      detailFields: result.detailFields,
      handleDetail: getNewApplyDetail,
    });
  };

  const reloadList = () => {
    childRef.current.reload(childRef.current.getSearchParams());
  };

  const keyAdd = async () => {
    try {
      const { data } = await getAllCount();
      if (data && data > 0) {
        Modal.confirm({
          title: '确认添加',
          content: `是否确认一键添加${data}条主数据？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () =>
            new Promise((resolve, reject) => {
              addAll()
                .then(({ data }) => {
                  message.success(
                    `添加成功!其中${data?.successCount}条数据已完成清洗入库`,
                  );
                  reloadList();
                  resolve(true);
                })
                .catch(err => {
                  reject(err);
                });
            }),
        });
        return;
      }
      message.info('当前没有可添加机构');
    } catch (e) {
      console.log(e);
    }
  };

  const batchAdd = async (selectedRowKeys: any, onCleanSelected: any) => {
    try {
      batchAddInstitutionDcr(selectedRowKeys).then(({ data }) => {
        message.success(
          `添加成功!其中${data?.successCount}条数据已完成清洗入库`,
        );
        onCleanSelected();
        reloadList();
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (Object.keys(params).length === 0) return null;

  return (
    <>
      <ListTable
        code="newApplyTable"
        cRef={childRef}
        columns={columns}
        getList={getNewApplyList}
        scrollX={3000}
        hideSelection={false}
        search={{ labelWidth: 120 }}
        params={params}
        hasDefaultColumns={true}
        headerTitle={() => (
          <Authorized code="newApplyAKeyAdd">
            <Button type="primary" onClick={keyAdd}>
              一键添加全部机构
            </Button>
          </Authorized>
        )}
        batchAddAuth={useAuth('newApplyBatchAdd')}
        batchAdd={batchAdd}
        rowSelection={{
          getCheckboxProps: (record: any) => {
            return {
              disabled: record.applyState !== 'Pending',
            };
          },
        }}
      />
      <DetailModal cRef={modalRef} detailTabs={detailTabs} />
      {addVisible && (
        <InstitutionModal
          type="Pharmacy"
          hideAdd={true}
          reloadList={reloadList}
          addVisible={addVisible}
          params={detailParams}
          institutionConfig={{}}
          institutionFields={fields}
          setAddVisible={setAddVisible}
        />
      )}
    </>
  );
};

export default NewApply;
