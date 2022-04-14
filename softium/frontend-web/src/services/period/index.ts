import request from '@/utils/request';

export const getPeriodYears = () => {
  return request({
    method: 'GET',
    url: '/period/years',
  });
};

/**
 * 获取当前生效时间窗
 */
export const getCurrentPeriod = () =>
  request({
    method: 'GET',
    url: '/period/current',
  });
