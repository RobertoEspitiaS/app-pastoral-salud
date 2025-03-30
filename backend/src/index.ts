import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import medicationRoutes from './routes/medication.routes';
import consultationRoutes from './routes/consultation.routes';
import ormConfig from './config/ormconfig';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/medications', medicationRoutes);
app.use('/api/consultations', consultationRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Database connection
const AppDataSource = new DataSource(ormConfig);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Error connecting to the database:', error);
  }); 