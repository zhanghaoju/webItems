import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  aliasTemplate,
  downloadPharmacyTemplate,
  exportAliasData,
  exportPharmacyData,
  getInstitutionConfig,
  getPharmacyList,
  updatePharmacy,
} from '@/services/institution';
import { message, Popconfirm } from 'antd';
import ListTable from '../list';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import DetailModal from '@/pages/institution/detail/modal';
import HospitalDetail from '@/pages/institution/detail/detail';
import Alias from '@/pages/institution/detail/alias';
import { Columns } from '@/pages/institution/Institution';
import { institutionDel, updateState } from '@/pages/institution/util';
import { useAuth } from '@vulcan/utils';
import InstitutionModal from '@/pages/institution/add';
import { InstitutionHeaderTitle } from '@/pages/institution/institutionCommon';
import { handleColumns, handleTag } from '@/utils/utils';
import { institutionCategory } from '@/pages/institution/institutionCategory';
import SubInstitution from '@/pages/institution/detail/subInstitution';

const Pharmacy: React.FC = () => {
  const childRef: any = useRef<any>();
  const modalRef: any = useRef<any>();
  const [searchParams, setSearchParams] = useState({});
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [institutionConfig, setInstitutionConfig] = useState<any>({});
  const [hideAdd, setHideAdd] = useState<boolean>(false);
  const [params, setParams] = useState<any>({});
  const [fields, setFields] = useState<any>({
    extFields: [],
    detailFields: [],
    formFields: [],
    tableFields: [],
  });
  const pharmacyDetail = useAuth('pharmacyDetail');
  const pharmacyEdit = useAuth('pharmacyEdit');
  const pharmacyState = useAuth('pharmacyState');
  const pharmacyAliasAdd = useAuth('pharmacyAliasAdd');
  const pharmacyAliasDel = useAuth('pharmacyAliasDel');
  const pharmacyDel = useAuth('pharmacyDel');
  const actionLen: number = [
    pharmacyDetail,
    pharmacyEdit,
    pharmacyState,
    pharmacyDel,
  ].filter((item: any) => item && item.menuId).length;

  const columns: Columns[] = [
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      width: actionLen * 50,
      hideInTable:
        !pharmacyDetail && !pharmacyEdit && !pharmacyState && !pharmacyDel,
      fixed: 'right',
      render: (text: ReactNode, record: any) => {
        const state: boolean = record.state.toLowerCase() === 'active';
        return (
          <div className="action-container">
            {pharmacyDetail && <span onClick={() => detail(record)}>??????</span>}
            {pharmacyEdit && <span onClick={() => showEdit(record)}>??????</span>}
            {pharmacyState && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  updateState(record, 'Pharmacy', updatePharmacy, reloadList)
                }
                title={`??????????????????${state ? '??????' : '??????'}??????`}
                icon={<QuestionCircleOutlined />}
              >
                <span>{state ? '????????????' : '????????????'}</span>
              </Popconfirm>
            )}
            {pharmacyDel && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  institutionDel(record.id, reloadList, childRef)
                }
                title={() => {
                  return (
                    <span style={{ display: 'block', width: 200 }}>
                      ?????????????????????????????????????????????????????????????????????????????????????????????????????????
                    </span>
                  );
                }}
                icon={<QuestionCircleOutlined />}
              >
                <span>??????</span>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  const detailTabs: any = [
    { title: '??????', component: HospitalDetail },
    { title: '?????????', component: Alias },
    { title: '????????????', component: SubInstitution },
  ];
  const detail = (record: any) => {
    const { category } = institutionCategory.Pharmacy;
    modalRef.current.params({
      visible: true,
      record,
      extMetadata: fields.extFields,
      auth: {
        add: pharmacyAliasAdd,
        del: pharmacyAliasDel,
      },
      category,
      detailFields: fields.detailFields,
    });
  };

  const reloadList = (msg: string) => {
    msg && message.success(msg);
    childRef.current.reload();
  };

  useEffect(() => {
    const request = async () => {
      await handleTag('Institution');
      const { fields, table, category } = institutionCategory.Pharmacy;
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

  const showEdit: any = (record: any = {}) => {
    const { category } = institutionCategory.Pharmacy;
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
        type="pharmacy"
        addFn={() => {
          setParams({});
          setHideAdd(false);
          setAddVisible(true);
        }}
        searchParams={searchParams}
        importPath={{
          institution: '/institution/pharmacy/institutionImport',
          alias: '/institution/pharmacy/aliasImport',
          update: '/institution/pharmacy/updateImport',
          subInstitution: '/institution/pharmacy/subInstitutionImport',
        }}
        downloadTemplate={{
          institution: downloadPharmacyTemplate,
          alias: aliasTemplate,
        }}
        exportExport={{
          institution: exportPharmacyData,
          alias: exportAliasData,
        }}
      />
    );
  };

  return (
    <>
      {Object.keys(searchParams).length > 0 ? (
        <>
          <ListTable
            code="t_mdm_institution_pharmacy"
            cRef={childRef}
            columns={[...fields.tableFields, ...columns]}
            getList={getPharmacyList}
            scrollX={3000}
            hideSelection={true}
            search={{ labelWidth: 120 }}
            params={searchParams}
            beforeSearchSubmit={(params: any) => {
              if (params) {
                const newParams: any = JSON.parse(JSON.stringify(params));
                delete newParams.region;
                setSearchParams(newParams);
              }
            }}
            headerTitle={headerTitle}
          />
          <DetailModal cRef={modalRef} detailTabs={detailTabs} />
          {addVisible && (
            <InstitutionModal
              type="Pharmacy"
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
      ) : null}
    </>
  );
};

export default Pharmacy;
