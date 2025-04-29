import { Box, Button, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Message from "../Message/Message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Types";
import { ChangeEvent, useEffect, useState } from "react";
import { setMessages } from "../../slices/Slice";
import VisuallyHiddenInput from "../VisuallyHiddenInput/VisuallyHiddenInput";
import { alertActions } from "../../slices/Alert";

export default function Chat() {
    const username = useSelector((state: RootState) => state.slice.username);
    const loggedIn = useSelector((state: RootState) => state.slice.loggedIn);
    const messages = useSelector((state: RootState) => state.slice.messages);

    const [file, setFile] = useState<null | File>(null);
    const [ws, setWS] = useState<null | WebSocket>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("del me: im called");
        if (!loggedIn) {
            console.log("Closing connection...");
            ws?.close();
            return;
        }

        setWS(new WebSocket("ws://localhost:8005"));
        console.log("change ws variable", ws);
        if (!ws) return;
        console.log("ws was initialized!");
    }, [loggedIn]);

    const handleMessageReceive = (event: MessageEvent) => {
        try {
            const data = event.data;

            // Только строка — это JSON
            const message = JSON.parse(data);

            switch (message.type) {
                case "receive": {
                    const {
                        username: author,
                        timestamp,
                        message: text,
                        error_flag,
                    } = message;

                    if (error_flag) {
                        dispatch(
                            setMessages([
                                ...messages,
                                {
                                    author,
                                    timestamp: new Date(
                                        timestamp,
                                    ).toLocaleTimeString(),
                                    error: true,
                                },
                            ]),
                        );
                    } else {
                        dispatch(
                            setMessages([
                                ...messages,
                                {
                                    author,
                                    timestamp: new Date(
                                        timestamp,
                                    ).toLocaleTimeString(),
                                    text,
                                },
                            ]),
                        );
                    }
                    break;
                }

                case "file": {
                    // Декодируем Base64 в Blob
                    const byteString = atob(message.data);
                    const arrayBuffer = new ArrayBuffer(byteString.length);
                    const intArray = new Uint8Array(arrayBuffer);

                    for (let i = 0; i < byteString.length; i++) {
                        intArray[i] = byteString.charCodeAt(i);
                    }

                    const blob = new Blob([intArray], {
                        type: message.mimeType,
                    });
                    const file = new File([blob], message.filename, {
                        type: message.mimeType,
                        lastModified: message.timestamp,
                    });

                    dispatch(
                        setMessages([
                            ...messages,
                            {
                                author: message.username,
                                timestamp: new Date(
                                    message.timestamp,
                                ).toLocaleTimeString(),
                                file,
                            },
                        ]),
                    );

                    break;
                }

                default:
                    console.warn("Неизвестный тип сообщения:", message.type);
            }
        } catch (err) {
            console.error("Ошибка при обработке сообщения:", err);
        }
    };

    useEffect(() => {
        console.log("del me: im called");

        if (!ws) return;

        ws.onopen = () => {
            console.log("Соединение открыто");
            ws.send(
                JSON.stringify({
                    type: "init",
                    username,
                }),
            );
        };

        ws.onmessage = handleMessageReceive;

        ws.onclose = () => {
            console.log("Соединение закрыто");
        };

        ws.onerror = (error) => {
            console.error("Ошибка WebSocket", error);
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
                    title: "Не удалось отправить сообщение",
                    text: "Сообщение пустое",
                }),
            );
            dispatch(alertActions.show());

            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = (reader.result as string).split(",")[1]; // Только данные, без "data:..." префикса

            const payload = {
                type: "file",
                username: username,
                timestamp: Date.now(),
                filename: file.name,
                fileSize: file.size,
                mimeType: file.type,
                data: base64Data, // вот он Base64-кодированный файл
            };

            ws.send(JSON.stringify(payload));

            dispatch(
                setMessages([
                    ...messages,
                    {
                        author: username,
                        timestamp: new Date().toLocaleTimeString(),
                        file: file,
                    },
                ]),
            );

            setFile(null);
        };

        reader.readAsDataURL(file);
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                border: "1px solid",
                borderColor: "primary.main",
            }}
            className="chat"
        >
            <Box padding="20px 50px">
                <Typography sx={{ textAlign: "center" }} color="secondary.main">
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
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                    padding: "0 30px",
                    width: "100%",
                    height: "54px",
                    position: "fixed",
                    bottom: "20px",
                    fontWeight: "800",
                }}
            >
                <Button
                    className="controls__button"
                    variant="contained"
                    role={undefined}
                    component="label"
                    sx={{ flex: "1 1 auto" }}
                    startIcon=<UploadFileIcon />
                >
                    {file ? file.name : "Прикрепить файл"}
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
                    sx={{ flex: "0 1 auto" }}
                    onClick={handleSend}
                >
                    отправить
                </Button>
            </Box>
        </Box>
    );
}
