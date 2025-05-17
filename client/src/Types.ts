import store from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type MessagePayload = {
    timestamp: string;
    username: string;
    error_flag?: boolean;
    message?: {
        filename: string;
        data: string;
    };
};
