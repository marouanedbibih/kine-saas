# System Functions

This document describes the core functions of the KINE-SAAS system, organized by functional area.

## User Management

### User Registration
- **Summary**: Create a new user account in the system
- **Role Required**: Admin
- **Related Modules**: `users`, `auth`
- **Related Files**: `users/user.controller.ts`, `users/user.service.ts`, `auth/auth.service.ts`

### User Authentication
- **Summary**: Authenticate users and generate JWT tokens
- **Role Required**: Any
- **Related Modules**: `auth`
- **Related Files**: `auth/auth.controller.ts`, `auth/auth.service.ts`, `auth/strategies/*.ts`

### Password Management
- **Summary**: Reset and change user passwords
- **Role Required**: Any (own password), Admin (any password)
- **Related Modules**: `auth`, `users`
- **Related Files**: `auth/auth.controller.ts`, `auth/auth.service.ts`, `users/user.service.ts`

### User Profile Management
- **Summary**: Update user profile information
- **Role Required**: Any (own profile), Admin (any profile)
- **Related Modules**: `users`
- **Related Files**: `users/user.controller.ts`, `users/user.service.ts`

## Patient Management

### Patient Registration
- **Summary**: Create a new patient record with basic information
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/patient`
- **Related Files**: `modules/patient/patient.controller.ts`, `modules/patient/patient.service.ts`

### Patient Profile Management
- **Summary**: Update patient information and demographics
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/patient`
- **Related Files**: `modules/patient/patient.controller.ts`, `modules/patient/patient.service.ts`

### Patient Search
- **Summary**: Find patients using various criteria (name, email, etc.)
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/patient`
- **Related Files**: `modules/patient/patient.controller.ts`, `modules/patient/patient.service.ts`

### Emergency Contact Management
- **Summary**: Add, update, or remove patient emergency contacts
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/emergency-contact`
- **Related Files**: `modules/emergency-contact/emergency-contact.controller.ts`, `modules/emergency-contact/emergency-contact.service.ts`

### Insurance Information Management
- **Summary**: Add or update patient insurance information
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/insurance-info`
- **Related Files**: `modules/insurance-info/insurance-info.controller.ts`, `modules/insurance-info/insurance-info.service.ts`

## Medical Records

### Medical Record Creation
- **Summary**: Create a new medical record for a patient
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/medical-record`
- **Related Files**: `modules/medical-record/medical-record.controller.ts`, `modules/medical-record/medical-record.service.ts`

### Medical Record Update
- **Summary**: Update patient medical history and information
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/medical-record`
- **Related Files**: `modules/medical-record/medical-record.controller.ts`, `modules/medical-record/medical-record.service.ts`

### Medical Note Addition
- **Summary**: Add clinical notes to patient medical record
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/medical-record`
- **Related Files**: `modules/medical-record/medical-note.controller.ts`, `modules/medical-record/medical-note.service.ts`

