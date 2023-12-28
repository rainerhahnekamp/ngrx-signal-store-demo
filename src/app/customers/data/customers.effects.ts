import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs/operators';
import { customersActions } from './customers.actions';
import { Store } from '@ngrx/store';
import { customersFeature } from '@app/customers/data/customers.reducer';
import { fromCustomers } from '@app/customers/data/customers.selectors';
import { CustomersService } from '@app/customers/data/customers.service';

@Injectable()
export class CustomersEffects {
  #actions$ = inject(Actions);
  #customersService = inject(CustomersService);
  #store = inject(Store);
  #baseUrl = '/customers';

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.load),
      switchMap(({ page }) => this.#customersService.load(page)),
      map(({ content, total, page }) =>
        customersActions.loadSuccess({
          customers: content,
          total,
          page,
        }),
      ),
    );
  });

  nextPage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.nextPage),
      concatLatestFrom(() => [
        this.#store.select(fromCustomers.selectHasNextPage),
        this.#store.select(customersFeature.selectPage),
      ]),
      filter(([, hasNextPage]) => hasNextPage),
      map(([, , page]) => customersActions.load({ page: page + 1 })),
    );
  });

  prevPage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.previousPage),
      concatLatestFrom(() => [
        this.#store.select(fromCustomers.selectHasPreviousPage),
        this.#store.select(customersFeature.selectPage),
      ]),
      filter(([, hasPreviousPage]) => hasPreviousPage),
      map(([, , page]) => customersActions.load({ page: page - 1 })),
    );
  });
}
