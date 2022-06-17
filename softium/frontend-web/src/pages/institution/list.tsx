import React, { useImperativeHandle, useRef, useState } from 'react';
import { Space, Popconfirm, Spin } from 'antd';
import { getTransformDictionary } from '@/pages/institution/util';
import { Table } from '@vulcan/utils';
import moment from 'moment';
import { transformToTableRequest } from '@/utils/dataConversion';

let institutionDataList: any = [];
const ListTable = (props: any) => {
  const actionRef = useRef<any>(undefined);
  const formRef = useRef<any>(undefined);
  const [spinning, setSpinning] = useState<boolean>(false);
  const {
    columns,
    getList,
    scrollX,
    headerTitle,
    hideSelection,
    hideSearch,
    params,
    beforeSearchSubmit,
    renderText,
    batchDelete,
    bathDeleteAuth,
    code,
    bathUpdateAuth,
    batchUpdate,
    rowKey,
    batchAddAuth,
    batchAdd,
    rowSelection,
  } = props;
  const HeaderTitle: any = headerTitle;
  const [searchParams, setSearchParams] = useState(params);

  const reload = (data?: any) => {
    const { current } = actionRef;
    if (current) {
      if (params.reloadType === 'search') {
        actionRef.current.setPageInfo({ current: 1 });
      }
      data = data ? data : { ...params, reloadType: '' };
      setSearchParams(data);
      current.reload();
    }
  };

  const getDataList = () => institutionDataList;
  const toggleSpinning = () => setSpinning(!spinning);
  const getSearchParams = () => formRef.current.getFieldsValue();

  useImperativeHandle(props.cRef, () => ({
    reload,
    getDataList,
    toggleSpinning,
    getSearchParams,
  }));

  const tableAlertRender = (
    selectedRowKeys: any[],
    selectedRows: any[],
    onCleanSelected: any,
  ) => {
    return hideSelection ? null : (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space size={24}>
          <span>已选 {selectedRowKeys.length} 项</span>
          <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
            取消选择
          </a>
        </Space>
        <Space size={16}>
          {bathDeleteAuth && (
            <Popconfirm
              title="您确定要删除吗？"
              onConfirm={() =>
                listBatchDelete(selectedRowKeys, onCleanSelected, selectedRows)
              }
            >
              <a>批量删除</a>
            </Popconfirm>
          )}
          {bathUpdateAuth && (
            <a
              onClick={() => {
                batchUpdate(selectedRowKeys, onCleanSelected);
              }}
            >
              批量修改
            </a>
          )}
          {batchAddAuth && (
            <a onClick={() => batchAdd(selectedRowKeys, onCleanSelected)}>
              批量添加
            </a>
          )}
        </Space>
      </div>
    );
  };

  const listBatchDelete = (
    selectedRowKeys: any[],
    onCleanSelected: any,
    selectedRows: any[] = [],
  ) => {
    batchDelete && batchDelete(selectedRowKeys, onCleanSelected, selectedRows);
  };

  if (columns.length === 0) return null;

  return (
    <Spin size="large" spinning={spinning}>
      <Table
        code={code}
        columns={columns.sort((a: any, b: any) => a.order - b.order)}
        search={hideSearch ? false : {}}
        sticky={true}
        scroll={{ x: scrollX || 'max-content' }}
        tableLayout={'fixed'}
        actionRef={actionRef}
        formRef={formRef}
        form={{ autoComplete: 'off' }}
        rowSelection={hideSelection ? false : rowSelection ? rowSelection : {}}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => tableAlertRender(selectedRowKeys, selectedRows, onCleanSelected)}
        tableAlertOptionRender={() => null}
        request={async (params: any, sort, filter) => {
          if (params.likeField && typeof params.likeField === 'string') {
            params.likeField = params.likeField.replace(/(^\s+)|(\s+$)/g, '');
          }
          if (params.createTime && Array.isArray(params.createTime)) {
            params.createTime[0] = moment(params.createTime[0]).valueOf();
            params.createTime[1] = moment(params.createTime[1]).valueOf();
          }
          beforeSearchSubmit && beforeSearchSubmit(params);
          const data: any = await transformToTableRequest(
            {
              ...params,
              ...filter,
              ...sort,
              pageNo: params.current,
              ...searchParams,
              counting: true,
            },
            getList,
          );

          const list: any[] = await getTransformDictionary(
            data.data,
            renderText,
          );
          institutionDataList = list;
          data.data = list;
          return data;
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        rowKey={rowKey || 'id'}
        headerTitle={HeaderTitle ? <HeaderTitle /> : null}
      />
    </Spin>
  );
};

export default ListTable;
