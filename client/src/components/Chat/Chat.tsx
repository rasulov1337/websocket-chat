import { Box, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Message from '../Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Types';
import { ChangeEvent, useEffect, useState } from 'react';
import { sliceActions } from '../../slices/Slice';
import VisuallyHiddenInput from '../VisuallyHiddenInput/VisuallyHiddenInput';
import { alertActions } from '../../slices/Alert';

export default function Chat() {
    const username = useSelector((state: RootState) => state.slice.username);
    const loggedIn = useSelector((state: RootState) => state.slice.loggedIn);
    const messages = useSelector((state: RootState) => state.slice.messages);

    const [file, setFile] = useState<null | File>(null);
    const [ws, setWS] = useState<null | WebSocket>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!loggedIn) {
            console.log('Closing connection...');
            ws?.close();
            return;
        }

        setWS(new WebSocket('/ws'));
        console.log('change ws variable', ws);
        if (!ws) return;
        console.log('ws was initialized!');
    }, [loggedIn]);

    const handleMessageReceive = (event: MessageEvent) => {
        try {
            const packet = JSON.parse(event.data);

            const { username, timestamp, message, error_flag } = packet;

            dispatch(
                sliceActions.appendMessage({
                    username,
                    timestamp: new Date(timestamp).toLocaleTimeString(),
                    error: error_flag,
                    message,
                })
            );
        } catch (err) {
            console.error('Ошибка при обработке сообщения:', err);
        }
    };

    useEffect(() => {
        if (!ws) return;

        ws.onopen = () => {
            console.log('Соединение открыто');
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

        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = (reader.result as string).split(',')[1]; // Только данные, без "data:..." префикса

            const message = {
                filename: file.name,
                data: base64Data,
            };

            const payload = {
                username,
                timestamp: Date.now(),
                message,
            };

            ws?.send(JSON.stringify(payload));

            dispatch(
                sliceActions.appendMessage({
                    username,
                    timestamp: new Date().toLocaleTimeString(),
                    message,
                })
            );

            setFile(null);
        };

        reader.readAsDataURL(file);
    };

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
                <Typography sx={{ textAlign: 'center' }} color="secondary.main">
                    8 марта
                </Typography>
                <Box display="flex" flexDirection="column" gap="25px">
                    {messages.map((msg, index) => (
                        <Message key={index} {...msg} />
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
                >
                    отправить
                </Button>
            </Box>
        </Box>
    );
}
