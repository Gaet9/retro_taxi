// Import chromedriver and necessary Selenium modules
require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
require("dotenv").config({ path: ".env.test" });

// Main async function to run the Selenium test
(async function openChromeTest() {
    // Initialize Chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:3001/login");

        // Wait for login form
        const loginForm = await driver.wait(until.elementLocated(By.id("login-form-id")), 5000);
        await driver.wait(until.elementIsVisible(loginForm), 5000);

        // Fill out the form
        const emailField = await driver.wait(until.elementLocated(By.id("email-id")), 5000);
        await driver.wait(until.elementIsVisible(emailField), 5000);
        await emailField.sendKeys(process.env.TEST_EMAIL);

        const pwdField = await driver.wait(until.elementLocated(By.id("pwd-id")), 5000);
        await driver.wait(until.elementIsVisible(pwdField), 5000);
        await pwdField.sendKeys(process.env.TEST_PWD);

        // Submit form
        const submitBtn = await driver.wait(until.elementLocated(By.id("submitLogin-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(submitBtn), 5000);
        await driver.wait(until.elementIsEnabled(submitBtn), 5000);
        await submitBtn.click();

        // receive success notification
        try {
            const notificationSuccess = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'Login successful')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationSuccess), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // go back to blogs page
        await driver.wait(until.urlContains("blogs"), 10000);

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("blogs")) {
            throw new Error(`Expected blogs page, got ${currentUrl}`);
        }
        console.log("✅ Login flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
