const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Todo = require('../models/todo')



beforeEach(async () => {
  await Todo.deleteMany({})

  const todosObjects = helper.initialTodos.map(t => new Todo(t))
  const promiseArray = todosObjects.map(t => t.save())
  await Promise.all(promiseArray)
})


describe('when there is initially some todos saved',()=>{

  test('todos are returned as json', async () => {
    await api
      .get('/api/todos')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all todos are returned', async () => {
    const response = await api.get('/api/todos')
    expect(response.body).toHaveLength(helper.initialTodos.length)
  })

  test('a specific todo is within the returned todos', async () => {
    const response = await api.get('/api/todos')
  
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })

})


describe('viewing a specific note', () => {

  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.todosInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/todos/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with statuscode 404 if todo does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/todos/${validNonexistingId}`)
      .expect(404)
  })  


})

describe('addition of a new note', () => {

  /*Let's start with the operation for adding a new todo. 
  Let's write a test that adds a new todo and verifies that the amount of todos returned by the API increases, 
  and that the newly added todo is in the list.*/
  test('a valid todo can be added', async () => {
    const newTodo = {
      content : 'this is a test content in order to add a new todo',
    }

    await api
          .post('/api/todos')
          .send(newTodo)
          .expect(200)
          .expect('Content-Type', /application\/json/)

          const todosAtEnd = await helper.todosInDb()
          expect(todosAtEnd).toHaveLength(helper.initialTodos.length + 1)
        
          const contents = todosAtEnd.map(n => n.content)
          expect(contents).toContain('this is a test content in order to add a new todo')
  })

  /*Let's also write a test that verifies that a todo without content will not be saved into the database.*/
  test('todo without content is not added', async () => {
    const newTodo = {
      
    }

    await api
      .post('/api/todos')
      .send(newTodo)
      .expect(400)

    const response = await helper.todosInDb()

    expect(response).toHaveLength(helper.initialTodos.length)
  })

})





/*
test('there are two todos', async () => {
  const response = await api.get('/api/todos')

  expect(response.body).toHaveLength(2)
})

test('the first todo is about Lorem Ipsum', async () => {
  const response = await api.get('/api/todos')

  expect(response.body[0].content).toBe('HTML is eassy')
})*/

afterAll(() => {
  mongoose.connection.close()
})