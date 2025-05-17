import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const appendMessage = createAsyncThunk(
    'message/append',
    async ({ payload }: { payload: MessagePayload }, { dispatch }) => {
        await saveMessage(payload);
        dispatch(sliceActions.appendMessage(payload));
    }
);

const slice = createSlice({
    name: 'globalSlice',
    initialState: {
        username: '',
        loggedIn: false,
        dialogOpen: true,
        messages: [] as MessagePayload[],
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
        appendMessage: (state, { payload }: { payload: MessagePayload }) => {
            state.messages.push(payload);
        },
        setMessages: (state, { payload }: { payload: MessagePayload[] }) => {
            state.messages = payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const sliceActions = slice.actions;

export default slice.reducer;
