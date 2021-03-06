import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Modal,
  Button,
  Descriptions,
  Popconfirm,
  Drawer,
  Space,
  Switch,
  message,
  Form,
  TreeSelect,
  Input,
  Table,
  InputNumber,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { ProductDetailProps } from '@/pages/institution/agent/Agent';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';
import {
  getAgentScopeProductList,
  getProductList,
  addScopeProduct,
  deleteScopeProduct,
  editScope,
} from '@/services/agentScope';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import _ from 'lodash';
import {
  getAgentQuotaTerritoryTree,
  getLogList,
  getAgentQuotaList,
  editQuota,
} from '@/services/agentQuota';
import moment from 'moment';

const EditableContext = React.createContext<any>('');

const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} autoComplete="off">
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef: any = useRef();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  let childNode = children;

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log(errInfo);
    }
  };

  if (editable) {
    childNode = editing ? (
      <>
        <Form.Item
          style={{ margin: 0, display: 'inline-block' }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} ?????????`,
            },
            {
              max: 999999999,
              type: 'number',
              message: `${title}??????????????????`,
            },
          ]}
        >
          <InputNumber ref={inputRef} onPressEnter={save} />
        </Form.Item>
        <Space style={{ marginLeft: '5px', lineHeight: 2 }}>
          <a onClick={save}>??????</a>
          <a onClick={toggleEdit}>??????</a>
        </Space>
      </>
    ) : (
      <div>
        {children}{' '}
        <EditOutlined
          style={{ cursor: 'pointer', marginLeft: '20px' }}
          onClick={toggleEdit}
        />
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default (props: ProductDetailProps) => {
  const { visible, item, onCancel, tableActionRef } = props;
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [productSelectedKeys, setProductSelectedKeys] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [editInfoVisible, setEditInfoVisible] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<any>({});
  const [territoryData, setTerritoryData] = useState<any[]>([]);
  const [indVisible, setIndVisible] = useState<boolean>(false);
  const [agentQuotaList, setAgentQuotaList] = useState([]);
  const [productList, setProductList] = useState<any>([]);
  const actionRef = useRef<any>();
  const quotaLogAction = useRef<any>();
  const [editForm] = Form.useForm();

  useEffect(() => {
    getAgentQuotaTerritoryTree().then(res => {
      setTerritoryData(res.data);
    });
  }, []);

  const deleteConfirm = (data: any) => {
    deleteScopeProduct({
      ...item,
      ...data,
    }).then(() => {
      if (productList.length > 1) {
        message.success('??????');
        actionRef.current.reload();
      } else {
        onCancel && onCancel();
      }
      tableActionRef.current.reload();
    });
  };

  const productDetailColumn: ProColumns<any>[] = [
    {
      title: '??????',
      dataIndex: 'productName',
      renderText: (text, record) => {
        return record.productId !== 'All'
          ? `${text} ${
              record.specification ? `( ${record.specification} )` : ''
            }`
          : '??????';
      },
    },
    {
      title: '??????',
      dataIndex: 'nodeName',
      renderText: (text: any, record1: any) => {
        return text && `${text}???${record1.nodeStaffName || '-'}???`;
      },
    },
    {
      title: '?????????',
      dataIndex: 'salesMan',
    },
    {
      title: '??????',
      dataIndex: 'action',
      renderText: (text, record) => {
        return (
          <Space>
            <a
              onClick={() => {
                setIndVisible(true);
                setEditInfo({ ...record });
                getQuotaList(record.contractId, record.id);
              }}
            >
              ????????????
            </a>
            <a
              onClick={() => {
                setEditInfoVisible(true);
                setEditInfo({ ...record });
              }}
            >
              ????????????
            </a>
            <Popconfirm
              title="?????????????????????"
              onConfirm={() => deleteConfirm(record)}
            >
              <a>??????</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const switchChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const productColumns: ProColumns<any>[] = [
    {
      title: '??????',
      dataIndex: 'name',
      search: false,
      renderText: (text, record) => {
        return `${text}${(record.specification &&
          `(${record.specification})`) ||
          ''}`;
      },
    },
    {
      title: '?????????',
      dataIndex: 'keyWords',
      hideInTable: true,
    },
  ];

  const Info = () => (
    <Descriptions>
      {(item.province || item.city || item.country) && (
        <Descriptions.Item label="??????">
          {item.province || item.city || item.country}
        </Descriptions.Item>
      )}
      {item.institutionName && (
        <Descriptions.Item label="??????">
          {item.institutionName}
        </Descriptions.Item>
      )}
      <Descriptions.Item label="????????????">
        {getNameByValue(
          getDictionaryBySystemCode('InstitutionCategory'),
          item.institutionType,
        )}
      </Descriptions.Item>
      <Descriptions.Item label="????????????">
        {getNameByValue(
          getDictionaryBySystemCode('ProductLevel'),
          item.productLevelDim,
        )}
      </Descriptions.Item>
      {item.distributorName && (
        <Descriptions.Item label="?????????">
          {item.distributorName}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  const productTableChange = (selectedRowKeys: any, selectedRows: any) => {
    setProductSelectedKeys(selectedRowKeys);
    setProductSelected(selectedRows);
  };

  const submitProduct = () => {
    const productList = switchChecked
      ? [{ name: '??????', id: 'All' }]
      : productSelected;
    addScopeProduct({
      ...item,
      productList,
    }).then((res: any) => {
      message.success('??????');
      setDrawerVisible(false);
      setProductSelectedKeys([]);
      setProductSelected([]);
      setSwitchChecked(false);
      actionRef.current.reload();
      tableActionRef.current.reload();
    });
  };

  const transformData = (data: any) => {
    return data.map((item: any) => {
      return (
        (item.children &&
          item.children.length > 0 && {
            ...item,
            title: `${item.name}???${item.staffName || '-'}???`,
            key: item.code,
            children: transformData(item.children),
          }) || {
          ...item,
          title: `${item.name}???${item.staffName || '-'}???`,
          key: item.code,
        }
      );
    });
  };

  const territoryChange = (value: any, label: any, extra: any) => {
    if (value) {
      const {
        triggerNode: { props },
      } = extra;
      setEditInfo((state: any) => {
        return {
          ...state,
          nodeCode: value,
          referringPeriodId: (value && props.periodId) || null,
          nodeName: (value && props.name) || null,
          nodeStaffName: (value && props.staffName) || null,
        };
      });
    } else {
      setEditInfo((state: any) => {
        return {
          ...state,
          nodeCode: '',
          referringPeriodId: '',
          nodeName: '',
          nodeStaffName: '',
        };
      });
    }
  };

  const editOnInfo = () => {
    editForm.validateFields().then((value: any) => {
      editScope({
        ...editInfo,
        ...value,
      }).then(() => {
        message.success('??????');
        setEditInfoVisible(false);
        actionRef.current.reload();
      });
    });
  };

  const getQuotaList = (contractId: string, scopeId: string) => {
    getAgentQuotaList({
      contractId,
      scopeId,
    }).then((res: any) => {
      setAgentQuotaList(res.data);
    });
  };

  const indColumns = [
    {
      title: '??????',
      dataIndex: 'timeBucket',
    },
    {
      title: '???????????????',
      dataIndex: 'periodName',
    },
    {
      title: '??????',
      dataIndex: 'value',
      editable: true,
    },
    {
      title: '???????????????',
      dataIndex: 'updateByName',
    },
    {
      title: '??????????????????',
      dataIndex: 'updateTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const IndTableComponent = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row: any) => {
    editQuota({
      ...row,
    }).then(() => {
      message.success('??????');
      getQuotaList(row.contractId, row.scopeId);
      quotaLogAction.current.reload();
    });
  };

  const logColumns: ProColumns[] = [
    {
      title: '??????',
      dataIndex: 'timeBucket',
    },
    {
      title: '????????????',
      dataIndex: 'oldValue',
    },
    {
      title: '????????????',
      dataIndex: 'newValue',
    },
    {
      title: '?????????',
      dataIndex: 'createByName',
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        title="????????????????????????"
        onCancel={onCancel}
        footer={
          <Button type="primary" onClick={() => onCancel && onCancel()}>
            ??????
          </Button>
        }
        width="50%"
      >
        <Info />
        <ProTable
          form={{ autoComplete: 'off' }}
          columns={productDetailColumn}
          search={false}
          request={async (params, sort, filter) => {
            const res: any = await getAgentScopeProductList({
              ...item,
              ...params,
              pageNo: params.current,
            });
            setProductList(res.data.list);
            return {
              success: true,
              data: res.data.list,
              total: res.data.total,
            };
          }}
          rowKey="id"
          headerTitle={
            productList.length === 1 &&
            productList[0].productId === 'All' ? null : (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDrawerVisible(true)}
              >
                ????????????
              </Button>
            )
          }
          actionRef={actionRef}
        />
      </Modal>
      {drawerVisible && (
        <Drawer
          visible={drawerVisible}
          width="70%"
          onClose={() => setDrawerVisible(false)}
          title="????????????"
          footer={
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>??????</Button>
              <Button type="primary" onClick={submitProduct}>
                ??????
              </Button>
            </Space>
          }
          destroyOnClose
        >
          <Info />
          <p
            style={{
              padding: '0 60px',
              margin: 0,
              marginTop: '15px',
              lineHeight: 1,
            }}
          >
            ?????????
            <Switch
              style={{ marginLeft: '15px' }}
              onChange={switchChange}
              checked={switchChecked}
            />
          </p>
          {!switchChecked && (
            <ProTable<any>
              form={{ autoComplete: 'off' }}
              columns={productColumns}
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
                level: item.productLevelDim,
              }}
              request={(params, sort, filter) => {
                return getProductList({
                  ...params,
                  ...sort,
                  ...filter,
                  state: 'Active',
                });
              }}
              postData={(data: any) => {
                return _.isArray(data) ? data : data.list;
              }}
              rowKey="id"
            />
          )}
        </Drawer>
      )}
      {editInfoVisible && (
        <Modal
          visible={editInfoVisible}
          onCancel={() => setEditInfoVisible(false)}
          onOk={editOnInfo}
          okText="??????"
          title="????????????"
        >
          <Descriptions>
            {(item.province || item.city || item.country) && (
              <Descriptions.Item label="??????">
                {item.province || item.city || item.country}
              </Descriptions.Item>
            )}
            {item.institutionName && (
              <Descriptions.Item label="??????">
                {item.institutionName}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="????????????">
              {getNameByValue(
                getDictionaryBySystemCode('InstitutionCategory'),
                item.institutionType,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="????????????">
              {getNameByValue(
                getDictionaryBySystemCode('ProductLevel'),
                item.productLevelDim,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="??????">
              {editInfo.productName}
            </Descriptions.Item>
          </Descriptions>
          <Form form={editForm} autoComplete="off">
            <Form.Item
              label="??????"
              name="node"
              initialValue={editInfo.nodeCode}
            >
              <TreeSelect
                treeData={transformData(territoryData)}
                placeholder="?????????"
                allowClear
                onChange={territoryChange}
              />
            </Form.Item>
            <Form.Item
              label="?????????"
              name="salesMan"
              initialValue={editInfo.salesMan}
            >
              <Input placeholder="?????????" />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {indVisible && (
        <Drawer
          visible={indVisible}
          title="????????????"
          onClose={() => setIndVisible(false)}
          width="70%"
        >
          <Descriptions>
            {(item.province || item.city || item.country) && (
              <Descriptions.Item label="??????">
                {item.province || item.city || item.country}
              </Descriptions.Item>
            )}
            {item.institutionName && (
              <Descriptions.Item label="??????">
                {item.institutionName}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="????????????">
              {getNameByValue(
                getDictionaryBySystemCode('InstitutionCategory'),
                item.institutionType,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="????????????">
              {getNameByValue(
                getDictionaryBySystemCode('ProductLevel'),
                item.productLevelDim,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="??????">
              {editInfo.productName}
            </Descriptions.Item>
          </Descriptions>
          <Table
            columns={indColumns.map((col: any) => {
              if (!col.editable) {
                return col;
              }
              return {
                ...col,
                onCell: record => ({
                  record,
                  editable: col.editable,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  handleSave: handleSave,
                }),
              };
            })}
            components={IndTableComponent}
            dataSource={agentQuotaList}
            pagination={false}
            scroll={{
              y: 400,
            }}
          />
          <h2>??????????????????</h2>
          <ProTable
            form={{ autoComplete: 'off' }}
            search={false}
            columns={logColumns}
            actionRef={quotaLogAction}
            params={{
              scopeId: editInfo.id,
            }}
            request={async (params, sort, filter) => {
              const res: any = await getLogList({
                ...params,
                ...sort,
                ...filter,
                pageNo: params.current,
              });
              return {
                success: true,
                data: res.data.list,
                total: res.data.total,
              };
            }}
          />
        </Drawer>
      )}
    </>
  );
};
