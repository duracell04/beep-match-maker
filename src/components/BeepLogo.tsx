interface BeepLogoProps {
  variant?: 'ping' | 'traffic' | 'scan' | 'monogram';
  className?: string;
}

export const BeepLogo = ({ variant = 'ping', className = '' }: BeepLogoProps) => {
  if (variant === 'monogram') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <text x="50" y="70" fontSize="60" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">
          B
        </text>
      </svg>
    );
  }

  if (variant === 'traffic') {
    return (
      <svg
        viewBox="0 0 100 140"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="35" y="10" width="30" height="80" rx="15" fill="currentColor" fillOpacity="0.2" />
        <circle cx="50" cy="30" r="8" fill="hsl(var(--success))" />
        <circle cx="50" cy="50" r="8" fill="hsl(var(--warning))" />
        <circle cx="50" cy="70" r="8" fill="hsl(var(--destructive))" />
      </svg>
    );
  }

  if (variant === 'scan') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        strokeWidth="4"
      >
        <rect x="10" y="10" width="80" height="80" rx="8" />
        <rect x="25" y="25" width="15" height="15" fill="currentColor" />
        <rect x="25" y="60" width="15" height="15" fill="currentColor" />
        <rect x="60" y="25" width="15" height="15" fill="currentColor" />
        <rect x="60" y="60" width="15" height="15" fill="currentColor" />
      </svg>
    );
  }

  // ping variant (default)
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="20" fill="currentColor" />
      <circle cx="50" cy="50" r="30" fill="currentColor" fillOpacity="0.3" className="animate-ping" />
      <circle cx="50" cy="50" r="40" fill="currentColor" fillOpacity="0.1" className="animate-pulse-slow" />
    </svg>
  );
};
