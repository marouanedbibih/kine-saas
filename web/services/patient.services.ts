// services/patient.services.ts
import axiosClient, { ApiResponse } from '@/lib/axios';
import RequestHelpers from '@/lib/helpers/request';
import { 
  CreatePatientDto, 
  UpdatePatientDto, 
  PatientResponseDto,
  QueryPatientsDto,
  PaginatedPatientsResponse
} from '@/types/patient';


/**
 * Service for interacting with the patients API endpoints
 */
class PatientService {
  private readonly basePath = '/patients';
  private readonly requestHelpers = new RequestHelpers();
  
  /**
   * Create a new patient
   * @param data Patient data to create
   * @returns The created patient
   */
  async create(data: CreatePatientDto): Promise<PatientResponseDto> {
    const response = await axiosClient.post<ApiResponse<PatientResponseDto>>(
      this.basePath, 
      data
    );
    return response.data.data;
  }
  
  /**
   * Get all patients with pagination and optional filtering
   * @param query Optional query parameters for filtering and pagination
   * @returns Paginated list of patients
   */
  async getAll(query?: QueryPatientsDto): Promise<PaginatedPatientsResponse> {
    const queryParams = this.requestHelpers.serializeQueryParams(query || {});
    const response = await axiosClient.get<PaginatedPatientsResponse>(
      this.basePath,
      { params: queryParams }
    );
    return response.data;
  }
  
  /**
   * Get a single patient by ID
   * @param id Patient ID
   * @returns Patient data
   */
  async getOne(id: string): Promise<PatientResponseDto> {
    const response = await axiosClient.get<ApiResponse<PatientResponseDto>>(
      `${this.basePath}/${id}`
    );
    return response.data.data;
  }
  
  /**
   * Update a patient
   * @param id Patient ID
   * @param data Updated patient data
   * @returns Updated patient
   */
  async update(id: string, data: UpdatePatientDto): Promise<PatientResponseDto> {
    const response = await axiosClient.patch<ApiResponse<PatientResponseDto>>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data.data;
  }
  
  /**
   * Delete a patient
   * @param id Patient ID
   */
  async remove(id: string): Promise<void> {
    await axiosClient.delete(`${this.basePath}/${id}`);
  }
}

// Export a singleton instance
export const patientService = new PatientService();

