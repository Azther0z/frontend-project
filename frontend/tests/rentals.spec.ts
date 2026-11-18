import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("DemoPass123!");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
}

async function chooseRange(page: Page) {
  await page.getByRole("button", { name: /Start date to Return date/ }).click();
  const calendar = page.getByRole("dialog", { name: "Choose rental dates" });
  const days = calendar.locator("button.calendar-day:enabled");
  await days.first().click();
  await days.first().click();
}

test("guest browsing and real member create, view, edit, delete flow", async ({ page }) => {
  await page.goto("/equipments");
  await page.getByRole("link", { name: "Camera", exact: true }).click();
  await expect(page.getByRole("link", { name: "Login to request" })).toBeVisible();
  await login(page, "member@example.com");
  await page.getByRole("link", { name: "Equipment", exact: true }).click();
  const camera = page.locator("article").filter({ has: page.getByRole("heading", { name: "Camera", exact: true }) });
  await camera.getByRole("link", { name: "Rent", exact: true }).click();
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await chooseRange(page);
  await expect(page.getByText(/Total Cost:/)).toContainText("฿100.00 THB");
  await page.getByRole("button", { name: "Rent", exact: true }).click();
  await expect(page).toHaveURL(/\/rentals\/[a-f0-9]+$/);
  await expect(page.getByText("Quantity: 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Rented by: Demo Member", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page.getByText("Rented by: Demo Member", { exact: true })).toBeVisible();
  await page.getByLabel("Quantity", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/\/rentals\/[a-f0-9]+$/);
  await expect(page.getByText("Quantity: 1", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Rental", exact: true }).click();
  const card = page.locator("article").filter({ has: page.getByRole("heading", { name: "Camera", exact: true }) }).last();
  await expect(card).toContainText("Rented by: Demo Member");
  await card.getByRole("button", { name: "Delete", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Delete rental request?" });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const box = await confirmation.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.x + box!.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(Math.abs(box!.y + box!.height / 2 - viewport.height / 2)).toBeLessThan(2);
    expect(box!.width).toBeLessThanOrEqual(viewport.width - 40);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(card).toBeVisible();
  const before = await page.locator("article").count();
  await card.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(before - 1);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("admin equipment CRUD and managing a member rental at the current rate", async ({ page, request }) => {
  await login(page, "admin@example.com");
  await page.getByRole("link", { name: "Equipment", exact: true }).click();
  await expect(page.getByRole("link", { name: "Rent", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Add", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("Camera");
  await page.getByLabel("Category", { exact: true }).fill("Testing");
  await page.getByLabel("Description", { exact: true }).fill("Equipment added through the admin form.");
  await page.getByLabel("Quantity", { exact: true }).fill("3");
  await page.getByLabel("Rental Rate", { exact: true }).fill("1.005");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  // A real duplicate-name rejection must preserve the entered values.
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Description", { exact: true })).toHaveValue("Equipment added through the admin form.");
  const name = `Test equipment ${Date.now()}`;
  await page.getByLabel("Name", { exact: true }).fill(name);
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page).toHaveURL(/\/equipments\/[a-f0-9]+$/);
  const equipmentId = page.url().split("/").at(-1)!;

  const api = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5000"}/api/v1`;
  const member = await request.post(`${api}/auth/login`, { data: { email: "member@example.com", password: "DemoPass123!" } });
  expect(member.ok()).toBeTruthy();
  const { data: { token } } = await member.json();
  const today = new Date().toISOString().slice(0, 10);
  const created = await request.post(`${api}/rentals`, { headers: { Authorization: `Bearer ${token}` }, data: { equipment: equipmentId, quantity: 2, startDate: today, returnDate: today } });
  expect(created.status()).toBe(201);
  const { data: rental } = await created.json();

  await page.getByRole("link", { name: "Rental", exact: true }).click();
  const card = page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
  await expect(card).toContainText("Rented by: Demo Member");
  await card.getByRole("link", { name: "View", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/rentals/${rental._id}$`));
  await expect(page.getByText("Rented by: Demo Member", { exact: true })).toBeVisible();
  await expect(page.getByText(/Total cost:/)).toContainText("฿1.01");
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/rentals/${rental._id}/edit$`));
  await expect(page.getByText("Rented by: Demo Member", { exact: true })).toBeVisible();
  await page.getByLabel("Quantity", { exact: true }).fill("3");
  // An existing completed range must allow a new start more than seven days away.
  await page.locator("button.date-range-trigger").click();
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  const days = page.getByRole("dialog", { name: "Choose rental dates" }).locator("button.calendar-day:enabled");
  await days.first().click();
  await days.first().click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/rentals/${rental._id}$`));
  await expect(page.getByText("Quantity: 3", { exact: true })).toBeVisible();

  await page.goto(`/equipments/${equipmentId}/edit`);
  await page.getByLabel("Rental Rate", { exact: true }).fill("150");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/equipments/${equipmentId}$`));
  await page.goto(`/rentals/${rental._id}`);
  await expect(page.getByText(/Total cost:/)).toContainText("฿150.00");

  await page.goto(`/equipments/${equipmentId}/edit`);
  await page.getByLabel("Quantity", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/equipments/${equipmentId}$`));
  await page.goto(`/rentals/${rental._id}/edit`);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText("Rental quantity exceeds available equipment");
  await expect(page.getByLabel("Quantity", { exact: true })).toHaveValue("3");

  await page.goto(`/equipments/${equipmentId}`);
  await page.screenshot({ path: "test-results/admin-equipment-detail.png", fullPage: true });
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/equipments");
  await expect(page.getByRole("heading", { name, exact: true })).toHaveCount(0);
  await page.goto(`/rentals/${rental._id}`);
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/rentals");
  await expect(page.getByRole("heading", { name, exact: true })).toHaveCount(0);
});

test("registration validates confirmation and signs in at Home", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Name", { exact: true }).fill("Browser Member");
  await page.getByLabel("Email", { exact: true }).fill(`browser-${Date.now()}@example.com`);
  await page.getByLabel("Tel", { exact: true }).fill("0800000003");
  await page.getByLabel("Password", { exact: true }).fill("DemoPass123!");
  await page.getByLabel("Confirm Password", { exact: true }).fill("Mismatch123!");
  await page.getByRole("button", { name: "Register", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText("Passwords do not match.");
  await page.getByLabel("Confirm Password", { exact: true }).fill("DemoPass123!");
  await page.getByRole("button", { name: "Register", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByRole("button", { name: "Logout", exact: true })).toBeVisible();
});

test("guest and member cannot open admin equipment forms, admin cannot rent", async ({ page }) => {
  await page.goto("/equipments/new");
  await expect(page).toHaveURL("http://localhost:3000/login");
  await login(page, "member@example.com");
  await page.goto("/equipments/new");
  await expect(page.locator("main").getByRole("alert")).toHaveText("Only admins can manage equipment.");
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
  await login(page, "admin@example.com");
  await page.goto("/equipments");
  await page.getByRole("link", { name: "Camera", exact: true }).click();
  await expect(page).toHaveURL(/\/equipments\/[a-f0-9]+$/);
  const id = page.url().split("/").at(-1)!;
  await page.goto(`/equipments/${id}/rent`);
  await expect(page.locator("main").getByRole("alert")).toHaveText("Admins cannot create rental requests.");
});

test("calendar allows seven inclusive days and disables the eighth day", async ({ page }) => {
  await login(page, "member@example.com");
  await page.getByRole("link", { name: "Equipment", exact: true }).click();
  const camera = page.locator("article").filter({ has: page.getByRole("heading", { name: "Camera", exact: true }) });
  await camera.getByRole("link", { name: "Rent", exact: true }).click();
  await page.locator("button.date-range-trigger").click();
  const calendar = page.getByRole("dialog", { name: "Choose rental dates" });
  await calendar.getByRole("button", { name: "Next month", exact: true }).click();
  await calendar.getByRole("button", { name: "10", exact: true }).click();
  await expect(calendar.getByRole("button", { name: "16", exact: true })).toBeEnabled();
  await expect(calendar.getByRole("button", { name: "17", exact: true })).toBeDisabled();
  await calendar.getByRole("button", { name: "16", exact: true }).click();
  await expect(page.getByText(/Total Cost:/)).toContainText("฿700.00 THB");
  await page.getByRole("button", { name: "Rent", exact: true }).click();
  await expect(page).toHaveURL(/\/rentals\/[a-f0-9]+$/);
  await expect(page.getByText(/Total cost:/)).toContainText("฿700.00 THB (7 days)");
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/rentals");
});
