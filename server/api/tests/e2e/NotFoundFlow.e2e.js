require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
require("dotenv").config({ path: ".env.test" });

// Main async function to run the Selenium test
(async function openChromeTest() {
    // Initialize Chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        // visit a 404 route
        await driver.get("http://localhost:3001/blogsrubbish");
        const backToBlogsBtn = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Go to blogs page')]")), 1000);
        await driver.wait(until.elementIsVisible(backToBlogsBtn));
        await backToBlogsBtn.click();

        // go back to blogs
        await driver.wait(until.urlContains("blogs"), 10000);

        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("blogs")) {
            throw new Error(`Expected blogs page, got ${currentUrl}`);
        }
        console.log("✅ Not found flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
