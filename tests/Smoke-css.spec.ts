import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Smoke test", () => {
  test("placeOrder", async ({ page }) => {
    await page.locator("[data-test='Espresso']").click();
    await page.locator("[aria-label='Cart page']").click();
    await page.locator("[data-test='checkout']").click();

    await page.locator("#name").fill("Dmytro");
    await page.locator("#email").fill("test@test.com");
    await page.locator("#submit-payment").click();

    await expect(page.locator(".success")).toBeVisible();
    await expect(page.locator("[aria-label='Cart page']")).toContainText("cart (0)");
  });

  test("updateCart", async ({ page }) => {
    await page.locator("[data-test='Cafe_Breve']").click();
    const productPrice = await page.locator('h4:text-is("Cafe Breve")').locator("small").innerText();

    await page.locator("[aria-label='Cart page']").click();
    await page.locator(".list-header+.list-item [aria-label='Add one Cafe Breve']").click();
    await expect(page.locator("[aria-label='Cart page']")).toContainText("cart (2)");

    await expect(page.locator("[aria-label='Proceed to checkout']")).toContainText("$30.00");
  });

  test("removeFromCart", async ({ page }) => {
    await page.locator('[data-test="Flat_White"]').click();
    await page.locator('[data-test="Americano"]').click();

    await page.locator("[aria-label='Cart page']").click();
    await page.locator("[aria-label='Remove all Americano']").click();
    await page.locator(".modal+ul [aria-label='Remove one Flat White'] ").click();

    await expect(page.locator(".list p")).toHaveText("No coffee, go add some.");
  });

  test("getDiscountedMocha", async ({ page }) => {
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();

    await expect(page.locator(".promo")).toContainText("It's your lucky day! Get an extra cup of Mocha for $4.");
    await page.locator(".yes").click();

    await page.locator("[aria-label='Cart page']").click();

    await expect(page.locator("#app")).toContainText("(Discounted) Mocha");
    await expect(page.locator("#app")).toContainText("$4.00");
  });

  test("declineDiscountedMocha", async ({ page }) => {
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();

    await page.locator(".yes+button").click();
    await page.locator("[aria-label='Cart page']").click();

    await expect(page.locator("#app")).not.toContainText("(Discounted) Mocha");
    await expect(page.locator("#app")).not.toContainText("$4.00");
  });
});
