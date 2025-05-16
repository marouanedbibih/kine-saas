# KINE SaaS

## About

KINE SaaS is a comprehensive platform for kinesitherapeutes to manage patients, appointments, medical records, and billing.

## Documentation

For detailed documentation about the project, including architecture, API endpoints, and functionality, please refer to the [docs/README.md](docs/README.md) file.

## Project Structure

This project is organized into the following main components:

- `/apis` - Backend NestJS application
- `/web` - Frontend application
- `/docker` - Docker configuration files
- `/docs` - Project documentation

## Getting Started

Please refer to the appropriate documentation for setup and development instructions:

- [Backend Development Guide](docs/architecture/backend-architecture.md)
- [API Documentation](docs/api/api-docs.md) 

## Architecture

The application follows a modern full-stack architecture:

- TypeScript-based NestJS backend
- RESTful API design
- PostgreSQL database with TypeORM
- Role-based access control (admin, kinesitherapeute, patient)
- Comprehensive seeding system for development
