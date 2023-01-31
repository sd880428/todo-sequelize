const express = require('express')
const router = express.Router()
const db = require('../../models/')
const Todo = db.Todo

router.get('/create', (req, res) => {
  res.render('create')
})

router.post('/', (req, res) => { //增
  const name = req.body.name
  const UserId = req.user.id
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

router.get('/:id', (req, res) => { //查
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ raw: true, nest: true, where: { id, UserId } })
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ raw: true, nest: true, where: { id, UserId } })
    .then((todo) => {
      res.render('edit', { todo })
    })
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => { //改
  const id = req.params.id
  const UserId = req.user.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => { //刪
  const id = req.params.id
  const UserId = req.user.id
  return Todo.destroy({ raw: true, nest: true, where: { id, UserId } })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router