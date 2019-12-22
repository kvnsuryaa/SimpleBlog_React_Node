const konek = require('../database');
const jwt = require('jsonwebtoken');
var Hash = require('password-hash');

module.exports = {

    login: (req, res) => {
        
        var { email, password } = req.body

        var sql = `SELECT * FROM users WHERE email = '${email}'`

        konek.query(sql, (err, result) => {
            if(err) throw err
            
            if(result.length > 0){

                var pass = result[0].password
                var valid = Hash.verify(password, pass)
                if(valid){
                    
                    var days = 2;
                    var exp = new Date().getDate() + 2

                    const token = jwt.sign(
                        {
                            id_user: result[0].id,
                            username:result[0].username,
                            email: result[0].email,
                            exp_date: exp
                        }, 'secret_key')

                    res.send({result, token})
                }else{
                    res.send({error: "Email or Password is wrong!"})
                }

            }else{
                res.send({error: "Email or Password is wrong!"})
            }

            
        })

    },

    register: (req, res) => {

        var { username, email, password } = req.body

        var sql = `INSERT INTO users SET ?`

        var encrypt = Hash.generate(password)

        var data = {
            username: username,
            email: email,
            password: encrypt
        }

        konek.query(sql, data, (err, result) => {

            if(err) throw err
            var days = 2;
            var exp = new Date().getDate() + 2

            const token = jwt.sign({id_user: result.insertId,username:username, email: email, exp_date: exp}, 'secret_key')
            res.send(token)

        })


    }

}