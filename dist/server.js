"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/config/upload", routes_1.UploadConfig);
app.post("/config/download", routes_1.DownloadConfig);
app.post("/dre", routes_1.ConvertDRE);
app.get("/", (_, response) => {
    return response.json({ message: "OK" });
});
app.listen(process.env.PORT || 3000);
