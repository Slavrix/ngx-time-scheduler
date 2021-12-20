import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Item, Period, Section, Events } from '../../projects/ngx-time-scheduler/src/lib/ngx-time-scheduler.model';
import { NgxTimeSchedulerService } from '../../projects/ngx-time-scheduler/src/lib/ngx-time-scheduler.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  eventOutput = '';

  events: Events = new Events();
  periods: Period[];
  sections: Section[];
  allSections: Section[];
  items: Item[];
  itemCount = 3;
  sectionCount = 10;
  showGoto = true;
  showToday = true;
  headerFormat = 'Do MMM YYYY';
  locale = 'en-AU';
  start = moment().startOf('day');
  end = moment().endOf('day');
  currentPeriod: Period;

  constructor(private service: NgxTimeSchedulerService) {
    this.events.SectionClickEvent = (section) => {
      this.eventOutput += '\n' + JSON.stringify(section);
    };
    this.events.SectionContextMenuEvent = (section, {x, y}: MouseEvent) => {
      this.eventOutput += '\n' + JSON.stringify(section) + ',' + JSON.stringify({x, y});
    };
    this.events.ItemClicked = (item) => {
      this.eventOutput += '\n' + JSON.stringify(item);
    };
    this.events.ItemContextMenu = (item, {x, y}: MouseEvent) => {
      this.eventOutput += '\n' + JSON.stringify(item) + ',' + JSON.stringify({x, y});
    };
    this.events.ItemDropped = (item) => {
      this.eventOutput += '\n' + JSON.stringify(item);
    };
    this.events.PeriodChange = (start, end) => {
      this.eventOutput += '\n' + JSON.stringify(start) + ',' + JSON.stringify(end);
    };

    this.periods = [
      {
        name: '2 week',
        timeFrameHeaders: ['MMM yyyy', 'dd(EEE)'],
        timeFrameHeadersTooltip: ['MMM yyyy', 'dd(EEE)'],
        classes: '',
        timeFrameOverall: 1440 * 14,
        timeFramePeriod: 1440,
      },
      {
        name: '3 days',
        timeFramePeriod: (60 * 3),
        timeFrameOverall: (60 * 24 * 3),
        timeFrameHeaders: [
          'do MMM',
          'HH'
        ],
        classes: 'period-3day',
      }, {
        name: '1 week',
        timeFrameHeaders: ['MMM yyyy', 'dd(EEE)'],
        classes: '',
        timeFrameOverall: 1440 * 7,
        timeFramePeriod: 1440,
      },
      {
        name: '1 Day',
        classes: '',
        timeFramePeriod: 60,
        timeFrameOverall: 1440,
        timeFrameHeaders: [
          'do MMM',
          'HH'
        ],
      }];

    this.sections = [{
      name: 'Resource 1',
      id: 1
    }, {
      name: 'Client 1',
      id: 2
    }, {
      name: 'Supplier 2',
      id: 3
    }, {
      name: 'Venue 2',
      id: 4
    }, {
      name: 'Resource 2',
      id: 5
    }, {
      name: 'Resource 3',
      id: 6
    }, {
      name: 'Supplier 4',
      id: 7
    }, {
      name: 'Client 3',
      id: 8
    }, {
      name: 'Supplier 1',
      id: 9
    },
    {
      name: 'Venue 1',
      id: 10
    }];

    this.items = [{
      id: 1,
      sectionID: 1,
      name: 'Item 1',
      start: moment().startOf('day').toDate(),
      end: moment().add(5, 'days').endOf('day').toDate(),
      resource: 'Resource 1',
      supplier: 'Supplier 2',
      client: '',
      venue: '',
      classes: ''
    }, {
      id: 2,
      sectionID: 3,
      name: 'Item 2',
      start: moment().startOf('day').toDate(),
      end: moment().add(4, 'days').endOf('day').toDate(),
      classes: '',
      resource: '',
      supplier: 'Supplier 2',
      client: '',
      venue: 'Venue 1',
    }, {
      id: 3,
      sectionID: 1,
      name: 'Item 3',
      start: moment().add(1, 'days').startOf('day').toDate(),
      end: moment().add(3, 'days').endOf('day').toDate(),
      classes: '',
      resource: 'Resource 1',
      supplier: '',
      client: '',
      venue: '',
    }, {
      id: 4,
      sectionID: 3,
      name: 'Item 4',
      start: moment().add(1, 'days').startOf('day').toDate(),
      end: moment().add(3, 'days').endOf('day').toDate(),
      classes: '',
      resource: '',
      supplier: 'Supplier 2',
      client: '',
      venue: 'Venue 2',
    }, {
      id: 5,
      sectionID: 1,
      name: 'Item 5',
      start: moment().add(7, 'days').startOf('day').toDate(),
      end: moment().add(8, 'days').endOf('day').toDate(),
      classes: '',
      resource: 'Resource 1',
      supplier: 'Supplier 2',
      client: '',
      venue: '',
    }, {
      id: 6,
      sectionID: 1,
      name: 'Item 6',
      start: moment().subtract(3, 'days').startOf('day').toDate(),
      end: moment().subtract(1, 'days').endOf('day').toDate(),
      classes: '',
      resource: 'Resource 3',
      supplier: '',
      client: '',
      venue: 'Venue 1',
    }, {
      id: 7,
      sectionID: 1,
      name: 'Item 7',
      start: moment().subtract(2, 'days').startOf('day').toDate(),
      end: moment().add(2, 'days').endOf('day').toDate(),
      classes: '',
      resource: 'Resource 3',
      supplier: '',
      client: 'Client 1',
      venue: '',
    }, {
      id: 8,
      sectionID: 1,
      name: 'Item 8',
      start: moment().add(3, 'days').startOf('day').toDate(),
      end: moment().add(7, 'days').endOf('day').toDate(),
      classes: '',
      resource: 'Resource 1',
      supplier: '',
      client: 'Client 3',
      venue: '',
    }, {
      id: 9,
      sectionID: 1,
      name: 'Item 9',
      start: moment().subtract(2, 'days').startOf('day').toDate(),
      end: moment().add(7, 'days').endOf('day').toDate(),
      classes: '',
      resource: 'Resource 1',
      supplier: '',
      client: '',
      venue: '',
    }];
    this.currentPeriod = this.periods[0];
    this.resetEnd();
  }

  ngOnInit() {
    this.allSections = this.sections;
    this.showSectionId(0);
  }

  addItem() {
    this.itemCount++;
    this.service.itemPush({
      id: this.itemCount,
      sectionID: 5,
      name: 'Item ' + this.itemCount,
      start: moment().startOf('day').add(5, 'h').toDate(),
      end: moment().add(3, 'days').endOf('day').add(5, 'h').toDate(),
      classes: '',
      client: '',
      resource: '',
      venue: '',
      supplier: ''
    });
  }

  showSectionId(e) {
    let newSections;
    if (e === 1) {
      newSections = this.allSections.filter(sect => sect.name.includes('Supplier'));
    }
    if (e === 0) {
      newSections = this.allSections.filter(sect => sect.name.includes('Resource'));
    }
    if (e === 2) {
      newSections = this.allSections.filter(sect => sect.name.includes('Client'));
    }
    if (e === 3) {
      newSections = this.allSections.filter(sect => sect.name.includes('Venue'));
    }
    this.sections = newSections;
  }

  popItem() {
    this.service.itemPop();
  }

  removeItem() {
    this.service.itemRemove(4);
  }

  addSection() {
    this.sectionCount++;
    this.service.sectionPush({
      id: this.sectionCount,
      name: 'Section ' + this.sectionCount
    });
  }

  popSection() {
    this.service.sectionPop();
  }

  removeSection() {
    this.service.sectionRemove(4);
  }

  refresh() {
    this.service.refresh();
  }

  changePeriod(period) {
    this.currentPeriod = period;
    this.resetEnd();
  }

  resetEnd() {
    this.end = moment(this.start).add(this.currentPeriod.timeFrameOverall, 'minutes').endOf('day');
  }

  gotoToday() {
    this.start = moment().startOf('day');
    this.resetEnd();
  }

  nextPeriod() {
    this.start = moment(this.start).add(this.currentPeriod.timeFrameOverall, 'minutes');
    this.resetEnd();
  }

  previousPeriod() {
    this.start = moment(this.start).subtract(this.currentPeriod.timeFrameOverall, 'minutes');
    this.resetEnd();
  }

  gotoDate(event: any) {
    this.start = moment(event).startOf('day');
    this.resetEnd();
  }

}
