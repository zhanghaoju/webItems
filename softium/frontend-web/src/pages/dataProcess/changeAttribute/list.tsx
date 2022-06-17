import React, { ReactNode, useRef } from 'react';
import { Button } from 'antd';
import { useAuth, VulcanFile } from '@vulcan/utils';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { typeChangeExport, typeChangeList } from '@/services/institution';
import Detail from './detail';
import moment from 'moment';
import { useRequest } from '@@/plugin-request/request';
import { getDictionaryEnum } from '@/pages/institution/util';
import { transformToTableRequest } from '@/utils/dataConversion';

const DataProcess: React.FC = () => {
  const ref: any = useRef();
  const formRef = useRef<any>(undefined);
  const typeChangeDetail = useAuth('typeChangeDetail');
  const typeChangExport = useAuth('typeChangExport');

  const columns: ProColumns[] = [
    {
      title: '关键词',
      dataIndex: 'keyWord',
      hideInTable: true,
      tooltip: `可查询项：机构名称、机构编码`,
      order: 2000,
    },
    {
      title: '机构名称',
      dataIndex: 'institutionName',
      hideInSearch: true,
      order: 20,
    },
    {
      title: '机构编码',
      dataIndex: 'institutionCode',
      ellipsis: true,
      hideInSearch: true,
      order: 30,
    },
    {
      title: '原始属性',
      dataIndex: 'fromType',
      hideInSearch: true,
      order: 40,
      valueEnum: getDictionaryEnum('InstitutionCategory'),
    },
    {
      title: '变更后属性',
      dataIndex: 'toType',
      hideInSearch: true,
      order: 50,
      valueEnum: getDictionaryEnum('InstitutionCategory'),
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      hideInSearch: true,
      order: 60,
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      hideInSearch: true,
      order: 70,
      ellipsis: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      order: 80,
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      order: 80,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: 60,
      order: 20000,
      hideInTable: !typeChangeDetail,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            {typeChangeDetail && (
              <span onClick={() => detail(record)}>查看</span>
            )}
          </div>
        );
      },
    },
  ];

  const detail = (id: string) => {
    ref.current.open(id);
  };

  const exportData = useRequest(typeChangeExport, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  return (
    <>
      <ProTable
        columns={columns}
        form={{ autoComplete: 'off' }}
        headerTitle={
          typeChangExport && (
            <Button
              type="default"
              loading={exportData.loading}
              onClick={() => exportData.run(formRef.current.getFieldsValue())}
            >
              导出
            </Button>
          )
        }
        rowKey={record =>
          record.createTime +
          record.fromType +
          record.toType +
          record.institutionCode +
          record.institutionId
        }
        size="small"
        formRef={formRef}
        request={(params: any, filter: any, sort: any) => {
          if (params.createTime) {
            params.startCreateTime = moment(params.createTime[0]).valueOf();
            params.endCreateTime = moment(params.createTime[1]).valueOf();
          }
          const formValues = formRef.current.getFieldsValue();
          return transformToTableRequest(
            {
              ...params,
              ...filter,
              ...sort,
              pageNo: params.current,
              counting: true,
              ...formValues,
            },
            typeChangeList,
          );
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      <Detail cRef={ref} />
    </>
  );
};

export default DataProcess;
