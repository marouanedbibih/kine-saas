// src/services/alert.service.ts
import { toast } from "sonner";

/**
 * Supported alert types
 */
export type AlertType = "success" | "error" | "info" | "warning";

/**
 * Options for customizing alerts
 */
export interface AlertOptions {
  /** Duration in milliseconds (default: 4000ms) */
  duration?: number;
  /** Show close button (default: true) */
  dismissible?: boolean;
  /** Optional description or JSX */
  description?: string | React.ReactNode;
  /** Optional custom icon */
  icon?: React.ReactNode;
}

/**
 * Global Alert Service using Sonner
 */
class AlertService {
  success(message: string | React.ReactNode, options?: AlertOptions, p0?: any): string | number {
    return toast.success(message, this.prepareOptions(options));
  }

  error(error: unknown, options?: AlertOptions): string | number {
    const message = this.extractErrorMessage(error);
    return toast.error(message, this.prepareOptions(options));
  }

  info(message: string | React.ReactNode, options?: AlertOptions): string | number {
    return toast.info(message, this.prepareOptions(options));
  }

  warning(message: string | React.ReactNode, options?: AlertOptions): string | number {
    return toast.warning(message, this.prepareOptions(options));
  }

  loading(message: string | React.ReactNode, options?: AlertOptions): string | number {
    return toast.loading(message, this.prepareOptions(options));
  }

  update(
    id: string | number,
    type: AlertType,
    message: string | React.ReactNode,
    options?: AlertOptions
  ): void {
    toast[type](message, {
      id,
      ...this.prepareOptions(options),
    });
  }
  

  dismiss(id: string): void {
    toast.dismiss(id);
  }

  dismissAll(): void {
    toast.dismiss();
  }

  private prepareOptions(options?: AlertOptions): any {
    const defaults = {
      duration: 4000,
      closeButton: true,
    };

    return {
      ...defaults,
      ...options,
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === "string") return error;

    if (error instanceof Error) return error.message;

    if (typeof error === "object" && error !== null) {
      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }

      if ("error" in error && typeof error.error === "string") {
        return error.error;
      }

      try {
        return JSON.stringify(error);
      } catch {
        return "Une erreur inconnue est survenue";
      }
    }

    return "Une erreur inconnue est survenue";
  }
}

export const alertService = new AlertService();
