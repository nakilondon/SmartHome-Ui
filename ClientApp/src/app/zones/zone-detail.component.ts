import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Zone } from './zone';
import { ZoneService } from './zone.service';

@Component({
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.css']
})
export class ZoneDetailComponent implements OnInit {
  pageTitle = 'Zone Detail';
  errorMessage = '';
  zone: Zone | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private zoneService: ZoneService) {
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getZone(id);
    }
  }

  getZone(id: number) {
    this.zoneService.getZone(id).subscribe({
      next: zone => this.zone = zone,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/zones']);
  }

}
