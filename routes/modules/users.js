const express = require('express')
const router = express.Router()
const passport = require('passport')
const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureMessage: true,
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  //--表單檢查--
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "請填寫所有欄位!" })
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不符!" })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  //--表單檢查--

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: "使用者已註冊!" }) //--表單檢查--
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash("successMsg", "你已成功登出!")
  res.redirect("/users/login")
})

module.exports = router
