import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MessageProps } from '../components/Message/Message';
import { clearDBData, saveMessage, saveUserNameToDB } from '../indexedDB';
import { MessagePayload, RootState } from '../Types';

export const logout = createAsyncThunk(
    'user/logout',
    async (_, { dispatch }) => {
        await clearDBData();
        dispatch(sliceActions.logout());
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;

        await saveUserNameToDB(state.slice.username);
        dispatch(sliceActions.setUsername(state.slice.username));
        dispatch(sliceActions.login());
    }
);

const slice = createSlice({
    name: 'globalSlice',
    initialState: {
        username: '',
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
            state.username = '';
            state.dialogOpen = true;
            state.messages = [];
        },
        appendMessage: (state, { payload }: { payload: MessageProps }) => {
            state.messages.push(payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const sliceActions = slice.actions;

export default slice.reducer;
