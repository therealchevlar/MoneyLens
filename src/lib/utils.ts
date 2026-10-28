import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'PKR',
  compact: boolean = false
): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  if (compact) {
    if (Math.abs(safeAmount) >= 1_000_000) {
      return `${currency} ${(safeAmount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(safeAmount) >= 100_000) {
      return `${currency} ${(safeAmount / 1_000).toFixed(0)}k`;
    }
  }
  return `${currency} ${Math.round(safeAmount).toLocaleString('en-US')}`;
}

export function formatPKR(amount: number, compact: boolean = false): string {
  return formatCurrency(amount, 'PKR', compact);
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const safeVal = isNaN(value) ? 0 : value;
  const sign = includeSign && safeVal > 0 ? '+' : '';
  return `${sign}${safeVal.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
