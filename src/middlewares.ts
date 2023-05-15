import { BOT_EMOJI } from './config'
import { isCommand, extractDataFromMessage } from './utils'
import Action from './action'

// @types
import makeWASocket from '@whiskeysockets/baileys'
import { menuMessage } from './utils/message'

async function middlewares(mongo: ReturnType<typeof makeWASocket>) {
  mongo.ev.on('messages.upsert', async ({ messages }) => {
    const baileysMessage = messages[0]

    if (!baileysMessage?.message || !isCommand(baileysMessage)) {
      return
    }

    const action = new Action(mongo, baileysMessage)

    const { command, remoteJid } = extractDataFromMessage(baileysMessage)

    switch (command.toLowerCase()) {
      case 's':
        await action.sticker()
        break
      case 'img':
        await action.toImage()
        break
      case 'gpt':
        await action.gpt()
        break
      case 'menu':
        await await mongo.sendMessage(remoteJid!, { text: `${BOT_EMOJI}\n\n${menuMessage()}` })
        break
      case 'ping':
        await mongo.sendMessage(remoteJid!, { text: `${BOT_EMOJI} Pong!` })
        break
    }
  })
}

export default middlewares