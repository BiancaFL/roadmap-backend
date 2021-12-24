import ExcelJS from "exceljs";

class UploadConfigFileService {
    async execute(file, type: string) {
        const workbook = new ExcelJS.Workbook();

        const buffer = Buffer.from(file, "base64");
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);

        const config = { type, map: {} };

        for (let i = 2 as number; i <= worksheet.rowCount; i++) {
            const key = worksheet.getCell(i, 1).value as string;
            const { value } = worksheet.getCell(i, 2);
            config.map[key] = value;
        }

        return config;
    }
}

export default new UploadConfigFileService();
