import { test, expect } from "@playwright/test";

test("Remove drink", async ({ page }) => {
  await page.goto("https://coffee-cart.app/");

  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('aria-label="Cart page"').click();
  await page.locator(".delete").click();

  await page.getByText("No coffee, go add some.").click();
});
