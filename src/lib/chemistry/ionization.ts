export type IonizationKind = "acid" | "base";
/** Ideal monoprotic acid or the conjugate acid BH+ of a weak base.
 * Relative solubility assumes excess neutral solid and an externally fixed pH. */
export function ionization(kind: IonizationKind, ph: number, pka: number) {
  if (
    ![ph, pka].every(Number.isFinite) ||
    ph < 0 ||
    ph > 14 ||
    pka < 0 ||
    pka > 14 ||
    !["acid", "base"].includes(kind)
  )
    throw new RangeError("Outside the educational model range");
  const exponent = kind === "acid" ? ph - pka : pka - ph;
  const ratio = 10 ** exponent;
  const neutralFraction = 1 / (1 + ratio);
  return {
    neutralFraction,
    ionizedFraction: ratio / (1 + ratio),
    ionizedToNeutral: ratio,
    relativeSolubility: 1 + ratio,
    logRelativeSolubility: Math.log1p(ratio) / Math.LN10,
  };
}
