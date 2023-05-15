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
const config_1 = require("./config");
const utils_1 = require("./utils");
const action_1 = __importDefault(require("./action"));
const message_1 = require("./utils/message");
function middlewares(mongo) {
    return __awaiter(this, void 0, void 0, function* () {
        mongo.ev.on('messages.upsert', ({ messages }) => __awaiter(this, void 0, void 0, function* () {
            const baileysMessage = messages[0];
            if (!(baileysMessage === null || baileysMessage === void 0 ? void 0 : baileysMessage.message) || !(0, utils_1.isCommand)(baileysMessage)) {
                return;
            }
            const action = new action_1.default(mongo, baileysMessage);
            const { command, remoteJid } = (0, utils_1.extractDataFromMessage)(baileysMessage);
            switch (command.toLowerCase()) {
                case 's':
                    yield action.sticker();
                    break;
                case 'img':
                    yield action.toImage();
                    break;
                case 'gpt':
                    yield action.gpt();
                    break;
                case 'menu':
                    yield yield mongo.sendMessage(remoteJid, { text: `${config_1.BOT_EMOJI}\n\n${(0, message_1.menuMessage)()}` });
                    break;
                case 'ping':
                    yield mongo.sendMessage(remoteJid, { text: `${config_1.BOT_EMOJI} Pong!` });
                    break;
            }
        }));
    });
}
exports.default = middlewares;
