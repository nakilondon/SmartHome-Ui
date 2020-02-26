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
        this.getSchedule(id, "ActiveDefault");
      });

    this.scheduleForm = this.fb.group({
      mode: "ActiveDefault",
      startTime: { hour: Number, minute: Number},
      endTime: { hour: Number, minute: Number},
      targetTemp: Number
    });

    this.scheduleForm.patchValue({
      defaultActive: 20,
      defaultNonActive: 10
    })

  }
  getZone(id: number) {
    this.zoneService.getZone(id).subscribe({
      next: zone => this.zone = zone,
      error: err => this.errorMessage = err
    });
  }

  getSchedule(id: number, mode: string) {
    this.scheduleService.getSchedule(id, mode).subscribe({
      next: (schedules: ISchedule[] ) => this.schedules = schedules,
      error: err => this.errorMessage = err
    })
  }

  saveSchedule(): void {
    if (this.scheduleForm.valid) {
      if (this.scheduleForm.dirty) {
        const p = { ...this.schedule, ...this.scheduleForm.value };

        this.scheduleService.createSchedule(p)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });

        if (p.id === 0) {
          this.scheduleService.createSchedule(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.scheduleService.updateSchedule(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.scheduleForm.reset();
    this.router.navigate(['/zones']);
  }

  buildSchedule(): FormGroup {
    return this.fb.group({
      startTime: {hour: 13, minute: 30},
      endTime: {hour: 13, minute: 30},
      targetTemp: 10
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
