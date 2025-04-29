import { configureStore } from "@reduxjs/toolkit";
import sliceReducer from "./slices/Slice";
import alertReducer from "./slices/Alert";

export default configureStore({
    reducer: {
        slice: sliceReducer,
        alert: alertReducer,
    },
});
