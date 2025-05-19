"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { usePatientContext, usePatientCreation } from "@/hooks/usePatients";
import { BloodType, CreatePatientDto, Gender, MaritalStatus, PreferredContact } from "@/types/patient";
import { format } from "date-fns";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function AddPatientPage() {
  const {loading, error } = usePatientCreation();
  const { toast } = useToast();
  const router = useRouter();
  const { requestPatient, setRequestPatient, createPatient } = usePatientContext();

  // Form state
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState<string>("");
  const [preferredContact, setPreferredContact] = useState<PreferredContact>(PreferredContact.PHONE);
  const [gender, setGender] = useState<Gender | "">("");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | "">("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState<string>("");
  const [emergencyRelationship, setEmergencyRelationship] = useState<string>("");
  const [emergencyPhone, setEmergencyPhone] = useState<string>("");
  const [emergencyEmail, setEmergencyEmail] = useState<string>("");

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

  // File upload state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [consentDocument, setConsentDocument] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      // Create a preview URL for the profile photo
      if (e.target.name === "profilePhoto") {
        const previewUrl = URL.createObjectURL(e.target.files[0]);
        setProfilePhotoUrl(previewUrl);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    createPatient(requestPatient);

    // // Validate required fields
    // if (!firstName || !lastName || !email || !phoneNumber || !gender) {
    //   toast({
    //     title: "Validation Error",
    //     description: "Please fill in all required fields.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // try {
    //   // Create patient data object
    //   const patientData: CreatePatientDto = {
    //     firstName,
    //     middleName: middleName || undefined,
    //     lastName,
    //     email,
    //     phoneNumber,
    //     alternativePhoneNumber: alternativePhoneNumber || undefined,
    //     preferredContact,
    //     gender: gender as Gender,
    //     dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : "",
    //     maritalStatus: (maritalStatus as MaritalStatus) || undefined,
    //     address: address || undefined,
    //     city: city || undefined,
    //     state: state || undefined,
    //     zipCode: zipCode || undefined,
    //     emergencyContact: emergencyName
    //       ? {
    //           name: emergencyName,
    //           relationship: emergencyRelationship,
    //           phoneNumber: emergencyPhone,
    //           email: emergencyEmail || undefined,
    //         }
    //       : undefined,
    //     medicalRecord: {
    //       bloodType: (bloodType as BloodType) || undefined,
    //       height: height ? parseFloat(height) : undefined,
    //       weight: weight ? parseFloat(weight) : undefined,
    //       allergies: allergies || undefined,
    //       chronicConditions: chronicConditions || undefined,
    //       currentMedications: medications || undefined,
    //       smokingStatus: smokingStatus || undefined,
    //       alcoholConsumption: alcoholConsumption || undefined,
    //       exerciseFrequency: exerciseFrequency || undefined,
    //     },
    //     insuranceInfo: insuranceProvider
    //       ? {
    //           provider: insuranceProvider,
    //           policyNumber: policyNumber,
    //           groupNumber: groupNumber || undefined,
    //           primaryInsuredName: primaryInsuredName,
    //           relationship: insuranceRelationship || undefined,
    //           validUntil: validUntil ? format(validUntil, "yyyy-MM-dd") : undefined,
    //           insurancePhone: insurancePhone || undefined,
    //         }
    //       : undefined,
    //   };

    //   console.log("Patient Data: ", patientData);

    //   // Create patient
    //   const newPatient = await createPatient(patientData);

    //   // Handle profile photo upload if provided
    //   if (profilePhoto && newPatient?.id) {
    //     // This would be handled by uploadPatientPhoto in a real implementation
    //     // For now, we'll just simulate success
    //     toast({
    //       title: "Profile Photo",
    //       description: "Profile photo will be uploaded.",
    //     });
    //   }

    //   toast({
    //     title: "Success",
    //     description: "Patient created successfully.",
    //   });

    //   // Redirect to patient list
    //   router.push("/patients");
    // } catch (error: any) {
    //   toast({
    //     title: "Error",
    //     description: error.message || "Failed to create patient.",
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center flex-wrap gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Add Patient</h1>
          <p className="text-muted-foreground">Register a new patient in your clinic.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
            <TabsTrigger value="insurance">Insurance & Billing</TabsTrigger>
            <TabsTrigger value="consent">Consent & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Enter the patient's personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="first-name">
                        First Name<span className="text-destructive"> *</span>
                      </Label>
                      <Input id="first-name" placeholder="Enter first name" value={requestPatient.firstName} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, firstName: e.target.value }))} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="middle-name">Middle Name (Optional)</Label>
                      <Input id="middle-name" placeholder="Enter middle name" value={requestPatient.middleName || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, middleName: e.target.value }))} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="last-name">
                        Last Name<span className="text-destructive"> *</span>
                      </Label>
                      <Input id="last-name" placeholder="Enter last name" value={requestPatient.lastName} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, lastName: e.target.value }))} required />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={`w-full justify-start text-left font-normal`}>
                            <span>{requestPatient.dateOfBirth ? format(new Date(requestPatient.dateOfBirth), "MMM dd, yyyy") : "Pick a date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={requestPatient.dateOfBirth ? new Date(requestPatient.dateOfBirth) : undefined} onSelect={date => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, dateOfBirth: date ? format(date, "yyyy-MM-dd") : "" }))} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="gender">
                        Gender<span className="text-destructive"> *</span>
                      </Label>
                      <Select value={requestPatient.gender} onValueChange={value => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, gender: value as Gender }))} required>
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
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="marital-status">Marital Status</Label>
                      <Select value={requestPatient.maritalStatus} onValueChange={value => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, maritalStatus: value as MaritalStatus }))}>
                        <SelectTrigger id="marital-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={MaritalStatus.SINGLE}>Single</SelectItem>
                          <SelectItem value={MaritalStatus.MARRIED}>Married</SelectItem>
                          <SelectItem value={MaritalStatus.DIVORCED}>Divorced</SelectItem>
                          <SelectItem value={MaritalStatus.WIDOWED}>Widowed</SelectItem>
                          <SelectItem value={MaritalStatus.SEPARATED}>Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter address" value={requestPatient.address || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, address: e.target.value }))} />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" value={requestPatient.city || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, city: e.target.value }))} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="Enter state" value={requestPatient.state || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, state: e.target.value }))} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" placeholder="Enter zip code" value={requestPatient.zipCode || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, zipCode: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="email">
                        Email<span className="text-destructive"> *</span>
                      </Label>
                      <Input id="email" type="email" placeholder="Enter email address" value={requestPatient.email} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, email: e.target.value }))} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="phone">
                        Phone Number<span className="text-destructive"> *</span>
                      </Label>
                      <Input id="phone" placeholder="Enter phone number" value={requestPatient.phoneNumber || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, phoneNumber: e.target.value }))} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="alt-phone">Alternative Phone (Optional)</Label>
                      <Input id="alt-phone" placeholder="Enter alternative phone" value={requestPatient.alternativePhoneNumber || ""} onChange={e => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, alternativePhoneNumber: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                    <RadioGroup
                      value={requestPatient.preferredContact}
                      onValueChange={value => setRequestPatient((prev: CreatePatientDto) => ({ ...prev, preferredContact: value as PreferredContact }))}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PreferredContact.PHONE} id="phone-contact" />
                        <Label htmlFor="phone-contact">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PreferredContact.EMAIL} id="email-contact" />
                        <Label htmlFor="email-contact">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PreferredContact.SMS} id="sms-contact" />
                        <Label htmlFor="sms-contact">SMS</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Emergency Contact</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="emergency-name">Contact Name</Label>
                      <Input
                        id="emergency-name"
                        placeholder="Enter emergency contact name"
                        value={requestPatient.emergencyContact?.name || ""}
                        onChange={e =>
                          setRequestPatient((prev: CreatePatientDto) => ({
                            ...prev,
                            emergencyContact: {
                              ...(prev.emergencyContact ?? { name: "", relationship: "", phoneNumber: "", email: "" }),
                              name: e.target.value,
                              relationship: prev.emergencyContact?.relationship ?? "",
                              phoneNumber: prev.emergencyContact?.phoneNumber ?? "",
                              email: prev.emergencyContact?.email ?? "",
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="emergency-relation">Relationship</Label>
                      <Input
                        id="emergency-relation"
                        placeholder="Enter relationship"
                        value={requestPatient.emergencyContact?.relationship || ""}
                        onChange={e =>
                          setRequestPatient((prev: CreatePatientDto) => ({
                            ...prev,
                            emergencyContact: {
                              ...(prev.emergencyContact ?? { name: "", relationship: "", phoneNumber: "", email: "" }),
                              name: prev.emergencyContact?.name ?? "",
                              relationship: e.target.value,
                              phoneNumber: prev.emergencyContact?.phoneNumber ?? "",
                              email: prev.emergencyContact?.email ?? "",
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="emergency-phone">Phone Number</Label>
                      <Input
                        id="emergency-phone"
                        placeholder="Enter emergency contact phone"
                        value={requestPatient.emergencyContact?.phoneNumber || ""}
                        onChange={e =>
                          setRequestPatient((prev: CreatePatientDto) => ({
                            ...prev,
                            emergencyContact: {
                              ...(prev.emergencyContact ?? { name: "", relationship: "", phoneNumber: "", email: "" }),
                              name: prev.emergencyContact?.name ?? "",
                              relationship: prev.emergencyContact?.relationship ?? "",
                              phoneNumber: e.target.value,
                              email: prev.emergencyContact?.email ?? "",
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="emergency-email">Email</Label>
                      <Input
                        id="emergency-email"
                        placeholder="Enter emergency contact email"
                        value={requestPatient.emergencyContact?.email || ""}
                        onChange={e =>
                          setRequestPatient((prev: CreatePatientDto) => ({
                            ...prev,
                            emergencyContact: {
                              ...(prev.emergencyContact ?? { name: "", relationship: "", phoneNumber: "", email: "" }),
                              name: prev.emergencyContact?.name ?? "",
                              relationship: prev.emergencyContact?.relationship ?? "",
                              phoneNumber: prev.emergencyContact?.phoneNumber ?? "",
                              email: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Photo</h3>
                  <div className="flex items-center gap-4">
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 w-full">
                      <label htmlFor="profile-photo" className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className={`h-32 w-32 rounded-full overflow-hidden bg-gray-100 ${profilePhotoUrl ? "" : "flex items-center justify-center"}`}>{profilePhotoUrl ? <img src={profilePhotoUrl} alt="Profile preview" className="h-full w-full object-cover" /> : <Upload className="h-8 w-8 text-gray-400" />}</div>
                        <span className="text-sm font-medium">{profilePhotoUrl ? "Change photo" : "Upload a profile photo"}</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 2MB)</span>
                        <Input id="profile-photo" name="profilePhoto" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={e => handleFileChange(e, setProfilePhoto)} />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>Enter the patient's medical details and history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blood-type">Blood Type</Label>
                    <Select value={bloodType} onValueChange={(value) => setBloodType(value as BloodType)}>
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
                        <SelectItem value={BloodType.UNKNOWN}>Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" placeholder="Height in cm" min="0" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" placeholder="Weight in kg" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea id="allergies" placeholder="List any allergies or write 'None'" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chronic-conditions">Chronic Conditions</Label>
                  <Textarea id="chronic-conditions" placeholder="List any chronic conditions or write 'None'" value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea id="medications" placeholder="List any medications or write 'None'" value={medications} onChange={(e) => setMedications(e.target.value)} />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smoking">Smoking Status</Label>
                    <Input id="smoking" placeholder="e.g., Non-smoker, Occasional, etc." value={smokingStatus} onChange={(e) => setSmokingStatus(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <Input id="alcohol" placeholder="e.g., None, Occasional, etc." value={alcoholConsumption} onChange={(e) => setAlcoholConsumption(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercise">Exercise Frequency</Label>
                    <Input id="exercise" placeholder="e.g., Daily, Weekly, etc." value={exerciseFrequency} onChange={(e) => setExerciseFrequency(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>Enter the patient's insurance details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance-provider">Insurance Provider</Label>
                  <Input id="insurance-provider" placeholder="Enter insurance provider name" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-number">Policy Number</Label>
                    <Input id="policy-number" placeholder="Enter policy number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-number">Group Number (Optional)</Label>
                    <Input id="group-number" placeholder="Enter group number" value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-insured">Primary Insured Name</Label>
                    <Input id="primary-insured" placeholder="Enter name of primary insured" value={primaryInsuredName} onChange={(e) => setPrimaryInsuredName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance-relationship">Relationship to Patient</Label>
                    <Input id="insurance-relationship" placeholder="e.g., Self, Spouse, Parent" value={insuranceRelationship} onChange={(e) => setInsuranceRelationship(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valid-until">Valid Until</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <span>{validUntil ? format(validUntil, "MMM dd, yyyy") : "Pick a date"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={validUntil} onSelect={setValidUntil} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance-phone">Insurance Phone Number</Label>
                    <Input id="insurance-phone" placeholder="Enter insurance phone number" value={insurancePhone} onChange={(e) => setInsurancePhone(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Consent & Documents</CardTitle>
                <CardDescription>Upload consent forms and related documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border border-dashed border-gray-300 rounded-lg p-4">
                    <label htmlFor="consent-document" className="flex flex-col items-center gap-2 cursor-pointer">
                      <div className="rounded-lg bg-gray-100 p-6 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium">Upload consent document</span>
                      <span className="text-xs text-muted-foreground">PDF or DOC (max. 5MB)</span>
                      <Input id="consent-document" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setConsentDocument)} />
                    </label>
                    {consentDocument && <div className="mt-2 text-sm text-center">Document selected: {consentDocument.name}</div>}
                  </div>

                  <Checkbox id="consent-checkbox">
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="consent-checkbox" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Patient has provided consent for treatment and data processing
                      </label>
                      <p className="text-sm text-muted-foreground">By checking this box, you confirm that the patient has been informed about their rights and privacy policy.</p>
                    </div>
                  </Checkbox>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading.submit} className="min-w-[150px]">
            {loading.submit ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Patient"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
