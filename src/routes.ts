import { Request, Response } from "express";

import ConvertDREService from "./ConvertDREService";
import DeleteConfigService from "./DeleteConfigService";
import DownloadConfigFileService from "./DownloadConfigFileService";
import GetConfigsService from "./GetConfigsService";
import UploadConfigFileService from "./UploadConfigFileService";

export async function DownloadConfig(request: Request, response: Response) {
    const { configType } = request.body;
    const buffer = await DownloadConfigFileService.execute(configType);
    return response.status(200).json(buffer);
}

export async function UploadConfig(request: Request, response: Response) {
    const { type, file } = request.body;
    const configs = await UploadConfigFileService.execute(file, type);
    return response.status(200).json(configs);
}

export async function ConvertDRE(request: Request, response: Response) {
    const { rawBuffer, configType } = request.body;
    const DREBuffer = await ConvertDREService.execute(rawBuffer, configType);
    return response.status(200).json(DREBuffer);
}

export function GetConfigs(request: Request, response: Response) {
    const configs = GetConfigsService.execute();
    return response.status(200).json(configs);
}

export function DeleteConfig(request: Request, response: Response) {
    const { configType } = request.body;
    const configs = DeleteConfigService.execute(configType);
    return response.status(200).json(configs);
}
