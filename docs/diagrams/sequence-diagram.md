# Sequence Diagrams

This document contains sequence diagrams illustrating key processes in the KINE-SAAS system.

## Register Patient Sequence

This diagram shows the process of registering a new patient in the system.

```mermaid
sequenceDiagram
    actor K as Kinesitherapeute
    participant UI as Frontend
    participant API as PatientController
    participant SVC as PatientService
    participant AUTH as AuthGuard
    participant DB as Database
    
    K->>UI: Fill patient registration form
    UI->>API: POST /patients
    API->>AUTH: Validate token & kine role
    AUTH-->>API: Valid credentials
    
    API->>SVC: createPatient(patientDto)
    SVC->>SVC: Validate patient data
    SVC->>DB: Check for duplicate email
    DB-->>SVC: No duplicates found
    
    SVC->>DB: Save patient record
    DB-->>SVC: Return saved patient
    
    alt Patient has insurance
        SVC->>DB: Save insurance information
        DB-->>SVC: Return saved insurance info
    end
    
    alt Emergency contacts provided
        SVC->>DB: Save emergency contacts
        DB-->>SVC: Return saved contacts
    end
    
    SVC->>DB: Create empty medical record
    DB-->>SVC: Return created medical record
    
    SVC-->>API: Return patient with relations
    API-->>UI: Return 201 Created with patient
    UI-->>K: Show success message & patient details
```

## Schedule Consultation Sequence

This diagram illustrates the process of scheduling a consultation/appointment.

```mermaid
sequenceDiagram
    actor User as User (Kine/Patient)
    participant UI as Frontend
    participant API as AppointmentController
    participant ASVC as AppointmentService
    participant PSVC as PatientService
    participant KSVC as KineService
    participant AUTH as AuthGuard
    participant DB as Database
    
    User->>UI: Access appointment scheduling
    UI->>API: GET /appointments/availability?kineId=X&date=Y
    API->>AUTH: Validate token & permissions
    AUTH-->>API: Valid credentials
    
    API->>ASVC: getAvailability(kineId, date)
    ASVC->>KSVC: getKineSchedule(kineId, date)
    KSVC->>DB: Query kine schedule
    DB-->>KSVC: Return schedule data
    KSVC-->>ASVC: Return available slots
    ASVC-->>API: Return available time slots
    API-->>UI: Display available slots
    
    User->>UI: Select time slot & provide details
    UI->>API: POST /appointments
    API->>AUTH: Validate token & permissions
    AUTH-->>API: Valid credentials
    
    API->>ASVC: createAppointment(appointmentDto)
    ASVC->>PSVC: getPatient(patientId)
    PSVC->>DB: Query patient data
    DB-->>PSVC: Return patient
    PSVC-->>ASVC: Return patient data
    
    ASVC->>KSVC: getKinesitherapeute(kineId)
    KSVC->>DB: Query kine data
    DB-->>KSVC: Return kine
    KSVC-->>ASVC: Return kine data
    
    ASVC->>ASVC: Validate appointment data
    ASVC->>DB: Check for scheduling conflicts
    DB-->>ASVC: No conflicts found
    
    ASVC->>DB: Save appointment
    DB-->>ASVC: Return created appointment
    
    alt Notification enabled
        ASVC->>ASVC: Send appointment notifications
    end
    
    ASVC-->>API: Return created appointment
    API-->>UI: Return 201 Created with appointment details
    UI-->>User: Show confirmation & details
```

These diagrams represent the core workflow for the specified processes in the KINE-SAAS system. They show the interaction between users, the frontend, backend services, and the database.
