const router = require('express').Router()

const Todo = require('../models/todo')

router.get('/reset', async (request, response) => {
    await Todo.deleteMany({})
    response.status(204).end()
  })

module.exports = router