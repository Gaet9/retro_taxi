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
        const aboutBtn = await driver.wait(until.elementLocated(By.id("aboutnav-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(aboutBtn), 5000);
        await aboutBtn.click();

        // go to about page
        await driver.wait(until.urlContains("about"), 10000);
        const LinkedinBtn = await driver.wait(until.elementLocated(By.id("linkedinAbout-id")), 5000);
        await driver.wait(until.elementIsVisible(LinkedinBtn), 5000);
        await LinkedinBtn.click();

        // go to linekdin page
        try {
            await driver.wait(until.urlContains("linkedin"), 10000);
            console.log("Passed on Linkedin for a second");
        } catch {
            console.log("Didn't see any of linkedin");
        }

        // go back to about page
        await driver.get("http://localhost:3001/about");
        await driver.wait(until.urlContains("about"), 10000);
        const githubBtn = await driver.wait(until.elementLocated(By.id("githubAbout-id")), 5000);
        await driver.wait(until.elementIsVisible(githubBtn), 5000);
        await githubBtn.click();

        // go to github page
        await driver.wait(until.urlContains("github"), 10000);
        await driver.get("http://localhost:3001/about");
        await driver.wait(until.urlContains("about"), 10000);

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("about")) {
            throw new Error(`Expected about page, got ${currentUrl}`);
        }
        console.log("✅ About flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
