import { DashboardLayout } from "@/components/dashboard-layout";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <AuthProvider >
      <Toaster richColors position="top-right" />
      {children}
      </AuthProvider>
    </DashboardLayout>
  );
}
