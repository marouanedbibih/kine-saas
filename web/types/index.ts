export interface ILoading {
    table: boolean,
    form: boolean,
    submit: boolean,
    delete: boolean,
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IID {
  view: string;
  edit: string;
  delete: string;
}