import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userInfo/userSlice'
export default configureStore({
  reducer: {
    userLoginInfo: userSlice,
  },
})