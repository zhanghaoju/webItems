import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Popconfirm, Select, Space, TreeSelect } from 'antd';
import { Table } from '@vulcan/utils';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  downloadProductTemplateQuery,
  getProductExportQuery,
  getProductMatchList,
  productMappingEffectivenessSetting,
} from '@/services/matchRelationManagement';
import { connect } from 'dva';
import { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import storage from '@/utils/storage';
import { history } from '@@/core/history';
import { downloadFile } from '@/utils/exportFile';

const { Option } = Select;
interface ProductMatchProps {
  ProductMatch: any;
  dispatch: any;
}

interface GithubIssueItem {
  id?: string;
  institutionCode?: string;
  institutionName?: string;
  originalProductName?: string;
  originalProductSpec?: string;
  standardProductCode?: string;
  standardProductName?: string;
  standardProductSpec?: string;
  disabled?: number;
}

const ProductMatch: React.FC<ProductMatchProps> = props => {
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
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: 100,
      fixed: 'left',
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: 240,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'originalProductName',
      valueType: 'text',
      ellipsis: true,
      width: 140,
    },
    {
      title: '原始产品规格',
      dataIndex: 'originalProductSpec',
      valueType: 'text',
      width: 150,
    },
    {
      title: '原始生产厂家',
      dataIndex: 'originalProducer',
      valueType: 'text',
      width: 150,
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      width: 150,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: 200,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      width: 200,
    },
    {
      title: '标准生产厂家',
      dataIndex: 'standardProducer',
      valueType: 'text',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      valueEnum: transformArray('disabledPocket', 'label', 'value'),
      hideInSearch: true,
      width: '5%',
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
      width: 70,
      fixed: 'right',
      render: (text, record, index) => [
        record.disabled === 0 ? (
          <Authorized code={'productMatchRe-lose'}>
            <Popconfirm
              onConfirm={() => setSingleProductMappingEffectiveness(record)}
              title={'确定失效此匹配记录?'}
            >
              <a type="link">失效</a>
            </Popconfirm>
          </Authorized>
        ) : (
          <Authorized code={'productMatchRe-open'}>
            <Popconfirm
              onConfirm={() => setSingleProductMappingEffectiveness(record)}
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
    downloadProductTemplateQuery().then((res: any) => {
      downloadFile(res);
    });
  };

  //导出
  const exportInstitution = () => {
    getProductExportQuery(searchParams).then((res: any) => {
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
  const setSingleProductMappingEffectiveness = (record: any) => {
    const params = [record];
    productMappingEffectivenessSetting(params).then((res: any) => {
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
  const setBatchProductMappingEffectiveness = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要操作的数据');
    } else {
      productMappingEffectivenessSetting(selectedRowData).then((res: any) => {
        if (res && res.success && res.success === true) {
          message.success('操作成功');
          actionRef?.current?.reload();
          setSelectedRowKeys([]);
        } else {
          message.warning('操作失败');
        }
      });
    }
  };

  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="matchRelation-productMatch"
            saveSearchValue
            columns={columns}
            tableAlertRender={false}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            sticky={true}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            scroll={{ x: 2600 }}
            actionRef={actionRef}
            rowSelection={{
              ...rowSelection,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            request={(params, sort, filter) => {
              return getProductMatchList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <Space>
                <Authorized code={'productMatchRe-down'}>
                  <Button type="primary" onClick={() => downLoadTemplate()}>
                    下载模板
                  </Button>
                </Authorized>
                {selectedRowKeys.length === 0 ? (
                  <Authorized code={'productMatchRe-batLose'}>
                    <Button
                      type="default"
                      onClick={() => setBatchProductMappingEffectiveness()}
                    >
                      批量失效
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'productMatchRe-batLose'}>
                    <Popconfirm
                      onConfirm={() => setBatchProductMappingEffectiveness()}
                      title={'确认失效选中数据吗？'}
                    >
                      <Button type="primary">批量失效</Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'productMatchRe-import'}>
                  <Button
                    type="default"
                    onClick={() =>
                      history.push(
                        '/dataWash/matchRelationManagement/productMatch/import',
                      )
                    }
                  >
                    导入
                  </Button>
                </Authorized>
                <Authorized code={'productMatchRe-export'}>
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

export default connect(({ dispatch, ProductMatch }: ProductMatchProps) => ({
  ProductMatch,
  dispatch,
}))(ProductMatch);
