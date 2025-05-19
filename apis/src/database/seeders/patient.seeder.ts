/* eslint-disable prettier/prettier */
import { EntityManager } from 'typeorm';
import { BaseSeeder } from './base.seeder';
import { faker } from '@faker-js/faker';
import { Patient, Gender, MaritalStatus, PreferredContact } from '../../modules/patient/patient.entity';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../modules/users/entities/user.entity';
import { EmergencyContact } from '../../modules/emergency-contact/emergency-contact.entity';

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

    // Get all kinesitherapeute users to associate with patients
    const kinesitherapeutes = await this.entityManager.find(User, {
      where: { role: UserRole.KINESITHERAPEUTE },
    });
    if (kinesitherapeutes.length === 0) {
      throw new Error('No kinesitherapeute users found. Please seed users first.');
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

      // Create patient entity (without emergencyContact)
      const patient = new Patient();
      patient.firstName = firstName;
      patient.middleName = faker.person.middleName();
      patient.lastName = lastName;
      patient.email = email;
      patient.phoneNumber = phone;
      patient.alternativePhoneNumber = generateMoroccanPhone();
      patient.address = address;
      patient.city = city;
      patient.state = faker.location.state();
      patient.zipCode = faker.location.zipCode();
      patient.dateOfBirth = faker.date.birthdate({
        min: 5,
        max: 90,
        mode: 'age',
      });
      patient.gender = faker.helpers.arrayElement([
        Gender.MALE,
        Gender.FEMALE,
        Gender.OTHER,
        Gender.PREFER_NOT_TO_SAY,
      ]);
      patient.maritalStatus = faker.helpers.arrayElement([
        MaritalStatus.SINGLE,
        MaritalStatus.MARRIED,
        MaritalStatus.DIVORCED,
        MaritalStatus.WIDOWED,
        MaritalStatus.SEPARATED,
      ]);
      patient.preferredContact = faker.helpers.arrayElement([
        PreferredContact.PHONE,
        PreferredContact.EMAIL,
        PreferredContact.SMS,
      ]);
      patient.profilePhotoUrl = "";
      patient.kinesitherapeute = randomKine;

      // Save patient first
      await this.entityManager.save(patient);

      // Create emergency contact for this patient
      const emergencyContact = new EmergencyContact();
      emergencyContact.name = faker.person.fullName();
      emergencyContact.relationship = faker.helpers.arrayElement(['Parent', 'Sibling', 'Spouse', 'Friend', 'Other']);
      emergencyContact.phoneNumber = generateMoroccanPhone();
      emergencyContact.email = faker.internet.email();
      emergencyContact.patient = patient;

      // Save emergency contact
      await this.entityManager.save(emergencyContact);

      // Now update patient to set the emergencyContact
      patient.emergencyContact = emergencyContact;
      await this.entityManager.save(patient);

      // Add to patients array
      patients.push(patient);
    }

    // Save all patients
    await this.entityManager.save(patients);
  }
}
