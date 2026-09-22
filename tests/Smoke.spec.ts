import { test, expect } from "@playwright/test";

test("placeOrder", async ({ page }) => {
  await page.goto("https://coffee-cart.app/");

  await page.locator('[data-test="Espresso"]').click();
  await page.getByRole("link", { name: "Cart page" }).click();
  await page.locator('[data-test="checkout"]').click();

  await page.getByRole("textbox", { name: "Name" }).fill("Dmytro");
  await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByRole("button", { name: "Thanks for your purchase" })).toBeVisible();
  await expect(page.getByText("cart (0) ")).toBeVisible();
});

test("updateCart", async ({ page }) => {
  await page.goto("https://coffee-cart.app/");

  await page.locator('[data-test="Cafe_Breve"]').click();
  const productPrice = await page.getByRole("heading", { name: "Cafe Breve" }).locator("small").innerText();

  await page.getByRole("link", { name: "Cart page" }).click();
  await page.getByRole("button", { name: "Add one Cafe Breve" }).click();
  await expect(page.getByRole("link", { name: "Cart page" })).toContainText("cart (2)");

  await expect(page.getByText("$30.00", { exact: true })).toBeVisible();
});

test("removeFromCart", async ({ page }) => {
  await page.goto("https://coffee-cart.app/");

  await page.locator('[data-test="Flat_White"]').click();
  await page.locator('[data-test="Americano"]').click();

  await page.getByRole("link", { name: "Cart page" }).click();
  await page.getByRole("button", { name: "Remove one Americano" }).click();
  await page.getByRole("button", { name: "Remove all Flat White" }).click();

  await expect(page.getByRole("paragraph")).toContainText("No coffee, go add some.");
});

test("getDiscountedMocha", async ({ page }) => {
  await page.goto("https://coffee-cart.app/");

  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();

  await expect(page.locator(".promo")).toContainText("It's your lucky day! Get an extra cup of Mocha for $4.");
  await page.getByRole("button", { name: "Yes, of course!" }).click();

  await page.getByRole("link", { name: "Cart page" }).click();

  await expect(page.locator("#app")).toContainText("(Discounted) Mocha");
  await expect(page.locator("#app")).toContainText("$4.00");
});

test("declineDiscountedMocha", async ({ page }) => {
  await page.goto("https://coffee-cart.app/");

  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();

  await page.getByRole("button", { name: "Nah, I'll skip" }).click();
  await page.getByRole("link", { name: "Cart page" }).click();

  await expect(page.locator("#app")).not.toContainText("(Discounted) Mocha");
  await expect(page.locator("#app")).not.toContainText("$4.00");
});
