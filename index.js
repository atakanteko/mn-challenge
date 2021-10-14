const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Todo = require('./models/todo')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())



const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)


app.get('/api/todos', (req, res) => {
  Todo.find({}).then(result => {
      res.json(result)
      })
})


app.post('/api/todos', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }


  const todo = new Todo({
    content: body.content
  })

  todo.save().then(savedTodo => {
    response.json(savedTodo)
  })
})

app.get('/api/todos/:id', (request, response) => {
  Todo.findById(request.params.id).then(t => {
    response.json(t)
  })
})

app.delete('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id)
  todos = todos.filter(todo => todo.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})