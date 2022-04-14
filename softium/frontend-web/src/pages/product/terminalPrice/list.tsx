import React, { useState, useRef, Fragment } from 'react';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, message } from 'antd';
import { useRequest } from 'umi';
import { Authorized, useAuth, VulcanFile } from '@vulcan/utils';
import moment from 'moment';
import { history } from '@@/core/history';
import { exportObj } from '@/pages/institution/util';
import ListTable from '@/pages/institution/list';
import {
  deleteTerminal,
  downloadTemplate,
  getExport,
  getList,
} from '@/services/product/terminalPrice';
import _ from 'lodash';
import TerminalEdit from '@/pages/product/terminalPrice/edit';
import AddModal from '@/pages/product/terminalPrice/AddModal';

const List: React.FC = () => {
  const childRef: any = useRef<any>();
  const addRef = useRef<any>();
  const [params, setParams] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [detailCodes, setDetailCodes] = useState<any>({});
  const [type, setType] = useState<string>('');

  const terminalDetail = useAuth('terminalPriceDetail');
  const terminalEdit = useAuth('terminalPriceEdit');
  const terminalDel = useAuth('terminalPriceDel');
  const actionLen: number = [terminalDetail, terminalEdit, terminalDel].filter(
    (item: any) => item && item.menuId,
  ).length;

  const reload = (text: string) => {
    text && message.success(text);
    childRef.current.reload();
  };

  let columns: any[] = [
    {
      title: '关键词',
      dataIndex: 'productCode',
      hideInTable: true,
      tooltip: `可查询项：产品编码`,
      order: 1000,
    },
    {
      title: '机构',
      dataIndex: 'institutionCode',
      hideInTable: true,
      tooltip: `可查询项：上游机构编码、终端机构编码`,
      order: 500,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      hideInSearch: true,
      ellipsis: true,
      order: 10,
      width: 200,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      hideInSearch: true,
      ellipsis: true,
      order: 20,
      width: 200,
    },
    {
      title: '产品规格',
      dataIndex: 'specification',
      hideInSearch: true,
      ellipsis: true,
      order: 20,
      width: 200,
    },
    {
      title: '上游机构',
      dataIndex: 'upInstitutionName',
      order: 30,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '上游机构编码',
      dataIndex: 'upInstitutionCode',
      order: 40,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '终端机构',
      dataIndex: 'terminalName',
      order: 50,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '终端机构编码',
      dataIndex: 'terminalCode',
      order: 60,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      hideInSearch: true,
      ellipsis: true,
      order: 70,
      width: 90,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      hideInSearch: true,
      ellipsis: true,
      renderText: (text: any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
      width: 120,
      order: 80,
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
      hideInSearch: true,
      ellipsis: true,
      order: 90,
      width: 90,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      hideInSearch: true,
      ellipsis: true,
      renderText: (text: any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
      order: 100,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: actionLen * 60,
      hideInTable: !terminalDetail && !terminalEdit && !terminalDel,
      order: 300,
      render: (text: string, record: any) => (
        <Fragment>
          {terminalDetail && (
            <>
              <a
                onClick={() => {
                  setType('view');
                  setDetail(record);
                  setDetailCodes({
                    productCode: record.productCode,
                    upInstitutionCode: record.upInstitutionCode,
                    terminalCode: record.terminalCode,
                  });
                  setVisible(true);
                }}
              >
                查看
              </a>
              <Divider type="vertical" />
            </>
          )}
          {terminalEdit && (
            <>
              <a
                onClick={() => {
                  setType('edit');
                  setDetail(record);
                  setDetailCodes({
                    productCode: record.productCode,
                    upInstitutionCode: record.upInstitutionCode,
                    terminalCode: record.terminalCode,
                  });
                  setVisible(true);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
            </>
          )}
          {terminalDel && (
            <Popconfirm
              placement="topRight"
              onConfirm={() => {
                deleteTerminal([
                  {
                    productCode: record.productCode,
                    upInstitutionCode: record.upInstitutionCode,
                    terminalCode: record.terminalCode,
                  },
                ]).then(() => {
                  reload('删除成功');
                });
              }}
              title="确定删除当前数据？"
              icon={<QuestionCircleOutlined />}
            >
              <a>删除价格</a>
            </Popconfirm>
          )}
        </Fragment>
      ),
    },
  ];

  const exportData = useRequest(getExport, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  const template = useRequest(downloadTemplate, exportObj);

  const headerTitle: any = () => {
    return (
      <div className="btn-container">
        <Authorized code="terminalPriceAdd">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addRef.current.toggleVisible()}
          >
            添加
          </Button>
        </Authorized>
        <Authorized code="terminalPriceImport">
          <Button
            onClick={() => history.push('/product/price/terminalPrice/import')}
          >
            导入
          </Button>
        </Authorized>
        <Authorized code="terminalPriceExport">
          <Button
            onClick={() => exportData.run(params)}
            loading={exportData.loading}
          >
            导出
          </Button>
        </Authorized>
        <Authorized code="terminalPriceTemplate">
          <Button onClick={() => template.run()} loading={template.loading}>
            下载模板
          </Button>
        </Authorized>
      </div>
    );
  };

  const batchDelete = async (
    selectedRowKeys: any[],
    onCleanSelected: any,
    selectedRows: any[],
  ) => {
    let codes: any[] = [];
    selectedRows.forEach(item => {
      codes.push({
        productCode: item.productCode,
        upInstitutionCode: item.upInstitutionCode,
        terminalCode: item.terminalCode,
      });
    });
    deleteTerminal(codes).then(() => {
      reload('批量删除成功');
      onCleanSelected && onCleanSelected();
    });
  };

  return (
    <>
      <ListTable
        code="t_mdm_terminal_price"
        cRef={childRef}
        columns={columns}
        getList={getList}
        scrollX={1500}
        headerTitle={headerTitle}
        hideSelection={false}
        params={params}
        batchDelete={batchDelete}
        rowKey={(record: any) =>
          `${record.productCode}${record.upInstitutionCode}${record.terminalCode}`
        }
        bathDeleteAuth={useAuth('terminalPriceBatchDel')}
        beforeSearchSubmit={(params: any) => {
          params && setParams(_.cloneDeep(params));
        }}
      />
      {visible && (
        <TerminalEdit
          visible={visible}
          setVisible={setVisible}
          detail={detail}
          detailCodes={detailCodes}
          type={type}
        />
      )}
      <AddModal ref={addRef} actionRef={childRef} />
    </>
  );
};

export default List;
