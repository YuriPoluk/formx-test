import { configureStore } from '@reduxjs/toolkit'
import cubeMaterialsSlice from './reducers/cubeMaterialsSlice'

const store = configureStore({
  reducer: {
    cube: cubeMaterialsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store


