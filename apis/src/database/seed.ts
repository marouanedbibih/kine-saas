/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { User, UserRole } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Kinesitherapeute } from '../kinesitherapeute/entities/kinesitherapeute.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';

// Set French locale for more realistic Moroccan names
// faker.locale = 'fr';

/**
 * Cleans the database by deleting all records in the correct order
 */
async function cleanDatabase() {
  try {
    console.log('🧹 Cleaning database...');
    
    const patientRepo = AppDataSource.getRepository(Patient);
    const kineRepo = AppDataSource.getRepository(Kinesitherapeute);
    const userRepo = AppDataSource.getRepository(User);

    // Delete in correct order to respect foreign key constraints
    await patientRepo.createQueryBuilder().delete().execute();
    await kineRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();

    console.log('✅ Database cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
}

/**
 * Seeds the database with users, kinesitherapeutes, and patients
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('📊 Database connection initialized');
    }

    // Clean existing data
    await cleanDatabase();

    const userRepo = AppDataSource.getRepository(User);
    const kineRepo = AppDataSource.getRepository(Kinesitherapeute);
    const patientRepo = AppDataSource.getRepository(Patient);

    const hash = async (pwd: string) => await bcrypt.hash(pwd, 10);

    // Step 1: Create admin users
    console.log('👨‍💼 Creating admin users...');
    const adminUsers: User[] = [];
    for (let i = 1; i <= 2; i++) {
      adminUsers.push(
        userRepo.create({
          email: `admin${i}@kine.com`,
          password: await hash('adminpass'),
          nom: `AdminNom${i}`,
          prenom: `AdminPrenom${i}`,
          role: UserRole.ADMIN,
        }),
      );
    }
    await userRepo.save(adminUsers);
    console.log(`✅ Created ${adminUsers.length} admin users`);

    // Step 2: Create kinesitherapeute users and profiles
    console.log('🏥 Creating kinesitherapeutes...');
    const kines: Kinesitherapeute[] = [];
    
    for (let i = 1; i <= 10; i++) {
      // Create kine user
      const kineUser = await userRepo.save(
        userRepo.create({
          email: `kine${i}@kine.com`,
          password: await hash('kinepass'),
          nom: faker.person.lastName(),
          prenom: faker.person.firstName(),
          role: UserRole.KINESITHERAPEUTE,
        })
      );
      
      // Create kine profile
      kines.push(
        kineRepo.create({
          user: kineUser,
          licenseNumber: `KN${new Date().getFullYear()}${i.toString().padStart(4, '0')}`,
          specialisation: faker.helpers.arrayElement([
            'Orthopédie', 
            'Neurologie', 
            'Sport', 
            'Pédiatrie', 
            'Gériatrie', 
            'Respiratoire'
          ]),
        })
      );
    }
    
    const savedKines = await kineRepo.save(kines);
    console.log(`✅ Created ${savedKines.length} kinesitherapeutes`);

    // Step 3: Create patients and assign them to kinesitherapeutes
    console.log('👨‍👩‍👧‍👦 Creating patients and assigning to kinesitherapeutes...');
    const patients: Patient[] = [];
    
    for (let i = 1; i <= 50; i++) {
      // Randomly select a kinesitherapeute
      const randomKine = savedKines[Math.floor(Math.random() * savedKines.length)];
      
      // Create patient with assigned kinesitherapeute (updated to match new entity)
      patients.push(
        patientRepo.create({
          numeroPatient: `PAT2025${i.toString().padStart(4, '0')}`,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          telephone: faker.phone.number(),
          adresse: `${faker.location.streetAddress()}, ${faker.location.city()}`,
          dateNaissance: faker.date.birthdate({ min: 5, max: 90, mode: 'age' }),
          contactUrgence: faker.phone.number(),
          kinesitherapeute: randomKine,
        })
      );
    }
    
    const savedPatients = await patientRepo.save(patients);
    console.log(`✅ Created ${savedPatients.length} patients`);

    // Step 4: Generate statistics
    console.log('\n📊 Seeding Statistics:');
    console.log(`✅ Admins: ${adminUsers.length}`);
    console.log(`✅ Kinesitherapeutes: ${savedKines.length}`);
    console.log(`✅ Patients: ${savedPatients.length}`);
    
    // Calculate patients per kine
    const patientDistribution = {};
    for (const kine of savedKines) {
      const patientCount = await patientRepo.count({
        where: { kinesitherapeute: { id: kine.id } }
      });
      patientDistribution[`${kine.user.prenom} ${kine.user.nom}`] = patientCount;
    }
    
    console.log('\n👥 Patients per Kinesitherapeute:');
    Object.entries(patientDistribution).forEach(([kineName, count]) => {
      console.log(`   - ${kineName}: ${count} patients`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    // Always close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('📊 Database connection closed');
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    await seedDatabase();
    console.log('🎉 All done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export { seedDatabase, cleanDatabase };