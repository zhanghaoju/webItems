import React, { useEffect } from 'react';
import { Button, Tabs, Tooltip } from 'antd';
import { withRouter, useModel } from 'umi';
import styles from './index.less';
import './index.less';
import { InfoCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const SalesDataQueryTab = withRouter(
  ({ children, history, location, match }) => {
    const pathArray = location?.pathname?.split('/');
    const current = pathArray[pathArray.length - 1];

    useEffect(() => {}, []);
    // <Tooltip placement="topLeft" title={text}>
    //   <Button>TL</Button>
    // </Tooltip>
    // let jsx =
    return (
      <>
        <div className={styles.headerContainer}>
          <Tabs
            style={{ marginBottom: '-16px' }}
            type="card"
            activeKey={current}
            onChange={activeKey => {
              history.push(`/table-data-mgmt/sales/sales-query/${activeKey}`);
            }}
          >
            <TabPane
              tab={
                <span>
                  下游销量底表
                  <Tooltip
                    placement="top"
                    title={
                      '默认视角：产品-挂靠前，下游机构-挂靠前，可以通过查询条件切换视角'
                    }
                  >
                    <InfoCircleOutlined
                      style={{ marginLeft: '4px', color: '#979797' }}
                    />
                  </Tooltip>
                </span>
              }
              key={'terminal'}
            />
            <TabPane
              tab={
                <span>
                  上游销量底表
                  <Tooltip
                    placement="top"
                    title={
                      '默认视角：产品-挂靠前，上游机构-挂靠前，可以通过查询条件切换视角'
                    }
                  >
                    <InfoCircleOutlined
                      style={{ marginLeft: '4px', color: '#979797' }}
                    />
                  </Tooltip>
                </span>
              }
              key={'channel'}
            />
          </Tabs>
        </div>
        {children}
      </>
    );
  },
);

export default SalesDataQueryTab;
