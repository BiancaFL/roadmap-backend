import ExcelJS from "exceljs";

import db from "./database";
import { AppError } from "./errors/AppError";

class UploadConfigFileService {
    async execute(file, type: string) {
        const workbook = new ExcelJS.Workbook();

        const buffer = Buffer.from(file, "base64");
        await workbook.xlsx.load(buffer);
        if (!workbook)
            throw new AppError(
                500,
                "Não foi possível carregar o arquivo de configuração selecionado. Verifique o formato do arquivo e tente novamente."
            );

        const worksheet = workbook.getWorksheet(1);

        const newConfig = { type, map: {} };

        for (let i = 2 as number; i <= worksheet.rowCount; i++) {
            const key = worksheet.getCell(i, 1).value as string;
            const { value } = worksheet.getCell(i, 2);
            newConfig.map[key] = value;
        }

        db.push("/configs", [newConfig], false);

        const configs = db.getData("/configs");

        return configs;
    }
}

export default new UploadConfigFileService();
