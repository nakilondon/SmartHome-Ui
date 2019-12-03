/* Defines the zone entity */
export interface IZone {
  id: number;
  zoneName: string;
  useSensor: boolean;
  sensorId: number;
  active: boolean;
  currentTemperature: number;
  target: number;
  minTemperature: number;
  maxTemperature: number;
  range: number;
  lastUpdate: string;
}

