"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ open, message, type = "success", onClose }: ToastProps) {
  if (!open || !message) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[60] max-w-sm w-[calc(100vw-2rem)] bg-white border shadow-xl rounded-2xl overflow-hidden">
      <div className={`h-1 ${isSuccess ? "bg-green-500" : "bg-red-500"}`} />
      <div className="p-4 flex items-start gap-3">
        <div className={isSuccess ? "text-green-600" : "text-red-600"}>
          {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1 text-sm text-gray-700 leading-6">{message}</div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
