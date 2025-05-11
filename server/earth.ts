const http = require('http');
const WebSocket = require('ws');

// Хранилище пользователей и кэшированных сообщений
const users = new Map(); // username -> ws

function createEarthServer(app) {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    // Установка WS соединения
    wss.on('connection', (ws) => {
        let username = null;

        // При получении сообщения
        ws.on('message', (rawMessage) => {
            try {
                const message = JSON.parse(rawMessage);

                if (!('message' in message)) {
                    username = message.username;
                    users.set(username, ws);
                    console.log(`Пользователь ${username} подключился`);
                } else {
                    // Отправляем всем, кроме отправителя
                    for (const [user, clientWs] of users.entries()) {
                        if (
                            user !== username &&
                            clientWs.readyState === ws.OPEN
                        ) {
                            clientWs.send(JSON.stringify(message));
                        }
                    }
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
        const { username: fromUser, message, timestamp, error_flag } = req.body;

        const payload = {
            type: 'text',
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
    server.listen(8005, () => {
        console.log('Websocket сервер "Земля" запущен на порту 8005');
    });
}

module.exports = { createEarthServer };
