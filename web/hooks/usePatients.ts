import { useContext } from "react";
import { PatientContext } from "@/context/PatientContext";
import { CreatePatientDto, PaginatedPatientsResponse, PatientResponseDto, QueryPatientsDto, UpdatePatientDto } from "@/types/patient";
import { ILoading, IPaginationMeta } from "@/types";

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
};

// Specialized hooks for specific functionalities
export const usePatientsList = (): {
  patients: PatientResponseDto[];
  loading: ILoading;
  error: string | null;
  filters: QueryPatientsDto;
  setFilters: React.Dispatch<React.SetStateAction<QueryPatientsDto>>;
  pagination: IPaginationMeta;
  refreshPatients: () => Promise<void>;
  fetchPatients: () => Promise<PaginatedPatientsResponse | void>;
} => {
  const { 
    patients, 
    loading, 
    error, 
    filters, 
    setFilters, 
    pagination,
    refreshPatients,
    fetchPatients 
  } = usePatients();
  
  return { 
    patients, 
    loading, 
    error, 
    filters, 
    setFilters, 
    pagination,
    refreshPatients,
    fetchPatients
  };
};

export const usePatientDetails = (): {
  selectedPatient: PatientResponseDto | null;
  loading: ILoading;
  error: string | null;
  getPatient: (id: string) => Promise<PatientResponseDto>;
  setSelectedPatient: (patient: PatientResponseDto | null) => void;
  updatePatient: (id: string, patientData: UpdatePatientDto) => Promise<PatientResponseDto>;
  deletePatient: (id: string) => Promise<void>;
  uploadPatientPhoto: (id: string, photoFile: File) => Promise<PatientResponseDto>;
} => {
  const {
    selectedPatient,
    loading,
    error,
    getPatient,
    setSelectedPatient,
    updatePatient,
    deletePatient,
    uploadPatientPhoto
  } = usePatients();
  
  return {
    selectedPatient,
    loading,
    error,
    getPatient,
    setSelectedPatient,
    updatePatient,
    deletePatient,
    uploadPatientPhoto
  };
};

export const usePatientDocuments = (): {
  loading: ILoading;
  error: string | null;
  uploadPatientDocument: (patientId: string, documentFile: File, documentType: string) => Promise<any>;
  getPatientDocuments: (patientId: string) => Promise<any[]>;
  deletePatientDocument: (patientId: string, documentId: string) => Promise<void>;
} => {
  const {
    loading,
    error,
    uploadPatientDocument,
    getPatientDocuments,
    deletePatientDocument
  } = usePatients();
  
  return {
    loading,
    error,
    uploadPatientDocument,
    getPatientDocuments,
    deletePatientDocument
  };
};

export const usePatientCreation = (): {
  loading: ILoading;
  error: string | null;
  createPatient: (patientData: CreatePatientDto) => Promise<PatientResponseDto>;
} => {
  const {
    loading,
    error,
    createPatient
  } = usePatients();
  
  return {
    loading,
    error,
    createPatient
  };
};

// For backwards compatibility
export const usePatientContext = usePatients;
