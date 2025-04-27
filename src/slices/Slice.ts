import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'transfersSlice',
    initialState: {
        username: '',
    },
    // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
    reducers: {
        setUsername: (state, { payload }) => {
            state.username = payload;
        },
    },
});

export const { setUsername } = slice.actions;

export default slice.reducer;
