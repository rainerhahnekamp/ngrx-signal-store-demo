import { provideState } from '@ngrx/store';
import { securityFeature } from './security.reducer';
import { provideEffects } from '@ngrx/effects';
import { SecurityEffects } from './security.effects';

export const provideSecurity = [
  provideState(securityFeature),
  provideEffects(SecurityEffects),
];
