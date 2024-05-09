import { ScraperBase } from "../ScraperBase.js";
import { sleep } from "../../utils.js";

export class ScraperTCU extends ScraperBase {
  constructor() {
    super();
    this.url =
      "https://contas.tcu.gov.br/certidao/Web/Certidao/NadaConsta/home.faces";
  }

  async init_page() {
    await this.page.goto(this.url);
    await page.click('div.g-recaptcha');
}

  async write_text(dados) {
    await page.click("#formEmitirCertidaoNadaConsta\\:tipoPesquisa\\:1");
    await page.type(
      "#formEmitirCertidaoNadaConsta\\:txtCpfOuCnpj",
      "21695269000100"
    );
  }

  async click_button() {
    await page.click('#formEmitirCertidaoNadaConsta\\:btnEmitirCertidao', {
        waitUntil: "domcontentloaded",
      });
  }

  async before_save_pdf() {
    await sleep(10000);
    await page.screenshot();
  }
}
