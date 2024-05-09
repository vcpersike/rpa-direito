import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { APIKEY_2CAPTCHA, PERFORMANCE_ARGS } from "../envs.js";

export class ScraperBase {
  constructor() {
    this.browser = null;
    this.page = null;
    this.url = null;
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
      headless: process.env.PUPPETEER_EXECUTABLE_PATH ? true : false,
      defaultViewport: null,
      args: process.env.PUPPETEER_EXECUTABLE_PATH ? PERFORMANCE_ARGS : [],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    });
    this.page = (await this.browser.pages())[0];
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
    );
  }

  async init_page() {
    await this.page.goto(this.url);
    await this.page.waitForSelector("#g-recaptcha-response");
  }

  async save_pdf (dados) {
    await this.page.pdf({
        path: `./certidoes/${dados.cnpj_cpf}.pdf`,
        format: 'A4',
        printBackground: true,
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' }
    });
}

  async solve_captcha() {
    const { error } = await this.page.solveRecaptchas();
    if (error) {
      throw new Error(`Erro ao resolver o captcha: ${error}`);
    }
  }

  async close_browser() {
    if (!this.browser.connected) return;
    await this.browser.close();
  }

  async run(dados) {
    let success = false;
    try {
      await this.init_browser();
      await this.init_page(dados);
      await this.write_text(dados);
      await this.solve_captcha();
      await this.click_button();
      await this.before_save_pdf();
      await this.save_pdf(dados);
      success = true;
    } catch (error) {
      console.log(error);
    } finally {
      await this.close_browser();
    }
    return success;
  }

}
