import { useRouter } from "next/navigation";
import { alertService } from "@/services/alert.services";
import PatientService from "@/services/patient.service";
import { useState } from "react";
import { usePatientContext } from "./usePatients";

export function useCreatePatient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { requestPatient } = usePatientContext();

  const createPatient = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    PatientService.createPatient(requestPatient)
      .then((newPatient) => {
        alertService.success("Patient created successfully");
        router.push("/patients");
      })
      .catch((err: any) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to create patient";
        setError(errorMsg);
        alertService.error(errorMsg);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { createPatient, loading, error };
}
