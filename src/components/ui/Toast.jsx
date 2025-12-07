// src/components/ui/Toast.jsx
import { Toaster, toast } from "react-hot-toast";

/**
 * Shared toast base options – PawMart theme
 */
const baseOptions = {
  duration: 3000,
  style: {
    borderRadius: "999px",
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    border: "1px solid rgba(148, 163, 184, 0.4)",
    background: "rgba(15, 23, 42, 0.96)", // dark slate
    color: "#e5e7eb",
    boxShadow:
      "0 18px 45px rgba(15, 23, 42, 0.95), 0 0 0 1px rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(14px)",
  },
};

/**
 * Success / Error / Loading helpers
 */
export const toastSuccess = (msg) =>
  toast.success(msg, {
    ...baseOptions,
    icon: "✅",
    iconTheme: {
      primary: "#22c55e",
      secondary: "#022c22",
    },
  });

export const toastError = (msg) =>
  toast.error(msg, {
    ...baseOptions,
    icon: "⚠️",
    style: {
      ...baseOptions.style,
      borderColor: "rgba(248, 113, 113, 0.6)",
    },
    iconTheme: {
      primary: "#f97373",
      secondary: "#450a0a",
    },
  });

export const toastLoading = (msg = "Processing...") =>
  toast.loading(msg, {
    ...baseOptions,
    duration: 4000,
    icon: "⏳",
  });

/**
 * Optional: promise helper
 * e.g. toastPromise(apiCall(), "Saving listing...");
 */
export const toastPromise = (promise, loadingMsg, successMsg, errorMsg) =>
  toast.promise(
    promise,
    {
      loading: loadingMsg || "Please wait...",
      success: successMsg || "Done!",
      error: errorMsg || "Something went wrong",
    },
    {
      ...baseOptions,
    }
  );

/**
 * Global Toaster – ekbar App er root e render korbo
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        // default style (jodi kono helper chara toast() call koro)
        ...baseOptions,
        success: {
          icon: "✅",
          style: {
            ...baseOptions.style,
            borderColor: "rgba(34, 197, 94, 0.6)",
          },
        },
        error: {
          icon: "⚠️",
          style: {
            ...baseOptions.style,
            borderColor: "rgba(248, 113, 113, 0.6)",
          },
        },
        loading: {
          icon: "⏳",
          style: {
            ...baseOptions.style,
            borderColor: "rgba(59, 130, 246, 0.6)",
          },
        },
      }}
    />
  );
}
