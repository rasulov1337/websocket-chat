import { configureStore } from '@reduxjs/toolkit';
import sliceReducer from './slices/Slice';

export default configureStore({
    reducer: {
        slice: sliceReducer,
    },
});
