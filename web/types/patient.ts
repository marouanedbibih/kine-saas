import { IPaginationMeta } from ".";

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  telephone: string;
  adresse?: string;
  dateNaissance?: string; // 'YYYY-MM-DD'
  contactUrgence?: string;
  kinesitherapeuteId?: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: string; // 'YYYY-MM-DD'
  contactUrgence?: string;
  kinesitherapeuteId?: string;
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
  numeroPatient: string;
  firstName: string;
  lastName: string;
  telephone: string;
  adresse: string;
  dateNaissance: string | null; // Format: 'YYYY-MM-DD'
  contactUrgence: string;
  kinesitherapeute: KineInfo | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}



export interface PaginatedPatientsResponse {
  data: PatientResponseDto[];
  meta: IPaginationMeta;
}
