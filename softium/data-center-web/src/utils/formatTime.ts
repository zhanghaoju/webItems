/*
 * 将中国标准时间转换为日期时间
 */

//年月日时分秒
export function formatChinaStandardTime(t?: any) {
  let date = new Date(t);
  let y = date.getFullYear();
  let m: string | number = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d: string | number = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h: string | number = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute: string | number = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  let second: string | number = date.getSeconds();
  second = second < 10 ? '0' + second : second;
  t = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; //这里如果不需要小时 分  后边的可以不需要拼接
  return t;
}

//年月日
export function formatChinaStandardTimeToDate(t?: any) {
  let date = new Date(t);
  let y = date.getFullYear();
  let m: string | number = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d: string | number = date.getDate();
  d = d < 10 ? '0' + d : d;
  t = y + '-' + m + '-' + d; //这里如果不需要小时 分  后边的可以不需要拼接
  return t;
}
