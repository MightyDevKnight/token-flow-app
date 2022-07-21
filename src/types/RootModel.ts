import type { Models } from '@rematch/core';
import type { tokenState } from '@/app/store/models/tokenState';


export interface RootModel extends Models<RootModel> {
  tokenState: typeof tokenState;  
}
