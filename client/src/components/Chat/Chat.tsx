import { Box, Button, Skeleton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Message from '../Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, MessagePayload, RootState } from '../../Types';
import { ChangeEvent, useEffect, useState } from 'react';
import { appendMessage, sliceActions } from '../../slices/Slice';
import VisuallyHiddenInput from '../VisuallyHiddenInput/VisuallyHiddenInput';
import { alertActions } from '../../slices/Alert';
import { fileToDataUrl } from '../../Utils';
import { useMessages, useUserName } from '../../indexedDB';
import MessageSkeleton from '../Message/MessageSkeleton';

export default function Chat() {
    const loggedIn = useSelector((state: RootState) => state.slice.loggedIn);
    const isConnected = useSelector(
        (state: RootState) => state.slice.isConnected
    );

    const [file, setFile] = useState<null | File>(null);
    const [ws, setWS] = useState<null | WebSocket>(null);

    const dispatch = useDispatch<AppDispatch>();

    const { username } = useUserName();
    const { messages } = useMessages();

    useEffect(() => {
        if (!loggedIn) {
            if (!ws) return;

            console.log('Closing connection...');
            ws.close();
            return;
        }

        if (window.MARS) {
            setWS(new WebSocket('/ws/mars'));
        } else {
            setWS(new WebSocket('/ws/earth'));
        }

        console.log('change ws variable', ws);
        if (!ws) return;
        console.log('ws was initialized!');
    }, [loggedIn]);

    const handleMessageReceive = async (event: MessageEvent) => {
        try {
            const payload = JSON.parse(event.data);

            dispatch(appendMessage({ payload }));
        } catch (err) {
            console.error('Ошибка при обработке сообщения:', err);
        }
    };

    useEffect(() => {
        if (!ws) return;

        ws.onopen = () => {
            console.log('Соединение открыто');
            dispatch(sliceActions.setIsConnected(true));
            ws.send(
                JSON.stringify({
                    username,
                })
            );
        };

        ws.onmessage = handleMessageReceive;

        ws.onclose = () => {
            console.log('Соединение закрыто');
        };

        ws.onerror = (error) => {
            console.error('Ошибка WebSocket', error);
        };
    }, [ws]);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files![0];
        setFile(file);
    };

    const handleSend = async () => {
        if (window.MARS) {
            dispatch(
                alertActions.setAlert({
                    title: 'Не удалось отправить сообщение',
                    text: 'Вы можете только принимать сообщения!',
                })
            );
            dispatch(alertActions.show());

            return;
        }

        if (!file) {
            dispatch(
                alertActions.setAlert({
                    title: 'Не удалось отправить сообщение',
                    text: 'Сообщение пустое',
                })
            );
            dispatch(alertActions.show());

            return;
        }

        const dataUrl = await fileToDataUrl(file);

        const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

        const payload = {
            username,
            timestamp,
            message: dataUrl,
        } as MessagePayload;

        ws?.send(JSON.stringify(payload));

        dispatch(
            appendMessage({
                payload: {
                    username,
                    timestamp: new Date(timestamp).toLocaleTimeString(),
                    message: dataUrl,
                },
            })
        );

        setFile(null);
    };

    // todo: move me. i should not be here.
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
    });
    const result = formatter.format(new Date());

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                border: '1px solid',
                borderColor: 'primary.main',
            }}
            className="chat"
        >
            <Box padding="20px 50px">
                {loggedIn ? (
                    <Typography
                        sx={{ textAlign: 'center' }}
                        color="secondary.main"
                    >
                        {result}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Skeleton
                            sx={{ fontSize: '16px' }}
                            variant="text"
                            width={40}
                        />
                    </Box>
                )}

                <Box display="flex" flexDirection="column" gap="25px">
                    {loggedIn
                        ? messages.map((msg, index) => (
                              <Message key={index} {...msg} />
                          ))
                        : Array.from({ length: 3 }).map((_, index) => (
                              <MessageSkeleton key={index} />
                          ))}
                </Box>
            </Box>
            <Box
                className="controls"
                sx={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    padding: '0 30px',
                    width: '100%',
                    height: '54px',
                    position: 'fixed',
                    bottom: '20px',
                    fontWeight: '800',
                }}
            >
                <Button
                    className="controls__button"
                    variant="contained"
                    role={undefined}
                    component="label"
                    sx={{ flex: '1 1 auto' }}
                    startIcon=<UploadFileIcon />
                >
                    {file ? file.name : 'Прикрепить файл'}
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileUpload}
                        multiple
                    />
                </Button>
                <Button
                    className="controls__button"
                    variant="contained"
                    endIcon=<SendIcon />
                    sx={{ flex: '0 1 auto' }}
                    onClick={handleSend}
                    disabled={!isConnected}
                >
                    отправить
                </Button>
            </Box>
        </Box>
    );
}
