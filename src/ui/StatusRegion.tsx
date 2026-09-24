interface StatusRegionProps {
  message: string;
}

/** aria-live="polite" region for state changes ("Decoding HEIC…", "Copied",
 * errors). Visually hidden; see docs/ui-spec.md#accessibility. */
export function StatusRegion({ message }: StatusRegionProps) {
  return (
    <div role="status" aria-live="polite" className="visually-hidden">
      {message}
    </div>
  );
}
