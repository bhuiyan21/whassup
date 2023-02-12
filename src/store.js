import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userInfo/userSlice';
import activeChatSlice from './slices/userInfo/activeChatSlice';
export default configureStore({
  reducer: {
    userLoginInfo: userSlice,
    activeChat: activeChatSlice,
  },
})