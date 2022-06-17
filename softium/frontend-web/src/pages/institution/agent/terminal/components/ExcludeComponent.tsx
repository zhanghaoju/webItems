import React, { useState, useRef } from 'react';
import {
  Button,
  Descriptions,
  Drawer,
  message,
  Modal,
  Popconfirm,
  Space,
} from 'antd';
import { ExcludeDetailProps } from '@/pages/institution/agent/Agent';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ScopePrimaryComponent from '@/pages/institution/agent/terminal/components/ScopePrimaryComponent';
import {
  addPrimaryExclude,
  getExcludeList,
  deleteExclude,
  getExcludeProductList,
  getPrimaryProductList,
  deleteExcludeProduct,
} from '@/services/agentScope';
import _ from 'lodash';

export default (props: ExcludeDetailProps) => {
  const { visible, onCancel, item, tableActionRef } = props;
  const [scopeVisible, setScopeVisible] = useState<boolean>(false);
  const [productVisible, setProductVisible] = useState<boolean>(false);
  const [excludeItem, setExcludeItem] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [productSelectedKeys, setProductSelectedKeys] = useState([]);
  const [productSelected, setProductSelected] = useState([]);

  const scopeRef = useRef<any>();
  const actionRef = useRef<any>();
  const productActionRef = useRef<any>();

  const column: ProColumns<any>[] = [
    {
      title: '机构',
      dataIndex: 'institutionName',
    },
    {
      title: '产品',
      dataIndex: 'productCount',
      renderText: (text, record) => (
        <a
          onClick={() => {
            setProductVisible(true);
            setExcludeItem(record);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      renderText: (text, record) => (
        <Popconfirm
          title="你确定删除吗？"
          onConfirm={() => deleteAction(record)}
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];

  const deleteExcludeProductAction = (data: any) => {
    deleteExcludeProduct({
      ...data,
    }).then(() => {
      message.success('成功');
      setDrawerVisible(false);
      productActionRef.current.reload();
      actionRef.current.reload();
      tableActionRef.current.reload();
    });
  };

  const productColumns: ProColumns<any>[] = [
    {
      title: '产品',
      dataIndex: 'productName',
      renderText: (text, record) => {
        return `${text}${(record.specification &&
          `(${record.specification})`) ||
          ''}`;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      renderText: (text, record) => (
        <Popconfirm
          title="你确定删除吗？"
          onConfirm={() => deleteExcludeProductAction(record)}
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];

  const productAddColumns: ProColumns<any>[] = [
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

  const deleteAction = (data: any) => {
    deleteExclude({
      ...data,
    }).then(() => {
      message.success('成功');
      actionRef.current.reload();
      tableActionRef.current.reload();
    });
  };

  const excludeSubmit = () => {
    addPrimaryExclude({
      ...item,
      exceptionList: scopeRef.current.scopeList || [],
    }).then(() => {
      message.success('成功');
      setScopeVisible(false);
      actionRef.current.reload();
      tableActionRef.current.reload();
    });
  };

  const productTableChange = (selectedRowKeys: any, selectedRows: any) => {
    setProductSelectedKeys(selectedRowKeys);
    setProductSelected(selectedRows);
  };

  const submitProduct = () => {
    addPrimaryExclude({
      ...item,
      exceptionList:
        productSelected.map((item: any) => {
          const { id, ...other } = excludeItem;
          return {
            ...other,
            productId: item.id,
            productName: item.name,
          };
        }) || [],
    }).then(() => {
      message.success('成功');
      setDrawerVisible(false);
      productActionRef.current.reload();
      actionRef.current.reload();
      tableActionRef.current.reload();
    });
  };

  return (
    <>
      <Modal
        title="排除详情"
        visible={visible}
        onCancel={onCancel}
        footer={
          <Button type="primary" onClick={() => onCancel && onCancel()}>
            确定
          </Button>
        }
        width="50%"
      >
        <Descriptions>
          <Descriptions.Item label="地区">
            {item.province || item.city || item.country}
          </Descriptions.Item>
          <Descriptions.Item label="机构类型">
            {getNameByValue(
              getDictionaryBySystemCode('InstitutionCategory'),
              item.institutionType,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="产品层级">
            {getNameByValue(
              getDictionaryBySystemCode('ProductLevel'),
              item.productLevelDim,
            )}
          </Descriptions.Item>
        </Descriptions>
        <ProTable
          columns={column}
          search={false}
          form={{ autoComplete: 'off' }}
          headerTitle={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setScopeVisible(true)}
            >
              添加排除
            </Button>
          }
          actionRef={actionRef}
          params={{
            ...item,
          }}
          request={(params, sort, filter) => {
            return getExcludeList({
              ...params,
              ...sort,
              ...filter,
            });
          }}
        />
      </Modal>
      {scopeVisible && (
        <Drawer
          visible={scopeVisible}
          width="70%"
          title="添加排除"
          onClose={() => setScopeVisible(false)}
          footer={
            <Space>
              <Button onClick={() => setScopeVisible(false)}>取消</Button>
              <Button type="primary" onClick={excludeSubmit}>
                提交
              </Button>
            </Space>
          }
        >
          <ScopePrimaryComponent
            isExclude={true}
            levelInfo={{
              ...item,
            }}
            ref={scopeRef}
          />
        </Drawer>
      )}
      {productVisible && (
        <Modal
          visible={productVisible}
          title="排除产品详情"
          onCancel={() => setProductVisible(false)}
          width="50%"
          footer={
            <Button type="primary" onClick={() => setProductVisible(false)}>
              确定
            </Button>
          }
        >
          <Descriptions>
            <Descriptions.Item label="地区">
              {item.province || item.city || item.country}
            </Descriptions.Item>
            <Descriptions.Item label="机构类型">
              {getNameByValue(
                getDictionaryBySystemCode('InstitutionCategory'),
                item.institutionType,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="产品层级">
              {getNameByValue(
                getDictionaryBySystemCode('ProductLevel'),
                item.productLevelDim,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="机构">
              {excludeItem.institutionName}
            </Descriptions.Item>
          </Descriptions>
          <ProTable
            form={{ autoComplete: 'off' }}
            search={false}
            columns={productColumns}
            headerTitle={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDrawerVisible(true)}
              >
                添加产品
              </Button>
            }
            params={{
              ...excludeItem,
            }}
            request={(params, sort, filter) => {
              return getExcludeProductList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
            actionRef={productActionRef}
          />
        </Modal>
      )}
      {drawerVisible && (
        <Drawer
          visible={drawerVisible}
          width="70%"
          onClose={() => setDrawerVisible(false)}
          title="添加产品"
          footer={
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>取消</Button>
              <Button type="primary" onClick={submitProduct}>
                提交
              </Button>
            </Space>
          }
        >
          <Descriptions>
            <Descriptions.Item label="地区">
              {item.province || item.city || item.country}
            </Descriptions.Item>
            <Descriptions.Item label="机构类型">
              {getNameByValue(
                getDictionaryBySystemCode('InstitutionCategory'),
                item.institutionType,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="产品层级">
              {getNameByValue(
                getDictionaryBySystemCode('ProductLevel'),
                item.productLevelDim,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="机构">
              {excludeItem.institutionName}
            </Descriptions.Item>
          </Descriptions>
          <ProTable<any>
            form={{ autoComplete: 'off' }}
            columns={productAddColumns}
            scroll={{
              y: 400,
            }}
            rowSelection={{
              fixed: true,
              selections: true,
              onChange: productTableChange,
              selectedRowKeys: productSelectedKeys,
            }}
            params={{
              ...item,
            }}
            request={(params, sort, filter) => {
              return getPrimaryProductList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
            postData={(data: any) => {
              return _.isArray(data) ? data : data.list;
            }}
            rowKey="id"
          />
        </Drawer>
      )}
    </>
  );
};
