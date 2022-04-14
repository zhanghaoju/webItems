import { AppealDetail } from '@/pages/SalesAppeal/AppealCenter/data';
import moment from 'moment';

export function transFormValueToAppealDetail(
  formValues: any[],
  untiToText: any,
): AppealDetail[] {
  return formValues?.map(t => {
    const product = t?.product.length > 0 && t?.product[t?.product.length - 1];
    const productName = product?.name ? product?.name?.split('(')[0] : '';
    const institution =
      t?.institution?.value && JSON.parse(t?.institution?.value);
    return {
      complaintsReason: t?.complaintsReason?.value,
      complaintsReasonName: t?.complaintsReason?.label,
      institutionName: t?.institution?.label,
      institutionId: institution?.id,
      institutionType: institution?.type,
      cityId: institution?.cityId,
      cityName: institution?.city,
      provinceId: institution?.provinceId,
      provinceName: institution?.province,
      productName: productName,
      productId: product?.id,
      manufacturer: product?.manufacturer,
      productSpecsName: product?.specification,
      unitName: untiToText[t?.unitName],
      salesCount: t?.salesCount,
      salesNumTotal: t?.salesNumTotal,
      salesComplaintsTotal: t?.salesComplaintsTotal,
      salesEstimateTotal: t?.salesEstimateTotal,
      salesDetails: t?.salesDetails?.map((s: any) => ({
        institutionName: s?.institution?.label,
        salesDate: s?.salesDate && moment(s?.salesDate).valueOf(),
        salesComplaintsNumb: s?.salesComplaintsNumb,
        proveIds: s?.proveIds
          ?.filter((r: any) => r?.response?.success)
          .map((r: any) => r?.response?.data?.id)
          .join(','),
        explain: s?.explain,
      })),
    };
  });
}

export function transFormProductOption(treeData: any[]): any[] {
  return treeData?.map(t => {
    let detail = '';
    if (t?.code) {
      detail = t?.code;
    }
    if (t?.specification) {
      if (detail) {
        detail = `${detail},${t?.specification}`;
      } else {
        detail = t?.specification;
      }
    }
    if (t?.manufacturer) {
      if (detail) {
        detail = `${detail},${t?.manufacturer}`;
      } else {
        detail = t?.manufacturer;
      }
    }

    return {
      ...t,
      //name: t?.specification ? `${t?.name}(${t?.specification})` : t?.name,
      name: detail ? `${t?.name}(${detail})` : t?.name,
      children: t?.children && transFormProductOption(t?.children),
    };
  });
}

/**
 * [getUploadStatus 判断是否所有文件上传成功]
 * @return {[type]} [true 所有文件上传成功  false 含有上传失败的文件]
 */
export function getUploadStatus(fileList: any[]): boolean {
  // let files: any[] = fileList?.fileList || [];
  let uploadStatus = true;
  for (let item of fileList) {
    if (!item?.response?.success) {
      uploadStatus = false;
    }
  }
  return uploadStatus;
}
