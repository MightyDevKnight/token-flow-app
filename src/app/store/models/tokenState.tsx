/* eslint-disable import/prefer-default-export */
import omit from 'just-omit';
import { createModel } from '@rematch/core';
import extend from 'just-extend';
import * as tokenStateReducers from './reducers/tokenState';
import * as tokenStateEffects from './effects/tokenState';

import parseTokenValues from '@/utils/parseTokenValues';
import { replaceReferences } from '@/utils/findReferences';
import parseJson from '@/utils/parseJson';
import {
  AnyTokenList, ImportToken, SingleToken, TokenStore,
} from '@/types/tokens';
import {
  SetTokenDataPayload,
  UpdateDocumentPayload,
  SetTokensFromStylesPayload,
} from '@/types/payloads';
import { RootModel } from '@/types/RootModel';
import { ThemeObjectsList, UsedTokenSetsMap } from '@/types';
import { TokenSetStatus } from '@/constants/TokenSetStatus';
import { isEqual } from '@/utils/isEqual';
import { updateTokenSetsInState } from '@/utils/tokenset/updateTokenSetsInState';
import { TokenTypes } from '@/constants/TokenTypes';
import tokenTypes from '@/config/tokenType.defs.json';

export interface TokenState {
  tokens: Record<string, AnyTokenList>;
  themes: ThemeObjectsList;
  lastSyncedState: string; // @README for reference, at this time this is a JSON stringified representation of the tokens and themes ([tokens, themes])
  importedTokens: {
    newTokens: ImportToken[];
    updatedTokens: ImportToken[];
  };
  activeTheme: string | null;
  activeTokenSet: string;
  usedTokenSet: UsedTokenSetsMap;
  editProhibited: boolean;
  hasUnsavedChanges: boolean;
  collapsedTokenSets: string[];
  collapsedTokenTypeObj: Record<TokenTypes, boolean>
}

