import { EntityManager, EntityTarget } from 'typeorm';

/**
 * Base Seeder class that all module seeders should extend
 */
export abstract class BaseSeeder {
  /**
   * Entity class that this seeder handles
   */
  protected static readonly entityClass: EntityTarget<any>;

  constructor(protected readonly entityManager: EntityManager) {}

  /**
   * Execute the seeder
   */
  abstract execute(): Promise<void>;

  /**
   * Get the name of the seeder for logging purposes
   */
  abstract getName(): string;

  /**
   * Clean data created by this seeder
   */
  abstract clean(): Promise<void>;
  /**
   * Get the entity class that this seeder handles
   */
  getEntityClass(): EntityTarget<any> {
    return (this.constructor as typeof BaseSeeder).entityClass;
  }
}
