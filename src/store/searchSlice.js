import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBrands, fetchOffers } from '../api/favorit'

export const loadBrands = createAsyncThunk('search/loadBrands', (number, { signal }) =>
  fetchBrands(number, signal),
)

export const loadOffers = createAsyncThunk('search/loadOffers', ({ number, brand }, { signal }) =>
  fetchOffers(number, brand, signal),
)

const initialRequest = { items: [], status: 'idle', error: null }

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    number: '',
    selectedBrand: null,
    brands: initialRequest,
    offers: initialRequest,
  },
  reducers: {
    reset(state) {
      state.number = ''
      state.selectedBrand = null
      state.brands = initialRequest
      state.offers = initialRequest
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBrands.pending, (state, action) => {
        state.number = action.meta.arg
        state.selectedBrand = null
        state.brands = { items: [], status: 'loading', error: null }
        state.offers = initialRequest
      })
      .addCase(loadBrands.fulfilled, (state, action) => {
        state.brands = { items: action.payload, status: 'succeeded', error: null }
      })
      .addCase(loadBrands.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.brands = { items: [], status: 'failed', error: action.error.message }
      })
      .addCase(loadOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand
        state.offers = { items: [], status: 'loading', error: null }
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        state.offers = { items: action.payload, status: 'succeeded', error: null }
      })
      .addCase(loadOffers.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.offers = { items: [], status: 'failed', error: action.error.message }
      })
  },
})

export const { reset } = searchSlice.actions
export default searchSlice.reducer
