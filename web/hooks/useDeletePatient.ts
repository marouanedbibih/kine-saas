import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePatientsList } from "@/hooks/usePatients";
import PatientService from "@/services/patient.service";
import { alertService } from "@/services/alert.services";

export function useDeletePatient() {
  const { toast } = useToast();
  const { refreshPatients } = usePatientsList();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePatient = (id: string) => {
    setLoading(true);
    setError(null);
    return PatientService.deletePatient(id)
      .then(() => {
        refreshPatients();
        alertService.success("Patient deleted successfully");
      })
      .catch((err: any) => {
        setError(err.response?.data?.message || err.message || "Failed to delete patient");
        toast({
          title: "Error",
          description: err.response?.data?.message || err.message || "Failed to delete patient",
          variant: "destructive",
        });
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { handleDeletePatient, loading, error };
}
