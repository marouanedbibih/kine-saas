// import { PatientProvider } from "@/context/PatientContext";
import { Toaster } from "sonner";
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    // <PatientProvider>
    <div>
            <Toaster richColors position="top-right" />
      {children}
      </div>
    // </PatientProvider>
  );
}
