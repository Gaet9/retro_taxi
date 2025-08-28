// Import chromedriver and necessary Selenium modules
require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
require("dotenv").config({ path: ".env.test" });

// Main async function to run the Selenium test
(async function openChromeTest() {
    // Initialize Chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:3001/");

        // Click Discover
        const discoverLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Discover')]")), 10000);
        await discoverLink.click();

        // Wait until blogs page
        await driver.wait(until.urlContains("blogs"), 10000);
        const loginIcon = await driver.wait(until.elementLocated(By.id("login-icon")), 10000);
        await driver.wait(until.elementIsVisible(loginIcon), 5000);

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
