"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-destructuring */
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
function parseMonth(month) {
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
    const monthNumber = monthNames.findIndex((m) => m === month.toUpperCase()) + 1;
    return String(monthNumber).padStart(2, "0");
}
function parseDate(type, rawDate) {
    if (!rawDate)
        return "";
    const reg = /\b([a-zA-Z]{3})\/([0-9]{4}\b)|\b([0-9]{2})\/(\b[0-9]{4}\b)/gm;
    const m = reg.exec(rawDate);
    if (!m)
        return "";
    if (m[3] && m[4]) {
        return m[0];
    }
    if (m[1] && m[2]) {
        const month = parseMonth(m[1]);
        return `${month}/${m[2]}`;
    }
    return "";
}
function parseBillPlan(map, rawBillPlan) {
    if (!rawBillPlan)
        return "";
    const reg = /([0-9.]+) - |([0-9.]+)\b$/gm;
    const m = reg.exec(rawBillPlan);
    if (!m)
        return "";
    const key = m[1] || m[2];
    if (!key)
        return "";
    return map[key];
}
class UploadConfigFileService {
    execute(rawBuffer, config) {
        return __awaiter(this, void 0, void 0, function* () {
            // loads raw DRE buffer
            const buffer = Buffer.from(rawBuffer, "base64");
            const rawWorkbook = new exceljs_1.default.Workbook();
            yield rawWorkbook.xlsx.load(buffer);
            const rawDRE = rawWorkbook.getWorksheet(1);
            const { type, map } = config;
            // iterates rawDRE and populates translatedData
            const translatedData = [];
            for (let r = 1; r <= rawDRE.rowCount; r++) {
                for (let c = 1; c <= rawDRE.columnCount; c++) {
                    const { value } = rawDRE.getCell(r, c);
                    const rawDate = rawDRE.getCell(1, c).value;
                    const rawBillPlan = rawDRE.getCell(r, 1).value;
                    const date = parseDate(type, rawDate);
                    const billPlan = parseBillPlan(map, rawBillPlan);
                    // console.log(`${rawDate} ${rawBillPlan} ${date} ${billPlan}`);
                    if (date && billPlan) {
                        translatedData.push([billPlan, date, value]);
                    }
                }
            }
            // get the base table from DRE template
            const dirPath = path_1.default.join(__dirname, "/assets");
            const DRE = new exceljs_1.default.Workbook();
            yield DRE.xlsx.readFile(path_1.default.resolve(dirPath, "template_DRE.xlsx"));
            const base = DRE.getWorksheet("Base");
            console.log(path_1.default.resolve(dirPath, "template_DRE.xlsx"));
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
        });
    }
}
exports.default = new UploadConfigFileService();
