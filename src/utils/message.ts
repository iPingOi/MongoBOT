import { BOT_EMOJI, BOT_NAME, PREFIX } from "../config";

function errorMessage(message) {
  return `${BOT_EMOJI} ❌ Erro: ${message}`
}

function menuMessage() {
  const date = new Date()

  return `╭━━ 🥭 BEM-VINDO(A) 🥭 ⑆
  ⁃›  Data: ${date.toLocaleDateString('pt-br')}
  ⁃›  Hora: ${date.toLocaleTimeString('pt-br')}
  ⁃›  Prefix: ${PREFIX}
  ╰━━ 『🥭』━━
  
  ╭━━ 🥭 MENU 🥭 ⑆
  ⁃›  ${PREFIX}s - Sticker
  ⁃›  ${PREFIX}img - Sticker para imagem
  ⁃›  ${PREFIX}gpt - Chat GPT-4
  ⁃›  ${PREFIX}ping - Teste
  ╰━━ 『🥭』━━`
}

export { errorMessage, menuMessage }