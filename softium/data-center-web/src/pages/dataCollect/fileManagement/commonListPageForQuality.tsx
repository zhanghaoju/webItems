import React, { useRef, useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import { Table } from '@vulcan/utils';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getQualityList,
  getQualityExport,
} from '@/services/dataUploadFileManagement';
import { history } from 'umi';
import { match } from 'react-router';
import { connect } from 'dva';
import {
  columnsSDAndSM,
  columnsDDAndDM,
  columnsPDAndPM,
  columnsIDAndIM,
} from './columnsForQuality';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';

interface CommonListPageProps {
  commonListPage: any;
  dispatch: any;
}

interface ParamsProps {
  id: string;
}

interface CommonListPageProps {
  match: match<ParamsProps>;
  source: any;
  businessType: any;
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
  quantity?: string;
  productUnit?: string;
  saleDate?: string;
}

const CommonListPageForQuality = (props: CommonListPageProps) => {
  const {
    match: { params },
    source,
    businessType,
  } = props;

  const fileId = params.id;
  const [scrollX, setScrollX] = useState(3500);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    setScrollX(getScroll());
  }, []);

  //不同的columns适配不同的横向滚动条宽度
  const getScroll = () => {
    let scrollX = 1500;
    switch (businessType) {
      case 'SM':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'PM':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'IM':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'DM':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'SD':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'PD':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'ID':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
      case 'DD':
        if (source === 1) {
          scrollX = 3500;
        } else {
          scrollX = 3500;
        }
        break;
    }
    return scrollX;
  };

  const getColumns: any = () => {
    let columns = null;
    switch (businessType) {
      case 'SD':
        columns = columnsSDAndSM();
        break;
      case 'ID':
        columns = columnsIDAndIM();
        break;
      case 'PD':
        columns = columnsPDAndPM();
        break;
      case 'DD':
        columns = columnsDDAndDM();
        break;
      case 'IM':
        columns = columnsIDAndIM();
        break;
      case 'PM':
        columns = columnsPDAndPM();
        break;
      case 'SM':
        columns = columnsSDAndSM();
        break;
      case 'DM':
        columns = columnsDDAndDM();
        break;
      default:
        break;
    }
    return columns;
  };

  //导出
  const exportFunc = (filter: any) => {
    getQualityExport({
      ...searchParams,
      businessType,
      fileId,
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  const actionRef = useRef<ActionType>();
  return (
    <div>
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="fileManagement-commonListQuality"
            columns={getColumns()}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            onSubmit={params => {
              setSearchParams(params);
            }}
            // search={false}
            scroll={{ x: scrollX }}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getQualityList({
                ...params,
                ...sort,
                ...filter,
                fileId,
                businessType,
              });
            }}
            headerTitle={
              <Space>
                {/* <Authorized code={'003-1-3-tabC-export'}> */}
                <Button
                  type="primary"
                  key={'export'}
                  onClick={filter => exportFunc(filter)}
                >
                  导出
                </Button>
                {/* </Authorized> */}
              </Space>
            }
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
}))(CommonListPageForQuality);
