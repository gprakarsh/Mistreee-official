import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from './../../../../ducks/reducer'
import ItemsMapper from '../../../Registration/MechanicWizard/ItemsMapper';
import './JobRequests.scss'
import missingImage from './../../../../assets/Image-missing.png'
import {Link} from 'react-router-dom';
import ReactLoading from 'react-loading';
import io from 'socket.io-client'

class JobRequests extends Component {

    constructor() {
        super()
        this.state = {
            apps: [],
            pendingApps: [],
            loading:true
        }
    }
    componentDidMount = () => {
        console.log('joining socket party')
        this.socket = io()
        this.getApps()
    }

    getApps = async () => {
        const { name } = this.props
        if (!name) {
            try {
                const userRes = await axios.get(`/auth/user`)
                this.props.updateUser(userRes.data)
            }
            catch (err) {
                console.log(err)
                this.props.history.push('/')
            }
        }

        try {
            const appsRes = await axios(`/api/apps`)
            const apps = appsRes.data.filter((app) => {
                return !app.disapproved
            })
            this.setState({
                apps: apps,
                loading:false
            })
        }

        catch{ }
        console.log(this.state)
    }

    approve = async (app_id) => {
        axios.put(`/api/approve`, { app_id }).then(() => {
            this.setState({
                apps: []
            })
            console.log('socket should update')
            this.socket.emit('someoneLoggedIn')
        }).catch((err)=>{
            console.log('socket should update')
            this.socket.emit('someoneLoggedIn')
        })
        this.getApps()
    }

    disapprove = async (app_id) => {
        axios.put(`/api/disapprove`, { app_id }).then(() => {
            this.setState({
                apps: []
            })
        })
        this.getApps()
    }

    render() {
        const{approve,disapprove}= this
        const mapper = this.state.apps.map(app => {
            if (!app.disapproved) {
                return (
                    <div key={app.app_id} className='app'>
                        <img src={app.url} onError={(e) => e.target.src = missingImage} />
                        <div id='details'>
                            <p>Name: {app.name}</p>
                            <p>Address: {app.address}</p>
                            <p>Number: {app.number}</p>
                            <p>Email: {app.email}</p>
                            <Link to={{
                                pathname: '/mech/reason',
                                state: {
                                    reason: app.reason,
                                    id:app.app_id,
                                },
                                functions:{
                                    approve:approve,
                                    disapprove:disapprove                                    
                                }
                            }}><button>Read reason</button></Link>
                        </div>
                        <p id='canfix'>Can Fix:</p>
                        <div id='items'>
                            <ItemsMapper items={app.items} style1={{ display: 'none' }} style2={{height:'5vh',width:'auto',fontSize:'18px',backgroundColor:'black'}}/>
                        </div>
                        <div id='buttons'>
                            <button onClick={() => this.approve(app.app_id)}>Approve</button>
                            <button onClick={() => this.disapprove(app.app_id)}>Disapprove</button>
                        </div>
                    </div>
                )
            }
            return
        })

        if(this.state.loading){
            return(<div className='loading'><ReactLoading type={'bars'} color={'black'} /></div>)
        }
        return (
            <div className='apps'>
                {this.state.apps.length === 0
                    ? <div style={{textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',height:'80vh'}}>No more Job Requests {console.log(this.state)}</div>
                    : <div id='mapper'>{mapper}</div>
                }
            </div>
        )
    }
}

export default connect(null, { updateUser })(JobRequests)