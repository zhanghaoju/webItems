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
      message.success('????????????');
      actionRef?.current?.reload();
    });
  };

  const actionColumns: ProColumns[] = [
    {
      title: '??????',
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
              ??????
            </a>,
            <Authorized code="institutionRecordEdit" key="edit">
              <a
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                ??????
              </a>
            </Authorized>,
            <Authorized code="institutionRecordDelete" key="delete">
              <Popconfirm
                title="??????????????????"
                onConfirm={() => deleteRecord(record.id)}
              >
                <a>??????</a>
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
            `???${item.specification}???`) ||
            ''}`,
          value: item.code,
          selectable: item.level === skuValue,
          children: loopData(item.children),
        };
      }
      return {
        ...item,
        title: `${item.name}${(item.specification &&
          `???${item.specification}???`) ||
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
      title: '?????????',
      dataIndex: 'keywords',
      hideInSearch: false,
      hideInTable: true,
      tooltip: '?????????????????????????????????????????????????????????',
    },
    {
      title: '??????',
      dataIndex: 'nodeCodes',
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          placeholder="???????????????"
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
      title: '????????????',
      dataIndex: 'productCode',
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          placeholder="???????????????"
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
      title: '????????????',
      dataIndex: 'institutionCode',
      hideInTable: true,
      renderFormItem: () => (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="???????????????"
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
          message: '???????????????',
        },
      ],
      component: (
        <TreeSelect
          placeholder="???????????????"
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
      placeholder: '????????????',
    },
    nodeHead: {
      disabled: true,
      placeholder: '???????????????',
    },
    agentName: {
      component: (
        <DebounceSelect
          fetchOptions={(value: string) => onSearch(value, 'Agent')}
          placeholder="??????????????????"
          onChange={(value: any, record: any) =>
            institutionChange(value, record, 'Agent')
          }
        />
      ),
    },
    agentCode: {
      disabled: true,
      placeholder: '???????????????',
    },
    agentContacts: {
      disabled: true,
      placeholder: '??????????????????',
    },
    distributorName: {
      component: (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="??????????????????"
          onChange={(value: any, record: any) =>
            institutionChange(value, record, 'Distributor')
          }
        />
      ),
    },
    distributorCode: {
      disabled: true,
      placeholder: '???????????????',
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
    message.success('????????????');
    actionRef?.current?.reload();
  };

  const addSubmit = (values: any) => {
    addInstitutionRecord({
      ...values,
    })
      .then(() => {
        message.success('????????????');
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
      message.info('??????????????????????????????');
      return;
    }
    batchDeleteRecord({
      ids: selectedRowKeys,
    }).then(() => {
      message.success('??????????????????');
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
              <Popconfirm title="???????????????????????????" onConfirm={batchDelete}>
                <a>????????????</a>
              </Popconfirm>
            </Authorized>
            <a
              onClick={() => {
                setSelectedRowKeys([]);
              }}
            >
              ????????????
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
                ??????
              </Button>
            </Authorized>
            <Authorized code="institutionRecordImport">
              <Button onClick={() => importRef.current.visible()}>??????</Button>
            </Authorized>
            <Authorized code="institutionRecordExport">
              <Button loading={exportLoading} onClick={exportData}>
                ??????
              </Button>
            </Authorized>
            <Button loading={templateLoading} onClick={downloadTemplate}>
              ????????????
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
        title="??????????????????"
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
