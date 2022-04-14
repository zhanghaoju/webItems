import React, { useState } from 'react';
import { Authorized, useAuth, VulcanFile } from '@vulcan/utils';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import { useRequest } from '@@/plugin-request/request';
import { exportObj } from '@/pages/institution/util';

const goToPage = (path: string) => {
  history.push(path);
};

const Import = (props: any) => {
  const { type, importPath } = props;
  const institutionImport = useAuth(`${type}Import`);
  const aliasImport = useAuth(`${type}AliasImport`);
  const subInstitutionImport = useAuth(`${type}SubInstitutionImport`);
  const levelImport = useAuth(`${type}LevelImport`);
  const updateImport = useAuth(`${type}UpdateImport`);
  const contractImport = useAuth(`${type}ContractImport`);
  const agentAgreeImport = useAuth(`${type}AgreeImport`);
  const agreeContractImport = useAuth(`${type}AgreeContractImport`);

  return (
    <Dropdown
      className="btn-item"
      overlay={
        <Menu>
          {institutionImport && (
            <Menu.Item onClick={() => goToPage(importPath.institution)}>
              机构导入
            </Menu.Item>
          )}
          {aliasImport && (
            <Menu.Item onClick={() => goToPage(importPath.alias)}>
              别名导入
            </Menu.Item>
          )}
          {((type == 'hospital' && subInstitutionImport) ||
            (type == 'pharmacy' && subInstitutionImport)) && (
            <Menu.Item onClick={() => goToPage(importPath.subInstitution)}>
              下级机构导入
            </Menu.Item>
          )}
          {type == 'dealer' && levelImport && (
            <Menu.Item onClick={() => goToPage(importPath.level)}>
              级别导入
            </Menu.Item>
          )}
          {updateImport && (
            <Menu.Item onClick={() => goToPage(importPath.update)}>
              更新机构导入
            </Menu.Item>
          )}
          {contractImport && (
            <Menu.Item onClick={() => goToPage(importPath.contract)}>
              经销商协议导入
            </Menu.Item>
          )}
          {type == 'agent' && agentAgreeImport && (
            <Menu.Item onClick={() => goToPage(importPath.agentAgree)}>
              代理商协议导入
            </Menu.Item>
          )}
          {type == 'agent' && agreeContractImport && (
            <Menu.Item onClick={() => goToPage(importPath.agreeContract)}>
              协议配送商导入
            </Menu.Item>
          )}
        </Menu>
      }
    >
      <Button>
        导入 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

const Template = (props: any) => {
  const { type, downloadTemplate, category } = props;
  const template = useAuth(`${type}Template`);
  const aliasTemplate = useAuth(`${type}AliasTemplate`);
  const levelTemplate = useAuth(`${type}LevelTemplate`);
  const contractTemplate = useAuth(`${type}ContractTemplate`);
  const agentAgreeTemplate = useAuth(`${type}AgreeTemplate`);
  const agreeContractTemplate = useAuth(`${type}AgreeContractTemplate`);
  const downloadTmp = useRequest(downloadTemplate.institution, exportObj);
  const downloadAliasTmp = useRequest(downloadTemplate.alias, exportObj);
  const downloadLevel = useRequest(downloadTemplate.level, exportObj);
  const downloadContract = useRequest(downloadTemplate.contract, exportObj);
  const downloadAgentAgree = useRequest(downloadTemplate.agentAgree, exportObj);
  const downloadAgreeContract = useRequest(
    downloadTemplate.agreeContract,
    exportObj,
  );

  return (
    <Dropdown
      className="btn-item"
      overlay={
        <Menu>
          {template && (
            <Menu.Item
              onClick={() => downloadTmp.run({ category: category[type] })}
            >
              机构模板
            </Menu.Item>
          )}
          {aliasTemplate && (
            <Menu.Item
              onClick={() => downloadAliasTmp.run({ category: category[type] })}
            >
              别名模板
            </Menu.Item>
          )}
          {type == 'dealer' && levelTemplate && (
            <Menu.Item
              onClick={() => downloadLevel.run({ category: category[type] })}
            >
              级别模板
            </Menu.Item>
          )}
          {contractTemplate && (
            <Menu.Item
              onClick={() => downloadContract.run({ category: category[type] })}
            >
              经销商协议模板
            </Menu.Item>
          )}
          {type == 'agent' && agentAgreeTemplate && (
            <Menu.Item
              onClick={() =>
                downloadAgentAgree.run({ category: category[type] })
              }
            >
              代理商协议模板
            </Menu.Item>
          )}
          {type == 'agent' && agreeContractTemplate && (
            <Menu.Item
              onClick={() =>
                downloadAgreeContract.run({ category: category[type] })
              }
            >
              协议配送商模板
            </Menu.Item>
          )}
        </Menu>
      }
    >
      <Button>
        下载模板 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

const Export = (props: any) => {
  const { type, searchParams, category, exportExport } = props;
  const [initLoading, setLoading] = useState(false);
  const exportData = useAuth(`${type}Export`);
  const aliasExport = useAuth(`${type}AliasExport`);
  const levelExport = useAuth(`${type}LevelExport`);
  const contractExport = useAuth(`${type}ContractExport`);
  const agentAgreeExport = useAuth(`${type}AgreeExport`);
  const agreeContractExport = useAuth(`${type}AgreeContractExport`);

  const exportInstitution = useRequest(exportExport.institution, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  const exportAliasInstitution = useRequest(exportExport.alias, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  const exportLevel = useRequest(exportExport.level, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  const exportContract = useRequest(exportExport.contract, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  const exportAgentAgree = useRequest(exportExport.agentAgree, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  const exportAgreeContract = useRequest(exportExport.agreeContract, {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => {
      setLoading(false);
      VulcanFile.export(res);
    },
  });

  return (
    <Dropdown
      className="btn-item"
      overlay={
        <Menu>
          {exportData ? (
            <Menu.Item
              onClick={() => {
                setLoading(true);
                exportInstitution.run(searchParams || {});
              }}
            >
              机构导出
            </Menu.Item>
          ) : null}
          {aliasExport ? (
            <Menu.Item
              onClick={() => {
                setLoading(true);
                exportAliasInstitution.run({
                  institutionCategory: category[type],
                  ...searchParams,
                });
              }}
            >
              别名导出
            </Menu.Item>
          ) : null}
          {type == 'dealer' && levelExport ? (
            <Menu.Item
              onClick={() => {
                setLoading(true);
                exportLevel.run(searchParams);
              }}
            >
              级别导出
            </Menu.Item>
          ) : null}
          {contractExport ? (
            <Menu.Item
              onClick={() => {
                setLoading(true);
                exportContract.run(searchParams);
              }}
            >
              经销商协议导出
            </Menu.Item>
          ) : null}
          {type == 'agent' && agentAgreeExport && (
            <Menu.Item
              onClick={() => {
                setLoading(true);
                exportAgentAgree.run(searchParams);
              }}
            >
              代理商协议导出
            </Menu.Item>
          )}
          {type == 'agent' && agreeContractExport && (
            <Menu.Item
              onClick={() => {
                setLoading(true);
                exportAgreeContract.run(searchParams);
              }}
            >
              协议配送商导出
            </Menu.Item>
          )}
        </Menu>
      }
    >
      <Button loading={initLoading}>
        导出 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

const InstitutionHeaderTitle = (props: any) => {
  const {
    type,
    addFn,
    exportExport,
    downloadTemplate,
    importPath,
    searchParams,
  } = props;
  const institutionImport = useAuth(`${type}Import`);
  const aliasImport = useAuth(`${type}AliasImport`);
  const levelImport = useAuth(`${type}LevelImport`);
  const updateImport = useAuth(`${type}UpdateImport`);
  const contractImport = useAuth(`${type}ContractImport`);
  const exportData = useAuth(`${type}Export`);
  const aliasExport = useAuth(`${type}AliasExport`);
  const levelExport = useAuth(`${type}LevelExport`);
  const contractExport = useAuth(`${type}ContractExport`);
  const template = useAuth(`${type}Template`);
  const aliasTemplate = useAuth(`${type}AliasTemplate`);
  const levelTemplate = useAuth(`${type}LevelTemplate`);
  const contractTemplate = useAuth(`${type}ContractTemplate`);

  const category: any = {
    hospital: 'HealthCare',
    pharmacy: 'Pharmacy',
    agent: 'Agent',
    other: 'Other',
    dealer: 'Distributor',
  };

  return (
    <div className="btn-container">
      <Authorized code={`${type}Add`}>
        <Button
          className="btn-item"
          key="add"
          type="primary"
          onClick={() => addFn && addFn()}
        >
          <PlusOutlined />
          添加
        </Button>
      </Authorized>
      {institutionImport ||
      aliasImport ||
      updateImport ||
      (type === 'dealer' && levelImport) ||
      (type === 'dealer' && contractImport) ? (
        <Import type={type} importPath={importPath} />
      ) : null}
      {aliasExport ||
      exportData ||
      (type === 'dealer' && levelExport) ||
      (type === 'dealer' && contractExport) ? (
        <Export
          type={type}
          category={category}
          searchParams={searchParams}
          exportExport={exportExport}
        />
      ) : null}
      {template ||
      aliasTemplate ||
      (type === 'dealer' && levelTemplate) ||
      (type === 'dealer' && contractTemplate) ? (
        <Template
          type={type}
          downloadTemplate={downloadTemplate}
          category={category}
        />
      ) : null}
    </div>
  );
};

export { InstitutionHeaderTitle };
