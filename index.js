import express from "express"
import cors from "cors"
import "dotenv/config"

import Books from "./routes/books.js"
import { logger } from "./middlewares/logger.js"

const app = express()

const PORT = process.env.PORT

app.use(express())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger)

app.use("/books", Books)

app.listen(PORT, () => console.log(`Server run on port : ${PORT}`))
