import { AxiosRequestConfig } from 'axios';

const extMap = (config: AxiosRequestConfig) => {
  const { data } = config;
  const { extMap } = data || {};
  if (extMap) {
    for (const field in extMap) {
      extMap[field] = data[field];
    }
  }
};

export const requestConfig = (config: AxiosRequestConfig) => {
  // fill data extMap
  // extMap(config);
  return config;
};
