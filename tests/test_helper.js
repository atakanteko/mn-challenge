const Todo = require('../models/todo')


const initialTodos = [
    {
      content: 'HTML is eassy',
    },
    {
      content: 'Browser can execute only Javascript',
    },
  ]

  const nonExistingId = async () => {
    const todo = new Todo({ content: 'willremovethissoon',})
    await todo.save()
    await todo.remove()
  
    return todo._id.toString()
  }
  
  const todosInDb = async () => {
    const todos = await Todo.find({})
    return todos.map(t => t.toJSON())
  }
  
  
  module.exports = {
    initialTodos, nonExistingId, todosInDb
  }