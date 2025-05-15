"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { patientService } from "@/services/patient.services";
import { QueryPatientsDto, PaginatedPatientsResponse, PatientResponseDto } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";
import { ILoading, IPaginationMeta } from "@/types";
import { table } from "console";

interface PatientContextProps {
  patients: PatientResponseDto[];
  loading: ILoading;
  error: string | null;
  filters: QueryPatientsDto;
  setFilters: React.Dispatch<React.SetStateAction<QueryPatientsDto>>;
  pagination: IPaginationMeta;
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

export const PatientContext = createContext<PatientContextProps>({
  patients: [],
  loading: defaultLoading,
  error: null,
  filters: defaultFilters,
  setFilters: () => {},
  pagination: defaultPagination,
});

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientResponseDto[]>([]);
  const [loading, setLoading] = useState<ILoading>(defaultLoading);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryPatientsDto>(defaultFilters);
  const [pagination, setPagination] = useState<IPaginationMeta>(defaultPagination);

  const fetchPatients = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    setError(null);
    await patientService
      .getAll(filters)
      .then((response: PaginatedPatientsResponse) => {
        setPatients(response.data);
        setPagination({
          page: response.meta.page,
          limit: response.meta.limit,
          total: response.meta.total,
          totalPages: response.meta.totalPages,
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, table: false }));
      });
  };

  // Fetch patients when filters change
  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const contextValue: PatientContextProps = {
    patients,
    loading,
    error,
    filters,
    setFilters,
    pagination,
  };

  return <PatientContext.Provider value={contextValue}>{children}</PatientContext.Provider>;
};
