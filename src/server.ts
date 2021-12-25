import cors from "cors";
import express, { Request, Response } from "express";
import "express-async-errors";

import { AppError } from "./errors/AppError";
import { DownloadConfig, UploadConfig, ConvertDRE } from "./routes";

const app = express();
const corsOptions = {
    origin: "https://roadmap-frontend.herokuapp.com",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/config/upload", UploadConfig);
app.post("/config/download", DownloadConfig);
app.post("/dre", ConvertDRE);
app.get("/", (_, response) => {
    return response.json({ message: "OK" });
});

// eslint-disable-next-line no-undef
app.use((err: Error, request: Request, response: Response) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({ message: err.message });
    }

    return response.status(500).json({
        message: `Internal server error - ${err.message}`,
    });
});

app.listen(process.env.PORT || 3000);
