"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRole } from "@/types/user";

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
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, MoreHorizontal, Plus, Search, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/user-context";
// import { TableSkeleton } from '@/components/ui/table-skeleton';

// Extract unique roles and statuses for filters
const roles = Object.values(UserRole);
const statuses = [true, false];

export default function UsersPage() {
  const { users, loading, error, filters, pagination, setFilters, deleteUser, toggleStatus, refreshUsers } = useUserContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<boolean[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Toggle role filter
  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) => 
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  // Toggle status filter
  const toggleStatusLocal = (status: boolean) => {
    setSelectedStatuses((prev) => 
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setActiveFilters(0);
    setFilters({ page: 1, limit: 10 });
  };

  // Apply filters
  const applyFilters = () => {
    const totalActiveFilters = selectedRoles.length + selectedStatuses.length;
    setActiveFilters(totalActiveFilters);
    
    const newFilters = {
      ...filters,
      page: 1,
      role: selectedRoles.length > 0 ? selectedRoles[0] : undefined,
      actif: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
      search: searchQuery || undefined
    };
    
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setFilters({ ...filters, search: undefined });
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery || undefined, page: 1 });
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    
    try {
      await deleteUser(selectedUserId);
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  // Handle user status toggle
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id);
      toast({
        title: "Statut modifié",
        description: "Le statut de l'utilisateur a été modifié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut.",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Utilisateurs</h2>
            <p className="text-muted-foreground">Gérez les utilisateurs et leurs informations.</p>
          </div>
          <Button asChild>
            <Link href="/users/add">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>Liste de tous les utilisateurs avec leurs détails.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Rechercher par nom ou email..." 
                  className="pl-8 w-full md:w-[250px]" 
                  value={searchQuery} 
                  onChange={handleSearch}
                />
              </form>
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className={activeFilters > 0 ? "relative bg-primary/10" : ""}>
                    <Filter className="h-4 w-4" />
                    {activeFilters > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">{activeFilters}</span>}
                    <span className="sr-only">Filtrer</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filtres</h4>
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-muted-foreground">
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Rôle</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {roles.map((role) => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`role-${role}`} 
                              checked={selectedRoles.includes(role)}
                              onCheckedChange={() => toggleRole(role)}
                            />
                            <Label htmlFor={`role-${role}`} className="text-sm font-normal">
                              {role === UserRole.KINESITHERAPEUTE ? "Kinésithérapeute" : "Administrateur"}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Statut</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {statuses.map((status) => (
                          <div key={status ? "active" : "inactive"} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={() => toggleStatusLocal(status)}
                            />
                            <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                              {status ? "Actif" : "Inactif"}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
                      Annuler
                    </Button>
                    <Button size="sm" onClick={applyFilters}>
                      Appliquer les filtres
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Télécharger</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeFilters > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedRoles.map((role) => (
                  <Badge key={`badge-role-${role}`} variant="outline" className="flex items-center gap-1">
                    {role === UserRole.KINESITHERAPEUTE ? "Kinésithérapeute" : "Administrateur"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        toggleRole(role);
                        setActiveFilters((prev) => prev - 1);
                        setFilters({ ...filters, role: undefined });
                      }}
                    />
                  </Badge>
                ))}
                {selectedStatuses.map((status) => (
                  <Badge key={`badge-status-${status}`} variant="outline" className="flex items-center gap-1">
                    {status ? "Actif" : "Inactif"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        toggleStatusLocal(status);
                        setActiveFilters((prev) => prev - 1);
                        setFilters({ ...filters, actif: undefined });
                      }}
                    />
                  </Badge>
                ))}
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Recherche: {searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({ ...filters, search: undefined });
                      }}
                    />
                  </Badge>
                )}
                {activeFilters > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                    Effacer tout
                  </Button>
                )}
              </div>
            )}
            {loading.table ? (
              // <TableSkeleton columns={5} rows={5} />
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Chargement des utilisateurs...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des utilisateurs.</p>
                <Button onClick={refreshUsers}>Réessayer</Button>
              </div>
            ) : (
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="whitespace-nowrap">
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun utilisateur trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getUserInitials(user.nom, user.prenom)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.prenom} {user.nom}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === UserRole.KINESITHERAPEUTE ? "Kinésithérapeute" : "Administrateur"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.actif ? "default" : "secondary"} className={user.actif ? "bg-green-500 text-neutral-50" : "bg-red-500 text-neutral-50"}>
                            {user.actif ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.dateCreation)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/users/${user.id}/edit`}>Modifier</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                                {user.actif ? "Désactiver" : "Activer"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={(filters.page || 1) <= 1}
                >
                  Précédent
                </Button>
                <div className="text-sm">
                  Page {pagination.page} sur {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={(filters.page || 1) >= pagination.totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. L'utilisateur sera définitivement supprimé du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 text-neutral-50 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}