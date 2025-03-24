require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const cashierRoutes = require('./routes/cashierRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.use('/auth', authRoutes);
app.use('/usuario', userRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Microservicio corriendo en http://localhost:${PORT}`);
});
