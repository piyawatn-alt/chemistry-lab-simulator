import { test } from "node:test";
import assert from "node:assert/strict";
import {
  neutralization,
  electrolyte,
  precipitate,
  gasVolume,
  temperatureRate,
  reactantAt,
  diffusionFraction,
} from "./experiments";
const close = (a: number, b: number) =>
  assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);
test("neutralization conserves stoichiometric excess and handles equivalence stably", () => {
  close(neutralization(0).ph, 1);
  close(neutralization(20).ph, 7);
  close(neutralization(10).acidMmol, 1);
  close(neutralization(30).baseMmol, 1);
  close(neutralization(30).volumeMl, 50);
  assert.ok(neutralization(19.999).ph < 7);
  assert.ok(neutralization(20.001).ph > 7);
  close(neutralization(40).ph, 14 + Math.log10(2 / 60));
});
test("electrolyte distinguishes molecules and ions; weak-acid dissociation obeys Ka", () => {
  close(electrolyte(0.1, "salt").index, 100);
  close(electrolyte(0.1, "sugar").ionConcentration, 0);
  const c = 0.1,
    a = electrolyte(c, "acid");
  close((c * a.alpha) ** 2 / (c * (1 - a.alpha)), 1.8e-5);
  assert.ok(a.index > 0 && a.index < 100);
  assert.ok(electrolyte(0.01, "acid").alpha > a.alpha);
});
test("precipitation uses limiting reagent and conserves silver/chloride", () => {
  for (const ml of [0, 5, 10, 20, 30, 40]) {
    const r = precipitate(ml, true);
    close(r.solidMmol + r.silverMmol, 2);
    close(r.solidMmol + r.chlorideMmol, 0.1 * ml);
  }
  close(precipitate(20, true).massGrams, 0.28664);
  close(precipitate(40, true).solidMmol, 2);
  close(precipitate(40, false).massGrams, 0);
});
test("Boyle law preserves PV and halves volume at double pressure", () => {
  close(gasVolume(1), 2 * gasVolume(2));
  for (const p of [0.5, 1, 2, 3])
    close(p * gasVolume(p), 0.05 * 0.082057 * 298.15);
});
test("Arrhenius rate and first-order decay preserve initial condition and temperature ordering", () => {
  close(temperatureRate(25), 0.02);
  close(reactantAt(55, 0), 0.1);
  assert.ok(temperatureRate(55) > temperatureRate(25));
  assert.ok(reactantAt(55, 30) < reactantAt(25, 30));
  close(reactantAt(25, Math.log(2) / 0.02), 0.05);
});
test("qualitative diffusion starts localized and advances faster when warmer", () => {
  close(diffusionFraction(25, 0), 0);
  assert.ok(diffusionFraction(55, 10) > diffusionFraction(15, 10));
  assert.ok(diffusionFraction(25, 60) < 1);
});
test("nonphysical or invalid model inputs fail explicitly", () => {
  for (const fn of [
    () => neutralization(-1),
    () => electrolyte(0, "salt"),
    () => precipitate(-2, true),
    () => gasVolume(0),
    () => temperatureRate(-273.15),
    () => reactantAt(25, -1),
    () => diffusionFraction(101, 2),
    () => gasVolume(NaN),
  ])
    assert.throws(fn, RangeError);
});
