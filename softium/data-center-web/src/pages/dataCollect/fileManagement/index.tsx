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
      history.replace({}); //????????????????????????????????????????????????
    }
    ref.current?.setFieldsValue({
      isDeleted: '0',
    });
    getTreeStatusFunc();
  }, []);

  //??????????????????  ??????  ??????????????????
  const getTreeStatusFunc = async () => {
    try {
      const res = await getTreeStatus({});
      setStatusData(res.data);
    } catch (e) {
      message.warning('??????????????????????????????');
    }
  };

  //??????
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
        title: '????????????',
        dataIndex: 'accessType',
        valueType: 'text',
        hideInTable: true,
        valueEnum: transformArray('accessTypePocket', 'label', 'value'),
      },
      {
        title: '????????????',
        dataIndex: 'fileName',
        valueType: 'text',
        width: '20%',
        // fixed: 'left',
      },
      {
        title: '????????????',
        dataIndex: 'accessType',
        valueType: 'text',
        hideInSearch: true,
        valueEnum: transformArray('accessTypePocket', 'label', 'value'),
        width: '8%',
        // fixed: 'left',
      },
      {
        title: '???????????????',
        dataIndex: 'projectInstitutionName',
        valueType: 'text',
        hideInSearch: true,
        width: '15%',
        // fixed: 'left',
      },
      {
        title: '????????????',
        dataIndex: 'businessDesc',
        valueEnum: transformArray('businessTypeValuePocket', 'label', 'value'),
        hideInSearch: true,
        width: '8%',
      },
      {
        title: '????????????',
        dataIndex: 'fileStatus',
        valueType: 'text',
        hideInTable: true,
        renderFormItem: (_, { value, onChange }) => {
          return (
            <TreeSelect
              placeholder="?????????"
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
        title: '????????????',
        dataIndex: 'fileStatus',
        valueType: 'text',
        ellipsis: true,
        hideInSearch: true,
        valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
        width: '8%',
      },
      {
        title: '????????????',
        dataIndex: 'isDeleted',
        ellipsis: true,
        hideInSearch: false,
        valueEnum: transformArray('whetherNot', 'label', 'value'),
        width: '8%',
      },
      {
        title: '???????????????',
        dataIndex: 'isNullFile',
        hideInTable: true,
        valueEnum: transformArray('whetherNot', 'label', 'value'),
        width: '8%',
      },
      {
        title: '????????????',
        dataIndex: 'rowcount',
        valueType: 'text',
        ellipsis: true,
        hideInSearch: true,
        width: '8%',
      },
      {
        title: '?????????',
        dataIndex: 'uploadPeopleName',
        valueType: 'text',
        width: '8%',
      },
      {
        title: '????????????',
        dataIndex: 'createdTime',
        valueType: 'dateRange',
        hideInTable: true,
      },
      {
        title: '????????????',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch: true,
        width: '15%',
      },
      {
        title: '??????',
        dataIndex: 'action',
        hideInSearch: true,
        width: '10%',
        // fixed: 'right',
        render: (text: any, record: any, index: any) => (
          <div>
            <Authorized code={'fileManagement-delete'}>
              <Popconfirm
                onConfirm={() => handelDeleteSubmit(record, source)}
                title={'????????????????????????'}
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
                  ??????
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
                          ????????????
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
                          ??????????????????
                        </Button>
                      </Menu.Item>
                    )}
                  {record.isButton === 1 && (
                    <Menu.Item key="3">
                      <Popconfirm
                        onConfirm={() => handelDeleteSubmit(record, source)}
                        title={'????????????????????????'}
                      >
                        <Button type="link">????????????</Button>
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
                          ??????????????????
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
                          ????????????????????????
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
                          ??????????????????
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
      title: '????????????',
      dataIndex: 'ruleType',
      key: 'ruleType',
    },
    {
      title: '??????????????????',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '????????????',
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
      title: '??????',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  //????????????
  const handleFileManagementDetail = (record: any) => {
    if (!record.businessDesc) {
      notification['warning']({
        message: '??????',
        description: '????????????????????????',
      });
    } else {
      history.push(
        `/dataCollect/fileManagement/detail/${record.id}-${record.businessDesc}`,
      );
    }
  };

  //??????????????????
  const handleFileManagementQualityDetail = (record: any) => {
    history.push(`/dataCollect/fileManagement/qualityDetail/${record.id}`);
  };

  //????????????
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
        message.error('???????????????');
      }
    });
  };

  //????????????????????????
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

  //??????????????????
  const originalFileDownload = (record: any) => {
    const params = {
      fileId: record.id,
      accessType: record.accessType,
    };
    downLoadFileParseLogOrignalData(params).then((res: any) => {
      downloadFile(res);
    });
  };

  //??????????????????
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
            title="??????????????????"
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
                ??????
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
