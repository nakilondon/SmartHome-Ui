import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Zone } from './zone';
import { ZoneService } from './zone.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';

@Component({
  templateUrl: './zone-edit.component.html'
})
export class ZoneEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Zone Edit';
  errorMessage: string;
  zoneForm: FormGroup;

  zone: Zone;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private zoneService: ZoneService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      zoneName: {
        required: 'Zone name is required.',
        minlength: 'Zone name must be at least three characters.',
        maxlength: 'Zone name cannot exceed 50 characters.'
      },
      sensorId: {
        range: 'Sensor Id must be between 1 (lowest) and 255 (highest).'
      },
      range: {
        range: 'Cut off above must be between 0.1 (lowest) and 1.5 (highest).'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.zoneForm = this.fb.group({
      zoneName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(20)]],
      useSensor: true,
      sensorId: [1, NumberValidators.range(1, 255)],
      range: [0.5, [NumberValidators.range(0.1, 1.5)]]
    });

    // Read the zone Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getZone(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.zoneForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.zoneForm);
    });
  }

  getZone(id: number): void {
    this.zoneService.getZone(id)
      .subscribe({
        next: (zone: Zone) => this.displayZone(zone),
        error: err => this.errorMessage = err
      });
  }

  displayZone(zone: Zone): void {
    if (this.zoneForm) {
      this.zoneForm.reset();
    }
    this.zone = zone;

    if (this.zone.id === 0) {
      this.pageTitle = 'Add Zone';
    } else {
      this.pageTitle = `Edit Zone: ${this.zone.zoneName}`;
    }

    // Update the data on the form
    this.zoneForm.patchValue({
      zoneName: this.zone.zoneName,
      useSensor: this.zone.useSensor,
      sensorId: this.zone.sensorId,
      range: this.zone.range
    });

  }

  deleteZone(): void {
    if (this.zone.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the zone: ${this.zone.zoneName}?`)) {
        this.zoneService.deleteZone(this.zone.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveZone(): void {
    if (this.zoneForm.valid) {
      if (this.zoneForm.dirty) {
        const p = { ...this.zone, ...this.zoneForm.value };

        if (p.id === 0) {
          this.zoneService.createZone(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.zoneService.updateZone(p)
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
    this.zoneForm.reset();
    this.router.navigate(['/zones']);
  }
}
