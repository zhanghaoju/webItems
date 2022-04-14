export interface IPageModel {
  page: number,
  pageSize: number,
  count: number
}

export interface IGridModel {
  columns: object[],
  data: object[],
  pageModel?: IPageModel
}

const GridModel: IGridModel = {
  columns: [],
  data: [],
  pageModel: {
    page: 1,
    pageSize: 10,
    count: 0
  }
}

export default GridModel