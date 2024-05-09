import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { sleep } from "../utils.js";

import { APIKEY_2CAPTCHA, PERFORMANCE_ARGS } from "../envs.js";

const recaptchaPlugin = RecaptchaPlugin({
  provider: {
    id: "2captcha",
    token: APIKEY_2CAPTCHA,
  },
});
puppeteer.use(StealthPlugin());

puppeteer.use(recaptchaPlugin);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: process.env.PUPPETEER_EXECUTABLE_PATH ? PERFORMANCE_ARGS : [],
    executablePath:
      "/Volumes/HDX/AppS/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const page = (await browser.pages())[0];

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
  );

  await page.goto(
    "https://certidoes.cgu.gov.br"
    );

    await page.evaluate(() => {
      const event = new Event('input', { bubbles: true });
      const element = document.querySelector("#cpfCnpj");
      element.value = "21695269000100";
      element.dispatchEvent(event);
    });

  await page.click('input[type="checkbox"][value="16"]');

  await page.click('input[type="checkbox"][value="8"]');

  await Promise.all([
    page.click("#consultar"),
    page.waitForNavigation({ waitUntil: 'networkidle0' }), // Espera até que a rede esteja ociosa
  ]);
  //await page.click('div.g-recaptcha');

  //const { solved, error } = await page.solveRecaptchas();

  await page.click('.fa.fa-file-pdf', {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(10000);
  console.log("Clicou no botão de gerar PDF");

  // await sleep(10000);
  // await page.screenshot();

  // await page.pdf({
  //   path: "./certidoes/certidao.pdf",
  //   format: "A4",
  //   margin: {
  //     left: "2cm",
  //     right: "2cm",
  //     top: "2cm",
  //     bottom: "2cm",
  //   },
  //   printBackground: true,
  // });

  // await sleep(3000);
  await page.waitForTimeout(10000);
  await browser.close();
})();
