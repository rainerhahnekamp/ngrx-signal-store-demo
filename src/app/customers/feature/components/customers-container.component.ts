import { Component, computed, inject, Signal } from '@angular/core';
import { CustomersComponent, CustomersViewModel } from '@app/customers/ui';
import { CustomersStore } from '@app/customers/data/customers-store';
import { MatButtonModule } from '@angular/material/button';
import { BookingsStore } from '@app/bookings.store';

@Component({
  selector: 'app-customers-container',
  template: `<button mat-raised-button (click)="sync()">
      Sync to Local Storage
    </button>
    @if (isLoading()) {
    <p>Loading...</p>
    }
    <app-customers
      [viewModel]="viewModel()"
      (setSelected)="setSelected($event)"
      (setUnselected)="setUnselected()"
      (previousPage)="previousPage()"
      (nextPage)="nextPage()"
    ></app-customers>
    @if (currentBookings(); as value) {
    <p>Current Bookings: {{ value }}</p>
    } `,
  standalone: true,
  imports: [CustomersComponent, MatButtonModule],
})
export class CustomersContainerComponent {
  #store = inject(CustomersStore);
  currentBookings = inject(BookingsStore).currentBookings; // inter-store communication
  isLoading = this.#store.isLoading;
  viewModel: Signal<CustomersViewModel> = computed(() => {
    const pagedCustomers = this.#store.pagedCustomers();
    return {
      customers: pagedCustomers.customers,
      pageIndex: pagedCustomers.page - 1,
      length: pagedCustomers.total,
    };
  });

  setSelected(id: number) {
    this.#store.select(id);
  }

  setUnselected() {
    this.#store.unselect();
  }

  previousPage() {
    this.#store.previousPage();
  }

  nextPage() {
    this.#store.nextPage();
  }

  sync() {
    this.#store.saveToLocalStorage();
  }
}
