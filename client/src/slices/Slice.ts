import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "transfersSlice",
    initialState: {
        username: "",
        loggedIn: false,
        dialogOpen: true,
    },
    // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
    reducers: {
        setUsername: (state, { payload }) => {
            state.username = payload;
        },
        login: (state) => {
            state.dialogOpen = false;
            state.loggedIn = true;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.username = "";
            state.dialogOpen = true;
        },
    },
});

export const { setUsername, login, logout } = slice.actions;

export default slice.reducer;
