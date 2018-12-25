import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';


import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { ScrollableDataTableComponent } from './widget/widget-scrollable-data-table/scrollable-data-table/scrollable-data-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(ScrollableDataTableComponent) scrollableTable: ScrollableDataTableComponent;
  title = 'scrollable-mat-table';
  public filterBadge = 0;
  readonly defaultPageOffset = 1;
  readonly defaultPageLimit = 20;
  public searchString = '';
  public postData: any[] = [];
  public copyData: any[] = [];
  public filterConfig = []; // input to filter
  public tableConfig;

  public indeterminate: boolean;
  public serverConfig;
  public moveToback = true;
  public loadingPage = false;
  public canScroll: boolean;
  public firstAutoComplete: any[] = [];

  constructor(private toastr: ToastrService) {
    this.serverConfig = {
      apiParams: {
        sort: {
          sortBy: 'position',
          orderBy: 'ASC'
        },
        page: {
          limit: this.defaultPageLimit,
          offset: this.defaultPageOffset
        },
        filter: {
          isMakeCodeReq: false,
          isDCNReq: false,
          dealerCode: ''
        }
      }
    };
    this.postData = [{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }];
    this.copyData = JSON.parse(JSON.stringify(this.postData));
    this.copyData.filter(({ symbol }) => {
      this.firstAutoComplete.push({
        label: `${symbol}`,
        value: `${symbol}`
      });
    });
    let self;
    self = this;
    this.toastr = toastr;

    this.canScroll = true;
    /**
     *Pass all the table config
     */
    this.tableConfig = {
      editable: false, // not used
      filter: true, // not used
      select: true, // Select all checkbox enable/ disable
      expandable: false, // mobile view expand view show / hide
      pagination: false, // enable disable pagination
      lazyLoading: true, // not used
      sorting: true, // enable disable sorting
      buttonPlacement: 'header', // to show hide buttons
      // Possible Values : "header" or "footer" or "row"
      serialNumber: false,
      tooltip: true, // show hide tooltip
      spinnerConfig: {
        color: 'primary',
        mode: 'indeterminate',
        value: 100,
        diameter: 30,
        spinner: false,
        content: 'Loading Assets...'
      },
      columnConfig: [
        {
          label: 'Position',
          colData: 'position',
          sortDisable: false,
          priority: '1',
          padding: '0px',
          margin: '0px',
          color: 'red',
          formControl: 'span', // 'select' , 'multiSelect' , 'autoComplete',
          style: {
            width: '15%'
          }
        },
        {
          label: 'Name',
          colData: 'name',
          sortDisable: false,
          select: true,
          priority: '2',
          formControl: 'span',
          style: {
            width: '25%'
          }
        },
        {
          label: 'Symbol',
          placeHolder: 'Choose the symbol',
          colData: 'symbol',
          sortDisable: false,
          multiselect: true,
          priority: '3',
          mandatory: true,
          data: this.firstAutoComplete,
          backupData: this.firstAutoComplete,
          config: {
            label: 'label',
            value: 'value'
          },
          formControl: 'autoComplete',
          searchInput: function (event, object, datainput = this.backupData) {
            this.data = [];
            const index = self.postData.indexOf(object);
            datainput.filter((eachVal) => {
              // search logic goes here
              if (eachVal.value.toString().includes(event.target.value)) {
                console.log(this.data);
                this.data.push(eachVal);
              }
            });
          },
          applySelected: (event, object, ind) => {
            const index = this.postData.indexOf(object);
            // when choosing one from auto complete list - any logical check has to go here
          },
          changeControl: function () {
            this.data = this.backupData;
          },
          // tslint:disable-next-line:only-arrow-functions
          focusOut: function (obj) {
            const index = self.postData.indexOf(obj);
            console.log('any logic that has to be implemented on focus out - goes here');
          },
          style: {
            width: '20%'
          }
        },
        {
          label: 'Weight',
          colData: 'weight',
          sortDisable: false,
          priority: '4',
          formControl: 'span',
          style: {
            width: '20%'
          }
        }
      ],
      buttons: [

        {
          label: 'Next',
          class: 'next-button',
          image: 'next',
          color: 'primary',
          click: (event, object) => {
            const apiData = [];
            console.log('event', event, 'data', object);
          },
          mouseenter: (event, object) => {
            console.log('event', event, 'data', object);
          },
          event: {
            click: 'click',
            mouseenter: 'mouseenter'
          },
          showButton: true,
          disabled: false
        },
        {
          label: 'Back',
          class: 'cancel-button',
          image: 'cancel',
          click: (event, object) => {
            console.log('event', event, 'data', object);
          },
          mouseenter: (event, object) => {
            console.log('event', event, 'data', object);
          },
          event: {
            click: 'click',
            mouseenter: 'mouseenter'
          },
          showButton: true,
          disabled: false
        }, {
          label: 'Configure',
          class: 'configure-button',
          image: 'configure',
          click: (event, object) => {

          },
          mouseenter: (event, object) => {
            console.log('event', event, 'data', object);
          },
          event: {
            click: 'click',
            mouseenter: 'mouseenter'
          },
          icon: 'expand_more',
          showButton: true,
          disabled: true
        }
      ],
      languageSetting: {
        columns: {
          Action: 'Action',
          Name: 'Name',
          Weight: 'Weight',
          Symbol: 'Symbole',
          Favorite: 'Favorite',
          Select: 'Select',
          Expand: 'Expand'
        },
        pagenation: {}
      }
    };
  }
  ngOnInit() {
  }

  ng6TableEvents(config) {
    let callApi = false;

    let sortBy = this.serverConfig.apiParams.sort.sortBy;
    let orderBy = this.serverConfig.apiParams.sort.orderBy;
    let offset = this.serverConfig.apiParams.page.offset;
    let limit = this.serverConfig.apiParams.page.limit;
    if (config.event === 'indeterminate') {
      this.tableConfig.buttons[2].disabled = !config.isSelected;
      this.indeterminate = config.isSelected;
    }

    if (config.event === 'sort') {
      this.canScroll = true;
      this.loadingPage = true;
      callApi = true;
      sortBy = config.data.active;
      orderBy = config.data.direction;
      offset = this.defaultPageOffset;
      limit = this.defaultPageLimit;
    }
    if (config.event === 'scroll' && this.canScroll) {
      callApi = true;
      limit = config.data.limit;
      offset = config.data.offset;
    }
    if (callApi) {
      this.tableConfig.spinnerConfig.spinner = true;
      this.serverConfig.apiParams.sort.sortBy = sortBy;
      this.serverConfig.apiParams.sort.orderBy = orderBy;
      this.serverConfig.apiParams.page.offset = offset;
      this.serverConfig.apiParams.page.limit = limit;

      // write a method to invoke api to get table data
    }

  }

  search($event) {
  }

  openFilter() {
  }
}
