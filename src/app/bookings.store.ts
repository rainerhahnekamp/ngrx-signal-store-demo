import { signalStore, withComputed, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { CustomersStore } from '@app/customers/data/customers-store';

const bookings = [
  { customerId: 1, bookingsCount: 10 },
  { customerId: 2, bookingsCount: 5 },
  { customerId: 3, bookingsCount: 2 },
];

export const BookingsStore = signalStore(
  { providedIn: 'root' },
  withState({ bookings }),

  withComputed((store) => {
    const customersStore = inject(CustomersStore);

    return {
      currentBookings: computed(() => {
        const selectedId = customersStore.selectedId();
        const selectedBookings = store
          .bookings()
          .find((booking) => booking.customerId === selectedId);
        return selectedBookings?.bookingsCount || 0;
      }),
    };
  }),
);
