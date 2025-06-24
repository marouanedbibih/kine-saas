"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Gender, PatientRequest } from "@/types/patient";
import { patientService } from "@/services/patient.services";
import { format } from "date-fns";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function AddPatientPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Patient form state using PatientRequest type
  const [patientData, setPatientData] = useState<PatientRequest>({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: Gender.NOT_SPECIFIED,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    altPhone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    emergencyContactRelation: "",
    profilePhotoUrl: "",
    cabinetId: "" // This would be set based on current user's cabinet
  });

  // Handle input changes
  const handleInputChange = (field: keyof PatientRequest, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File upload state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
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
    setLoading(true);
    
    try {
      // TODO: Get cabinetId from user context or authentication
      const patientToCreate = {
        ...patientData,
      };
      
      const createdPatient = await patientService.createPatient(patientToCreate);
      
      toast({
        title: "Success",
        description: "Patient created successfully",
      });
      
      router.push("/patients");
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.response?.data?.message || error.message || "Failed to create patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <TabsTrigger value="contact">Contact & Emergency</TabsTrigger>
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
                      <Input id="first-name" placeholder="Enter first name" value={patientData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="middle-name">Middle Name (Optional)</Label>
                      <Input id="middle-name" placeholder="Enter middle name" value={patientData.middleName || ""} onChange={(e) => handleInputChange("middleName", e.target.value)} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="last-name">
                        Last Name<span className="text-destructive"> *</span>
                      </Label>
                      <Input id="last-name" placeholder="Enter last name" value={patientData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={`w-full justify-start text-left font-normal`}>
                            <span>{patientData.dateOfBirth ? format(new Date(patientData.dateOfBirth), "MMM dd, yyyy") : "Pick a date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : undefined} onSelect={(date) => handleInputChange("dateOfBirth", date ? format(date, "yyyy-MM-dd") : "")} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="gender">
                        Gender<span className="text-destructive"> *</span>
                      </Label>
                      <Select value={patientData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>Male</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          <SelectItem value={Gender.OTHER}>Other</SelectItem>
                          <SelectItem value={Gender.NOT_SPECIFIED}>Not Specified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter address" value={patientData.address || ""} onChange={(e) => handleInputChange("address", e.target.value)} />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" value={patientData.city || ""} onChange={(e) => handleInputChange("city", e.target.value)} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="Enter state" value={patientData.state || ""} onChange={(e) => handleInputChange("state", e.target.value)} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" placeholder="Enter zip code" value={patientData.zipCode || ""} onChange={(e) => handleInputChange("zipCode", e.target.value)} />
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
                      <Input id="email" type="email" placeholder="Enter email address" value={patientData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="phone">
                        Phone Number<span className="text-destructive"> *</span>
                      </Label>
                      <Input id="phone" placeholder="Enter phone number" value={patientData.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="alt-phone">Alternative Phone (Optional)</Label>
                      <Input id="alt-phone" placeholder="Enter alternative phone" value={patientData.altPhone || ""} onChange={(e) => handleInputChange("altPhone", e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact Information</CardTitle>
                <CardDescription>Enter emergency contact details for the patient.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="emergency-name">
                      Contact Name<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                      id="emergency-name"
                      placeholder="Enter emergency contact name"
                      value={patientData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="emergency-relation">
                      Relationship<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                      id="emergency-relation"
                      placeholder="Enter relationship"
                      value={patientData.emergencyContactRelation}
                      onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="emergency-phone">
                      Phone Number<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                      id="emergency-phone"
                      placeholder="Enter emergency contact phone"
                      value={patientData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="emergency-email">Email (Optional)</Label>
                    <Input
                      id="emergency-email"
                      type="email"
                      placeholder="Enter emergency contact email"
                      value={patientData.emergencyContactEmail || ""}
                      onChange={(e) => handleInputChange("emergencyContactEmail", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Photo</h3>
                  <div className="flex items-center gap-4">
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 w-full">
                      <label htmlFor="profile-photo" className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className={`h-32 w-32 rounded-full overflow-hidden bg-gray-100 ${profilePhotoUrl ? "" : "flex items-center justify-center"}`}>
                          {profilePhotoUrl ? (
                            <img src={profilePhotoUrl} alt="Profile preview" className="h-full w-full object-cover" />
                          ) : (
                            <Upload className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{profilePhotoUrl ? "Change photo" : "Upload a profile photo"}</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 2MB)</span>
                        <Input 
                          id="profile-photo" 
                          name="profilePhoto" 
                          type="file" 
                          className="hidden" 
                          accept="image/png, image/jpeg, image/jpg" 
                          onChange={(e) => handleFileChange(e, setProfilePhoto)} 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/patients")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Patient"}
          </Button>
        </div>
      </form>
    </div>
  );
}