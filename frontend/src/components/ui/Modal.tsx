import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

type ModalProps = { title: string; onClose: () => void; children: ReactNode };

// Mount to open. The native dialog supplies focus trapping and Escape dismissal.
export function Modal({ title, onClose, children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="form-dialog"
      aria-labelledby={titleId}
      onClose={() => {
        // Ignore a queued cleanup event after Strict Mode reopens the dialog.
        if (!dialog.current?.open) onClose();
      }}
    >
      <div className="section-title">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
