import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { ZoneEditComponent } from './zone-edit.component';

@Injectable({
  providedIn: 'root'
})
export class ZoneEditGuard implements CanDeactivate<ZoneEditComponent> {
  canDeactivate(component: ZoneEditComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.zoneForm.dirty) {
      const zoneName = component.zoneForm.get('zoneName').value || 'New Zone';
      return confirm(`Navigate away and lose all changes to ${zoneName}?`);
    }
    return true;
  }
}
