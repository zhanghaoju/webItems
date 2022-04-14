import { IRoute } from 'umi';
import { IBestAFSRoute } from '@umijs/plugin-layout';

const routes: IBestAFSRoute = [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/workBench',
      },
      {
        path: '/workBench',
        component: '@/pages/workBench',
        name: '工作台',
        icon: 'dashboard',
        code: 'workBench',
      },
      {
        path: '/dataCollect',
        component: '@/pages/dataCollect',
        name: '数据采集',
        icon: 'dashboard',
        code: 'dataCollect',
        routes: [
          {
            path: '/dataCollect/billManage',
            component: '@/pages/dataCollect/billManage',
            name: '打单管理',
            code: 'billManage',
            icon: 'dashboard',
            routes: [
              {
                path: '/dataCollect/billManage/verifyList',
                component: '@/pages/dataCollect/billManage/verifyList',
                name: '验证名单',
                code: 'verifyList',
              },
              //导入
              {
                path: '/dataCollect/billManage/verifyList/import',
                component: '@/pages/dataCollect/billManage/verifyList/Import',
                associatedHighLight:
                  '/dataCollect/billManage/verifyList/Import',
              },
              {
                path: '/dataCollect/billManage/billPrint',
                component: '@/pages/dataCollect/billManage/billPrint',
                name: '打单名单',
                code: 'billPrint',
              },
              //导入
              {
                path: '/dataCollect/billManage/billPrint/import',
                component: '@/pages/dataCollect/billManage/billPrint/Import',
                associatedHighLight: '/dataCollect/billManage/billPrint/Import',
              },
            ],
          },
          {
            path: '/dataCollect/monitorReport',
            component: '@/pages/dataCollect/monitorReport',
            name: '打单监控',
            code: 'monitorReport',
            icon: 'dashboard',
            routes: [
              {
                path: '/dataCollect/monitorReport/dayBillMonitor',
                component: '@/pages/dataCollect/monitorReport/dayBillMonitor',
                name: '日到达监控',
                code: 'dayBillMonitor',
              },
              {
                path: '/dataCollect/monitorReport/monthBillMonitor',
                component: '@/pages/dataCollect/monitorReport/monthBillMonitor',
                name: '月到达监控',
                code: 'monthBillMonitor',
              },
            ],
          },
          {
            path: '/dataCollect/uploadData',
            component: '@/pages/dataCollect/uploadData',
            name: '上传数据',
            code: 'uploadData',
          },
          {
            path: '/dataCollect/fileManagement',
            component: '@/pages/dataCollect/fileManagement',
            name: '文件管理',
            code: 'fileManagement',
          },
          {
            path: '/dataCollect/fileManagement/detail/:id?',
            component: '@/pages/dataCollect/fileManagement/detail',
            associatedHighLight: '/dataCollect/fileManagement',
          },
          {
            path: '/dataCollect/fileManagement/qualityDetail/:id?',
            component: '@/pages/dataCollect/fileManagement/qualityDetail',
            associatedHighLight: '/dataCollect/fileManagement',
          },
          {
            path:
              '/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig',
            component:
              '@/pages/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig',
            name: '经销商模板配置',
            code: 'manualUploadStorageConfig',
          },
          {
            path:
              '/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig/uploadTemplateConfig/detail',
            component:
              '@/pages/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig/uploadTemplateConfig/detail',
            associatedHighLight:
              '/dataCollect/insititutionConfig/storageConfig/manualUploadStorageConfig/uploadTemplateConfig',
          },
        ],
      },
      {
        path: '/dataWash',
        component: '@/pages/dataWash',
        name: '数据清洗',
        icon: 'dashboard',
        code: 'dataWash',
        routes: [
          {
            path: '/dataWash/toDoProcess/monthDataProcess',
            component: '@/pages/dataWash/toDoProcess/monthDataProcess',
            name: '月数据处理',
            code: 'monthDataProcess',
          },
          //批号处理--导入
          {
            path: '/dataWash/toDoProcess/monthDataProcess/BatchProcess/Import',
            component:
              '@/pages/dataWash/toDoProcess/monthDataProcess/BatchProcess/Import',
            associatedHighLight: '/toDoProcess/monthDataProcess',
          },
          {
            path: '/dataWash/toDoProcess/dayDataProcess',
            component: '@/pages/dataWash/toDoProcess/dayDataProcess',
            name: '日数据处理',
            code: 'dayDataProcess',
          },
          //批号处理--导入
          {
            path: '/dataWash/toDoProcess/dayDataProcess/BatchProcess/Import',
            component:
              '@/pages/dataWash/toDoProcess/dayDataProcess/BatchProcess/Import',
            associatedHighLight: '/dataWash/toDoProcess/dayDataProcess',
          },
          {
            path: '/dataWash/matchRelationManagement',
            component: '@/pages/dataWash/matchRelationManagement',
            name: '匹配关系',
            icon: 'dashboard',
            code: 'matchRelationManagement',
            routes: [
              {
                path: '/dataWash/matchRelationManagement/institutionMatch',
                component:
                  '@/pages/dataWash/matchRelationManagement/institutionMatch',
                name: '机构匹配关系',
                code: 'institutionMatchRelation',
              },
              //机构匹配关系--导入
              {
                path:
                  '/dataWash/matchRelationManagement/institutionMatch/import',
                component:
                  '@/pages/dataWash/matchRelationManagement/institutionMatch/Import',
                associatedHighLight:
                  '/dataWash/matchRelationManagement/institutionMatch/Import',
              },
              {
                path: '/dataWash/matchRelationManagement/productMatch',
                component:
                  '@/pages/dataWash/matchRelationManagement/productMatch',
                name: '产品匹配关系',
                code: 'productMatchRelation',
              },
              //产品匹配关系--导入
              {
                path: '/dataWash/matchRelationManagement/productMatch/import',
                component:
                  '@/pages/dataWash/matchRelationManagement/productMatch/Import',
                associatedHighLight:
                  '/dataWash/matchRelationManagement/productMatch/Import',
              },
              {
                path: '/dataWash/matchRelationManagement/productUnitMatch',
                component:
                  '@/pages/dataWash/matchRelationManagement/productUnitMatch',
                name: '单位匹配关系',
                code: 'unitMatchRelation',
              },
              //单位匹配关系--导入
              {
                path:
                  '/dataWash/matchRelationManagement/productUnitMatch/import',
                component:
                  '@/pages/dataWash/matchRelationManagement/productUnitMatch/Import',
                associatedHighLight:
                  '/dataWash/matchRelationManagement/productUnitMatch/Import',
              },
            ],
          },
        ],
      },
      {
        path: '/dataManagement',
        component: '@/pages/dataManagement',
        name: '数据管理',
        icon: 'dashboard',
        code: 'dataManagement',
        routes: [
          {
            path: '/dataManagement/monthlyDataManagement',
            component: '@/pages/dataManagement/monthlyDataManagement',
            name: '月数据管理',
            code: 'monthDataManagement',
            routes: [
              {
                path:
                  '/dataManagement/monthlyDataManagement/originalDataManagement',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/originalDataManagement',
                name: '原始数据管理',
                code: 'monthOriginDataManage',
              },
              //销售原始数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/originalDataManagement/saleOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/originalDataManagement/saleOriginal/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/originalDataManagement',
              },
              //采购原始数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/originalDataManagement/purchaseOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/originalDataManagement/purchaseOriginal/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/originalDataManagement',
              },
              //库存原始数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/originalDataManagement/inventoryOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/originalDataManagement/inventoryOriginal/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/originalDataManagement',
              },
              //发货原始数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/originalDataManagement/consignmentOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/originalDataManagement/consignmentOriginal/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/originalDataManagement',
              },
              {
                path:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement',
                name: '核查数据管理',
                code: 'monthInspectDataManage',
              },
              //销售核查详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement/saleInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/saleInspect/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement',
              },
              //采购核查数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement',
              },
              //库存核查数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement',
              },
              //发货核查数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/inspectDataManagement',
              },
              {
                path:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/deliveryDataManagement',
                name: '交付数据管理',
                code: 'monthDeliveryDataManage',
              },
              //销售交付详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement/saleDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/deliveryDataManagement/saleDelivery/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement',
              },
              //采购交付数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement/purchaseDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/deliveryDataManagement/purchaseDelivery/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement',
              },
              //库存交付数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement/inventoryDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/deliveryDataManagement/inventoryDelivery/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement',
              },
              //发货核查数据详情
              {
                path:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement/consignmentDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/monthlyDataManagement/deliveryDataManagement/consignmentDelivery/detail',
                associatedHighLight:
                  '/dataManagement/monthlyDataManagement/deliveryDataManagement',
              },
            ],
          },
          {
            path: '/dataManagement/dailyDataManagement',
            component: '@/pages/dataManagement/dailyDataManagement',
            name: '日数据管理',
            code: 'dayDataManagement',
            routes: [
              {
                path:
                  '/dataManagement/dailyDataManagement/originalDataManagement',
                component:
                  '@/pages/dataManagement/dailyDataManagement/originalDataManagement',
                name: '原始数据管理',
                code: 'dayOriginalDataManage',
              },
              //销售原始数据详情
              {
                path:
                  '/dataManagement/dailyDataManagement/originalDataManagement/saleOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/originalDataManagement/saleOriginal/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/originalDataManagement',
              },
              //采购原始数据详情
              {
                path:
                  '/dataManagement/dailyDataManagement/originalDataManagement/purchaseOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/originalDataManagement/purchaseOriginal/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/originalDataManagement',
              },
              //库存原始数据详情
              {
                path:
                  '/dataManagement/dailyDataManagement/originalDataManagement/inventoryOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/originalDataManagement/inventoryOriginal/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/originalDataManagement',
              },
              //发货原始数据详情
              {
                path:
                  '/dataManagement/dailyDataManagement/originalDataManagement/consignmentOriginal/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/originalDataManagement/consignmentOriginal/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/originalDataManagement',
              },
              {
                path:
                  '/dataManagement/dailyDataManagement/inspectDataManagement',
                component:
                  '@/pages/dataManagement/dailyDataManagement/inspectDataManagement',
                name: '核查数据管理',
                code: 'dayInspectDataManage',
              },
              //销售核查详情
              {
                path:
                  '/dataManagement/dailyDataManagement/inspectDataManagement/saleInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/saleInspect/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/inspectDataManagement',
              },
              //发货核查数据详情
              {
                path:
                  '/dataManagement/dailyDataManagement/inspectDataManagement/consignmentInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/consignmentInspect/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/inspectDataManagement',
              },
              //采购核查详情
              {
                path:
                  '/dataManagement/dailyDataManagement/inspectDataManagement/purchaseInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/purchaseInspect/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/inspectDataManagement',
              },
              //库存核查详情
              {
                path:
                  '/dataManagement/dailyDataManagement/inspectDataManagement/inventoryInspect/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/inventoryInspect/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/inspectDataManagement',
              },
              {
                path:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement',
                component:
                  '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement',
                name: '交付数据管理',
                code: 'dayDeliveryDataManage',
              },
              //销售交付详情
              {
                path:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement/saleDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/saleDelivery/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement',
              },
              //发货交付数据详情
              {
                path:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement/consignmentDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/consignmentDelivery/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement',
              },
              //采购交付详情
              {
                path:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement/purchaseDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/purchaseDelivery/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement',
              },
              //库存交付详情
              {
                path:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement/inventoryDelivery/detail/:id?',
                component:
                  '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/inventoryDelivery/detail',
                associatedHighLight:
                  '/dataManagement/dailyDataManagement/deliveryDataManagement',
              },
            ],
          },
          {
            path: '/dataManagement/inventory',
            component: '@/pages/dataManagement/inventory',
            name: '进销存',
            code: 'purchSaleStock',
            routes: [
              {
                path: '/dataManagement/inventory/theoryBeginInventory',
                component:
                  '@/pages/dataManagement/inventory/theoryBeginInventory/list',
                name: '期初理论库存导入',
                code: 'theoryBeginInventory',
              },
              //期初理论库存导入--导入
              {
                path: '/dataManagement/inventory/theoryBeginInventory/import',
                component:
                  '@/pages/dataManagement/inventory/theoryBeginInventory/Import',
                associatedHighLight:
                  '/dataManagement/inventory/theoryBeginInventory/Import',
              },
              {
                path: '/dataManagement/inventory/inventoryAnalysis',
                component:
                  '@/pages/dataManagement/inventory/inventoryAnalysis/list',
                name: '月度进销存平衡表',
                code: 'inventoryAnalysis',
              },
              //月度进销存平衡表-导入
              {
                path: '/dataManagement/inventory/inventoryAnalysis/import',
                component:
                  '@/pages/dataManagement/inventory/inventoryAnalysis/Import',
                associatedHighLight:
                  '/dataManagement/inventory/inventoryAnalysis/Import',
              },
              //月度进销存平衡表--详情
              {
                path: '/dataManagement/inventory/inventoryAnalysis/detail',
                component:
                  '@/pages/dataManagement/inventory/inventoryAnalysis/detail',
              },
            ],
          },
          {
            path: '/dataManagement/institutionAttach',
            component: '@/pages/dataManagement/institutionAttach',
            name: '挂靠',
            code: 'institutionAttach',
          },
          //导入
          {
            path: '/dataManagement/institutionAttach/import',
            component: '@/pages/dataManagement/institutionAttach/Import',
            associatedHighLight: '/dataManagement/institutionAttach/Import',
          },
        ],
      },
    ],
  },
];

export default routes as IRoute[];
