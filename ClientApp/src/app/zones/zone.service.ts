import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Zone } from './zone';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private zonesUrl = 'api/zones';

  constructor(private http: HttpClient) { }

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.zonesUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getZone(id: number): Observable<Zone> {
    if (id === 0) {
      return of(this.initializeZone());
    }
    const url = `${this.zonesUrl}/${id}`;
    return this.http.get<Zone>(url)
      .pipe(
        tap(data => console.log('getZone: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createZone(zone: Zone): Observable<Zone> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    zone.id = null;
    return this.http.post<Zone>(this.zonesUrl, zone, { headers })
      .pipe(
        tap(data => console.log('createZone: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteZone(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.zonesUrl}/${id}`;
    return this.http.delete<Zone>(url, { headers })
      .pipe(
        tap(data => console.log('deleteZone: ' + id)),
        catchError(this.handleError)
      );
  }

  updateZone(zone: Zone): Observable<Zone> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.zonesUrl}/${zone.id}`;
    return this.http.put<Zone>(url, zone, { headers })
      .pipe(
        tap(() => console.log('updateZone: ' + zone.id)),
        // Return the zone on an update
        map(() => zone),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeZone(): Zone {
    // Return an initialized object
    return {
      id: 0,
      zoneName: null,
      sensorId: 0,
      useSensor: true,
      active: true,
      currentTemperature: 0,
      maxTemperature: 0,
      minTemperature: 0,
      range: 0.5,
      lastUpdate: null
    };
  }
}
