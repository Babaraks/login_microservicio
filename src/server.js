const express = require('express');
const point_sellRoute = require('./routes/point_sellRoute.js');
const product_pointRoute = require('./routes/product_pointRoute.js');
const point_cashierRoute = require('./routes/point_cashierRoute.js');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use('/point_sell', point_sellRoute);
app.use('/product_point', product_pointRoute);
app.use('/point_cashier', point_cashierRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}   

);