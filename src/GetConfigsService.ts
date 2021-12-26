import db from "./database";

interface IConfig {
    type: string;
    map: { [key: string]: string };
}

class GetConfigsService {
    execute() {
        const configs: IConfig[] = db.getData("/configs");

        return configs;
    }
}

export default new GetConfigsService();
