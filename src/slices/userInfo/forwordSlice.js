import { createSlice } from '@reduxjs/toolkit'

export const forwordSlice = createSlice({
  name: 'forword',
  initialState: {
    forwordItem: null,
  },
  reducers: {
    forword: (state, action) => {
        state.forwordItem = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { forword } = forwordSlice.actions
export default forwordSlice.reducer