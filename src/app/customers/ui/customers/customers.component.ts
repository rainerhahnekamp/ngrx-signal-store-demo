import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomerPipe } from '../customer.pipe';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { Customer } from '@app/customers/model';

export interface CustomerWithSelected extends Customer {
  selected: boolean;
}
export interface CustomersViewModel {
  customers: CustomerWithSelected[];
  pageIndex: number;
  length: number;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CustomerPipe,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule,
    RouterLinkWithHref,
    NgIf,
    DatePipe,
  ],
})
export class CustomersComponent implements OnChanges {
  @Input() viewModel: CustomersViewModel | undefined;
  @Output() setSelected = new EventEmitter<number>();
  @Output() setUnselected = new EventEmitter<number>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  displayedColumns = ['name', 'country', 'birthdate', 'action'];
  dataSource = new MatTableDataSource<CustomerWithSelected>([]);

  ngOnChanges(): void {
    if (this.viewModel) {
      this.dataSource.data = this.viewModel.customers;
    }
  }

  toggleSelection(toggleChange: MatSlideToggleChange, id: number) {
    if (toggleChange.checked) {
      this.setSelected.emit(id);
    } else {
      this.setUnselected.emit(id);
    }
  }
}
