import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  climateData: [],
  selectedYear: "2030",
};

export const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    reset: () => initialState,
    increment: (state, action) => {
      state.climateData = action.payload;
    },
    year: (state, action) => {
      state.year = action.payload;
    },
  },
});

export const { increment, year, reset } = data.actions;
export default data.reducer;
