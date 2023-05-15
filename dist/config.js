"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENAI_API_KEY = exports.BOT_NAME = exports.TEMP_FOLDER = exports.PREFIX = exports.BOT_EMOJI = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PREFIX = '!';
exports.PREFIX = PREFIX;
const BOT_EMOJI = '🥭';
exports.BOT_EMOJI = BOT_EMOJI;
const BOT_NAME = 'Zé Da Manga';
exports.BOT_NAME = BOT_NAME;
const TEMP_FOLDER = path_1.default.resolve(__dirname, '..', 'auth', 'temp');
exports.TEMP_FOLDER = TEMP_FOLDER;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
exports.OPENAI_API_KEY = OPENAI_API_KEY;
