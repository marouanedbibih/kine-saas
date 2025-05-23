"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import PatientService from "@/services/patient.service";
import { 
  QueryPatientsDto, 
  PaginatedPatientsResponse, 
  PatientResponseDto,
  CreatePatientDto,
  UpdatePatientDto,
  Gender,
  MaritalStatus,
  PreferredContact
} from "@/types/patient";
import { useToast } from "@/hooks/use-toast";
import { ILoading, IPaginationMeta } from "@/types";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { alertService } from "@/services/alert.services";

interface PatientContextProps {
  // State data
  patients: PatientResponseDto[];
  selectedPatient: PatientResponseDto | null;
  loading: ILoading;
  error: string | null;
  filters: QueryPatientsDto;
  pagination: IPaginationMeta;
  requestPatient: CreatePatientDto;
  setRequestPatient: React.Dispatch<React.SetStateAction<CreatePatientDto>>;
  
  // State setters
  setFilters: React.Dispatch<React.SetStateAction<QueryPatientsDto>>;
  setSelectedPatient: (patient: PatientResponseDto | null) => void;
  
  // CRUD operations
  fetchPatients: () => Promise<PaginatedPatientsResponse | void>;
  getPatient: (id: string) => Promise<PatientResponseDto>;
  deletePatient: (id: string) => Promise<void>;
  
  // File operations
  uploadPatientPhoto: (id: string, photoFile: File) => Promise<PatientResponseDto>;
  uploadPatientDocument: (patientId: string, documentFile: File, documentType: string) => Promise<any>;
  getPatientDocuments: (patientId: string) => Promise<any[]>;
  deletePatientDocument: (patientId: string, documentId: string) => Promise<void>;
  
  // Helper operations
  clearErrors: () => void;
  refreshPatients: () => Promise<void>;
  handleFetchPatientDetail: (patientId: string) => Promise<void>;
  handleChangeInput: (field: string, value: any) => void;
  resetRequestPatient: () => void;
}

const defaultFilters: QueryPatientsDto = {
  page: 1,
  limit: 10,
  search: "",
  kinesitherapeuteId: undefined,
};

const defaultLoading: ILoading = {
  table: false,
  form: false,
  submit: false,
  delete: false,
};

const defaultPagination: IPaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const defaultPatientRequest: CreatePatientDto = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  dateOfBirth: "",
  gender: Gender.PREFER_NOT_TO_SAY,
  maritalStatus: MaritalStatus.SINGLE,
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  alternativePhoneNumber: "",
  preferredContact: PreferredContact.PHONE,
  emergencyContact: {
    name: "",
    phoneNumber: "",
    relationship: "",
    email: "",
  },
}

