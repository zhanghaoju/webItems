import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Dropdown,
  Form,
  InputNumber,
  Menu,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  TreeSelect,
  Typography,
} from 'antd';
import { getPeriodYears } from '@/services/period';
import { searchDictionary } from '@/services/dictionary';
import { DashOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getColumns,
  getPriceList,
  editPriceInfo,
  deletePrice,
  downloadPriceTemplate,
  exportPrice,
  productTree,
} from '@/services/priceControl';
import AddPriceModal from './AddPriceModal';
import { VulcanFile, Authorized, useAuth } from '@vulcan/utils';
import ModalImport from './ModalImport';
import './index.less';

export interface ActivitiesColumnsProps {
  key: string;
  value: string;
  numberValue?: any;
  editable: boolean;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: any;
  index: number;
  children: React.ReactNode;
  rules: any[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex}>
          <InputNumber
            placeholder="请输入"
            formatter={(value: any) =>
              `${
                String(value).indexOf('.') > -1
                  ? String(value).substring(0, String(value).indexOf('.') + 3)
                  : value
              }`
            }
            parser={(value: any) => value}
            min={0}
            step={0.01}
          />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default () => {
  const [currentYear, setCurrentYear] = useState<string | null>(null);
  const [systemCodeDictionary, setSystemCodeDictionary] = useState<any>({});
  const [product, setProduct] = useState<any>([]);
  const [skuValue, setSkuValue] = useState('');
  const [activitiesColumns, setActivitiesColumns] = useState<
    ActivitiesColumnsProps[]
  >([]);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState<any>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [yearData, setYearData] = useState<any>([]);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<any>({
    pageSize: 10,
    pageNo: 1,
    current: 1,
  });

  const formRef = useRef<any>();
  const actionRef = useRef<any>();
  const [editForm] = Form.useForm();
  const modalRef = useRef<any>();

  const editBtn = useAuth('secondNegotiationEdit');
  const delBtn = useAuth('secondNegotiationDelete');

  useEffect(() => {
    Promise.all([
      searchDictionary({
        systemCodes: [
          'InstitutionCategory',
          'ProductLevel',
          'SubclassDealerLevel',
        ],
      }),
      productTree(),
      getPeriodYears(),
    ]).then(([dictionary, productTree, yearsData]) => {
      const systemCodeDictionary: any = {};
      (dictionary?.data?.list || []).forEach((item: any) => {
        if (item.code === 'ProductLevel') {
          item.entries.forEach((it: any) => {
            if (it.systemValue && it.systemValue === 'SKU') {
              setSkuValue(it.value);
            }
          });
        }
        systemCodeDictionary[item.code] = item.entries;
      });
      setSystemCodeDictionary(systemCodeDictionary);
      setProduct(productTree.data || []);
      setYearData(yearsData?.data || []);
      setCurrentYear(
        (yearsData?.data || []).find((item: any) => item.isCurrent)?.id,
      );
      formRef.current.setFields([
        {
          name: 'financialYearId',
          value: (yearsData?.data || []).find((item: any) => item.isCurrent)
            ?.id,
        },
      ]);
      getList();
    });
  }, []);

  useEffect(() => {
    if (currentYear) {
      getColumns({
        financialYearId: currentYear,
      }).then(({ data }) => {
        setActivitiesColumns(data?.columns || []);
      });
    }
  }, [currentYear]);

  const loopData = (data: any) => {
    return data.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return {
          title: `${item.name}${(item.specification &&
            `（${item.specification}）`) ||
            ''}`,
          value: item.id,
          selectable: item.level === skuValue,
          children: loopData(item.children),
        };
      }
      return {
        title: `${item.name}${(item.specification &&
          `（${item.specification}）`) ||
          ''}`,
        value: item.id,
        selectable: item.level === skuValue,
      };
    });
  };

  const editPrice = async (record: any) => {
    try {
      const values = await editForm.validateFields();
      await editPriceInfo({
        ...record,
        ...values,
      });
      message.success('编辑成功');
      setEditingKey('');
      getList();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteConfirm = (record: any) => {
    deletePrice({
      ids: [record.id],
    }).then(() => {
      message.success('删除成功');
      getList({}, true);
    });
  };

  const renderInstitutionCategory = useCallback(() => {
    return (
      <Select placeholder="请选择">
        {(systemCodeDictionary['InstitutionCategory'] || []).map((it: any) => (
          <Select.Option value={it.value} key={it.value}>
            {it.name}
          </Select.Option>
        ))}
      </Select>
    );
  }, [systemCodeDictionary['InstitutionCategory']]);

  const renderColumns = useCallback((): any => {
    return [
      {
        title: '财年',
        dataIndex: 'financialYearId',
        hideInTable: true,
        order: 5,
        renderFormItem: (item: any, config: any, form: any) => (
          <Select>
            {yearData.map((it: any) => (
              <Select.Option value={it.id} key={it.id}>
                {it.financialYear}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        title: '机构关键字',
        dataIndex: 'institutionLikeField',
        hideInTable: true,
        tooltip: '机构名称、机构编码',
        order: 3,
      },
      {
        title: '经销商关键字',
        dataIndex: 'distributorLikeField',
        hideInTable: true,
        tooltip: '经销商名称、经销商编码',
        order: 2,
      },
      {
        title: '机构编码',
        dataIndex: 'institutionCode',
        search: false,
        width: 200,
      },
      {
        title: '机构名称',
        dataIndex: 'institutionName',
        search: false,
        width: 300,
      },
      {
        title: '机构类型',
        dataIndex: 'institutionType',
        valueType: 'select',
        order: 4,
        width: 100,
        renderText: (text: any) =>
          (systemCodeDictionary['InstitutionCategory'] || []).find(
            (item: any) => item.value === text,
          )?.name,
        renderFormItem: (item: any, config: any, form: any) =>
          renderInstitutionCategory(),
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        search: false,
        width: 250,
      },
      {
        title: '产品编码',
        dataIndex: 'productCode',
        search: false,
        width: 200,
      },
      {
        title: '产品规格',
        dataIndex: 'specification',
        renderFormItem: (item: any, config: any, form: any) => {
          return (
            <TreeSelect
              placeholder="请选择"
              treeData={loopData(product)}
              allowClear
            />
          );
        },
      },
      {
        title: '经销商编码',
        dataIndex: 'distributorCode',
        search: false,
      },
      {
        title: '经销商名称',
        dataIndex: 'distributorName',
        search: false,
      },
      {
        title: '经销商级别',
        dataIndex: 'distributorLevel',
        search: false,
        width: '5%',
        renderText: (text: any) =>
          (systemCodeDictionary['SubclassDealerLevel'] || []).find(
            (item: any) => item.value === text,
          )?.name,
      },
      ...activitiesColumns.map((item: ActivitiesColumnsProps) => ({
        title: item.value,
        dataIndex: item.key,
        hideInSearch: true,
        editable: true,
      })),
      {
        title: '创建人',
        dataIndex: 'createByName',
        search: false,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        search: false,
        valueType: 'dateTime',
      },
      {
        title: '更新人',
        dataIndex: 'updateByName',
        search: false,
      },
      {
        title: '更新日期',
        dataIndex: 'updateTime',
        search: false,
        valueType: 'dateTime',
      },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        search: false,
        hideInTable: !editBtn && !delBtn,
        render: (dom: any, entity: any, inedx: any) => {
          const editable = isEditing(entity);
          return editable ? (
            <Space>
              <Typography.Link onClick={() => editPrice(entity)}>
                保存
              </Typography.Link>
              <Typography.Link
                onClick={() => {
                  setEditingKey('');
                }}
              >
                取消
              </Typography.Link>
            </Space>
          ) : (
            <Space>
              <Authorized code="secondNegotiationEdit">
                <Typography.Link
                  disabled={editingKey !== ''}
                  onClick={() => {
                    setEditingKey(entity.id);
                    editForm.setFieldsValue({ ...entity });
                  }}
                >
                  修改
                </Typography.Link>
              </Authorized>
              <Authorized code="secondNegotiationDelete">
                <Popconfirm
                  title="确定要删除吗？"
                  disabled={editingKey !== ''}
                  onConfirm={() => deleteConfirm(entity)}
                >
                  <Typography.Link disabled={editingKey !== ''}>
                    删除
                  </Typography.Link>
                </Popconfirm>
              </Authorized>
            </Space>
          );
        },
      },
    ];
  }, [activitiesColumns, editingKey, yearData]);

  const isEditing = (record: any) => record.id === editingKey;

  const mergedColumns = renderColumns().map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const batchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择需要删除的数据！');
      return;
    }
    Modal.confirm({
      title: '提示',
      content: '确定删除当前选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deletePrice({
          ids: selectedRowKeys,
        }).then(() => {
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          getList({}, true);
        });
      },
    });
  };

  const downloadTemplate = async () => {
    try {
      if (!currentYear) {
        message.error('当前不存在财年');
        return;
      }
      const file: any = await downloadPriceTemplate(currentYear);
      VulcanFile.export(file);
    } catch (e) {
      console.log(e);
    }
  };

  const exportClick = async () => {
    try {
      setExportLoading(true);
      setTableLoading(true);
      const values = formRef.current.getFieldsValue();
      const file: any = await exportPrice({ ...values });
      VulcanFile.export(file);
      setExportLoading(false);
      setTableLoading(false);
    } catch (e) {
      console.log(e);
      setExportLoading(false);
      setTableLoading(false);
    }
  };

  const otherClick = ({ key }: any) => {
    switch (key) {
      case 'batchDelete':
        batchDelete();
        break;
      default:
        downloadTemplate();
        break;
    }
  };

  const importClick = ({ key }: any) => {
    modalRef.current.visible(true);
    switch (key) {
      case 'addImport':
        modalRef.current.state({
          title: '新增导入',
          uploadUrl: `institutionBargain/startImport/${currentYear}/add`,
          commitUrl: `institutionBargain/commit/${currentYear}/add`,
          cancel: () => {
            getList({}, true);
          },
        });
        break;
      default:
        modalRef.current.state({
          title: '更新导入',
          uploadUrl: `institutionBargain/startImport/${currentYear}/update`,
          commitUrl: `institutionBargain/commit/${currentYear}/update`,
          cancel: () => {
            getList({}, true);
          },
        });
        break;
    }
  };

  const getList = async (page?: any, reload: boolean = false) => {
    try {
      setTableLoading(true);
      const values = await formRef.current.validateFields();
      const res = await getPriceList(
        reload
          ? { ...values, pageNo: 1, pageSize: 10 }
          : { ...values, ...pageInfo, ...page },
      );
      setDataSource(res?.data?.list);
      setTableLoading(false);
      setPageInfo({
        pageNo: res?.data?.pageNum,
        pageSize: res?.data?.pageSize,
        total: res?.data?.total,
        current: res?.data?.pageNum,
      });
    } catch (e) {
      console.log(e);
      setTableLoading(false);
    }
  };

  return (
    <>
      <Form form={editForm} component={false} autoComplete="off">
        <ProTable<ProColumns>
          loading={tableLoading}
          form={{ autoComplete: 'off' }}
          className="price-table-wrapper"
          columns={mergedColumns}
          options={{
            fullScreen: false,
          }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          search={{
            span: 8,
          }}
          onSubmit={(params: any) => {
            setCurrentYear(params?.financialYearId);
            getList({}, true);
          }}
          onReset={() => {
            setCurrentYear(yearData.find((item: any) => item.isCurrent)?.id);
            formRef.current.setFields([
              {
                name: 'financialYearId',
                value: yearData.find((item: any) => item.isCurrent)?.id,
              },
            ]);
            getList({}, true);
          }}
          headerTitle={
            <Space>
              <Authorized code="secondNegotiationAdd">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddVisible(true)}
                >
                  添加
                </Button>
              </Authorized>
              <Authorized code="secondNegotiationImport">
                <Dropdown
                  overlay={
                    <Menu onClick={importClick}>
                      <Menu.Item key="addImport">新增导入</Menu.Item>
                      <Menu.Item key="updateImport">更新导入</Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    导入 <DownOutlined />
                  </Button>
                </Dropdown>
              </Authorized>
              <Authorized code="secondNegotiationExport">
                <Button onClick={exportClick} loading={exportLoading}>
                  导出
                </Button>
              </Authorized>
              <Dropdown
                overlay={
                  <Menu onClick={otherClick}>
                    <Menu.Item key="downloadTemplate">下载模板</Menu.Item>
                    {(useAuth('secondNegotiationDelete') && (
                      <Menu.Item key="batchDelete">批量删除</Menu.Item>
                    )) ||
                      null}
                  </Menu>
                }
              >
                <DashOutlined />
              </Dropdown>
            </Space>
          }
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any) =>
              setSelectedRowKeys(selectedRowKeys),
          }}
          rowKey="id"
          formRef={formRef}
          actionRef={actionRef}
          scroll={{ x: 3500, y: 'auto' }}
          params={{
            financialYearId: currentYear,
          }}
          dataSource={dataSource}
          pagination={{
            ...pageInfo,
            onChange: (page, pageSize) => {
              setPageInfo((value: any) => {
                return {
                  ...value,
                  pageSize,
                  pageNo: page,
                  current: page,
                };
              });
              getList({
                pageSize,
                pageNo: page,
              });
            },
          }}
        />
      </Form>
      {addVisible && (
        <AddPriceModal
          visible={addVisible}
          setAddVisible={setAddVisible}
          systemCodeDictionary={systemCodeDictionary}
          product={product}
          skuValue={skuValue}
          activitiesColumns={activitiesColumns}
          currentYear={currentYear}
          actionRef={actionRef}
          getList={getList}
        />
      )}
      <ModalImport cRef={modalRef} />
    </>
  );
};
