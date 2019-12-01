/* Defines the zone entity */
export interface Zone {
  id: number;
  zoneName: string;
  useSensor: boolean;
  sensorId: number;
  active: boolean;
  currentTemperature: number;
  minTemperature: number;
  maxTemperature: number;
  range: number;
  lastUpdate: string;
}

