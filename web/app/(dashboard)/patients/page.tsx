"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Patient, Gender } from "@/types/patient";
import { PageResponse } from "@/types/pageable";
import { patientService, PatientQueryParams } from "@/services/patient.services";
import { format } from "date-fns";
import { Download, Edit, Filter, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function PatientsPage() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);

  // Query parameters
  const [queryParams, setQueryParams] = useState<PatientQueryParams>({
    page: 1,
    size: 10,
    sortBy: "lastName",
    sortDirection: "ASC"
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<Gender[]>([]);
  
  // Pagination
  const [pagination, setPagination] = useState<{
    page: number;
    totalPages: number;
    totalElements: number;
    size: number;
  }>({
    page: 1,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      let response: PageResponse<Patient>;
      
      // Use search endpoint if there's a search term
      if (searchTerm) {
        response = await patientService.searchPatients(searchTerm, {
          page: queryParams.page,
          size: queryParams.size,
          sortBy: queryParams.sortBy,
          sortDirection: queryParams.sortDirection
        });
      } else {
        response = await patientService.getPatients(queryParams);
      }
      
      setPatients(response.content);
      setPagination({
        page: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        size: response.size
      });
    } catch (error: any) {
      toast({
        title: "Error fetching patients",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [queryParams, searchTerm, toast]);

  // Initial load
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQueryParams(prev => ({
        ...prev,
        page: 1 // Reset to page 1 when searching
      }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle gender filter changes
  useEffect(() => {
    let count = 0;
    
    if (genderFilter.length > 0) {
      count++;
      // We can't directly filter by gender through the API, so we'll need to
      // implement client-side filtering or update our API to support this
    }
    
    if (searchTerm) {
      count++;
    }
    
    setActiveFilterCount(count);
  }, [genderFilter, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      page
    }));
  };

  // Handle sorting change
  const handleSortChange = (field: string) => {
    setQueryParams(prev => {
      const newDirection = 
        prev.sortBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC";
      
      return {
        ...prev,
        sortBy: field,
        sortDirection: newDirection
      };
    });
  };

  // Handle patient selection
  const handlePatientSelection = (patientId: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(patients.map(patient => patient.id));
    } else {
      setSelectedPatients([]);
    }
  };

  // Handle gender filter change
  const handleGenderChange = (gender: Gender) => {
    setGenderFilter(prev => {
      if (prev.includes(gender)) {
        return prev.filter(g => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setGenderFilter([]);
    setQueryParams({
      page: 1,
      size: 10,
      sortBy: "lastName",
      sortDirection: "ASC"
    });
  };

  // Confirm delete
  const confirmDelete = (patientId: string) => {
    setPatientToDelete(patientId);
    setIsDeleteDialogOpen(true);
  };

  // Delete patient
  const handleDeletePatient = async (id: string) => {
    try {
      await patientService.deletePatient(id);
      
      // Update local state
      setPatients(patients.filter(patient => patient.id !== id));
      setSelectedPatients(selectedPatients.filter(selectedId => selectedId !== id));
      
      // Show success notification
      toast({
        title: "Patient deleted",
        description: "The patient record was successfully deleted.",
        variant: "default"
      });
      
      // Close dialog
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error deleting patient",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  // Calculate age
  const calculateAge = (dateOfBirth: string | null): number => {
    if (!dateOfBirth) return 0;

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Get initials
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Filter patients by gender (client-side filtering when needed)
  const filteredPatients = genderFilter.length > 0 
    ? patients.filter(patient => genderFilter.includes(patient.gender as Gender))
    : patients;

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Patients</h1>
            <p className="text-muted-foreground">
              Manage your patients and their medical records.
              {pagination && ` Total patients: ${pagination.totalElements}`}
            </p>
          </div>
          <Button asChild>
            <Link href="/patients/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Patients List</CardTitle>
                <CardDescription>A list of all patients in your clinic with their details.</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search patients..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="relative">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] md:w-[400px]" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filters</h4>
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                          Reset
                          <X className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="male"
                              checked={genderFilter.includes(Gender.MALE)}
                              onCheckedChange={() => handleGenderChange(Gender.MALE)}
                            />
                            <label htmlFor="male">Male</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="female"
                              checked={genderFilter.includes(Gender.FEMALE)}
                              onCheckedChange={() => handleGenderChange(Gender.FEMALE)}
                            />
                            <label htmlFor="female">Female</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="other"
                              checked={genderFilter.includes(Gender.OTHER)}
                              onCheckedChange={() => handleGenderChange(Gender.OTHER)}
                            />
                            <label htmlFor="other">Other</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {genderFilter.map((gender) => (
                  <Badge key={gender} variant="secondary" className="flex items-center gap-1">
                    {gender}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleGenderChange(gender)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {gender} filter</span>
                    </Button>
                  </Badge>
                ))}

                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  </Badge>
                )}

                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs">
                  Clear all
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || genderFilter.length > 0
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Get started by adding your first patient."}
                </p>
                {!searchTerm && genderFilter.length === 0 && (
                  <Button asChild>
                    <Link href="/patients/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Patient
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]">
                          <Checkbox
                            checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[250px]">Patient</TableHead>
                        <TableHead className="hidden md:table-cell">Age / Gender</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden lg:table-cell">Cabinet</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPatients.includes(patient.id)}
                              onCheckedChange={(checked) =>
                                handlePatientSelection(patient.id, !!checked)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={patient.profilePhotoUrl || ""}
                                  alt={`${patient.firstName} ${patient.lastName}`}
                                />
                                <AvatarFallback>
                                  {getInitials(patient.firstName, patient.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <Link
                                  href={`/patients/${patient.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {`${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`}
                                </Link>
                                <span className="text-xs text-muted-foreground md:hidden">
                                  {patient.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{calculateAge(patient.dateOfBirth)} years</span>
                              <span className="text-xs text-muted-foreground">{patient.gender}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{patient.email}</span>
                              <span className="text-xs text-muted-foreground">
                                {patient.phone}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="font-normal">
                              {patient.cabinet.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/patients/${patient.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/patients/${patient.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => confirmDelete(patient.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.size + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.size, pagination.totalElements)}
                      </span>{" "}
                      of <span className="font-medium">{pagination.totalElements}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the patient record and all associated data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => patientToDelete && handleDeletePatient(patientToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}