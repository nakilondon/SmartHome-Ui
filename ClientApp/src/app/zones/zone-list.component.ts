import { Component, OnInit } from '@angular/core';

import { Zone } from './zone';
import { ZoneService } from './zone.service';

@Component({
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})

export class ZoneListComponent implements OnInit {
  pageTitle = 'Zone List';
  errorMessage = '';

  zones: Zone[] = [];

  constructor(private zoneService: ZoneService) { }

  ngOnInit(): void {
    this.zoneService.getZones().subscribe({
      next: zones => {
        this.zones = zones;
      },
      error: err => this.errorMessage = err
    });
  }
}
