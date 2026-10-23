function positive(value: number, allowZero = false) {
  if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0))
    throw new RangeError("Expected a finite positive value");
}
/** Strong acid / strong base, including water autoionization at 25 °C. */
export function neutralization(baseMl: number) {
  positive(baseMl, true);
  const acidMmol = 2;
  const baseMmol = 0.1 * baseMl;
  const excess = (acidMmol - baseMmol) / (20 + baseMl);
  const h =
    excess >= 0
      ? (excess + Math.sqrt(excess * excess + 4e-14)) / 2
      : 2e-14 / (-excess + Math.sqrt(excess * excess + 4e-14));
  return {
    ph: -Math.log10(h),
    acidMmol: Math.max(0, acidMmol - baseMmol),
    baseMmol: Math.max(0, baseMmol - acidMmol),
    volumeMl: 20 + baseMl,
  };
}
export type Electrolyte = "salt" | "acid" | "sugar";
export function electrolyte(concentration: number, sample: Electrolyte) {
  positive(concentration);
  const ka = 1.8e-5;
  const alpha =
    sample === "salt"
      ? 1
      : sample === "sugar"
        ? 0
        : (2 * ka) / (ka + Math.sqrt(ka * ka + 4 * ka * concentration));
  return {
    alpha,
    ionConcentration: 2 * concentration * alpha,
    index: (100 * concentration * alpha) / 0.1,
  };
}
export function precipitate(addedMl: number, chloride: boolean) {
  positive(addedMl, true);
  const solidMmol = chloride ? Math.min(2, 0.1 * addedMl) : 0;
  return {
    solidMmol,
    massGrams: solidMmol * 0.14332,
    silverMmol: 2 - solidMmol,
    chlorideMmol: chloride ? 0.1 * addedMl - solidMmol : 0,
  };
}
export function gasVolume(pressureAtm: number) {
  positive(pressureAtm);
  return (0.05 * 0.082057 * 298.15) / pressureAtm;
}
export function temperatureRate(celsius: number) {
  if (!Number.isFinite(celsius) || celsius <= -273.15)
    throw new RangeError("Temperature must exceed absolute zero");
  return (
    0.02 *
    Math.exp((-45000 / 8.314462618) * (1 / (celsius + 273.15) - 1 / 298.15))
  );
}
export function reactantAt(celsius: number, seconds: number) {
  positive(seconds, true);
  return 0.1 * Math.exp(-temperatureRate(celsius) * seconds);
}
/** Qualitative interpolation only; not a measured diffusion coefficient. */
export function diffusionFraction(celsius: number, elapsed: number) {
  if (!Number.isFinite(celsius) || celsius < 0 || celsius > 100)
    throw new RangeError("Temperature out of model range");
  positive(elapsed, true);
  return 1 - Math.exp(-elapsed * 0.055 * Math.pow(2, (celsius - 25) / 20));
}
