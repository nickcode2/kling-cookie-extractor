const express = require("express");
const puppeteer = require("puppeteer-core");
const app = express();
const PORT = process.env.PORT || 3000;

const BROWSERLESS_URL = "wss://chrome.browserless.io?token=2SbNglszx5LRXqf7af4b3254e8a57e18c78feaff053203e1e";

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: BROWSERLESS_URL,
    });

    const page = await browser.newPage();
    await page.goto("https://app.klingai.com", { waitUntil: "networkidle2" });

    // Wait up to 60 seconds for login manually (browserless keeps it open)
    await page.waitForTimeout(60000);

    const cookies = await page.cookies();
    const klingCookie = cookies.find(c => c.name === "kling_global");

    await browser.close();
    res.json(klingCookie || { error: "Cookie not found" });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
