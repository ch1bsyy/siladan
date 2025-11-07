import express from 'express';
import 'dotenv/config';
import swaggerDocs from './swagger/docs.js';
import tiketRoutes from './src/routes/tiketRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tiket', tiketRoutes);

swaggerDocs(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));