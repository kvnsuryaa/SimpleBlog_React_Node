import React, { Component } from 'react'
import { KONEKSI } from '../connection'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

export default class Register extends Component {

    constructor(props){
        super(props)

        this.state = {}

    }

    register = (e) => {

        e.preventDefault()

        var username = this.refs.username.value
        var email = this.refs.email.value
        var password = this.refs.password.value
        var re_password = this.refs.re_password.value

        if(password === re_password){

            axios.post(`${KONEKSI}/auth/register`, {
                username: username,
                email:email,
                password:password
            }).then((res) => {
                localStorage.setItem('session', res.data)
                window.location = "/";
            }).catch((err) => {
                console.log(err)
            })

        }else{
            alert("Your password not same")
        }

    }


    render() {

        var session = localStorage.getItem('session')
        if(session){
            return <Redirect to="/"/>
        }

        return (
            <div>
                <div className="container-fluid mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-4">

                            <div className="card shadow">
                                <div className="card-body">

                                    <h3 className="mb-3">Register</h3>
                                    <form>
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Username" ref="username"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="email" className="form-control" placeholder="Email" ref="email"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control" placeholder="Password" ref="password"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control" placeholder="Re-type Password" ref="re_password"/>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primary float-right" onClick={(e) => this.register(e)}>Register</button>
                                            <a href="login" className="float-left nav-link text-dark">Login</a>                                            
                                        </div>
                                    </form>
                                    
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
