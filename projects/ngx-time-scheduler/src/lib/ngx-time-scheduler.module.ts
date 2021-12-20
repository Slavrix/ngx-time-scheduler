import { DemoMaterialModule } from './material.module';
import { InjectionToken, ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { NgxTimeSchedulerComponent } from './ngx-time-scheduler.component';
import {CommonModule} from '@angular/common';
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";

export * from './date-adapters/date-adapter';
export const MOMENT: InjectionToken<string> = new InjectionToken('Moment');

@NgModule({
  declarations: [NgxTimeSchedulerComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    NgxTimeSchedulerComponent
  ]
})
export class NgxTimeSchedulerModule {
  static forRoot(
    dateAdapter: Provider
  ): ModuleWithProviders<NgxTimeSchedulerModule> {
    return {
      ngModule: NgxTimeSchedulerModule,
      providers: [
        dateAdapter
      ]
    };
  }
}
