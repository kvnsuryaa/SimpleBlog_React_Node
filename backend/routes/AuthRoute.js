const express = require('express')
var route = express.Router();
const { auth } = require('../controllers')

route.post('/login', auth.login)
route.post('/register', auth.register)

module.exports = route