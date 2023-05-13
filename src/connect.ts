const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth/baileys')

  const bot = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    defaultQueryTimeoutMs: undefined
  })

  bot.ev.on('connection.update', (update: any) => {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut

      if (shouldReconnect) {
        connect()
      }
    }
  })

  bot.ev.on('creds.update', saveCreds)

  return bot
}

export default connect