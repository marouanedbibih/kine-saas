import { IPaginationMeta } from ".";

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer-not-to-say'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

export enum BloodType {
  A_POSITIVE = 'a_positive',
  A_NEGATIVE = 'a_negative',
  B_POSITIVE = 'b_positive',
  B_NEGATIVE = 'b_negative',
  AB_POSITIVE = 'ab_positive',
  AB_NEGATIVE = 'ab_negative',
  O_POSITIVE = 'o_positive',
  O_NEGATIVE = 'o_negative',
  UNKNOWN = 'unknown',
}

export enum PreferredContact {
  PHONE = 'phone',
  EMAIL = 'email',
  SMS = 'sms',
}

export interface CreatePatientDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  preferredContact?: PreferredContact;
  gender: Gender;
  dateOfBirth: string; // 'YYYY-MM-DD'
  maritalStatus?: MaritalStatus;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  kinesitherapeuteId?: string;
  emergencyContact?: {
    id?: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  };
  medicalRecord?: {
    bloodType?: BloodType;
    height?: number; // in cm
    weight?: number; // in kg
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    smokingStatus?: string;
    alcoholConsumption?: string;
    exerciseFrequency?: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    primaryInsuredName: string;
    relationship?: string;
    validUntil?: string;
    insurancePhone?: string;
    secondaryProvider?: string;
    secondaryPolicyNumber?: string;
    secondaryGroupNumber?: string;
  };
}

export interface UpdatePatientDto {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  alternativePhoneNumber?: string;
  preferredContact?: PreferredContact;
  gender?: Gender;
  dateOfBirth?: string; // 'YYYY-MM-DD'
  maritalStatus?: MaritalStatus;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  kinesitherapeuteId?: string;
  emergencyContact?: {
    id?: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  };
  medicalRecord?: {
    bloodType?: BloodType;
    height?: number;
    weight?: number;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    smokingStatus?: string;
    alcoholConsumption?: string;
    exerciseFrequency?: string;
  };
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
    primaryInsuredName?: string;
    relationship?: string;
    validUntil?: string;
    insurancePhone?: string;
    secondaryProvider?: string;
    secondaryPolicyNumber?: string;
    secondaryGroupNumber?: string;
  };
}

export interface KineInfo {
  id: string;
  licenseNumber: string;
  firstName: string;
  lastName: string;
}

// export interface PatientResponseDto {
//   id: string;
//   numeroPatient: string;
//   firstName: string;
//   lastName: string;
//   telephone: string;
//   adresse: string;
//   dateNaissance: string | null; // ISO string
//   contactUrgence: string;
//   kinesitherapeute: KineInfo | null;
//   createdAt: string;
//   updatedAt: string;
// }

export interface QueryPatientsDto {
  page?: number;
  limit?: number;
  search?: string;
  kinesitherapeuteId?: string;
}

export interface PaginatedPatientsResponse {
  data: PatientResponseDto[];
  total: number;
  page: number;
  limit: number;
}


export interface KineInfo {
  id: string;
  licenseNumber: string;
  firstName: string;
  lastName: string;
}

export interface PatientResponseDto {
  id: string;
  numeroPatient?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  preferredContact?: PreferredContact;
  gender: Gender;
  dateOfBirth: string | null; // Format: 'YYYY-MM-DD'
  maritalStatus?: MaritalStatus;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePhotoUrl?: string;
  active: boolean;
  kinesitherapeute: KineInfo | null;
  createdByUserId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  
  // Nested related entities
  medicalRecord?: {
    id: string;
    bloodType?: BloodType;
    height?: number; // in cm
    weight?: number; // in kg
    allergies?: string;
    medicalHistory?: string;
    chronicConditions?: string;
    currentMedications?: string;
    previousTreatments?: string;
    diagnosisNotes?: string;
    treatmentPlan?: string;
    smokingStatus?: string;
    alcoholConsumption?: string;
    exerciseFrequency?: string;
    dietaryHabits?: string;
  };

  insuranceInfo?: {
    id: string;
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    primaryInsuredName: string;
    relationship?: string;
    coverageDetails?: string;
    validUntil?: string;
    insurancePhone?: string;
    secondaryProvider?: string;
    secondaryPolicyNumber?: string;
    secondaryGroupNumber?: string;
  };

  emergencyContact?: {
    id?: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  };

  consentDocuments?: Array<{
    id: string;
    documentType: string;
    documentUrl: string;
    uploadDate: string;
    notes?: string;
  }>;
}



export interface PaginatedPatientsResponse {
  data: PatientResponseDto[];
  meta: IPaginationMeta;
}
