import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../../../ducks/reducer'
import './ServiceRequests.scss'
import ReactLoading from 'react-loading'
import { geolocated } from 'react-geolocated';
import jsonp from 'jsonp'


class ServiceRequests extends Component {
    constructor() {
        super()
        this.state = {
            requests: [],
            loading:true,
            currentLocation:'',
            distances:[]
        }
    }
    componentDidMount = async () => {
        const wait = await this.getReq()
        if (this.props.isGeolocationEnabled && this.props.isGeolocationAvailable) {
            const { latitude, longitude } = this.props.coords

           

            for(let i=0;i<this.state.requests.length;i++){
                let req = this.state.requests[i]
                let destination = req.address.split(' ').join('+')
                
                 axios.get(`http://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${process.env.REACT_APP_GOOGLEAPIKEY}`).then(res=>{
                     console.log(res)
                 })
                
            }

            this.setState({
                lat: latitude,
                lng: longitude
                // address:res.data.results[0].formatted_address
            }, () => console.log(this.state))
        }
    }
    getReq = async () => {
        const { id } = this.props
        const res = await axios.get(`/api/mech/serviceReq/?id=${id}`)
        this.setState({
            requests: res.data.serviceReq,
            distances:res.data.distances,
            loading:false
        })
        return true
    }
    confirm = async (req_id) => {
        const { id } = this.props
        const res = await axios.get(`/api/mech/confirm/?id=${req_id}&mech_id=${id}`)
        await this.getReq()
    }
    render() {
        const { confirm } = this

        const mapper = this.state.requests.map((req, i) => {
            return (
                <div key={i} className='req'>
                    <p>Name: {req.name}</p>
                    <p>Item: {req.item}</p>
                    <p>Time: {req.time}</p>
                    <p>Number: {req.number}</p>
                    <p>Address: {req.address}</p>
                    <p>Distance: {this.state.distances[i]}</p>
                    <button onClick={() => confirm(req.id)}>Confirm Appointment</button>
                </div>
            )
        })
        if(this.state.loading){
            return(<div className='loading'><ReactLoading type={'bars'} color={'black'} />{console.log( typeof this.props.id)}</div>)
        }
        return (
            <div className='reqs'>
                {mapper}
            </div>
        )
    }
}

const m2p = (state) => {
    return {
        id: state.id,
        address:state.address
    }
}
export default connect(m2p, { updateUser })(geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    geolocationProvider: navigator.geolocation
})(ServiceRequests));