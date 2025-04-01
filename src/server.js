const express = require('express');
const userRoutes = require('./routes/userRoutes');

const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Servidor corriendo en el puerto ${PORT}`));
