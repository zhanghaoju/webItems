import React, { useState, useRef, useEffect } from 'react';
import { Table } from '@vulcan/utils';
import {
  Button,
  message,
  Modal,
  Popconfirm,
  notification,
  Dropdown,
  Menu,
  TreeSelect,
} from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import {
  getFileManagementList,
  deleteFileParseLog,
  downLoadFileParseLogOrignalData,
  getFileParseResult,
  downLoadFileParseLogReport,
  getFileManagementListInfo,
  getTreeStatus,
} from '@/services/dataUploadFileManagement';
import { connect } from 'dva';
import transformText, { transformArray } from '@/utils/transform.ts';
import { formatChinaStandardTime } from '@/utils/formatTime.ts';
import { downloadFile } from '@/utils/exportFile.ts';
import { Authorized } from '@vulcan/utils';
import './index.less';
import storage from '@/utils/storage';
import { FormInstance } from 'antd/lib/form';

interface FileManagementProps {
  FileManagement: any;
  dispatch: any;
  location: any;
  history: any;
}

interface ActionType {
  reload: () => void;
}

const { TreeNode } = TreeSelect;

interface GithubIssueItem {
  id?: string;
  fileId?: string;
  fileName?: string;
  isDeleted?: number;
  companyName?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  productCode?: string;
  customerName?: string;
  productName?: string;
  productSpec?: string;
  businessDesc?: string;
  quantity?: string;
  productUnit?: string;
  saleDate?: string;
  isOpen?: any;
}

