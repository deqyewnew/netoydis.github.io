// app.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const cors = require('cors');

// Загружаем переменные окружения
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// WebSocket соединение
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Пример: отправка сообщения в чат
    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);  // Рассылка сообщения всем подключённым
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
