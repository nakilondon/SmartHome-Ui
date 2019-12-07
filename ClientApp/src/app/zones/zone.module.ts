import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// Imports for loading & configuring the in-memory web api
//import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ZoneData } from './zone-data';

import { ZoneListComponent } from './zone-list.component';
import { ZoneDetailComponent } from './zone-detail.component';
import { ZoneEditComponent } from './zone-edit.component';
import { ZoneEditGuard } from './zone-edit.guard';
import { ScheduleComponent } from './schedule/schedule.component';
import { scheduled } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
   // InMemoryWebApiModule.forRoot(ZoneData),
    RouterModule.forChild([
      { path: 'zones', component: ZoneListComponent },
      { path: 'zones/:id', component: ZoneDetailComponent },
      {
        path: 'zones/:id/edit',
        canDeactivate: [ZoneEditGuard],
        component: ZoneEditComponent
      },
      { path: 'zones/:id/schedule', component: ScheduleComponent }
    ])
  ],
  declarations: [
    ZoneListComponent,
    ZoneDetailComponent,
    ZoneEditComponent,
    ScheduleComponent
  ]
})
export class ZoneModule { }
