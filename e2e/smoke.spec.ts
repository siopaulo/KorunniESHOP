import { expect, test } from "@playwright/test";

test.describe("Public smoke", () => {
  test("homepage loads with main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("products page loads", async ({ page }) => {
    await page.goto("/produkty");
    await expect(page.getByRole("heading", { name: /produkty/i })).toBeVisible();
  });

  test("legal page loads from DB or fallback", async ({ page }) => {
    await page.goto("/obchodni-podminky");
    await expect(page.getByRole("heading", { name: /obchodní podmínky/i })).toBeVisible();
  });

  test("reference page loads", async ({ page }) => {
    await page.goto("/reference");
    await expect(page.getByRole("heading", { name: /reference/i })).toBeVisible();
  });
});

test.describe("Cookie consent", () => {
  test("banner can be dismissed with essential-only choice", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("dialog", { name: /nastavení cookies/i });
    await expect(banner).toBeVisible();
    await page.getByRole("button", { name: /jen nezbytné/i }).click();
    await expect(banner).toBeHidden();

    await page.reload();
    await expect(banner).toBeHidden();
  });
});

test.describe("Admin", () => {
  test("login page renders form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel(/e-mail/i)).toBeVisible();
    await expect(page.getByLabel(/heslo/i)).toBeVisible();
  });
});
