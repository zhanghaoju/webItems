import React, { useRef, useState } from 'react';
import ProTable, {
  ActionType,
  ProColumnType,
  TableDropdown,
} from '@ant-design/pro-table';
import {
  list,
  del,
  add,
  getWaveConfig,
  waveConfig,
  downloadTemplate,
  batchDelete,
  exportExcel,
} from './api';
import { Button, message, Popconfirm, Space, Modal } from 'antd';
import { useRequest, history } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Add from '@/pages/YearConfig/DefectInstProd/components/Add';
import WaveSetting from '@/pages/YearConfig/DefectInstProd/components/WaveSetting';
import { Table, VulcanFile } from '@vulcan/utils';

const DefectInstProdList: React.FC = () => {
  const exportRequest = useRequest(exportExcel, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });
  const delRequest = useRequest(del, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef?.current?.reload();
    },
  });

  const batchDelRequest = useRequest(batchDelete, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      setSelectedRowKeys(prevState => []);
      actionRef?.current?.reload();
    },
  });

  const addRequest = useRequest(add, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功');
      addActionRef?.current?.hide();
      actionRef?.current?.reload();
    },
  });

  const waveConfigRequest = useRequest(waveConfig, {
    manual: true,
    onSuccess: () => {
      message.success('设置成功');
      waveActionRef?.current?.hide();
    },
  });

  const downloadTemplateRequest = useRequest(downloadTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  const actionRef = useRef<ActionType>();
  const addActionRef = useRef<
    ModalFormControl.Actions<DefectInsProd.ListItem>
  >();
  const waveActionRef = useRef<
    ModalFormControl.Actions<DefectInsProd.DefectInstProdConfig>
  >();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [query, setQuery] = useState<DefectInsProd.Query>();

  const handleWaveConfig = async () => {
    const res = await getWaveConfig();
    waveActionRef?.current?.show(res?.data);
  };

  const handleMoreAction = (key: string) => {
    // if (key === 'import') {
    //   history.push('/year-config/defect-inst-prod/import');
    //   return;
    // }
    if (key === 'downloadTemplateRequest') {
      downloadTemplateRequest?.run();
      return;
    }
    if (key === 'batchDelRequest') {
      if (!selectedRowKeys?.length) {
        message.info('请选择需要删除的数据');
        return;
      }
      Modal.confirm({
        title: '删除',
        icon: <ExclamationCircleOutlined />,
        content: `确定删除${selectedRowKeys?.length || 0}条数据？`,
        onOk: () => {
          batchDelRequest?.run(selectedRowKeys);
        },
      });
      return;
    }
  };

  const columns: ProColumnType<DefectInsProd.ListItem>[] = [
    {
      dataIndex: 'institutionName',
      title: '经销商名称',
    },
    {
      dataIndex: 'institutionCode',
      title: '经销商编码',
    },
    {
      dataIndex: 'institutionProvince',
      title: '省份',
      search: false,
    },
    {
      dataIndex: 'institutionCity',
      title: '城市',
      search: false,
    },
    {
      dataIndex: 'productCode',
      title: '产品编码',
    },
    {
      dataIndex: 'productName',
      title: '产品名称',
      ellipsis: true,
    },
    {
      dataIndex: 'productSpecification',
      title: '产品规格',
      ellipsis: true,
    },
    // {
    //   dataIndex: 'isExclude',
    //   title: '是否关注'
    // },
    {
      dataIndex: 'updateByName',
      title: '维护人',
      search: false,
    },
    {
      dataIndex: 'updateTime',
      title: '维护时间',
      valueType: 'dateTime',
      search: false,
    },
    {
      dataIndex: 'option',
      title: '操作',
      valueType: 'option',
      render: (dom, entity, index) => (
        <Popconfirm
          title={'确定要删除？'}
          onConfirm={() => {
            delRequest?.run(entity);
          }}
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];
  return (
    <>
      <Add
        actionRef={addActionRef}
        onSubmit={addRequest.run}
        submitting={addRequest?.loading}
      />
      <WaveSetting
        actionRef={waveActionRef}
        submitting={waveConfigRequest?.loading}
        onSubmit={waveConfigRequest.run}
      />
      <Table<DefectInsProd.ListItem, DefectInsProd.Query>
        code={'YearConfig.DefectInstProd'}
        headerTitle={
          <Space>
            <Button
              type={'primary'}
              onClick={() => addActionRef?.current?.show()}
            >
              添加
            </Button>
            <Button
              type={'default'}
              onClick={() =>
                history.push('/year-config/defect-inst-prod/import')
              }
            >
              导入
            </Button>
            <Button
              onClick={() => exportRequest.run(query || {})}
              loading={exportRequest.loading}
            >
              导出
            </Button>
            {/*<Popconfirm
              title={'确定要删除？'}
              trigger={'click'}
              onConfirm={() => {
                batchDelRequest?.run(selectedRowKeys);
              }}
            >
              <a>批量删除</a>
            </Popconfirm>*/}
            <Button onClick={() => handleWaveConfig()}>波动设置</Button>
            <TableDropdown
              onSelect={handleMoreAction}
              menus={[
                {
                  key: 'downloadTemplateRequest',
                  name: '下载模板',
                },
                // {
                //   key: 'import',
                //   name: '导入',
                // },
                {
                  key: 'batchDelRequest',
                  name: '批量删除',
                },
              ]}
            />
          </Space>
        }
        columns={columns}
        rowKey={'id'}
        rowSelection={{
          onChange: selectedRowKeys =>
            setSelectedRowKeys(selectedRowKeys as string[]),
          selectedRowKeys: selectedRowKeys,
        }}
        actionRef={actionRef}
        beforeSearchSubmit={params => {
          setQuery(params);
          return params;
        }}
        request={async params => {
          const { current, ...query } = params;
          query.pageNo = current;
          return await list(query);
        }}
      />
    </>
  );
};

export default DefectInstProdList;
