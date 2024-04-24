import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SailPointService {

  constructor(private httpClient: HttpClient ) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error( errorMessage );
    return throwError( ()=> new Error( errorMessage ) );
  }

  
  public post( accessToken: string, apiEndpoint: string, body: any ) {
    
    const headers = new HttpHeaders()
      .set( "Authorization", "Bearer " + accessToken )
      .set( "Content-Type", "application/json");

    return this.httpClient
      .post( environment.apiUrl + apiEndpoint, body, { headers })
      .pipe(catchError(this.handleError));
  }

}