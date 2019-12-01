import { TestBed, async, inject } from '@angular/core/testing';

import { ZoneEditGuard } from './zone-edit.guard';

describe('ZoneEditGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZoneEditGuard]
    });
  });

  it('should ...', inject([ZoneEditGuard], (guard: ZoneEditGuard) => {
    expect(guard).toBeTruthy();
  }));
});
