import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  aliasTemplate,
  contractTemplate,
  downloadDistributorTemplate,
  exportAliasData,
  exportContractData,
  exportDistributorData,
  exportDistributorLevelData,
  getDistributorList,
  getInstitutionConfig,
  levelTemplate,
  updateDistributor,
} from '@/services/institution';
import { message, Popconfirm } from 'antd';
import ListTable from '../list';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import DetailModal from '@/pages/institution/detail/modal';
import HospitalDetail from '@/pages/institution/detail/detail';
import Alias from '@/pages/institution/detail/alias';
import Level from '@/pages/institution/distributor/level';
import DistributorContract from '@/pages/institution/distributor/contract/DistributorContract';
import { Columns } from '@/pages/institution/Institution';
import { institutionDel, updateState } from '@/pages/institution/util';
import { useAuth } from '@vulcan/utils';
import InstitutionModal from '@/pages/institution/add';
import { InstitutionHeaderTitle } from '@/pages/institution/institutionCommon';
import { handleColumns, handleTag } from '@/utils/utils';
import { institutionCategory } from '@/pages/institution/institutionCategory';

const Distributor: React.FC = () => {
  const childRef: any = useRef<any>();
  const modalRef: any = useRef<any>();
  const [searchParams, setSearchParams] = useState({});
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [hideAdd, setHideAdd] = useState<boolean>(false);
  const [params, setParams] = useState<any>({});
  const [institutionConfig, setInstitutionConfig] = useState<any>({});
  const [fields, setFields] = useState<any>({
    extFields: [],
    detailFields: [],
    formFields: [],
    tableFields: [],
  });
  const dealerDetail = useAuth('dealerDetail');
  const dealerEdit = useAuth('dealerEdit');
  const dealerState = useAuth('dealerState');
  const dealerAliasAdd = useAuth('dealerAliasAdd');
  const dealerAliasDel = useAuth('dealerAliasDel');
  const dealerDel = useAuth('dealerDel');
  const actionLen: number = [
    dealerDetail,
    dealerState,
    dealerAliasAdd,
    dealerDel,
  ].filter((item: any) => item && item.menuId).length;

  const columns: Columns[] = [
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: actionLen * 50,
      hideInTable: !dealerDetail && !dealerState && !dealerAliasAdd,
      render: (text: ReactNode, record: any) => {
        const state: boolean = record.state.toLowerCase() === 'active';
        return (
          <div className="action-container">
            {dealerDetail && <span onClick={() => detail(record)}>查看</span>}
            {dealerEdit && <span onClick={() => showEdit(record)}>编辑</span>}
            {dealerState && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  updateState(
                    record,
                    'Distributor',
                    updateDistributor,
                    reloadList,
                  )
                }
                title={`您确定要设为${state ? '失效' : '生效'}吗？`}
                icon={<QuestionCircleOutlined />}
              >
                <span>{state ? '设为失效' : '设为生效'}</span>
              </Popconfirm>
            )}
            {dealerDel && (
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

  const detailTabs: any = [
    { title: '详情', component: HospitalDetail },
    { title: '别名库', component: Alias },
    { title: '经销商级别', component: Level },
    // { title: '经销商机构信息', component: InstitutionInfo },
    // { title: '经销商产品信息', component: ProductInfo },
    { title: '协议', component: DistributorContract },
  ];
  const detail = (record: any) => {
    const { category } = institutionCategory.Distributor;
    modalRef.current.params({
      visible: true,
      record,
      extMetadata: fields.extFields,
      auth: {
        add: dealerAliasAdd,
        del: dealerAliasDel,
      },
      category,
      detailFields: fields.detailFields,
      width: '60%',
    });
  };

  const reloadList = (msg: string) => {
    msg && message.success(msg);
    childRef.current.reload();
  };

  useEffect(() => {
    const request = async () => {
      await handleTag('Institution');
      const { fields, table, category } = institutionCategory.Distributor;
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
    const { category } = institutionCategory.Distributor;
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
        type="dealer"
        addFn={() => {
          setParams({});
          setHideAdd(false);
          setAddVisible(true);
        }}
        searchParams={searchParams}
        importPath={{
          institution: '/institution/distributor/institutionImport',
          alias: '/institution/distributor/aliasImport',
          level: '/institution/distributor/levelImport',
          update: '/institution/distributor/updateImport',
          contract: '/institution/distributor/contractImport', //
        }}
        downloadTemplate={{
          institution: downloadDistributorTemplate,
          alias: aliasTemplate,
          level: levelTemplate,
          contract: contractTemplate,
        }}
        exportExport={{
          institution: exportDistributorData,
          alias: exportAliasData,
          level: exportDistributorLevelData,
          contract: exportContractData,
        }}
      />
    );
  };

  if (Object.keys(searchParams).length === 0) return null;

  return (
    <>
      <ListTable
        code="t_mdm_institution_distributor"
        cRef={childRef}
        columns={[...fields.tableFields, ...columns]}
        getList={getDistributorList}
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
          type="Distributor"
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

export default Distributor;
