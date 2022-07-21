import { RootState } from '@/app/store';

export const tokenTypesSelector = (state: RootState) =>{
  const filterArray = state.tokenState.tokenTypesStatusList.map((tokenTypeItem) => {
    if(tokenTypeItem.checked){
      return tokenTypeItem.name;
    }
  });
  return filterArray;
} 