export const tokenState = createModel<RootModel>()({
  state: {
    tokens: {
      global: [],
    },
    themes: [],
    lastSyncedState: JSON.stringify([{ global: [] }, []], null, 2),
    importedTokens: {
      newTokens: [],
      updatedTokens: [],
    },
    activeTheme: null,
    activeTokenSet: 'global',
    usedTokenSet: {
      global: TokenSetStatus.ENABLED,
    },
    editProhibited: false,
    hasUnsavedChanges: false,
    collapsedTokenSets: [],
    collapsedTokenTypeObj: Object.keys(tokenTypes).reduce<Partial<Record<TokenTypes, boolean>>>((acc, tokenType) => {
      acc[tokenType as TokenTypes] = false;
      return acc;
    }, {}),
  } as unknown as TokenState,
  reducers: {
    setEditProhibited(state, payload: boolean) {
      return {
        ...state,
        editProhibited: payload,
      };
    },
    toggleTreatAsSource: (state, tokenSet: string) => ({
      ...state,
      usedTokenSet: {
        ...state.usedTokenSet,
        [tokenSet]: state.usedTokenSet[tokenSet] === TokenSetStatus.SOURCE
          ? TokenSetStatus.DISABLED
          : TokenSetStatus.SOURCE,
      },
    }),
    setActiveTokenSet: (state, data: string) => ({
      ...state,
      activeTokenSet: data,
    }),
    setLastSyncedState: (state, data: string) => ({
      ...state,
      lastSyncedState: data,
    }),
    setTokenSetOrder: (state, data: string[]) => {
      const newTokens = {};
      data.forEach((set) => {
        Object.assign(newTokens, { [set]: state.tokens[set] });
      });
      return {
        ...state,
        tokens: newTokens,
      };
    },
    resetImportedTokens: (state) => ({
      ...state,
      importedTokens: {
        newTokens: [],
        updatedTokens: [],
      },
    }),
    setJSONData(state, payload) {
      const parsedTokens = parseJson(payload);
      parseTokenValues(parsedTokens);
      const values = parseTokenValues({ [state.activeTokenSet]: parsedTokens });
      return {
        ...state,
        tokens: {
          ...state.tokens,
          ...values,
        },
      };
    },
    setHasUnsavedChanges(state, payload: boolean) {
      return {
        ...state,
        hasUnsavedChanges: payload,
      };
    },
    setTokens: (state, newTokens: Record<string, AnyTokenList>) => ({
      ...state,
      tokens: newTokens,
    }),

    setTokensFromStyles: (state, receivedStyles: SetTokensFromStylesPayload): TokenState => {
      const newTokens: SingleToken[] = [];
      const existingTokens: SingleToken[] = [];
      const updatedTokens: SingleToken[] = [];

      // Iterate over received styles and check if they existed before or need updating
      Object.values(receivedStyles).forEach((values) => {
        values.forEach((token) => {
          const oldValue = state.tokens[state.activeTokenSet].find((t) => t.name === token.name);
          if (oldValue) {
            if (isEqual(oldValue.value, token.value)) {
              if (
                oldValue.description === token.description
                || (typeof token.description === 'undefined' && oldValue.description === '')
              ) {
                existingTokens.push(token);
              } else {
                updatedTokens.push({
                  ...token,
                  oldDescription: oldValue.description,
                });
              }
            } else {
              const updatedToken = { ...token };
              updatedToken.oldValue = oldValue.value;
              updatedTokens.push(updatedToken);
            }
          } else {
            newTokens.push(token);
          }
        });
      });

      return {
        ...state,
        importedTokens: {
          newTokens,
          updatedTokens,
        },
      } as TokenState;
    },
    updateAliases: (state, data: { oldName: string; newName: string }) => {
      const newTokens = Object.entries(state.tokens).reduce<TokenState['tokens']>(
        (acc, [key, values]) => {
          const newValues = values.map<SingleToken>((token) => {
            if (Array.isArray(token.value)) {
              return {
                ...token,
                value: token.value.map((t) => Object.entries(t).reduce<Record<string, string | number>>((a, [k, v]) => {
                  a[k] = replaceReferences(v.toString(), data.oldName, data.newName);
                  return a;
                }, {})),
              } as SingleToken;
            }
            if (typeof token.value === 'object') {
              return {
                ...token,
                value: Object.entries(token.value).reduce<Record<string, string | number>>((a, [k, v]) => {
                  a[k] = replaceReferences(v.toString(), data.oldName, data.newName);
                  return a;
                }, {}),
              } as SingleToken;
            }

            return {
              ...token,
              value: replaceReferences(token.value.toString(), data.oldName, data.newName),
            } as SingleToken;
          });

          acc[key] = newValues;
          return acc;
        },
        {},
      );

      return {
        ...state,
        tokens: newTokens,
      };
    },
    setCollapsedTokenSets: (state, data: string[]) => ({
      ...state,
      collapsedTokenSets: data,
    }),
    setCollapsedTokenTypeObj: (state, data: Record<TokenTypes, boolean>) => ({
      ...state,
      collapsedTokenTypeObj: data,
    }),
    ...tokenStateReducers,
  },
  effects: (dispatch) => ({
    
    setTokenSetOrder() {
      dispatch.tokenState.updateDocument({ shouldUpdateNodes: false });
    },
    setJSONData() {
      dispatch.tokenState.updateDocument();
    },
    setTokenData(payload: SetTokenDataPayload) {
      if (payload.shouldUpdate) {
        dispatch.tokenState.updateDocument();
      }
    },
    toggleUsedTokenSet() {
      dispatch.tokenState.updateDocument({ updateRemote: false });
    },
    toggleManyTokenSets() {
      dispatch.tokenState.updateDocument({ updateRemote: false });
    },
    toggleTreatAsSource() {
      dispatch.tokenState.updateDocument({ updateRemote: false });
    },
    updateCheckForChanges(checkForChanges: boolean) {
      dispatch.tokenState.updateDocument({ checkForChanges, shouldUpdateNodes: false });
    },
    updateDocument(options?: UpdateDocumentPayload, rootState?) {
      const defaults = { shouldUpdateNodes: true, updateRemote: true };
      const params = { ...defaults, ...options };
    },
    ...Object.fromEntries(
      (Object.entries(tokenStateEffects).map(([key, factory]) => (
        [key, factory(dispatch)]
      ))),
    ),
  }),
});
