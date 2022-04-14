import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Steps, message, Card, Typography, Space } from 'antd';
import { history } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import styles from '../index.less';
import NewTemplate from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/NewTemplate';
import MyTreeTransfer from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/components/MyTreeTransfer';
import DragTable, {
  DragTableRef,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/components/DragTable';
import Finished from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/components/Finished';
import {
  tableDataType,
  TemplateList,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
import { useModel } from '@@/plugin-model/useModel';
import { useRequest } from 'umi';
import {
  insertFields,
  updateTemplate,
  getTemplateDetails,
  exportFields,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/api';
import { treeTransformList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/utils';
import { VulcanFile } from '@vulcan/utils';
const { Step } = Steps;
const { Title, Text } = Typography;

interface MyStepsProps {
  location?: {
    state?: {
      type?: string;
      data?: TemplateList;
    };
  };
}
const MySteps: React.FC<MyStepsProps> = ({ location }) => {
  const getTemplateDetailsRequest = useRequest(getTemplateDetails, {
    manual: true,
    formatResult: res => res.data,
    onSuccess: data => {
      //编辑时，也不可将父节点选中到右边，不然在移除右边子节点时，必须要先把父节点移除
      let keys: string[] = [];
      for (let item of data) {
        if (item.fieldType) {
          keys.push(item.fieldCode);
        }
      }
      setEditTempList(data);
      setTargetKeys(keys);
    },
  });
  const insertFieldsRequest = useRequest(insertFields, {
    manual: true,
    formatResult: res => res,
    onSuccess: data => {
      setCurrent(current + 1);
    },
  });
  const updateFieldsRequest = useRequest(updateTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: data => {
      setCurrent(current + 1);
    },
  });
  const exportFieldsRequest = useRequest(exportFields, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });
  const {
    dragTreeData,
    setTargetKeys,
    setEditTempList,
    defaultFields,
    targetKeys,
  } = useModel(
    'TableDataMgmt.SalesTableDataMgmt.TemplateMgmt.useTemplateMgmtModel',
  );
  const [currentItem, setCurrentItem] = useState<TemplateList>(
    location?.state?.data as TemplateList,
  );
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    //编辑模板名称和描述
    setCurrentItem(location?.state?.data as TemplateList);
  }, [location?.state?.data]);

  useEffect(() => {
    if (location?.state?.type === 'edit') {
      getTemplateDetailsRequest.run({ templateId: currentItem.id || '' });
    } else {
      setEditTempList([]);
      setTargetKeys(defaultFields);
    }
  }, [defaultFields]);
  const next = () => {
    if (targetKeys && targetKeys.length === 0) {
      message.error('至少选择一个字段!');
      return;
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const save = () => {
    let editFields = dragTableRef?.current?.submit();
    let list: tableDataType[] = treeTransformList(
      dragTreeData,
      editFields,
      currentItem?.id || '',
    );
    if (list && list.length === 0) {
      message.error('至少选择一个字段!');
      return;
    }
    if (location?.state?.type === 'edit') {
      updateFieldsRequest.run(list);
    } else {
      insertFieldsRequest.run({ id: currentItem.id || '', data: list });
    }
  };

  const dragTableRef = useRef<DragTableRef>();
  const steps = [
    {
      title: '选择字段',
      content: <MyTreeTransfer />,
    },
    {
      title: '编辑字段',
      content: <DragTable actionRef={dragTableRef} />,
    },
    {
      title: '完成',
      content: <Finished />,
    },
  ];
  return (
    <>
      <Card style={{ width: '100%', marginLeft: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4}>模板名称:{currentItem?.templateName}</Title>
          <NewTemplate
            type="edit"
            item={currentItem}
            tempContentType={location?.state?.type}
          />
        </div>
        <Text type="secondary">描述:{currentItem?.templateDescribe}</Text>
      </Card>
      <Card
      // style={{ width: '96%', marginLeft: '2%', marginTop: '20px' }}
      >
        <div className={styles.exportDetail}>
          <div className={styles.describe}>
            请导出字段详情查看所有字段的具体说明
          </div>
          <Button
            type={'primary'}
            onClick={() => {
              exportFieldsRequest.run();
            }}
          >
            导出字段详情
          </Button>
        </div>
        <div style={{ width: '90%', marginLeft: '5%' }}>
          <Steps current={current} style={{ padding: '20px 40px 40px 40px' }}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content" style={{ width: '100%' }}>
            {steps[current].content}
          </div>
          <FooterToolbar
            style={{
              display: 'flow-root',
              textAlign: 'center',
            }}
          >
            <Space>
              {current < steps.length - 2 && (
                <Button type="primary" onClick={() => next()}>
                  下一步
                </Button>
              )}
              {current > 0 && current < steps.length - 1 && (
                <Button onClick={() => prev()}>上一步</Button>
              )}
              {current === steps.length - 2 && (
                <Button type="primary" onClick={() => save()}>
                  保存
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button
                  onClick={() => {
                    history.push('/table-data-mgmt/sales/sales-query/terminal');
                  }}
                >
                  取消
                </Button>
              )}
            </Space>
          </FooterToolbar>
        </div>
      </Card>
    </>
  );
};

export default MySteps;
