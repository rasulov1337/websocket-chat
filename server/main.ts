const express = require('express');
const http = require('http');

// Импортируем наши WebSocket-серверы
const { createEarthServer } = require('./earth');

// Создаем Express-приложение
const app = express();

// Парсим JSON тела запросов
app.use(express.json());

// Создаем HTTP-сервер
const server = http.createServer(app);

// Подключаем наши WebSocket-серверы
createEarthServer(app);

// Простой эндпоинт для проверки
app.get('/', (req, res) => {
    res.send(`
        <h1>🚀 Сервер межпланетного чата</h1>
        <p>WebSocket серверы:</p>
        <ul>
            <li>📡 Земля: ws://0.0.0.0:8005</li>
            <li>🪐 Марс: ws://0.0.0.0:8010</li>
        </ul>
    `);
});

// Запускаем сервер на порту 3000
const PORT = 8055;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 HTTP API сервер запущен на http://localhost:${PORT}`);
});
