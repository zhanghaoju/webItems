import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';
import { Select, Space, TreeSelect } from 'antd';
import NewTemplate from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/NewTemplate';
import DownloadData from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/DownloadData';
import TemplateList, {
  ListTableRef,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/TemplateList';
import FromInstitutionDetails from '@/pages/TableDataMgmt/SalesTableDataMgmt/Detail/FromInstitutionDetails';
import ProductAffiliation from '@/pages/TableDataMgmt/SalesTableDataMgmt/Detail/ProductAffiliation';
import FromJurisdictionDetails from '@/pages/TableDataMgmt/SalesTableDataMgmt/Detail/FromJurisdictionDetails';
import {
  ChannelList,
  TerminalList,
  TerminalListQuery,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';
import { queryList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/api';
import storage from '@/utils/storage';
import { useModel } from '@@/plugin-model/useModel';
import { Table } from '@vulcan/utils';
import { instCategoryToEN } from '@/pages/TableDataMgmt/SalesTableDataMgmt/utils';
import InstitutionDetails from '@/pages/TableDataMgmt/SalesTableDataMgmt/Detail/InstitutionDetails';

interface ChannelProps {
  location?:
    | {
        state?: string | undefined | null;
      }
    | undefined;
}
const Channel: React.FC<ChannelProps> = ({ location }) => {
  const listTableRef = useRef<ListTableRef>();
  const { pockets, dictionaries } = useModel(
    'TableDataMgmt.SalesTableDataMgmt.useTableDataMgmtModel',
  );
  const {
    windowTimeOption,
    institutionCategoryOption,
    instDistributorLevelOption,
  } = pockets || {};
  const {
    OtherType, //其他机构子类
    HospitalType, //医院类型/子类
    PharmacyType, //药店类型
    AgentType, //代理类型
  } = dictionaries || {};
  useEffect(() => {
    let pattern = storage.get('template');
    if (pattern === 'open') {
      storage.set('template', 'close');
      listTableRef?.current?.show();
    }
  }, []);
  const [query, setQuery] = useState<TerminalListQuery>({});
  // let windowTimeOption: any[] = [];
  const columns: ProColumns<ChannelList>[] = [
    {
      title: '销售年月',
      key: 'periodId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            placeholder={'请选择'}
            style={{ width: '100%' }}
            options={windowTimeOption?.map((t: { text: any; value: any }) => ({
              label: t?.text,
              value: t?.value,
            }))}
          />
        );
      },
    },
    {
      title: '产品挂靠',
      dataIndex: 'prodAffiliation',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '挂靠后',
        },
        0: {
          text: '挂靠前',
        },
      },
    },
    {
      title: '上游机构挂靠',
      dataIndex: 'fromInstAffiliation',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '挂靠后',
        },
        0: {
          text: '挂靠前',
        },
      },
    },
    {
      title: '产品名称',
      key: 'attachedProdName',
      hideInTable: true,
    },
    {
      title: '产品编码',
      key: 'attachedProdCode',
      hideInTable: true,
    },
    {
      title: '上游名称',
      key: 'attachedFromInstName',
      hideInTable: true,
    },
    {
      title: '上游编码',
      key: 'attachedFromInstCode',
      hideInTable: true,
    },
    {
      title: '上游机构主类型',
      key: 'attachedFromInstMainCategory',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            placeholder={'请选择'}
            onSelect={t => {
              form.resetFields(['attachedFromInstCategory']);
            }}
            // mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
              return (
                (option?.label + '').indexOf(input) > -1 ||
                (option?.value + '').indexOf(input) > -1
              );
            }}
            options={institutionCategoryOption?.map(
              (t: { text: any; value: any }) => ({
                label: t?.text,
                value: t?.text,
              }),
            )}
          />
        );
      },
    },
    {
      title: '上游机构类型',
      key: 'attachedFromInstCategory',
      hideInTable: true,
      formItemProps: {
        dependencies: ['attachedFromInstMainCategory'],
      },
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        let mainCategory = form.getFieldValue('attachedFromInstMainCategory');
        let optionsData = [];
        switch (mainCategory) {
          case '其他':
            optionsData = OtherType;
            break;
          case '医院':
            optionsData = HospitalType;
            break;
          case '药店':
            optionsData = PharmacyType;
            break;
          case '代理商':
            optionsData = AgentType;
            break;
          default:
          // 默认代码块
        }
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
              return (
                (option?.label + '').indexOf(input) > -1 ||
                (option?.value + '').indexOf(input) > -1
              );
            }}
            options={optionsData?.map((t: { name: any; value: any }) => ({
              label: t?.name,
              value: t?.name,
            }))}
          />
        );
      },
    },
    {
      title: '上游省份',
      key: 'attachedFromInstProvinceName',
      hideInTable: true,
    },
    {
      title: '上游城市',
      key: 'attachedFromInstCityName',
      hideInTable: true,
    },
    {
      title: '上游经销商级别编码',
      key: 'attachedFromInstDistributorLevelCode',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            mode={'multiple'}
            placeholder={'请选择'}
            allowClear={true}
            style={{ width: '100%' }}
            options={instDistributorLevelOption?.map(
              (t: { text: any; value: any }) => ({
                label: t?.text,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    {
      title: '上游是否为渠道',
      key: 'attachedFromInstIsChannel',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '是',
        },
        0: {
          text: '否',
        },
      },
    },
    {
      title: '下游名称',
      key: 'attachedToInstName',
      hideInTable: true,
    },
    {
      title: '下游编码',
      key: 'attachedToInstCode',
      hideInTable: true,
    },
    {
      title: '下游省份',
      key: 'attachedToInstProvinceName',
      hideInTable: true,
    },
    {
      title: '下游城市',
      key: 'attachedToInstCityName',
      hideInTable: true,
    },
    {
      title: '辖区名称',
      key: 'teryNodeName',
      hideInTable: true,
    },
    {
      title: '辖区编码',
      key: 'teryNodeCode',
      hideInTable: true,
    },
    {
      title: '辖区负责人',
      key: 'teryOwnerName',
      hideInTable: true,
    },
    {
      title: '辖区是否目标',
      key: 'terySysTargetType',
      hideInTable: true,
      valueEnum: {
        是: {
          text: '是',
        },
        否: {
          text: '否',
        },
      },
    },
    {
      title: '流向基本信息',
      search: false,
      children: [
        {
          title: '流向ID',
          dataIndex: 'sfId',
          search: false,
          width: 120,
        },
        {
          title: '财年名称',
          dataIndex: 'financialYearName',
          search: false,
        },
        {
          title: '销售年月',
          dataIndex: 'periodName',
          // search:false
        },
        {
          title: '销售时间',
          dataIndex: 'saleDate',
          search: false,
        },
        {
          title: '标准产品编码',
          dataIndex: 'prodCode',
          width: 110,
          search: false,
        },
        {
          title: '标准产品名称',
          dataIndex: 'prodName',
          // search:false,
        },
        {
          title: '标准产品规格',
          dataIndex: 'specification',
          width: 110,
          search: false,
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          // search:false
        },
        {
          title: '产品批号',
          dataIndex: 'productBatch',
          search: false,
        },
        // {
        //   title: '订单日期',
        //   dataIndex: '订单日期',
        //   search: false,
        // },
        // {
        //   title: '流向单价',
        //   dataIndex: '流向单价',
        //   search: false,
        // },
        {
          title: '供应商名称',
          dataIndex: 'vendorName',
          search: false,
          width: 100,
        },
        {
          title: '开票时间',
          dataIndex: 'invoiceDate',
          search: false,
          width: 100,
        },
        // {
        //   title: '销售备注',
        //   dataIndex: '销售备注',
        //   search: false,
        // },
      ],
    },
    {
      title: '产品信息',
      search: false,
      children: [
        {
          title: '产品编码',
          dataIndex: 'attachedProdCode',
          search: false,
        },
        {
          title: '产品名称',
          dataIndex: 'attachedProdName',
          // search:false,
          render: (_, entity: any) => {
            return <ProductAffiliation item={entity} key={entity.id} />;
          },
        },
        {
          title: '产品品规',
          dataIndex: 'attachedProdSpecification',
          search: false,
        },
        {
          title: '单位',
          dataIndex: 'attachedProdUnit',
          width: 50,
          search: false,
        },
        {
          title: '数量',
          dataIndex: 'attachedProdQuantity',
          search: false,
          width: 50,
        },
        {
          title: '考核价金额',
          dataIndex: 'attachedProdAssessmentAmount',
          search: false,
          width: 100,
        },
        {
          title: '流向金额',
          dataIndex: 'attachedProdAmount',
          width: 120,
          search: false,
        },
      ],
    },
    {
      title: '上游机构',
      search: false,
      children: [
        {
          title: '上游编码',
          dataIndex: 'attachedFromInstCode',
          search: false,
        },
        {
          title: '上游名称',
          dataIndex: 'attachedFromInstName',
          // search:false,
          render: (_, entity: any) => {
            return (
              <FromInstitutionDetails
                item={entity}
                key={entity.id}
                institutionCategoryOption={institutionCategoryOption}
                dictionaries={dictionaries}
              />
            );
          },
        },
        {
          title: '上游经销商级别名称',
          dataIndex: 'attachedFromInstDistributorLevelName',
          width: 150,
          // search:false
        },
        {
          title: '上游是否为渠道',
          dataIndex: 'attachedFromInstIsChannel',
          // search:false,
          width: 120,
          valueEnum: {
            1: {
              text: '是',
            },
            0: {
              text: '否',
            },
          },
        },
        {
          title: '上游省份编码',
          dataIndex: 'attachedFromInstProvinceCode',
          width: 110,
          search: false,
        },
        {
          title: '上游省份名称',
          dataIndex: 'attachedFromInstProvinceName',
          width: 110,
          // search:false
        },
        {
          title: '上游城市编码',
          dataIndex: 'attachedFromInstCityCode',
          width: 110,
          search: false,
        },
        {
          title: '上游城市名称',
          dataIndex: 'attachedFromInstCityName',
          width: 110,
          // search:false
        },
        {
          title: '上游机构主类型',
          dataIndex: 'attachedFromInstMainCategory',
          width: 120,
          // search:false
          // valueEnum: Object.fromEntries(
          //   institutionCategoryOption?.map(
          //     (t: { value: string; text: any }) => [
          //       t?.value,
          //       { text: t?.text },
          //     ],
          //   ) || [],
          // ),
        },
        {
          title: '上游机构类型',
          dataIndex: 'attachedFromInstCategory',
          width: 130,
          // search:false
          // render: (_, entity) => {
          //   return (
          //     <span>
          //       {instCategoryToEN(
          //         dictionaries,
          //         entity?.attachedFromInstMainCategory || '',
          //         entity?.attachedFromInstCategory || '',
          //       )}
          //     </span>
          //   );
          // },
        },
      ],
    },
    {
      title: '下游机构',
      search: false,
      children: [
        {
          title: '下游编码',
          dataIndex: 'attachedToInstCode',
          search: false,
        },
        {
          title: '下游名称',
          dataIndex: 'attachedToInstName',
          // search:false,
          render: (_, entity: any) => {
            return (
              <InstitutionDetails
                item={entity}
                key={entity.id}
                institutionCategoryOption={institutionCategoryOption}
                dictionaries={dictionaries}
              />
            );
          },
        },
        {
          title: '下游经销商级别名称',
          dataIndex: 'attachedToInstDistributorLevelName',
          width: 150,
          // search:false
        },
        {
          title: '下游是否为终端',
          dataIndex: 'attachedToInstIsTerminal',
          width: 120,
          // search:false,
          valueEnum: {
            1: {
              text: '是',
            },
            0: {
              text: '否',
            },
          },
        },
        {
          title: '下游省份编码',
          dataIndex: 'attachedToInstProvinceCode',
          width: 110,
          search: false,
        },
        {
          title: '下游省份名称',
          dataIndex: 'attachedToInstProvinceName',
          width: 110,
          // search:false
        },
        {
          title: '下游城市编码',
          dataIndex: 'attachedToInstCityCode',
          width: 110,
          search: false,
        },
        {
          title: '下游城市名称',
          dataIndex: 'attachedToInstCityName',
          width: 110,
          // search:false
        },
        {
          title: '下游机构主类型',
          dataIndex: 'attachedToInstMainCategory',
          width: 120,
          // search:false
          // valueEnum: Object.fromEntries(
          //   institutionCategoryOption?.map(
          //     (t: { value: string; text: any }) => [
          //       t?.value,
          //       { text: t?.text },
          //     ],
          //   ) || [],
          // ),
        },
        {
          title: '下游机构类型',
          dataIndex: 'attachedToInstCategory',
          width: 110,
          // search:false,
          // render: (_, entity) => {
          //   return (
          //     <span>
          //       {instCategoryToEN(
          //         dictionaries,
          //         entity?.attachedToInstMainCategory || '',
          //         entity?.attachedToInstCategory || '',
          //       )}
          //     </span>
          //   );
          // },
        },
      ],
    },
    {
      title: '上游辖区',
      search: false,
      children: [
        {
          title: '辖区层级',
          dataIndex: 'teryLevelName',
          width: 100,
          search: false,
        },
        {
          title: '辖区编码',
          dataIndex: 'teryNodeCode',
          search: false,
        },
        {
          title: '辖区名称',
          dataIndex: 'teryNodeName',
          // search:false,
          render: (_, entity: ChannelList) => {
            return <FromJurisdictionDetails item={entity} key={entity.id} />;
          },
        },
        {
          title: '辖区负责人',
          dataIndex: 'teryOwnerName',
          width: 110,
          // search:false
        },
        {
          title: '辖区是否目标',
          dataIndex: 'terySysTargetType',
          width: 120,
          // render: (_, entity: ChannelList) => (
          //   <span>{entity?.teryTargetType === 'Target' ? '是' : '否'}</span>
          // ),
        },
        {
          title: '辖区类型',
          dataIndex: 'teryTypeName',
          // search:false
        },
        {
          title: '代理商业务员',
          dataIndex: 'salesMan',
          width: 110,
          search: false,
        },
        {
          title: '+1级辖区编码',
          dataIndex: 'teryNodeParentCode',
          width: 110,
          search: false,
        },
        {
          title: '+1级辖区名称',
          dataIndex: 'teryNodeParentName',
          width: 200,
          search: false,
        },
        {
          title: '辖区是否拆分',
          dataIndex: 'teryHoleId',
          width: 110,
          renderText: text => {
            return <span> {text ? '是' : '否'} </span>;
          },
          // search:false,
        },
        {
          title: '拆分比例',
          dataIndex: 'terySplitRatio',
          search: false,
          width: 100,
          renderText: text => {
            return <span>{(text || 0) * 100 + '%'}</span>;
          },
        },
        {
          title: '拆分后数量',
          dataIndex: 'terySplitQuantity',
          search: false,
          width: 100,
        },
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 130,
      render: (_: ReactNode, entity: ChannelList, index: number) => {
        return [
          <a
            key={entity.id}
            onClick={() => {
              history.push({
                pathname: '/table-data-mgmt/sales/terminal-detail',
                state: entity,
              });
            }}
          >
            流向字段查询
          </a>,
        ];
      },
    },
  ];
  if (windowTimeOption && windowTimeOption.length > 0) {
    return (
      <>
        <Table<ChannelList, TerminalListQuery>
          code={'SalesTable.Data.Mgmt.Channel'}
          bordered={true}
          search={{ labelWidth: 'auto' }}
          sticky={true}
          form={{
            initialValues: {
              periodId:
                windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value,
              prodAffiliation: '0',
              fromInstAffiliation: '0',
            },
          }}
          headerTitle={
            <Space>
              <DownloadData query={query} type={'channel'} />
              <NewTemplate type="add" item={{}} />
              <TemplateList modelRef={listTableRef} />
            </Space>
          }
          beforeSearchSubmit={params => {
            let userInfo = storage.get('userInfo');
            params.tenantId = userInfo?.tenantId;
            params.instTeryVision = 'from_inst';
            params.prodAffiliation = (params?.prodAffiliation || 0) * 1;
            params.fromInstAffiliation = (params?.fromInstAffiliation || 0) * 1;
            params.attachedFromInstIsChannel = params?.attachedFromInstIsChannel
              ? params?.attachedFromInstIsChannel * 1
              : undefined;
            setQuery(params);
            return params;
          }}
          key={'id'}
          scroll={{ x: 7000 }}
          columns={columns}
          request={async params => {
            const res = await queryList(params);
            const { rows, ...others } = res?.data || {};
            return {
              ...others,
              data: rows || [],
            };
          }}
        />
      </>
    );
  }
  return null;
};
export default Channel;
