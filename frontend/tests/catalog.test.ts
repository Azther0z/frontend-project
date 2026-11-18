import { test } from "node:test";
import assert from "node:assert/strict";
import type { Equipment } from "../interface";
import { catalogCategories, filterCatalog } from "../src/libs/catalog";
import { imageSourceUrl, imageUrlError } from "../src/libs/image-url";

const items: Equipment[] = [
  { _id: "a", name: "Camera", description: "Wide-angle lens", category: " Photography ", quantity: 3, rentalRate: 100, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "b", name: "Tripod", description: "Camera support", category: "photography", quantity: 2, rentalRate: 50, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "c", name: "Laptop", description: "Portable computer", category: "Computers", quantity: 1, rentalRate: 200, isActive: true, createdAt: "", updatedAt: "" },
];

test("category options come from data and merge whitespace/case variants", () => {
  assert.deepEqual(catalogCategories(items), [{ value: "computers", label: "Computers" }, { value: "photography", label: "Photography" }]);
  assert.equal(items[0].category, " Photography ");
});

test("search matches name or description and combines with the category", () => {
  assert.deepEqual(filterCatalog(items, " CAMERA ", " PHOTOGRAPHY ").map((item) => item._id), ["a", "b"]);
  assert.deepEqual(filterCatalog(items, "wide-angle", "photography").map((item) => item._id), ["a"]);
  assert.deepEqual(filterCatalog(items, "camera", "computers"), []);
  assert.deepEqual(filterCatalog(items, "", "unknown category"), []);
  assert.deepEqual(filterCatalog(items, "", ""), items);
});

test("optional image links accept HTTP(S) without extension restrictions or credentials", () => {
  for (const value of ["", "  ", "https://example.com/image.jpg", " http://example.com/image?id=1&signature=test "]) assert.equal(imageUrlError(value), null);
  for (const value of ["not a URL", "/image.jpg", "javascript:alert(1)", "data:image/png;base64,test", "ftp://example.com/image.png", "https://user:password@example.com/image", "https://example.com/" + "x".repeat(2048)]) assert.ok(imageUrlError(value));
});

test("Drive file links resolve to thumbnails while retaining resource keys", () => {
  const expected = "https://drive.google.com/thumbnail?id=Example_File-123&sz=w1200";
  for (const url of [
    "https://drive.google.com/file/d/Example_File-123/view?usp=sharing",
    "https://drive.google.com/file/d/Example_File-123/preview",
    "https://drive.google.com/file/u/0/d/Example_File-123/view",
    "https://www.drive.google.com/open?id=Example_File-123",
    "https://drive.google.com/uc?export=download&id=Example_File-123",
    "https://drive.google.com/thumbnail?id=Example_File-123&sz=w200",
  ]) assert.equal(imageSourceUrl(url), expected);
  assert.equal(imageSourceUrl("https://drive.google.com/file/d/Example_File-123/view?resourcekey=0-key_123&usp=sharing"), expected + "&resourcekey=0-key_123");
});

test("direct images, unrelated hosts, and unsupported Drive links are not rewritten", () => {
  for (const url of ["https://example.com/image?signature=abc", "https://lh3.googleusercontent.com/d/Example_File-123", "https://drive.google.com.evil.example/file/d/Example_File-123/view", "https://drive.google.com/drive/folders/Example_File-123", "https://drive.google.com/open?id=bad%2Fid", "https://user:password@drive.google.com/file/d/Example_File-123/view", "not a URL", ""]) {
    assert.equal(imageSourceUrl(url), url);
  }
});
