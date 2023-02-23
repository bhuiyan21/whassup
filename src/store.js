import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userInfo/userSlice';
import activeChatSlice from './slices/userInfo/activeChatSlice';
import forwordSlice from './slices/userInfo/forwordSlice';
export default configureStore({
  reducer: {
    userLoginInfo: userSlice,
    activeChat: activeChatSlice,
    forwordItem: forwordSlice,
  },
})