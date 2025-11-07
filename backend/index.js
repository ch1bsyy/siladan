import express from 'express';
import 'dotenv/config'; // otomatis memuat .env
import tiketRoutes from './src/routes/tiketRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tiket', tiketRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));