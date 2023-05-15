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
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const utils_1 = require("../utils");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const message_1 = require("../utils/message");
class Action {
    constructor(mongo, baileysMessage) {
        const { remoteJid, args, isImage, isVideo, isSticker } = (0, utils_1.extractDataFromMessage)(baileysMessage);
        this.mongo = mongo;
        this.remoteJid = remoteJid;
        this.args = args;
        this.isImage = isImage;
        this.isVideo = isVideo;
        this.isSticker = isSticker;
        this.baileysMessage = baileysMessage;
    }
    sticker() {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isImage && !this.isVideo) {
                yield this.mongo.sendMessage(this.remoteJid, { text: `${config_1.BOT_EMOJI} ❌ Erro: Você não enviou uma imagem ou um video!` });
                return;
            }
            const outputPath = path_1.default.resolve(config_1.TEMP_FOLDER, "output.webp");
            if (this.isImage) {
                const inputPath = yield (0, utils_1.downloadImage)(this.baileysMessage, "input");
                (0, child_process_1.exec)(`ffmpeg -i ${inputPath} -vf scale=512:512 ${outputPath}`, (error) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                        fs_1.default.unlinkSync(inputPath);
                        yield this.mongo.sendMessage(this.remoteJid, { text: (0, message_1.errorMessage)('Não foi possível converter a imagem para figurinha!') });
                        return;
                    }
                    yield this.mongo.sendMessage(this.remoteJid, {
                        sticker: { url: outputPath },
                    });
                    fs_1.default.unlinkSync(inputPath);
                    fs_1.default.unlinkSync(outputPath);
                }));
            }
            else {
                const inputPath = yield (0, utils_1.downloadVideo)(this.baileysMessage, "input");
                const sizeInSeconds = 10;
                const seconds = ((_b = (_a = this.baileysMessage.message) === null || _a === void 0 ? void 0 : _a.videoMessage) === null || _b === void 0 ? void 0 : _b.seconds) ||
                    ((_g = (_f = (_e = (_d = (_c = this.baileysMessage.message) === null || _c === void 0 ? void 0 : _c.extendedTextMessage) === null || _d === void 0 ? void 0 : _d.contextInfo) === null || _e === void 0 ? void 0 : _e.quotedMessage) === null || _f === void 0 ? void 0 : _f.videoMessage) === null || _g === void 0 ? void 0 : _g.seconds);
                const haveSecondsRule = seconds <= sizeInSeconds;
                if (!haveSecondsRule) {
                    fs_1.default.unlinkSync(inputPath);
                    yield this.mongo.sendMessage(this.remoteJid, {
                        text: (0, message_1.errorMessage)(`O vídeo que você enviou tem mais de ${sizeInSeconds} segundos!
          Enviei um vídeo menor!`)
                    });
                    return;
                }
                (0, child_process_1.exec)(`ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`, (error) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        fs_1.default.unlinkSync(inputPath);
                        yield this.mongo.sendMessage(this.remoteJid, { text: (0, message_1.errorMessage)('Não foi possível converter o vídeo/gif figurinha!') });
                        return;
                    }
                    yield this.mongo.sendMessage(this.remoteJid, {
                        sticker: { url: outputPath },
                    });
                    fs_1.default.unlinkSync(inputPath);
                    fs_1.default.unlinkSync(outputPath);
                }));
            }
        });
    }
    toImage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isSticker) {
                yield this.mongo.sendMessage(this.remoteJid, { text: `${config_1.BOT_EMOJI} ❌ Erro: Você não enviou uma figurinha!` });
                return;
            }
            const inputPath = yield (0, utils_1.downloadSticker)(this.baileysMessage, 'input');
            const outputPath = path_1.default.resolve(config_1.TEMP_FOLDER, 'output.png');
            (0, child_process_1.exec)(`ffmpeg -i ${inputPath} ${outputPath}`, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    yield this.mongo.sendMessage(this.remoteJid, { text: (0, message_1.errorMessage)('Não foi possível converter o sticker para imagem!') });
                    return;
                }
                yield this.mongo.sendMessage(this.remoteJid, {
                    image: { url: outputPath }
                });
                fs_1.default.unlinkSync(inputPath);
                fs_1.default.unlinkSync(outputPath);
            }));
        });
    }
    gpt() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mongo.sendMessage(this.remoteJid, {
                react: {
                    text: '🔃',
                    key: this.baileysMessage.key
                }
            });
            const { data } = yield axios_1.default.post(`https://api.openai.com/v1/chat/completions`, {
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": this.args }],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            });
            yield this.mongo.sendMessage(this.remoteJid, {
                react: {
                    text: '👌',
                    key: this.baileysMessage.key
                }
            });
            const res = data.choices[0].message.content;
            yield this.mongo.sendMessage(this.remoteJid, {
                text: `${config_1.BOT_EMOJI}  ${res}`
            }, {
                quoted: this.baileysMessage
            });
        });
    }
}
exports.default = Action;
