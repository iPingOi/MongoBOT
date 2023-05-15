import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

const PREFIX = '!'
const BOT_EMOJI = '🥭'
const BOT_NAME = 'Zé Da Manga'
const TEMP_FOLDER = path.resolve(__dirname, '..', 'auth', 'temp')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export { BOT_EMOJI, PREFIX, TEMP_FOLDER, BOT_NAME, OPENAI_API_KEY }