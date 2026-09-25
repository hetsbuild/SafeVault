import { configureStore } from "@reduxjs/toolkit";
import foldeReducer from "./features/folderSlice"

export const store = configureStore({
    reducer:{
        folder:foldeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch