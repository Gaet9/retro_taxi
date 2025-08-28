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
            const notificationSuccess1 = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'You signed up successfully')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationSuccess1), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // go back to blogs page
        await driver.wait(until.urlContains("blogs"), 10000);

        // going to profile page
        const profileIcon = await driver.wait(until.elementLocated(By.id("profile-icon-id")), 10000);
        await profileIcon.click();
        await driver.wait(until.urlContains("profile"), 10000);

        // Delete profile
        const logoutBtn = await driver.wait(until.elementLocated(By.id("logoutUser-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(logoutBtn));
        await logoutBtn.click();

        // receive success notification
        try {
            const notificationLogout = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'You have been logged out')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationLogout), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // Redirects to blogs and logged out
        await driver.wait(until.urlContains("login"), 10000);

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("login")) {
            throw new Error(`Expected login page, got ${currentUrl}`);
        }
        console.log("✅ logout from profile flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
