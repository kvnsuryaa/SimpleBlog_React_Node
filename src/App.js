import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import './App.css';

import Home from './components/Home'
import Read from './components/Read'
import Session from './components/Session'
import Login from './components/Login'
import Register from './components/Register'

export default class App extends Component {


  render(){

    return(
      <div>
        <Session>
          <Route exact path="/" component={Home}/>
          <Route path="/read/:article" component={Read} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Session>
      </div>
    ) 

  }
  
}
