import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { APIKEY_2CAPTCHA, PERFORMANCE_ARGS } from "../envs.js";
import { sleep } from "../utils.js";

export class ScraperBase {
  constructor() {
    this.browser = null;
    this.page = null;
    this.url =
      "https://certidoes.cgu.gov.br";
  }

  async init_browser() {
    const recaptchaPlugin = RecaptchaPlugin({
      provider: {
        id: "2captcha",
        token: APIKEY_2CAPTCHA,
      },
    });
    puppeteer.use(recaptchaPlugin);

    this.browser = await puppeteer.launch({
      headless: false,
    defaultViewport: null,
    //args: process.env.PUPPETEER_EXECUTABLE_PATH ? PERFORMANCE_ARGS : [],
    executablePath:
      "/Volumes/HDX/AppS/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
    this.page = (await this.browser.pages())[0];
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
    );
  }

  async init_page() {
    await this.page.goto(this.url);
    await sleep(30000);
    await this.page.click("#cpfCnpj");
    // Espera dinâmica, pode ser ajustada conforme necessário
  }

  async write_text(dados = {cnjp: "21695269000100"}) {
    await this.page.type(
      "#consultar",
      dados.cnpj_cpf
    );
    // Outras interações com a página conforme necessário
  }

  async click_button() {
    await sleep(30000);
    await this.page.click("div.g-recaptcha");
    // Aguardar a resolução do captcha e outras ações na página
  }

  async before_save_pdf() {
    await sleep(3000);
  }

  async save_pdf() {
    await this.page.pdf({
      path: "./certidoes/certidao.pdf",
      format: "A4",
      printBackground: true,
      margin: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
    });
  }

  async close_browser() {
    if (this.browser && this.browser.isConnected()) {
      await this.browser.close();
    }
  }

  async run(dados) {
    let success = false;
    try {
      await this.init_browser();
      await this.init_page();
      await this.write_text(dados);
      await this.solve_captcha();
      await this.click_button();
      await this.before_save_pdf();
      await this.save_pdf();
      success = true;
    } catch (error) {
      console.error("Erro durante a execução do scraper:", error);
    } finally {
      await this.close_browser();
    }
    return success;
  }
}

const instance = new ScraperBase();
instance.run({cnpj_cpf: "21695269000100"});
