/* eslint-disable prefer-destructuring */
import ExcelJS from "exceljs";
import path from "path";

import { AppError } from "./errors/AppError";

interface IConfig {
    type: string;
    map: { [key: string]: string };
}

function parseMonth(month: string) {
    const monthNames = [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ",
    ];
    const monthNumber =
        monthNames.findIndex((m) => m === month.toUpperCase()) + 1;
    return String(monthNumber).padStart(2, "0");
}

function parseDate(type: string, rawDate: string): string {
    if (!rawDate) return "";
    const reg = /\b([a-zA-Z]{3})\/([0-9]{4}\b)|\b([0-9]{2})\/(\b[0-9]{4}\b)/gm;
    const m = reg.exec(rawDate);

    if (!m) return "";

    if (m[3] && m[4]) {
        return m[0];
    }
    if (m[1] && m[2]) {
        const month = parseMonth(m[1]);
        return `${month}/${m[2]}`;
    }

    return "";
}

function parseBillPlan(map, rawBillPlan: string): string {
    if (!rawBillPlan) return "";
    const reg = /([0-9.]+) - |([0-9.]+)\b$/gm;
    const m = reg.exec(rawBillPlan);

    if (!m) return "";

    const key = m[1] || m[2];
    if (!key) return "";
    return map[key];
}

class UploadConfigFileService {
    async execute(rawBuffer, config: IConfig) {
        // loads raw DRE buffer
        const buffer = Buffer.from(rawBuffer, "base64");
        const rawWorkbook = new ExcelJS.Workbook();
        await rawWorkbook.xlsx.load(buffer);

        if (!rawWorkbook)
            throw new AppError(
                500,
                "Não foi possível carregar o arquivo de DRE selecionado. Verifique o formato do arquivo e tente novamente."
            );
        const rawDRE = rawWorkbook.getWorksheet(1);
        const { type, map } = config;

        // iterates rawDRE and populates translatedData
        const translatedData = [];
        for (let r = 1; r <= rawDRE.rowCount; r++) {
            for (let c = 1; c <= rawDRE.columnCount; c++) {
                const { value } = rawDRE.getCell(r, c);
                const rawDate = rawDRE.getCell(1, c).value as string;
                const rawBillPlan = rawDRE.getCell(r, 1).value as string;

                const date = parseDate(type, rawDate);
                const billPlan = parseBillPlan(map, rawBillPlan);

                // console.log(`${rawDate} ${rawBillPlan} ${date} ${billPlan}`);

                if (date && billPlan) {
                    translatedData.push([billPlan, date, value]);
                }
            }
        }

        // get the base table from DRE template
        const dirPath = path.join(__dirname, "/assets");

        const DRE = new ExcelJS.Workbook();
        await DRE.xlsx.readFile(path.resolve(dirPath, "template_DRE.xlsx"));
        const base = DRE.getWorksheet("Base");
        console.log(path.resolve(dirPath, "template_DRE.xlsx"));
        // "A1:C89",
        // return DRE.xlsx.writeBuffer();

        // populates baseTable and returns final buffer
        let r = 1;
        translatedData.forEach((row) => {
            base.getCell(r, 1).value = row[0];
            base.getCell(r, 2).value = row[1];
            base.getCell(r, 3).value = row[2];
            r++;
        });

        return DRE.xlsx.writeBuffer();
    }
}

export default new UploadConfigFileService();
