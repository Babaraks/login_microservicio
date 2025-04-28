// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

// Este objeto guardará la relación userId -> socketId
const usuariosConectados = {};

// Hacemos disponibles io y el mapa desde req.app
app.set('socketio', io);
app.set('usuariosConectados', usuariosConectados);

// Socket.IO: registrar y limpiar conexiones
io.on('connection', socket => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // 1) Escucha cuando el cliente te dice "este soy yo"
  socket.on('registrarUsuario', (userId) => {
    usuariosConectados[userId] = socket.id;
    console.log(`✅ Usuario ${userId} mapeado a socket ${socket.id}`);
  });

  // 2) Limpia el mapa al desconectarse
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
    // Busca el userId que tenía este socket.id y elimínalo
    for (const [userId, sId] of Object.entries(usuariosConectados)) {
      if (sId === socket.id) {
        delete usuariosConectados[userId];
        console.log(`🗑️ Mapeo eliminado para usuario ${userId}`);
        break;
      }
    }
  });
});

// Monta tus rutas aquí (por ejemplo, /order ...)
const orderRoutes = require('./routes/orderRoute');
app.use('/order', orderRoutes);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
