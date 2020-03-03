import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError, scheduled } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { ISchedule as Schedule } from './schedule';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  private scheduleUrl = this.baseUrl;

  getSchedule(id: number, mode: string): Observable<Schedule[]> {
    if (id === 0) {
      return of(this.initializeZone());
    }
    const url = `${this.scheduleUrl}schedule/${id}/${mode}`;
    return this.http.get<Schedule[]>(url)
      .pipe(
        tap(data => console.log('getSchedule: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createSchedule(id: number, mode: string, schedule: Schedule): Observable<{}> {
    schedule.scheduleId = 0;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.scheduleUrl}schedule/${id}/${mode}`;

    return  this.http.post(url, schedule, { headers })
      .pipe(
        tap(data => console.log('createSchedule: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
    
  }

  deleteSchedule(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.scheduleUrl}schedule/${id}`;
    return this.http.delete<Schedule>(url, { headers })
      .pipe(
        tap(data => console.log('deleteSchedule: ' + id)),
        catchError(this.handleError)
      );
  }

  updateSchedule(schedule: Schedule): Observable<Schedule> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
      const url = `${this.scheduleUrl}scedule/update`;
      return this.http.post<Schedule>(url, schedule, { headers })
      .pipe(
        tap(() => console.log('updateSchedule: ')),
        // Return the zone on an update
        map(() => schedule),
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
      errorMessage = `Backend returned code ${err.status}: ${err.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeZone(): Schedule[] {
    // Return an initialized object
    return [{
      scheduleId: 0,
      startTime: "00:00",
      endTime: "00:00",
      targetTemp: 20
    }];
  }
}
