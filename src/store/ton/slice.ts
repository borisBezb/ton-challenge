import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';
import {
  fetchStatus,
  IPair,
  IPairMeta,
} from './interfaces';
import { getRandom } from '../../utils/random';
import storage from '../../services/storage';

const FavStorageKey = 'favorites';

interface ITonState {
  list: IPairMeta[];
  status: fetchStatus;
  favorites: string[];
  detail: {
    pair: IPair | null;
    status: fetchStatus;
  };
  purchaseForm: {
    status: fetchStatus;
    result: {
      code: string,
      message: string,
    };
  }
}

const initialState = {
  list: [],
  status: 'idle',
  favorites: storage.load<string[]>(FavStorageKey, []),
  detail: {
    pair: null,
    status: 'idle',
  },
  purchaseForm: {
    status: 'idle',
    result: {
      code: '',
      message: '',
    }
  }
} as ITonState;

export const fetchPairList = createAsyncThunk<IPairMeta[], void, { state: RootState }>(
  'ton/fetchPairList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<IPairMeta[]>('https://ton-swap-indexer.broxus.com/v1/pairs/meta');

      return response.data;
    } catch (err) {
      return rejectWithValue(['Произошла ошибка, повторите позже']);
    }
  }
);

export const fetchPairDetail = createAsyncThunk<IPair, string, { state: RootState }>(
  'ton/fetchPairDetail',
  async (poolAddress: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<IPair>(`https://ton-swap-indexer.broxus.com/v1/pairs/address/${poolAddress}`);

      return response.data;
    } catch (err) {
      return rejectWithValue(['Произошла ошибка, повторите позже']);
    }
  }
);

export interface IPurchaseFormData {
  pool: string;
  amount: number;
}

interface IPurchaseResponse {
  code: 'success' | 'error';
  message: string;
}

export const purchasePair = createAsyncThunk<IPurchaseResponse, IPurchaseFormData, { rejectValue: IPurchaseResponse, state: RootState }>(
  'ton/purchasePair',
  async (data, { rejectWithValue }) => {
    try {
      return await new Promise<IPurchaseResponse>((resolve, reject) => {
        const responseTime = getRandom(4, 7);
        const responseType = getRandom(1, 5);

        setTimeout(() => {
          if (responseType === 3) {
            return reject({
              code: 'error',
              message: 'Unexpected error occurred',
            });
          }

          resolve({
            code: 'success',
            message: 'Purchase has been processed',
          });
        }, responseTime * 1000);
      });
    } catch (err) {
      return rejectWithValue(err as IPurchaseResponse);
    }
  }
);

const tonSlice = createSlice({
  name: 'ton',
  initialState,
  reducers: {
    addToFavourites(state, action: { payload: string }) {
      const inList = state.favorites.find((item) => item === action.payload);
      if (inList) {
        return;
      }

      state.favorites.push(action.payload);
      storage.save(FavStorageKey, state.favorites);
    },

    removeFromFavourites(state, action: { payload: string }) {
      state.favorites = state.favorites.filter(item => item !== action.payload);
      storage.save(FavStorageKey, state.favorites);
    },

    clearForm(state) {
      state.purchaseForm = {
        result: {
          code: '',
          message: '',
        },
        status: 'idle'
      }
    }
  },
  extraReducers (builder) {
    builder
      .addCase(fetchPairList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPairList.fulfilled, (state, action) => {
        state.list = action.payload.filter((item) => item.counter === 'USDT');
        state.status = 'succeed';
      })
      .addCase(fetchPairList.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchPairDetail.pending, (state) => {
        state.detail.status = 'loading';
      })
      .addCase(fetchPairDetail.fulfilled, (state, action) => {
        state.detail.pair = action.payload;
        state.detail.status = 'succeed';
      })
      .addCase(fetchPairDetail.rejected, (state) => {
        state.detail.status = 'failed';
      })
      .addCase(purchasePair.pending, (state) => {
        state.purchaseForm.status = 'loading';
      })
      .addCase(purchasePair.fulfilled, (state, action) => {
        state.purchaseForm.status = 'succeed';
        state.purchaseForm.result = action.payload;
      })
      .addCase(purchasePair.rejected, (state, action) => {
        state.purchaseForm.status = 'failed';
        state.purchaseForm.result = action.payload as IPurchaseResponse;
      })
  }
});

export const {
  addToFavourites,
  clearForm,
  removeFromFavourites,
} = tonSlice.actions;
export default tonSlice.reducer;
