require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
require("dotenv").config({ path: ".env.test" });

// Main async function to run the Selenium test
(async function openChromeTest() {
    // Initialize Chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:3001/");

        // Go to contact page
        const contactBtn = await driver.wait(until.elementLocated(By.id("contactnav-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(contactBtn), 5000);
        await contactBtn.click();

        // Find the form
        await driver.wait(until.urlContains("contact"), 10000);
        const formContact = await driver.wait(until.elementLocated(By.id("formContact-id")), 5000);
        await driver.wait(until.elementIsVisible(formContact), 5000);

        // Fill out the form
        const subjectField = await driver.wait(until.elementLocated(By.id("subjectContact-id")), 5000);
        await driver.wait(until.elementIsVisible(subjectField), 5000);
        await subjectField.sendKeys("test contact form subject");

        const nameField = await driver.wait(until.elementLocated(By.id("nameContact-id")), 5000);
        await driver.wait(until.elementIsVisible(nameField), 5000);
        await nameField.sendKeys("test contact form name");

        const emailField = await driver.wait(until.elementLocated(By.id("emailContact-id")), 5000);
        await driver.wait(until.elementIsVisible(emailField), 5000);
        await emailField.sendKeys("test@contact.com");

        const messageField = await driver.wait(until.elementLocated(By.id("messageContact-id")), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", messageField);
        await driver.wait(until.elementIsVisible(messageField), 5000);
        await messageField.sendKeys("test contact form message example");

        const submitContactBtn = await driver.wait(until.elementLocated(By.id("submitContactBtn-id")), 5000);
        await driver.wait(until.elementIsVisible(submitContactBtn), 5000);
        await submitContactBtn.click();

        // receive contact form sent success notification
        try {
            const notificationContactSuccess = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'Contact form sent successfully!')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationContactSuccess), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // redirects to blogs
        await driver.wait(until.urlContains("blogs"), 10000);

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("blogs")) {
            throw new Error(`Expected blogs page, got ${currentUrl}`);
        }
        console.log("✅ Contact flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
