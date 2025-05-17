const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

import {
    isInitData,
    isMessageData,
    ReceivedData,
    TRANSPORT_LAYER_ADDRESS,
} from './shared';

const PORT = 8005;

// Хранилище пользователей и кэшированных сообщений
const users = new Map(); // username -> ws

function createEarthServer(app) {
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
                    console.log(`Earth: Пользователь ${username} подключился`);
                }
            } catch (err) {
                console.error('Earth: Ошибка обработки сообщения:', err);
            }
        });

        // На закрытие соединения
        ws.on('close', () => {
            if (username) {
                users.delete(username);
                console.log(`Earth: Пользователь ${username} отключился`);
            }
        });
    });

    // Запуск сервера
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Earth: Websocket сервер "Земля" запущен на порту ${PORT}`);
    });
}

module.exports = { createEarthServer };
