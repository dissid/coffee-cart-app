import { test, expect } from "@playwright/test";

const uniqueEmail = () => `student-${Date.now()}-${Math.random()}@example.com`;

test.describe("Sign In", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });
  test("Login", async ({ page }) => {
    await page.getByTestId("auth-email").fill("olena@example.com");
    await page.getByTestId("auth-password").fill("password");
    await page.getByTestId("auth-submit").click();

    await expect(page.getByTestId("nav-profile")).toHaveText("olena");
  });
  test("Invalid password", async ({ page }) => {
    await page.getByTestId("auth-email").fill("olena@example.com");
    await page.getByTestId("auth-password").fill("wrong password");
    await page.getByTestId("auth-submit").click();

    await expect(page.getByTestId("error-messages")).toHaveText("email or password неправильні");
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible;
  });
  test("Invalid user", async ({ page }) => {
    const email = uniqueEmail();
    await page.getByTestId("auth-email").fill(email);
    await page.getByTestId("auth-password").fill("password");
    await page.getByTestId("auth-submit").click();

    await expect(page.getByTestId("error-messages")).toHaveText("email or password неправильні");
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible;
  });
});

test.describe("Create an account", () => {
  let email: string;
  let username: string;

  test.beforeAll(async () => {
    email = uniqueEmail();
    username = `username-${Date.now()}`;
  });
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });
  test("Create a new user", async ({ page }) => {
    await page.getByTestId("auth-username").fill(username);
    await page.getByTestId("auth-email").fill(email);
    await page.getByTestId("auth-password").fill("q1w2e3r4");
    await page.getByTestId("register-confirm-password").fill("q1w2e3r4");
    await page.getByText("Social media").click();
    await page.getByTestId("register-source-social").check();
    await page.getByText("Send me the weekly digest of").click();
    await page.getByTestId("register-newsletter").uncheck();
    await page.getByTestId("register-terms").check();
    await page.getByTestId("auth-submit").click();

    await expect(page.getByTestId("nav-profile")).toHaveText(username);
  });

  test("Create a new user with existing email", async ({ page }) => {
    await page.getByTestId("auth-username").fill("Homework#2");
    await page.getByTestId("auth-email").fill(email);
    await page.getByTestId("auth-password").fill("q1w2e3r4");
    await page.getByTestId("register-confirm-password").fill("q1w2e3r4");
    await page.getByText("Social media").click();
    await page.getByTestId("register-source-social").check();
    await page.getByText("Send me the weekly digest of").click();
    await page.getByTestId("register-newsletter").uncheck();
    await page.getByTestId("register-terms").check();
    await page.getByTestId("auth-submit").click();

    await expect(page.getByTestId("error-messages")).toHaveText("body email або username вже зайняті");
    await expect(page.getByText("Create an account", { exact: true })).toBeVisible;
  });

  test("Invalid data for creation", async ({ page }) => {
    await page.getByTestId("auth-username").fill("Homework#2");
    await page.getByTestId("auth-email").fill(email);
    await page.getByTestId("auth-password").fill("q1w2e3r4");
    await page.getByTestId("register-confirm-password").fill("q1w2e3r45");
    await page.getByText("Social media").click();
    await page.getByTestId("register-source-social").check();
    await page.getByText("Send me the weekly digest of").click();
    await page.getByTestId("register-newsletter").uncheck();
    await page.getByTestId("register-terms").check();
    await page.getByTestId("auth-submit").click();

    await expect(page.getByTestId("error-messages")).toHaveText("confirm password doesn't match");
    await expect(page.getByText("Create an account", { exact: true })).toBeVisible;
  });
});
