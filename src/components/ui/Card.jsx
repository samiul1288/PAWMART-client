// components/ui/Card.jsx

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
  imageSrc,
  imageAlt,
  centered = false,
}) {
  const alignment = centered ? "items-center text-center" : "";

  return (
    <div className={`card bg-base-100 shadow-sm ${className}`}>
      {/* Optional image figure (DaisyUI style) */}
      {imageSrc && (
        <figure className="px-10 pt-10">
          <img
            src={imageSrc}
            alt={imageAlt || title || "Card image"}
            className="rounded-xl object-cover max-h-48 w-full"
          />
        </figure>
      )}

      <div className={`card-body ${alignment}`}>
        {/* Title + subtitle block */}
        {(title || subtitle) && (
          <div className={centered ? "space-y-1" : "space-y-1 mb-1"}>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && (
              <p className="opacity-70 text-sm md:text-base">{subtitle}</p>
            )}
          </div>
        )}

        {/* Main content */}
        {children}

        {/* Actions row */}
        {actions && <div className="card-actions mt-2">{actions}</div>}
      </div>
    </div>
  );
}
