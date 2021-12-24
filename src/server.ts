import cors from "cors";
import express from "express";

import { DownloadConfig, UploadConfig, ConvertDRE } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/config/upload", UploadConfig);
app.post("/config/download", DownloadConfig);
app.post("/dre", ConvertDRE);

app.listen(3333);
