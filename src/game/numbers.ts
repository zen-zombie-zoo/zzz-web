import Decimal from 'decimal.js';

export type D = Decimal;

/** Coerce any Decimal.Value (number | string | Decimal) to Decimal safely. */
export const n = (n: Decimal.Value) => new Decimal(n);


/** Arithmetic helpers — accept Decimal.Value and coerce internally */

// src/game/numbers.ts

// All values are plain JS numbers now

export function add(a: number, b: number): number {
  return a + b;
}

export function sub(a: number, b:number):number {
  return a - b
}

export function mul(a: Decimal.Value, b: Decimal.Value) { return n(a).mul(b); }
export function div(a: Decimal.Value, b: Decimal.Value) { return n(a).div(b); }
export function pow(a: Decimal.Value, b: number)         { return n(a).pow(b); }

/** Comparison helpers — accept Decimal.Value and coerce both sides */
export function gt(a: Decimal.Value, b: Decimal.Value)  { return n(a).greaterThan(b); }
export function gte(a: Decimal.Value, b: Decimal.Value) { return n(a).greaterThanOrEqualTo(b); }
export function lt(a: Decimal.Value, b: Decimal.Value)  { return n(a).lessThan(b); }
export function lte(a: Decimal.Value, b: Decimal.Value) { return n(a).lessThanOrEqualTo(b); }
export function eq(a: Decimal.Value, b: Decimal.Value)  { return n(a).equals(b); }

/**
 * Human-friendly formatting.
 * Accepts Decimal.Value and coerces safely to avoid runtime crashes.
 */
// export function fmt(n: Decimal.Value, digits = 2): string {
//   const x = n(n);
//   const abs = x.abs();
//   if (abs.lessThan(1_000))            return x.toFixed(digits);
//   if (abs.lessThan(1_000_000))        return x.div(1_000).toFixed(digits) + 'K';
//   if (abs.lessThan(1_000_000_000))    return x.div(1_000_000).toFixed(digits) + 'M';
//   if (abs.lessThan('1e12'))           return x.div('1e9').toFixed(digits) + 'B';
//   return x.toExponential(digits);
// }
