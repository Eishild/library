import os from "os"

export const logger = (req, res, next) => {
  console.log(`Hostname : ${os.hostname()}`)
  next()
}
