"use client"

import * as React from "react"

// Simple toast context
const ToastContext = React.createContext<{
  toast: (message: string, type?: "success" | "error" | "info") => void
}>({
  toast: () => {},
})

export function Toaster() {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string
      message: string
      type: "success" | "error" | "info"
    }>
  >([])

  const toast = React.useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`px-4 py-2 rounded-md shadow-lg animate-in slide-in-from-right ${
              type === "success"
                ? "bg-green-600 text-white"
                : type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
            }`}
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Simple toast hook
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a Toaster")
  }
  return context
}

// Export toast function for direct use
export const toast = {
  success: (message: string) => {
    // This is a simplified version - in a real app you'd use the context
    console.log("Success:", message)
  },
  error: (message: string) => {
    console.log("Error:", message)
  },
  info: (message: string) => {
    console.log("Info:", message)
  },
}
