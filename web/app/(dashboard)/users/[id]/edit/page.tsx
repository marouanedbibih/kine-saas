"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUserContext } from "@/context/user-context";
import { UserRole } from "@/types/user";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Update user form schema
const updateUserSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez saisir une adresse email valide" }).optional(),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle valide" }),
  }),
  actif: z.boolean().default(true),
});

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: "Veuillez saisir votre mot de passe actuel" }),
  newPassword: z.string().min(8, { message: "Le nouveau mot de passe doit contenir au moins 8 caractères" }),
  confirmPassword: z.string().min(1, { message: "Veuillez confirmer votre nouveau mot de passe" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getOne, updateUser, changePassword, toggleStatus, loading } = useUserContext();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Update user form
  const updateForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      role: UserRole.KINESITHERAPEUTE,
      actif: true,
    },
  });

  // Password change form
  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const userData = await getOne(id);
        setUser(userData);
        
        // Set form default values
        updateForm.reset({
          prenom: userData.prenom,
          nom: userData.nom,
          email: userData.email,
          role: userData.role,
          actif: userData.actif,
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Erreur lors du chargement des données utilisateur");
      } finally {
        setLoadingUser(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, getOne]);

  // Handle update form submission
  const onUpdateSubmit = async (values: UpdateUserFormValues) => {
    try {
      const { email, ...safeValues } = values;

      await updateUser(id, safeValues);
      
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès",
      });
      router.push("/users");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  // Handle password change form submission
  const onPasswordChangeSubmit = async (values: PasswordChangeFormValues) => {
    try {
      await changePassword(id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      toast({
        title: "Mot de passe modifié",
        description: "Le mot de passe a été modifié avec succès",
      });
      
      // Reset password form
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du mot de passe",
        variant: "destructive",
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    try {
      const updatedUser = await toggleStatus(id);
      
      // Update local state and form
      setUser(updatedUser);
      updateForm.setValue("actif", updatedUser.actif);
      
      toast({
        title: updatedUser.actif ? "Compte activé" : "Compte désactivé",
        description: updatedUser.actif 
          ? "Le compte utilisateur a été activé avec succès" 
          : "Le compte utilisateur a été désactivé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  // If loading or error
  if (loadingUser) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Chargement des informations utilisateur...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild>
          <Link href="/users">Retour à la liste des utilisateurs</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4">Utilisateur introuvable</p>
        <Button asChild>
          <Link href="/users">Retour à la liste des utilisateurs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Modifier un utilisateur</h1>
          <p className="text-muted-foreground">Modifiez les informations de l'utilisateur {user.prenom} {user.nom}.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="role">Rôle & accès</TabsTrigger>
          <TabsTrigger value="settings">Paramètres du compte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarFallback>{getUserInitials(user.nom, user.prenom)}</AvatarFallback>
                </Avatar>
                <p className="text-center text-sm text-muted-foreground">
                  {user.email}
                </p>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Modifiez les informations de base de l'utilisateur.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...updateForm}>
                  <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={updateForm.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={updateForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" disabled {...field} />
                          </FormControl>
                          <FormDescription>
                            L'email ne peut pas être modifié.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading.submit}>
                        {loading.submit ? "Mise à jour..." : "Mettre à jour"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="role" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rôle & accès</CardTitle>
              <CardDescription>Modifiez le rôle et les permissions de l'utilisateur.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-6">
                  <FormField
                    control={updateForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.KINESITHERAPEUTE}>Kinésithérapeute</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Le rôle détermine les permissions de l'utilisateur.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading.submit}>
                      {loading.submit ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>Modifiez les paramètres du compte et le mot de passe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Status */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Statut du compte</h3>
                  <p className="text-sm text-muted-foreground">
                    Activer ou désactiver ce compte utilisateur.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={user.actif ? "default" : "secondary"}
                    className={user.actif ? "bg-green-500 text-neutral-50" : "bg-red-500 text-neutral-50"}
                  >
                    {user.actif ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleStatus}
                    disabled={loading.submit}
                  >
                    {user.actif ? "Désactiver" : "Activer"}
                  </Button>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordChangeSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Mot de passe actuel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Nouveau mot de passe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Le mot de passe doit contenir au moins 8 caractères.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirmer le mot de passe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading.submit}>
                        {loading.submit ? "Modification en cours..." : "Modifier le mot de passe"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-4 mt-8">
                <h3 className="text-lg font-medium text-red-600 mb-2">Zone de danger</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Attention: ces actions sont irréversibles.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Supprimer l'utilisateur</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. L'utilisateur {user.prenom} {user.nom} sera définitivement supprimé du système.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-neutral-50 hover:bg-red-700"
                        onClick={() => {
                          router.push("/users");
                        }}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}