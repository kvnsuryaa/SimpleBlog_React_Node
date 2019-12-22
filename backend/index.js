const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
var konek = require('./database');
var upload = require('express-fileupload');

var app = express();

app.use(upload())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

// IMAGES
app.use(express.static('./public'))



// Routes
const { blogRoute, authRoute } = require('./routes')

app.use('/blog', blogRoute);
app.use('/auth', authRoute);



app.listen(4000, () => console.log("Listen at 4000"))

app.get('/', (req, res) => {
    res.send("<h3> Selamat Datang di Node </h3>")
})