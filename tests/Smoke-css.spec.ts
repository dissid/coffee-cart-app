import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Smoke test", () => {
  test("placeOrder", async ({ page }) => {
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await page.locator("a[href='/cart']").click();
    await page.locator(".pay").click();

    await page.locator("#name").fill("Dmytro");
    await page.locator("#email").fill("test@test.com");
    await page.locator("#submit-payment").click();

    await expect(page.locator(".success")).toBeVisible();
    await expect(page.locator("a[href='/cart']")).toContainText("cart (0)");
  });

  test("updateCart", async ({ page }) => {
    await page.locator('.cup-body[aria-label="Cafe Breve"]').click();

    await page.locator("a[href='/cart']").click();
    await page.locator(".list-header+.list-item [aria-label='Add one Cafe Breve']").click();
    await expect(page.locator("a[href='/cart']")).toContainText("cart (2)");

    await expect(page.locator(".pay")).toContainText("$30.00");
  });

  test("removeFromCart", async ({ page }) => {
    await page.locator('.cup-body[aria-label="Flat White"]').click();
    await page.locator('.cup-body[aria-label="Americano"]').click();

    await page.locator("a[href='/cart']").click();
    await page.locator('.list-header + .list-item [aria-label="Remove one Americano"]').click();
    await page.locator('.list-header + .list-item [aria-label="Remove all Flat White"]').click();

    await expect(page.locator(".list p")).toHaveText("No coffee, go add some.");
  });

  test("getDiscountedMocha", async ({ page }) => {
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await page.locator('.cup-body[aria-label="Espresso Macchiato"]').click();
    await page.locator('.cup-body[aria-label="Cappuccino"]').click();

    await expect(page.locator(".promo")).toContainText("It's your lucky day! Get an extra cup of Mocha for $4.");
    await page.locator(".yes").click();

    await page.locator("a[href='/cart']").click();

    await expect(page.locator("#app")).toContainText("(Discounted) Mocha");
    await expect(page.locator("#app")).toContainText("$4.00");
  });

  test("declineDiscountedMocha", async ({ page }) => {
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await page.locator('.cup-body[aria-label="Espresso Macchiato"]').click();
    await page.locator('.cup-body[aria-label="Cappuccino"]').click();

    await page.locator(".yes+button").click();
    await page.locator("a[href='/cart']").click();

    await expect(page.locator("#app")).not.toContainText("(Discounted) Mocha");
    await expect(page.locator("#app")).not.toContainText("$4.00");
  });
});
