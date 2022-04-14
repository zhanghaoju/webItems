import React, { ReactNode, useImperativeHandle, useRef, useState } from 'react';
import {
  getContractDistributorList,
  updateContractDistributor,
} from '@/services/institution';
import { Button, message, Modal, Popconfirm } from 'antd';
import ListTable from '../../list';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib';
import AddContractDistributor from './add';
import { useAuth } from '@vulcan/utils';

const ContractDistributor: React.FC = (props: any) => {
  let searchParams: any = {};
  const childRef: any = useRef<any>();
  const addModalRef: any = useRef<any>();
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const toggleVisible = (bool: boolean = false) => {
    setVisible(bool);
  };
  const agentDistributorAdd = useAuth('agentDistributorAdd');
  const agentDistributorDel = useAuth('agentDistributorDel');

  const columns: any[] = [
    {
      title: '配送商名称',
      dataIndex: 'distributorName',
      ellipsis: true,
      fixed: 'left',
      width: '10%',
    },
    {
      title: '配送商编码',
      dataIndex: 'distributorCode',
      ellipsis: true,
      fixed: 'left',
      width: '7%',
    },
    {
      title: '省份',
      dataIndex: 'province',
      width: '10%',
    },
    {
      title: '城市',
      dataIndex: 'city',
      width: '10%',
    },
    {
      title: '地区',
      dataIndex: 'county',
      width: '10%',
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 80,
      hideInTable: !agentDistributorDel,
      render: (text: ReactNode, record: any) => {
        return (
          <div className="action-container">
            <Popconfirm
              placement="topRight"
              onConfirm={() => deleteDistributor(record)}
              title={`您确定要删除？`}
              icon={<QuestionCircleOutlined />}
            >
              <span>删除</span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useImperativeHandle(props.cRef, () => ({
    data: (data: any) => {
      if (data.visible) {
        toggleVisible(data.visible);
        setBaseInfo(data.baseInfo);
      }
    },
  }));

  const deleteDistributor = (record: any) => {
    record.isDeleted = 1;
    updateContractDistributor({ isDeleted: 1, id: record.id }).then(() => {
      reloadList('删除成功');
    });
  };

  const showAdd: any = () => {
    addModalRef.current.data({
      visible: true,
      baseInfo: { ...baseInfo },
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

  const reloadList = (msg: string) => {
    if (msg) {
      message.success(msg);
    }
    childRef.current.reload();
  };

  return (
    <>
      <Modal
        destroyOnClose
        centered
        maskClosable={false}
        width="70%"
        title="配送商"
        visible={visible}
        onOk={() => toggleVisible(false)}
        onCancel={() => toggleVisible(false)}
      >
        <div className="modal-height contract-modal">
          <div className="agent-detail">
            <h2>{baseInfo.name}</h2>
            <span>{baseInfo.code}</span>
          </div>
          <ListTable
            cRef={childRef}
            hasDefaultColumns={true}
            params={{
              agentId: baseInfo.agentId,
              contractId: baseInfo.contractId,
            }}
            columns={columns}
            hideSearch={true}
            hideSelection={true}
            getList={getContractDistributorList}
            scrollX={1000}
            beforeSearchSubmit={(params: any) => {
              searchParams = params;
              delete searchParams.region;
              return params;
            }}
            headerTitle={agentDistributorAdd ? headerTitle : null}
          />
        </div>
      </Modal>
      <AddContractDistributor
        {...props}
        cRef={addModalRef}
        reloadList={reloadList}
      />
    </>
  );
};

export default ContractDistributor;
