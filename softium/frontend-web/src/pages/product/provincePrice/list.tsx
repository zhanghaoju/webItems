import React, { useState, useRef } from 'react';
import { Button, Space, Popconfirm, message } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getDictionaryEnum } from '@/pages/institution/util';
import { history } from '@@/core/history';
import { useRequest } from 'umi';
import { VulcanFile, Authorized } from '@vulcan/utils';
import {
  getExport,
  downloadTemplate,
  getPriceList,
  deletePrice,
  batchDelete,
} from '@/services/provincePrice';
import DetailModal from './modal';
import AddModal from '@/pages/product/provincePrice/AddModal';

import './style/index.less';

interface ColumnItemProps {
  id?: string;
  category?: string;
  provinceId: string;
  productCode: string;
}

const Provinceprice = (props: any) => {
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    current: 1,
    pageNo: 1,
    total: 0,
  });
  const modalRef = useRef<any>();
  const priceRef = useRef<any>();
  const addModalRef = useRef<any>();
  const [paramsBody, setParams] = useState({});
  const detail = (record: any) => {
    modalRef.current.params({
      visible: true,
      record,
    });
  };
  const columns: ProColumns<ColumnItemProps>[] = [
    {
      title: '关键词',
      dataIndex: 'keyword',
      hideInTable: true,
      tip: '可查询项：产品名称、产品编码',
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      ellipsis: true,
      search: false,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
      search: false,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      ellipsis: true,
      search: false,
    },
    {
      title: '省份',
      dataIndex: 'provinceId',
      ellipsis: true,
      valueEnum: getDictionaryEnum('Region'),
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      ellipsis: true,
      valueType: 'date',
      search: false,
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
      ellipsis: true,
      search: false,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      ellipsis: true,
      valueType: 'date',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      width: '20%',
      render: (text, record, index) => {
        return (
          <Space>
            <a key="look" onClick={() => detail(record)}>
              详情
            </a>
            <Authorized code="provincePriceDelete">
              <a style={{ cursor: 'default', color: '#eee' }}>|</a>
              <Popconfirm
                placement="top"
                title={'确定要删除此项吗？'}
                onConfirm={() => {
                  deleteFn(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a key="del">删除价格</a>
              </Popconfirm>
            </Authorized>
          </Space>
        );
      },
    },
  ];
  const tableAlertRender = (selectedRows: any[], onCleanSelected: any) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space size={24}>
          <span>已选 {selectedRows.length} 项</span>
        </Space>
        <Space size={16}>
          <Authorized code="provincePriceDelete">
            <Popconfirm
              title="您确定要删除吗？"
              onConfirm={() => listBatchDelete(selectedRows, onCleanSelected)}
            >
              <a>批量删除</a>
            </Popconfirm>
          </Authorized>
        </Space>
      </div>
    );
  };
  const batchDeleteFn = async (paramsList: any[], onCleanSelected: any) => {
    try {
      await batchDelete(paramsList);
      onCleanSelected();
      message.success('批量删除成功');
      priceRef.current.reload();
    } catch (e) {
      console.log(e);
    }
  };
  const deleteFn = async (record: any) => {
    try {
      await deletePrice({
        productCode: record?.productCode,
        provinceId: record?.provinceId,
      });
      message.success('删除成功');
      priceRef.current.reload();
    } catch (e) {
      console.log(e);
    }
  };
  const listBatchDelete = (selectedRows: any[], onCleanSelected: any) => {
    let paramsList = selectedRows.map(item => {
      return { productCode: item.productCode, provinceId: item.provinceId };
    });
    batchDeleteFn(paramsList, onCleanSelected);
  };
  const exportBtn = useRequest(getExport.bind(this, paramsBody), {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });
  const exportObj = {
    manual: true,
    formatResult: (res: any) => res,
    onSuccess: (res: any) => VulcanFile.export(res),
  };
  const download = useRequest(downloadTemplate, exportObj);
  const HeaderTitle: any = () => {
    return (
      <div className="btn-container">
        <Authorized code="provincePriceAdd">
          <Button
            type="primary"
            onClick={() => addModalRef.current.toggleVisible()}
          >
            添加
          </Button>
        </Authorized>
        <Authorized code="provincePriceImport">
          <Button
            className="btn-item"
            key="import"
            type="default"
            onClick={() => history.push('/product/price/provincePrice/import')}
          >
            导入
          </Button>
        </Authorized>
        <Authorized code="provincePriceExport">
          <Button
            className="btn-item"
            key="export"
            type="default"
            onClick={() => exportBtn.run()}
            loading={exportBtn.loading}
          >
            导出
          </Button>
        </Authorized>
        <Authorized code="provincePriceTemplate">
          <Button
            className="btn-item"
            key="template"
            type="default"
            loading={download.loading}
            onClick={() => download.run()}
          >
            下载模板
          </Button>
        </Authorized>
      </div>
    );
  };
  return (
    <>
      <ProTable<ColumnItemProps, String[]>
        columns={columns}
        form={{ autoComplete: 'off' }}
        actionRef={priceRef}
        search={{
          span: 8,
        }}
        rowSelection={{}}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => tableAlertRender(selectedRows, onCleanSelected)}
        scroll={{ x: 'auto' }}
        request={(params: any) => {
          setParams(params);
          return getPriceList({
            ...params,
            pageNo: params?.current,
          });
        }}
        headerTitle={<HeaderTitle />}
        postData={(data: any) => {
          setPageInfo({
            pageSize: data.pageSize,
            current: data.pageNo,
            pageNo: data.pageNo,
            total: data.total,
          });
          return data?.list;
        }}
        pagination={{
          ...pageInfo,
        }}
        rowKey={record => record?.provinceId + record?.productCode}
      />
      <DetailModal cRef={modalRef} />
      <AddModal ref={addModalRef} actionRef={priceRef} />
    </>
  );
};
export default Provinceprice;
