import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import protect from './middleware/authenticationMiddleware';
import CustomRequest from './types/CustomRequest.type';
import errorHandler from './middleware/errorHandler';
import { testConnection } from './infra/DatabaseConnection';
import { Veiculo } from './model/Models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/veiculos', require('./routes/veiculo.route'));
app.use('/api/vagas', require('./routes/vaga.route'));

app.get('/protected-route', protect, (req, res) => {
  const user = (req as CustomRequest).user;

  res.send(`Hello ${user.name}`);
});

testConnection();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});