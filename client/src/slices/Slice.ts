import { createSlice } from "@reduxjs/toolkit";
import { MessageProps } from "../components/Message/Message";

const slice = createSlice({
    name: "transfersSlice",
    initialState: {
        username: "",
        loggedIn: false,
        dialogOpen: true,
        messages: [] as MessageProps[],
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
            state.messages = [];
        },
        setMessages: (state, { payload }) => {
            state.messages = payload;
        },
    },
});

export const { setUsername, login, logout, setMessages } = slice.actions;

export default slice.reducer;
