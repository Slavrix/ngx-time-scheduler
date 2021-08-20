import {AfterViewInit, Component, ElementRef, Inject, Input, LOCALE_ID, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {NgxTimeSchedulerService} from './ngx-time-scheduler.service';
import {
  HeaderDetails,
  Header,
  ItemMeta,
  Item,
  Period,
  SectionItem,
  Section,
  Text,
  Events
} from './ngx-time-scheduler.model';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import { DateAdapter } from './date-adapters/date-adapter';

@Component({
  selector: 'ngx-ts[items][periods][sections], ngx-ts[items][sections][period][start][hideHeader]',
  templateUrl: './ngx-time-scheduler.component.html',
  styleUrls: ['./ngx-time-scheduler.component.scss']
})
export class NgxTimeSchedulerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('sectionTd', { read: ElementRef }) sectionTd: ElementRef;

  @Input() currentTimeFormat = 'dd-MMM-yyyy HH:mm';
  @Input() showCurrentTime = true;
  @Input() allowDragging = false;
  @Input() allowResizing = false;
  @Input() locale: string = '';
  @Input() showBusinessDayOnly = false;
  @Input() minRowHeight = 40;
  @Input() maxHeight: string = null;
  @Input() text = new Text();
  @Input() items: Item[];
  @Input() sections: Section[];
  @Input() events: Events = new Events();
  @Input() customEventTemplate: TemplateRef<any>

  @Input() hideHeader = false;
  // If hideHeader = false
  @Input() periods: Period[];
  @Input() showGoto = true;
  @Input() showToday = true;
  @Input() headerFormat = 'do MMM yyyy';
  // If hideHeader = true
  @Input() period: Period;
  @Input() start: Date;

  end: Date;
  showGotoModal = false;
  currentTimeIndicatorPosition: string;
  currentTimeVisibility = 'visible';
  currentTimeTitle: string;
  ShowCurrentTimeHandle = null;
  SectionLeftMeasure = '0';
  currentPeriod: Period;
  currentPeriodMinuteDiff = 0;
  header: Header[];
  sectionItems: SectionItem[];
  subscription = new Subscription();

  viewInitiated = false;

  constructor(
    private service: NgxTimeSchedulerService,
    public dateAdapter: DateAdapter,
    @Inject(LOCALE_ID) locale: string
  ) {
    this.locale = locale;
  }

  ngOnInit(): void {
    if(!this.start) {
      this.start = this.dateAdapter.startOfDay(new Date());
    } else {
      this.start = this.dateAdapter.startOfDay(this.start);
    }
    this.end = this.dateAdapter.endOfDay(this.start);

    this.setSectionsInSectionItems();
    if (this.hideHeader) {
      this.changePeriod(this.period, false);
    } else {
      this.changePeriod(this.periods[0], false);
    }
    this.itemPush();
    this.itemPop();
    this.itemRemove();
    this.sectionPush();
    this.sectionPop();
    this.sectionRemove();
    this.refresh();
  }

  ngOnChanges(changes: any): void {
    if (this.hideHeader) {
      if(changes.period) {
        this.currentPeriod = changes.period.currentValue;
        this.refreshView();
      } else if(changes.start) {
        this.refreshView();
      }
    }
  }

  ngAfterViewInit(): void {
    this.viewInitiated = true
    this.SectionLeftMeasure = this.sectionTd.nativeElement.clientWidth + 'px';
  }

  refreshView() {
    if(this.viewInitiated) {
      this.SectionLeftMeasure = this.sectionTd.nativeElement.clientWidth + 'px';
    }
    this.setSectionsInSectionItems();
    this.changePeriod(this.currentPeriod, false);
  }

  trackByFn(index, item) {
    return index;
  }

  setSectionsInSectionItems() {
    this.sectionItems = new Array<SectionItem>();
    this.sections.forEach(section => {
      const perSectionItem = new SectionItem();
      perSectionItem.section = section;
      perSectionItem.minRowHeight = this.minRowHeight;
      this.sectionItems.push(perSectionItem);
    });
  }

  setItemsInSectionItems() {
    const itemMetas = new Array<ItemMeta>();

    this.sectionItems.forEach(ele => {
      ele.itemMetas = new Array<ItemMeta>();
      ele.minRowHeight = this.minRowHeight;

      this.items.filter(i => {
        let itemMeta = new ItemMeta();

        if (i.sectionID === ele.section.id) {
          itemMeta.item = i;
          if (itemMeta.item.start <= this.end && itemMeta.item.end >= this.start) {
            itemMeta = this.itemMetaCal(itemMeta);
            ele.itemMetas.push(itemMeta);
            itemMetas.push(itemMeta);
          }
        }
      });
    });

    const sortedItems = itemMetas.reduce((sortItems: {}, itemMeta: ItemMeta) => {
      const index = this.sectionItems.findIndex(sectionItem => sectionItem.section.id === itemMeta.item.sectionID);
      if (!sortItems[index]) {
        sortItems[index] = [];
      }
      sortItems[index].push(itemMeta);
      return sortItems;
    }, {});

    this.calCssTop(sortedItems);
  }

  itemMetaCal(itemMeta: ItemMeta) {
    const foundStart = this.dateAdapter.max([itemMeta.item.start, this.start]);
    const foundEnd = this.dateAdapter.min([itemMeta.item.end, this.end]);

    let widthMinuteDiff = Math.abs(this.dateAdapter.differenceInMinutes(foundStart, foundEnd));
    let leftMinuteDiff = this.dateAdapter.differenceInMinutes(foundStart, this.start);
    if (this.showBusinessDayOnly) {
      widthMinuteDiff -= (this.getNumberOfWeekendDays(new Date(foundStart), new Date(foundEnd)) * this.currentPeriod.timeFramePeriod);
      leftMinuteDiff -= (this.getNumberOfWeekendDays(new Date(this.start), new Date(foundStart)) * this.currentPeriod.timeFramePeriod);
    }

    itemMeta.cssLeft = (leftMinuteDiff / this.currentPeriodMinuteDiff) * 100;
    itemMeta.cssWidth = (widthMinuteDiff / this.currentPeriodMinuteDiff) * 100;

    if (itemMeta.item.start >= this.start) {
      itemMeta.isStart = true;
    }
    if (itemMeta.item.end <= this.end) {
      itemMeta.isEnd = true;
    }

    return itemMeta;
  }

  calCssTop(sortedItems) {
    for (const prop of Object.keys(sortedItems)) {
      for (let i = 0; i < sortedItems[prop].length; i++) {
        let elemBottom;
        const elem = sortedItems[prop][i];

        for (let prev = 0; prev < i; prev++) {
          const prevElem = sortedItems[prop][prev];
          const prevElemBottom = prevElem.cssTop + this.minRowHeight;
          elemBottom = elem.cssTop + this.minRowHeight;

          if ((
            (prevElem.item.start <= elem.item.start && elem.item.start <= prevElem.item.end) ||
            (prevElem.item.start <= elem.item.end && elem.item.end <= prevElem.item.end) ||
            (prevElem.item.start >= elem.item.start && elem.item.end >= prevElem.item.end)
          ) && (
            (prevElem.cssTop <= elem.cssTop && elem.cssTop <= prevElemBottom) ||
            (prevElem.cssTop <= elemBottom && elemBottom <= prevElemBottom)
          )) {
            elem.cssTop = prevElemBottom + 1;
            prev = 0;
          }
        }

        elemBottom = elem.cssTop + this.minRowHeight + 1;
        if (this.sectionItems[Number(prop)] && elemBottom > this.sectionItems[Number(prop)].minRowHeight) {
          this.sectionItems[Number(prop)].minRowHeight = elemBottom;
        }
      }
    }
  }

  changePeriod(period, userTrigger: boolean = true) {
      this.currentPeriod = period;
      this.end = this.dateAdapter.endOfDay(this.dateAdapter.addMinutes(this.start, this.currentPeriod.timeFrameOverall));
      this.currentPeriodMinuteDiff = Math.abs(this.dateAdapter.differenceInMinutes(this.start, this.end));

      if (userTrigger && this.events.PeriodChange) {
        this.events.PeriodChange(this.start, this.end);
      }

      if (this.showBusinessDayOnly) {
        this.currentPeriodMinuteDiff -=
          (this.getNumberOfWeekendDays(this.start, this.end) * this.currentPeriod.timeFramePeriod);
      }

      this.header = new Array<Header>();
      this.currentPeriod.timeFrameHeaders.forEach((ele: string, index: number) => {
        this.header.push(this.getDatesBetweenTwoDates(ele, index));
      });

      this.setItemsInSectionItems();
      this.showCurrentTimeIndicator();
  }

  showCurrentTimeIndicator = () => {
    if (this.ShowCurrentTimeHandle) {
      clearTimeout(this.ShowCurrentTimeHandle);
    }

    const currentTime = new Date();
    if (currentTime >= this.start && currentTime <= this.end) {
      this.currentTimeVisibility = 'visible';
      this.currentTimeIndicatorPosition = (
        (Math.abs(this.dateAdapter.differenceInMinutes(this.start, currentTime)) / this.currentPeriodMinuteDiff) * 100
      ) + '%';
      this.currentTimeTitle = this.dateAdapter.format(currentTime, this.currentTimeFormat);
    } else {
      this.currentTimeVisibility = 'hidden';
    }
    this.ShowCurrentTimeHandle = setTimeout(this.showCurrentTimeIndicator, 30000);
  }

  gotoToday() {
    this.start = this.dateAdapter.startOfDay(new Date());
    this.changePeriod(this.currentPeriod);
  }

  nextPeriod() {
    this.start = this.dateAdapter.addMinutes(this.start, this.currentPeriod.timeFrameOverall);
    // this.start.add(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  previousPeriod() {
    this.start = this.dateAdapter.subMinutes(this.start, this.currentPeriod.timeFrameOverall);
    // this.start.subtract(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  gotoDate(event: any) {
    this.showGotoModal = false;
    this.start = this.dateAdapter.startOfDay(event);
    this.changePeriod(this.currentPeriod);
  }

  getDatesBetweenTwoDates(format: string, index: number): Header {
    let now = new Date(this.start);
    const dates = new Header();
    let prev: string;
    let colspan = 0;

    while (this.dateAdapter.isBefore(now, this.end) || this.dateAdapter.isSameDay(now, this.end)) {
      if (!this.showBusinessDayOnly || (this.dateAdapter.getDay(now) !== 0 && this.dateAdapter.getDay(now) !== 6)) {
        const headerDetails = new HeaderDetails();
        headerDetails.name = this.dateAdapter.format(now, format);
        if (prev && prev !== headerDetails.name) {
          colspan = 1;
        } else {
          colspan++;
          dates.headerDetails.pop();
        }
        prev = headerDetails.name;
        headerDetails.colspan = colspan;
        headerDetails.tooltip = this.currentPeriod.timeFrameHeadersTooltip && this.currentPeriod.timeFrameHeadersTooltip[index] ?
        this.dateAdapter.format(now, this.currentPeriod.timeFrameHeadersTooltip[index]) : '';
        dates.headerDetails.push(headerDetails);
      }
      now = this.dateAdapter.addMinutes(now, this.currentPeriod.timeFramePeriod);
      // now.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }
    return dates;
  }

  getNumberOfWeekendDays(startDate, endDate) {
    let count = 0;
    while (this.dateAdapter.isBefore(startDate, endDate) || this.dateAdapter.isSameDay(startDate, endDate)) {
      if ((this.dateAdapter.getDay(startDate) === 0 || this.dateAdapter.getDay(startDate) === 6)) {
        count++;
      }
      startDate = this.dateAdapter.addMinutes(startDate, this.currentPeriod.timeFramePeriod);
    }
    return count;
  }

  drop(event: CdkDragDrop<Section>) {
    event.item.data.sectionID = event.container.data.id;
    this.refreshView();
    this.events.ItemDropped(event.item.data);
  }

  itemPush() {
    this.subscription.add(this.service.itemAdd.asObservable().subscribe((item: Item) => {
      this.items.push(item);
      this.refreshView();
    }));
  }

  itemPop() {
    this.subscription.add(this.service.item.asObservable().subscribe(() => {
      this.items.pop();
      this.refreshView();
    }));
  }

  itemRemove() {
    this.subscription.add(this.service.itemId.asObservable().subscribe((itemId: number) => {
      this.items.splice(this.items.findIndex((item) => {
        return item.id === itemId;
      }), 1);
      this.refreshView();
    }));
  }

  sectionPush() {
    this.subscription.add(this.service.sectionAdd.asObservable().subscribe((section: Section) => {
      this.sections.push(section);
      this.refreshView();
    }));
  }

  sectionPop() {
    this.subscription.add(this.service.section.asObservable().subscribe(() => {
      this.sections.pop();
      this.refreshView();
    }));
  }

  sectionRemove() {
    this.subscription.add(this.service.sectionId.asObservable().subscribe((sectionId: number) => {
      this.sections.splice(this.sections.findIndex((section) => {
        return section.id === sectionId;
      }), 1);
      this.refreshView();
    }));
  }

  refresh() {
    this.subscription.add(this.service.refreshView.asObservable().subscribe(() => {
      this.refreshView();
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
