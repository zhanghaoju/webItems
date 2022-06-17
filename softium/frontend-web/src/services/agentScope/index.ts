import request from '@/utils/request';

export const getAgentDetailByContractId = (params: any) => {
  return request({
    method: 'GET',
    url: '/agentScope/agent/detail',
    params,
  });
};

export const addAgentLevel = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/add/agent/level',
    data: params,
  });
};

export const getProductList = (params: any) => {
  return request({
    method: 'POST',
    url: '/product/list',
    data: params,
  });
};

export const getAgentScopeList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/list',
    data: params,
  });
};

export const getAgentInstitutionScopeList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/scopeList',
    data: params,
  });
};

export const addAgentScope = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/add',
    data: params,
  });
};

export const getInstitutionList = (params: any) => {
  return request({
    method: 'POST',
    url: '/institution/list',
    data: params,
  });
};

export const deleteScope = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/delete',
    data: params,
  });
};

export const getAgentScopeProductList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/product/list',
    data: params,
  });
};

export const addScopeProduct = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/product/add',
    data: params,
  });
};

export const editScope = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/product/edit',
    data: params,
  });
};

export const deleteScopeProduct = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/product/delete',
    data: params,
  });
};

export const getPrimaryProductList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/primary/exclude/product/list',
    data: params,
  });
};

export const addPrimaryExclude = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/add/exclude',
    data: params,
  });
};

export const getExcludeList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/exclude/list',
    data: params,
  });
};

export const deleteExclude = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/delete/exclude',
    data: params,
  });
};

export const getExcludeProductList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/exclude/product/list',
    data: params,
  });
};

export const deleteExcludeProduct = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentScope/delete/exclude/product',
    data: params,
  });
};