const FileManagement: React.FC<FileManagementProps> = props => {
  const {
    FileManagement,
    dispatch,
    history,
    location: { state },
  } = props;
  const [checkResultModalVisible, setCheckResultModalVisible] = useState(false);
  const [
    fileManagementDetailModalVisible,
    setFileManagementDetailModalVisible,
  ] = useState(false);
  const [checkData, setCheckData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const pageElements = storage.get('pageElements').pageElements;

  useEffect(() => {
    if (state && state.fileName && ref.current) {
      ref.current.setFieldsValue({
        fileName: state.fileName,
      });
      history.replace({}); //清除打单监控页面跳转带过来的参数
    }
    ref.current?.setFieldsValue({
      isDeleted: '0',
    });
    getTreeStatusFunc();
  }, []);

  //获取查询条件  状态  的下拉框数据
  const getTreeStatusFunc = async () => {
    try {
      const res = await getTreeStatus({});
      setStatusData(res.data);
    } catch (e) {
      message.warning('获取状态下拉数据失败');
    }
  };

  //重置
  const onReset = () => {
    // ref.current?.resetFields();
    ref.current?.setFieldsValue({
      fileName: undefined,
      accessType: undefined,
      fileStatus: undefined,
      isDeleted: undefined,
      isNullFile: undefined,
      uploadPeopleName: undefined,
      createdTime: undefined,
    });
  };

  const columns: any = (source: any) => {
    return [
      {
        title: '采集方式',
        dataIndex: 'accessType',
        valueType: 'text',
        hideInTable: true,
        valueEnum: transformArray('accessTypePocket', 'label', 'value'),
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
        valueType: 'text',
        width: '20%',
        // fixed: 'left',
      },
      {
        title: '获取方式',
        dataIndex: 'accessType',
        valueType: 'text',
        hideInSearch: true,
        valueEnum: transformArray('accessTypePocket', 'label', 'value'),
        width: '8%',
        // fixed: 'left',
      },
      {
        title: '经销商名称',
        dataIndex: 'projectInstitutionName',
        valueType: 'text',
        hideInSearch: true,
        width: '15%',
        // fixed: 'left',
      },
      {
        title: '业务类型',
        dataIndex: 'businessDesc',
        valueEnum: transformArray('businessTypeValuePocket', 'label', 'value'),
        hideInSearch: true,
        width: '8%',
      },
      {
        title: '文件状态',
        dataIndex: 'fileStatus',
        valueType: 'text',
        hideInTable: true,
        renderFormItem: (_, { value, onChange }) => {
          return (
            <TreeSelect
              placeholder="请选择"
              style={{ width: '100%' }}
              allowClear
              treeData={statusData}
            >
              {/* {(statusData || []).map((res: any) => (
                <TreeNode value={res.value} title={res.label} />
              ))} */}
            </TreeSelect>
          );
        },
      },
      {
        title: '文件状态',
        dataIndex: 'fileStatus',
        valueType: 'text',
        ellipsis: true,
        hideInSearch: true,
        valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
        width: '8%',
      },
      {
        title: '是否删除',
        dataIndex: 'isDeleted',
        ellipsis: true,
        hideInSearch: false,
        valueEnum: transformArray('whetherNot', 'label', 'value'),
        width: '8%',
      },
      {
        title: '是否空文件',
        dataIndex: 'isNullFile',
        hideInTable: true,
        valueEnum: transformArray('whetherNot', 'label', 'value'),
        width: '8%',
      },
      {
        title: '数据行数',
        dataIndex: 'rowcount',
        valueType: 'text',
        ellipsis: true,
        hideInSearch: true,
        width: '8%',
      },
      {
        title: '上传者',
        dataIndex: 'uploadPeopleName',
        valueType: 'text',
        width: '8%',
      },
      {
        title: '上传时间',
        dataIndex: 'createdTime',
        valueType: 'dateRange',
        hideInTable: true,
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch: true,
        width: '15%',
      },
      {
        title: '操作',
        dataIndex: 'action',
        hideInSearch: true,
        width: '10%',
        // fixed: 'right',
        render: (text: any, record: any, index: any) => (
          <div>
            <Authorized code={'fileManagement-delete'}>
              <Popconfirm
                onConfirm={() => handelDeleteSubmit(record, source)}
                title={'确定删除此数据？'}
                disabled={!!record.isDeleted || record.isSeal === 'Archive'}
              >
                <a
                  type="link"
                  style={{
                    marginRight: '20px',
                    color:
                      !!record.isDeleted || record.isSeal === 'Archive'
                        ? '#b6b6b6'
                        : '#ff9300',
                  }}
                >
                  删除
                </a>
              </Popconfirm>
            </Authorized>
            <Dropdown
              key="menu"
              overlay={
                <Menu>
                  {(record.isOpen !== 1 || source === 2) &&
                    pageElements.filter((item: any, i: any) => {
                      return item.code == '001-2-data-view';
                    }) && (
                      <Menu.Item key="1">
                        <Button
                          type="link"
                          onClick={() => handleFileManagementDetail(record)}
                          disabled={!!record.isDeleted}
                        >
                          数据查看
                        </Button>
                      </Menu.Item>
                    )}
                  {source === 1 &&
                    pageElements.filter((item: any, i: any) => {
                      return item.code == '001-2-originalFileDownload';
                    }) && (
                      <Menu.Item key="2">
                        <Button
                          type="link"
                          onClick={() => originalFileDownload(record)}
                        >
                          原始文件下载
                        </Button>
                      </Menu.Item>
                    )}
                  {record.isButton === 1 && (
                    <Menu.Item key="3">
                      <Popconfirm
                        onConfirm={() => handelDeleteSubmit(record, source)}
                        title={'确定删除此文件？'}
                      >
                        <Button type="link">文件删除</Button>
                      </Popconfirm>
                    </Menu.Item>
                  )}
                  {(record.isOpen !== 1 || source === 2) &&
                    pageElements.filter((item: any, i: any) => {
                      return item.code == '001-2-inspectReportDownload';
                    }) && (
                      <Menu.Item key="4">
                        <Button
                          type="link"
                          onClick={() => inspectReportDownload(record)}
                          disabled={!!record.isDeleted}
                        >
                          质检报告下载
                        </Button>
                      </Menu.Item>
                    )}
                  {record.isOpen === 1 &&
                    pageElements.filter((item: any, i: any) => {
                      return item.code == '001-2-downloadResult-view';
                    }) && (
                      <Menu.Item key="5">
                        <Button
                          type="link"
                          onClick={() => handleFileParseResult(record)}
                        >
                          文件校验结果查看
                        </Button>
                      </Menu.Item>
                    )}
                  {(record.fileStatus === 'QUALITY_SUCCESS' ||
                    record.fileStatus === 'QUALITY_FAILURE') &&
                    source === 1 && (
                      // &&
                      // pageElements.filter((item: any, i: any) => {
                      //   return item.code == '001-2-data-view';
                      // })
                      <Menu.Item key="1">
                        <Button
                          type="link"
                          onClick={() =>
                            handleFileManagementQualityDetail(record)
                          }
                          disabled={!!record.isDeleted}
                        >
                          质检报告查看
                        </Button>
                      </Menu.Item>
                    )}
                </Menu>
              }
            >
              <a>
                <EllipsisOutlined />
              </a>
            </Dropdown>
          </div>
        ),
      },
    ];
  };

  const checkDataColumns = [
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      key: 'ruleType',
    },
    {
      title: '是否满足要求',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '描述信息',
      dataIndex: 'statusRemark',
      key: 'statusRemark',
      render: (text: any, record: any) => {
        return record.statusRemark ? (
          <span>{record.statusRemark}</span>
        ) : (
          <span>--</span>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  //数据查看
  const handleFileManagementDetail = (record: any) => {
    if (!record.businessDesc) {
      notification['warning']({
        message: '提示',
        description: '该数据无业务类型',
      });
    } else {
      history.push(
        `/dataCollect/fileManagement/detail/${record.id}-${record.businessDesc}`,
      );
    }
  };

  //质检报告查看
  const handleFileManagementQualityDetail = (record: any) => {
    history.push(`/dataCollect/fileManagement/qualityDetail/${record.id}`);
  };

  //数据删除
  const handelDeleteSubmit = (record: any, source: any) => {
    const params = {
      id: record.id,
      periodId: record.periodId,
      isDeleted: record.isDeleted,
      isOpen: record.isOpen,
    };
    deleteFileParseLog(params).then((response: any) => {
      if (response && response.success && response.success === true) {
        if (source === 1) {
          actionRef?.current?.reload();
          actionRef2?.current?.reload();
        }
        if (source === 2) {
          actionRef2?.current?.reload();
        }
      } else {
        message.error('删除失败！');
      }
    });
  };

  //文件校验结果查看
  const handleFileParseResult = (record: any) => {
    const params = {
      fileId: record.id,
    };
    getFileParseResult(params).then((response: any) => {
      if (response && response.success && response.success === true) {
        setCheckResultModalVisible(true);
        let temCheckData: any = [];
        temCheckData = response.data;
        if (temCheckData.length > 0) {
          temCheckData.forEach((item?: any, i?: any) => {
            item.key = response.data[i].id;
            item.status = transformText(
              'checkoutStatus',
              'label',
              'value',
              'status',
              item,
            );
            item.statusRemark = transformText(
              'failureReasonPocket',
              'label',
              'value',
              'statusRemark',
              item,
            );
            item.createTime = formatChinaStandardTime(
              response.data[i].createTime,
            );
          });
        }
        setCheckData(temCheckData);
      }
    });
    setCheckResultModalVisible(true);
  };

  //原始文件下载
  const originalFileDownload = (record: any) => {
    const params = {
      fileId: record.id,
      accessType: record.accessType,
    };
    downLoadFileParseLogOrignalData(params).then((res: any) => {
      downloadFile(res);
    });
  };

  //质检报告下载
  const inspectReportDownload = (record: any) => {
    const params = {
      fileId: record.id,
      businessType: record.businessType,
      accessType: record.accessType,
      businessDesc: record.businessDesc,
    };
    downLoadFileParseLogReport(params).then((res: any) => {
      downloadFile(res);
    });
  };

  const ref = useRef<FormInstance>();
  const expandedRowRender = (record: any) => {
    return (
      <ProTable<GithubIssueItem>
        // code="dataUpload-fileManagement-expand"
        columns={columns(2)}
        actionRef={actionRef2}
        // scroll={{x: 1600, y: '60vh'}}
        request={(params, sort, filter) => {
          return getFileManagementListInfo({
            ...params,
            ...sort,
            ...filter,
            fileId: record.id,
          });
        }}
        className="expandedTable"
        rowKey="id"
        dateFormatter="string"
        headerTitle={false}
        search={false}
        options={false}
        // dataSource={data}
        pagination={false}
        showHeader={false}
      />
    );
  };

  const actionRef = useRef<ActionType>();
  const actionRef2 = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="dataUpload-fileManagement-list"
            saveSearchValue
            columns={columns(1)}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            onReset={() => onReset()}
            // onSubmit={() => onReset()}
            formRef={ref}
            // params={searchParams}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getFileManagementList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
            rowKey="id"
            dateFormatter="string"
            expandable={{
              expandedRowRender: record => expandedRowRender(record),
              rowExpandable: record => record.isOpen !== 0,
            }}
            scroll={{ x: '100%' }}
            sticky={true}
          />
        </div>
        <div>
          <Modal
            title="文件校验结果"
            width={750}
            visible={checkResultModalVisible}
            onCancel={() => setCheckResultModalVisible(false)}
            onOk={() => setCheckResultModalVisible(false)}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => setCheckResultModalVisible(false)}
              >
                确定
              </Button>,
            ]}
          >
            <ProTable
              columns={checkDataColumns}
              dataSource={checkData}
              search={false}
              options={false}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default connect(({ dispatch, FileManagement }: FileManagementProps) => ({
  FileManagement,
  dispatch,
}))(FileManagement);
