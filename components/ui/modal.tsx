"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, description, children, className }, ref) => {
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && open) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full max-w-lg rounded-lg border border-[#2d2d2d] bg-[#141414] p-6 shadow-lg",
            className
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-[#e4e4e7]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-[#a1a1aa]"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Body */}
          <div className="text-[#e4e4e7]">{children}</div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-[#0f0f0f] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
