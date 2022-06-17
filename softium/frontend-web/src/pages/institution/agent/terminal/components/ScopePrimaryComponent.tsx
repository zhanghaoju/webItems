import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { ScopePrimaryComponentProps } from '@/pages/institution/agent/Agent';
import { areaDimEnum, ScopeDim } from '@/pages/institution/agent/terminal/enum';
import {
  Row,
  Col,
  Form,
  TreeSelect,
  Select,
  Switch,
  Table,
  Popconfirm,
  Cascader,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  getDictionaryBySystemCode,
  getNameByValue,
  findTreePath,
} from '@/utils/dataConversion';
import '../styles/scopePrimary.less';
import {
  getInstitutionList,
  getPrimaryProductList,
  getProductList,
} from '@/services/agentScope';
import _ from 'lodash';

export default forwardRef(
  (props: ScopePrimaryComponentProps, ref: React.Ref<any>) => {
    const { agentInfo, levelInfo, isExclude } = props;
    const [institutionSelectedKeys, setInstitutionSelectedKeys] = useState([]);
    const [switchChecked, setSwitchChecked] = useState(false);
    const [productSelected, setProductSelected] = useState([]);
    const [productSelectedKeys, setProductSelectedKeys] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [scopeList, setScopeList] = useState([]);
    const [region, setRegion] = useState([]);
    const [institutionTypeList, setInstitutionTypeList] = useState([]);

    useImperativeHandle(ref, () => ({
      scopeList,
    }));

    const loopData = (data: any, hierarchy: number = 1) => {
      return data.map((item: any) => {
        const leaf =
          (levelInfo?.areaDim === areaDimEnum.省份 && hierarchy === 1) ||
          (levelInfo?.areaDim === areaDimEnum.城市 && hierarchy === 2) ||
          (levelInfo?.areaDim === areaDimEnum.区县 && hierarchy === 3) ||
          !item.childDictionaryId;
        return {
          ...item,
          title: item.name,
          key: item.value,
          isLeaf: leaf,
          checkable: leaf,
          selectable: leaf,
          children: loopData(item.children || [], hierarchy + 1),
        };
      });
    };

    const treeSelectChange = (value: any) => {
      setRegion(value);
    };

    const institutionTypeChange = (value: any) => {
      setInstitutionTypeList(value);
    };

    const switchChange = (checked: boolean) => {
      setSwitchChecked(checked);
    };

    const productTableChange = (selectedRowKeys: any, selectedRows: any) => {
      setProductSelectedKeys(selectedRowKeys);
      setProductSelected(selectedRows);
    };

    const joinActionState = () => {
      if (!isExclude && levelInfo?.scopeDim === ScopeDim.区域) {
        return (
          region.length > 0 &&
          institutionTypeList.length > 0 &&
          (switchChecked || productSelected.length > 0)
        );
      }
      return (
        institutionSelected.length > 0 &&
        (switchChecked || productSelected.length > 0)
      );
    };

    const onCancelSelected = () => {
      setSwitchChecked(false);
      setRegion([]);
      setInstitutionTypeList([]);
      setInstitutionSelected([]);
      setInstitutionSelectedKeys([]);
      setProductSelected([]);
      setProductSelectedKeys([]);
    };

    const onJoinAction = () => {
      if (joinActionState()) {
        !isExclude && levelInfo?.scopeDim === ScopeDim.区域
          ? structureRegionScopeData()
          : structureInstitutionScopeData();
      }
    };

    const structureRegionScopeData = () => {
      const regionTree = getDictionaryBySystemCode('Region');
      const productList = switchChecked
        ? [{ name: '全部', id: 'All' }]
        : productSelected;
      const newScopeList: any = [];
      region.forEach((region: any) => {
        const treePath = findTreePath(regionTree, region.value, []);
        institutionTypeList.forEach((institutionType: any) => {
          productList.forEach((product: any) => {
            const regionItem =
              levelInfo?.areaDim === areaDimEnum.省份
                ? {
                    provinceId: treePath[0].value,
                    province: treePath[0].name,
                  }
                : levelInfo?.areaDim === areaDimEnum.城市
                ? {
                    provinceId: treePath[0].value,
                    province: treePath[0].name,
                    cityId: treePath[1].value,
                    city: treePath[1].name,
                  }
                : {
                    provinceId: treePath[0].value,
                    province: treePath[0].name,
                    cityId: treePath[1].value,
                    city: treePath[1].name,
                    countyId: treePath[2].value,
                    county: treePath[2].name,
                  };
            const item: any = {
              institutionType: institutionType.value,
              institutionTypeName: institutionType.label,
              ...regionItem,
              productId: product.id,
              productName: product.name,
              specification: product.specification,
              productLevelDim: levelInfo?.productLevelDim,
              levelId: levelInfo?.levelId,
              nodeCode: levelInfo?.nodeCode,
              referringPeriodId: levelInfo?.referringPeriodId,
              salesMan: levelInfo?.salesMan,
              nodeName: levelInfo?.nodeName,
              nodeStaffName: levelInfo?.nodeStaffName,
            };
            _.findIndex(scopeList, item) < 0 && newScopeList.push(item);
          });
        });
      });
      setScopeList(preState => {
        return preState.concat(newScopeList);
      });
      onCancelSelected();
    };

    const structureInstitutionScopeData = () => {
      const productList = switchChecked
        ? [{ name: '全部', id: 'All' }]
        : productSelected;
      const newScopeList: any = [];
      institutionSelected.forEach((institution: any) => {
        productList.forEach((product: any) => {
          const item: any = {
            institutionId: institution.id,
            institutionName: institution.name,
            institutionType: institution.type,
            productId: product.id,
            productName: product.name,
            specification: product.specification,
            productLevelDim: levelInfo?.productLevelDim,
            levelId: levelInfo?.levelId,
            nodeCode: levelInfo?.nodeCode,
            referringPeriodId: levelInfo?.referringPeriodId,
            salesMan: levelInfo?.salesMan,
            nodeName: levelInfo?.nodeName,
            nodeStaffName: levelInfo?.nodeStaffName,
          };
          _.findIndex(scopeList, item) < 0 && newScopeList.push(item);
        });
      });
      setScopeList(preState => {
        return preState.concat(newScopeList);
      });
      onCancelSelected();
    };

    const institutionTableChange = (selectRowKeys: any, selectedRows: any) => {
      setInstitutionSelectedKeys(selectRowKeys);
      setInstitutionSelected(selectedRows);
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const productColumns: ProColumns<any>[] = [
      {
        title: '产品',
        dataIndex: 'name',
        search: false,
        renderText: (text, record) => {
          return `${text}${(record.specification &&
            `(${record.specification})`) ||
            ''}`;
        },
      },
      {
        title: '关键词',
        dataIndex: 'keyWords',
        hideInTable: true,
      },
    ];

    const specificationProductColumns: ProColumns<any>[] = [
      {
        title: '产品',
        dataIndex: 'name',
        search: false,
      },
      {
        title: '品规',
        dataIndex: 'specification',
        search: false,
      },
      {
        title: '关键词',
        dataIndex: 'keyWords',
        hideInTable: true,
      },
    ];

    const resultRegionColumns = [
      {
        title: '区域',
        dataIndex: 'region',
        render: (text: string, record: any) => {
          const region = [record.province, record.city, record.county];
          return region.filter(item => item).join('-');
        },
      },
      {
        title: '机构类型',
        dataIndex: 'institutionTypeName',
      },
      {
        title: '产品层级',
        dataIndex: 'productLevelDim',
        render: (text: string) => {
          return getNameByValue(
            getDictionaryBySystemCode('ProductLevel'),
            text,
          );
        },
      },
      {
        title: '产品',
        dataIndex: 'productName',
        render: (text: string, record: any) => {
          return `${text}${(record.specification &&
            `(${record.specification})`) ||
            ''}`;
        },
      },
      {
        title: '辖区',
        dataIndex: 'nodeName',
        render: (text: any, record1: any) => {
          return text && `${text}（${record1.nodeStaffName || '-'}）`;
        },
      },
      {
        title: '业务员',
        dataIndex: 'salesMan',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text: string, record: any) => {
          return (
            <Popconfirm
              title="你确定要删除吗？"
              onConfirm={() => deleteRegionClick(record)}
            >
              <a>删除</a>
            </Popconfirm>
          );
        },
      },
    ];

    const resultInstitutionColumns = [
      {
        title: '机构',
        dataIndex: 'institutionName',
      },
      {
        title: '产品层级',
        dataIndex: 'productLevelDim',
        render: (text: string) => {
          return getNameByValue(
            getDictionaryBySystemCode('ProductLevel'),
            text,
          );
        },
      },
      {
        title: '产品',
        dataIndex: 'productName',
        render: (text: string, record: any) => {
          return `${text}${(record.specification &&
            `(${record.specification})`) ||
            ''}`;
        },
      },
      {
        title: '辖区',
        dataIndex: 'nodeName',
        render: (text: any, record1: any) => {
          return text && `${text}（${record1.nodeStaffName || '-'}）`;
        },
      },
      {
        title: '业务员',
        dataIndex: 'salesMan',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text: string, record: any) => {
          return (
            <Popconfirm
              title="你确定要删除吗？"
              onConfirm={() => deleteRegionClick(record)}
            >
              <a>删除</a>
            </Popconfirm>
          );
        },
      },
    ];

    const deleteRegionClick = (record: any) => {
      const index = _.findIndex(scopeList, record);
      setScopeList(prevState => {
        const oldState = _.cloneDeep(prevState);
        oldState.splice(index, 1);
        return oldState;
      });
    };

    const cascaderOptions = (data: any) => {
      return data.map((item: any) => ({
        ...item,
        label: item.name,
        children: cascaderOptions(item.children || []),
      }));
    };

    const institutionColumns = (): ProColumns<any>[] => {
      const columns: ProColumns<any>[] = [
        {
          title: '机构',
          dataIndex: 'name',
          search: false,
        },
        {
          title: '关键词',
          dataIndex: 'likeField',
          hideInTable: true,
        },
        {
          title: '区域',
          dataIndex: 'region',
          hideInTable: true,
          renderFormItem: () => {
            return (
              <Cascader
                options={cascaderOptions(
                  getDictionaryBySystemCode('Region') || [],
                )}
                changeOnSelect
              />
            );
          },
        },
        {
          title: '机构类型',
          dataIndex: 'type',
          hideInTable: true,
          renderFormItem: () => {
            return (
              <Select placeholder="请选择">
                {(getDictionaryBySystemCode('InstitutionCategory') || [])
                  .filter(
                    (item: any) =>
                      (levelInfo?.institutionTypeDims || []).indexOf(
                        item.value,
                      ) >= 0,
                  )
                  .map((item: any) => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            );
          },
        },
      ];

      return columns;
    };

    return (
      <>
        <h2>
          <strong>预选负责终端</strong>
        </h2>
        <div className="primary-selected-info">
          <div>
            已选择{' '}
            {(isExclude || levelInfo?.scopeDim === ScopeDim.机构) &&
              `${institutionSelectedKeys.length} 项机构，`}
            {`${switchChecked ? '全部' : productSelected.length}`} 项产品
          </div>
          <div>
            {joinActionState() && (
              <a style={{ marginRight: '30px' }} onClick={onCancelSelected}>
                取消选择
              </a>
            )}
            <a
              className={
                (!joinActionState() &&
                  'primary-selected-info-action-disabled') ||
                ''
              }
              onClick={onJoinAction}
            >
              加入预选
            </a>
          </div>
        </div>
        <Row style={{ marginBottom: '20px', marginTop: '20px' }}>
          <Col span={12}>
            {!isExclude && levelInfo?.scopeDim === ScopeDim.区域 && (
              <div>
                <Form.Item {...formItemLayout} label="区域">
                  <TreeSelect
                    treeDataSimpleMode={true}
                    placeholder="请选择"
                    treeData={loopData(
                      getDictionaryBySystemCode('Region') || [],
                    )}
                    treeCheckable={true}
                    maxTagCount={3}
                    allowClear={true}
                    labelInValue={true}
                    onChange={treeSelectChange}
                    value={region}
                    treeCheckStrictly
                  />
                </Form.Item>
                <Form.Item {...formItemLayout} label="机构类型">
                  <Select
                    placeholder="请选择"
                    mode="multiple"
                    labelInValue={true}
                    onChange={institutionTypeChange}
                    value={institutionTypeList}
                  >
                    {(getDictionaryBySystemCode('InstitutionCategory') || [])
                      .filter(
                        (item: any) =>
                          (levelInfo?.institutionTypeDims || []).indexOf(
                            item.value,
                          ) >= 0,
                      )
                      .map((item: any) => {
                        return (
                          <Select.Option value={item.value} key={item.value}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </div>
            )}
            {(isExclude || levelInfo?.scopeDim === ScopeDim.机构) && (
              <ProTable<any>
                form={{ autoComplete: 'off' }}
                columns={institutionColumns()}
                request={(params, sort, filter) => {
                  const { region, type, likeField, ...other } = params as any;
                  return getInstitutionList({
                    ...other,
                    provinceId: levelInfo?.provinceId
                      ? levelInfo.provinceId
                      : (region && region[0]) || null,
                    cityId: levelInfo?.cityId
                      ? levelInfo.cityId
                      : (region && region[1]) || null,
                    countyId: levelInfo?.countyId
                      ? levelInfo.countyId
                      : (region && region[2]) || null,
                    type: type
                      ? [type]
                      : levelInfo?.institutionType
                      ? [levelInfo.institutionType]
                      : levelInfo?.institutionTypeDims || [],
                    likeField: !likeField ? null : [likeField],
                    ...sort,
                    ...filter,
                    state: 'Active',
                  });
                }}
                search={{
                  span: 24,
                }}
                scroll={{
                  y: 400,
                }}
                rowSelection={{
                  fixed: true,
                  selections: true,
                  onChange: institutionTableChange,
                  selectedRowKeys: institutionSelectedKeys,
                }}
                postData={(data: any) => {
                  return data.list;
                }}
                tableAlertRender={false}
                rowKey="id"
              />
            )}
          </Col>
          <Col span={12}>
            {!isExclude && (
              <p
                style={{
                  padding: '0 60px',
                  margin: 0,
                  marginTop: '15px',
                  lineHeight: 1,
                }}
              >
                全产品
                <Switch
                  style={{ marginLeft: '15px' }}
                  onChange={switchChange}
                  checked={switchChecked}
                />
              </p>
            )}
            {!switchChecked && (
              <ProTable<any>
                form={{ autoComplete: 'off' }}
                columns={
                  isExclude ? specificationProductColumns : productColumns
                }
                params={
                  isExclude
                    ? {
                        ...levelInfo,
                      }
                    : {
                        level: levelInfo?.productLevelDim,
                      }
                }
                request={(params, sort, filter) => {
                  return isExclude
                    ? getPrimaryProductList({
                        ...params,
                        ...sort,
                        ...filter,
                      })
                    : getProductList({
                        ...params,
                        ...sort,
                        ...filter,
                        state: 'Active',
                      });
                }}
                postData={(data: any) => (_.isArray(data) ? data : data.list)}
                search={{
                  span: 24,
                }}
                scroll={{
                  y: 400,
                }}
                rowSelection={{
                  fixed: true,
                  selections: true,
                  onChange: productTableChange,
                  selectedRowKeys: productSelectedKeys,
                }}
                tableAlertRender={false}
                rowKey="id"
              />
            )}
          </Col>
        </Row>
        <h2>
          <strong>预选负责终端展示</strong>
        </h2>
        <Table
          columns={
            !isExclude && levelInfo?.scopeDim === ScopeDim.区域
              ? resultRegionColumns
              : resultInstitutionColumns
          }
          dataSource={scopeList}
        />
      </>
    );
  },
);
