const express = require("express");
const puppeteer = require("puppeteer-core");
const { executablePath } = require("puppeteer");

const app = express();
app.use(express.json());

const BROWSERLESS_URL = "wss://chrome.browserless.io?token=2SbNglszx5LRXqf7af4b3254e8a57e18c78feaff053203e1e";

app.post("/extract-cookies", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: BROWSERLESS_URL,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const cookies = await page.cookies();
    await browser.close();

    res.json(cookies);
  } catch (error) {
    if (browser) await browser.close();
    console.error("Error extracting cookies:", error);
    res.status(500).json({ error: "Failed to extract cookies" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
