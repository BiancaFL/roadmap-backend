"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertDRE = exports.UploadConfig = exports.DownloadConfig = void 0;
const ConvertDREService_1 = __importDefault(require("./ConvertDREService"));
const DownloadConfigFileService_1 = __importDefault(require("./DownloadConfigFileService"));
const UploadConfigFileService_1 = __importDefault(require("./UploadConfigFileService"));
function DownloadConfig(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { config } = request.body;
        const buffer = yield DownloadConfigFileService_1.default.execute(config);
        return response.json(buffer);
    });
}
exports.DownloadConfig = DownloadConfig;
function UploadConfig(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { type, file } = request.body;
        const config = yield UploadConfigFileService_1.default.execute(file, type);
        return response.status(200).json(config);
    });
}
exports.UploadConfig = UploadConfig;
function ConvertDRE(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rawBuffer, config } = request.body;
        const DREBuffer = yield ConvertDREService_1.default.execute(rawBuffer, config);
        return response.json(DREBuffer);
    });
}
exports.ConvertDRE = ConvertDRE;