### Treatment Plan Management
- **Summary**: Create and update patient treatment plans
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/medical-record`
- **Related Files**: `modules/medical-record/treatment-plan.controller.ts`, `modules/medical-record/treatment-plan.service.ts`

## Appointment Management

### Appointment Scheduling
- **Summary**: Create new appointments for patients
- **Role Required**: Kinesitherapeute, Patient
- **Related Modules**: `appointments`
- **Related Files**: `appointments/appointment.controller.ts`, `appointments/appointment.service.ts`

### Appointment Calendar
- **Summary**: View daily, weekly, or monthly appointment schedules
- **Role Required**: Kinesitherapeute, Patient
- **Related Modules**: `appointments`
- **Related Files**: `appointments/appointment.controller.ts`, `appointments/appointment.service.ts`

### Appointment Rescheduling
- **Summary**: Change date/time of existing appointments
- **Role Required**: Kinesitherapeute, Patient
- **Related Modules**: `appointments`
- **Related Files**: `appointments/appointment.controller.ts`, `appointments/appointment.service.ts`

### Appointment Cancellation
- **Summary**: Cancel scheduled appointments
- **Role Required**: Kinesitherapeute, Patient
- **Related Modules**: `appointments`
- **Related Files**: `appointments/appointment.controller.ts`, `appointments/appointment.service.ts`

## Treatment Sessions

### Session Recording
- **Summary**: Record details of treatment provided during appointments
- **Role Required**: Kinesitherapeute
- **Related Modules**: `appointments`, `sessions`
- **Related Files**: `sessions/treatment-session.controller.ts`, `sessions/treatment-session.service.ts`

### Session Documentation
- **Summary**: Document techniques used, assessments, and outcomes
- **Role Required**: Kinesitherapeute
- **Related Modules**: `sessions`
- **Related Files**: `sessions/treatment-session.controller.ts`, `sessions/treatment-session.service.ts`

### Follow-up Recommendations
- **Summary**: Record recommendations for patient follow-up
- **Role Required**: Kinesitherapeute
- **Related Modules**: `sessions`
- **Related Files**: `sessions/treatment-session.controller.ts`, `sessions/treatment-session.service.ts`

## Document Management

### Document Upload
- **Summary**: Upload medical and consent documents
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/documents`
- **Related Files**: `modules/documents/document.controller.ts`, `modules/documents/document.service.ts`

### Consent Document Management
- **Summary**: Manage patient consent forms and signatures
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/documents`
- **Related Files**: `modules/documents/consent-document.controller.ts`, `modules/documents/consent-document.service.ts`

### Document Signing
- **Summary**: Enable patients to sign consent documents
- **Role Required**: Patient
- **Related Modules**: `modules/documents`
- **Related Files**: `modules/documents/consent-document.controller.ts`, `modules/documents/consent-document.service.ts`

### Document Sharing
- **Summary**: Share documents between authorized parties
- **Role Required**: Kinesitherapeute
- **Related Modules**: `modules/documents`
- **Related Files**: `modules/documents/document.controller.ts`, `modules/documents/document.service.ts`

## Billing and Payments

### Invoice Generation
- **Summary**: Create invoices for services provided
- **Role Required**: Kinesitherapeute
- **Related Modules**: `billing`
- **Related Files**: `billing/invoice.controller.ts`, `billing/invoice.service.ts`

### Payment Processing
- **Summary**: Record payments against invoices
- **Role Required**: Kinesitherapeute
- **Related Modules**: `billing`
- **Related Files**: `billing/payment.controller.ts`, `billing/payment.service.ts`

### Payment History
- **Summary**: View payment status and history
- **Role Required**: Kinesitherapeute, Patient
- **Related Modules**: `billing`
- **Related Files**: `billing/payment.controller.ts`, `billing/payment.service.ts`

## Analytics and Reporting

### Appointment Analytics
- **Summary**: Generate statistics on appointments (completion rates, cancellations, etc.)
- **Role Required**: Kinesitherapeute, Admin
- **Related Modules**: `analytics`
- **Related Files**: `analytics/analytics.controller.ts`, `analytics/appointment-analytics.service.ts`

### Patient Analytics
- **Summary**: Generate statistics on patient demographics and conditions
- **Role Required**: Kinesitherapeute, Admin
- **Related Modules**: `analytics`
- **Related Files**: `analytics/analytics.controller.ts`, `analytics/patient-analytics.service.ts`

### Revenue Analytics
- **Summary**: Generate statistics on billing and revenue
- **Role Required**: Admin
- **Related Modules**: `analytics`
- **Related Files**: `analytics/analytics.controller.ts`, `analytics/revenue-analytics.service.ts`

## System Administration

### Database Seeding
- **Summary**: Populate the database with initial data
- **Role Required**: System process (not user-facing)
- **Related Modules**: `database`
- **Related Files**: `database/seeders/main.seed.ts`, `database/seeders/*.seeder.ts`

### Configuration Management
- **Summary**: Manage system configuration settings
- **Role Required**: Admin
- **Related Modules**: `config`
- **Related Files**: `config/*.config.ts`
