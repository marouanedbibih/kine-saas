# Project Structure

This document explains the folder structure and organization of the KINE-SAAS backend application.

## Root Directory Structure

The KINE-SAAS project is organized with the following structure:

```
KINE-SAAS/
├── apis/               # Backend NestJS application
├── docker/             # Docker configuration files
│   ├── compose.dev.yml
│   ├── compose.yml
│   ├── Dockerfile.api.yml
│   └── ...
├── docs/               # Documentation files
└── web/                # Frontend application
```

## Backend Application Structure

The NestJS backend in the `apis/` folder follows a well-structured modular organization:

```
apis/
├── src/                # Source code
│   ├── app.module.ts   # Root application module
│   ├── main.ts         # Application entry point
│   ├── modules/        # Feature modules
│   ├── users/          # User management
│   ├── auth/           # Authentication
│   ├── config/         # Configuration
│   └── database/       # Database and seeding
├── test/               # Test files
├── package.json        # Project dependencies
└── nest-cli.json       # NestJS CLI configuration
```

## Source Directory (`src/`)

### Root Files

- `main.ts`: Application entry point that bootstraps the NestJS application
- `app.module.ts`: Root module that imports all other modules
- `app.controller.ts`: Basic controller for the root route
- `app.service.ts`: Basic service providing application functionality

### Main Directories

#### `modules/`

The `modules/` directory contains feature modules, each encapsulating related functionality:

```
modules/
├── patient/                   # Patient management module
│   ├── dto/                   # Data Transfer Objects
│   │   ├── create-patient.dto.ts
│   │   └── update-patient.dto.ts
│   ├── patient.controller.ts  # HTTP request handling
│   ├── patient.entity.ts      # TypeORM entity definition
│   ├── patient.module.ts      # Module configuration
│   └── patient.service.ts     # Business logic
├── appointments/              # Appointments module
├── medical-record/            # Medical records module
├── documents/                 # Document management module
├── emergency-contact/         # Emergency contacts module
├── insurance-info/            # Insurance information module
└── ...                        # Other feature modules
```

Each module typically contains:
- **Controllers**: Handle HTTP requests and define routes
- **Services**: Implement business logic
- **Entities**: Define database schemas and relationships
- **DTOs**: Define data transfer objects for validation
- **Module file**: Configure the module and its dependencies

#### `users/`

The `users/` directory handles user management:

```
users/
├── dto/                       # User DTOs
├── entities/                  # User entities
│   └── user.entity.ts         # User entity with roles
├── user.controller.ts         # User endpoints
├── user.module.ts             # User module configuration
├── user.service.ts            # User management logic
└── ...
```

#### `auth/`

The `auth/` directory handles authentication and authorization:

```
auth/
├── dto/                       # Authentication DTOs
├── guards/                    # Auth guards
│   ├── jwt-auth.guard.ts      # JWT authentication guard
│   └── roles.guard.ts         # Role-based access control
├── strategies/                # Passport strategies
│   └── jwt.strategy.ts        # JWT strategy implementation
├── auth.controller.ts         # Auth endpoints
├── auth.module.ts             # Auth module configuration
├── auth.service.ts            # Auth business logic
└── ...
```

#### `config/`

The `config/` directory contains configuration files:

```
config/
├── app.config.ts              # Application configuration
├── database.config.ts         # Database configuration
├── jwt.config.ts              # JWT configuration
└── ...
```

#### `database/`

The `database/` directory contains database-related files:

```
database/
├── data-source.ts             # TypeORM data source configuration
├── migrations/                # Migration files
│   ├── 1620000000000-InitialSchema.ts
│   └── ...
├── seeds/                     # Seed orchestration
│   └── main.seed.ts           # Main seeder class
├── seeders/                   # Entity seeders
│   ├── base.seeder.ts         # Abstract base seeder
│   ├── user.seeder.ts         # User seeder
│   ├── patient.seeder.ts      # Patient seeder
│   └── ...
└── ...
```

### Special Modules

#### `common/`

Contains shared utilities, interceptors, filters, and pipes:

```
common/
├── decorators/                # Custom decorators
│   ├── roles.decorator.ts     # Roles decorator
│   └── ...
├── filters/                   # Exception filters
│   └── http-exception.filter.ts
├── interceptors/              # Interceptors
│   └── transform.interceptor.ts
├── pipes/                     # Custom pipes
└── utils/                     # Utility functions
```

#### `analytics/`

Handles data analysis and reporting:

```
analytics/
├── dto/                       # Analytics DTOs
├── analytics.controller.ts    # Analytics endpoints
├── analytics.module.ts        # Analytics module configuration
├── analytics.service.ts       # Analytics calculations
└── ...
```

## Seeding Architecture

The database seeding system follows a modular, extensible architecture:

```
database/
├── seeds/
│   └── main.seed.ts           # Orchestrates the seeding process
└── seeders/                   # Individual entity seeders
    ├── base.seeder.ts         # Abstract base class for all seeders
    ├── user.seeder.ts         # Seeds user data
    ├── kinesitherapeute.seeder.ts # Seeds kinesitherapeute data
    ├── patient.seeder.ts      # Seeds patient data
    └── ...
```

The seeding system features:
1. A base seeder class defining common functionality
2. Individual seeders implementing entity-specific logic
3. A main orchestration class that runs seeders in the correct order
4. Clean and execute methods in each seeder
5. Transaction support for data integrity

## Application Bootstrap Process

The application bootstrap process occurs in `main.ts`:

1. Create the NestJS application instance
2. Load environment configuration
3. Set up global pipes, filters, and interceptors
4. Configure Swagger documentation
5. Configure CORS and security headers
6. Start the HTTP server

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Load configuration
  const configService = app.get(ConfigService);
  
  // Global prefix (optional)
  app.setGlobalPrefix('api');
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Security setup
  app.use(helmet());
  app.enableCors();
  
  // Swagger documentation
  setupSwagger(app);
  
  // Start server
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}
```

## TypeORM Integration

TypeORM integration is configured in:
- `database/data-source.ts`: For CLI operations and migrations
- `config/database.config.ts`: For the NestJS TypeORM module

Entity files define database schema and relationships using TypeORM decorators:
```typescript
@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;
  
  @ManyToOne(() => Kinesitherapeute, kine => kine.patients)
  @JoinColumn({ name: 'kinesitherapeute_id' })
  kinesitherapeute: Kinesitherapeute;
}
```

## Module Registration

All modules are registered in the root `AppModule`:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database'),
    }),
    UserModule,
    AuthModule,
    PatientModule,
    AppointmentModule,
    // Other modules...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Conclusion

The KINE-SAAS backend follows best practices for NestJS application structure:
- Clear separation of concerns
- Modular architecture
- Domain-driven organization
- Centralized configuration
- Extensible design patterns

This structure enables maintainability, scalability, and ease of development as the project grows.
