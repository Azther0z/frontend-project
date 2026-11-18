import { test } from "node:test";
import assert from "node:assert/strict";
import { latestReturnDate } from "../src/libs/dates";

test("seven inclusive rental days end six dates after the start", () => {
  assert.equal(latestReturnDate("2026-06-10"), "2026-06-16");
  assert.equal(latestReturnDate("2026-06-28"), "2026-07-04");
  assert.equal(latestReturnDate("2026-12-28"), "2027-01-03");
  assert.equal(latestReturnDate("2028-02-25"), "2028-03-02");
});
