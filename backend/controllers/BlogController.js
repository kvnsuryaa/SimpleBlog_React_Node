const konek = require('../database');
const multer = require('multer');


module.exports = {

    getAllBlog: (req,res) => {

        var sql = `SELECT * FROM blog LEFT JOIN users u on u.id = blog.author_id ORDER BY blog.id DESC;`

        konek.query(sql, (err, result) => {
            if(err) throw err
            
            var sqlc = `SELECT * FROM category;`
            konek.query(sqlc, (err, results) => {
                if(err) throw err
                res.send({blog: result, category: results})
            })

        })

    },

    getSearchBlog: (req, res) => {

        var sql = `SELECT * FROM blog
        LEFT JOIN users u on u.id = blog.author_id
        WHERE judul LIKE '%${req.params.s}%'`
        konek.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })
    },

    readBlog: (req, res) => {

        var sql = `SELECT * FROM blog
        LEFT JOIN users u on u.id = blog.author_id
        LEFT JOIN category c on c.id = blog.id_category
        WHERE judul = '${req.params.judul}'`
        konek.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

    },

    userBlog: (req, res) => {

        var sql = `SELECT * FROM blog WHERE author_id = ${req.params.user}`

        konek.query(sql, (err, result) => {
            if(err) throw err
            
            var sqlc = `SELECT * FROM category;`
            konek.query(sqlc, (err, results) => {
                if(err) throw err
                res.send({blog: result, category: results})

            })  
            

        })

    },


    addBlog: (req, res) => {    
        
        if(req.files !== null){

            var file = req.files.image,
            filename = file.name;
        
            var path = "./public/blog/"

            file.mv(path+filename, (err) => {
                if(err) throw err

                const data = JSON.parse(req.body.data)
                data.created_at = new Date()
                data.image = filename
                

                var sql = `INSERT INTO blog SET ?`

                konek.query(sql, data, (err, result) => {
                    if(err) throw err
                    res.send(result)
                })

            })

        }else{
            const data = JSON.parse(req.body.data)
            data.created_at = new Date()

            var sql = `INSERT INTO blog SET ?`

            konek.query(sql, data, (err, result) => {
                if(err) throw err
                res.send(result)
            })
        }

    },

    deleteBlog: (req, res) => {

        var sql = `DELETE FROM blog WHERE id = ${req.body.id}`

        konek.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

    },

    updateBlog: (req, res) => {

        if(req.files !== null){

            var file = req.files.image,
            filename = file.name;

            var path = "./public/blog/"

            file.mv(path+filename, err => {
                if(err) throw err
                const data = JSON.parse(req.body.data)
                data.image = filename
                const id = req.body.id

                var sql = `UPDATE blog SET ? WHERE id = ${id}`

                konek.query(sql, data, (err, result) => {
                    if(err) throw err
                    res.send(result)
                })


            })
            
        }else{

            const data = JSON.parse(req.body.data)
            data.image = null
            const id = req.body.id

            var sql = `UPDATE blog SET ? WHERE id = ${id}`

            konek.query(sql, data, (err, result) => {
                if(err) throw err
                res.send(result)
            })

        }
        
        

    }

}