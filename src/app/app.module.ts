import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ScrollableDataTableComponent } from './widget/widget-scrollable-data-table/scrollable-data-table/scrollable-data-table.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularCoreModuleImport, MaterialModuleImport } from './app.module.def';

import {WidgetScrollableDataTableModule} from './widget/widget-scrollable-data-table/widget-scrollable-data-table.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    WidgetScrollableDataTableModule,
    ...AngularCoreModuleImport,
    ...MaterialModuleImport,
    ToastrModule.forRoot({
      positionClass: 'toast-top-full-width',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      timeOut: 5000,
      extendedTimeOut: 1000
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
