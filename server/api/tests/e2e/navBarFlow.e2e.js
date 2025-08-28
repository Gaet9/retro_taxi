// Import chromedriver and necessary Selenium modules
require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
require("dotenv").config({ path: ".env.test" });

// LOGIN ADMIN ROLE TO TRY OUT FULL NAV BAR
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
        const HomeBtn = await driver.wait(until.elementLocated(By.id("homenav-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(HomeBtn), 5000);
        await HomeBtn.click();

        // go to home page
        await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Discover')]")), 10000);
        const blogsBtn = await driver.wait(until.elementLocated(By.id("blogsnav-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(blogsBtn), 5000);
        await blogsBtn.click();

        // go to blogs page
        await driver.wait(until.urlContains("blogs"), 10000);
        const aboutBtn = await driver.wait(until.elementLocated(By.id("aboutnav-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(aboutBtn), 5000);
        await aboutBtn.click();

        // go to about page
        await driver.wait(until.urlContains("about"), 10000);
        const contactBtn = await driver.wait(until.elementLocated(By.id("contactnav-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(contactBtn), 5000);
        await contactBtn.click();

        // go to contact page
        try {
            await driver.wait(until.urlContains("contact"), 10000);
            console.log("in contact");
            const adminBtn = await driver.wait(until.elementLocated(By.id("admin-icon-id")), 5000);
            console.log("button located");
            await driver.wait(until.elementIsVisible(adminBtn), 5000);
            console.log("button visible");
            await adminBtn.click();
            console.log("button clicked");

            // go to admin page
            await driver.wait(until.urlContains("admin-dash"), 10000);
            console.log("in admin dash");
            const logoutBtn = await driver.wait(until.elementLocated(By.id("logout-icon-id")), 5000);
            console.log("logout button found");
            await driver.wait(until.elementIsVisible(logoutBtn), 5000);
            console.log("Logout button visible");
            await logoutBtn.click();
            console.log("button clicked");
        } catch {
            console.log("there has been an error");
        }

        try {
            const notificationSuccess2 = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'You have been logged out')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationSuccess2), 5000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("❌ Success notification not seen before redirect");
        }

        // logged out, back to login
        await driver.wait(until.urlContains("login"), 10000);

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("login")) {
            throw new Error(`Expected login page, got ${currentUrl}`);
        }
        console.log("✅ nav bar flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
