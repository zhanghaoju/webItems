import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Popconfirm, Select, Space, TreeSelect } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  downloadProductUnitTemplateQuery,
  getProductUnitExportQuery,
  getProductUnitMatchList,
  productUnitMappingEffectivenessSetting,
} from '@/services/matchRelationManagement';
import { connect } from 'dva';
import { transformArray } from '@/utils/transform';
import { Authorized, Table } from '@vulcan/utils';
import storage from '@/utils/storage';
import { history } from '@@/core/history';
import { downloadFile } from '@/utils/exportFile';

const { Option } = Select;
interface ProductUnitMatchProps {
  ProductUnitMatch: any;
  dispatch: any;
}

interface GithubIssueItem {
  id?: string;
  institutionCode?: string;
  institutionName?: string;
  standardProductCode?: string;
  standardProductName?: string;
  standardProductSpec?: string;
  originalUnit?: string;
  standardUnit?: string;
  originalRatio?: string;
  mathMapping?: string;
  disabled?: number;
}

const ProductUnitMatch: React.FC<ProductUnitMatchProps> = props => {
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
      fixed: 'left',
      width: 150,
      ellipsis: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: 240,
      ellipsis: true,
    },
    {
      title: '产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
    },
    {
      title: '产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
    },
    {
      title: '产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '生产厂家',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始单位',
      dataIndex: 'originalUnit',
      valueType: 'text',
    },
    {
      title: '标准单位',
      dataIndex: 'standardUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '原始单位系数',
    //   dataIndex: 'originalRatio',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   ellipsis: true,
    // },
    // {
    //   title: '标准单位系数',
    //   dataIndex: 'standardRatio',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   ellipsis: true,
    // },
    {
      title: '换算关系',
      dataIndex: 'mathMapping',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: 200,
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
      fixed: 'right',
      width: 90,
      render: (text, record, index) => [
        record.disabled === 0 ? (
          <Authorized code={'unitMatchRe-lose'}>
            <Popconfirm
              onConfirm={() => setSingleProductUnitMappingEffectiveness(record)}
              title={'确定失效此匹配记录?'}
            >
              <a type="link">失效</a>
            </Popconfirm>
          </Authorized>
        ) : (
          <Authorized code={'unitMatchRe-open'}>
            <Popconfirm
              onConfirm={() => setSingleProductUnitMappingEffectiveness(record)}
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
    downloadProductUnitTemplateQuery().then((res: any) => {
      downloadFile(res);
    });
  };

  //导出
  const exportInstitution = () => {
    getProductUnitExportQuery(searchParams).then((res: any) => {
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
  const setSingleProductUnitMappingEffectiveness = (record: any) => {
    const params = [record];
    productUnitMappingEffectivenessSetting(params).then((res: any) => {
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
  const setBatchProductUnitMappingEffectiveness = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要操作的数据');
    } else {
      productUnitMappingEffectivenessSetting(selectedRowData).then(
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
            code="matchRelation-productUnitMatch"
            saveSearchValue
            tableAlertRender={false}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            sticky
            scroll={{ x: 2300 }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getProductUnitMatchList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
            rowSelection={{
              ...rowSelection,
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <Space>
                <Authorized code={'unitMatchRe-down'}>
                  <Button type="primary" onClick={() => downLoadTemplate()}>
                    下载模板
                  </Button>
                </Authorized>
                {selectedRowKeys.length === 0 ? (
                  <Authorized code={'unitMatchRe-batLose'}>
                    <Button
                      type="default"
                      onClick={() => setBatchProductUnitMappingEffectiveness()}
                    >
                      批量失效
                    </Button>
                  </Authorized>
                ) : (
                  <Authorized code={'unitMatchRe-batLose'}>
                    <Popconfirm
                      onConfirm={() =>
                        setBatchProductUnitMappingEffectiveness()
                      }
                      title={'确认失效选中数据吗？'}
                    >
                      <Button type="primary">批量失效</Button>
                    </Popconfirm>
                  </Authorized>
                )}
                <Authorized code={'unitMatchRe-import'}>
                  <Button
                    type="default"
                    onClick={() =>
                      history.push(
                        '/dataWash/matchRelationManagement/productUnitMatch/Import',
                      )
                    }
                  >
                    导入
                  </Button>
                </Authorized>
                <Authorized code={'unitMatchRe-export'}>
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
  ({ dispatch, ProductUnitMatch }: ProductUnitMatchProps) => ({
    ProductUnitMatch,
    dispatch,
  }),
)(ProductUnitMatch);
