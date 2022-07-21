import { RootState } from '@/app/store';

export const tokenTypesStatusListSelector = (state: RootState) => state.tokenState.tokenTypesStatusList;
