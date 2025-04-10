const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const sellRoutes = require('./routes/sellRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/sell', sellRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Microservicio corriendo en http://localhost:${PORT}`);
});


