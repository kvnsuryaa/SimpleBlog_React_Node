import React, { Component } from 'react'
import Axios from 'axios'
import { KONEKSI } from '../connection'
import moment from 'moment'
import decodes from 'jwt-decode'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ListBlog extends Component {

    constructor(props){
        super(props)

        this.state = {
            list: [],
            modal: false,
            edit: [],
            category: []
        }

    }

    componentDidMount(){
        this.getUserBlog()
    }

    getUserBlog = () => {

        Axios.get(`${KONEKSI}/blog/userBlog/`+this.props.user)
        .then((res) => {
            this.setState({list: res.data.blog, category: res.data.category})
        }).catch((err) => {
            console.log(err)
        })
        
    }

    renderCategory = () => {

        const data = this.state.category.map(item => {

            return <option key={item.nama} value={item.id}>{item.nama}</option>

        })

        return data

    }
    

    renderList = () => {

        var { list } = this.state

        if(list.length > 0){

            const data = list.map((item) => {

                var limit = 150;
                var desc = item.deskripsi;

                return (
                    <tr key={item.judul}>
                        <td>{item.image === null ? "No Image":"OK"}</td>
                        <td>{item.judul}</td>
                        <td width="250">{`${desc.length > limit ? desc.substring(0, limit)+"...": desc}`}</td>
                        <td>{moment(item.created_at).format("YYYY/MMM/DD")}</td>
                        <td className="text-center" width="100"><button className="btn btn-warning btn-sm" onClick={() => this.toggle(item)}><i className="fa fa-edit"></i></button>{' '}
                            <button className="btn btn-danger btn-sm" onClick={() => this.deleteBlog(item.id)}><i className="fa fa-trash"></i></button></td>
                    </tr>
                )

            })
            return data

        }else{
            return (
                <tr>
                    <td colSpan="8" className="text-secondary text-center">No Article Created</td>
                </tr>
            )
        }

    }

    deleteBlog = (id) => {

        var valid = window.confirm("Are you sure want to delete this?")
        if(valid){
            Axios.post(`${KONEKSI}/blog/deleteBlog`, {id:id})
            .then((res) => {
                alert("Delete Success")
                this.getUserBlog()
            }).catch((err) => {
                console.log(err)
            })

        }else{
            return false
        }

    }

    toggle = (item) => {
        var { modal } = this.state
        this.setState({modal: !modal, edit: item})
    }

    updateBlog = () => {

        var session = localStorage.getItem('session')
        var decode = decodes(session)

        var id = this.refs.id.value
        var title = this.refs.judul.value
        var desc  = this.refs.deskripsi.value
        var cate  = this.refs.category.value
        var image = this.refs.image.files[0]

        var formData = new FormData()

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        var data = {
            id: id,
            judul: title,
            deskripsi: desc,
            author_id: decode.id_user,
            id_category: cate
        }   

        if(image !== undefined){
            formData.append('image', image)
        }


        formData.append('data', JSON.stringify(data))
        formData.append('id', id)

        Axios.post(`${KONEKSI}/blog/updateBlog`, formData, config)
        .then((res) => {
            this.getUserBlog()
            this.setState({modal: false})
        }).catch((err) => {
            console.log(err)
        })
        

    }

    render() {

        var { modal, edit } = this.state

        return (
            <div>
                <table className="table table-bordered">
                    <thead className="text-center">
                        <tr>
                            <th>Image</th>
                            <th>Judul</th>
                            <th>Deskripsi</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderList()}
                    </tbody>
                </table>

                <Modal isOpen={modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit Blog</ModalHeader>
                    <ModalBody>

                        <form>
                            <div className="form-group">
                                <input type="hidden" defaultValue={edit.id} readOnly ref="id"/>
                                <input type="text" className="form-control" placeholder="Title" ref="judul" defaultValue={edit.judul} required/>
                            </div>
                            <div className="form-group">
                                <textarea name="" rows="4" className="form-control" placeholder="Description" ref="deskripsi" defaultValue={edit.deskripsi} required></textarea>
                            </div>
                            <div className="form-group">
                                <select className="form-control" ref="category">
                                    <option hidden value="1">Category</option>
                                    {this.renderCategory()}
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="file" className="form-control p-1" ref="image" required/>
                            </div>
                        </form>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateBlog}>Edit Blog</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>


            </div>
        )
    }
}
