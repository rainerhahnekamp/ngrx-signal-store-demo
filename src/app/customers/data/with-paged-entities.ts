import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject, ProviderToken } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, Observable, pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';
import { withLoading } from '@app/customers/data/with-loading';

export interface WithPagedEntityState<Entity> {
  entities: Entity[];
  page: number;
  total: number;
  selectedId: number | undefined;
}

export function withPagedEntities<Entity extends { id: number }>(
  Loader: ProviderToken<{
    load: (
      page: number,
    ) => Observable<{ content: Entity[]; page: number; total: number }>;
  }>,
) {
  return signalStoreFeature(
    withLoading(),
    withState<WithPagedEntityState<Entity>>({
      entities: [] as Entity[],
      page: 0,
      total: 0,
      selectedId: undefined,
    }),
    withMethods((state) => {
      const loader = inject(Loader);
      return {
        load: rxMethod<number>(
          pipe(
            tap((page) => patchState(state, { page })),
            debounceTime(1000),
            distinctUntilChanged(),
            tap(() => state.setLoading(true)),
            switchMap((page) => loader.load(page)),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: (response) => {
                patchState(state, {
                  entities: response.content,
                  page: response.page,
                  total: response.total,
                });
              },
              error: console.error,
            }),
          ),
        ),
        nextPage() {
          const page = state.page();
          if (page >= state.total()) {
            return;
          }

          this.load(page + 1);
        },
        previousPage() {
          const page = state.page();
          if (page <= 1) {
            return;
          }

          this.load(page - 1);
        },
        select(id: number) {
          patchState(state, { selectedId: id });
        },
        unselect() {
          patchState(state, { selectedId: undefined });
        },
      };
    }),
    withComputed((state) => {
      return {
        pagedCustomers: computed(() => {
          const selectedId = state.selectedId();

          return {
            customers: state.entities().map((entity) => ({
              ...entity,
              selected: entity.id === selectedId,
            })),
            page: state.page(),
            total: state.total(),
          };
        }),
      };
    }),
  );
}
