import React, { ReactNode, useRef } from 'react';
import {
  agentContractUpdate,
  getAgentContractList,
} from '@/services/institution';
import { Button, Dropdown, Menu, message, Popconfirm } from 'antd';
import ListTable from '../../list';
import {
  DashOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons/lib';
import AddContract from '@/pages/institution/agent/contract/Add';
import moment from 'moment';
import ContractDistributor from '@/pages/institution/agent/distributor';
import { history } from '@@/core/history';
import { getDictionary } from '@/pages/institution/util';
import { useAuth } from '@vulcan/utils';

const AgentContractList: React.FC = (props: any) => {
  const { baseInfo } = props;
  let searchParams: any = {};
  const childRef: any = useRef<any>();
  const addModalRef: any = useRef<any>();
  const addDistributorRef: any = useRef<any>();
  const agentContractAdd = useAuth('agentContractAdd');
  const agentContractTerminal = useAuth('agentContractTerminal');
  const agentContractDistributor = useAuth('agentContractDistributor');
  const agentContractDownload = useAuth('agentContractDownload');
  const agentContractEdit = useAuth('agentContractEdit');
  const agentContractDel = useAuth('agentContractDel');

  const columns: any[] = [
    {
      title: '协议名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
      width: '10%',
    },
    {
      title: '协议编码',
      dataIndex: 'code',
      ellipsis: true,
      fixed: 'left',
      width: '7%',
    },
    {
      title: '起始日期',
      dataIndex: 'startDate',
      width: '10%',
      valueType: 'date',
    },
    {
      title: '终止日期',
      dataIndex: 'endDate',
      width: '10%',
      valueType: 'date',
    },
    {
      title: '附件',
      dataIndex: 'attachmentFileName',
      width: '10%',
    },
    {
      title: '销售指标统计口径',
      dataIndex: 'salesQuotaCountType',
      width: '10%',
      render: (text: string) => {
        return getDictionary('QuotaCountType', text);
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      hideInTable:
        !agentContractTerminal &&
        !agentContractDistributor &&
        !agentContractEdit &&
        !agentContractDownload &&
        !agentContractDel,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            {agentContractTerminal ? (
              <span
                onClick={() => {
                  const { id } = props.match.params;
                  history.push({
                    pathname: `${props.location.pathname}/terminal/${record.id}`,
                    query: {
                      terminal: 'true',
                    },
                    state: {
                      institutionId: id,
                    },
                  });
                }}
              >
                负责终端
              </span>
            ) : null}

            {agentContractDistributor ? (
              <span onClick={() => showDistributor(record)}>配送商</span>
            ) : null}
            {agentContractEdit ? (
              <span onClick={() => showAdd(record)}>编辑</span>
            ) : null}
            {agentContractDownload || agentContractDel ? (
              <Dropdown overlay={overlay(record)}>
                <a>
                  <DashOutlined />
                </a>
              </Dropdown>
            ) : null}
          </div>
        );
      },
    },
  ];

  const overlay = (record: any) => {
    return (
      <Menu>
        {agentContractDownload ? (
          <Menu.Item onClick={() => downloadContract(record)}>
            下载协议
          </Menu.Item>
        ) : null}
        {agentContractDel ? (
          <Menu.Item>
            <Popconfirm
              placement="topRight"
              onConfirm={() => deleteContract(record)}
              title={`${
                moment().valueOf() > moment(record.endDate).valueOf()
                  ? '您确定要删除协议？'
                  : '协议生效中，是否确认删除协议?'
              }`}
              icon={<QuestionCircleOutlined />}
            >
              <span>删除</span>
            </Popconfirm>
          </Menu.Item>
        ) : null}
      </Menu>
    );
  };

  const downloadContract = (record: any) => {
    if (record.attachmentFileUrl) {
      window.open(
        `${window.location.origin}/api/paas-file-web/fileInfo/download/${record.attachmentFileUrl}?fileNameType=oldName`,
      );
    } else {
      message.error('没有可以下载的附件');
    }
  };

  const deleteContract = (record: any) => {
    record.isDeleted = 1;
    record.startDate = moment(record.startDate).format();
    record.endDate = moment(record.endDate).format();
    record.createTime = moment(record.createTime).format();
    record.updateTime = moment(record.updateTime).format();
    agentContractUpdate(record).then(() => {
      reloadList('删除成功');
    });
  };

  const reloadList = (msg: string) => {
    msg && message.success(msg);
    childRef.current.reload();
  };

  const showAdd: any = (record: any = {}) => {
    const newBaseInfo: any = JSON.parse(JSON.stringify(baseInfo));
    newBaseInfo.agentId = baseInfo.id;
    delete newBaseInfo.id;
    addModalRef.current.data({
      visible: true,
      agentData: { ...newBaseInfo },
      record: record,
    });
  };

  const showDistributor = (record: any) => {
    addDistributorRef.current.data({
      visible: true,
      baseInfo: {
        name: record.name,
        code: record.code,
        agentId: baseInfo.id,
        contractId: record.id,
      },
    });
  };

  const headerTitle: any = () => {
    return (
      <div className="btn-container">
        <Button
          className="btn-item"
          key="add"
          type="primary"
          onClick={() => showAdd()}
        >
          <PlusOutlined /> 添加
        </Button>
      </div>
    );
  };

  return (
    <>
      <ListTable
        cRef={childRef}
        params={{ agentId: props.match.params.id }}
        columns={columns}
        hideSearch={true}
        hideSelection={true}
        hasDefaultColumns={true}
        getList={getAgentContractList}
        scrollX={1000}
        headerTitle={agentContractAdd ? headerTitle : null}
      />
      <AddContract {...props} cRef={addModalRef} reloadList={reloadList} />
      <ContractDistributor
        {...props}
        cRef={addDistributorRef}
        reloadList={reloadList}
      />
    </>
  );
};

export default AgentContractList;
