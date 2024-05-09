import { ScraperBase } from '../ScraperBase.js'
import { sleep } from '../../utils.js'

export class ScraperTRT6 extends ScraperBase {

    constructor() {
        super()
        this.url = 'https://pje.trt6.jus.br/certidoes/trabalhista/emissao'
    }

    async write_text (dados) {
        await this.page.type('.mat-form-field-infix input', dados.cnpj_cpf)
    }

    async click_button () {
        await this.page.click('button[type="submit"]', { waitUntil: "domcontentloaded" });
    }

    async before_save_pdf () {
        await this.page.waitForSelector("pje-visualizador-certidao");
        await sleep(3000)
    }

}