import { EntityManager } from 'typeorm';
import { BaseSeeder } from './base.seeder';
import { faker } from '@faker-js/faker';
import { Patient } from '../../modules/patient/patient.entity';
import { Kinesitherapeute } from '../../kinesitherapeute/entities/kinesitherapeute.entity';

export class PatientSeeder extends BaseSeeder {
  protected static readonly entityClass = Patient;

  constructor(protected readonly entityManager: EntityManager) {
    super(entityManager);
  }

  getName(): string {
    return 'PatientSeeder';
  }

  async clean(): Promise<void> {
    await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(Patient)
      .execute();
  }

  async execute(): Promise<void> {
    // Configure faker for Moroccan data
    // faker.setLocale('fr'); // Use French locale as a base for Moroccan names

    // Custom Moroccan phone number generator
    const generateMoroccanPhone = (): string => {
      const prefixes = ['06', '07'];
      const prefix = faker.helpers.arrayElement(prefixes);
      const number = faker.string.numeric(8);
      return `+212${prefix}${number}`;
    };

    // Custom Moroccan city generator
    const getMoroccanCity = (): string => {
      return faker.helpers.arrayElement([
        'Casablanca',
        'Rabat',
        'Marrakech',
        'Fès',
        'Tanger',
        'Agadir',
        'Meknès',
        'Oujda',
        'Kénitra',
        'Tétouan',
        'Safi',
        'El Jadida',
        'Nador',
        'Mohammedia',
        'Béni Mellal',
        'Khémisset',
        'Taza',
      ]);
    };

    // Get all kinesitherapeutes to associate with patients
    const kinesitherapeutes = await this.entityManager.find(Kinesitherapeute, {
      relations: ['user'], // Eagerly load the user relation
    });

    if (kinesitherapeutes.length === 0) {
      throw new Error(
        'No kinesitherapeutes found. Please run the kinesitherapeute seeder first.',
      );
    }

    // Create an array to collect patients
    const patients: Patient[] = [];

    for (let i = 0; i < 50; i++) {
      // Generate Moroccan data
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const city = getMoroccanCity();
      const address = `${faker.location.streetAddress()}, ${city}`;
      const phone = generateMoroccanPhone();
      const email = faker.internet
        .email({ firstName, lastName, provider: 'kine.ma' })
        .toLowerCase();

      // Random kinesitherapeute assignment
      const randomKine = faker.helpers.arrayElement(kinesitherapeutes);

      // Create patient entity
      const patient = new Patient();
      patient.firstName = firstName;
      patient.lastName = lastName;
      patient.email = email;
      patient.phoneNumber = phone;
      patient.address = address;
      patient.dateOfBirth = faker.date.birthdate({
        min: 5,
        max: 90,
        mode: 'age',
      });
      patient.gender = faker.helpers.arrayElement(['Male', 'Female']);
      patient.kinesitherapeute = randomKine;

      // Make sure randomKine.user exists before accessing id
      if (!randomKine.user) {
        console.error(
          `Kinesitherapeute with ID ${randomKine.id} has no associated user!`,
        );
        continue; // Skip this patient and move to the next
      }

      patient.createdByUserId = randomKine.user.id;

      // Add to patients array
      patients.push(patient);
    }

    // Save all patients
    await this.entityManager.save(patients);
  }
}
