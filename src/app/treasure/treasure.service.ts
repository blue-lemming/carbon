import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreasureService {

    constructor(private http: HttpClient) { }

    getMap() {
        return this.http.get('assets/map.txt', { responseType: 'text' });
    }
}
