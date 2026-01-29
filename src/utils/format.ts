export function formatNumber(value?: number, unit?: string): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 'Unknown';
  }
  const formatted = value.toLocaleString();
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatList(values: string[]): string {
  if (!values.length) return 'None';
  return values.join(', ');
}

export function displayOrFallback(value?: string | number | null, fallback = 'Unknown'): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number') return formatNumber(value);
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
