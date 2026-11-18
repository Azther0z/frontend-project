import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

const api = "http://127.0.0.1:5000/api/v1";
let imageServer: Server;
let imageOrigin: string;
const image = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="#edf1f5"/><rect x="220" y="150" width="360" height="230" rx="24" fill="#273746"/><rect x="280" y="110" width="120" height="70" rx="12" fill="#273746"/><circle cx="410" cy="265" r="78" fill="#8fb2cd"/><circle cx="410" cy="265" r="52" fill="#425d73"/></svg>';

test.beforeAll(async () => {
  // A local HTTP image fixture exercises real browser image loading/decoding.
  // The application API and database remain real throughout these tests.
  imageServer = createServer((request, response) => {
    response.setHeader("Cache-Control", "no-store");
    if (request.url === "/equipment.svg") {
      response.writeHead(200, { "Content-Type": "image/svg+xml" });
      response.end(image);
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("<p>This URL is a page, not an image.</p>");
    }
  });
  await new Promise<void>((resolve) => imageServer.listen(0, "127.0.0.1", resolve));
  imageOrigin = `http://127.0.0.1:${(imageServer.address() as AddressInfo).port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) => imageServer.close((error) => error ? reject(error) : resolve()));
});

test("search, dynamic categories, bookmarks, no results, and reset stay server-rendered", async ({ page, request }) => {
  const login = await request.post(`${api}/auth/login`, { data: { email: "admin@example.com", password: "DemoPass123!" } });
  expect(login.status()).toBe(200);
  const headers = { Authorization: `Bearer ${(await login.json()).data.token}` };
  const stamp = Date.now();
  const category = `Optics ${stamp}`;
  const ids: string[] = [];
  const names = [`Camera ${stamp}`, `Tripod ${stamp}`, `Camera bag ${stamp}`];
  try {
    for (const [index, name] of names.entries()) {
      const created = await request.post(`${api}/equipment`, { headers, data: { name, category: index === 0 ? ` ${category} ` : index === 1 ? category.toLowerCase() : `Bags ${stamp}`, description: index === 0 ? "Wide-angle lens" : `Camera ${stamp} support`, quantity: 2, rentalRate: 100 } });
      expect(created.status()).toBe(201);
      ids.push((await created.json()).data._id);
    }
    const browserReads: string[] = [];
    page.on("request", (request) => { if (request.method() === "GET" && request.url().includes("/api/v1/equipment")) browserReads.push(request.url()); });
    await page.goto(`/equipments?q=${stamp}`);
    await expect(page.locator(".result-count:visible")).toHaveText("3 results");
    await expect(page.getByLabel("Category", { exact: true }).locator(`option[value="${category.toLowerCase()}"]`)).toHaveCount(1);
    await page.getByLabel("Category", { exact: true }).selectOption(category.toLowerCase());
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".result-count:visible")).toHaveText("2 results");
    await expect(page.getByLabel("Search equipment")).toHaveValue(String(stamp));
    await page.getByLabel("Search equipment").fill("WIDE-ANGLE");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".result-count:visible")).toHaveText("1 result");
    await expect(page.getByRole("heading", { name: names[0], exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Category", { exact: true })).toHaveValue(category.toLowerCase());
    const html = await (await page.request.get(page.url())).text();
    expect(html).toMatch(new RegExp(`<h2><a[^>]*>${names[0]}<\\/a><\\/h2>`));
    await page.getByLabel("Search equipment").fill("Nothing matches this equipment");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".result-count:visible")).toHaveText("0 results");
    await expect(page.getByText("No equipment matches your search and category. Try different filters.")).toBeVisible();
    await page.getByRole("link", { name: "Reset filters", exact: true }).click();
    await expect(page).toHaveURL("http://localhost:3000/equipments");
    await expect(page.getByLabel("Search equipment")).toHaveValue("");
    await expect(page.getByLabel("Category", { exact: true })).toHaveValue("");
    const bookmark = new URL("http://localhost:3000/equipments");
    bookmark.searchParams.set("q", ` CAMERA ${stamp} `);
    bookmark.searchParams.set("category", ` ${category.toUpperCase()} `);
    await page.goto(bookmark.toString());
    await expect(page.locator(".result-count:visible")).toHaveText("2 results");
    expect(browserReads).toEqual([]);
  } finally {
    for (const id of ids) await request.delete(`${api}/equipment/${id}`, { headers });
  }
});

test("admin checks image links, previews an image, saves it, and can remove it", async ({ page, request }) => {
  const login = await request.post(`${api}/auth/login`, { data: { email: "admin@example.com", password: "DemoPass123!" } });
  expect(login.status()).toBe(200);
  const headers = { Authorization: `Bearer ${(await login.json()).data.token}` };
  let id: string | undefined;
  try {
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await page.getByLabel("Password", { exact: true }).fill("DemoPass123!");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    await page.goto("/equipments/new");
    const name = `Image camera ${Date.now()}`;
    await page.getByLabel("Name", { exact: true }).fill(name);
    await page.getByLabel("Category", { exact: true }).fill(" Images ");
    await page.getByLabel("Description", { exact: true }).fill("Camera with an optional linked image.");
    await page.getByLabel("Quantity", { exact: true }).fill("2");
    await page.getByLabel("Rental Rate", { exact: true }).fill("100");
    await page.getByLabel("Image URL (optional)").fill(`${imageOrigin}/not-an-image`);
    await expect(page.getByRole("img", { name: `Image unavailable for ${name}`, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("The image could not be loaded.");
    await expect(page).toHaveURL("http://localhost:3000/equipments/new");
    await page.getByLabel("Image URL (optional)").fill(`${imageOrigin}/equipment.svg`);
    await expect(page.getByText("Image preview loaded.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page).toHaveURL(/\/equipments\/[a-f0-9]+$/);
    id = page.url().split("/").at(-1)!;
    await expect(page.getByRole("img", { name, exact: true })).toBeVisible();
    const saved = (await (await request.get(`${api}/equipment/${id}`)).json()).data;
    expect(saved.imageUrl).toBe(`${imageOrigin}/equipment.svg`);
    expect(saved.category).toBe("Images");
    await page.goto("/equipments");
    const card = page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card.getByRole("img", { name, exact: true })).toBeVisible();
    await page.screenshot({ path: "test-results/catalog-with-image.png", fullPage: true });
    await page.goto(`/equipments/${id}/edit`);
    await expect(page.getByLabel("Image URL (optional)")).toHaveValue(`${imageOrigin}/equipment.svg`);
    await page.getByLabel("Image URL (optional)").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/equipments/${id}$`));
    await expect(page.getByRole("img", { name, exact: true })).toHaveCount(0);
    expect((await (await request.get(`${api}/equipment/${id}`)).json()).data.imageUrl).toBe("");
    const filteredUrl = `http://localhost:3000/equipments?q=${encodeURIComponent(name)}`;
    await page.goto(filteredUrl);
    await card.getByRole("button", { name: "Delete", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.locator(".result-count:visible")).toHaveText("0 results");
    await expect(page).toHaveURL(filteredUrl);
    id = undefined;
  } finally {
    if (id) await request.delete(`${api}/equipment/${id}`, { headers });
  }
});

