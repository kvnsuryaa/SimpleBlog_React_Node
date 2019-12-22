import React, { Component } from 'react'
import { KONEKSI } from "../connection";
import { Redirect } from 'react-router-dom'
import axios from 'axios'

export default class Login extends Component {

    constructor(props){
        super(props)

        this.state = {}

    }

    login = (e) => {

        e.preventDefault()

        var email = this.refs.email.value
        var password = this.refs.password.value

        axios.post(`${KONEKSI}/auth/login`, {
            email: email,
            password: password
        }).then((res) => {

            var data = res.data

            if(data.token !== undefined){
                localStorage.setItem('session', res.data.token)
                window.location = "/";
            }else{
                alert(data.error)
            }

        }).catch((err) => {
            console.log(err)
        })
        
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

                                    <h3 className="mb-3">Login</h3>
                                    <form>
                                        <div className="form-group">
                                            <input type="email" className="form-control" placeholder="Email" ref="email"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control" placeholder="Password" ref="password"/>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primary float-right" onClick={(e) => this.login(e)}>Login</button>
                                            <a href="register" className="float-left nav-link text-dark">Register</a>
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
