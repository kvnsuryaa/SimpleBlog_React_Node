import React, { Component } from 'react'
import Axios from 'axios'
import {KONEKSI} from '../connection'
import decodes from 'jwt-decode'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ListBlog from './ListBlog';

export default class Home extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            blog: [],
            search: '',
            modal: false,
            tampil: '',
            category: []
        }

        this.ListElement = React.createRef()
    }

    componentDidMount() {
        this.getAllBlog()
        document.title = "Trickas Blog"
    }

    getAllBlog = () => {

        Axios.get(`${KONEKSI}/blog`)
        .then((res) => {
            this.setState({blog: res.data.blog, category: res.data.category})
        })

    }

    searchBlog = (e) => {

        var s = e.currentTarget.value
        
        if(s !== ''){
            this.setState({tampil: ''})
            Axios.get(`${KONEKSI}/blog/search/`+s)
            .then((res) => {
                this.setState({blog: res.data})
            })
        }else{
            this.getAllBlog()
        }

    }


    renderBlog = () => {

        var { tampil } = this.state
        const limit = 150;
        

        if(tampil === ''){
            const data = this.state.blog.map((item, i) => {

                var desc = item.deskripsi
    
                var judul = item.judul
    
                var nJudul = judul.replace(/ /g, "-")
                
                return (
                    <div className="card mb-3 shadow" key={i}>
                        <div className="card-body">
                            <p><b>{`${item.judul}`}</b></p>
                            <p>{`${desc.length > limit ? desc.substring(0, limit)+"...": desc}`}</p>
                            <a href={`/read/${nJudul.toLowerCase()}`} className="float-right nav-link">Read more..</a>
                        </div>
                    </div>
                )
                
            })
            return data
        }else{
        
            return <ListBlog user={tampil} ref={this.ListElement}/>

        }

    }

    logOut = () => {
        this.setState({tampil: ''})
        localStorage.clear()
        window.location.reload()

    }
    
    renderLink = () => {

        var data = localStorage.getItem('session')

        if(data){
            var decode = decodes(data)
            return (
                <div>
                    <p>Hello, {decode.username}</p>
                    <hr/>
                    
                    {/* <button className="btn btn-link p-0 nav-link" onClick={() => this.setState({tampil: ''})}>Home</button> */}
                    <a href="/" className="p-0 nav-link">Home</a>
                    <button className="btn btn-link p-0 nav-link" onClick={() => this.setState({tampil: `${decode.id_user}`})}>Your Blog</button>
                    <button className="btn btn-link p-0 nav-link" onClick={this.toggle}>Add Blog</button>
                    <hr/>
                    <button className="btn btn-link p-0 nav-link" onClick={this.logOut}>Logout</button>
                </div>
            )
            
        }else{
            return (
                <div>
                    <a href="login" className="nav-link p-1">Login</a>
                    <a href="register" className="nav-link p-1">Register</a>
                </div>
            )
        }

    }


    toggle = () => {
        var { modal } = this.state
        this.setState({modal: !modal})
    }

    renderCategory = () => {

        const data = this.state.category.map(item => {

            return <option key={item.nama} value={item.id}>{item.nama}</option>

        })

        return data

    }


    addBlog = () => {
        
        
        var session = localStorage.getItem('session')
        var decode = decodes(session)

        var title = this.refs.judul.value
        var desc  = this.refs.deskripsi.value
        var cate  = this.refs.category.value
        var image = this.refs.image.files[0]

        var formData = new FormData()

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        var data = {
            judul: title,
            deskripsi: desc,
            author_id: decode.id_user,
            id_category: cate
            
        }   
        
        if(image !== undefined){
            formData.append('image', image)
        }

        formData.append('data', JSON.stringify(data))
        
        Axios.post(`${KONEKSI}/blog/addBlog`, formData, config)
        .then((res) => {
            this.getAllBlog()
            this.setState({modal: false})
            this.ListElement.current.getUserBlog()
        }).catch((err) => {
            console.log(err)
        })

    }

    
    
    render() {

        var { modal } = this.state

        return (
            <div>
                <div className="container-fluid mt-3">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            {this.renderBlog()}
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm mb-2">
                                <div className="card-body">
                                    <input type="text" className="form-control" ref="search" placeholder="Search Article" onChange={this.searchBlog}/>
                                </div>
                            </div>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    {this.renderLink()}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                
                <Modal isOpen={modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Blog</ModalHeader>
                    <ModalBody>

                        <form>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Title" ref="judul" required/>
                            </div>
                            <div className="form-group">
                                <textarea name="" rows="4" className="form-control" placeholder="Description" ref="deskripsi" required></textarea>
                            </div>
                            <div className="form-group">
                                <select className="form-control" ref="category">
                                    <option hidden value="1">Category</option>
                                    {this.renderCategory()}
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="file" className="form-control p-1" ref="image" id="image" required/>
                            </div>
                        </form>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.addBlog()}>Add Blog</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}
