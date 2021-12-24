import ExcelJS from "exceljs";

interface IConfig {
    type: string;
    map: { [key: string]: string };
}

class DownloadConfigFileService {
    async execute(config: IConfig) {
        const workbook = new ExcelJS.Workbook();

        workbook.created = new Date();
        workbook.creator = "Zak";

        const worksheet = workbook.addWorksheet("DEPARA");
        const { map } = config;

        let i = 1;
        worksheet.getCell(1, 1).value = "DE";
        worksheet.getCell(1, 2).value = "PARA";
        for (const key in map) {
            i++;
            worksheet.getCell(i, 1).value = key;
            worksheet.getCell(i, 2).value = map[key];
        }

        return workbook.xlsx.writeBuffer();
    }
}

export default new DownloadConfigFileService();
