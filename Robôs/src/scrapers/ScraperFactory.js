import { ScraperTRT15 } from "./TRTs/ScraperTRT15.js"
import { ScraperTRT14 } from "./TRTs/ScraperTRT14.js"
import { ScraperTRT2 } from "./TRTs/ScraperTRT2.js"

export const ScraperFactory = {
    "TRT15": ScraperTRT15,
    "TRT14": ScraperTRT14,
    "TRT2": ScraperTRT2
}