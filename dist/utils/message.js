"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuMessage = exports.errorMessage = void 0;
const config_1 = require("../config");
function errorMessage(message) {
    return `${config_1.BOT_EMOJI} ❌ Erro: ${message}`;
}
exports.errorMessage = errorMessage;
function menuMessage() {
    const date = new Date();
    return `╭━━ 🥭 BEM-VINDO(A) 🥭 ⑆
  ⁃›  Data: ${date.toLocaleDateString('pt-br')}
  ⁃›  Hora: ${date.toLocaleTimeString('pt-br')}
  ⁃›  Prefix: ${config_1.PREFIX}
  ╰━━ 『🥭』━━
  
  ╭━━ 🥭 MENU 🥭 ⑆
  ⁃›  ${config_1.PREFIX}s - Sticker
  ⁃›  ${config_1.PREFIX}img - Sticker para imagem
  ⁃›  ${config_1.PREFIX}gpt - Chat GPT-4
  ⁃›  ${config_1.PREFIX}ping - Teste
  ╰━━ 『🥭』━━`;
}
exports.menuMessage = menuMessage;
