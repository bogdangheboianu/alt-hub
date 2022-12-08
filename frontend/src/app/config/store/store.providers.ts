import { Provider } from '@angular/core';
import { PERSIST_STORAGE, Stores } from '@config/store/store.constants';
import { persistState } from '@datorama/akita';

export const storeProviders: Provider[] = [
    {
        provide : PERSIST_STORAGE,
        useValue: persistState( {
                                    storage: sessionStorage,
                                    include: Stores
                                } )
    }
];
