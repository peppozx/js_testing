const puppeteer = require("puppeteer");
const { generateText, checkAndGenerate } = require("./util");

//Unit test
//function provided by jest
test("should output name and age", () => {
  const text = generateText("Igor", 22);
  //also provided by jest
  expect(text).toBe("Igor (22 years old)");
  const text2 = generateText("Teste", 20);
  expect(text2).toBe("Teste (20 years old)");
});

test("should output data-less text", () => {
  const text = generateText("", null);
  expect(text).toBe(" (null years old)");
});

//Integration text

test("should generate a valid text output", () => {
  const text = checkAndGenerate("Max", 29);
  expect(text).toBe("Max (29 years old)");
});

//E2E tests or user interface tests -> npm install --save-dev puppeteer
test("should create an element with text and correct class", async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: ["--window-size=1920, 1080", "--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5500/index.html");

  await page.click("input#name");
  await page.type("input#name", "Anna");

  await page.click("input#age");
  await page.type("input#age", "23");

  await page.click("#btnAddUser");

  const finalText = await page.$eval(".user-item", el => el.textContent);
  expect(finalText).toBe("Anna (23 years old)");
}, 10000);
