import { EntityManager } from 'typeorm';
import { BaseSeeder } from './base.seeder';
import { faker } from '@faker-js/faker';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder extends BaseSeeder {
  protected static readonly entityClass = User;

  constructor(protected readonly entityManager: EntityManager) {
    super(entityManager);
  }

  getName(): string {
    return 'UserSeeder';
  }

  async clean(): Promise<void> {
    await this.entityManager.createQueryBuilder().delete().from(User).execute();
  }

  async execute(): Promise<void> {
    // Configure faker for Moroccan data
    // faker.locale = 'fr'; // Use French locale as a base for Moroccan names

    const hash = async (password: string): Promise<string> => {
      return await bcrypt.hash(password, 10);
    };

    // Create admin users
    const adminUsers: User[] = [];
    for (let i = 1; i <= 2; i++) {
      const admin = new User();
      admin.email = `admin${i}@kine.com`;
      admin.password = await hash('adminpass');
      admin.nom = `AdminNom${i}`;
      admin.prenom = `AdminPrenom${i}`;
      admin.role = UserRole.ADMIN;
      admin.actif = true;

      adminUsers.push(admin);
    }

    await this.entityManager.save(adminUsers);

    // Create kinesitherapeute users
    const kineUsers: User[] = [];
    for (let i = 1; i <= 10; i++) {
      // Generate Moroccan names
      const firstName = faker.helpers.arrayElement([
        'Mohammed',
        'Youssef',
        'Ahmed',
        'Amine',
        'Mehdi',
        'Karim',
        'Omar',
        'Ali',
        'Hamza',
        'Samir',
        'Fatima',
        'Aisha',
        'Laila',
        'Meryem',
        'Nora',
        'Zineb',
        'Sanaa',
        'Loubna',
        'Khadija',
        'Sara',
      ]);

      const lastName = faker.helpers.arrayElement([
        'Alaoui',
        'El Amrani',
        'Bennani',
        'Tahiri',
        'Idrissi',
        'Fassi',
        'Benjelloun',
        'Chaoui',
        'Bouazzaoui',
        'Tazi',
        'Sahli',
        'Haddaoui',
        'Benhaddou',
        'El Mansouri',
        'Lahlou',
      ]);

      const kineUser = new User();
      kineUser.email = `kine${i}@kine.com`;
      kineUser.password = await hash('kinepass');
      kineUser.nom = lastName;
      kineUser.prenom = firstName;
      kineUser.role = UserRole.KINESITHERAPEUTE;
      kineUser.actif = true;

      kineUsers.push(kineUser);
    }

    await this.entityManager.save(kineUsers);

    return;
  }
}
