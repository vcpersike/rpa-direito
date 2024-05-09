import { ScraperBase } from "../ScraperBase.js";
import { sleep } from "../../utils.js";

export class ScraperCGU extends ScraperBase {
  constructor() {
    super();
    this.url = "https://certidoes.cgu.gov.br";
  }

  async init_page() {
    const downloadPath = path.resolve(__dirname, './certidoes/certidao.pdf');
    await this.page.goto(this.url);
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadPath,
    });
  }

  async write_text(dados) {
    await page.evaluate(() => {
      const event = new Event("input", { bubbles: true });
      const element = document.querySelector("#cpfCnpj");
      element.value = "21695269000100";
      element.dispatchEvent(event);
    });
    await page.click('input[type="checkbox"][value="16"]');
    await page.click('input[type="checkbox"][value="8"]');
  }

  async click_button() {
    await Promise.all([
      page.click("#consultar"),
      page.waitForNavigation({ waitUntil: "networkidle0" }), // Espera até que a rede esteja ociosa
    ]);
    await page.click(".fa.fa-file-pdf", {
      waitUntil: "domcontentloaded",
    });
  }
}
