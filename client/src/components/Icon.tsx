const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  question: <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" />,
  up: <path d="M4 16l6-6 4 4 6-6M15 8h5v5" />,
  down: <path d="M4 8l6 6 4-4 6 6M15 16h5v-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  replay: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  trophy: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />,
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
}

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}