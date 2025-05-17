import { isMessageData, MessageData } from './shared';

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
        console.log('WS: Connection request received!');
        let username: null | string = null;

        // На закрытие соединения
        ws.on('close', () => {
            console.log('Closing connection with ', username);
            if (username) {
                users.delete(username);
                console.log(`Пользователь ${username} отключился`);
            }
        });
    });

    // POST /receive — получение сообщения с транспортного уровня
    app.post('/receive', (req, res) => {
        console.log('POST /receive was called');

        if (!isMessageData(req.body)) {
            console.log(
                'isMessageData() failed => Received non message data => Ignoring...'
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
                console.log(`Sending message to ${username} ${payload}`);
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
