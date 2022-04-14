import request from '@/utils/request';

export const getAgentQuotaTerritoryTree = () => {
  return request({
    method: 'GET',
    url: '/agentQuota/territory/tree',
  });
};

export const exportScopeAgentQuota = () => {
  request({
    method: 'GET',
    url: '/agentQuota/scopeQuota/template',
    responseType: 'blob',
  }).then(data => {
    const {
      headers: { filename },
    } = data;
    exportUtil(filename, data.data);
  });
};

export const exportAgentInstitutionTemplate = () => {
  request({
    method: 'GET',
    url: '/agentQuota/institutionQuota/template',
    responseType: 'blob',
  }).then(data => {
    const {
      headers: { filename },
    } = data;
    exportUtil(filename, data.data);
  });
};

const exportUtil = (filename: string, data: any) => {
  const fileName = window.decodeURI(filename);
  const url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.setAttribute('download', fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const getLogList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentQuotaLog/list',
    data: params,
  });
};

export const getAgentQuotaList = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentQuota/list',
    data: params,
  });
};

export const editQuota = (params: any) => {
  return request({
    method: 'POST',
    url: '/agentQuota/edit',
    data: params,
  });
};
