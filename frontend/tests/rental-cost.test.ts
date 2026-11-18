import { test } from "node:test";
import assert from "node:assert/strict";
import { rentalCost } from "../src/libs/rental-cost";

test("inclusive days, quantity-independent cost, and decimal halfway rounding", () => {
  assert.deepEqual(rentalCost(100, "2026-06-10", "2026-06-10"), { days: 1, total: 100, currency: "THB" });
  assert.equal(rentalCost(100, "2026-06-10", "2026-06-12")?.total, 300);
  assert.equal(rentalCost(1.005, "2026-06-10", "2026-06-10")?.total, 1.01);
  assert.equal(rentalCost(100.005, "2026-06-10", "2026-06-12")?.total, 300.02);
  assert.equal(rentalCost(1e-7, "2026-06-10", "2026-06-10")?.total, 0);
  assert.deepEqual(rentalCost(100, "2026-06-10", "2026-06-16"), { days: 7, total: 700, currency: "THB" });
  assert.equal(rentalCost(100, "2026-02-30", "2026-03-01"), null);
  assert.equal(rentalCost(100, "2026-06-12", "2026-06-10"), null);
  assert.equal(rentalCost(100, null, null), null);
  assert.equal(rentalCost(null, "2026-06-10", "2026-06-10"), null);
});
