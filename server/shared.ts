export interface InitData {
    username: string;
}

export interface MessageData {
    username: string;
    error_flag: boolean;
    message: string;
    timestamp: number;
}

export type ReceivedData = InitData | MessageData;

export const TRANSPORT_LAYER_ADDRESS = 'http://90.156.219.177:8011/send';

export const isMessageData = (data: any) => {
    const d = data as MessageData;
    return (
        d.username !== undefined &&
        d.timestamp !== undefined &&
        d.message !== undefined
    );
};

export const isInitData = (data: any): data is InitData => {
    return (data as InitData).username !== undefined;
};
