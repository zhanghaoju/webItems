import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  institutionUploadTemplateLoad,
  institutionUploadTemplateDelete,
} from '@/services/institutionStorageConfig';
import { history } from 'umi';
import { connect } from 'dva';
import { Authorized, Table } from '@vulcan/utils';
import styles from './index.less';
import { FormInstance } from 'antd/lib/form';

interface UploadTemplateConfigProps {
  uploadTemplateConfig: any;
  dispatch: any;
}

interface GithubIssueItem {
  id?: string;
  distributorCode?: string;
  distributorName?: string;
  fileName?: string;
  businessValue?: string;
  headerRow?: string;
  businessDataType?: string;
  businessSheetType?: string;
}

const UploadTemplateConfig: React.FC<UploadTemplateConfigProps> = props => {
  useEffect(() => {}, []);

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '经销商编码',
      dataIndex: 'distributorCode',
      valueType: 'text',
      ellipsis: true,
      width: '9%',
    },
    {
      title: '经销商名称',
      dataIndex: 'distributorName',
      ellipsis: true,
      valueType: 'text',
      width: '24%',
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      valueType: 'text',
      ellipsis: true,
      width: '18%',
    },
    {
      title: '数据类型标识',
      dataIndex: 'businessValue',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '表头所在行',
      dataIndex: 'headerRow',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '业务类型(系统)',
      dataIndex: 'businessDataType',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      width: '10%',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.businessDataType.map((item: any) => {
            return <div>{item}</div>;
          })}
        </div>
      ),
    },
    {
      title: '业务类型(文件)',
      dataIndex: 'businessSheetType',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      width: '10%',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.businessSheetType.map((item: any) => {
            return <div>{item}</div>;
          })}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      render: (text: any, record: any, index: any) => (
        <div>
          <Authorized code={'manualUploadStorageConfig-view'}>
            <a
              style={{ marginRight: '10px' }}
              onClick={() =>
                history.push(
                  `/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig/uploadTemplateConfig/detail?distributorName=${record.distributorName}&distributorCode=${record.distributorCode}&fileName=${record.fileName}&source=3`,
                )
              }
            >
              查看
            </a>
          </Authorized>
          <Authorized code={'manualUploadStorageConfig-edit'}>
            <a
              style={{ marginRight: '10px' }}
              onClick={() =>
                history.push(
                  `/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig/uploadTemplateConfig/detail?distributorName=${record.distributorName}&distributorCode=${record.distributorCode}&fileName=${record.fileName}&source=2`,
                )
              }
            >
              编辑
            </a>
          </Authorized>
          <Popconfirm
            onConfirm={() => handleDelete(record)}
            title={'确认删除选中数据吗？'}
            disabled={record.isSeal === 1}
          >
            <a style={{ marginRight: '10px' }}>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = (record?: any) => {
    institutionUploadTemplateDelete({
      distribName: record.distributorName,
      distribCode: record.distributorCode,
      fileName: record.fileName,
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('删除成功');
        actionRef?.current?.reload();
      } else {
        message.warning('删除失败');
      }
    });
  };

  //重置
  const onReset = () => {
    ref.current?.setFieldsValue({
      distributorCode: undefined,
      distributorName: undefined,
      fileName: undefined,
    });
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="insConfig-storageConfig-upload"
            saveSearchValue
            tableAlertRender={false}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onReset={() => onReset()}
            actionRef={actionRef}
            formRef={ref}
            request={params => {
              return institutionUploadTemplateLoad({
                ...params,
              });
            }}
            rowKey={(record, index) => JSON.stringify(index)}
            dateFormatter="string"
            scroll={{ x: '100%' }}
            sticky={true}
            headerTitle={
              <div>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push(
                        `/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig/uploadTemplateConfig/detail?distributorName=""&distributorCode=""&fileName=""&source=1`,
                      );
                    }}
                  >
                    添加
                  </Button>
                </Space>
              </div>
            }
            toolBarRender={() => []}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadTemplateConfig;
