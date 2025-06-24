// services/patient.service.ts
import axiosClient, { ApiResponse } from '@/lib/axios';
import RequestHelpers from '@/lib/helpers/request';
import { 
  Patient,
  PatientRequest,
  Gender
} from '../types/patient';
import {
  PageResponse,
  PageRequest
} from '../types/pageable';

/**
 * Response wrapper for single patient responses
 */
interface PatientApiResponse {
  data: Patient;
}

/**
 * Query parameters for patient listing and search
 */
export interface PatientQueryParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * Service for interacting with the patients API endpoints
 * 
 * Handles communication with the backend /api/v1/patients endpoints
 * Implements CRUD operations and search functionality
 * 
 * @author Marouane Dbibih
 * @version 2.0
 * @date 2025-06-23
 */
class PatientService {
  private readonly basePath = '/api/v1/patients';
  private readonly requestHelpers = new RequestHelpers();
  
  /**
   * Create a new patient
   * @param data Patient data to create
   * @returns The created patient
   */
  async createPatient(data: PatientRequest): Promise<Patient> {
    const response = await axiosClient.post<Patient>(
      this.basePath, 
      data
    );
    return response.data;
  }
  
  /**
   * Get all patients with pagination and optional filtering
   * @param params Optional query parameters for filtering and pagination
   * @returns Paginated list of patients
   */
  async getPatients(params?: PatientQueryParams): Promise<PageResponse<Patient>> {
    // Convert to proper format expected by the new controller
    const queryParams: Record<string, string> = {};
    
    if (params) {
      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.page !== undefined) queryParams.page = String(params.page);
      if (params.size !== undefined) queryParams.size = String(params.size);
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.sortDirection) queryParams.sortDirection = params.sortDirection;
    }
    
    const response = await axiosClient.get<PageResponse<Patient>>(
      this.basePath,
      { params: queryParams }
    );
    
    return response.data;
  }
  
  /**
   * Search for patients by keyword
   * @param keyword Search term
   * @param params Pagination parameters
   * @returns Paginated search results
   */
  async searchPatients(keyword: string, params?: Omit<PatientQueryParams, 'keyword'>): Promise<PageResponse<Patient>> {
    const queryParams: Record<string, string> = { keyword };
    
    if (params) {
      if (params.page !== undefined) queryParams.page = String(params.page);
      if (params.size !== undefined) queryParams.size = String(params.size);
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.sortDirection) queryParams.sortDirection = params.sortDirection;
    }
    
    const response = await axiosClient.get<PageResponse<Patient>>(
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
  async getPatientById(id: string): Promise<Patient> {
    const response = await axiosClient.get<Patient>(
      `${this.basePath}/${id}`
    );
    return response.data;
  }
  
  /**
   * Update a patient
   * @param id Patient ID
   * @param data Updated patient data
   * @returns Updated patient
   */
  async updatePatient(id: string, data: PatientRequest): Promise<Patient> {
    const response = await axiosClient.put<Patient>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data;
  }
  
  /**
   * Delete a patient
   * @param id Patient ID
   */
  async deletePatient(id: string): Promise<void> {
    await axiosClient.delete(`${this.basePath}/${id}`);
    // The backend returns 204 No Content, so no data to return
  }
  
  /**
   * Helper method to convert a PageRequest to query parameters
   * @param pageRequest The page request object
   * @returns Query parameters object
   */
  private createQueryParams(pageRequest: PageRequest): PatientQueryParams {
    return {
      page: pageRequest.page + 1, // Convert from 0-based to 1-based pagination
      size: pageRequest.size,
      sortBy: pageRequest.sort,
      sortDirection: pageRequest.direction
    };
  }
}

// Export a singleton instance
export const patientService = new PatientService();
export default patientService;