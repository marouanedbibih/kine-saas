# API Documentation

This document provides an overview of the main API endpoints in the KINE-SAAS system.

For interactive API documentation, you can access the Swagger UI at `/api/docs` when the application is running.

For information on how to use and maintain Swagger documentation in this project, please refer to the [Swagger Integration Guide](./swagger-guide.md).

## Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Authenticate user and receive JWT token |
| `/auth/register` | POST | Register a new user (admin only) |
| `/auth/refresh-token` | POST | Refresh JWT token |
| `/auth/forgot-password` | POST | Initiate password reset process |
| `/auth/reset-password` | POST | Complete password reset with token |
| `/auth/me` | GET | Get current authenticated user information |

## User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users` | GET | Get all users (admin only) |
| `/users/:id` | GET | Get user by ID |
| `/users/:id` | PATCH | Update user information |
| `/users/:id` | DELETE | Deactivate user account |
| `/users/:id/activate` | PATCH | Activate user account (admin only) |
| `/users/:id/change-password` | PATCH | Change user password |
| `/users/:id/change-role` | PATCH | Change user role (admin only) |

## Patient Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/patients` | GET | Get all patients (filtered by kine for non-admin) |
| `/patients` | POST | Create new patient |
| `/patients/:id` | GET | Get patient details by ID |
| `/patients/:id` | PATCH | Update patient information |
| `/patients/:id` | DELETE | Delete patient record |
| `/patients/search` | GET | Search patients by name, email, etc. |
| `/patients/:id/medical-record` | GET | Get patient's medical record |
| `/patients/:id/appointments` | GET | Get patient's appointments |
| `/patients/:id/documents` | GET | Get patient's documents |

## Kinesitherapeute Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/kinesitherapeutes` | GET | Get all kinesitherapeutes |
| `/kinesitherapeutes` | POST | Create new kinesitherapeute profile |
| `/kinesitherapeutes/:id` | GET | Get kinesitherapeute details by ID |
| `/kinesitherapeutes/:id` | PATCH | Update kinesitherapeute information |
| `/kinesitherapeutes/:id` | DELETE | Delete kinesitherapeute profile |
| `/kinesitherapeutes/:id/patients` | GET | Get kinesitherapeute's patients |
| `/kinesitherapeutes/:id/appointments` | GET | Get kinesitherapeute's appointments |
| `/kinesitherapeutes/:id/availability` | GET | Get kinesitherapeute's availability |

## Appointment Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/appointments` | GET | Get all appointments (filtered by user role) |
| `/appointments` | POST | Create new appointment |
| `/appointments/:id` | GET | Get appointment details by ID |
| `/appointments/:id` | PATCH | Update appointment information |
| `/appointments/:id` | DELETE | Delete/cancel appointment |
| `/appointments/date/:date` | GET | Get appointments for specific date |
| `/appointments/status/:status` | GET | Get appointments by status |
| `/appointments/:id/confirm` | PATCH | Confirm appointment |
| `/appointments/:id/cancel` | PATCH | Cancel appointment |
| `/appointments/:id/reschedule` | PATCH | Reschedule appointment |

## Medical Records

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/medical-records/:id` | GET | Get medical record by ID |
| `/medical-records/:id` | PATCH | Update medical record |
| `/medical-records/:id/notes` | GET | Get medical record notes |
| `/medical-records/:id/notes` | POST | Add note to medical record |
| `/medical-records/:id/treatment-plans` | GET | Get treatment plans |
| `/medical-records/:id/treatment-plans` | POST | Add treatment plan |

## Treatment Sessions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/treatment-sessions` | POST | Create new treatment session |
| `/treatment-sessions/:id` | GET | Get treatment session details |
| `/treatment-sessions/:id` | PATCH | Update treatment session |
| `/treatment-sessions/:id` | DELETE | Delete treatment session |
| `/appointments/:id/sessions` | GET | Get sessions for appointment |

## Documents

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents` | POST | Upload new document |
| `/documents/:id` | GET | Get document by ID |
| `/documents/:id` | DELETE | Delete document |
| `/documents/:id/download` | GET | Download document file |
| `/documents/:id/sign` | POST | Sign document |
| `/patients/:id/documents` | GET | Get patient's documents |
| `/documents/types` | GET | Get available document types |

## Billing

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/invoices` | GET | Get all invoices (filtered by user role) |
| `/invoices` | POST | Create new invoice |
| `/invoices/:id` | GET | Get invoice details |
| `/invoices/:id` | PATCH | Update invoice |
| `/invoices/:id/pay` | POST | Record payment for invoice |
| `/invoices/:id/status` | PATCH | Update invoice status |
| `/payments` | GET | Get all payments |
| `/payments/:id` | GET | Get payment details |

## Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analytics/appointments` | GET | Get appointment statistics |
| `/analytics/patients` | GET | Get patient statistics |
| `/analytics/revenue` | GET | Get revenue statistics |
| `/analytics/dashboard` | GET | Get dashboard overview data |

## Notes

1. All endpoints require authentication unless explicitly stated otherwise.
2. Most endpoints respect role-based access control:
   - Admin: Full access to all endpoints
   - Kinesitherapeute: Access to their patients and related data
   - Patient: Access to their own data only

3. Query parameters for GET endpoints usually include:
   - `page` and `limit` for pagination
   - `sort` for sorting results
   - Various filters specific to the endpoint
