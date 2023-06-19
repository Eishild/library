import express from "express"
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBook,
  upadateBook,
} from "../controllers/books.js"
import { isAuthor } from "../middlewares/auth.js"

const router = express.Router()

router.get("/", getAllBooks)
router.get("/:id", getBook)
router.post("/", createBook)
router.put("/:id", upadateBook)
router.delete("/:id", isAuthor, deleteBook)

export default router
