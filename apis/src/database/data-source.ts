import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Import all entities explicitly
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Kinesitherapeute } from '../practitioners/entities/kinesitherapeute.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT!, 10) || 5433,
  username: process.env.DB_USERNAME || 'kine_user',
  password: process.env.DB_PASSWORD || 'kine_password',
  database: process.env.DB_NAME || 'kine_db',
  entities: [
    User,
    Patient,
    Kinesitherapeute,
    // RendezVous,
    // Seance,
    // Facture,
    // Paiement,
    // Exercice,
    // DossierMedical,
    // Add other entities here
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
