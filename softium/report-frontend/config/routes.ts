import { IRoute } from 'umi';
import { IBestAFSRoute } from '@umijs/plugin-layout';

const routes: IBestAFSRoute = [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/terminal',
      },
      {
        path: '/terminal',
        name: '终端分析',
        icon: 'bank',
        title: '终端分析',
        code: 'Terminal',
        routes: [
          {
            path: '/terminal',
            redirect: '/terminal/multiple-analysis',
          },
          {
            path: 'multiple-analysis',
            name: '综合分析',
            title: '综合分析',
            code: 'Terminal.MultipleAnalysis',
            routes: [
              {
                path: '/terminal/multiple-analysis',
                redirect: '/terminal/multiple-analysis/terminal-cockpit',
              },
              {
                path: 'terminal-cockpit',
                name: '终端管理驾驶舱',
                title: '终端管理驾驶舱',
                component: '@/pages/AnalysisReport/TerminalCockpit',
                code: 'Terminal.MultipleAnalysis.TerminalCockpit',
              },
              {
                path: 'terminal-map',
                name: '终端销量地图',
                title: '终端销量地图',
                component: '@/pages/AnalysisReport/TerminalMap',
                code: 'Terminal.MultipleAnalysis.TerminalMap',
              },
            ],
          },
          {
            path: 'sales-analysis',
            name: '销量分析',
            title: '销量分析',
            code: 'Terminal.SalesAnalysis',
            routes: [
              {
                path: '/terminal/sales-analysis',
                redirect: '/terminal/sales-analysis/target',
              },
              {
                path: 'target',
                name: '目标终端月销量',
                title: '目标终端月销量',
                component: '@/pages/BasicReport/Terminal',
                code: 'Terminal.SalesAnalysis.Target',
              },
              {
                path: 'nature',
                name: '月度终端自然流销量',
                title: '月度终端自然流销量',
                component: '@/pages/BasicReport/TerminalNature',
                code: 'Terminal.SalesAnalysis.Nature',
              },
              {
                path: 'target-trend',
                name: '目标终端销售趋势_标准',
                title: '目标终端销售趋势_标准',
                component:
                  '@/pages/TerminalAnalysis/Sales/TargetTerminalSalesTrend',
                code: 'Terminal.SalesAnalysis.TargetTrend',
              },
              {
                path: 'target-trend-special',
                name: '目标终端销售趋势_自定义',
                title: '目标终端销售趋势_自定义',
                component:
                  '@/pages/TerminalAnalysis/Sales/TargetTerminalSalesTrendSpecial',
                code: 'Terminal.SalesAnalysis.SpecialTargetTrend',
              },
              {
                path: 'terminal-without-sale',
                name: '目标终端无购进',
                title: '目标终端无购进',
                component:
                  '@/pages/TerminalAnalysis/Sales/TargetTerminalWithoutSale',
                code: 'Terminal.Without.Sale',
              },
              {
                path: 'terminal-proportion-sale',
                name: '终端类型纯销占比',
                title: '终端类型纯销占比',
                component:
                  '@/pages/TerminalAnalysis/Sales/TerminalProportionSale',
                code: 'Terminal.Proportion.Sale',
              },
            ],
          },
        ],
      },
      {
        path: '/channel',
        name: '渠道分析',
        icon: 'share-alt',
        title: '渠道分析',
        code: 'Channel',
        routes: [
          {
            path: '/channel',
            redirect: '/channel/sales-analysis',
          },
          {
            path: 'sales-analysis',
            name: '销量分析',
            title: '销量分析',
            code: 'Channel.SalesAnalysis',
            routes: [
              {
                path: '/channel/sales-analysis/',
                redirect: '/channel/sales-analysis/target',
              },
              {
                path: 'target',
                name: '目标渠道月销量',
                title: '目标渠道月销量',
                code: 'Channel.SalesAnalysis.Target',
                component: '@/pages/BasicReport/Channel',
              },
              {
                path: 'nature',
                name: '月度渠道自然流销量',
                title: '月度渠道自然流销量',
                code: 'Channel.SalesAnalysis.Nature',
                component: '@/pages/BasicReport/ChannelNature',
              },
              {
                path: 'channel-without-sale',
                name: '目标渠道无销售',
                title: '目标渠道无销售',
                component:
                  '@/pages/TerminalAnalysis/Sales/TargetChannelWithoutSale',
                code: 'Channel.Without.Sale',
              },
              {
                path: 'purchase-sale-analysis',
                name: '购销倒挂分析',
                title: '购销倒挂分析',
                component:
                  '@/pages/TerminalAnalysis/Sales/PurchaseSaleAnalysis',
                code: 'Purchase.Sale.Analysis',
              },
              {
                path: 'warning-flow-list',
                name: '异常流向清单',
                title: '异常流向清单',
                component:
                  '@/pages/TerminalAnalysis/Sales/PurchaseSaleAnalysis',
                code: 'Warning.Flow.List',
              },
              {
                path: 'channel-sales-proportion',
                name: '客户提货及分销达成',
                title: '客户提货及分销达成',
                hideChildrenInMenu: true,
                code: 'Channel.Sales.Proportion',
                component:
                  '@/pages/TerminalAnalysis/Sales/ChannelSalesProportion',
              },
              {
                path: 'channel-through-detail',
                name: '渠道穿透明细',
                title: '渠道穿透明细',
                hideChildrenInMenu: true,
                code: 'Channel.Through.Detail',
                component:
                  '@/pages/TerminalAnalysis/Sales/ChannelThroughDetail',
              },
              {
                path: 'channel-through-sum',
                name: '渠道穿透汇总',
                title: '渠道穿透汇总',
                hideChildrenInMenu: true,
                code: 'Channel.Through.Sum',
                component: '@/pages/TerminalAnalysis/Sales/ChannelThroughSum',
              },
            ],
          },
          {
            path: 'inventory-analysis',
            name: '库存分析',
            title: '库存分析',
            code: 'Channel.Inventory',
            routes: [
              {
                path: '/channel/inventory-analysis',
                redirect: '/channel/inventory-analysis/balance',
              },
              {
                path: 'balance',
                name: '月度进销存平衡表',
                title: '月度进销存平衡表',
                hideChildrenInMenu: true,
                code: 'Channel.Inventory.Balance',
                routes: [
                  {
                    path: '/channel/inventory-analysis/balance',
                    redirect: '/channel/inventory-analysis/balance/list',
                  },
                  {
                    path: 'list',
                    component: '@/pages/TheoreticalInventory/List',
                    name: '列表',
                    title: '列表',
                    selectedParentKey: '/channel/inventory-analysis/balance',
                  },
                  {
                    path: 'detail',
                    component: '@/pages/TheoreticalInventory/Detail',
                    name: '详情',
                    title: '详情',
                    selectedParentKey: '/channel/inventory-analysis/balance',
                  },
                ],
              },
              {
                path: 'warning',
                name: '月度库存异常预警',
                title: '月度库存异常预警',
                hideChildrenInMenu: true,
                code: 'Channel.Inventory.Warning',
                component: '@/pages/ChannelAnalysis/Inventory/Warning',
              },
              {
                path: 'near-term-mgmt',
                name: '近效期管理',
                title: '近效期管理',
                hideChildrenInMenu: true,
                code: 'Near.Term.Mgmt',
                component: '@/pages/ChannelAnalysis/Inventory/NearTermMgmt',
              },
              {
                path: 'customer-inventory-mgmt',
                name: '客户实地库存及效期管理',
                title: '客户实地库存及效期管理',
                hideChildrenInMenu: true,
                code: 'Customer.Inventory.Mgmt',
                component: '@/pages/ChannelAnalysis/Inventory/NearTermMgmt',
              },
              {
                path: 'stock-batch-proportion',
                name: '客户实地库存及效期分布图',
                title: '客户实地库存及效期分布图',
                hideChildrenInMenu: true,
                code: 'Stock.Batch.Proportion',
                component:
                  '@/pages/ChannelAnalysis/Inventory/StockBatchProportion',
              },
            ],
          },
        ],
      },
      {
        path: 'sales-appeal',
        name: '销量申诉',
        title: '销量申诉',
        icon: 'table',
        code: 'SalesAppeal',
        routes: [
          {
            path: '/sales-appeal',
            redirect: '/sales-appeal/terminal',
          },
          {
            path: 'terminal',
            component: '@/pages/SalesAppeal/Terminal',
            name: '终端月销量查询',
            title: '终端月销量查询',
            code: 'SalesAppeal.Terminal',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/sales-appeal/terminal',
                redirect: '/sales-appeal/terminal/list',
              },
              {
                path: 'list',
                component: '@/pages/SalesAppeal/Terminal/List',
                name: '销量列表',
                title: '销量列表',
                selectedParentKey: '/sales-appeal/terminal',
              },
              {
                path: 'add',
                component: '@/pages/SalesAppeal/Terminal/Add',
                name: '添加申诉',
                title: '添加申诉',
                selectedParentKey: '/sales-appeal/terminal',
              },
            ],
          },
          {
            path: 'channel',
            component: '@/pages/SalesAppeal/Channel',
            name: '渠道月销量查询',
            title: '渠道月销量查询',
            hideChildrenInMenu: true,
            code: 'SalesAppeal.Channel',
            routes: [
              {
                path: '/sales-appeal/channel',
                redirect: '/sales-appeal/channel/list',
              },
              {
                path: 'list',
                component: '@/pages/SalesAppeal/Channel/List',
                name: '销量列表',
                title: '销量列表',
                selectedParentKey: '/sales-appeal/channel',
              },
              {
                path: 'add',
                component: '@/pages/SalesAppeal/Channel/Add',
                name: '添加申诉',
                title: '添加申诉',
                selectedParentKey: '/sales-appeal/channel',
              },
            ],
          },
          {
            path: 'appeal-center',
            name: '申诉中心',
            code: 'SalesAppeal.AppealCenter',
            routes: [
              {
                path: '/sales-appeal/appeal-center',
                redirect: '/sales-appeal/appeal-center/appeal-list',
              },
              {
                path: '/sales-appeal/appeal-center/appeal-list',
                name: '申诉列表',
                title: '申诉列表',
                code: 'SalesAppeal.AppealCenter.List',
                component: '@/pages/SalesAppeal/AppealCenter/AppealList',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/sales-appeal/appeal-center/appeal-list',
                    redirect: '/sales-appeal/appeal-center/appeal-list/list',
                  },
                  {
                    path: 'list',
                    component:
                      '@/pages/SalesAppeal/AppealCenter/AppealList/List',
                    name: '申诉列表',
                    title: '申诉列表',
                    selectedParentKey:
                      '/sales-appeal/appeal-center/appeal-list',
                  },
                  {
                    path: 'detail/:id',
                    component:
                      '@/pages/SalesAppeal/AppealCenter/AppealList/Detail',
                    name: '申诉详情',
                    title: '申诉详情',
                    selectedParentKey:
                      '/sales-appeal/appeal-center/appeal-list',
                  },
                ],
              },
              {
                path: '/sales-appeal/appeal-center/approval-center',
                name: '审批中心',
                title: '审批中心',
                code: 'SalesAppeal.AppealCenter.Approval',
                component: '@/pages/SalesAppeal/AppealCenter/ApprovalCenter',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/sales-appeal/appeal-center/approval-center',
                    redirect:
                      '/sales-appeal/appeal-center/approval-center/list',
                  },
                  {
                    path: 'list',
                    component:
                      '@/pages/SalesAppeal/AppealCenter/ApprovalCenter/List',
                    name: '申诉列表',
                    title: '申诉列表',
                    selectedParentKey:
                      '/sales-appeal/appeal-center/approval-center',
                  },
                  {
                    path: 'detail/:id',
                    component:
                      '@/pages/SalesAppeal/AppealCenter/ApprovalCenter/Detail',
                    name: '申诉详情',
                    title: '申诉详情',
                    selectedParentKey:
                      '/sales-appeal/appeal-center/approval-center',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/delivery',
        name: '发货分析',
        icon: 'rocket',
        title: '发货分析',
        code: 'Delivery',
        routes: [
          {
            path: '/delivery',
            redirect: '/delivery/month',
          },
          {
            path: 'month',
            name: '月度发货明细表',
            title: '月度发货明细表',
            code: 'Delivery.Month',
            component: '@/pages/DeliveryAnalysis/MonthlyDelivery',
          },
        ],
      },
      {
        path: '/agent',
        name: '代理商分析',
        icon: 'share-alt',
        title: '代理商分析',
        code: 'Agent',
        routes: [
          {
            path: '/agent',
            redirect: '/agent/salesman-sales',
          },
          {
            path: 'salesman-sales',
            name: '代理商业务员销售',
            title: '代理商业务员销售',
            code: 'Agent.SalesmanSales',
            component: '@/pages/AgentAnalysis/SalesmanSales',
          },
        ],
      },
      {
        path: '/product',
        name: '产品分析',
        title: '产品分析',
        code: 'Product',
        icon: 'appstore',
        routes: [
          {
            path: '/product',
            redirect: '/product/sales-distribution',
          },
          {
            path: 'sales-distribution',
            component: '@/pages/ProductAnalysis/SalesDistribution',
            name: '产品销售分布（医院级别）',
            title: '产品销售分布（医院级别）',
            code: 'Product.SalesDistribution',
          },
          {
            path: 'sales-volume',
            component: '@/pages/ProductAnalysis/SalesVolume',
            name: '产品销量占比',
            title: '产品销量占比',
            code: 'Product.SalesVolume',
          },
        ],
      },
      {
        path: '/achievement',
        name: '业绩分析',
        title: '业绩分析',
        code: 'Achievement',
        icon: 'area-chart',
        routes: [
          {
            path: '/achievement',
            redirect: '/achievement/jurisdiction',
          },
          {
            path: 'jurisdiction',
            name: '辖区业绩分析',
            title: '辖区业绩分析',
            code: 'Achievement.Jurisdiction',
            routes: [
              {
                path: '/achievement/jurisdiction',
                redirect: '/achievement/jurisdiction/sales-volume',
              },
              {
                path: 'sales-volume',
                name: '销量业绩分析',
                title: '销量业绩分析',
                code: 'Achievement.Jurisdiction.SalesVolume',
                component:
                  '@/pages/AchievementAnalysis/Jurisdiction/SalesVolume',
              },
              {
                path: 'new-dev',
                name: '新开发业绩分析',
                title: '新开发业绩分析',
                code: 'Achievement.Jurisdiction.NewDev',
                component: '@/pages/AchievementAnalysis/Jurisdiction/NewDev',
              },
              {
                path: 'sale-trend',
                name: '销售业绩综合趋势图',
                title: '销售业绩综合趋势图',
                code: 'Achievement.Jurisdiction.SaleTrend',
                component: '@/pages/AchievementAnalysis/Jurisdiction/SaleTrend',
              },
              {
                path: 'area-terminal-analysis',
                name: '大区销售业绩分析',
                title: '大区销售业绩分析',
                code: 'Area.Terminal.Analysis',
                component:
                  '@/pages/AchievementAnalysis/Jurisdiction/AreaAnalysis',
              },
            ],
          },
        ],
      },
      {
        path: '/achievement-rank',
        name: '业绩排名',
        title: '业绩排名',
        code: 'AchievementRank',
        icon: 'fire',
        routes: [
          {
            path: '/achievement-rank',
            redirect: '/achievement-rank/jurisdiction',
          },
          {
            path: 'jurisdiction',
            name: '辖区业绩排名',
            title: '辖区业绩排名',
            code: 'AchievementRank.Jurisdiction',
            routes: [
              {
                path: '/achievement-rank/jurisdiction',
                redirect: '/achievement-rank/jurisdiction/terminal-sales',
              },
              {
                path: 'terminal-sales',
                name: '目标辖区终端销售排名',
                title: '目标辖区终端销售排名',
                code: 'AchievementRank.Jurisdiction.TerminalSales',
                component: '@/pages/AchievementRank/Jurisdiction/TerminalSales',
              },
            ],
          },
        ],
      },
      {
        path: '/monitor-center',
        name: '监控中心',
        title: '监控中心',
        code: 'MonitorCenter',
        icon: 'fire',
        routes: [
          {
            path: '/monitor-center',
            redirect: '/monitor-center/collectMonitor',
          },
          {
            path: 'collectMonitor',
            name: '采集监控',
            title: '采集监控',
            code: 'MonitorCenter.CollectMonitor',
            routes: [
              {
                path: '/monitor-center/collectMonitor',
                redirect: '/monitor-center/collectMonitor/defectProdInstFile',
              },
              {
                path: 'defectProdInstFile',
                name: '文件缺品缺规',
                title: '文件缺品缺规',
                code: 'MonitorCenter.CollectMonitor.DefectProdInstFile',
                component:
                  '@/pages/MonitorCenter/CollectMonitor/DefectProdInstFile',
              },
            ],
          },
        ],
      },
      {
        path: '/custom-report',
        name: '自定义报表',
        title: '自定义报表',
        code: 'CustomReport',
        icon: 'User',
        // routes: [
        // {
        //   path: '/custom-report',
        //   redirect: '/custom-report',
        // },
        // {
        //   path: 'myReport',
        //   name: '我的报表',
        //   title: '我的报表',
        //   code: 'CustomReport.MyReport',
        routes: [
          {
            path: '/custom-report',
            redirect: '/custom-report/terminalAnalysis',
          },
          {
            path: 'terminalAnalysis',
            name: '终端销量统计表',
            title: '终端销量统计表',
            code: 'CustomReport.MyReport.TerminalAnalysis',
            component: '@/pages/CustomReport/MyReport/TerminalAnalysis',
          },
          {
            path: 'terminal-salesman',
            name: '业务员新开发终端',
            title: '业务员新开发终端',
            code: 'CustomReport.MyReport.TerminalSalesman',
            component: '@/pages/CustomReport/MyReport/TerminalSalesman',
          },
          {
            path: 'sales-comprehensive',
            name: '销售省区综合指标',
            title: '销售省区综合指标',
            code: 'CustomReport.MyReport.SalesComprehensive',
            component: '@/pages/CustomReport/MyReport/SalesComprehensive',
          },
          {
            path: 'analysis-by-terminal',
            name: '销售统计表_按终端',
            title: '销售统计表_按终端',
            code: 'CustomReport.MyReport.AnalysisByTerminal',
            component: '@/pages/CustomReport/MyReport/AnalysisByTerminal',
          },
          {
            path: 'product-distribution',
            name: '产品销售分布表',
            title: '产品销售分布表',
            code: 'CustomReport.MyReport.ProductDistribution',
            component: '@/pages/CustomReport/MyReport/ProductDistribution',
          },
          {
            path: 'hospitals-distribution',
            name: '产品销售医院分布表',
            title: '产品销售医院分布表',
            code: 'CustomReport.MyReport.HospitalsDistribution',
            component: '@/pages/CustomReport/MyReport/HospitalsDistribution',
          },
          {
            path: 'Sales-details',
            name: '销售流向明细',
            title: '销售流向明细',
            code: 'CustomReport.MyReport.SalesDetails',
            component: '@/pages/CustomReport/MyReport/SalesDetails',
          },
          {
            path: 'manager-detail',
            name: '商务流向汇总表',
            title: '商务流向汇总表',
            code: 'CustomReport.MyReport.ManagerDetail',
            component: '@/pages/CustomReport/MyReport/ManagerDetail',
          },
          {
            path: 'product-analysis',
            name: '产品销售分析表',
            title: '产品销售分析表',
            code: 'CustomReport.MyReport.ProductAnalysis',
            component: '@/pages/CustomReport/MyReport/ProductAnalysis',
          },
          {
            path: 'manager-delivery-rank',
            name: '商务经理发货排名',
            title: '商务经理发货排名',
            code: 'CustomReport.MyReport.ManagerDeliveryRank',
            component: '@/pages/CustomReport/MyReport/ManagerDeliveryRank',
          },
          {
            path: 'terminal-sales-trend',
            name: '终端销售趋势',
            title: '终端销售趋势',
            code: 'CustomReport.MyReport.TerminalSalesTrend',
            component: '@/pages/CustomReport/MyReport/TerminalSalesTrend',
          },
          {
            path: 'agt-sales-rate',
            name: '代理商贡献比',
            title: '代理商贡献比',
            code: 'CustomReport.MyReport.AgtSalesRate',
            component: '@/pages/CustomReport/MyReport/AgtSalesRate',
          },
          {
            path: 'agt-sales-rank',
            name: '业务员绩效排名',
            title: '业务员绩效排名',
            code: 'CustomReport.MyReport.AgtSalesRank',
            component: '@/pages/CustomReport/MyReport/AgtSalesRank',
          },
          {
            path: 'customBalance',
            name: '月度进销存月报表',
            title: '月度进销存月报表',
            hideChildrenInMenu: true,
            code: 'Channel.Inventory.CustomBalance',
            routes: [
              {
                path: '/custom-report/customBalance',
                redirect: '/custom-report/customBalance/list',
              },
              {
                path: 'list',
                component: '@/pages/TheoreticalInventoryCustom/List',
                name: '列表',
                title: '列表',
                selectedParentKey: '/custom-report/customBalance',
              },
              {
                path: 'detail',
                component: '@/pages/TheoreticalInventoryCustom/Detail',
                name: '详情',
                title: '详情',
                selectedParentKey: '/custom-report/customBalance',
              },
            ],
          },
          {
            path: 'warningCustom',
            name: '库存预警',
            title: '库存预警',
            hideChildrenInMenu: true,
            code: 'Channel.Inventory.WarningCustom',
            component: '@/pages/ChannelAnalysis/Inventory/WarningCustom',
          },
        ],
        // },
        // ],
      },
      {
        path: '/year-config',
        name: '报表配置',
        icon: 'setting',
        code: 'YearConfig',
        routes: [
          {
            path: '/year-config/opening-inventory',
            name: '期初理论库存导入',
            hideChildrenInMenu: true,
            code: 'YearConfig.OpeningInventory',
            routes: [
              {
                path: '/year-config/opening-inventory',
                redirect: '/year-config/opening-inventory/list',
              },
              {
                path: '/year-config/opening-inventory/list',
                name: '列表',
                component: '@/pages/YearConfig/OpeningInventory/List',
                selectedParentKey: '/year-config/opening-inventory',
              },
              {
                path: '/year-config/opening-inventory/import',
                name: '导入',
                component: '@/pages/YearConfig/OpeningInventory/Import',
                selectedParentKey: '/year-config/opening-inventory',
              },
            ],
          },
          {
            path: '/year-config/inventory-warning',
            name: '库存预警阈值设置',
            hideChildrenInMenu: true,
            code: 'YearConfig.InventoryWarning',
            routes: [
              {
                path: '/year-config/inventory-warning',
                redirect: '/year-config/inventory-warning/list',
              },
              {
                path: '/year-config/inventory-warning/list',
                name: '列表',
                component: '@/pages/YearConfig/InventoryWarning',
                selectedParentKey: '/year-config/inventory-warning',
              },
              {
                path: '/year-config/inventory-warning/import',
                name: '导入',
                component: '@/pages/YearConfig/InventoryWarning/Import',
                selectedParentKey: '/year-config/inventory-warning',
              },
            ],
          },
          {
            name: '缺品缺规名单导入',
            path: '/year-config/defect-inst-prod',
            hideChildrenInMenu: true,
            code: 'YearConfig.DefectInstProd',
            routes: [
              {
                path: '/year-config/defect-inst-prod',
                redirect: '/year-config/defect-inst-prod/list',
              },
              {
                path: '/year-config/defect-inst-prod/list',
                name: '列表',
                component: '@/pages/YearConfig/DefectInstProd',
                selectedParentKey: '/year-config/defect-inst-prod',
              },
              {
                path: '/year-config/defect-inst-prod/import',
                name: '导入',
                component: '@/pages/YearConfig/DefectInstProd/Import',
                selectedParentKey: '/year-config/defect-inst-prod',
              },
            ],
          },
          {
            path: 'transfer-import',
            name: '划拨导入',
            title: '划拨导入',
            code: 'ReportConfig.Transfer.Import',
            routes: [
              {
                path: '/year-config/transfer-import',
                redirect: '/year-config/transfer-import/list',
              },
              {
                path: 'list',
                name: '列表',
                title: '列表',
                component: '@/pages/YearConfig/TransferImport/List',
                hideInMenu: true,
                selectedParentKey: '/year-config/transfer-import',
              },
              {
                path: 'import',
                name: '导入',
                title: '导入',
                component: '@/pages/YearConfig/TransferImport/Import',
                hideInMenu: true,
                selectedParentKey: '/year-config/transfer-import',
              },
            ],
          },
        ],
      },
      {
        path: '/dynamic-sales',
        name: '动销量',
        title: '动销量',
        code: 'DynamicSales',
        icon: 'area-chart',
        routes: [
          {
            path: '/dynamic-sales',
            redirect: '/dynamic-sales/sale-quantity-inst',
          },
          {
            path: 'sale-quantity-inst',
            name: '经销商动销达成',
            title: '经销商动销达成',
            code: 'Sale.Quantity.Inst',
            component: '@/pages/DynamicSales/SaleQuantityInst',
          },
          {
            path: 'sale-quantity-terminal',
            name: '终端动销达成',
            title: '终端动销达成',
            code: 'Sale.Quantity.Terminal',
            component: '@/pages/DynamicSales/SaleQuantityTerminal',
          },
        ],
      },
      {
        path: '/terminal-data-analysis',
        name: '终端',
        title: '终端',
        code: 'Terminal.Data.Analysis',
        icon: 'share-alt',
        routes: [
          {
            path: '/terminal-data-analysis',
            redirect: '/terminal-data-analysis/new-terminal-sale',
          },
          {
            path: 'new-terminal-sale',
            name: '新进终端销量跟踪',
            title: '新进终端销量跟踪',
            code: 'New.Terminal.Sale',
            component: '@/pages/TerminalDataAnalysis/NewTerminalSale',
          },
          {
            path: 'terminal-quantity-sale',
            name: '终端数量与销量',
            title: '终端数量与销量',
            code: 'Terminal.Quantity.Sale',
            component: '@/pages/TerminalDataAnalysis/TerminalQuantitySale',
          },
          {
            path: 'terminal-quantity-inst',
            name: '经销商终端数量',
            title: '经销商终端数量',
            code: 'Terminal.Quantity.Inst',
            component: '@/pages/TerminalDataAnalysis/TerminalQuantityInst',
          },
          {
            path: 'terminal-no-purchase',
            name: '未进货终端清单',
            title: '未进货终端清单',
            code: 'Terminal.No.Purchase',
            component: '@/pages/TerminalDataAnalysis/TerminalNoPurchase',
          },
        ],
      },
      {
        path: '/table-data-mgmt',
        name: '底表管理',
        title: '底表管理',
        code: 'Table.Data.Mgmt',
        icon: 'pic-center',
        routes: [
          {
            path: '/table-data-mgmt',
            redirect: '/table-data-mgmt/sales',
          },
          {
            path: 'sales',
            name: '销售底表管理',
            title: '销售底表管理',
            code: 'SalesTable.Data.Mgmt',
            component: '@/pages/TableDataMgmt/SalesTableDataMgmt',
            routes: [
              {
                path: '/table-data-mgmt/sales',
                redirect: '/table-data-mgmt/sales/sales-query',
              },
              {
                path: 'sales-query',
                component:
                  '@/pages/TableDataMgmt/SalesTableDataMgmt/SalesDataTab',
                hideInMenu: true,
                routes: [
                  {
                    path: '/table-data-mgmt/sales/sales-query',
                    redirect: '/table-data-mgmt/sales/sales-query/terminal',
                  },
                  {
                    path: 'terminal',
                    name: '下游销售底表',
                    title: '下游销售底表',
                    component:
                      '@/pages/TableDataMgmt/SalesTableDataMgmt/Terminal',
                    hideInMenu: true,
                    selectedParentKey: '/table-data-mgmt/sales',
                  },
                  {
                    path: 'channel',
                    name: '上游销售底表',
                    title: '上游销售底表',
                    component:
                      '@/pages/TableDataMgmt/SalesTableDataMgmt/Channel',
                    hideInMenu: true,
                    selectedParentKey: '/table-data-mgmt/sales',
                  },
                ],
              },
              {
                path: 'terminal-detail',
                name: '流向字段查询',
                title: '流向字段查询',
                component:
                  '@/pages/TableDataMgmt/SalesTableDataMgmt/Detail/FlowDetails',
                hideInMenu: true,
                selectedParentKey: '/table-data-mgmt/sales',
              },
              {
                path: 'template-add',
                name: '新建模板',
                title: '新建模板',
                component:
                  '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/',
                hideInMenu: true,
                selectedParentKey: '/table-data-mgmt/sales',
              },
            ],
          },
        ],
      },
      {
        path: '/payment-collection',
        name: '回款',
        title: '回款',
        code: 'Payment.Collection',
        icon: 'snippets',
        routes: [
          {
            path: '/payment-collection',
            redirect: '/payment-collection/report',
          },
          {
            path: 'report',
            name: '回款报表',
            title: '回款报表',
            code: 'Payment.Collection.Report',
            component: '@/pages/PaymentCollection/ReportForm',
          },
          {
            path: 'import',
            name: '回款导入',
            title: '回款导入',
            code: 'Payment.Collection.Import',
            // component: '@/pages/PaymentCollection/ImportReport',
            routes: [
              {
                path: '/payment-collection/import',
                redirect: '/payment-collection/import/list',
              },
              {
                path: 'list',
                name: '列表',
                title: '列表',
                component: '@/pages/PaymentCollection/ImportReport/List',
                hideInMenu: true,
                selectedParentKey: '/payment-collection/import',
              },
              {
                path: 'payment-import',
                name: '导入',
                title: '导入',
                component: '@/pages/PaymentCollection/ImportReport/Import',
                hideInMenu: true,
                selectedParentKey: '/payment-collection/import',
              },
            ],
          },
        ],
      },
      {
        path: '/achieve-analysis',
        name: '达成分析',
        title: '达成分析',
        code: 'Achieve.Analysis',
        icon: 'line-chart',
        routes: [
          {
            path: '/achieve-analysis',
            redirect: '/achieve-analysis/product-achieve',
          },
          {
            path: 'product-achieve',
            name: '产品达成',
            title: '产品达成',
            code: 'Achieve.Analysis.ProductAchieve',
            component: '@/pages/AchieveAnalysis/ProductAchieve',
          },
          {
            path: 'invoice-achieve',
            name: '开票达成',
            title: '开票达成',
            code: 'Achieve.Analysis.InvoiceAchieve',
            component: '@/pages/AchieveAnalysis/InvoiceAchieve',
          },
          {
            path: 'representative-achieve',
            name: '代表达成',
            title: '代表达成',
            code: 'Achieve.Analysis.RepresentativeAchieve',
            component: '@/pages/AchieveAnalysis/RepresentativeAchieve',
          },
          {
            path: 'proportion',
            name: '产品达成及终端纯销占比图',
            title: '产品达成及终端纯销占比图',
            code: 'Achieve.Analysis.Proportion',
            component: '@/pages/AchieveAnalysis/Proportion',
          },
        ],
      },
    ],
  },
];

export default routes as IRoute[];
