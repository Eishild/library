import { readFileSync, writeFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const libraryFilePath = path.join(__dirname, "..", "/data", "/library.json")
const library = readFileSync(libraryFilePath)
const books = JSON.parse(library)

export const getAllBooks = (req, res) => {
  const { limit, page } = req.query
  const { search } = req.query

  try {
    if (!books || books.length === 0) {
      res.send("There is no books")
      return
    }

    if (!limit || Number(limit) <= 0 || !page || Number(page) <= 0) {
      //return all books
      res.status(200).send(books)
    } else {
      //return paginate books
      const firstIndex = (Number(page) - 1) * Number(limit)
      const lastIndex = Number(page) * Number(limit)

      const paginateBooks = books.slice(firstIndex, lastIndex)
      res.status(200).send(paginateBooks)
    }
  } catch (error) {
    res.status(404).send(error)
  }
}

export const getBook = (req, res) => {
  const { id } = req.params

  try {
    // check if the id is valid
    if (!id || isNaN(Number(id))) {
      res.status(400).send("id of book is not valid")
      return
    }

    // return the book selected
    const [book] = books.filter((book) => book.id === Number(id))

    // if id didn't found return error message
    if (!book) {
      res.send("id of book not found")
      return
    }
    res.status(200).send(book)
  } catch (error) {
    res.status(404).send(error)
  }
}

export const createBook = (req, res) => {
  const { title, author, description, release_date } = req.body
  try {
    // check if all values are send
    if (!title || !author || !description || !release_date) {
      res.status(400).send("miss value")
      return
    }

    // check if all values are not empty
    if (
      title.trim() === "" ||
      author.trim() === "" ||
      description.trim() === "" ||
      release_date.trim() === ""
    ) {
      res.status(400).send("empty value")
      return
    }

    // check if there is minimum 1 book on de DDB
    if (books.length === 0) {
      // create first id at 0
      writeFileSync(
        libraryFilePath,
        JSON.stringify([{ id: 0, title, author, description, release_date }])
      )
    } else {
      // increment id based on last id on the array
      const id = books[books.length - 1].id + 1
      const data = books

      // create a new array with new value
      data.push({
        id,
        title,
        author,
        description,
        release_date,
      })
      writeFileSync(libraryFilePath, JSON.stringify(data))
    }

    res.status(200).send("Book created")
  } catch (error) {
    res.status(400).redirect("/books")
  }
}

export const upadateBook = (req, res) => {
  const { id } = req.params

  try {
    //check if the id is not undefined and a number
    if (!id || isNaN(Number(id))) {
      res.status(400).send("id of book is not valid")
      return
    }

    const keys = Object.keys(req.body)

    //Create a new array with apdated values
    let updatedBooksArray = []
    books.forEach((book, index, array) => {
      if (book.id === Number(id)) {
        keys.forEach((key) => (book[key] = req.body[key]))
      }
      updatedBooksArray = array
    })

    writeFileSync(libraryFilePath, JSON.stringify(updatedBooksArray))

    res.status(200).send(updatedBooksArray)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const deleteBook = (req, res) => {
  const { id } = req.params
  try {
    const correctIdBook = books.filter((book) => book.id === Number(id))

    //check if the id is not undefined and a number or exist
    if (!id || isNaN(Number(id)) || correctIdBook.length === 0) {
      res.status(400).send("id of book is not valid")
      return
    }

    console.log(req.user)
    //Create a new array with deleted book
    const filteredBooks = books.filter((book) => book.id !== Number(id))

    writeFileSync(libraryFilePath, JSON.stringify(filteredBooks))
    res.status(200).send(filteredBooks)
  } catch (error) {
    res.status(400).send(error)
  }
}
