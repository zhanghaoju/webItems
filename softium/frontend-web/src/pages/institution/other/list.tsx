import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  aliasTemplate,
  downloadOtherTemplate,
  exportAliasData,
  exportOtherData,
  getInstitutionConfig,
  getOtherList,
  updateDistributor,
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
import { InstitutionHeaderTitle } from '@/pages/institution/institutionCommon';
import { handleColumns, handleTag } from '@/utils/utils';
import InstitutionModal from '@/pages/institution/add';
import { institutionCategory } from '@/pages/institution/institutionCategory';

const Other: React.FC = () => {
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
    allFields: [],
    formFields: [],
    tableFields: [],
  });
  const otherAliasAdd = useAuth('otherAliasAdd');
  const otherAliasDel = useAuth('otherAliasDel');
  const otherDetail = useAuth('otherDetail');
  const otherEdit = useAuth('otherEdit');
  const otherState = useAuth('otherState');
  const otherDel = useAuth('otherDel');
  const actionLen: number = [
    otherDetail,
    otherEdit,
    otherState,
    otherDel,
  ].filter((item: any) => item && item.menuId).length;

  const columns: Columns[] = [
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: actionLen * 50,
      hideInTable: !otherDetail && !otherEdit && !otherState && !otherDel,
      render: (text: ReactNode, record: any) => {
        const state: boolean = record.state.toLowerCase() === 'active';
        return (
          <div className="action-container">
            {otherDetail && <span onClick={() => detail(record)}>查看</span>}
            {otherEdit && <span onClick={() => showAdd(record)}>编辑</span>}
            {otherState && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  updateState(record, 'Other', updateDistributor, reloadList)
                }
                title={`您确定要设为${state ? '失效' : '生效'}吗？`}
                icon={<QuestionCircleOutlined />}
              >
                <span>{state ? '设为失效' : '设为生效'}</span>
              </Popconfirm>
            )}
            {otherDel && (
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
  ];
  const detail = (record: any) => {
    const { category } = institutionCategory.Other;
    modalRef.current.params({
      visible: true,
      record,
      extMetadata: fields.extFields,
      auth: {
        add: otherAliasAdd,
        del: otherAliasDel,
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
      const { fields, table, category } = institutionCategory.Other;
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

  const showAdd: any = (record: any = {}) => {
    const { category } = institutionCategory.Other;
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
        type="other"
        addFn={() => {
          setParams({});
          setHideAdd(false);
          setAddVisible(true);
        }}
        searchParams={searchParams}
        importPath={{
          institution: '/institution/other/institutionImport',
          alias: '/institution/other/aliasImport',
          update: '/institution/other/updateImport',
        }}
        downloadTemplate={{
          institution: downloadOtherTemplate,
          alias: aliasTemplate,
        }}
        exportExport={{
          institution: exportOtherData,
          alias: exportAliasData,
        }}
      />
    );
  };

  if (Object.keys(searchParams).length === 0) return null;

  return (
    <>
      <ListTable
        code="t_mdm_institution_other"
        cRef={childRef}
        columns={[...fields.tableFields, ...columns]}
        getList={getOtherList}
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
          type="Other"
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

export default Other;
