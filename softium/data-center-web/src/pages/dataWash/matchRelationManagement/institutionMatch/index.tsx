import React, { useState, useRef, useEffect } from 'react';
import { Button, Popconfirm, Select, Space, message } from 'antd';
import { Table } from '@vulcan/utils';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getInstitutionMatchList,
  downLoadTemplateQuery,
  getExportQuery,
  institutionMappingEffectivenessSetting,
} from '@/services/matchRelationManagement';
import request from 'umi-request';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import { downloadFile } from '@/utils/exportFile.ts';
import { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';

const { Option } = Select;
interface InstitutionMatchProps {
  InstitutionMatch: any;
  dispatch: any;
}

interface GithubIssueItem {
  id?: string;
  institutionCode?: string;
  institutionName?: string;
  institutionProvince?: string;
  institutionCity?: string;
  originalInstitutionName?: string;
  standardInstitutionCode?: string;
  standardInstitutionName?: string;
  standardInstitutionProvince?: string;
  standardInstitutionCity?: string;
  disabled?: number;
}

const InstitutionMatch: React.FC<InstitutionMatchProps> = props => {
  const disabledPocket = storage.get('pocketData').disabledPocket;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '数据id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      width: '30%',
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      ellipsis: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: 240,
    },
    {
      title: '经销商省份',
      dataIndex: 'institutionProvince',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '经销商城市',
      dataIndex: 'institutionCity',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '原始机构名称',
      dataIndex: 'originalInstitutionName',
      valueType: 'text',
      width: 240,
    },
    {
      title: '标准机构编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      width: 100,
    },
    {
      title: '标准机构名称',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      width: 240,
    },
    {
      title: '标准机构省份',
      dataIndex: 'standardInstitutionProvince',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '标准机构城市',
      dataIndex: 'standardInstitutionCity',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      valueEnum: transformArray('disabledPocket', 'label', 'value'),
      hideInSearch: true,
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(disabledPocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      valueType: 'option',
      hideInSearch: true,
      fixed: 'right',
      width: 60,
      render: (text, record, index) => [
        record.disabled === 0 ? (
          <Authorized code={'institutionMatchRe-lose'}>
            <Popconfirm
              onConfirm={() => setSingleInstitutionMappingEffectiveness(record)}
              title={'确定失效此匹配记录?'}
            >
              <a type="link">失效</a>
            </Popconfirm>
          </Authorized>
        ) : (
          <Authorized code={'institutionMatchRe-open'}>
            <Popconfirm
              onConfirm={() => setSingleInstitutionMappingEffectiveness(record)}
              title={'确定生效此匹配记录'}
            >
              <a type="link">生效</a>
            </Popconfirm>
          </Authorized>
        ),
      ],
    },
  ];

  //下载模板
  const downLoadTemplate = () => {
    downLoadTemplateQuery().then((res: any) => {
      downloadFile(res);
    });
  };

  //导出
  const exportInstitution = () => {
    getExportQuery(searchParams).then((res: any) => {
      downloadFile(res);
    });
  };

  //批量失效row设置
  const rowSelection = {
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.disabled === 1,
      };
    },
  };

  //单个生效失效
  const setSingleInstitutionMappingEffectiveness = (record: any) => {
    const params = [record];
    institutionMappingEffectivenessSetting(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('操作成功');
        actionRef?.current?.reload();
        setSelectedRowKeys([]);
      } else {
        message.warning('操作失败');
      }
    });
  };

  //批量失效
  const setBatchInstitutionMappingEffectiveness = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要操作的数据');
    } else {
      institutionMappingEffectivenessSetting(selectedRowData).then(
        (res: any) => {
          if (res && res.success && res.success === true) {
            message.success('操作成功');
            actionRef?.current?.reload();
            setSelectedRowKeys([]);
          } else {
            message.warning('操作失败');
          }
        },
      );
    }
  };

  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="matchRelation-institutionMatch"
            saveSearchValue
            tableAlertRender={false}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            rowSelection={{
              ...rowSelection,
            }}
            sticky={true}
            scroll={{ x: 2500 }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getInstitutionMatchList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <Space>
                <Authorized code={'institutionMatchRe-down'}>
                  <Button type="primary" onClick={() => downLoadTemplate()}>
                    下载模板
                  </Button>
                </Authorized>
                {selectedRowKeys.length === 0 ? (
                  <Authorized code={'institutionMatchRe-batLose'}>
                    <Button
                      type="default"
                      onClick={() => setBatchInstitutionMappingEffectiveness()}
                    >
                      批量失效
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'institutionMatchRe-batLose'}>
                    <Popconfirm
                      onConfirm={() =>
                        setBatchInstitutionMappingEffectiveness()
                      }
                      title={'确认失效选中数据吗？'}
                    >
                      <Button type="primary">批量失效</Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'institutionMatchRe-import'}>
                  <Button
                    type="default"
                    onClick={() =>
                      history.push(
                        '/dataWash/matchRelationManagement/institutionMatch/import',
                      )
                    }
                  >
                    导入
                  </Button>
                </Authorized>
                <Authorized code={'institutionMatchRe-export'}>
                  <TableDropdown
                    key={'more'}
                    menus={[
                      {
                        key: 'export',
                        name: (
                          <span
                            onClick={() => {
                              exportInstitution();
                            }}
                          >
                            导出
                          </span>
                        ),
                      },
                    ]}
                  />
                </Authorized>
              </Space>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, InstitutionMatch }: InstitutionMatchProps) => ({
    InstitutionMatch,
    dispatch,
  }),
)(InstitutionMatch);
