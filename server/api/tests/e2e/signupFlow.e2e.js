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
        await driver.wait(until.urlContains("login"), 10000);
        const loginForm = await driver.wait(until.elementLocated(By.id("login-form-id")), 5000);
        await driver.wait(until.elementIsVisible(loginForm), 5000);

        // Fill out the form
        const signupBtn = await driver.wait(until.elementLocated(By.id("signup-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(signupBtn), 5000);
        await signupBtn.click();

        await driver.wait(until.urlContains("sign-up"), 10000);
        const signupForm = await driver.wait(until.elementLocated(By.id("signup-form-id")), 5000);
        await driver.wait(until.elementIsVisible(signupForm), 5000);

        const nameFieldSignUp = await driver.wait(until.elementLocated(By.id("name-signup-id")), 5000);
        await driver.wait(until.elementIsVisible(nameFieldSignUp), 5000);
        await nameFieldSignUp.sendKeys(process.env.TEST_NAME_SIGNUP);

        const emailFieldSignUp = await driver.wait(until.elementLocated(By.id("email-signup-id")), 5000);
        await driver.wait(until.elementIsVisible(emailFieldSignUp), 5000);
        await emailFieldSignUp.sendKeys(process.env.TEST_EMAIL_SIGNUP);

        const pwdFieldSignUp = await driver.wait(until.elementLocated(By.id("pwd-signup-id")), 5000);
        await driver.wait(until.elementIsVisible(pwdFieldSignUp), 5000);
        await pwdFieldSignUp.sendKeys(process.env.TEST_PWD_SIGNUP);

        const pwdConfirmFieldSignUp = await driver.wait(until.elementLocated(By.id("pwdConfirm-signup-id")), 5000);
        await driver.wait(until.elementIsVisible(pwdConfirmFieldSignUp), 5000);
        await pwdConfirmFieldSignUp.sendKeys(process.env.TEST_PWD_SIGNUP);

        // Submit form
        const submitBtnSignUp = await driver.wait(until.elementLocated(By.id("submitSignup-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(submitBtnSignUp), 5000);
        await driver.wait(until.elementIsEnabled(submitBtnSignUp), 5000);
        await submitBtnSignUp.click();

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
        const loginIcon = await driver.wait(until.elementLocated(By.id("login-icon")), 5000);
        await driver.wait(until.elementIsVisible(loginIcon));
        await loginIcon.click();

        // Go to login page
        await driver.wait(until.urlContains("login"), 10000);
        loginFormAgain = await driver.wait(until.elementLocated(By.id("login-form-id")), 5000);
        await driver.wait(until.elementIsVisible(loginFormAgain), 5000);

        // Fill out the form
        const emailFieldLogin = await driver.wait(until.elementLocated(By.id("email-id")), 5000);
        await driver.wait(until.elementIsVisible(emailFieldLogin), 5000);
        await emailFieldLogin.sendKeys(process.env.TEST_EMAIL_SIGNUP);

        const pwdFieldLogin = await driver.wait(until.elementLocated(By.id("pwd-id")), 5000);
        await driver.wait(until.elementIsVisible(pwdFieldLogin), 5000);
        await pwdFieldLogin.sendKeys(process.env.TEST_PWD_SIGNUP);

        // Submit form
        const submitBtnLogin = await driver.wait(until.elementLocated(By.id("submitLogin-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(submitBtnLogin), 5000);
        await driver.wait(until.elementIsEnabled(submitBtnLogin), 5000);
        await submitBtnLogin.click();

        // Checking notification
        try {
            const notificationSuccess3 = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'You logged in successfully')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationSuccess3), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // go back to blogs page
        await driver.wait(until.urlContains("blogs"), 10000);
        const blogCard = await driver.wait(until.elementLocated(By.id("blog-card-19")), 5000);
        await driver.wait(until.elementIsVisible(blogCard));
        await blogCard.click();

        // entering single blog and reading content
        await driver.wait(until.urlContains("blogs/19"), 10000);
        const blogContent = await driver.wait(until.elementLocated(By.id("blog-content-id")), 5000);
        await driver.wait(until.elementIsVisible(blogContent));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", blogContent);
        await driver.sleep(1000);

        // going to profile page
        const profileIcon = await driver.wait(until.elementLocated(By.id("profile-icon-id")), 10000);
        await profileIcon.click();
        await driver.wait(until.urlContains("profile"), 10000);

        // Delete profile
        const deleteBtn = await driver.wait(until.elementLocated(By.id("deleteUser-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(deleteBtn));
        await deleteBtn.click();

        // Handle Confirm in dialog box
        const dialog = await driver.wait(until.elementLocated(By.css('[role="alertdialog"]')), 5000);
        const dialogText = await dialog.getText();
        console.log("✅ Custom dialog text:", dialogText);
        const confirmButton = await dialog.findElement(By.xpath(".//button[contains(., 'Confirm')]"));
        await confirmButton.click();

        // receive success notification
        try {
            const notificationSuccess2 = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'profile deleted successfully')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationSuccess2), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // Redirects to login and logged out
        await driver.wait(until.urlContains("blogs"), 10000);
        const loginIconAgain = await driver.wait(until.elementLocated(By.id("login-icon")), 10000);
        await driver.wait(until.elementIsVisible(loginIconAgain));

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("blogs")) {
            throw new Error(`Expected blogs page, got ${currentUrl}`);
        }
        console.log("✅ Sign up flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
