"use client";
import { useState, useEffect, useCallback } from "react";
import PatientService from "@/services/patient.service";
import { UpdatePatientDto, PatientResponseDto, CreatePatientDto } from "@/types/patient";
import { usePatientContext } from "./usePatients";
import { alertService } from "@/services/alert.services";
import { useRouter } from "next/navigation";

interface UseEditPatientResult {
  formData: CreatePatientDto;
  setFormData: React.Dispatch<React.SetStateAction<CreatePatientDto>>;
  loading: boolean;
  error: string | null;
  fetchPatient: (id: string) => Promise<void>;
  handleUpdatePatient: () => Promise<PatientResponseDto | void>;
}

export function useEditPatient(patientId: string): UseEditPatientResult {
  const { requestPatient, setRequestPatient, resetRequestPatient } = usePatientContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Renamed and refactored: loadDataForm sets context state
  const loadDataForm = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      PatientService.getPatient(id)
        .then((patient) => {
          setRequestPatient({
            firstName: patient.firstName || "",
            middleName: patient.middleName || "",
            lastName: patient.lastName || "",
            email: patient.email || "",
            phoneNumber: patient.phoneNumber || "",
            alternativePhoneNumber: patient.alternativePhoneNumber || "",
            preferredContact: patient.preferredContact,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth || "",
            maritalStatus: patient.maritalStatus,
            address: patient.address || "",
            city: patient.city || "",
            state: patient.state || "",
            zipCode: patient.zipCode || "",
            emergencyContact: patient.emergencyContact || {
              name: "",
              phoneNumber: "",
              relationship: "",
              email: "",
            },
            // Add other fields as needed
          });
        })
        .catch((err: any) => {
          setError(err.message || "Failed to fetch patient");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setRequestPatient]
  );

  useEffect(() => {
    if (patientId) {
      loadDataForm(patientId);
    }
  }, [patientId, loadDataForm]);

  const handleUpdatePatient = useCallback(() => {
    if (!requestPatient) return Promise.resolve();
    setLoading(true);
    setError(null);
    return PatientService.updatePatient(patientId, requestPatient)
      .then((response) => {
        router.push("/patients");
        resetRequestPatient();
        alertService.success(`Patient ${response.firstName} ${response.lastName} mis à jour avec succès`);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to update patient");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [requestPatient, patientId]);

  return {
    formData: requestPatient,
    setFormData: setRequestPatient,
    loading,
    error,
    fetchPatient: loadDataForm,
    handleUpdatePatient,
  };
}
