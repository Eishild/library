export const isAuthor = (req, res, next) => {
  const { admin } = req.body

  if (!admin) {
    res.send("You are not able to do this action")
  }

  next()
}
