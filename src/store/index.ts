import { Dispatch } from 'react';
import {
  combineReducers,
  configureStore,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import {
  AnyAction,
  CombinedState,
} from 'redux';
import ton from './ton/slice'

const rootReducer = combineReducers({
  ton,
});

const index = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = Dispatch<AnyAction> & ThunkDispatch<CombinedState<RootState>, null, AnyAction>;

export default index;
