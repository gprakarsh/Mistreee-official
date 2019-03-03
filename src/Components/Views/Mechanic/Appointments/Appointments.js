import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../../../ducks/reducer'
import ReactLoading from 'react-loading'
import './Appointments.scss'


class Appointments extends Component {
    constructor() {
        super()
        this.state = {
            appointments: [],
            loading:true
        }
    }
    componentDidMount (){
        this.getReq()  
        
    }
    componentDidUpdate(prevProps){
        if(prevProps!==this.props){
            this.getReq()  
        }
    }
    getReq = async () => {
        const { id } = this.props
        console.log(id)
        const res = await axios.get(`/api/mech/appointments/?id=${id}`)
        this.setState({
            appointments: res.data,
            loading:false
        })
    }

    render() {
        const mapper = this.state.appointments.map((req, i) => {
            return (
                <div key={i} className='app'>
                {console.log(req)}
                    <p>Name: {req.name}</p>
                    <p>Item: {req.item}</p>
                    <p>Time: {req.time}</p>
                    <p>Number: {req.number}</p>
                    <p>Address: {req.address}</p>
                    <button><a href={`http://maps.google.com/maps?daddr=${req.address}`} target="_blank">Get Directions</a></button>
                </div>
            )
        })
        if(this.state.loading){
            return(<div className='loading'><ReactLoading type={'bars'} color={'black'} />{console.log( typeof this.props.id)}</div>)
        }
        return (
            <div >
                {this.state.appointments.length===0
                ?<p style={{fontSize:'40px'}}>No Appointments</p>
                :<div className='appointments'>{mapper}</div>}
            </div>
        )
    }
}

const m2p = (state) => {
    return {
        id: state.id
    }
}
export default connect(m2p, { updateUser })(Appointments)