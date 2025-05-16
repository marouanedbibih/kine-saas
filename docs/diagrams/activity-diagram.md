# Activity Diagram

This document illustrates the patient onboarding flow using an activity diagram.

## Patient Onboarding Flow

```mermaid
flowchart TD
    start([Start]) --> kineLogin[Kinesitherapeute Login]
    kineLogin --> dashboard[Access Dashboard]
    dashboard --> newPatient[Click "New Patient"]
    
    newPatient --> basicInfo[Enter Basic Patient Information]
    basicInfo --> validateBasic{Validate Basic Information}
    validateBasic -->|Invalid| basicInfo
    validateBasic -->|Valid| contactInfo[Enter Contact Details]
    
    contactInfo --> validateContact{Validate Contact Information}
    validateContact -->|Invalid| contactInfo
    validateContact -->|Valid| medicalHistory[Enter Medical History]
    
    medicalHistory --> validateMedical{Validate Medical Data}
    validateMedical -->|Invalid| medicalHistory
    validateMedical -->|Valid| insuranceInfo[Enter Insurance Information]
    
    insuranceInfo --> hasInsurance{Has Insurance?}
    hasInsurance -->|Yes| validateInsurance{Validate Insurance}
    hasInsurance -->|No| emergencyContacts[Enter Emergency Contacts]
    
    validateInsurance -->|Invalid| insuranceInfo
    validateInsurance -->|Valid| emergencyContacts
    
    emergencyContacts --> validateEmergency{Validate Emergency Contacts}
    validateEmergency -->|Invalid| emergencyContacts
    validateEmergency -->|Valid| consentForms[Present Consent Forms]
    
    consentForms --> needSignature{Needs Immediate Signature?}
    needSignature -->|No| reviewData[Review All Patient Data]
    needSignature -->|Yes| signForms[Patient Signs Forms]
    signForms --> uploadSignatures[Upload Signed Consent Forms]
    uploadSignatures --> reviewData
    
    reviewData --> confirmData{Confirm Data}
    confirmData -->|Revisions Needed| editData[Edit Patient Data]
    editData --> reviewData
    
    confirmData -->|Confirmed| savePatient[Save Patient Record]
    savePatient --> createMedicalRecord[Create Empty Medical Record]
    createMedicalRecord --> linkRecords[Link Patient to Medical Record]
    linkRecords --> scheduleFirst{Schedule First Appointment?}
    
    scheduleFirst -->|Yes| appointmentBooking[Schedule First Appointment]
    scheduleFirst -->|No| completeRegistration[Complete Registration]
    appointmentBooking --> completeRegistration
    
    completeRegistration --> sendWelcome[Send Welcome Email to Patient]
    sendWelcome --> notifyKine[Notify Kinesitherapeute]
    notifyKine --> end([End])
```

## Process Description

1. **Kinesitherapeute Login**: The process begins with the kinesitherapeute logging into the system.

2. **Basic Information Collection**:
   - Enter patient personal details (name, date of birth, gender)
   - System validates the data for completeness and format

3. **Contact Information**:
   - Enter patient contact information (phone, email, address)
   - Validation ensures proper formatting for contact methods

4. **Medical History**:
   - Enter relevant medical history including allergies, conditions, medications
   - System checks for critical information completeness

5. **Insurance Information** (if applicable):
   - Enter insurance provider, policy numbers, coverage dates
   - System validates insurance information format

6. **Emergency Contacts**:
   - Record at least one emergency contact
   - Validate contact information

7. **Consent Forms**:
   - Present required consent forms to patient
   - Optional immediate signature or later follow-up

8. **Review Process**:
   - Kinesitherapeute reviews all entered data
   - Makes any necessary corrections or additions

9. **Record Creation**:
   - System saves patient record
   - Creates associated medical record
   - Links all records together

10. **First Appointment** (optional):
    - Option to immediately schedule first appointment
    - Adds to kinesitherapeute's calendar

11. **Confirmation**:
    - Welcome email sent to patient
    - Notification sent to kinesitherapeute

This process ensures comprehensive patient data collection while maintaining data validation at each step. The system creates all necessary records and linkages between entities for proper patient management.
