/** Ideal irreversible first-order loss in a well-mixed, constant-temperature system.
 * c0: mol/L, k: s^-1, time: s. This is an educational model, not dosing advice. */
export function firstOrder(c0: number, k: number, time: number): number {
  if (![c0, k, time].every(Number.isFinite) || c0 < 0 || k < 0 || time < 0)
    throw new RangeError("Parameters must be finite and nonnegative");
  return c0 * Math.exp(-k * time);
}
export type Atom = "C" | "H" | "O" | "N";
/** A local bond-order sanity check only; does NOT establish chemical validity.
 * Reserved for the later molecular editor. Charge/aromaticity are unsupported. */
export function checkBasicValence(atom: Atom, bondOrders: number[]): boolean {
  const limits = { C: 4, H: 1, O: 2, N: 3 };
  return (
    bondOrders.every((n) => Number.isInteger(n) && n >= 1 && n <= 3) &&
    bondOrders.reduce((a, b) => a + b, 0) <= limits[atom]
  );
}
