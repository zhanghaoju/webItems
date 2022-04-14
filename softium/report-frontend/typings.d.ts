declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

interface BaseModel {
  /**
   * id
   */
  id?: string;
  /**
   * 创建人
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 更新人
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}
interface BaseQuery {
  pageSize?: number;
  pageNo?: number;
  pageNum?: number;
}

interface Sort {
  criteria?: {
    sortProperties: SortProperty[];
  };
}

interface SortProperty {
  propertyName?: string;
  sort?: 'ASC' | 'DESC';
}

declare namespace ModalFormControl {
  type Props<P> = {
    actionRef:
      | React.MutableRefObject<Actions<P> | undefined>
      | ((actionRef: Actions<P>) => void);
    onSubmit: (data: P) => void;
    submitting?: boolean;
  };

  type Actions<P> = {
    show: (currentItem?: P) => void;

    hide: () => void;
  };
}