export const PatientContext = createContext<PatientContextProps>({
  // State data
  patients: [],
  selectedPatient: null,
  loading: defaultLoading,
  error: null,
  filters: defaultFilters,
  pagination: defaultPagination,
  requestPatient: defaultPatientRequest,
  setRequestPatient: () => {},
  
  // State setters
  setFilters: () => {},
  setSelectedPatient: () => {},
  
  // CRUD operations
  fetchPatients: async () => { throw new Error('PatientContext not initialized') },
  getPatient: async () => { throw new Error('PatientContext not initialized') },
  deletePatient: async () => { throw new Error('PatientContext not initialized') },
  
  // File operations
  uploadPatientPhoto: async () => { throw new Error('PatientContext not initialized') },
  uploadPatientDocument: async () => { throw new Error('PatientContext not initialized') },
  getPatientDocuments: async () => { throw new Error('PatientContext not initialized') },
  deletePatientDocument: async () => { throw new Error('PatientContext not initialized') },
  
  // Helper operations
  clearErrors: () => {},
  refreshPatients: async () => { throw new Error('PatientContext not initialized') },
  handleFetchPatientDetail: async () => { throw new Error('PatientContext not initialized') },
  handleChangeInput: () => {},
  resetRequestPatient: () => {},
});

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientResponseDto[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientResponseDto | null>(null);
  const [loading, setLoading] = useState<ILoading>(defaultLoading);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryPatientsDto>(defaultFilters);
  const [pagination, setPagination] = useState<IPaginationMeta>(defaultPagination);
  const [requestPatient, setRequestPatient] = useState<CreatePatientDto>(defaultPatientRequest);
  const router = useRouter();

  // Clear any errors
  const clearErrors = () => {
    setError(null);
  };

  // Fetch all patients with filtering
  const fetchPatients = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    setError(null);
    try {
      // Apply role-based filtering
      const modifiedFilters = { ...filters };
      
      // If user has kinesitherapist role and has an ID, only show their patients
      if (user?.role === 'kinesitherapist' && user?.kinesitherapeuteId) {
        modifiedFilters.kinesitherapeuteId = user.kinesitherapeuteId;
      }
      // Admin can see all patients, so no filter needed for them
      
      const response = await PatientService.getPatients(modifiedFilters);
      setPatients(response.data);
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      });
      return response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patients';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  // Get a specific patient by ID
  const getPatient = async (id: string): Promise<PatientResponseDto> => {
    setLoading((prev) => ({ ...prev, form: true }));
    clearErrors();
    try {
      const patient = await PatientService.getPatient(id);
      setSelectedPatient(patient);
      return patient;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to fetch patient ${id}`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };


  // Delete a patient
  const deletePatient = async (id: string): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    clearErrors();
    try {
      await PatientService.deletePatient(id);
      
      // Remove patient from state
      setPatients(currentPatients => currentPatients.filter(p => p.id !== id));
      
      // Clear selected patient if it's the one being deleted
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
      
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to delete patient ${id}`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Upload patient photo
  const uploadPatientPhoto = async (id: string, photoFile: File): Promise<PatientResponseDto> => {
    setLoading((prev) => ({ ...prev, submit: true }));
    clearErrors();
    try {
      const updatedPatient = await PatientService.uploadPatientPhoto(id, photoFile);
      
      // Update in state if needed
      if (selectedPatient?.id === id) {
        setSelectedPatient(updatedPatient);
      }
      
      // Update in list if exists
      setPatients(currentPatients => 
        currentPatients.map(p => p.id === id ? updatedPatient : p)
      );
      
      toast({
        title: "Success",
        description: "Patient photo uploaded successfully",
      });
      
      return updatedPatient;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to upload patient photo`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Upload patient document
  const uploadPatientDocument = async (patientId: string, documentFile: File, documentType: string): Promise<any> => {
    setLoading((prev) => ({ ...prev, submit: true }));
    clearErrors();
    try {
      const document = await PatientService.uploadPatientDocument(patientId, documentFile, documentType);
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      return document;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to upload document`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Get patient documents
  const getPatientDocuments = async (patientId: string): Promise<any[]> => {
    setLoading((prev) => ({ ...prev, form: true }));
    clearErrors();
    try {
      return await PatientService.getPatientDocuments(patientId);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to get patient documents`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  // Delete patient document
  const deletePatientDocument = async (patientId: string, documentId: string): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    clearErrors();
    try {
      await PatientService.deletePatientDocument(patientId, documentId);
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to delete document`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Refresh patients
  const refreshPatients = async (): Promise<void> => {
    await fetchPatients();
    return;
  };

  // Fetch and set patientRequest for editing
  const handleFetchPatientDetail = async (patientId: string) => {
    setLoading((prev) => ({ ...prev, form: true }));
    clearErrors();
    try {
      const patient = await PatientService.getPatient(patientId);
      setRequestPatient({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        middleName: patient.middleName || "",
        email: patient.email || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || Gender.PREFER_NOT_TO_SAY,
        maritalStatus: patient.maritalStatus || MaritalStatus.SINGLE,
        phoneNumber: patient.phoneNumber || "",
        address: patient.address || "",
        city: patient.city || "",
        state: patient.state || "",
        zipCode: patient.zipCode || "",
        alternativePhoneNumber: patient.alternativePhoneNumber || "",
        preferredContact: patient.preferredContact || PreferredContact.PHONE,
        emergencyContact: patient.emergencyContact ? {
          name: patient.emergencyContact.name || "",
          phoneNumber: patient.emergencyContact.phoneNumber || "",
          relationship: patient.emergencyContact.relationship || "",
          email: patient.emergencyContact.email || "",
        } : { name: "", phoneNumber: "", relationship: "", email: "" },
        // Add other fields as needed
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to fetch patient ${patientId}`;
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  // Handle input change for requestPatient (supports nested fields with dot notation)
  const handleChangeInput = (field: string, value: any) => {
    setRequestPatient(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentValue = (prev as any)[parent] && typeof (prev as any)[parent] === 'object' ? (prev as any)[parent] : {};
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  // Reset requestPatient to default values
  const resetRequestPatient = () => {
    setRequestPatient(defaultPatientRequest);
  };

  // Fetch patients when filters change
  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const contextValue: PatientContextProps = {
    // State data
    patients,
    selectedPatient,
    loading,
    error,
    filters,
    pagination,
    requestPatient,
    setRequestPatient,
    
    // State setters
    setFilters,
    setSelectedPatient,
    
    // CRUD operations
    fetchPatients,
    getPatient,
    deletePatient,
    
    // File operations
    uploadPatientPhoto,
    uploadPatientDocument,
    getPatientDocuments,
    deletePatientDocument,
    
    // Helper operations
    clearErrors,
    refreshPatients,
    handleFetchPatientDetail,
    handleChangeInput,
    resetRequestPatient,
  };

  return <PatientContext.Provider value={contextValue}>{children}</PatientContext.Provider>;
};