test("API validates image URLs and unavailable saved images have a fallback", async ({ page, request }) => {
  const login = await request.post(`${api}/auth/login`, { data: { email: "admin@example.com", password: "DemoPass123!" } });
  expect(login.status()).toBe(200);
  const headers = { Authorization: `Bearer ${(await login.json()).data.token}` };
  const input = { name: `Image URL check ${Date.now()}`, category: "Testing", description: "Image link validation", quantity: 1, rentalRate: 100 };
  for (const imageUrl of ["javascript:alert(1)", "data:image/png;base64,test", "ftp://example.com/photo.png", "https://user:password@example.com/photo.png", "not a URL"]) {
    const rejected = await request.post(`${api}/equipment`, { headers, data: { ...input, imageUrl } });
    expect(rejected.status()).toBe(400);
    expect((await rejected.json()).error).toContain("Image URL");
  }
  const created = await request.post(`${api}/equipment`, { headers, data: { ...input, imageUrl: `${imageOrigin}/not-an-image` } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).data._id;
  try {
    const rejected = await request.put(`${api}/equipment/${id}`, { headers, data: { imageUrl: "javascript:alert(1)" } });
    expect(rejected.status()).toBe(400);
    expect((await (await request.get(`${api}/equipment/${id}`)).json()).data.imageUrl).toBe(`${imageOrigin}/not-an-image`);
    await page.goto(`/equipments/${id}`);
    await expect(page.getByRole("img", { name: `Image unavailable for ${input.name}`, exact: true })).toBeVisible();
    const cleared = await request.put(`${api}/equipment/${id}`, { headers, data: { imageUrl: "" } });
    expect(cleared.status()).toBe(200);
    await page.reload();
    await expect(page.getByRole("img")).toHaveCount(0);
  } finally {
    await request.delete(`${api}/equipment/${id}`, { headers });
  }
});

test("Drive sharing links preview and save while access failures explain sharing", async ({ page, request }) => {
  const login = await request.post(`${api}/auth/login`, { data: { email: "admin@example.com", password: "DemoPass123!" } });
  expect(login.status()).toBe(200);
  const headers = { Authorization: `Bearer ${(await login.json()).data.token}` };
  const sharingUrl = "https://drive.google.com/file/d/Example_File-123/view?usp=sharing&resourcekey=0-test-key";
  // Controlled image responses keep this regression independent of Google and
  // the user's file permissions. The application API/database remain real.
  await page.route("https://drive.google.com/thumbnail?**", async (route) => {
    const id = new URL(route.request().url()).searchParams.get("id");
    await route.fulfill(id === "Private_File-123"
      ? { status: 403, contentType: "text/plain", body: "Access denied" }
      : { status: 200, contentType: "image/svg+xml", body: image });
  });
  let id: string | undefined;
  try {
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await page.getByLabel("Password", { exact: true }).fill("DemoPass123!");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    await page.goto("/equipments/new");
    const name = `Drive camera ${Date.now()}`;
    await page.getByLabel("Name", { exact: true }).fill(name);
    await page.getByLabel("Category", { exact: true }).fill("Testing");
    await page.getByLabel("Description", { exact: true }).fill("Drive file-sharing image");
    await page.getByLabel("Quantity", { exact: true }).fill("1");
    await page.getByLabel("Rental Rate", { exact: true }).fill("100");
    await page.getByLabel("Image URL (optional)").fill("https://drive.google.com/file/d/Private_File-123/view");
    await expect(page.getByRole("img", { name: `Image unavailable for ${name}`, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("Anyone with the link and Viewer");
    await page.getByLabel("Image URL (optional)").fill(sharingUrl);
    await expect(page.getByText("Image preview loaded.", { exact: true })).toBeVisible();
    const src = new URL((await page.getByRole("img", { name, exact: true }).getAttribute("src"))!);
    expect(src.pathname).toBe("/thumbnail");
    expect(src.searchParams.get("id")).toBe("Example_File-123");
    expect(src.searchParams.get("resourcekey")).toBe("0-test-key");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page).toHaveURL(/\/equipments\/[a-f0-9]+$/);
    id = page.url().split("/").at(-1)!;
    expect((await (await request.get(`${api}/equipment/${id}`)).json()).data.imageUrl).toBe(sharingUrl);
    await expect(page.getByRole("img", { name, exact: true })).toBeVisible();
    await page.goto(`/equipments/${id}/edit`);
    await expect(page.getByLabel("Image URL (optional)")).toHaveValue(sharingUrl);
  } finally {
    if (id) await request.delete(`${api}/equipment/${id}`, { headers });
  }
});
