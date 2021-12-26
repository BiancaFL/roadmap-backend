import db from "./database";

interface IConfig {
    type: string;
    map: { [key: string]: string };
}

class DeleteConfigService {
    execute(configType: string) {
        const configs: IConfig[] = db.getData("/configs");

        const newConfigs = configs.filter((c) => {
            return c.type !== configType;
        });

        db.push("/configs", newConfigs, true);

        return newConfigs;
    }
}

export default new DeleteConfigService();
