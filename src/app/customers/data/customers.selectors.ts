import { createSelector } from '@ngrx/store';
import { customersFeature } from './customers.reducer';
import { Customer } from '@app/customers/model';

const { selectCustomers, selectSelectedId } = customersFeature;

const selectById = (id: number) =>
  createSelector(selectCustomers, (state: Customer[]): Customer | undefined =>
    state.find((p) => p.id === id),
  );

const selectHasNextPage = createSelector(
  customersFeature.selectCustomersState,
  (state) => state.page < state.total,
);
const selectHasPreviousPage = createSelector(
  customersFeature.selectPage,
  (page) => page > 1,
);

const selectPagedCustomers = createSelector(
  selectCustomers,
  selectSelectedId,
  customersFeature.selectPage,
  customersFeature.selectTotal,
  (customers, selectedId, page, total) => ({
    customers: customers.map((customer) => ({
      ...customer,
      selected: customer.id === selectedId,
    })),
    page,
    total,
  }),
);

export const fromCustomers = {
  selectCustomers,
  selectPagedCustomers,
  selectById,
  selectHasPreviousPage,
  selectHasNextPage,
};
