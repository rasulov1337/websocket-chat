const express = require('express');
const http = require('http');

// Импортируем наши WebSocket-серверы
const { createEarthServer } = require('./earth');
const { createMarsServer } = require('./mars');

// Создаем Express-приложение
const app = express();

// Парсим JSON тела запросов
app.use(express.json());

// Создаем HTTP-сервер
const server = http.createServer(app);

// Подключаем наши WebSocket-серверы
createEarthServer(app);
createMarsServer(app);
