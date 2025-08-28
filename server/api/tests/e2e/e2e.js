// tests/e2e/index.js
const fs = require("fs");
const path = require("path");

async function runTests() {
    const testFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith(".test.js") && file !== "index.js");

    for (const file of testFiles) {
        console.log(`\n➡ Running ${file}...`);
        const testModule = require(path.join(__dirname, file));

        if (typeof testModule === "function") {
            await testModule(); // waits until driver.quit() completes
        } else if (typeof testModule.default === "function") {
            await testModule.default();
        }
    }

    console.log("\n🎉 All E2E tests finished");
}

runTests().catch((err) => {
    console.error("\n❌ E2E tests failed:", err);
    process.exit(1);
});
