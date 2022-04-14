import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';
import { Table } from '@vulcan/utils';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getOriginDataViewList,
  getCheckDataViewList,
  getActiveDataViewList,
} from '@/services/dataUploadFileManagement';
import { history } from 'umi';
import { match } from 'react-router';
import { connect } from 'dva';
import {
  columnsOriginalID,
  columnsDeliveryID,
  columnsInspectID,
  columnsOriginalSD,
  columnsDeliverySD,
  columnsInspectSD,
  columnsOriginalPD,
  columnsDeliveryPD,
  columnsInspectPD,
  columnsOriginalDD,
  columnsDeliveryDD,
  columnsInspectDD,
  columnsOriginalSM,
  columnsInspectSM,
  columnsDeliverySM,
  columnsOriginalPM,
  columnsInspectPM,
  columnsDeliveryPM,
  columnsOriginalIM,
  columnsInspectIM,
  columnsDeliveryIM,
  columnsOriginalDM,
  columnsInspectDM,
  columnsDeliveryDM,
} from './columns';

interface CommonListPageProps {
  commonListPage: any;
  dispatch: any;
}

interface ParamsProps {
  id: string;
  businessDesc: string;
}

interface CommonListPageProps {
  match: match<ParamsProps>;
  source: any;
}

interface GithubIssueItem {
  id?: string;
  fileId?: string;
  fileName?: string;
  projectName?: string;
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
}

const commonListPage = (props: CommonListPageProps) => {
  const {
    match: { params },
    source,
  } = props;
  const breakIndex = params.id.lastIndexOf('-');
  const fileId = params.id.substr(0, breakIndex);
  const businessDesc = params.id.substr(breakIndex + 1);
  const [scrollX, setScrollX] = useState(3500);

  useEffect(() => {
    setScrollX(getScroll());
  }, []);

  //不同的columns适配不同的横向滚动条宽度
  const getScroll = () => {
    let scrollX = 1500;
    switch (businessDesc) {
      case 'SM':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      case 'PM':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      case 'IM':
        if (source === 1) {
          scrollX = 1500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'DM':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      case 'SD':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      case 'PD':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      case 'ID':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      case 'DD':
        if (source === 1) {
          scrollX = 2000;
        } else {
          scrollX = 3500;
        }
        break;
      default:
        break;
    }
    return scrollX;
  };

  const getColumns: any = () => {
    let columns = null;
    switch (businessDesc) {
      case 'SD':
        if (source === 1) {
          columns = columnsOriginalSD();
        }
        if (source === 2) {
          columns = columnsInspectSD();
        }
        if (source === 3) {
          columns = columnsDeliverySD();
        }
        break;
      case 'ID':
        if (source === 1) {
          columns = columnsOriginalID();
        }
        if (source === 2) {
          columns = columnsInspectID();
        }
        if (source === 3) {
          columns = columnsDeliveryID();
        }
        break;
      case 'PD':
        if (source === 1) {
          columns = columnsOriginalPD();
        }
        if (source === 2) {
          columns = columnsInspectPD();
        }
        if (source === 3) {
          columns = columnsDeliveryPD();
        }
        break;
      case 'DD':
        if (source === 1) {
          columns = columnsOriginalDD();
        }
        if (source === 2) {
          columns = columnsInspectDD();
        }
        if (source === 3) {
          columns = columnsDeliveryDD();
        }
        break;
      case 'IM':
        if (source === 1) {
          columns = columnsOriginalIM();
        }
        if (source === 2) {
          columns = columnsInspectIM();
        }
        if (source === 3) {
          columns = columnsDeliveryIM();
        }
        break;
      case 'PM':
        if (source === 1) {
          columns = columnsOriginalPM();
        }
        if (source === 2) {
          columns = columnsInspectPM();
        }
        if (source === 3) {
          columns = columnsDeliveryPM();
        }
        break;
      case 'SM':
        if (source === 1) {
          columns = columnsOriginalSM();
        }
        if (source === 2) {
          columns = columnsInspectSM();
        }
        if (source === 3) {
          columns = columnsDeliverySM();
        }
        break;
      case 'DM':
        if (source === 1) {
          columns = columnsOriginalDM();
        }
        if (source === 2) {
          columns = columnsInspectDM();
        }
        if (source === 3) {
          columns = columnsDeliveryDM();
        }
        break;
      default:
        break;
    }
    return columns;
  };

  const getInterface =
    source === 1
      ? getOriginDataViewList
      : source === 2
      ? getCheckDataViewList
      : getActiveDataViewList;

  const actionRef = useRef<ActionType>();
  return (
    <div>
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="fileManagement-commonList"
            columns={getColumns()}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={false}
            scroll={{ x: scrollX }}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getInterface({
                ...params,
                ...sort,
                ...filter,
                fileId,
                businessDesc,
              });
            }}
            rowKey="id"
            dateFormatter="string"
          />
        </div>
        <div
          className="fileManagement-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Button
            type="default"
            onClick={() => {
              history.goBack();
            }}
          >
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect(({ dispatch, commonListPage }: CommonListPageProps) => ({
  commonListPage,
  dispatch,
}))(commonListPage);
