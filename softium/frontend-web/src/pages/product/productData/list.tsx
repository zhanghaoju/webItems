import React, { useEffect, useState, useRef, Fragment } from 'react';
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Popconfirm,
  message,
  Dropdown,
  Menu,
  Spin,
} from 'antd';
import { useRequest } from 'umi';
import { Table, useAuth, VulcanFile } from '@vulcan/utils';
import DetailModal from './detail/modal';
import ProductDetail from './detail';
import BatchNumber from '@/pages/product/productData/detail/BatchNumber';
import {
  deleteProduct,
  downloadTemplate,
  getDetail,
  getExport,
  getList,
  updateStatus,
  insertEdit,
} from '@/services/product/product';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import './index.less';
import { PlusOutlined } from '@ant-design/icons/lib';
import { history } from '@@/core/history';
import { exportObj, getColumns } from '@/pages/institution/util';
import {
  downloadBatchNoTemplate,
  exportProductBatchNo,
} from '@/services/product/ProductBatchNo';
import { handleColumns, handleTag } from '@/utils/utils';
import GModal from '@/components/modal';
import { ProductColumns } from './columns';
import _ from 'lodash';

const List: React.FC = () => {
  const ref = useRef<any>();
  const formRef = useRef<any>();
  const modalRef: any = useRef<any>();
  const [initOptions, setOptions] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [fields, setFields] = useState<any>({
    extFields: [],
    detailFields: [],
    formFields: [],
    tableFields: [],
  });
  const [params, setParams] = useState<any>({});

  const productLevel: any[] = getDictionaryBySystemCode('ProductLevel');
  const findNode =
    (productLevel || []).find(item => item.systemValue === 'SKU') || {};
  const lastLevel: string = findNode.value || '';
  const [spinning, setSpinning] = useState<boolean>(false);

  const productAdd = useAuth('productAdd');
  const productExport = useAuth('productExport');
  const productBatchNoExport = useAuth('productBatchNoExport');
  const productImport = useAuth('productImport');
  const productBatchNoImport = useAuth('productBatchNoImport');
  const productTemplate = useAuth('productTemplate');
  const productBatchNoTemplate = useAuth('productBatchNoTemplate');
  const productDetail = useAuth('productDetail');
  const productEdit = useAuth('productEdit');
  const productState = useAuth('productState');
  const productDel = useAuth('productDel');
  const actionLen: number = [
    productDetail,
    productEdit,
    productState,
    productDel,
  ].filter((item: any) => item && item.menuId).length;

  useEffect(() => {
    const request = async () => {
      await handleTag('Product');
      const fields: any = await getColumns('t_mdm_product');
      const result: any = await handleColumns('t_mdm_product', ProductColumns);
      setFields({
        extFields: result.extFields,
        detailFields: result.detailFields,
        formFields: result.formFields,
        tableFields: result.tableFields,
      });
      setParams({ searchErpCode: fields.searchErpCode });
    };
    request().then();
  }, [setParams]);

  const reload = (text: string) => {
    text && message.success(text);
    ref.current && ref.current.reload();
  };

  const detail = (record: any) => {
    modalRef.current.visible(true);
    modalRef.current.params(record, fields);
    if (record.level === lastLevel) {
      modalRef.current.setDetailTabs([
        { title: '基础信息', component: ProductDetail },
        { title: '批号', component: BatchNumber },
      ]);
      return;
    }
    modalRef.current.setDetailTabs([
      { title: '基础信息', component: ProductDetail },
    ]);
  };

  const add = () => {
    const { formFields, extFields } = fields;
    const newFormFields = _.cloneDeep(formFields);

    const stateField: any = newFormFields.find((t: any) => t.name === 'state');
    stateField.args.disabled = true;

    const unitField: any = newFormFields.find((t: any) => t.name === 'unit');
    unitField.args.requiredObj = { level: lastLevel };

    const priceField: any = newFormFields.find((t: any) => t.name === 'price');
    priceField.args.requiredObj = { level: lastLevel };

    const specificationField: any = newFormFields.find(
      (t: any) => t.name === 'specification',
    );
    specificationField.args.requiredObj = { level: lastLevel };

    const parentNameField: any = newFormFields.find(
      (t: any) => t.name === 'parentName',
    );
    const levels: string[] = [];
    productLevel.forEach((item, index) => index > 0 && levels.push(item.value));
    parentNameField.args.disabledObj = { level: levels };
    parentNameField.args.requiredObj = { level: levels };

    setVisible(true);
    setOptions({
      fields: newFormFields,
      extFields,
      initialValues: { state: 'Active' },
      attr: { okText: '提交' },
    });
  };

  const edit = (record: any) => {
    const { formFields, extFields } = fields;
    const newFormFields = _.cloneDeep(formFields);
    const codeField: any = newFormFields.find((t: any) => t.name === 'code');
    codeField.args.disabled = true;

    const levelField: any = newFormFields.find((t: any) => t.name === 'level');
    levelField.args.disabled = true;

    const parentNameField: any = newFormFields.find(
      (t: any) => t.name === 'parentName',
    );
    parentNameField.args.disabled = true;

    const unitField: any = newFormFields.find((t: any) => t.name === 'unit');
    unitField.args.requiredObj = { level: lastLevel };

    const priceField: any = newFormFields.find((t: any) => t.name === 'price');
    priceField.args.requiredObj = { level: lastLevel };

    const specificationField: any = newFormFields.find(
      (t: any) => t.name === 'specification',
    );
    specificationField.args.requiredObj = { level: lastLevel };

    setVisible(true);
    setOptions({
      fields: newFormFields,
      extFields,
      params: { id: record.id },
      handleData,
      requestDetail: getDetail,
      attr: { okText: '提交' },
    });
  };

  const handleData = (data: any) => {
    if (_.isArray(data.tag)) {
      const tags: string[] = [];
      data.tag.forEach((item: any) => tags.push(item.tagId));
      data.tag = tags;
    }
    data.parentLevel = data.level;
  };

  const formatColumns = () => {
    const { tableFields } = fields;
    return tableFields.concat([
      {
        title: '操作',
        dataIndex: 'action',
        hideInSearch: true,
        fixed: 'right',
        width: actionLen * 60,
        hideInTable:
          !productDetail && !productEdit && !productState && !productDel,
        order: 3000,
        render: (text: string, record: { id: any; state: any }) => (
          <Fragment>
            {productDetail && (
              <>
                <a onClick={() => detail(record)}>查看</a>
                <Divider type="vertical" />
              </>
            )}
            {productEdit && (
              <>
                <a onClick={() => edit(record)}>编辑</a>
                <Divider type="vertical" />
              </>
            )}
            {productState && (
              <Popconfirm
                placement="topRight"
                onConfirm={() => {
                  switchStatus(record);
                }}
                title={`您确定要设为${
                  record.state === 'Active' ? '失效' : '生效'
                }吗？`}
                icon={<QuestionCircleOutlined />}
              >
                <a>{record.state === 'Active' ? '设为失效' : '设为生效'}</a>
                <Divider type="vertical" />
              </Popconfirm>
            )}
            {productDel && (
              <Popconfirm
                placement="topRight"
                onConfirm={() => {
                  setSpinning(true);
                  deleteProduct({ id: record.id })
                    .then(() => {
                      setSpinning(false);
                      reload('删除成功');
                    })
                    .catch(() => {
                      setSpinning(false);
                    });
                }}
                title={() => {
                  return (
                    <span style={{ display: 'block', width: 200 }}>
                      主数据的别名和级别（若有）都将一并删除，删除后无法恢复，确认要删除吗？
                    </span>
                  );
                }}
                icon={<QuestionCircleOutlined />}
              >
                <a>删除</a>
              </Popconfirm>
            )}
          </Fragment>
        ),
      },
    ]);
  };

  const switchStatus = (record: any) => {
    const flag: boolean = record.state.toLowerCase() == 'active';
    const state: string = flag ? 'Inactive' : 'Active';
    updateStatus({ id: record.id, state }).then((res: any) => {
      reload(`${flag ? '失效成功' : '生效成功'}`);
    });
  };

  const exportBtn = useRequest(getExport, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => VulcanFile.export(res),
  });

  const exportBatchBtn = useRequest(exportProductBatchNo, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => VulcanFile.export(res),
  });

  const download = useRequest(downloadTemplate, exportObj);
  const downloadBatchNo = useRequest(downloadBatchNoTemplate, exportObj);

  const HeaderTitle: any = () => {
    return (
      <div className="btn-container">
        {productAdd ? (
          <Button className="btn-item" key="add" type="primary" onClick={add}>
            <PlusOutlined />
            添加
          </Button>
        ) : null}
        {productImport || productBatchNoImport ? (
          <Dropdown
            className="btn-item"
            overlay={
              <Menu>
                {productImport && (
                  <Menu.Item onClick={() => history.push('/product/import')}>
                    产品导入
                  </Menu.Item>
                )}
                {productBatchNoImport && (
                  <Menu.Item
                    onClick={() => history.push('/product/batchNoImport')}
                  >
                    批号导入
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button>
              导入 <DownOutlined />
            </Button>
          </Dropdown>
        ) : null}
        {productExport || productBatchNoExport ? (
          <Dropdown
            className="btn-item"
            overlay={
              <Menu>
                {productExport && (
                  <Menu.Item onClick={() => exportBtn.run()}>
                    产品导出
                  </Menu.Item>
                )}
                {productBatchNoExport && (
                  <Menu.Item onClick={() => exportBatchBtn.run()}>
                    批号导出
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button loading={exportBtn.loading || exportBatchBtn.loading}>
              导出 <DownOutlined />
            </Button>
          </Dropdown>
        ) : null}
        {productTemplate || productBatchNoTemplate ? (
          <Dropdown
            className="btn-item"
            overlay={
              <Menu>
                {productTemplate && (
                  <Menu.Item onClick={() => download.run()}>产品模板</Menu.Item>
                )}
                {productBatchNoTemplate && (
                  <Menu.Item onClick={() => downloadBatchNo.run()}>
                    批号模板
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button loading={download.loading || downloadBatchNo.loading}>
              下载模板 <DownOutlined />
            </Button>
          </Dropdown>
        ) : null}
      </div>
    );
  };

  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageNo: 1,
    pageSize: 10,
    total: 0,
  });

  const submitData = (data: any, sourceData: any, setSpinning: any) => {
    if (_.isArray(data.tag)) {
      const tags: any[] = [];
      data.tag.forEach((item: any) => tags.push({ tagId: item }));
      data.tag = tags;
    }
    if (data.taxRate && !/\./g.test(data.taxRate + ''))
      data.taxRate = data.taxRate.toFixed(2);
    insertEdit(data)
      .then(() => {
        setVisible(false);
        reload(data.id ? '编辑成功' : '添加成功');
      })
      .catch(() => setSpinning(false));
  };

  if (Object.keys(params).length === 0) return null;

  return (
    <div className="product-expandable-table">
      <Spin size="large" spinning={spinning}>
        <Table
          code="t_mdm_product"
          columns={formatColumns()}
          form={{ autoComplete: 'off' }}
          options={{ fullScreen: false, reload: true, setting: true }}
          tableLayout={'fixed'}
          scroll={{ x: 4000 }}
          sticky={true}
          actionRef={ref}
          formRef={formRef}
          params={{ ...params }}
          request={(params: any, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            // console.log(params, sorter, filter);
            if (params.keyWords) {
              params.keyWords = params.keyWords.replace(/(^\s+)|(\s+$)/g, '');
            }
            return getList({
              ...params,
              ...sorter,
              ...filter,
              counting: true,
              pageNo: params?.current,
            });
          }}
          postData={(data: any) => {
            setPageInfo({
              current: data.pageNo,
              pageNo: data.pageNo,
              pageSize: data.pageSzie,
              total: data.total,
            });
            return data.list;
          }}
          rowKey="id"
          pagination={{
            ...pageInfo,
            showQuickJumper: true,
          }}
          headerTitle={<HeaderTitle />}
        />
      </Spin>
      <DetailModal cRef={modalRef} fields={fields} />
      {visible && (
        <GModal
          options={initOptions}
          visible={visible}
          callback={(values: any, sourceData: any, setSpinning: any) =>
            submitData(values, sourceData, setSpinning)
          }
          setVisible={setVisible}
        />
      )}
    </div>
  );
};

export default List;
