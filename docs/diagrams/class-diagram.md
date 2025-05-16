# Class Diagram

This document provides a UML class diagram representing the main entities in the KINE-SAAS system.

## Entity Relationships

```mermaid
classDiagram
    User <|-- Admin
    User <|-- Kinesitherapeute
    Kinesitherapeute "1" -- "0..*" Patient : manages
    Patient "1" -- "0..*" Appointment : schedules
    Patient "1" -- "1" MedicalRecord : has
    Patient "1" -- "0..*" InsuranceInfo : has
    Patient "1" -- "0..*" EmergencyContact : has
    Patient "1" -- "0..*" ConsentDocument : signs
    Kinesitherapeute "1" -- "0..*" Appointment : conducts
    Appointment "0..*" -- "0..*" TreatmentSession : includes
    MedicalRecord "1" -- "0..*" TreatmentPlan : contains
    MedicalRecord "1" -- "0..*" MedicalNote : contains
    Payment "1" -- "1..*" Invoice : settles
    Appointment "1" -- "0..1" Invoice : generates
    
    class User {
        +id: uuid
        +email: string
        +password: string
        +nom: string
        +prenom: string
        +role: UserRole
        +actif: boolean
        +createdAt: Date
        +updatedAt: Date
        +validatePassword(password: string): boolean
    }
    
    class Admin {
        +dashboardAccess: boolean
        +adminLevel: number
    }
    
    class Kinesitherapeute {
        +id: uuid
        +user: User
        +licenseNumber: string
        +specialisation: string
        +patients: Patient[]
        +appointments: Appointment[]
    }
    
    class Patient {
        +id: uuid
        +firstName: string
        +lastName: string
        +email: string
        +dateOfBirth: Date
        +gender: string
        +phoneNumber: string
        +address: string
        +profilePhotoUrl: string
        +createdByUserId: string
        +kinesitherapeute: Kinesitherapeute
        +medicalRecord: MedicalRecord
        +insuranceInfo: InsuranceInfo
        +emergencyContacts: EmergencyContact[]
        +consentDocuments: ConsentDocument[]
        +createdAt: Date
        +updatedAt: Date
    }
    
    class MedicalRecord {
        +id: uuid
        +patient: Patient
        +allergies: string
        +chronicConditions: string
        +currentMedications: string
        +pastSurgeries: string
        +familyMedicalHistory: string
        +treatmentPlans: TreatmentPlan[]
        +notes: MedicalNote[]
        +createdAt: Date
        +updatedAt: Date
    }
    
    class EmergencyContact {
        +id: uuid
        +patient: Patient
        +name: string
        +relationship: string
        +phoneNumber: string
        +email: string
        +isPrimary: boolean
    }
    
    class InsuranceInfo {
        +id: uuid
        +patient: Patient
        +provider: string
        +policyNumber: string
        +groupNumber: string
        +coverageStartDate: Date
        +coverageEndDate: Date
        +insuranceCardImageUrl: string
    }
    
    class Appointment {
        +id: uuid
        +patient: Patient
        +kinesitherapeute: Kinesitherapeute
        +date: Date
        +startTime: Date
        +endTime: Date
        +status: string
        +type: string
        +notes: string
        +cancelReason: string
        +invoice: Invoice
        +treatmentSessions: TreatmentSession[]
        +createdAt: Date
        +updatedAt: Date
    }
    
    class TreatmentSession {
        +id: uuid
        +appointment: Appointment
        +description: string
        +duration: number
        +assessment: string
        +techniques: string[]
        +outcome: string
        +followUpRecommendations: string
        +createdAt: Date
        +updatedAt: Date
    }
    
    class TreatmentPlan {
        +id: uuid
        +medicalRecord: MedicalRecord
        +title: string
        +description: string
        +startDate: Date
        +endDate: Date
        +goals: string[]
        +exercises: string[]
        +recommendations: string
        +createdAt: Date
        +updatedAt: Date
    }
    
    class MedicalNote {
        +id: uuid
        +medicalRecord: MedicalRecord
        +title: string
        +content: string
        +createdBy: string
        +createdAt: Date
        +updatedAt: Date
    }
    
    class ConsentDocument {
        +id: uuid
        +patient: Patient
        +title: string
        +description: string
        +fileUrl: string
        +signed: boolean
        +signedAt: Date
        +expiresAt: Date
        +createdAt: Date
        +updatedAt: Date
    }
    
    class Invoice {
        +id: uuid
        +appointment: Appointment
        +amount: number
        +description: string
        +status: string
        +dueDate: Date
        +payment: Payment
        +createdAt: Date
        +updatedAt: Date
    }
    
    class Payment {
        +id: uuid
        +amount: number
        +method: string
        +status: string
        +transactionId: string
        +invoices: Invoice[]
        +paidAt: Date
        +createdAt: Date
        +updatedAt: Date
    }
```

## Entity Descriptions

### User
Base user entity with authentication information and common fields.

### Admin
Administrative users with system management privileges.

### Kinesitherapeute
Healthcare professionals providing kinesiotherapy services.

### Patient
Individuals receiving treatment from kinesitherapeutes.

### MedicalRecord
Patient medical history and information.

### EmergencyContact
Contact information for patient emergencies.

### InsuranceInfo
Patient insurance details.

### Appointment
Scheduled sessions between patients and kinesitherapeutes.

### TreatmentSession
Detailed records of treatment provided during appointments.

### TreatmentPlan
Structured plan for patient recovery.

### MedicalNote
Clinical notes about patient condition and progress.

### ConsentDocument
Patient-signed documents for legal consent.

### Invoice
Billing information for services provided.

### Payment
Financial transaction records.
