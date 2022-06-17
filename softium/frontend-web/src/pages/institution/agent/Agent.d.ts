export interface AgentInfoProps {
  id?: string;
  name?: string;
  code?: string;
  contractName?: string;
  contractCode?: string;
}

export interface ScopeProps {
  agentInfo?: AgentInfoProps;
  contractId: string;
}

export interface AddTerminalScopeProps {
  visible: boolean;
  onCancel?: any;
  onSubmit?: any;
  agentInfo?: AgentInfoProps;
  scopeDim?: string;
}

export interface LevelInfo {
  areaDim: string;
  institutionTypeDims: string[];
  productLevelDim: string;
  scopeDim: string;
  levelId: string;
  institutionType?: string;
  provinceId?: string;
  cityId?: string;
  countyId?: string;
  nodeCode?: string;
  referringPeriodId?: string;
  salesMan?: string;
  nodeName?: string;
  nodeStaffName?: string;
}

export interface ScopePrimaryComponentProps {
  agentInfo?: AgentInfoProps;
  levelInfo?: LevelInfo;
  isExclude?: boolean;
}

export interface ProductDetailProps extends ScopePrimaryComponentProps {
  visible: boolean;
  onCancel?: any;
  onSubmit?: any;
  item?: any;
  tableActionRef?: any;
}

export interface ExcludeDetailProps extends ScopePrimaryComponentProps {
  visible: boolean;
  onCancel?: any;
  onSubmit?: any;
  item?: any;
  tableActionRef?: any;
}
