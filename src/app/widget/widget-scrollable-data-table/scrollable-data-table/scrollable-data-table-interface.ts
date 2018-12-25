export interface TableInterface {
  editable?: boolean;
  filter?: boolean;
  select?: boolean;
  pagination?: boolean;
  expandable?: boolean;
  lazyLoading?: boolean;
  sorting?: boolean;
  buttonPlacement?: string;
  columnConfig?: any;
  buttonConfig?: Array<any>;
  language?: Object;
  serialNumber?: boolean;
  tooltip?: boolean;
  pageLength?: number;
  pageSize?: number;
  selectedVal?: any;
  multiSelectVal?: any;
  topLevel?: boolean;
  pageSizeOptions?: Array<any>;
  searchString?: string;
  sortedColumnConfig?: Array<any>;
  columnsHeaderName?: Array<any>;
  ng6CheckboxData?: Array<any>;
  enableExpand?: boolean;
  spinnerConfig?: any;
  notFound?: boolean;
}
