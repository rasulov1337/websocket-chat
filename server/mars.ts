import {
    InitData,
    isInitData,
    isMessageData,
    MessageData,
    ReceivedData,
    TRANSPORT_LAYER_ADDRESS,
} from './shared';

const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const PORT = 8010;

// Хранилище пользователей и кэшированных сообщений
const users = new Map(); // username -> ws

function createMarsServer(app) {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    // Установка WS соединения
    wss.on('connection', (ws) => {
        let username: null | string = null;

        // При получении сообщения
        ws.on('message', (rawMessage) => {
            try {
                const receivedData = JSON.parse(rawMessage) as ReceivedData;

                // The user has already connected. He wants to send a message
                if (isMessageData(receivedData)) {
                    axios.post(TRANSPORT_LAYER_ADDRESS, receivedData);

                    // Отправляем всем, кроме отправителя
                    for (const [user, clientWs] of users.entries()) {
                        if (
                            user !== username &&
                            clientWs.readyState === ws.OPEN
                        ) {
                            clientWs.send(JSON.stringify(receivedData));
                        }
                    }
                }

                // A user wants to connect
                if (isInitData(receivedData)) {
                    username = receivedData.username;
                    users.set(username, ws);
                    console.log(`Пользователь ${username} подключился`);
                }
            } catch (err) {
                console.error('Ошибка обработки сообщения:', err);
            }
        });

        // На закрытие соединения
        ws.on('close', () => {
            if (username) {
                users.delete(username);
                console.log(`Пользователь ${username} отключился`);
            }
        });
    });

    // POST /receive — получение сообщения с транспортного уровня
    app.post('/receive', (req, res) => {
        if (!isMessageData(req.body)) {
            console.log('Received non message data. Ignoring...');
            return;
        }

        const {
            username: fromUser,
            message,
            timestamp,
            error_flag,
        } = req.body as MessageData;

        const payload = {
            username: fromUser,
            timestamp,
            message,
            error_flag,
        };

        for (const [username, ws] of users.entries()) {
            if (username !== fromUser && ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(payload));
            }
        }

        res.status(200).send('OK');
    });

    // Запуск сервера
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Websocket сервер "Марс" запущен на порту ${PORT}`);
    });
}

module.exports = { createMarsServer };
