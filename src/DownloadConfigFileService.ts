import ExcelJS from "exceljs";

import db from "./database";

interface IConfig {
    type: string;
    map: { [key: string]: string };
}

class DownloadConfigFileService {
    async execute(configType: string) {
        const configs: IConfig[] = db.getData("/configs");

        const config = configs.find((c) => {
            return c.type === configType;
        });

        const workbook = new ExcelJS.Workbook();
        workbook.created = new Date();
        workbook.creator = "Roadmap Software";

        const worksheet = workbook.addWorksheet("DE PARA");
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
