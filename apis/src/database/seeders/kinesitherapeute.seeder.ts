// import { EntityManager } from 'typeorm';
// import { BaseSeeder } from './base.seeder';
// import { faker } from '@faker-js/faker';

// export class KinesitherapeuteSeeder extends BaseSeeder {
//   protected static readonly entityClass = Kinesitherapeute;

//   constructor(protected readonly entityManager: EntityManager) {
//     super(entityManager);
//   }

//   getName(): string {
//     return 'KinesitherapeuteSeeder';
//   }

//   async clean(): Promise<void> {
//     await this.entityManager
//       .createQueryBuilder()
//       .delete()
//       .from(Kinesitherapeute)
//       .execute();
//   }

//   async execute(): Promise<void> {
//     // Configure faker for Moroccan data
//     // faker.locale = 'fr'; // Use French locale as a base for Moroccan names

//     // Get all kinesitherapeute users
//     const kineUsers = await this.entityManager.find(User, {
//       where: { role: UserRole.KINESITHERAPEUTE },
//     });

//     if (kineUsers.length === 0) {
//       throw new Error(
//         'No kinesitherapeute users found. Please run the user seeder first.',
//       );
//     }

//     // Create kinesitherapeute profiles
//     const kines: Kinesitherapeute[] = [];
//     for (const user of kineUsers) {
//       const index = kineUsers.indexOf(user) + 1;

//       // Create kinesitherapeute profile
//       const kine = new Kinesitherapeute();
//       kine.user = user;
//       kine.licenseNumber = `KN${new Date().getFullYear()}${String(index).padStart(4, '0')}`;
//       kine.specialisation = faker.helpers.arrayElement([
//         'Orthopédie',
//         'Neurologie',
//         'Sport',
//         'Pédiatrie',
//         'Gériatrie',
//         'Respiratoire',
//         'Rééducation',
//         'Traumatologie',
//       ]);

//       kines.push(kine);
//     }

//     await this.entityManager.save(kines);
//   }
// }
