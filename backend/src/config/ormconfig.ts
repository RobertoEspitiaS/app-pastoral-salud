import { DataSourceOptions } from 'typeorm';
import { Medication } from '../entities/Medication';
import { Consultation } from '../entities/Consultation';
import { PrescriptionItem } from '../entities/PrescriptionItem';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'pastoral_salud',
  entities: [Medication, Consultation, PrescriptionItem],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  ssl: false,
};

export default config; 