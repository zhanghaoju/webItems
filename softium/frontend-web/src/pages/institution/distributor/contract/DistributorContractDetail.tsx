import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
} from 'react';
import { Button, Modal, Popconfirm, Form, message } from 'antd';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import {
  getContractDetailList,
  editContractDetail,
  deleteContractDetail,
} from '@/services/distributorContract';
import { thousands, transformToTableRequest } from '@/utils/dataConversion';
import AddDistributorContractDetail from '@/pages/institution/distributor/contract/AddDistributorContractDetail';
import InputNumberForValue from '@/pages/institution/distributor/contract/InputNumberForValue';
import { Authorized } from '@vulcan/utils';
import { getColumns, handleColumnsData } from '@/pages/institution/util';

interface DistributorContractDetailProps {
  record: any;
  distributorId: string;
  listActionRef?: any;
}

export default forwardRef(
  (props: DistributorContractDetailProps, ref: React.Ref<any>) => {
    const { record, distributorId, listActionRef } = props;

    const [visible, setVisible] = useState<boolean>(false);
    const [editableKeys, setEditableRowKeys] = useState<any[]>([]);
    const [allFields, setAllFields] = useState<any[]>([]);

    const [form] = Form.useForm();
    const addDetailRef = useRef<any>();
    const actionRef = useRef<ActionType>();

    const toggleVisible = async () => {
      await setVisible(!visible);
      if (!visible) {
        const fields: any = await getColumns('t_dtr_contract_detail');
        setAllFields(fields.allFields);
      }
    };

    useImperativeHandle(ref, () => ({
      toggleVisible,
    }));

    const columns: ProColumns<any, any>[] = [
      {
        title: '上游编码',
        dataIndex: 'upInstitutionCode',
        editable: false,
      },
      {
        title: '上游名称',
        dataIndex: 'upInstitutionName',
        editable: false,
      },
      {
        title: '产品编码',
        dataIndex: 'productCode',
        editable: false,
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        editable: false,
      },
      {
        title: '产品规格',
        dataIndex: 'specification',
        editable: false,
      },
      {
        title: '生产厂家',
        dataIndex: 'manufacturer',
        editable: false,
      },
      {
        title: '采购价',
        dataIndex: 'price',
        renderText: text => (text ? thousands(text) : text),
        renderFormItem: (_, { isEditable }) => {
          return isEditable && <InputNumberForValue />;
        },
        formItemProps: {
          rules: [
            {
              pattern: /^\d+(\.\d{1,4})?$/,
              message: '小数点后只允许四位',
            },
            {
              validator: (rule, value) =>
                new Promise((resolve, reject) => {
                  if (value) {
                    `${value}`.length > 14
                      ? reject('不可超过14位')
                      : resolve('');
                  }
                  resolve('');
                }),
            },
          ],
        },
      },
      {
        title: '指标',
        dataIndex: 'quota',
        renderText: text => (text ? thousands(text) : text),
        renderFormItem: (_, { isEditable }) => {
          return isEditable && <InputNumberForValue />;
        },
        formItemProps: {
          rules: [
            {
              pattern: /^\d+(\.\d{1,4})?$/,
              message: '小数点后只允许四位',
            },
            {
              validator: (rule, value) =>
                new Promise((resolve, reject) => {
                  if (value) {
                    `${value}`.length > 14
                      ? reject('不可超过14位')
                      : resolve('');
                  }
                  resolve('');
                }),
            },
          ],
        },
      },
      {
        title: '备注1',
        dataIndex: 'remark1',
      },
      {
        title: '备注2',
        dataIndex: 'remark2',
      },
      {
        title: '备注3',
        dataIndex: 'remark3',
      },
      {
        title: '备注4',
        dataIndex: 'remark4',
      },
      {
        title: '备注5',
        dataIndex: 'remark5',
      },
      {
        title: '操作',
        valueType: 'option',
        fixed: 'right',
        render: (text, entity, _, action) => [
          <Authorized code="editDistributorContractDetail" key="edit">
            <a
              onClick={() => {
                action?.startEditable(entity.id);
              }}
            >
              编辑
            </a>
          </Authorized>,
          <Authorized code="deleteDistributorContractDetail">
            <Popconfirm
              key="delete"
              title="确定要删除？"
              onConfirm={() => deleteContractInfo(entity)}
            >
              <a>删除</a>
            </Popconfirm>
          </Authorized>,
        ],
      },
    ];

    const deleteContractInfo = async (record: any) => {
      try {
        await deleteContractDetail({
          id: record.id,
        });
        message.success('删除成功');
        actionRef.current?.reload();
      } catch (e) {
        console.log(e);
      }
    };

    const editSave = async (key: any, row: any, newLine: any) => {
      try {
        await editContractDetail({
          ...row,
        });
        message.success('编辑成功');
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <>
        <Modal
          visible={visible}
          title="详情"
          width="80%"
          footer={
            <Button
              onClick={() => {
                listActionRef.current.reload();
                toggleVisible();
              }}
            >
              确定
            </Button>
          }
          onCancel={() => {
            listActionRef.current.reload();
            toggleVisible();
          }}
        >
          <div className="detail-header">
            <h2>{record?.name}</h2>
            <span>{record?.code}</span>
          </div>
          <EditableProTable
            columns={handleColumnsData(columns, allFields)}
            search={false}
            options={false}
            actionRef={actionRef}
            rowKey="id"
            scroll={{ x: 2500 }}
            recordCreatorProps={false}
            headerTitle={[
              <Authorized key="add" code="addDistributorContractDetail">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => addDetailRef?.current?.toggleVisible()}
                >
                  添加明细
                </Button>
              </Authorized>,
            ]}
            params={{
              distributorId,
              contractId: record.id,
            }}
            pagination={{
              pageSize: 10,
            }}
            editable={{
              form,
              editableKeys,
              onChange: (editableKeys, editableRows) => {
                setEditableRowKeys(editableKeys);
              },
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
              onSave: editSave,
            }}
            request={(params: any, sort, filter) =>
              transformToTableRequest(
                {
                  ...params,
                  ...sort,
                  ...filter,
                  pageNo: params.current,
                },
                getContractDetailList,
              )
            }
          />
        </Modal>
        <AddDistributorContractDetail
          allFields={allFields}
          ref={addDetailRef}
          distributorId={distributorId}
          contractId={record.id}
          actionRef={actionRef}
        />
      </>
    );
  },
);
