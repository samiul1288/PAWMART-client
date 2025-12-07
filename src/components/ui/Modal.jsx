// src/components/ui/Modal.jsx
import { useEffect, useRef } from "react";

/**
 * PawMart Modal (DaisyUI <dialog> wrapper)
 *
 * props:
 *  - open: boolean
 *  - onClose: fn
 *  - title?: string
 *  - subtitle?: string
 *  - children: ReactNode
 *  - footer?: ReactNode
 *  - size?: "sm" | "md" | "lg"
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}) {
  const ref = useRef(null);

  // open/close <dialog> natively for accessibility
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  // ESC press → close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && open) onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const sizeClass =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      // click backdrop to close
      onClick={(e) => {
        const dlg = ref.current;
        if (!dlg) return;
        const rect = dlg.getBoundingClientRect();
        const clickedOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;
        if (clickedOutside) onClose?.();
      }}
    >
      <div
        className={[
          "modal-box",
          sizeClass,
          "rounded-3xl border border-base-300/70",
          "bg-base-100/95 dark:bg-base-200/95",
          "shadow-2xl shadow-black/40",
          "backdrop-blur-xl",
          "animate-[fadeIn_0.16s_ease-out]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()} // content click should not close
      >
        {/* Header */}
        {(title || subtitle) && (
          <header className="flex items-start justify-between gap-3 mb-3">
            <div>
              {title && (
                <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
              )}
              {subtitle && (
                <p className="text-xs md:text-sm opacity-70 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm rounded-full text-base-content/80 hover:bg-base-200 dark:hover:bg-base-300/40"
              aria-label="Close"
            >
              ✕
            </button>
          </header>
        )}

        {/* Body */}
        <div className="py-1 space-y-3 text-sm md:text-base">{children}</div>

        {/* Footer */}
        <div className="modal-action mt-4 flex items-center justify-between gap-3">
          <div>{footer}</div>
          <button
            type="button"
            className="btn btn-ghost btn-sm rounded-full px-4"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

/* tailwind keyframes (optional) – if you use custom animations:
   add in tailwind.config.js:
   theme.extend.keyframes.fadeIn = { from:{opacity:0, transform:'translateY(4px)'}, to:{opacity:1, transform:'translateY(0)'} }
   theme.extend.animation.fadeIn = 'fadeIn 0.16s ease-out'
*/
