import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  aliasTemplate,
  downloadHospitalTemplate,
  exportAliasData,
  exportHospitalData,
  getHospitalList,
  updateHospital,
  getInstitutionConfig,
} from '@/services/institution';
import { message, Popconfirm } from 'antd';
import ListTable from '../list';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import DetailModal from '@/pages/institution/detail/modal';
import HospitalDetail from '@/pages/institution/detail/detail';
import Alias from '@/pages/institution/detail/alias';
import SubInstitution from '@/pages/institution/detail/subInstitution';
import { Columns } from '@/pages/institution/Institution';
import { updateState, institutionDel } from '@/pages/institution/util';
import InstitutionModal from '@/pages/institution/add';
import { useAuth } from '@vulcan/utils';
import { InstitutionHeaderTitle } from '../institutionCommon';
import {
  getDictionary,
  getStoreDictionary,
  handleColumns,
  handleTag,
  setStoreDictionary,
} from '@/utils/utils';
import { institutionCategory } from '../institutionCategory';

const Hospital: React.FC = () => {
  const childRef: any = useRef<any>();
  const modalRef: any = useRef<any>();
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [hideAdd, setHideAdd] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({});
  const [params, setParams] = useState<any>({});
  const [institutionConfig, setInstitutionConfig] = useState<any>({});
  const [fields, setFields] = useState<any>({
    extFields: [],
    detailFields: [],
    formFields: [],
    tableFields: [],
  });
  const hospitalDetail = useAuth('hospitalDetail');
  const hospitalAliasEdit = useAuth('hospitalAliasEdit');
  const hospitalState = useAuth('hospitalState');
  const hospitalAliasAdd = useAuth('hospitalAliasAdd');
  const hospitalAliasDel = useAuth('hospitalAliasDel');
  const hospitalDel = useAuth('hospitalDel');
  const actionLen: number = [
    hospitalDetail,
    hospitalAliasEdit,
    hospitalState,
    hospitalDel,
  ].filter((item: any) => item && item.menuId).length;

  const columns: Columns[] = [
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: actionLen * 50,
      order: 20000,
      hideInTable:
        !hospitalDetail && !hospitalAliasEdit && !hospitalState && !hospitalDel,
      render: (text: ReactNode, record: any) => {
        const state: boolean = record.state.toLowerCase() === 'active';
        return (
          <div className="action-container">
            {hospitalDetail && <span onClick={() => detail(record)}>查看</span>}
            {hospitalAliasEdit && (
              <span onClick={() => showEdit(record)}>编辑</span>
            )}
            {hospitalState && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  updateState(record, 'HealthCare', updateHospital, reloadList)
                }
                title={`您确定要设为${state ? '失效' : '生效'}吗？`}
                icon={<QuestionCircleOutlined />}
              >
                <span>{state ? '设为失效' : '设为生效'}</span>
              </Popconfirm>
            )}
            {hospitalDel && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  institutionDel(record.id, reloadList, childRef)
                }
                title={() => {
                  return (
                    <span style={{ display: 'block', width: 200 }}>
                      主数据的别名和级别（若有）都将一并删除，删除后无法恢复，确认要删除吗？
                    </span>
                  );
                }}
                icon={<QuestionCircleOutlined />}
              >
                <span>删除</span>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

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
      const { fields, table, category } = institutionCategory.HealthCare;
      const config: any = await getInstitutionConfig({
        institutionCategory: category,
      });
      setInstitutionConfig(config.data);
      const result: any = await handleColumns(table, fields);
      setFields({
        extFields: result.extFields,
        detailFields: result.detailFields,
        formFields: result.formFields,
        tableFields: result.tableFields,
      });
      setSearchParams({ searchErpCode: result.searchErpCode });
    };
    request().then();
  }, [setFields, setSearchParams]);

  const detailTabs: any = [
    { title: '详情', component: HospitalDetail },
    { title: '别名库', component: Alias },
    { title: '下级机构', component: SubInstitution },
  ];
  const detail = (record: any) => {
    const { category } = institutionCategory.HealthCare;
    modalRef.current.params({
      visible: true,
      record,
      category,
      extMetadata: fields.extFields,
      auth: {
        add: hospitalAliasAdd,
        del: hospitalAliasDel,
      },
      detailFields: fields.detailFields,
    });
  };

  const reloadList = (msg: string) => {
    msg && message.success(msg);
    childRef.current.reload();
  };

  const showEdit: any = (record: any = {}) => {
    const { category } = institutionCategory.HealthCare;
    setParams({
      id: record.id,
      institutionCategory: category,
    });
    setHideAdd(true);
    setAddVisible(true);
  };

  const headerTitle: any = () => {
    return (
      <InstitutionHeaderTitle
        type="hospital"
        addFn={() => {
          setParams({});
          setHideAdd(false);
          setAddVisible(true);
        }}
        searchParams={searchParams}
        importPath={{
          institution: '/institution/hospital/institutionImport',
          alias: '/institution/hospital/aliasImport',
          update: '/institution/hospital/updateImport',
          subInstitution: '/institution/hospital/subInstitutionImport',
        }}
        downloadTemplate={{
          institution: downloadHospitalTemplate,
          alias: aliasTemplate,
        }}
        exportExport={{
          institution: exportHospitalData,
          alias: exportAliasData,
        }}
      />
    );
  };

  if (Object.keys(searchParams).length === 0) return null;

  return (
    <>
      <ListTable
        code="t_mdm_institution_healthcare"
        cRef={childRef}
        columns={[...fields.tableFields, ...columns]}
        getList={getHospitalList}
        scrollX={3000}
        headerTitle={headerTitle}
        hideSelection={true}
        params={searchParams}
        search={{ labelWidth: 120 }}
        beforeSearchSubmit={(params: any) => {
          if (params) {
            const newParams: any = JSON.parse(JSON.stringify(params));
            delete newParams.region;
            setSearchParams(newParams);
          }
        }}
      />
      <DetailModal cRef={modalRef} detailTabs={detailTabs} />
      {addVisible && (
        <InstitutionModal
          type="HealthCare"
          hideAdd={hideAdd}
          reloadList={reloadList}
          addVisible={addVisible}
          params={params}
          institutionConfig={institutionConfig}
          institutionFields={fields}
          setAddVisible={setAddVisible}
        />
      )}
    </>
  );
};

export default Hospital;
