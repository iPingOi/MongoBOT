import connect from "./connect"
import middlewares from './middlewares'

async function start() {
  const mongo = await connect()
  await middlewares(mongo)
}

start()