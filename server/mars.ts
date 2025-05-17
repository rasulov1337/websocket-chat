import { isMessageData, MessageData, isInitData, InitData } from './shared';

const http = require('http');
const WebSocket = require('ws');

const PORT = 8011;

// Хранилище пользователей и кэшированных сообщений
const users = new Map(); // username -> ws

function createMarsServer(app) {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    // Установка WS соединения
    wss.on('connection', (ws) => {
        console.log('Mars: Connection request received!');
        let username: null | string = null;

        // При получении сообщения
        ws.on('message', (rawMessage) => {
            let username: null | string = null;

            try {
                const receivedData = JSON.parse(rawMessage) as InitData;

                // A user wants to connect
                if (isInitData(receivedData)) {
                    username = receivedData.username;
                    users.set(username, ws);
                    console.log(`Mars: Пользователь ${username} подключился`);
                }
            } catch (err) {
                console.error('Mars: Ошибка обработки сообщения:', err);
            }
        });

        // На закрытие соединения
        ws.on('close', () => {
            console.log('Mars: Closing connection with ', username);
            if (username) {
                users.delete(username);
                console.log(`Mars: Пользователь ${username} отключился`);
            }
        });
    });

    // POST /receive — получение сообщения с транспортного уровня
    app.post('/receive', (req, res) => {
        console.log('Mars: POST /receive was called');

        if (!isMessageData(req.body)) {
            console.log(
                'Mars: isMessageData() failed => Received non message data => Ignoring...'
            );
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
                console.log(`Mars: Sending message to ${username} ${payload}`);
                ws.send(JSON.stringify(payload));
            }
        }

        res.status(200).send('OK');
    });

    // Запуск сервера
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Mars: Websocket сервер "Марс" запущен на порту ${PORT}`);
    });
}

module.exports = { createMarsServer };
