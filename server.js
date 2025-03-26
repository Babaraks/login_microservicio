const express = require('express');
const productRoutes = require('./src/routes/productRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/productos', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});