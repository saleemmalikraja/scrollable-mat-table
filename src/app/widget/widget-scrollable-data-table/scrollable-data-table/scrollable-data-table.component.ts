import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ChangeDetectorRef,
  Renderer,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';

import { EventManager } from '@angular/platform-browser';
import { MatPaginator, MatSort, MatSortable } from '@angular/material';
import { Subscription, Observable, Subject } from 'rxjs';
import { TableInterface } from './scrollable-data-table-interface';

@Component({
  selector: 'app-scrollable-data-table',
  templateUrl: './scrollable-data-table.component.html',
  styleUrls: ['./scrollable-data-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrollableDataTableComponent implements OnInit, AfterViewInit {
  setTimeout: any;
  table: Observable<Array<any>>;
  sum = 10;
  pageLimit = 20;
  pageOffset = 1;
  deleteData: Observable<Array<any>>;
  start: any = undefined;
  pressed: Boolean = false;
  startX: any;
  startWidth: any;
  resizableFnMousemove: Function;
  resizableFnMouseup: Function;
  sortedColumnConfigRef;
  sortObject: any = {};

  /**
   * Declare global variable
   */

  public tableConfig: TableInterface;

  /**
   * Create a new class for table using matTable
   */
  dataSource: any;

  /**
   * declare empty array expand table data
   */
  expandedElement: any;
  /**
   * declare pagination event's
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
   * initialize ng6TableConfig the Input and Output Event's
   */
  /**
   * create a child event for mat table sorting
   */
  @ViewChild(MatSort) sort: MatSort;
  @Input() ng6TableConfig: any;
  @Input() ng6TableData: any;
  @Output() ng6TableEvents = new EventEmitter();
  @ViewChildren('dynamic', { read: ViewContainerRef })
  @ViewChild('multiSelect')
  checkbox;
  @ViewChild('scroll') content: any;
  // checkbox
  public widgetTargets: QueryList<ViewContainerRef>;

  constructor(
    private eventManager: EventManager,
    private componentFactoryResolver: ComponentFactoryResolver,
    public viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer
  ) {
    this.resizeSubject = new Subject();
    this.eventManager.addGlobalEventListener(
      'window',
      'resize',
      this.onResize.bind(this)
    );
  }
  private resizeSubject: Subject<Window>;

  /**
   *Initalize all table config or set default value
   */
  private resizeSubscription: Subscription;

  /**
   * @description single checkbox click
   * @param {*} datum
   * @memberof ScrollableDataTableComponent
   */
  onCheckboxChange() {
    this.checkIsSelected();
    this.matTableCofig();
    this.applyChanges();
    this.setState();
  }
  onCheckboxClick(event, datum) {
      event.preventDefault();
      event.stopPropagation();
      return;
  }
  unselectAll() {
    for (let i = 0; i < this.ng6TableData.length; i++) {
        this.ng6TableData[i].isSelected = !this.tableConfig.topLevel;
    }
    this.tableConfig.topLevel = !this.tableConfig.topLevel;
    this.setState();
  }
  /**
   * @description handle top level multiselect event's -- select all
   * @memberof ScrollableDataTableComponent
   */
  topLevelChange() {
    for (let i = 0; i < this.ng6TableData.length; i++) {
        this.ng6TableData[i].isSelected = this.tableConfig.topLevel;
    }
    this.checkIsSelected();
  }

  checkIsSelected() {
    let isRecordChecked = false;
    for (let i = 0; i < this.ng6TableData.length; i++) {
      if (this.ng6TableData[i].isSelected) {
        isRecordChecked = true;
        continue;
      }
    }
    const indeterminateData = {
      event: 'indeterminate',
      isSelected: isRecordChecked
    };
    this.ng6TableEvents.emit(indeterminateData);
  }

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  ngOnInit() {
    //  this.getAds();
    //  console.log('template', this.template);
    /**
     * initialize the config setting based parent data or set default values
     */
    this.tableConfig = {
      editable: this.ng6TableConfig.editable || false, // not used
      filter: this.ng6TableConfig.filter || false, // not used
      select: this.ng6TableConfig.select || false,
      pagination: this.ng6TableConfig.pagination || false, // not used
      expandable: this.ng6TableConfig.expandable || false,
      lazyLoading: this.ng6TableConfig.lazyLoading || false,
      sorting: this.ng6TableConfig.sorting || false,
      buttonPlacement: this.ng6TableConfig.buttonPlacement || false,
      columnConfig: this.ng6TableConfig.columnConfig || [],
      buttonConfig: this.ng6TableConfig.buttons || [],
      language: this.ng6TableConfig.languageSetting || {},
      serialNumber: this.ng6TableConfig.serialNumber || false,
      tooltip: this.ng6TableConfig.tooltip || false,
      pageLength: 100,
      pageSize: 10,
      notFound: this.ng6TableConfig.notFound || false,
      selectedVal: '',
      multiSelectVal: '',
      topLevel: false,
      pageSizeOptions: [5, 10, 25, 100],
      searchString: '',
      sortedColumnConfig: [],
      columnsHeaderName: [],
      ng6CheckboxData: [],
      enableExpand: false,
      spinnerConfig: this.ng6TableConfig.spinnerConfig
        ? this.ng6TableConfig.spinnerConfig
        : {}
    };

    /**
     *Push Action column if user set ediatbel is true
     */
    if (
      this.tableConfig.editable &&
      this.tableConfig.buttonPlacement === 'row'
    ) {
      this.tableConfig.columnConfig.push({
        label: 'Action',
        colData: 'action',
        priority: this.tableConfig.columnConfig + 1,
        width: 50
      });
    }

    /**
     *Push Select column if user set select is true
     */
    if (this.tableConfig.select) {
      this.tableConfig.columnConfig.unshift({
        label: 'Select',
        colData: 'select',
        filter: false,
        priority: '',
        style: {
          width: '50px'
        }
      });
    }
    /**
     *Push Expand column if user set expandable is true
     */
    if (this.tableConfig.expandable) {
      this.tableConfig.columnConfig.unshift({
        label: 'Expand',
        colData: 'expand',
        filter: false,
        priority: '',
        style: {
          width: '50px'
        }
      });
    }
    if (this.tableConfig.serialNumber) {
      this.tableConfig.columnConfig.unshift({
        label: 'No',
        colData: 'position',
        sortDisable: false,
        priority: '1',
        style: {
          width: '100px'
        }
      });
      for (let i = 0; i < this.ng6TableData.length; i++) {
        this.ng6TableData[i].position = i + 1;
      }
    }

    this.tableConfig.ng6CheckboxData = this.ng6TableData;
    this.expandedElement = this.ng6TableData;
    this.tableConfig.sortedColumnConfig = this.sortArray(
      this.tableConfig.columnConfig,
      'priority'
    );
    this.tableConfig.columnsHeaderName = this.tableConfig.sortedColumnConfig.map(
      c => {
        c.className = c.label.replace(' ', '-');
        return c.colData;
      }
    );
    this.sortedColumnConfigRef = this.tableConfig.sortedColumnConfig;
    this.matTableCofig();

    /**
     * Subcribe the windows resize event listener
     */
    this.resizeSubscription = this.onResize$.subscribe(size => {
      if (size.innerWidth > 425 && size.innerWidth <= 768) {
        this.tableConfig.enableExpand = true;
        this.reOrderHaaderBasedPriority(3);
      } else if (size.innerWidth <= 425) {
        this.tableConfig.enableExpand = true;
        this.reOrderHaaderBasedPriority(2);
      } else {
        this.tableConfig.enableExpand = false;
        this.reOrderHaaderBasedPriority(false);
      }
    });
    if (window.innerWidth > 425 && window.innerWidth <= 768) {
      this.tableConfig.enableExpand = true;
      this.reOrderHaaderBasedPriority(3);
    } else if (window.innerWidth <= 425) {
      this.tableConfig.enableExpand = true;
      this.reOrderHaaderBasedPriority(2);
    } else {
      this.tableConfig.enableExpand = false;
      this.reOrderHaaderBasedPriority(false);
    }
  }
  reOrderHaaderBasedPriority(count) {
    console.log('count', count);
    if (!count && this.sortedColumnConfigRef) {
      this.tableConfig.columnConfig = this.sortedColumnConfigRef;
    } else {
      const tempArray = [];
      for (let i = 0; i < count; i++) {
        tempArray.push(this.sortedColumnConfigRef[i]);
      }
      this.tableConfig.columnConfig = tempArray;
    }
    this.tableConfig.sortedColumnConfig = this.sortArray(
      this.tableConfig.columnConfig,
      'priority'
    );
    this.tableConfig.columnsHeaderName = this.tableConfig.sortedColumnConfig.map(
      c => c.colData
    );
    this.matTableCofig();
  }
  onResize(event: UIEvent) {
    this.resizeSubject.next(<Window>event.target);
  }

  OnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
  /**
   * toogle a table row on click expand arrows
   */
  expandableRow(value: Element) {
    console.log('value', value);
    // tslint:disable-next-line:no-string-literal
    value['detailRow'] = !value['detailRow'];
    // this.dataSource.data.find(elem => {
    //   if (elem['asset'] !== undefined && elem['asset'] === value['asset']) {
    const index = this.dataSource.data.indexOf(value);
    this.dataSource.data[index].show = !this.dataSource.data[index].show;
    return false;
    //   }
    // });
  }
  /**
   * Assign data into mat table datasource
   */
  matTableCofig() {
    this.dataSource = this.ng6TableData;
    if (this.tableConfig && this.ng6TableData) {
      this.tableConfig.pageLength = this.ng6TableData.length;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    // this.dataSource.sort = this.sort;
  }
  /**
   * apply global filter logic's
   */
  applyFilter(filterValue: string, column) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filterData = filterValue;
  }

  /**
   *handle button events based on config
   */
  actionButtonEvents(event, data, button) {
    console.log('event', event, 'data', data);
    if (button.label === 'Edit') {
      data.editing = !data.editing;
    }
    if (button.label === 'Save') {
      data.editing = false;
    }
    if (button.label === 'Cancel') {
      data.editing = false;
    }
    if (button.label === 'Delete') {
      this.tableConfig.spinnerConfig.spinner = true;
      const index: number = this.ng6TableData.indexOf(data);
      if (index !== -1) {
        this.ng6TableData.splice(index, 1);
        this.matTableCofig();
        const self = this;
        setTimeout(() => {
          self.tableConfig.spinnerConfig.spinner = false;
        }, 500);
      }
    }
  }
  sortArray(array: any[], field: string) {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

  /**
   * Listern the events afetr template change
   */
  ngAfterViewInit() {
    this.applyChanges();
    this.setState();
    this._changeDetectorRef.detectChanges();
  }

  applyChanges() {
    if (this.ng6TableData) {
      this.ng6TableData = this.ng6TableData;
    }
  }

  setState() {
    if (!this.ng6TableData || !this.ng6TableData.length) {
      return;
    }
    let count = 0;
    const i = this.ng6TableData.length;
    for (let j = 0; j < this.ng6TableData.length; j++) {
      count += this.ng6TableData[j].isSelected ? 1 : 0;
    }
    this.tableConfig.topLevel = count === 0 ? false : true;
    if (this.checkbox) {
      this.checkbox.indeterminate = count > 0 && count < i;
      sessionStorage.setItem('indeterminate', this.checkbox.indeterminate);
    }
  }

  sortData(event) {
    this.sortObject = {
      event: 'sort',
      data: event
    };
    this.pageOffset = 1;
    this.ng6TableEvents.emit(this.sortObject);
    console.log('invoking Sort');
  }
  onScroll() {
    try {
      this.matTableCofig();
      this.applyChanges();

      const element = this.content.element.nativeElement;
      if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
        const scrollData = {
          event: 'scroll',
          data: {
            limit: this.pageLimit,
            offset: ++this.pageOffset,
            active: this.sortObject.data ? this.sortObject.data.active : null,
            direction: this.sortObject.data
              ? this.sortObject.data.direction
              : null
          }
        };
        this.ng6TableEvents.emit(scrollData);
        console.log('invoking scroll');
      }

      // check items on scroll when select all is checked
      if (this.checkbox && !this.checkbox.indeterminate) {
        this.topLevelChange();
      }
    } catch (err) {
      console.log('error:', err);
    }
  }
  /* search(event: any , parentArray: any[]) {
    if (event.target.value && event.target.value.length) {
      const results = parentArray.filter((eachValue) => { eachValue.toLowerCase().includes(event.target.value.toLowerCase());
      });
    }
  } */
}
