import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '@app/customers/model';

export const customersActions = createActionGroup({
  source: 'Customers',
  events: {
    Load: props<{ page: number }>(),
    'Load Success': props<{
      customers: Customer[];
      total: number;
      page: number;
    }>(),
    'Next Page': emptyProps(),
    'Previous Page': emptyProps(),
    Select: props<{ id: number }>(),
    Unselect: emptyProps(),
  },
});
