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
const exceljs_1 = __importDefault(require("exceljs"));
class UploadConfigFileService {
    execute(file, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = new exceljs_1.default.Workbook();
            const buffer = Buffer.from(file, "base64");
            yield workbook.xlsx.load(buffer);
            const worksheet = workbook.getWorksheet(1);
            const config = { type, map: {} };
            for (let i = 2; i <= worksheet.rowCount; i++) {
                const key = worksheet.getCell(i, 1).value;
                const { value } = worksheet.getCell(i, 2);
                config.map[key] = value;
            }
            return config;
        });
    }
}
exports.default = new UploadConfigFileService();
