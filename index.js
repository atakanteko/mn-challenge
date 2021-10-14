const express = require('express')
const app = express()
const cors = require('cors')

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

let todos = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2020-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2020-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2020-01-10T19:20:14.298Z",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/todos', (req, res) => {
  res.json(todos)
})

const generateId = () => {
  const maxId = todos.length > 0
    ? Math.max(...todos.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/todos', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const todo = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  todos = todos.concat(todo)

  response.json(todo)
})

app.get('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id)
  const todo = todos.find(todo => todo.id === id)

  if (todo) {
    response.json(todo)
  } else {
    response.status(404).end()
  }
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})