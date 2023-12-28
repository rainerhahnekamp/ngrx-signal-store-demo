import { patchState, signalState, signalStore, withHooks } from '@ngrx/signals';
import { initialState } from '@app/customers/data/customers.reducer';
import { CustomersService } from '@app/customers/data/customers.service';
import { computed, inject, Injectable } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';
import { withPagedEntities } from '@app/customers/data/with-paged-entities';
import { withLocalStorageSync } from './with-local-storage-sync';

const customersState = signalState(initialState);

@Injectable({ providedIn: 'root' })
export class CustomersStore2 {
  private customersService = inject(CustomersService);

  pagedCustomers = computed(() => {
    const selectedId = customersState.selectedId();

    return {
      customers: customersState.customers().map((customer) => ({
        ...customer,
        selected: customer.id === selectedId,
      })),
      page: customersState.page(),
      total: customersState.total(),
    };
  });

  load = rxMethod<number>(
    pipe(
      tap((page) => patchState(customersState, { page })),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((page) => this.customersService.load(page)),
      tapResponse({
        next: (response) => {
          patchState(customersState, {
            customers: response.content,
            page: response.page,
            total: response.total,
          });
        },
        error: console.error,
      }),
    ),
  );

  nextPage() {
    const page = customersState.page();
    if (page >= customersState.total()) {
      return;
    }

    this.load(page + 1);
  }

  previousPage() {
    const page = customersState.page();
    if (page <= 1) {
      return;
    }

    this.load(page - 1);
  }

  select(id: number) {
    patchState(customersState, { selectedId: id });
  }

  unselect() {
    patchState(customersState, { selectedId: undefined });
  }
}

export const CustomersStore = signalStore(
  { providedIn: 'root' },
  withPagedEntities(CustomersService),
  withLocalStorageSync('customers'),
  withHooks({
    onInit(store) {
      if (store.loadFromLocalStorage()) {
        return;
      }
      store.load(1);
    },
  }),
);
