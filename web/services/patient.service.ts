import axios from '@/lib/axios';
import { 
  CreatePatientDto, 
  UpdatePatientDto, 
  PatientResponseDto, 
  PaginatedPatientsResponse,
  QueryPatientsDto
} from '@/types/patient';

const API_BASE_URL = '/patients';

export class PatientService {
  /**
   * Get all patients with pagination and filtering
   */
  static async getPatients(params: QueryPatientsDto = {}): Promise<PaginatedPatientsResponse> {
    try {
      const response = await axios.get(API_BASE_URL, { params });
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patients', error);
      throw error;
    }
  }

  /**
   * Get a single patient by ID
   */
  static async getPatient(id: string): Promise<PatientResponseDto> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(`Failed to fetch patient with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Create a new patient
   */
  static async createPatient(patientData: CreatePatientDto): Promise<PatientResponseDto> {
    try {
      const response = await axios.post(API_BASE_URL, patientData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to create patient', error);
      throw error;
    }
  }

  /**
   * Update an existing patient
   */
  static async updatePatient(id: string, patientData: UpdatePatientDto): Promise<PatientResponseDto> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}`, patientData);
      return response.data;
    } catch (error) {
      this.handleError(`Failed to update patient with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete a patient
   */
  static async deletePatient(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      this.handleError(`Failed to delete patient with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Upload patient profile photo
   */
  static async uploadPatientPhoto(id: string, photoFile: File): Promise<PatientResponseDto> {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await axios.post(
        `${API_BASE_URL}/${id}/photo`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(`Failed to upload photo for patient with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Upload a document for a patient
   */
  static async uploadPatientDocument(
    patientId: string, 
    documentFile: File, 
    documentType: string
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('documentType', documentType);

      const response = await axios.post(
        `${API_BASE_URL}/${patientId}/documents`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(`Failed to upload document for patient with ID ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Get documents for a patient
   */
  static async getPatientDocuments(patientId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${patientId}/documents`);
      return response.data;
    } catch (error) {
      this.handleError(`Failed to get documents for patient with ID ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Delete a patient document
   */
  static async deletePatientDocument(patientId: string, documentId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${patientId}/documents/${documentId}`);
    } catch (error) {
      this.handleError(`Failed to delete document ${documentId} for patient ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Helper method to handle errors consistently
   */
  private static handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    
    // You can extend this with more sophisticated error handling,
    // such as error reporting services or showing notifications
    
    // If using a toast notification system (as seen in your imports)
    // toast.error(`${message}: ${error.response?.data?.message || error.message}`);
    
    // Re-throw the error to allow the caller to handle it as well
    throw error;
  }
}

export default PatientService;
