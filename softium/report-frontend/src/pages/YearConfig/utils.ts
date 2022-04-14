export function transFormProductOption(treeData: any[]): any[] {
  return treeData?.map(t => {
    return {
      ...t,
      name: t?.specification ? `${t?.name}(${t?.specification})` : t?.name,
      children: t?.children && transFormProductOption(t?.children),
    };
  });
}
