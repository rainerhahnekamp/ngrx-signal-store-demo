import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Customer } from '@app/customers/model';
import { lastValueFrom, map, Observable } from 'rxjs';

export interface LoadResponse {
  content: Customer[];
  total: number;
  page: number;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  #baseUrl = '/customers';
  #http = inject(HttpClient);

  load(page: number): Observable<LoadResponse> {
    return this.#http
      .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
        params: new HttpParams().set('page', page),
      })
      .pipe(map((data) => ({ ...data, page })));
  }

  loadAsPromise(page: number) {
    return lastValueFrom(this.load(page));
  }
}
