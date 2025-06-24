/**
 * Represents a patient in the system
 */
export interface Patient {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  fullName?: string | null;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  altPhone?: string | null;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail?: string | null;
  emergencyContactRelation: string;
  profilePhotoUrl?: string | null;
  cabinet: Cabinet;
}

/**
 * Patient gender options
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NOT_SPECIFIED = 'NOT_SPECIFIED',
}

/**
 * Represents a medical cabinet/clinic
 */
export interface Cabinet {
  id: string;
  name: string;
}

/**
 * Patient request object for creating/updating patients
 */
export interface PatientRequest {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  altPhone?: string | null;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail?: string | null;
  emergencyContactRelation: string;
  profilePhotoUrl?: string | null;
  cabinetId: string;
}

/**
 * Maps a Patient to a PatientRequest for editing
 * @param patient The patient data to convert to a request
 * @returns A PatientRequest object
 */
export function patientToRequest(patient: Patient): PatientRequest {
  return {
    firstName: patient.firstName,
    middleName: patient.middleName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    address: patient.address,
    city: patient.city,
    state: patient.state,
    zipCode: patient.zipCode,
    phone: patient.phone,
    altPhone: patient.altPhone,
    email: patient.email,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    emergencyContactEmail: patient.emergencyContactEmail,
    emergencyContactRelation: patient.emergencyContactRelation,
    profilePhotoUrl: patient.profilePhotoUrl,
    cabinetId: patient.cabinet.id
  };
}

/**
 * Formats patient name consistently
 * @param patient The patient
 * @returns Formatted full name
 */
export function formatPatientName(patient: Patient): string {
  if (patient.fullName) {
    return patient.fullName;
  }
  
  return patient.middleName 
    ? `${patient.lastName} ${patient.firstName} ${patient.middleName}`
    : `${patient.lastName} ${patient.firstName}`;
}

/**
 * Calculate patient age from date of birth
 * @param patient The patient
 * @returns Age in years
 */
export function calculateAge(patient: Patient): number {
  const birthDate = new Date(patient.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}