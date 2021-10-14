const mongoose = require('mongoose')


const password = "atakan"

const url =
  `mongodb+srv://ata:${password}@cluster0.k1pwt.mongodb.net/todo-app?retryWrites=true&w=majority`

mongoose.connect(url)

const todoSchema = new mongoose.Schema({
  content: String,
})

const Todo = mongoose.model('Todo', todoSchema)

const todo = new Todo({
  content: 'Lorem Ipsum'
})

todo.save().then(result => {
  console.log('todo saved!')
  mongoose.connection.close()
})

Todo.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
})