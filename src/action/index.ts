import path from "path"
import { BOT_EMOJI, TEMP_FOLDER } from "../config"
import { downloadImage, downloadSticker, extractDataFromMessage } from "../utils"
import { exec } from 'child_process'
import fs from 'fs'

// @types
import makeWASocket from '@whiskeysockets/baileys'

class Action {
  mongo: ReturnType<typeof makeWASocket>
  remoteJid: string
  args: string
  isImage: boolean
  isSticker: boolean
  baileysMessage: string

  constructor(mongo: ReturnType<typeof makeWASocket>, baileysMessage) {
    const { remoteJid, args, isImage, isSticker } = extractDataFromMessage(baileysMessage)

    this.mongo = mongo
    this.remoteJid = remoteJid
    this.args = args
    this.isImage = isImage
    this.isSticker = isSticker
    this.baileysMessage = baileysMessage
  }

  async sticker() {
    if (!this.isImage) {
      await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Você não enviou uma imagem!` })
      return
    }

    const inputPath = await downloadImage(this.baileysMessage, 'input')
    const outputPath = path.resolve(TEMP_FOLDER, 'output.webp')

    exec(`ffmpeg -i ${inputPath} -vf scale=512:512 ${outputPath}`, async (error) => {
      if (error) {
        await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Não foi possível converter a imagem para figurinha!` })
        return
      }

      await this.mongo.sendMessage(this.remoteJid, {
        sticker: { url: outputPath }
      })

      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
    })
  }

  async toImage() {
    if (!this.isSticker) {
      await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Você não enviou uma figurinha!` })
      return
    }

    const inputPath = await downloadSticker(this.baileysMessage, 'input')
    const outputPath = path.resolve(TEMP_FOLDER, 'output.png')

    exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
      if (error) {
        await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Não foi possível converter o sticker para imagem!` })
        return
      }

      await this.mongo.sendMessage(this.remoteJid, {
        image: { url: outputPath }
      })

      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
    })
  }
}

export default Action