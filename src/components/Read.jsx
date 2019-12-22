import React, { Component } from 'react'
import { KONEKSI } from '../connection'
import axios from 'axios'

export default class Read extends Component {

    constructor(props){
        super(props)
        this.state = {
            blog: []
        }
    }

    componentDidMount(){
        this.readArticle()

        var title = this.props.match.params.article

        var nTitle = title.replace(/-/g, " ")

        document.title = `Reading - ${nTitle.toLowerCase()}`

    }

    readArticle = () => {

        var title = this.props.match.params.article

        var nTitle = title.replace(/-/g, " ")

        axios.get(`${KONEKSI}/blog/read/`+nTitle)
        .then((res) => {
            this.setState({blog: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    appendImage = (item) => {
        if(item.image !== null){
            return <img src={`${KONEKSI}/blog/${item.image}`} alt="Poster" width="100%" height="300"/>
        }else{
            return ''
        }
    }


    reader = () => {

        const data = this.state.blog.map((item) => {
            return (
                <div className="card" key={item.judul}>
                    <div className="card-body">
                        {this.appendImage(item)}
                        <h2>{item.judul}</h2>
                        <small>Author ~ <em>{item.username}</em> | <span className="text-primary">{item.nama}</span></small>
                        <p className="text-justify mt-3">{item.deskripsi}</p>
                    </div>
                </div>
            )
        })
        return data

    }
    
    
    render() {

        return (
            <div>
                <div className="container-fluid mt-3">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            {this.reader()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
