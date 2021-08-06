import { NgModule } from '@angular/core';
import { NgxTimeSchedulerComponent } from './ngx-time-scheduler.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkTableModule} from '@angular/cdk/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [NgxTimeSchedulerComponent],
  imports: [
    CommonModule,
    CdkTableModule,
    MatDatepickerModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  exports: [NgxTimeSchedulerComponent]
})
export class NgxTimeSchedulerModule { }
