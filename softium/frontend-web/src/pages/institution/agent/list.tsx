import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  agentContractTemplate,
  agreeContractTemplate,
  aliasTemplate,
  downloadAgentTemplate,
  exportAgentContract,
  exportAgentData,
  exportAgreeContract,
  exportAliasData,
  getAgentList,
  getInstitutionConfig,
  updateAgent,
} from '@/services/institution';
import { message, Popconfirm } from 'antd';
import ListTable from '../list';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';
import { history } from '@@/core/history';
import { Columns } from '@/pages/institution/Institution';
import { institutionDel, updateState } from '@/pages/institution/util';
import { useAuth } from '@vulcan/utils';
import { InstitutionHeaderTitle } from '@/pages/institution/institutionCommon';
import InstitutionModal from '@/pages/institution/add';
import { handleColumns, handleTag } from '@/utils/utils';
import { institutionCategory } from '@/pages/institution/institutionCategory';

const AgentList: React.FC = () => {
  const childRef: any = useRef<any>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [hideAdd, setHideAdd] = useState<boolean>(false);
  const [params, setParams] = useState<any>({});
  const [institutionConfig, setInstitutionConfig] = useState<any>({});
  const agentDetail = useAuth('agentDetail');
  const agentEdit = useAuth('agentEdit');
  const agentState = useAuth('agentState');
  const agentDel = useAuth('agentDel');
  const [fields, setFields] = useState<any>({
    extFields: [],
    detailFields: [],
    allFields: [],
    formFields: [],
    tableFields: [],
  });
  const actionLen: number = [
    agentDetail,
    agentEdit,
    agentState,
    agentDel,
  ].filter((item: any) => item && item.menuId).length;

  const columns: Columns[] = [
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: actionLen * 50,
      hideInTable: !agentDetail && !agentEdit && !agentState && !agentDel,
      render: (text: ReactNode, record: any) => {
        const state: boolean = record.state.toLowerCase() === 'active';
        return (
          <div className="action-container">
            {agentDetail && (
              <span
                onClick={() => {
                  history.push({
                    pathname: `/institution/agent/detail/${record.id}`,
                    state: {
                      key: 1,
                    },
                  });
                }}
              >
                查看
              </span>
            )}
            {agentEdit && <span onClick={() => showAdd(record)}>编辑</span>}
            {agentState && (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  updateState(record, 'Agent', updateAgent, reloadList)
                }
                title={`您确定要设为${state ? '失效' : '生效'}吗？`}
                icon={<QuestionCircleOutlined />}
              >
                <span>{state ? '设为失效' : '设为生效'}</span>
              </Popconfirm>
            )}
            {agentDel && (
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

  const reloadList = (msg: string) => {
    msg && message.success(msg);
    childRef.current.reload();
  };

  useEffect(() => {
    const request = async () => {
      await handleTag('Institution');
      const { fields, table, category } = institutionCategory.Agent;
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
    const { category } = institutionCategory.Agent;
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
        type="agent"
        addFn={() => {
          setParams({});
          setHideAdd(false);
          setAddVisible(true);
        }}
        searchParams={searchParams}
        importPath={{
          institution: '/institution/agent/institutionImport',
          alias: '/institution/agent/aliasImport',
          update: '/institution/agent/updateImport',
          agentAgree: '/institution/agent/agentAgreeImport',
          agreeContract: '/institution/agent/agreeContractImport',
        }}
        downloadTemplate={{
          institution: downloadAgentTemplate,
          alias: aliasTemplate,
          agentAgree: agentContractTemplate,
          agreeContract: agreeContractTemplate,
        }}
        exportExport={{
          institution: exportAgentData,
          alias: exportAliasData,
          agentAgree: exportAgentContract,
          agreeContract: exportAgreeContract,
        }}
      />
    );
  };

  if (Object.keys(searchParams).length === 0) return null;

  return (
    <>
      <ListTable
        code="t_mdm_institution_agent"
        cRef={childRef}
        columns={[...fields.tableFields, ...columns]}
        getList={getAgentList}
        scrollX={3000}
        hideSelection={true}
        search={{ labelWidth: 120 }}
        params={{ searchErpCode: searchParams.searchErpCode }}
        beforeSearchSubmit={(params: any) => {
          if (params) {
            const newParams: any = JSON.parse(JSON.stringify(params));
            delete newParams.region;
            setSearchParams(newParams);
          }
        }}
        headerTitle={headerTitle}
      />
      {addVisible && (
        <InstitutionModal
          type="Agent"
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

export default AgentList;
