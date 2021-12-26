import { Request, Response } from "express";

import ConvertDREService from "./ConvertDREService";
import DownloadConfigFileService from "./DownloadConfigFileService";
import UploadConfigFileService from "./UploadConfigFileService";

export async function DownloadConfig(request: Request, response: Response) {
    const { configType } = request.body;
    const buffer = await DownloadConfigFileService.execute(configType);
    return response.status(200).json(buffer);
}

export async function UploadConfig(request: Request, response: Response) {
    const { type, file } = request.body;
    const config = await UploadConfigFileService.execute(file, type);
    return response.status(200).json(config);
}

export async function ConvertDRE(request: Request, response: Response) {
    const { rawBuffer, config } = request.body;
    const DREBuffer = await ConvertDREService.execute(rawBuffer, config);
    return response.status(220).json(DREBuffer);
}
