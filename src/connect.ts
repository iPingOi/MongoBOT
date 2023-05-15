import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth/baileys')

  const mongo = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    defaultQueryTimeoutMs: undefined
  })

  mongo.ev.on('connection.update', (update) => {
    const { connection } = update

    if (connection === 'close') {
      const shouldReconnect = DisconnectReason.loggedOut

      if (shouldReconnect) {
        connect()
      }
    }
  })

  mongo.ev.on('creds.update', saveCreds)

  return mongo
}

export default connect