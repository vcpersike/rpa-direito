import { ScraperBase } from "../ScraperBase.js";
import { sleep } from "../../utils.js";

export class ScraperMPT7 extends ScraperBase {
  constructor() {
    super();
    this.url =
      "https://www.prt7.mpt.mp.br/servicos/certidao-positiva-negativa";
  }

  async write_text(dados) {
    await page.click('input[value="CNPJ"]');
    await this.page.type("#cnpj", dados.cnpj_cpf);
  }

  async click_button() {
    await this.page.click('input[id="codin_consultar"]', {
      waitUntil: "domcontentloaded",
    });
  }

  async before_save_pdf() {
    const newPagePromise = new Promise((x) =>
      browser.once("targetcreated", (target) => x(target.page()))
    );
    const newPage = await newPagePromise;

    await newPage.setViewport({ width: 1280, height: 800 });

    await sleep(5000);
  }

  async save_pdf(dados) {
    await this.newPage.pdf({
      path: `./certidoes/${dados.cnpj_cpf}.pdf`,
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });
  }
}
