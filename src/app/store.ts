import { init, RematchDispatch } from '@rematch/core';
import { RootModel } from '@/types/RootModel';
import { models } from './store/models';

import type { TokenState } from './store/models/tokenState';

export const store = init({
  models,
  redux: {
    devtoolOptions: {},
    rootReducers: {
      RESET_APP: () => undefined,
    },
  },
});
if(typeof window !== 'undefined'){
  (window as any).store = store;
};
export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = {
  tokenState: TokenState;
};

