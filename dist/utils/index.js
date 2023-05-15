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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSticker = exports.downloadVideo = exports.downloadImage = exports.isCommand = exports.extractDataFromMessage = void 0;
const config_1 = require("../config");
const baileys_1 = require("@whiskeysockets/baileys");
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
function extractDataFromMessage(baileysMessage) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const textMessage = (_a = baileysMessage.message) === null || _a === void 0 ? void 0 : _a.conversation;
    const extendedTextMessage = (_c = (_b = baileysMessage.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text;
    const imageTextMessage = (_e = (_d = baileysMessage.message) === null || _d === void 0 ? void 0 : _d.imageMessage) === null || _e === void 0 ? void 0 : _e.caption;
    const videoTextMessage = (_g = (_f = baileysMessage.message) === null || _f === void 0 ? void 0 : _f.videoMessage) === null || _g === void 0 ? void 0 : _g.caption;
    const fullMessage = textMessage || extendedTextMessage || imageTextMessage || videoTextMessage;
    if (!fullMessage) {
        return {
            remoteJid: '',
            fullMessage: '',
            command: '',
            args: '',
            isImage: false,
            isVideo: false,
            isSticker: false,
        };
    }
    const isImage = is(baileysMessage, 'image');
    const isVideo = is(baileysMessage, 'video');
    const isSticker = is(baileysMessage, 'sticker');
    const [command, ...args] = fullMessage.trim().split(' ');
    const arg = args.reduce((acc, arg) => acc + ' ' + arg, '').trim();
    return {
        remoteJid: (_h = baileysMessage === null || baileysMessage === void 0 ? void 0 : baileysMessage.key) === null || _h === void 0 ? void 0 : _h.remoteJid,
        fullMessage,
        command: command.replace(config_1.PREFIX, '').trim(),
        args: arg.trim(),
        isImage,
        isVideo,
        isSticker,
    };
}
exports.extractDataFromMessage = extractDataFromMessage;
function is(baileysMessage, context) {
    var _a, _b, _c, _d, _e;
    return (!!((_a = baileysMessage.message) === null || _a === void 0 ? void 0 : _a[`${context}Message`]) ||
        !!((_e = (_d = (_c = (_b = baileysMessage.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage) === null || _e === void 0 ? void 0 : _e[`${context}Message`]));
}
function getContent(baileysMessage, type) {
    var _a, _b, _c, _d, _e;
    return (((_a = baileysMessage.message) === null || _a === void 0 ? void 0 : _a[`${type}Message`]) ||
        ((_e = (_d = (_c = (_b = baileysMessage.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage) === null || _e === void 0 ? void 0 : _e[`${type}Message`]));
}
function isCommand(baileysMessage) {
    const { fullMessage } = extractDataFromMessage(baileysMessage);
    return fullMessage && fullMessage.startsWith(config_1.PREFIX);
}
exports.isCommand = isCommand;
function download(baileysMessage, fileName, context, extension) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const content = getContent(baileysMessage, context);
        if (!content) {
            return null;
        }
        const stream = yield (0, baileys_1.downloadContentFromMessage)(content, context);
        let buffer = Buffer.from([]);
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a;) {
                _c = stream_1_1.value;
                _d = false;
                try {
                    const chunk = _c;
                    buffer = Buffer.concat([buffer, chunk]);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const filePath = path_1.default.resolve(config_1.TEMP_FOLDER, `${fileName}.${extension}`);
        yield (0, promises_1.writeFile)(filePath, buffer);
        return filePath;
    });
}
function downloadImage(baileysMessage, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield download(baileysMessage, fileName, 'image', 'png');
    });
}
exports.downloadImage = downloadImage;
function downloadSticker(baileysMessage, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield download(baileysMessage, fileName, 'sticker', 'webp');
    });
}
exports.downloadSticker = downloadSticker;
function downloadVideo(baileysMessage, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield download(baileysMessage, fileName, 'video', 'mp4');
    });
}
exports.downloadVideo = downloadVideo;
