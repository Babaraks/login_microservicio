const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');

dotenv.config();
const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Rutas de usuario
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Servidor corriendo en el puerto ${PORT}`));
