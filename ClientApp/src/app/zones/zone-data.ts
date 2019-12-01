import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Zone } from './zone';

export class ZoneData implements InMemoryDbService {

  createDb() {
    const zones: Zone[] = [
      {
        id: 1,
        zoneName: 'Nick\'s',
        sensorId: 236,
        useSensor: true,
        active: true,
        currentTemperature: 21.2,
        maxTemperature: 25.0,
        minTemperature: 12.1,
        range: 0.5,
        lastUpdate: '17:01:23 19/11/2019'
      },
      {
        id: 2,
        zoneName: 'Master',
        sensorId: 78,
        useSensor: true,
        active: true,
        currentTemperature: 20.2,
        maxTemperature: 24.0,
        minTemperature: 13.1,
        range: 0.5,
        lastUpdate: '17:01:13 19/11/2019'
      },
      {
        id: 5,
        zoneName: 'Dinning',
        sensorId: 23,
        useSensor: true,
        active: true,
        currentTemperature: 18.2,
        maxTemperature: 20.0,
        minTemperature: 9.1,
        range: 0.5,
        lastUpdate: '17:01:43 19/11/2019'
      },
      {
        id: 8,
        zoneName: 'Living',
        sensorId: 86,
        useSensor: true,
        active: true,
        currentTemperature: 19.2,
        maxTemperature: 20.0,
        minTemperature: 8.1,
        range: 0.5,
        lastUpdate: '17:01:33 19/11/2019'
      },
      {
        id: 10,
        zoneName: 'Bathroom',
        sensorId: null,
        useSensor: false,
        active: true,
        currentTemperature: 0,
        maxTemperature: 0,
        minTemperature: 0,
        range: 0,
        lastUpdate: null
      }
    ];
    return { zones };
  }
}
