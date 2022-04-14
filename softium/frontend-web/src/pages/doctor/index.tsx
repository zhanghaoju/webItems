import React, { ReactNode, useState } from 'react';
import { connect } from 'dva';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getList } from '@/services/doctor';
import storage from '@/utils/storge';
import { Button } from 'antd';
import { history } from '@@/core/history';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';

interface DoctorProps {
  doctor: any;
  dispatch: any;
}

interface ColumnItemProps {
  id: String;
  category: string;
}

const Doctor: React.FC<DoctorProps> = () => {
  const doctorDepartment: any[] = getDictionaryBySystemCode('DoctorDepartment');
  const state: any[] = getDictionaryBySystemCode('State');
  const gender: any[] = getDictionaryBySystemCode('Gender');
  const licenseType: any[] = getDictionaryBySystemCode('LicenseType');
  let columns: any[] = [
    {
      title: '医生编码',
      dataIndex: 'code',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      ellipsis: true,
      search: false,
      renderText: (text: string) => {
        return getNameByValue(gender, text);
      },
    },
    {
      title: '医院名称',
      dataIndex: 'institutionName',
      ellipsis: true,
    },
    {
      title: '所属医院编码',
      dataIndex: 'institution',
      ellipsis: true,
    },
    {
      title: '所属科室',
      dataIndex: 'department',
      ellipsis: true,
      valueEnum: {
        1: { text: '数据导入', status: 'import' },
        2: { text: '数据匹配', status: 'match' },
        3: { text: '数据提交', status: 'submit' },
      },
      renderText: (text: string) => {
        return getNameByValue(doctorDepartment, text);
      },
    },
    {
      title: '临床职称',
      dataIndex: 'clinicalTitle',
      ellipsis: true,
      renderText: (text: string) => {
        return getNameByValue(licenseType, text);
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      valueEnum: {
        Active: { text: '生效', status: 'Active' },
        Inactive: { text: '无效', status: 'Inactive' },
      },
      renderText: (text: string) => {
        return getNameByValue(state, text);
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      width: '11%',
      render: (text: ReactNode, record: any) => {
        return (
          <>
            <Button
              key="detail"
              type="link"
              onClick={() => history.push(`/doctor/detail/${record.id}`)}
            >
              查看
            </Button>
            <Button
              key="update"
              type="link"
              onClick={() => history.push(`/doctor/detail/${record.id}`)}
            >
              修改
            </Button>
          </>
        );
      },
    },
  ];
  const [pageInfo, setPageInfo] = useState({
    pageSize: 20,
    current: 1,
    total: 0,
  });

  return (
    <>
      <ProTable<ColumnItemProps, String[]>
        columns={columns}
        form={{ autoComplete: 'off' }}
        scroll={{ x: 'auto' }}
        request={(params, sort, filter) => {
          return getList({
            tenantId: storage && storage.get('userInfo')?.tenantId,
            ...params,
            ...sort,
            ...filter,
          });
        }}
        postData={(data: any) => {
          setPageInfo({
            pageSize: data.pageSize,
            current: data.pageNum,
            total: data.total,
          });
          return data.list;
        }}
        pagination={{
          ...pageInfo,
          showQuickJumper: true,
        }}
        rowKey="id"
        toolBarRender={() => [
          <Button key="add" type="primary">
            添加
          </Button>,
        ]}
      />
    </>
  );
};

export default connect(({ dispatch, doctor }: DoctorProps) => ({
  doctor,
  dispatch,
}))(Doctor);
