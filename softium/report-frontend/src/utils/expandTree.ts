import React from 'react';

export interface TreePocket {
  title?: React.ReactNode;
  value?: string;
  children?: TreePocket[];
}

export default function expandTree<T>(
  data?: T[] | undefined,
  childrenKey: string = 'children',
  labelKey: string = 'name',
  valueKey: string = 'id',
  formatFn?: (item: T) => React.ReactNode,
  itemKeyFormat?: (item: T) => React.ReactNode,
): TreePocket[] | undefined {
  return data?.map((s: any) => {
    const { title, value, children, ..._others } = s;
    const ret: TreePocket = {
      title: formatFn ? formatFn(s) : s?.[labelKey],
      value: itemKeyFormat ? itemKeyFormat(s) : s?.[valueKey],
      children: expandTree(
        s[childrenKey],
        childrenKey,
        labelKey,
        valueKey,
        formatFn,
        itemKeyFormat,
      ),
      ..._others,
    };
    return ret;
  });
}
