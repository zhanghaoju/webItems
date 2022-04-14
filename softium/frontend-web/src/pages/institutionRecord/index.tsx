import React, { useEffect, useState, useRef } from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { getColumn } from '@/services/applicationInfo';
import {
  Button,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  TreeSelect,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddModal from './AddModal';
import {
  getDictionaryBySystemCode,
  getNameByValue,
  transformToTableRequest,
} from '@/utils/dataConversion';
import { getInstitutionList, productTree } from '@/services/priceControl';
import { getCurrentPeriod } from '@/services/period';
import { getTerritoryTree } from '@/services/territory';
import {
  addInstitutionRecord,
  getInstitutionRecordList,
  deleteInstitutionRecord,
  editInstitutionRecord,
  batchDeleteRecord,
  recordTemplate,
  exportRecord,
} from '@/services/institutionRecord';
import DebounceSelect from '@/components/DebounceSelect';
import { Authorized, VulcanFile } from '@vulcan/utils';
import ModalImport from '@/components/ModalImport/ModalImport';
import DetailModal from '@/pages/institutionRecord/DetailModal';

export default () => {
  const [columnList, setColumnList] = useState([]);
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
  const [productList, setProductList] = useState([]);
  const [skuValue, setSkuValue] = useState('');
  const [territoryTree, setTerritoryTree] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [detailRecord, setDetailRecord] = useState({});

  const [form] = Form.useForm();
  const addRef: any = useRef();
  const actionRef: any = useRef();
  const tableFormRef = useRef<FormInstance>();
  const importRef: any = useRef();
  const detailRef: any = useRef();

  useEffect(() => {
    getColumn({ table: 't_mdm_institution_record' }).then((res: any) => {
      setColumnList(res?.data || []);
    });
    getProductList();
    getTerritory();
  }, []);

  const getProductList = () => {
    const productLevel = getDictionaryBySystemCode('ProductLevel');
    setSkuValue(
      productLevel.find((item: any) => item.systemValue === 'SKU')?.value,
    );
    productTree().then(res => {
      setProductList(res?.data);
    });
  };

  const getTerritory = async () => {
    try {
      const {
        data: { id },
      } = await getCurrentPeriod();
      const { data } = await getTerritoryTree({ periodId: id });
      setTerritoryTree(data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRecord = (id: string) => {
    deleteInstitutionRecord({ id }).then(() => {
      message.success('删除成功');
      actionRef?.current?.reload();
    });
  };

  const actionColumns: ProColumns[] = [
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record, _, action) => (
        <Space>
          {[
            <a
              key="view"
              onClick={() => {
                setDetailRecord(record);
                detailRef.current.toggleVisible();
              }}
            >
              查看
            </a>,
            <Authorized code="institutionRecordEdit" key="edit">
              <a
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                编辑
              </a>
            </Authorized>,
            <Authorized code="institutionRecordDelete" key="delete">
              <Popconfirm
                title="确定要删除吗"
                onConfirm={() => deleteRecord(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </Authorized>,
          ]}
        </Space>
      ),
    },
  ];

  const loopData = (data: any) => {
    return data.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          title: `${item.name}${(item.specification &&
            `（${item.specification}）`) ||
            ''}`,
          value: item.code,
          selectable: item.level === skuValue,
          children: loopData(item.children),
        };
      }
      return {
        ...item,
        title: `${item.name}${(item.specification &&
          `（${item.specification}）`) ||
          ''}`,
        value: item.code,
        selectable: item.level === skuValue,
      };
    });
  };

  const loopDataTree = (data: any) => {
    return data.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          title: item.name,
          value: item.code,
          children: loopDataTree(item.children),
        };
      }
      return {
        ...item,
        title: item.name,
        value: item.code,
      };
    });
  };

  const onSearch = (value: string, type: string) => {
    return getInstitutionList({
      pageSize: 40,
      likeField: value ? [value] : null,
      type: type ? [type] : null,
      state: 'Active',
    });
  };

  const searchColumns: ProColumns[] = [
    {
      title: '关键词',
      dataIndex: 'keywords',
      hideInSearch: false,
      hideInTable: true,
      tooltip: '机构编码、产品编码、产品规格、生产厂家',
    },
    {
      title: '辖区',
      dataIndex: 'nodeCodes',
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          placeholder="请选择辖区"
          treeData={loopDataTree(territoryTree)}
          showSearch
          filterTreeNode={(inputValue, option) => {
            return option?.name.indexOf(inputValue) >= 0;
          }}
          allowClear
          multiple
        />
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'productCode',
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          placeholder="请选择产品"
          treeData={loopData(productList)}
          showSearch
          filterTreeNode={(inputValue, option) => {
            return option?.name.indexOf(inputValue) >= 0;
          }}
          allowClear
        />
      ),
    },
    {
      title: '机构名称',
      dataIndex: 'institutionCode',
      hideInTable: true,
      renderFormItem: () => (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="请选择机构"
          byCode={true}
          allowClear
        />
      ),
    },
  ];

  const editableColumns = [
    'nodeName',
    'nodeCode',
    'nodeHead',
    'agentName',
    'agentCode',
    'agentContacts',
    'distributorName',
    'distributorCode',
    'remark1',
    'remark2',
    'remark3',
    'remark4',
    'remark5',
    'remark6',
  ];

  const territoryTreeChange = (check: any, values: any, record: any) => {
    const {
      triggerNode: {
        props: { code, staffName },
      },
    } = record;
    form.setFields([
      {
        name: [editableKeys[0], 'nodeCode'],
        value: code,
      },
      {
        name: [editableKeys[0], 'nodeHead'],
        value: staffName,
      },
    ]);
  };

  const institutionChange = (value: any, record: any, type: string) => {
    let fields = [
      {
        name: [editableKeys[0], 'agentCode'],
        value: record.code,
      },
      {
        name: [editableKeys[0], 'agentContacts'],
        value: record.contacts,
      },
    ];
    if (type === 'Distributor') {
      fields = [
        {
          name: [editableKeys[0], 'distributorCode'],
          value: record.code,
        },
      ];
    }
    form.setFields(fields);
  };

  const columnRender: any = {
    nodeName: {
      rules: [
        {
          required: true,
          message: '请选择辖区',
        },
      ],
      component: (
        <TreeSelect
          placeholder="请选择辖区"
          treeData={loopDataTree(territoryTree)}
          showSearch
          filterTreeNode={(inputValue, option) => {
            return option?.name.indexOf(inputValue) >= 0;
          }}
          onChange={territoryTreeChange}
        />
      ),
    },
    nodeCode: {
      disabled: true,
      placeholder: '辖区编码',
    },
    nodeHead: {
      disabled: true,
      placeholder: '辖区负责人',
    },
    agentName: {
      component: (
        <DebounceSelect
          fetchOptions={(value: string) => onSearch(value, 'Agent')}
          placeholder="请选择代理商"
          onChange={(value: any, record: any) =>
            institutionChange(value, record, 'Agent')
          }
        />
      ),
    },
    agentCode: {
      disabled: true,
      placeholder: '代理商编码',
    },
    agentContacts: {
      disabled: true,
      placeholder: '代理商联系人',
    },
    distributorName: {
      component: (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="请选择配送商"
          onChange={(value: any, record: any) =>
            institutionChange(value, record, 'Distributor')
          }
        />
      ),
    },
    distributorCode: {
      disabled: true,
      placeholder: '配送商编码',
    },
  };

  const columns: any[] = [
    ...searchColumns,
    ...columnList
      .filter((item: any) => !item.isHidden)
      .map((item: any) => ({
        title: item.dispName,
        dataIndex: item.name,
        width: 200,
        hideInSearch: true,
        editable: editableColumns.includes(item.name),
        renderText: (value: string) =>
          item.extProps
            ? getNameByValue(getDictionaryBySystemCode(item.extProps), value)
            : value,
        formItemProps: columnRender[item.name]
          ? {
              rules: columnRender[item.name].rules,
            }
          : {},
        ...(columnRender[item.name]
          ? {
              renderFormItem: (_: any, it: any) => {
                const columnItem = columnRender[item.name];
                return columnItem.component ? (
                  columnItem.component
                ) : (
                  <Input disabled />
                );
              },
            }
          : {}),
      })),
    ...actionColumns,
  ];

  const editableSave = async (key: any, row: any) => {
    await editInstitutionRecord({
      ...row,
    });
    message.success('编辑成功');
    actionRef?.current?.reload();
  };

  const addSubmit = (values: any) => {
    addInstitutionRecord({
      ...values,
    })
      .then(() => {
        message.success('添加成功');
        addRef?.current?.toggleLoading();
        addRef?.current?.form.resetFields();
        addRef?.current?.setVisible();
        actionRef?.current?.reload();
      })
      .catch(() => {
        addRef?.current?.toggleLoading();
      });
  };

  const batchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.info('请选择需要删除的数据');
      return;
    }
    batchDeleteRecord({
      ids: selectedRowKeys,
    }).then(() => {
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      actionRef?.current?.reload();
    });
  };

  const downloadTemplate = () => {
    setTemplateLoading(true);
    recordTemplate()
      .then((res: any) => {
        setTemplateLoading(false);
        VulcanFile.export(res);
      })
      .catch(() => {
        setTemplateLoading(false);
      });
  };

  const exportData = () => {
    setExportLoading(true);
    exportRecord({
      ...(tableFormRef.current?.getFieldsValue() || {}),
    })
      .then((res: any) => {
        setExportLoading(false);
        VulcanFile.export(res);
      })
      .catch(() => {
        setExportLoading(false);
      });
  };

  const importClose = () => {
    actionRef.current.reload();
  };

  return (
    <>
      <EditableProTable
        columns={columns}
        actionRef={actionRef}
        formRef={tableFormRef}
        options={{
          reload: true,
          setting: true,
          density: true,
          fullScreen: false,
        }}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Authorized code="institutionRecordBatchDelete">
              <Popconfirm title="确定删除选中数据？" onConfirm={batchDelete}>
                <a>批量删除</a>
              </Popconfirm>
            </Authorized>
            <a
              onClick={() => {
                setSelectedRowKeys([]);
              }}
            >
              取消选择
            </a>
          </Space>
        )}
        headerTitle={
          <Space>
            <Authorized code="institutionRecordAdd">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => addRef?.current?.setVisible()}
              >
                添加
              </Button>
            </Authorized>
            <Authorized code="institutionRecordImport">
              <Button onClick={() => importRef.current.visible()}>导入</Button>
            </Authorized>
            <Authorized code="institutionRecordExport">
              <Button loading={exportLoading} onClick={exportData}>
                导出
              </Button>
            </Authorized>
            <Button loading={templateLoading} onClick={downloadTemplate}>
              下载模板
            </Button>
          </Space>
        }
        rowKey="id"
        recordCreatorProps={false}
        search={{}}
        editable={{
          form,
          editableKeys,
          onChange: setEditableKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
          onSave: editableSave,
        }}
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        request={(params: any, filter: any, sort: any) => {
          return transformToTableRequest<any>(
            {
              ...params,
              ...filter,
              ...sort,
            },
            getInstitutionRecordList,
          );
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: any) =>
            setSelectedRowKeys(selectedRowKeys),
        }}
      />
      <AddModal
        ref={addRef}
        columnList={columnList}
        productList={productList}
        skuValue={skuValue}
        territoryTree={territoryTree}
        onOk={addSubmit}
        loopData={loopData}
        loopDataTree={loopDataTree}
      />
      <ModalImport
        ref={importRef}
        uploadUrl="/institution/record/import"
        commitUrl="/institution/record/commit"
        title="机构备案导入"
        onOk={importClose}
      />
      <DetailModal
        ref={detailRef}
        columnList={columnList}
        record={detailRecord}
      />
    </>
  );
};
