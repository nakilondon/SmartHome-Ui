import { Component, Inject, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})

export class FetchDataComponent implements OnInit {
    type = 'Gauge';

    public gauges: IGauge[];

    private returnedZones: IZone[];

    private updateSubscription: Subscription;

    constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) {}

    ngOnInit() {

      this.updateStats();
      this.updateSubscription = interval(2000).subscribe(
        (val) => {
          this.updateStats();
        });
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  private updateStats() {

    this.http.get<IZone[]>(this.baseUrl + 'zone').subscribe(result => {
        this.returnedZones = result;
      }, error => console.error(error));

    if (this.returnedZones && this.returnedZones.length) {
      this.gauges = [];
      this.returnedZones.forEach((zone) => {
        this.gauges.push(<IGauge>{
          labels: [[zone.name, zone.temperature]],
          options: {
            width: 400,
            height: 120,
            greenFrom: zone.min,
            greenTo: zone.target,
            greenColor: '#115DA8',
            yellowFrom: zone.target,
            yellowTo: zone.range,
            redFrom: zone.range,
            redTo: zone.max,
            minorTicks: 2,
            min: zone.min,
            max: zone.max
          }
        });
      });
    };
  }
}

interface IZone {
    max: number | 1;
    min: number | 1;
    name: string;
    range: number | 1;
    target: number | 1;
    temperature: number | 1;
}

interface IGaugeOptions {
  width: number;
  height: number;
  greenFrom: number;
  greenTo: number;
  greenColor: string;
  redFrom: number;
  redTo: number;
  yellowFrom: number;
  yellowTo: number;
  minorTicks: number;
  min: number;
  max: number;
};

interface IGauge {
  options: IGaugeOptions;
  labels: (string | number )[][];
}
