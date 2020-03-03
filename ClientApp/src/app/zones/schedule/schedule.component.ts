import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, NgModule, Input, Output} from '@angular/core';
import { Subscription, Observable, fromEvent, merge, scheduled } from 'rxjs';
import { FormBuilder, FormGroup, FormControlName, NgModel, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoneService } from '../zone.service';
import { ScheduleService } from './schedule.service';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { IZone } from '../zone';
import { ISchedule } from './schedule'
import { debounceTime } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdTimepickerBasic } from './timepicker-basic';
import { NumberValidators } from 'src/app/shared/number.validator';
import { stringify } from 'querystring';
import { EventEmitter } from 'protractor';
import { Time } from '@angular/common';
import { scheduleTime } from './scheduleTime';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

@NgModule({
  imports: [NgbModule],
  declarations: [NgbdTimepickerBasic]
})

export class ScheduleComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Build Schedule';
  errorMessage: string;
  scheduleForm: FormGroup;
  zone: IZone;

  schedule: ISchedule;
  schedules: ISchedule[];

  private sub: Subscription;
   // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
   
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private zoneService: ZoneService,
    private scheduleService: ScheduleService ) 
    { 
      this.genericValidator = new GenericValidator(this.validationMessages);
    }
    get actions(): FormArray{
      return <FormArray>this.scheduleForm.get('actions');
    }

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getZone(id);
        this.getSchedule(id, "HomeWeekday");
      });

    this.scheduleForm = this.fb.group({
      mode: "HomeWeekday",
      startTime: scheduleTime,
      endTime: scheduleTime,
      targetTemp: Number
    });

  }

  changeMode(e){
    this.getSchedule(this.zone.id, this.scheduleForm.value.mode)
  }

  getZone(id: number) {
    this.zoneService.getZone(id).subscribe({
      next: zone => this.zone = zone,
      error: err => this.errorMessage = err
    });
  }

  addSchedule(){
    const scheduleToAdd = new ISchedule;
    
    scheduleToAdd.startTime = this.timeToString(this.scheduleForm.value.startTime);
    scheduleToAdd.endTime = this.timeToString(this.scheduleForm.value.endTime);
    scheduleToAdd.targetTemp = this.scheduleForm.value.targetTemp;
      
    this.scheduleService.createSchedule(this.zone.id, this.scheduleForm.value.mode, scheduleToAdd)
    .subscribe({
      next: () => this.getSchedule(this.zone.id, this.scheduleForm.value.mode),
      error: err => this.errorMessage = err
      });

    this.getSchedule(this.zone.id, this.scheduleForm.value.mode);
  }

  timeToString(timeNumber: scheduleTime): String{
    var returnString = new String;
    
    returnString = "";
    
    if (timeNumber.hour < 10) {
      returnString = "0";
    }
    returnString += timeNumber.hour.toString() + ":";

    if (timeNumber.minute < 10) {
      returnString += "0";
    }

    returnString += timeNumber.minute.toString();

    return returnString;
  }

  getSchedule(id: number, mode: string) {
    this.scheduleService.getSchedule(id, mode).subscribe({
      next: (schedules: ISchedule[] ) => this.schedules = schedules,
      error: err => this.errorMessage = err
    })
  }
  
  deleteSchedule(scheduleId: number): void {
    this.scheduleService.deleteSchedule(scheduleId)
      .subscribe({
        next: () => this.getSchedule(this.zone.id, this.scheduleForm.value.mode),
        error: err => this.errorMessage = err
      });
  }

  displaySchedule(schedule: ISchedule[]): void {
    this.scheduleForm.value.actions.length = 0;

    schedule.forEach(element => {
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
