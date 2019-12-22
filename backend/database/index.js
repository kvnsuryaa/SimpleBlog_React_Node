const mysql = require('mysql');

var konek = mysql.createConnection({

    host:'localhost',
    port:'8889',
    user: 'root',
    password: 'root',
    database: 'blog_react'

})

// Check the Connection

konek.connect((err) => {
    if(!err){
        console.log('DB connected')
    }else{
        console.log('DB not connected')
    }
})

module.exports = konek;