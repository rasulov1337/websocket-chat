import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'transfersSlice',
    initialState: {
        username: '',
        loggedIn: false,
    },
    // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
    reducers: {
        setUsername: (state, { payload }) => {
            state.username = payload;
        },
        setLoggedIn: (state, { payload }) => {
            state.loggedIn = payload;
        },
    },
});

export const { setUsername, setLoggedIn } = slice.actions;

export default slice.reducer;
