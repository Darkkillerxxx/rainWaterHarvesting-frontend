import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  picklistValues: []
};

const picklistValuesSlice = createSlice({
  name: 'picklistValues',
  initialState,
  reducers: {
    addPicklistValues: (state,actions) => {
      state.picklistValues = [...actions.payload]
    }
  }
});

// Export the actions
export const { addPicklistValues } = picklistValuesSlice.actions;

// Export the reducer to use in the store
export default picklistValuesSlice.reducer;
