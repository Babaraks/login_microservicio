const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const deliveryRoute = require('./routes/deliveryRoute');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/delivery', deliveryRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);