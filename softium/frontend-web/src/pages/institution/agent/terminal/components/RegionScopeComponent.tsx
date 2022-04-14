import React, { useState, useRef, useEffect } from 'react';
import { ScopeProps } from '@/pages/institution/agent/Agent';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, TreeSelect } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddTerminalScopeDrawer from '@/pages/institution/agent/terminal/components/AddTerminalScopeDrawer';
import {
  getAgentScopeList,
  addAgentScope,
  deleteScope,
} from '@/services/agentScope';
import { ScopeDim } from '@/pages/institution/agent/terminal/enum';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';
import ProductDetail from '@/pages/institution/agent/terminal/components/ProductDetail';
import ExcludeComponent from '@/pages/institution/agent/terminal/components/ExcludeComponent';
import { history } from '@@/core/history';
import { exportScopeAgentQuota } from '@/services/agentQuota';
import { getTree } from '@/services/product/product';

export default (props: ScopeProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [productVisible, setProductVisible] = useState<boolean>(false);
  const [excludeVisible, setExcludeVisible] = useState<boolean>(false);
  const [excludeItem, setExcludeItem] = useState<any>({});
  const [record, setRecord] = useState<any>({});
  const [UI, updateUI] = useState<boolean>(false);
  const [productTree, setProductTree] = useState([]);
  const actionRef = useRef<any>();

  const loadData = (data: any) => {
    return data.map((item: any) => {
      return {
        title: item.name,
        value: item.id,
        children:
          (item.children &&
            item.children.length > 0 &&
            loadData(item.children)) ||
          [],
      };
    });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = () => {
    getTree().then(res => {
      updateUI(true);
      setProductTree(loadData(res.data || []));
    });
  };

  const regionColumns: ProColumns[] = [
    {
      title: '区域',
      dataIndex: 'region',
      search: false,
      render: (dom, entity) => {
        return [entity.province, entity.city, entity.county]
          .filter(item => item)
          .join('-');
      },
    },
    {
      title: '机构类型',
      dataIndex: 'institutionType',
      search: false,
      renderText: text => {
        return getNameByValue(
          getDictionaryBySystemCode('InstitutionCategory'),
          text,
        );
      },
    },
    {
      title: '产品层级',
      dataIndex: 'productLevelDim',
      search: false,
      renderText: text => {
        return getNameByValue(getDictionaryBySystemCode('ProductLevel'), text);
      },
    },
    {
      title: '产品',
      dataIndex: 'productCount',
      search: false,
      renderText: (text, record) => (
        <a
          onClick={() => {
            setRecord(record);
            setProductVisible(true);
          }}
        >
          {text || 0}
        </a>
      ),
    },
    {
      title: '排除',
      dataIndex: 'exceptionCount',
      search: false,
      renderText: (text, record) => (
        <a
          onClick={() => {
            setExcludeItem(record);
            setExcludeVisible(true);
          }}
        >
          {text || 0}
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      render: (dom, entity) => {
        return (
          <Space>
            <Popconfirm
              title="你确定要删除吗？"
              onConfirm={() => deleteScopeAction(entity)}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
    {
      title: '区域关键字',
      dataIndex: 'regionKeywords',
      hideInTable: true,
    },
    {
      title: '产品',
      dataIndex: 'productId',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <TreeSelect
            placeholder="请选择"
            treeData={productTree}
            showSearch
            filterTreeNode={(value: string, treeNode: any) => {
              return treeNode.title.indexOf(value) >= 0;
            }}
          />
        );
      },
    },
  ];

  const deleteScopeAction = (data: any) => {
    deleteScope(data).then(() => {
      message.success('成功');
      actionRef.current.reload();
    });
  };

  const onSubmit = (data: any) => {
    addAgentScope({
      ...data,
      contractId: props.contractId,
    }).then(() => {
      message.success('成功');
      setVisible(false);
      actionRef.current.reload();
    });
  };

  const indImport = () => {
    history.push({
      pathname: `${(props as any).location.pathname}/import`,
      query: {
        terminal: 'true',
        import: 'true',
        region: 'true',
      },
    });
  };

  const exportInd = () => {
    exportScopeAgentQuota();
  };

  if (!UI) return null;

  return (
    <>
      <ProTable
        form={{ autoComplete: 'off' }}
        columns={regionColumns}
        params={{
          scopeDim: ScopeDim.区域,
          contractId: props.contractId,
        }}
        actionRef={actionRef}
        rowKey={record =>
          record.provinceId +
          record.cityId +
          record.countyId +
          record.productLevelDim
        }
        request={(params, sort, filter) => {
          return getAgentScopeList({
            ...params,
            ...sort,
            ...filter,
          });
        }}
        headerTitle={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setVisible(true)}
            >
              添加
            </Button>
            <Button onClick={indImport}>导入销售指标</Button>
            <Button onClick={exportInd}>导出销售指标模板</Button>
          </Space>
        }
      />
      {visible && (
        <AddTerminalScopeDrawer
          visible={visible}
          onCancel={() => setVisible(false)}
          agentInfo={props.agentInfo}
          scopeDim={ScopeDim.区域}
          onSubmit={onSubmit}
        />
      )}
      {productVisible && (
        <ProductDetail
          visible={productVisible}
          onCancel={() => setProductVisible(false)}
          item={record}
          tableActionRef={actionRef}
        />
      )}
      {excludeVisible && (
        <ExcludeComponent
          visible={excludeVisible}
          onCancel={() => setExcludeVisible(false)}
          item={excludeItem}
          tableActionRef={actionRef}
        />
      )}
    </>
  );
};
