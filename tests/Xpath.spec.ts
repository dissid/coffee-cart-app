import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("");
});

test("Select rows via checkboxes", async ({ page }) => {
  const checkboxes = page.locator("//*[contains(@data-testid,'interactions-row-select')]");
  await expect(checkboxes.first()).toBeVisible();
  const checkboxCount = await checkboxes.count();

  for (let i = 0; i < checkboxCount; i++) {
    await checkboxes.nth(i).check();
    await expect(page.locator("//*[@data-testid='interactions-selected-count']")).toHaveText("Вибрано: " + (i + 1));
  }
});

test("Sort the table by status", async ({ page }) => {
  await page.locator("//*[@data-testid='interactions-sort-status']").click();
  await expect(page.locator("//tr").nth(1).locator("//*[text()='Failed']")).toBeVisible();

  await page.locator("//*[@data-testid='interactions-sort-status']").click();
  await expect(page.locator("//tr").nth(1).locator("//*[text()='Skipped']")).toBeVisible();
});
