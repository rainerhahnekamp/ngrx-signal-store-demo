import { CustomersContainerComponent } from './components/customers-container.component';
import { CustomersRootComponent } from './components/customers-root/customers-root.component';
import { provideCustomers } from '@app/customers/data';

export default [
  {
    path: '',
    component: CustomersRootComponent,
    providers: [provideCustomers()],
    children: [
      {
        path: '',
        component: CustomersContainerComponent,
      },
    ],
  },
];
