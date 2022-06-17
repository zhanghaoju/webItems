import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ListTable from '@/pages/institution/list';
import {
  getDistributorLevelInfo,
  insertDistributorLevel,
  updateDistributorLevel,
  batchDeleteDistributorLevel,
  batchUpdateDistributorLevel,
} from '@/services/institution';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  TreeSelect,
} from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';
import { getTree } from '@/services/product/product';
import PriceModal from '@/pages/institution/priceModal';
import { useAuth } from '@vulcan/utils';

const { SHOW_CHILD } = TreeSelect;

const Level = (props: any) => {
  const [form] = Form.useForm();
  const childRef: any = useRef<any>();
  const modalRef: any = useRef<any>();
  const {
    params: { record },
  } = props;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const [params, setParams] = useState<any>({ institutionId: record.id });
  const [modalVisible, setModalVisible] = useState(false);
  const [productTree, setProductTree] = useState<any[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [data, setData] = useState<any>({});
  const getDictionary = (key: string) => {
    return getDictionaryBySystemCode(key) || [];
  };
  const subclassDealerLevel = getDictionary('SubclassDealerLevel');
  const dealerLevelAdd = useAuth('dealerLevelAdd');
  const dealerLevelEdit = useAuth('dealerLevelEdit');
  const dealerLevelDel = useAuth('dealerLevelDel');
  // const deliveryPriceManagement = useAuth('deliveryPriceManagement');
  const deliveryPriceManagement = false;
  const actionLen: number = [
    dealerLevelEdit,
    dealerLevelDel,
    deliveryPriceManagement,
  ].filter((item: any) => item && item.menuId).length;

  const columns: any = [
    {
      title: '级别',
      dataIndex: 'level',
      ellipsis: true,
      width: 60,
      render: (text: string, record: any) => {
        return getNameByValue(subclassDealerLevel, record.level);
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '产品规格',
      dataIndex: 'specification',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      width: '7%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      fixed: 'right',
      width: actionLen * 60,
      hideInTable:
        !dealerLevelEdit && !dealerLevelDel && !deliveryPriceManagement,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            {dealerLevelEdit ? (
              <span onClick={() => showModal(record)}>修改级别</span>
            ) : null}
            {deliveryPriceManagement ? (
              <span onClick={() => showPriceModal(record)}>开票价管理</span>
            ) : null}
            {dealerLevelDel ? (
              <Popconfirm
                placement="topRight"
                title={`您确定要删除吗？`}
                icon={<QuestionCircleOutlined />}
                onConfirm={() => deleteLevel(record)}
              >
                <span>删除</span>
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];
  const showPriceModal = (record: any) => {
    modalRef.current.data({
      visible: true,
      data: record,
    });
  };
  const showModal = (data: any) => {
    setData(data);
    setIsUpdate(true);
    toggleVisible(true);
  };

  const deleteLevel = (record: any) => {
    record.isDeleted = 1;
    delete record.createTime;
    delete record.updateTime;
    updateDistributorLevel(record).then(() => {
      message.success('删除成功');
      childRef && childRef.current.reload();
    });
  };

  const changeSearch = (value: string) => {
    const newParams = {
      ...params,
      likeField: value,
    };
    childRef.current.reload(newParams);
  };

  const headerTitle: any = () => {
    return (
      <div className="btn-container level-header">
        {dealerLevelAdd ? (
          <Button
            className="btn-item"
            key="add"
            type="primary"
            onClick={() => {
              toggleVisible(true);
              filterProduct();
              setData({
                productIds: [],
                type: '',
              });
              setIsUpdate(false);
            }}
          >
            <PlusOutlined />
            添加
          </Button>
        ) : null}
        <div className="search">
          <Input.Group compact>
            <Input.Search
              placeholder="请输入名称、编码"
              allowClear
              value={params.likeField}
              onSearch={(value: string) => changeSearch(value)}
            />
          </Input.Group>
        </div>
      </div>
    );
  };

  const toggleVisible = (bool: boolean) => {
    setModalVisible(bool);
  };

  useEffect(() => {
    getTree().then((res: any) => {
      if (res) {
        handleTreeData(res.data);
        setProductTree(res.data);
      }
    });
  }, []);

  const handleTreeData = (data: any[]) => {
    data.forEach((item: any) => {
      item.key = item.code;
      item.value = item.code;
      item.title = item.name;
      if (item.children) {
        handleTreeData(item.children);
      } else {
        item.title = `${item.name} (${item.specification})`;
      }
    });
  };

  const filterProduct = () => {
    const data: any[] = childRef.current.getDataList();
    data.forEach((item: any) => {
      deleteProduct(productTree, item.productCode);
    });
  };

  const deleteProduct = (data: any, key: string) => {
    for (const item in data) {
      if (data[+item].code === key) {
        data[+item].disabled = true;
      } else {
        if (data[+item].children) {
          deleteProduct(data[+item].children, key);
        }
      }
    }
  };

  const tProps = {
    treeCheckable: true,
    showCheckedStrategy: SHOW_CHILD,
    placeholder: '请选择',
  };

  let productList: any = [];
  const getData = (data: any) => {
    for (let item in data) {
      handleData(productTree, data[item]);
    }
  };

  const handleData = (data: any[], value: string) => {
    for (let item in data) {
      if (data[item].code === value || data[item].id === value) {
        productList.push({
          key: data[item].code,
          value: data[item].name,
        });
        break;
      }
      if (data[item].children) {
        handleData(data[item].children, value);
      }
    }
  };

  const submit = () => {
    form.validateFields().then(values => {
      if (values) {
        if (isUpdate) {
          record.level = values.level;
          delete record.createTime;
          delete record.updateTime;
          updateDistributorLevel({
            level: values.level,
            id: data.id,
            isDeleted: 0,
            institutionId: record.id,
          }).then((res: any) => {
            if (res) {
              message.success('修改成功');
              childRef.current.reload();
              toggleVisible(false);
            }
          });
        } else {
          productList = [];
          getData(values.productCodeNames);
          values.productCodeNames = productList;
          insertDistributorLevel({
            ...values,
            institutionId: record.id,
            isSelectAll: false,
          }).then((res: any) => {
            if (res) {
              message.success('添加成功');
              childRef.current.reload();
              toggleVisible(false);
            }
          });
        }
      }
    });
  };

  const batchDelete = async (selectedRowKeys: any[], onCleanSelected: any) => {
    try {
      await batchDeleteDistributorLevel({
        levelIds: selectedRowKeys,
        institutionId: record.id,
      });
      onCleanSelected();
      message.success('批量删除成功');
      childRef.current.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const batchUpdate = (selectedRowKeys: string[], onCleanSelected: any) => {
    const dataList = childRef.current.getDataList();
    const productName: string[] = [];
    selectedRowKeys.forEach((item: string) => {
      const data = dataList.find((t: any) => t.id === item);
      productName.push(data.productName);
    });
    setData({
      productName,
      productIds: selectedRowKeys,
      type: 'update',
      onCleanSelected,
    });
    toggleVisible(true);
    setIsUpdate(true);
  };

  const update = () => {
    form.validateFields().then(values => {
      batchUpdateDistributorLevel({
        levelIds: data.productIds,
        level: values.level,
        institutionId: record.id,
      }).then(res => {
        if (res) {
          toggleVisible(false);
          data.onCleanSelected();
          message.success('批量修改成功');
          childRef.current.reload();
        }
      });
    });
  };

  return (
    <div className="alias-container">
      <ListTable
        cRef={childRef}
        columns={columns}
        getList={getDistributorLevelInfo}
        scrollX={1400}
        hideSearch={true}
        headerTitle={headerTitle}
        params={params}
        hasDefaultColumns={true}
        batchDelete={batchDelete}
        bathDeleteAuth={useAuth('batchDealerLevelDel')}
        batchUpdate={batchUpdate}
        bathUpdateAuth={useAuth('batchDealerLevelUpdate')}
      />
      <Modal
        maskClosable={false}
        destroyOnClose
        className="modal-width"
        visible={modalVisible}
        title={isUpdate ? '修改级别' : '添加'}
        onCancel={() => {
          toggleVisible(false);
          form.resetFields();
        }}
        onOk={() => (data.type === 'update' ? update() : submit())}
      >
        <Form form={form} preserve={false} autoComplete="off">
          {isUpdate ? (
            <Form.Item
              {...formItemLayout}
              label="产品名称"
              name="productCodeNames"
              initialValue={data.productName}
            >
              <Input disabled={true} />
            </Form.Item>
          ) : (
            <Form.Item
              {...formItemLayout}
              label="产品名称"
              name="productCodeNames"
              rules={[{ required: true, message: '请选择产品' }]}
            >
              <TreeSelect {...tProps} treeData={productTree} />
            </Form.Item>
          )}
          <Form.Item
            {...formItemLayout}
            label="经销商级别"
            name="level"
            initialValue={isUpdate ? data.level : ''}
            rules={[{ required: true, message: '请选择经销商级别' }]}
          >
            <Select placeholder="请选择">
              {(subclassDealerLevel || []).map((item: any) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <PriceModal cRef={modalRef} />
    </div>
  );
};

export default Level;
