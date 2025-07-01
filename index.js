const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
  });

  const page = await browser.newPage();

  await page.goto("https://app.klingai.com", { waitUntil: "networkidle2" });

  await page.waitForTimeout(10000); // Give time to manually log in if needed

  const cookies = await page.cookies();
  await browser.close();

  const klingCookie = cookies.find((cookie) => cookie.name === "kling_global");
  res.json(klingCookie || { error: "Cookie not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
