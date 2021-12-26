import db from "./database";

interface IConfig {
    type: string;
    map: { [key: string]: string };
}

class GetConfigsService {
    execute() {
        let configs = [] as IConfig[];
        try {
            configs = db.getData("/configs");

            return configs;
        } catch (e) {
            return configs;
        }
    }
}

export default new GetConfigsService();
