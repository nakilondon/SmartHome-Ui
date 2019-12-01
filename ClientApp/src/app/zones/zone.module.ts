import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ZoneData } from './zone-data';

import { ZoneListComponent } from './zone-list.component';
import { ZoneDetailComponent } from './zone-detail.component';
import { ZoneEditComponent } from './zone-edit.component';
import { ZoneEditGuard } from './zone-edit.guard';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(ZoneData),
    RouterModule.forChild([
      { path: 'zones', component: ZoneListComponent },
      { path: 'zones/:id', component: ZoneDetailComponent },
      {
        path: 'zones/:id/edit',
        canDeactivate: [ZoneEditGuard],
        component: ZoneEditComponent
      }
    ])
  ],
  declarations: [
    ZoneListComponent,
    ZoneDetailComponent,
    ZoneEditComponent
  ]
})
export class ZoneModule { }
