require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


app.use('/', authRoutes);



app.listen(PORT, () => {
    console.log(`🚀 Microservicio corriendo en http://localhost:${PORT}`);
});
