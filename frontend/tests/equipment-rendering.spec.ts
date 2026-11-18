import { expect, test } from "@playwright/test";

const api = "http://127.0.0.1:5000/api/v1";

test("equipment content arrives in server HTML without browser equipment reads", async ({ page }) => {
  const browserReads: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "GET" && request.url().includes("/api/v1/equipment")) browserReads.push(request.url());
  });
  const response = await page.goto("/equipments");
  const html = await response!.text();
  expect(html).toMatch(/<h2><a[^>]*>Camera<\/a><\/h2>/);
  expect(html).toContain("Digital camera with a lens and carrying case.");
  await expect(page.getByRole("heading", { name: "Camera", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Rent", exact: true })).toHaveCount(0);
  const detail = await page.getByRole("link", { name: "Camera", exact: true }).getAttribute("href");
  const detailResponse = await page.goto(detail!);
  expect(await detailResponse!.text()).toContain("<h1>Camera</h1>");
  await expect(page.getByRole("heading", { name: "Camera", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Login to request", exact: true })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(browserReads).toEqual([]);
});

test("server-rendered admin catalog stays fresh after rate edits and list deletion", async ({ page, request }) => {
  const login = await request.post(`${api}/auth/login`, { data: { email: "admin@example.com", password: "DemoPass123!" } });
  expect(login.status()).toBe(200);
  const headers = { Authorization: `Bearer ${(await login.json()).data.token}` };
  const name = `Server catalog ${Date.now()}`;
  const created = await request.post(`${api}/equipment`, { headers, data: { name, category: "Testing", description: "Server-rendered catalog freshness", quantity: 2, rentalRate: 100 } });
  expect(created.status()).toBe(201);
  const { data: item } = await created.json();
  let deleted = false;

  try {
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await page.getByLabel("Password", { exact: true }).fill("DemoPass123!");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    const response = await page.goto("/equipments");
    expect(await response!.text()).toContain("<h1>Manage equipment</h1>");
    const card = page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card).toContainText("฿100.00 / day");
    await expect(card.getByRole("link", { name: "Rent", exact: true })).toHaveCount(0);

    const update = await request.put(`${api}/equipment/${item._id}`, { headers, data: { rentalRate: 150 } });
    expect(update.status()).toBe(200);
    await page.reload();
    await expect(card).toContainText("฿150.00 / day");
    await card.getByRole("button", { name: "Delete", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
    await expect(card).toHaveCount(0);
    expect((await request.get(`${api}/equipment/${item._id}`)).status()).toBe(404);
    deleted = true;
  } finally {
    if (!deleted) await request.delete(`${api}/equipment/${item._id}`, { headers });
  }
});

test("missing equipment renders the server not-found message", async ({ page }) => {
  await page.goto("/equipments/000000000000000000000000");
  await expect(page.getByRole("heading", { name: "Equipment not found", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to equipment", exact: true })).toHaveAttribute("href", "/equipments");
});
