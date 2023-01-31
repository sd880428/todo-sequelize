const express = require('express')
const route = express.Router()
const db = require('../../models/')
const Todo = db.Todo

route.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

module.exports = route