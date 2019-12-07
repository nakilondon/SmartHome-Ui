import { Component, OnInit, AfterViewInit,  OnDestroy, ElementRef, ViewChildren, NgModule} from '@angular/core';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { FormBuilder, FormGroup, FormControlName, NgModel, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoneService } from '../zone.service';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { IZone } from '../zone';
import { debounceTime } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

@NgModule({
  imports: [
  NgbModule]
})

export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Build Schedule';
  errorMessage: string;
  scheduleForm: FormGroup;

  get addresses(): FormArray {
    return this.scheduleForm.get('addresses') as FormArray;
  }

  time = {hour: 13, minute: 30};

  zone: IZone;

  private sub: Subscription;
   // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
   
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private zoneService: ZoneService) { 

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    // Read the zone Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getZone(id);
      }
    );

    this.scheduleForm = this.fb.group({
      sendCatalog: true,
      addresses: this.fb.array([this.buildAddress()])
    });

  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: ['', Validators.required],
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
  //  const controlBlurs: Observable<any>[] = this.formInputElements
  //    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
  //  merge(this.scheduleForm.valueChanges, ...controlBlurs).pipe(
  //    debounceTime(800)
  //  ).subscribe(value => {
  //    this.displayMessage = this.genericValidator.processMessages(this.scheduleForm);
  //  });
  }
  getZone(id: number): void {
    this.zoneService.getZone(id)
      .subscribe({
        next: (zone: IZone) => this.displayZone(zone),
        error: err => this.errorMessage = err
      });
  }

  displayZone(zone: IZone): void {
    if (this.scheduleForm) {
      this.scheduleForm.reset();
    }
    this.zone = zone;

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
