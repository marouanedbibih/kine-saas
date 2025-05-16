import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UserSeeder } from './user.seeder';
import { KinesitherapeuteSeeder } from './kinesitherapeute.seeder';
import { PatientSeeder } from './patient.seeder';

export class Seeder {
  private readonly dataSource: DataSource;

  constructor(dataSource?: DataSource) {
    this.dataSource = dataSource || AppDataSource;
  }

  /**
   * Run all seeders
   */
  public async seed(): Promise<void> {
    try {
      // Initialize data source if not initialized
      if (!this.dataSource.isInitialized) {
        console.log('📊 Initializing database connection...');
        await this.dataSource.initialize();
        console.log('✅ Database connection established');
      }

      // Start transaction
      try {
        await this.dataSource.transaction(async (entityManager) => {
          // Clean database in reverse order of dependencies
          console.log('🧹 Cleaning database...');
          await new PatientSeeder(entityManager).clean();
          console.log('✅ Patients cleaned');
          await new KinesitherapeuteSeeder(entityManager).clean();
          console.log('✅ Kinesitherapeutes cleaned');
          await new UserSeeder(entityManager).clean();
          console.log('✅ Users cleaned');

          // Seed database in order of dependencies
          console.log('🌱 Starting seed process...');

          // 1. Seed users
          const userSeeder = new UserSeeder(entityManager);
          console.log(`🔄 Running ${userSeeder.getName()}...`);
          await userSeeder.execute();
          console.log(`✅ ${userSeeder.getName()} completed`);

          // 2. Seed kinesitherapeutes
          const kineSeeder = new KinesitherapeuteSeeder(entityManager);
          console.log(`🔄 Running ${kineSeeder.getName()}...`);
          await kineSeeder.execute();
          console.log(`✅ ${kineSeeder.getName()} completed`);

          // 3. Seed patients
          const patientSeeder = new PatientSeeder(entityManager);
          console.log(`🔄 Running ${patientSeeder.getName()}...`);
          try {
            await patientSeeder.execute();
            console.log(`✅ ${patientSeeder.getName()} completed`);
          } catch (error) {
            console.error(`❌ Error in ${patientSeeder.getName()}:`, error);
            if (error instanceof Error) {
              console.error('Stack trace:', error.stack);
            }
            throw error; // Re-throw to roll back transaction
          }
        });
      } catch (error) {
        console.error('❌ Transaction failed, rolling back changes:', error);
        throw error;
      }

      console.log('🎉 All seeds completed successfully!');
    } catch (error) {
      console.error('❌ Error during seed process:', error);
      throw error;
    }
  }
}
