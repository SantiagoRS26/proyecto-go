import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  expanded: boolean;
}

const initialState: UIState = {
  expanded: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleExpanded(state) {
      state.expanded = !state.expanded;
    },
    setExpanded(state, action) {
      state.expanded = action.payload;
    },
  },
});

export const { toggleExpanded, setExpanded } = uiSlice.actions;
export default uiSlice.reducer;
