const express = require('express')

module.exports = ({ routes }) => {

  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(routes)

  return app

}