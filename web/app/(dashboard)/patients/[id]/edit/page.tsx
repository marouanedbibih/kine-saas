"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEditPatient } from "@/hooks/useEditPatient";
import { usePatientContext, usePatientDetails } from "@/hooks/usePatients";
import { BloodType, Gender, MaritalStatus, PatientResponseDto, PreferredContact, UpdatePatientDto } from "@/types/patient";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, FormEvent } from "react";

export default function PatientEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = React.use(params);

  const { getPatient, selectedPatient, setSelectedPatient, loading, uploadPatientPhoto } = usePatientDetails();
  const { toast } = useToast();
  const router = useRouter();

  const { requestPatient, setRequestPatient, handleChangeInput } = usePatientContext();

  const { handleUpdatePatient } = useEditPatient(patientId);

  // Medical record
  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [chronicConditions, setChronicConditions] = useState<string>("");
  const [medications, setMedications] = useState<string>("");
  const [smokingStatus, setSmokingStatus] = useState<string>("");
  const [alcoholConsumption, setAlcoholConsumption] = useState<string>("");
  const [exerciseFrequency, setExerciseFrequency] = useState<string>("");

  // Insurance
  const [insuranceProvider, setInsuranceProvider] = useState<string>("");
  const [policyNumber, setPolicyNumber] = useState<string>("");
  const [groupNumber, setGroupNumber] = useState<string>("");
  const [primaryInsuredName, setPrimaryInsuredName] = useState<string>("");
  const [insuranceRelationship, setInsuranceRelationship] = useState<string>("");
  const [validUntil, setValidUntil] = useState<Date | undefined>(undefined);
  const [insurancePhone, setInsurancePhone] = useState<string>("");

  // Profile photo
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await getPatient(patientId);
        // populateFormFields(patient);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch patient details.",
          variant: "destructive",
        });
      }
    };

    fetchPatient();

    return () => {
      // Cleanup function to set selectedPatient to null when component unmounts
      setSelectedPatient(null);
    };
  }, [patientId]);

  // Populate form fields with patient data
  // const populateFormFields = (patient: PatientResponseDto) => {
  //   setFirstName(patient.firstName);
  //   setMiddleName(patient.middleName || '');
  //   setLastName(patient.lastName);
  //   setEmail(patient.email);
  //   setPhoneNumber(patient.phoneNumber);
  //   setAlternativePhoneNumber(patient.alternativePhoneNumber || '');
  //   setPreferredContact(patient.preferredContact || PreferredContact.PHONE);
  //   setGender(patient.gender);
  //   setDateOfBirth(patient.dateOfBirth ? parseISO(patient.dateOfBirth) : undefined);
  //   setMaritalStatus(patient.maritalStatus || '');
  //   setAddress(patient.address || '');
  //   setCity(patient.city || '');
  //   setState(patient.state || '');
  //   setZipCode(patient.zipCode || '');
  //   setActive(patient.active);

  //   // Emergency contact
  //   const emergencyContact = patient.emergencyContact;
  //   if (emergencyContact) {
  //     setEmergencyName(emergencyContact.name);
  //     setEmergencyRelationship(emergencyContact.relationship);
  //     setEmergencyPhone(emergencyContact.phoneNumber);
  //     setEmergencyEmail(emergencyContact.email || '');
  //   } else {
  //     setEmergencyName('');
  //     setEmergencyRelationship('');
  //     setEmergencyPhone('');
  //     setEmergencyEmail('');
  //   }

  //   // Medical record
  //   if (patient.medicalRecord) {
  //     setBloodType(patient.medicalRecord.bloodType || '');
  //     setHeight(patient.medicalRecord.height?.toString() || '');
  //     setWeight(patient.medicalRecord.weight?.toString() || '');
  //     setAllergies(patient.medicalRecord.allergies || '');
  //     setChronicConditions(patient.medicalRecord.chronicConditions || '');
  //     setMedications(patient.medicalRecord.currentMedications || '');
  //     setSmokingStatus(patient.medicalRecord.smokingStatus || '');
  //     setAlcoholConsumption(patient.medicalRecord.alcoholConsumption || '');
  //     setExerciseFrequency(patient.medicalRecord.exerciseFrequency || '');
  //   }

  //   // Insurance info
  //   if (patient.insuranceInfo) {
  //     setInsuranceProvider(patient.insuranceInfo.provider);
  //     setPolicyNumber(patient.insuranceInfo.policyNumber);
  //     setGroupNumber(patient.insuranceInfo.groupNumber || '');
  //     setPrimaryInsuredName(patient.insuranceInfo.primaryInsuredName);
  //     setInsuranceRelationship(patient.insuranceInfo.relationship || '');
  //     setValidUntil(patient.insuranceInfo.validUntil ? parseISO(patient.insuranceInfo.validUntil) : undefined);
  //     setInsurancePhone(patient.insuranceInfo.insurancePhone || '');
  //   }
  // };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const { formData, setFormData } = useEditPatient(patientId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleUpdatePatient();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Edit Patient</h1>
      </div>

      {loading.form ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Profile</CardTitle>
                  <CardDescription>Update the patient's profile picture and status</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={selectedPatient?.profilePhotoUrl} alt={`${requestPatient.firstName} ${requestPatient.lastName}`} />
                    <AvatarFallback>{getInitials(requestPatient.firstName, requestPatient.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <label htmlFor="profile-photo">
                      <Button variant="outline" className="w-full cursor-pointer" asChild>
                        <span>Change Photo</span>
                      </Button>
                      <input id="profile-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <div className="w-full space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patient-status">Patient Status</Label>
                      {/* <Switch 
                        id="patient-status" 
                        checked={active}
                        onCheckedChange={setActive}
                      /> */}
                    </div>
                    <p className="text-sm text-muted-foreground">Active patients can book appointments and receive care.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-3/4">
              <Tabs defaultValue="personal">
                <TabsList>
                  <TabsTrigger value="personal">Personal Information</TabsTrigger>
                  <TabsTrigger value="medical">Medical Information</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance & Billing</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Details</CardTitle>
                      <CardDescription>Update the patient's personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" value={requestPatient.firstName} onChange={(e) => handleChangeInput("firstName", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="middle-name">Middle Name</Label>
                          <Input id="middle-name" value={requestPatient.middleName} onChange={(e) => handleChangeInput("middleName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" value={requestPatient.lastName} onChange={(e) => handleChangeInput("lastName", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={`w-full justify-start text-left font-normal`}>
                                <span>{requestPatient.dateOfBirth ? format(parseISO(requestPatient.dateOfBirth), "PPP") : "Pick a date"}</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={requestPatient.dateOfBirth ? parseISO(requestPatient.dateOfBirth) : undefined} onSelect={(date) => handleChangeInput("dateOfBirth", date ? format(date, "yyyy-MM-dd") : "")} />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={requestPatient.gender} onValueChange={(value) => handleChangeInput("gender", value)}>
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
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={requestPatient.email} onChange={(e) => handleChangeInput("email", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" value={requestPatient.phoneNumber} onChange={(e) => handleChangeInput("phoneNumber", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt-phone">Alternative Phone</Label>
                          <Input id="alt-phone" value={requestPatient.alternativePhoneNumber} onChange={(e) => handleChangeInput("alternativePhoneNumber", e.target.value)} />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" value={requestPatient.address} onChange={(e) => handleChangeInput("address", e.target.value)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" value={requestPatient.city} onChange={(e) => handleChangeInput("city", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" value={requestPatient.state} onChange={(e) => handleChangeInput("state", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip Code</Label>
                          <Input id="zip" value={requestPatient.zipCode} onChange={(e) => handleChangeInput("zipCode", e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Emergency Contact Information</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergency-name">Name</Label>
                            <Input id="emergency-name" value={requestPatient.emergencyContact?.name || ""} onChange={(e) => handleChangeInput("emergencyContact.name", e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergency-relationship">Relationship</Label>
                            <Input id="emergency-relationship" value={requestPatient.emergencyContact?.relationship || ""} onChange={(e) => handleChangeInput("emergencyContact.relationship", e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergency-phone">Phone</Label>
                            <Input id="emergency-phone" value={requestPatient.emergencyContact?.phoneNumber || ""} onChange={(e) => handleChangeInput("emergencyContact.phoneNumber", e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergency-email">Email</Label>
                            <Input id="emergency-email" value={requestPatient.emergencyContact?.email || ""} onChange={(e) => handleChangeInput("emergencyContact.email", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Medical Information Tab */}
                <TabsContent value="medical" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Information</CardTitle>
                      <CardDescription>Update the patient's medical details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="blood-type">Blood Type</Label>
                          <Select value={requestPatient.medicalRecord?.bloodType} onValueChange={(value) => handleChangeInput("medicalRecord.bloodType", value)}>
                            <SelectTrigger id="blood-type">
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={BloodType.A_POSITIVE}>A+</SelectItem>
                              <SelectItem value={BloodType.A_NEGATIVE}>A-</SelectItem>
                              <SelectItem value={BloodType.B_POSITIVE}>B+</SelectItem>
                              <SelectItem value={BloodType.B_NEGATIVE}>B-</SelectItem>
                              <SelectItem value={BloodType.AB_POSITIVE}>AB+</SelectItem>
                              <SelectItem value={BloodType.AB_NEGATIVE}>AB-</SelectItem>
                              <SelectItem value={BloodType.O_POSITIVE}>O+</SelectItem>
                              <SelectItem value={BloodType.O_NEGATIVE}>O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input id="height" type="number" value={requestPatient.medicalRecord?.height || ""} onChange={(e) => handleChangeInput("medicalRecord.height", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input id="weight" type="number" value={requestPatient.medicalRecord?.weight || ""} onChange={(e) => handleChangeInput("medicalRecord.weight", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies</Label>
                          <Textarea id="allergies" value={requestPatient.medicalRecord?.allergies} onChange={(e) => handleChangeInput("medicalRecord.allergies", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chronic-conditions">Chronic Conditions</Label>
                          <Textarea id="chronic-conditions" value={requestPatient.medicalRecord?.chronicConditions} onChange={(e) => handleChangeInput("medicalRecord.chronicConditions", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current-medications">Current Medications</Label>
                          <Textarea id="current-medications" value={requestPatient.medicalRecord?.currentMedications} onChange={(e) => handleChangeInput("medicalRecord.currentMedications", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smoking-status">Smoking Status</Label>
                          <Select value={requestPatient.medicalRecord?.smokingStatus} onValueChange={(value) => handleChangeInput("medicalRecord.smokingStatus", value)}>
                            <SelectTrigger id="smoking-status">
                              <SelectValue placeholder="Select smoking status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="smoker">Smoker</SelectItem>
                              <SelectItem value="non-smoker">Non-smoker</SelectItem>
                              <SelectItem value="former-smoker">Former smoker</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alcohol-consumption">Alcohol Consumption</Label>
                          <Select value={requestPatient.medicalRecord?.alcoholConsumption} onValueChange={(value) => handleChangeInput("medicalRecord.alcoholConsumption", value)}>
                            <SelectTrigger id="alcohol-consumption">
                              <SelectValue placeholder="Select alcohol consumption" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="occasional">Occasional</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="heavy">Heavy</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="exercise-frequency">Exercise Frequency</Label>
                          <Select value={requestPatient.medicalRecord?.exerciseFrequency} onValueChange={(value) => handleChangeInput("medicalRecord.exerciseFrequency", value)}>
                            <SelectTrigger id="exercise-frequency">
                              <SelectValue placeholder="Select exercise frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="occasional">Occasional</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="intense">Intense</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Insurance & Billing Tab */}
                <TabsContent value="insurance" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Insurance & Billing</CardTitle>
                      <CardDescription>Update the patient's insurance and billing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="insurance-provider">Insurance Provider</Label>
                          <Input id="insurance-provider" value={requestPatient.insuranceInfo?.provider} onChange={(e) => handleChangeInput("insuranceInfo.provider", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policy-number">Policy Number</Label>
                          <Input id="policy-number" value={requestPatient.insuranceInfo?.policyNumber} onChange={(e) => handleChangeInput("insuranceInfo.policyNumber", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="group-number">Group Number</Label>
                          <Input id="group-number" value={requestPatient.insuranceInfo?.groupNumber} onChange={(e) => handleChangeInput("insuranceInfo.groupNumber", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="primary-insured-name">Primary Insured Name</Label>
                          <Input id="primary-insured-name" value={requestPatient.insuranceInfo?.primaryInsuredName} onChange={(e) => handleChangeInput("insuranceInfo.primaryInsuredName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurance-relationship">Relationship to Insured</Label>
                          <Input id="insurance-relationship" value={requestPatient.insuranceInfo?.relationship} onChange={(e) => handleChangeInput("insuranceInfo.relationship", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valid-until">Valid Until</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={`w-full justify-start text-left font-normal`}>
                                <span>{requestPatient.insuranceInfo?.validUntil ? format(parseISO(requestPatient.insuranceInfo.validUntil), "PPP") : "Pick a date"}</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={requestPatient.insuranceInfo?.validUntil ? parseISO(requestPatient.insuranceInfo.validUntil) : undefined} onSelect={(date) => handleChangeInput("insuranceInfo.validUntil", date ? format(date, "yyyy-MM-dd") : "")} />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurance-phone">Insurance Phone</Label>
                          <Input id="insurance-phone" value={requestPatient.insuranceInfo?.insurancePhone} onChange={(e) => handleChangeInput("insuranceInfo.insurancePhone", e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end mt-6 gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/patients/${patientId}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading.submit}>
                  {loading.submit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
