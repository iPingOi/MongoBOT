import path from "path"
import { BOT_EMOJI, TEMP_FOLDER } from "../config"
import { downloadImage, downloadSticker, downloadVideo, extractDataFromMessage } from "../utils"
import { exec } from 'child_process'
import fs from 'fs'

// @types
import makeWASocket from '@whiskeysockets/baileys'

class Action {
  mongo: ReturnType<typeof makeWASocket>
  remoteJid: string
  args: string
  isImage: boolean
  isVideo: boolean
  isSticker: boolean
  baileysMessage: string

  constructor(mongo: ReturnType<typeof makeWASocket>, baileysMessage) {
    const { remoteJid, args, isImage, isVideo, isSticker } = extractDataFromMessage(baileysMessage)

    this.mongo = mongo
    this.remoteJid = remoteJid
    this.args = args
    this.isImage = isImage
    this.isVideo = isVideo
    this.isSticker = isSticker
    this.baileysMessage = baileysMessage
  }

  async sticker() {
    if (!this.isImage && !this.isVideo) {
      await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Você não enviou uma imagem ou um video!` })
      return;
    }

    const outputPath = path.resolve(TEMP_FOLDER, "output.webp");

    if (this.isImage) {
      const inputPath = await downloadImage(this.baileysMessage, "input");

      exec(
        `ffmpeg -i ${inputPath} -vf scale=512:512 ${outputPath}`,
        async (error) => {
          if (error) {
            console.log(error);

            fs.unlinkSync(inputPath);

            await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Não foi possível converter a imagem para figurinha!` })

            return;
          }

          await this.mongo.sendMessage(this.remoteJid, {
            sticker: { url: outputPath },
          });

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        }
      );
    } else {
      const inputPath = await downloadVideo(this.baileysMessage, "input");

      const sizeInSeconds = 10;

      const seconds =
        this.baileysMessage.message?.videoMessage?.seconds ||
        this.baileysMessage.message?.extendedTextMessage?.contextInfo
          ?.quotedMessage?.videoMessage?.seconds;

      const haveSecondsRule = seconds <= sizeInSeconds;

      if (!haveSecondsRule) {
        fs.unlinkSync(inputPath);

        await this.mongo.sendMessage(this.remoteJid, {
          text: `${BOT_EMOJI} ❌ Erro: O vídeo que você enviou tem mais de ${sizeInSeconds} segundos!
        Enviei um vídeo menor!` })

        return;
      }

      exec(
        `ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
        async (error) => {
          if (error) {
            fs.unlinkSync(inputPath);

            await this.mongo.sendMessage(this.remoteJid, { text: `${BOT_EMOJI} ❌ Erro: Não foi possível converter o vídeo/gif figurinha!` })

            return;
          }

          await this.mongo.sendMessage(this.remoteJid, {
            sticker: { url: outputPath },
          });

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        }
      );
    }
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