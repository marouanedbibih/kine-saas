import React, { useEffect } from "react";
import { usePatientContext } from "@/hooks/usePatients";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { Gender, MaritalStatus, PreferredContact } from "@/types/patient";

interface EditPatientFormProps {
  patientId: string;
  onSubmit: (data: any) => void;
}

export const EditPatientForm: React.FC<EditPatientFormProps> = ({ patientId, onSubmit }) => {
  const { requestPatient, setRequestPatient, handleFetchPatientDetail, loading } = usePatientContext();
  const router = useRouter();

  useEffect(() => {
    if (patientId) {
      handleFetchPatientDetail(patientId);
    }
    // Optionally reset form on unmount
    // return () => setRequestPatient(defaultPatientRequest);
  }, [patientId]);

  // Optionally, use react-hook-form or similar here

  if (loading.form) return <div>Loading...</div>;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(requestPatient);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="first-name">First Name</Label>
        <Input
          id="first-name"
          value={requestPatient.firstName}
          onChange={e => setRequestPatient(prev => ({ ...prev, firstName: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="last-name">Last Name</Label>
        <Input
          id="last-name"
          value={requestPatient.lastName}
          onChange={e => setRequestPatient(prev => ({ ...prev, lastName: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={requestPatient.gender}
          onValueChange={value => setRequestPatient(prev => ({ ...prev, gender: value as Gender }))}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Gender.MALE}>Male</SelectItem>
            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
            <SelectItem value={Gender.OTHER}>Other</SelectItem>
            <SelectItem value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Add other fields as needed, e.g. maritalStatus, contact, emergencyContact, etc. */}
      <Button type="submit">Save Changes</Button>
    </form>
  );
};
