import { Box, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Message, { MessageProps } from '../Message/Message';
import { useSelector } from 'react-redux';
import { RootState } from '../../Types';
import { ChangeEvent, useEffect, useState } from 'react';
import VisuallyHiddenInput from '../VisuallyHiddenInput/VisuallyHiddenInput';
import ws from '../../socket';

export default function Chat() {
    const username = useSelector((state: RootState) => state.slice.username);
    const loggedIn = useSelector((state: RootState) => state.slice.loggedIn);
    const [file, setFile] = useState<null | File>(null);
    const [messages, setMessages] = useState<MessageProps[]>([]);

    useEffect(() => {
        return () => {
            // on unmount
        };
    }, []);

    if (loggedIn) {
        ws.onopen = () => {
            console.log('Соединение открыто');
            ws.send(
                JSON.stringify({
                    type: 'init',
                    username,
                })
            );
        };

        ws.onmessage = (event) => {
            const data = event.data;

            // Если это JSON (текстовое сообщение)
            if (typeof data === 'string') {
                try {
                    const message = JSON.parse(data);

                    if (message.type === 'receive') {
                        const {
                            username: author,
                            timestamp,
                            message: text,
                            error_flag,
                        } = message;

                        if (error_flag) {
                            setMessages([
                                ...messages,
                                {
                                    author,
                                    timestamp: new Date(
                                        timestamp
                                    ).toLocaleTimeString(),
                                    error: true,
                                },
                            ]);
                        } else {
                            setMessages((prev) => [
                                ...prev,
                                {
                                    author,
                                    timestamp: new Date(
                                        timestamp
                                    ).toLocaleTimeString(),
                                    text,
                                },
                            ]);
                        }
                    }
                } catch (err) {
                    console.error('Не удалось распарсить JSON:', err);
                }

                return;
            }
        };

        // Если это бинарное сообщение (file)
        if (data instanceof ArrayBuffer) {
            const buffer = new Uint8Array(data);

            // Читаем длину метаданных
            const metaLength = new DataView(buffer.buffer).getUint32(0);

            // Извлекаем метаданные и файл
            const metaBuffer = buffer.slice(4, 4 + metaLength);
            const fileBuffer = buffer.slice(4 + metaLength);

            const metaString = new TextDecoder().decode(metaBuffer);
            const meta = JSON.parse(metaString);

            const fileBlob = new Blob([fileBuffer]);

            const file = new File([fileBlob], meta.filename, {
                type: meta.mimeType,
            });

            setMessages((prev) => [
                ...prev,
                {
                    author: meta.username,
                    timestamp: new Date(meta.timestamp).toLocaleTimeString(),
                    file,
                },
            ]);
        }
    }

    ws.onclose = () => {
        console.log('Соединение закрыто');
    };

    ws.onerror = (error) => {
        console.error('Ошибка WebSocket', error);
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files![0];
        setFile(file);
    };

    const handleSend = async () => {
        if (!file) {
            alert('Add no file check!');
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = (reader.result as string).split(',')[1]; // Только данные, без "data:..." префикса

            const payload = {
                type: 'send-binary',
                username: username,
                timestamp: Date.now(),
                filename: file.name,
                fileSize: file.size,
                mimeType: file.type,
                data: base64Data, // вот он Base64-кодированный файл
            };

            ws.send(JSON.stringify(payload));

            setMessages([
                ...messages,
                {
                    author: username,
                    timestamp: new Date().toLocaleTimeString(),
                    file: file,
                },
            ]);

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
                    {messages.map((msg) => (
                        <Message {...msg} />
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
