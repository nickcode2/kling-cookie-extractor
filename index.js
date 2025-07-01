const express = require("express");
const puppeteer = require("puppeteer-core");
const { chromium } = require("playwright-core");

const app = express();
const PORT = process.env.PORT || 3000;

const BROWSERLESS_URL = "wss://chrome.browserless.io?token=2SbNglszx5LRXqf7af4b3254e8a57e18c78feaff053203e1e";

app.get("/", async (req, res) => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: BROWSERLESS_URL
  });

  const page = await browser.newPage();
  await page.goto("https://app.klingai.com", { waitUntil: "networkidle2" });

  console.log("Waiting 60 seconds for login...");
  await new Promise(resolve => setTimeout(resolve, 60000)); // 60 sec

  const cookies = await page.cookies();
  await browser.close();

  const klingCookie = cookies.find(
    c =>
      c.name.includes("auth") ||
      c.name.includes("session") ||
      c.domain.includes("klingai")
  );

  res.json(klingCookie || { error: "Cookie not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
