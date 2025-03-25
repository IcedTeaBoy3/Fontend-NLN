import { configureStore } from '@reduxjs/toolkit';
import  userReducer from './Slides/userSlide';
import productReducer from './Slides/productSlide';
import orderReducer from './Slides/orderSlide';
import { combineReducers } from 'redux';
import { persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// Cấu hình Redux Persist cho orderReducer

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['order'],
}
// Gộp reducer với persistReducer chỉ cho orderReducer
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  order: orderReducer, // Áp dụng persist cho orderReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ kiểm tra serializable để tránh lỗi
    }),
});


export const persistor = persistStore(store);