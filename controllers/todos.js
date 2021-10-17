const todosRouter = require('express').Router()

const Todo = require('../models/todo')

todosRouter.get('/', async (req, res) => {
  const todos = await Todo.find({})
  res.json(todos.map(t => t.toJSON()))
})
  
todosRouter.post('/', async (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
  
    const todo = new Todo({
      content: body.content
    })

    try{
      const savedToDo = await todo.save()
      response.json(savedToDo.toJSON())
    }catch(ex){
      next(ex)
    }
    
})
  
todosRouter.get('/:id', async (request, response) => {
    const toDo = await Todo.findById(request.params.id)
    if (toDo) {
      response.json(toDo.toJSON())
    } else {
      response.status(404).end()
    }
})

todosRouter.delete('/:id', (request, response) => {
    Todo.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

module.exports = todosRouter


