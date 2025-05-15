"use client";

import { useState } from "react";
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

// Form schema
const formSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle valide" }),
  }),
  actif: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const { createUser, loading } = useUserContext();
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.KINESITHERAPEUTE,
      actif: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Remove confirmPassword as it's not part of the API
      const { confirmPassword, ...userData } = values;
      
      await createUser(userData);
      
      toast({
        title: "Utilisateur ajouté",
        description: "L'utilisateur a été ajouté avec succès",
      });
      
      router.push("/users");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const goToNextTab = () => {
    if (activeTab === "personal") {
      // Validate first tab fields
      form.trigger(["prenom", "nom", "email"]);
      
      // Check if there are any errors
      const errors = form.formState.errors;
      if (!errors.prenom && !errors.nom && !errors.email) {
        setActiveTab("access");
      }
    } else if (activeTab === "access") {
      // Validate second tab fields
      form.trigger(["password", "confirmPassword"]);
      
      // Check if there are any errors
      const errors = form.formState.errors;
      if (!errors.password && !errors.confirmPassword) {
        setActiveTab("settings");
      }
    }
  };

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
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Ajouter un utilisateur</h1>
          <p className="text-muted-foreground">Créez un nouvel utilisateur pour votre cabinet.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
              <TabsTrigger value="access">Rôle & accès</TabsTrigger>
              <TabsTrigger value="settings">Paramètres du compte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Entrez les informations de base de l'utilisateur.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Cet email sera utilisé pour la connexion et les notifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button type="button" onClick={goToNextTab}>
                  Continuer
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="access" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rôle & accès</CardTitle>
                  <CardDescription>Configurez les informations d'accès et le rôle de l'utilisateur.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Mot de passe" {...field} />
                        </FormControl>
                        <FormDescription>
                          Le mot de passe doit contenir au moins 8 caractères.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirmer le mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                </CardContent>
              </Card>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("personal")}
                >
                  Précédent
                </Button>
                <Button type="button" onClick={goToNextTab}>
                  Continuer
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                  <CardDescription>Définir les paramètres additionnels du compte.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="actif"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Statut du compte</FormLabel>
                          <FormDescription>
                            Activer ou désactiver ce compte utilisateur.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("access")}
                >
                  Précédent
                </Button>
                <Button type="submit" disabled={loading.submit}>
                  {loading.submit ? "Création en cours..." : "Créer l'utilisateur"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}