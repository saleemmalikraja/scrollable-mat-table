import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollableDataTableComponent } from './scrollable-data-table/scrollable-data-table.component';
import { MaterialModuleImports } from './scrollable-data-table/material-module.imports';
import { FormsModule } from '@angular/forms';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
@NgModule({
  imports: [
    CommonModule,
    ...MaterialModuleImports,
    FormsModule,
    VirtualScrollerModule
  ],
  declarations: [ScrollableDataTableComponent],
  exports: [ScrollableDataTableComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetScrollableDataTableModule { }
