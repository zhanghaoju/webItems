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

const MergeRecord: React.FC = () => {
  const ref: any = useRef();
  const formRef = useRef<any>(undefined);
  const mergeRecordDetail = useAuth('mergeRecordDetail');
  const mergeRecordExport = useAuth('mergeRecordExport');

  const columns: ProColumns[] = [
    {
      title: '关键词',
      dataIndex: 'keyWord',
      hideInTable: true,
      tooltip: `可查询项：被合并机构名称、被合并机构编码、目标机构名称、目标机构编码`,
      order: 2000,
    },
    {
      title: '被合并机构',
      dataIndex: 'institutionName',
      hideInSearch: true,
      order: 20,
    },
    {
      title: '被合并机构编码',
      dataIndex: 'institutionCode',
      ellipsis: true,
      hideInSearch: true,
      order: 30,
    },
    {
      title: '目标机构',
      dataIndex: 'fromType',
      hideInSearch: true,
      order: 40,
    },
    {
      title: '目标机构编码',
      dataIndex: 'toType',
      hideInSearch: true,
      order: 50,
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      hideInSearch: true,
      order: 60,
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      order: 70,
      valueEnum: getDictionaryEnum('InstitutionCategory'),
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      hideInSearch: true,
      order: 80,
      ellipsis: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      order: 90,
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      order: 100,
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
      hideInTable: !mergeRecordDetail,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            {mergeRecordDetail && (
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
          mergeRecordExport && (
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

export default MergeRecord;
