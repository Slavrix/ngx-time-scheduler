import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  NgxTimeSchedulerModule,
  DateAdapter,
  MOMENT
} from '../../projects/ngx-time-scheduler/src/lib/ngx-time-scheduler.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material.module';

import { adapterFactory } from '../../projects/ngx-time-scheduler/src/lib/date-adapters/moment';
// import { adapterFactory } from '../../projects/ngx-time-scheduler/src/lib/date-adapters/date-fns';
import * as moment from 'moment';
import { MatSelectModule } from "@angular/material/select";

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxTimeSchedulerModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      }
    ),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    DemoMaterialModule
  ],
  providers: [{
    provide: MOMENT,
    useValue: moment,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
