import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { customersActions } from './customers.actions';
import { Customer } from '@app/customers/model';
import { fromCustomers } from '@app/customers/data/customers.selectors';

@Injectable({ providedIn: 'root' })
export class CustomersRepository {
  #store = inject(Store);

  get customers(): Signal<Customer[]> {
    return this.#store.selectSignal(fromCustomers.selectCustomers);
  }
  get pagedCustomers(): Signal<{
    customers: (Customer & { selected: boolean })[];
    total: number;
    page: number;
  }> {
    return this.#store.selectSignal(fromCustomers.selectPagedCustomers);
  }
  findById(id: number): Signal<Customer | undefined> {
    return this.#store.selectSignal(fromCustomers.selectById(id));
  }
  load(page: number = 1): void {
    this.#store.dispatch(customersActions.load({ page }));
  }
  nextPage() {
    this.#store.dispatch(customersActions.nextPage());
  }
  previousPage() {
    this.#store.dispatch(customersActions.previousPage());
  }
  select(id: number): void {
    this.#store.dispatch(customersActions.select({ id }));
  }
  unselect(): void {
    this.#store.dispatch(customersActions.unselect());
  }
}
