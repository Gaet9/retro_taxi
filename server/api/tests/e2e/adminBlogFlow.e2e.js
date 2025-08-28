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
            const notificationLogin = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Login successful')]")), 1000);
            await driver.wait(until.elementIsVisible(notificationLogin), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // go back to blogs page
        await driver.wait(until.urlContains("blogs"), 10000);
        const adminBtn = await driver.wait(until.elementLocated(By.id("admin-icon-id")), 5000);
        await driver.wait(until.elementIsVisible(adminBtn), 5000);
        await adminBtn.click();

        // Go to admin page
        await driver.wait(until.urlContains("admin-dash"), 10000);
        const goToNewBlogBtn = await driver.wait(until.elementLocated(By.id("goToNewblog-btn-id")), 5000);
        await driver.wait(until.elementIsVisible(goToNewBlogBtn), 5000);
        await goToNewBlogBtn.click();

        // Go to New blog page
        await driver.wait(until.urlContains("new-blog"), 10000);
        const formNewBlog = await driver.wait(until.elementLocated(By.id("formNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(formNewBlog), 5000);

        // Fill the sections of the new blog
        // title
        const titleNewBlog = await driver.wait(until.elementLocated(By.id("titleNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(titleNewBlog), 5000);
        await titleNewBlog.sendKeys("End-to-end testing title");

        // brand
        const brandNewBlog = await driver.wait(until.elementLocated(By.id("brandNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(brandNewBlog), 5000);
        await brandNewBlog.sendKeys("End-to-end testing brand");

        // model
        const modelNewBlog = await driver.wait(until.elementLocated(By.id("modelNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(modelNewBlog), 5000);
        await modelNewBlog.sendKeys("End-to-end testing model");

        // category
        const categoryNewBlog = await driver.wait(until.elementLocated(By.id("categoryNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(categoryNewBlog), 5000);
        await categoryNewBlog.sendKeys("End-to-end testing category");

        // Select user
        const userSelect = await driver.wait(until.elementLocated(By.id("userNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(userSelect), 5000);
        const option = await userSelect.findElement(By.css("option[value='5']"));
        await option.click();

        // Content
        const contentNewBlog = await driver.wait(until.elementLocated(By.id("contentNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(contentNewBlog), 5000);
        await contentNewBlog.sendKeys("End-to-end testing content for the blog");

        // submit
        const submitNewBlogBtn = await driver.wait(until.elementLocated(By.id("submitNewBlog-id")), 5000);
        await driver.wait(until.elementIsVisible(submitNewBlogBtn), 5000);
        await submitNewBlogBtn.click();

        // receive success notification
        try {
            const notificationNewBlog = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'Blog saved to draft')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationNewBlog), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // Redirect to admin page
        await driver.wait(until.urlContains("admin-dash"), 10000);
        const BlogList = await driver.wait(until.elementLocated(By.id("listOfBlogs-id")), 5000);
        const blogs = await BlogList.findElements(By.css(":scope > *")); // select list of blogs
        const lastBlogOfList = blogs[blogs.length - 1];
        await driver.wait(until.elementIsVisible(lastBlogOfList), 5000);
        const modifyButton = await lastBlogOfList.findElement(By.xpath(".//a[normalize-space(.)='Modify']"));
        await modifyButton.click();

        // go to update blog page
        await driver.wait(until.urlContains("update-blog"), 10000);
        const contentUpdateBlog = await driver.wait(until.elementLocated(By.xpath("//textarea[contains(@placeholder, 'Content')]")), 5000);
        await driver.wait(until.elementIsVisible(contentUpdateBlog), 5000);
        await contentUpdateBlog.clear();
        await contentUpdateBlog.sendKeys("End-to-end testing content for the blog updated after test-update");
        // Save updated blog
        const publishUpdateBtn = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Save and publish')]")), 5000);
        await driver.wait(until.elementIsVisible(publishUpdateBtn), 5000);
        await publishUpdateBtn.click();

        // receive update success notification
        try {
            const notificationUpdate = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Blog updated!')]")), 1000);
            await driver.wait(until.elementIsVisible(notificationUpdate), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // go to admin dashboard and delete last blog created
        await driver.wait(until.urlContains("admin-dash"), 10000);
        const BlogList2 = await driver.wait(until.elementLocated(By.id("listOfBlogs-id")), 5000);
        const blogs2 = await BlogList2.findElements(By.css(":scope > *")); // select list of blogs
        const lastBlogOfList2 = blogs2[blogs2.length - 1];
        await driver.wait(until.elementIsVisible(lastBlogOfList2), 5000);
        const deleteButton = await lastBlogOfList2.findElement(By.xpath(".//button[contains(., 'Delete')]"));
        await deleteButton.click();

        // Confimr in dialog box
        const dialog = await driver.wait(until.elementLocated(By.css('[role="alertdialog"]')), 5000);
        const dialogText = await dialog.getText();
        console.log("✅ Custom dialog text:", dialogText);
        const confirmButton = await dialog.findElement(By.xpath(".//button[contains(., 'Confirm')]"));
        await confirmButton.click();

        // receive delete success notification
        try {
            const notificationSuccess2 = await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'Blog deleted successfully')]")),
                1000
            );
            await driver.wait(until.elementIsVisible(notificationSuccess2), 1000);
            console.log("✅ Success notification found");
        } catch {
            console.warn("⚠ Success notification not seen before redirect");
        }

        // Assert post-login URL
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("admin-dash")) {
            throw new Error(`Expected admin page, got ${currentUrl}`);
        }
        console.log("✅ Sign up flow successful:", currentUrl);
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await driver.quit();
    }
})();
