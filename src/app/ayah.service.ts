import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from "rxjs/operators";
import { throwError } from 'rxjs/internal/observable/throwError';
import { Ayah } from "./models/ayah";
import { SuraIndex } from './models/suraIndex';

@Injectable({
  providedIn: 'root'
})
export class AyahService {


  constructor(private http: HttpClient) { }

  getAyat() {
    return this.http.get('assets/data/arabicQuran.json')
      .pipe(
        map((data: any) => <Ayah[]>data),
        // tap(data => ),
        catchError(this.handleError)
      );
  }

  // getAyat(): Observable<Ayah[]> {
  //   return this.http
  //     .get<Ayah[]>('assets/arabicQuran.json')
  //     .pipe(catchError(this.handleError));
  // }

  getSuraIndexes() {
    return this.http.get('assets/data/suraIndex.json').pipe(
      map((data: any) => <SuraIndex[]>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  // getSuraIndexes(): Observable<SuraIndex[]> {
  //   return this.http
  //     .get<SuraIndex[]>('assets/sruaIndex.json')
  //     .pipe(catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    let msg = `Error status code ${error.status} at ${error.url}`;
    return throwError(msg);
  }

}
