import { expect, test } from "@playwright/test";
import { encode } from "next-auth/jwt";

const api = "http://127.0.0.1:5000/api/v1";

test("real API enforces ownership, roles, quantity and date boundaries", async ({ request }) => {
  const today = new Date().toISOString().slice(0, 10);
  const offset = (days: number) => {
    const date = new Date(`${today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const stamp = Date.now();
  const register = async (name: string) => {
    const result = await request.post(`${api}/auth/register`, { data: { name, email: `${name}-${stamp}@example.com`, tel: "0800000004", password: "DemoPass123!", role: "member" } });
    expect(result.status()).toBe(201);
    return (await result.json()).data.token as string;
  };
  const owner = { Authorization: `Bearer ${await register("owner")}` };
  const other = { Authorization: `Bearer ${await register("other")}` };
  const login = await request.post(`${api}/auth/login`, { data: { email: "admin@example.com", password: "DemoPass123!" } });
  expect(login.status()).toBe(200);
  const admin = { Authorization: `Bearer ${(await login.json()).data.token}` };
  const equipment = await request.get(`${api}/equipment`);
  const camera = (await equipment.json()).data.find((item: { name: string }) => item.name === "Camera");
  const input = { equipment: camera._id, quantity: 1, startDate: today, returnDate: today };

  expect((await request.get(`${api}/rentals`)).status()).toBe(401);
  expect((await request.get(`${api}/rentals`, { headers: { Authorization: "Bearer expired-token" } })).status()).toBe(401);
  expect((await request.post(`${api}/equipment`, { headers: owner, data: {} })).status()).toBe(403);
  expect((await request.post(`${api}/rentals`, { headers: admin, data: input })).status()).toBe(403);
  for (const invalid of [{ quantity: 4 }, { quantity: 1.5 }, { startDate: offset(-1) }, { returnDate: offset(7) }, { returnDate: offset(8) }, { returnDate: offset(-1) }]) {
    expect((await request.post(`${api}/rentals`, { headers: owner, data: { ...input, ...invalid } })).status()).toBe(400);
  }
  const created = await request.post(`${api}/rentals`, { headers: owner, data: { ...input, returnDate: offset(6) } });
  expect(created.status()).toBe(201);
  const { data: rental } = await created.json();
  const path = `${api}/rentals/${rental._id}`;
  expect((await request.get(path, { headers: other })).status()).toBe(403);
  expect((await request.put(path, { headers: other, data: { quantity: 2 } })).status()).toBe(403);
  expect((await request.delete(path, { headers: other })).status()).toBe(403);
  const otherList = await request.get(`${api}/rentals`, { headers: other });
  expect((await otherList.json()).data).toEqual([]);
  expect((await request.get(path, { headers: admin })).status()).toBe(200);
  for (const headers of [owner, admin]) {
    const rejected = await request.put(path, { headers, data: { returnDate: offset(7) } });
    expect(rejected.status()).toBe(400);
    expect((await rejected.json()).error).toBe("Rental duration cannot exceed 7 days, counting both start and return dates");
    const unchanged = await request.get(path, { headers });
    expect((await unchanged.json()).data.returnDate.slice(0, 10)).toBe(offset(6));
  }
  const updated = await request.put(path, { headers: admin, data: { quantity: 2 } });
  expect(updated.status()).toBe(200);
  expect((await updated.json()).data.quantity).toBe(2);
  expect((await request.delete(path, { headers: admin })).status()).toBe(200);
  expect((await request.get(path, { headers: owner })).status()).toBe(404);
});

test("a rejected backend token clears the NextAuth session and returns Home", async ({ page, context }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  expect(secret, "Set NEXTAUTH_SECRET in frontend/.env.local before running browser tests").toBeTruthy();
  // Encode a valid local NextAuth session containing an invalid backend token.
  // The backend itself returns 401; no network request is mocked.
  const value = await encode({ secret: secret!, token: { id: "expired-session", name: "Expired Member", role: "member", backendToken: "expired-token" } });
  await context.addCookies([{ name: "next-auth.session-token", value, domain: "localhost", path: "/", httpOnly: true, sameSite: "Lax" }]);
  await page.goto("/rentals");
  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByRole("link", { name: "Login", exact: true })).toBeVisible();
  expect(await (await page.request.get("/api/auth/session")).json()).toEqual({});
});

test("invalid login stays on the form and preserves entered values", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("member@example.com");
  await page.getByLabel("Password", { exact: true }).fill("IncorrectPassword");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText("Email or password is incorrect.");
  await expect(page).toHaveURL("http://localhost:3000/login");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("member@example.com");
});
