const express = require('express')
var route = express.Router();
const { blog } = require('../controllers')

route.get('/', blog.getAllBlog);
route.get('/search/:s', blog.getSearchBlog);
route.get('/read/:judul', blog.readBlog);
route.get('/userBlog/:user', blog.userBlog);
route.post('/addBlog', blog.addBlog);
route.post('/deleteBlog', blog.deleteBlog);
route.post('/updateBlog', blog.updateBlog);


module.exports = route