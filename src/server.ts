import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import { AppError } from "./errors/AppError";
import {
    DownloadConfig,
    UploadConfig,
    ConvertDRE,
    GetConfigs,
    DeleteConfig,
} from "./routes";

process.env.PWD = process.cwd();

const app = express();
const corsOptions = {
    origin: "https://roadmap-frontend.herokuapp.com",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/config/upload", UploadConfig);
app.post("/config/download", DownloadConfig);
app.get("/configs", GetConfigs);
app.post("/dre", ConvertDRE);
app.delete("/config", DeleteConfig);
app.get("/", (_, response) => {
    return response.json({ message: "OK" });
});

// eslint-disable-next-line no-undef
app.use(
    // eslint-disable-next-line no-unused-vars
    (err: Error, request: Request, response: Response, _next: NextFunction) => {
        if (err instanceof AppError) {
            return response
                .status(err.statusCode)
                .json({ message: err.message });
        }

        return response.status(500).json({
            message: `Internal server error - ${err.message}`,
        });
    }
);

app.listen(process.env.PORT || 3333);
