import React, { Component } from 'react'
import decodes from 'jwt-decode'


export default class Valid extends Component {
    
    constructor(props){
        super(props)

        this.state = {}
    }

    componentDidMount(){
        this.getSession()
    }

    getSession = () => {

        var session = localStorage.getItem('session')
        if(session){
            
            const decode = decodes(session)
            var exp = decode.exp_date
            var now = new Date().getDate()
            
            if(now > exp){
                localStorage.clear()
            }

        }

    }


    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
