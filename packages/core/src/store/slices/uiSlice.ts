import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showOnboardingModal: boolean;
}

const initialState: UIState = {
  showOnboardingModal: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openOnboardingModal: (state) => {
      state.showOnboardingModal = true;
    },
    closeOnboardingModal: (state) => {
      state.showOnboardingModal = false;
    },
    setOnboardingModal: (state, action: PayloadAction<boolean>) => {
      state.showOnboardingModal = action.payload;
    },
  },
});

export const { openOnboardingModal, closeOnboardingModal, setOnboardingModal } = uiSlice.actions;
export default uiSlice.reducer;
