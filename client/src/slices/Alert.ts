import { createSlice } from "@reduxjs/toolkit";

const alert = createSlice({
    name: "alertSlice",
    initialState: {
        open: false,
        title: "",
        text: "",
    },
    reducers: {
        show: (state) => {
            state.open = true;
        },
        hide: (state) => {
            state.open = false;
        },
        setAlert: (state, { payload }) => {
            state.text = payload.text;
            state.title = payload.title;
        },
    },
});

export const alertActions = alert.actions;

export default alert.reducer;
