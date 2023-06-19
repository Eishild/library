import os from "os"

export const logger = (req, res, next) => {
  console.log(`request Method : ${req.method} - Hostname : ${os.hostname()}`)
  next()
}
