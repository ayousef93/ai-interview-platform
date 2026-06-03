"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-line bg-panel p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <Button
            aria-label="Close modal"
            type="button"
            variant="ghost"
            className="h-9 min-h-9 w-9 px-0"
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
          >
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
