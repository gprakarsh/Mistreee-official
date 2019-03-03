import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import Geocode from "react-geocode";
import MapContainer from '../../MapContainer/MapContainer';
import './User3.scss'
import MyStoreCheckout from '../../Payments/MyStoreCheckout';
import StripeCheckout from 'react-stripe-checkout';


class User3 extends Component {

    constructor() {
        super()
        this.state = {}
    }

    onToken = (token) => {
        token.card = void 0;
        axios.post('/api/payment', { token, amount: 2000 }).then(response => {
            this.confirm()
        });
    }

    confirm = async () => {
        const { id, timeslot, item } = this.props.location.state
        const info = { id, timeslot, item }
        const res = await Axios.post(`/api/confirmAppointment`, info)
        this.props.history.push('/user/pending')
    }

    componentDidMount() {
        Geocode.setApiKey(process.env.REACT_APP_GOOGLEAPIKEY)
        Geocode.fromAddress(this.props.location.state.address).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                this.setState({
                    lat, lng
                })
            },
            error => {
            }
        )
    }
    render() {
        const { item, timeslot, name, number, address, id } = this.props.location.state
        const { lat, lng } = this.state
        const {confirm} = this
        return (
            <div className='user3Container'>
                <div className='user3'>
                    <div id='info'>
                        <div id='text'>
                        <h1>Checkout</h1>
                        <p>Name: {name}</p>
                        <p>Number: {number}</p>
                        <p>Address: {address}</p>
                        <p>Item: {item}</p>
                        <p>Timeslot: {timeslot}</p>
                        </div>
                        <div className='map'><MapContainer lat={lat} lng={lng} /></div>
                    </div>
                    <div className='payment'><StripeCheckout
                        token={this.onToken}
                        stripeKey={process.env.REACT_APP_STRIPEKEY}
                        amount={2000}
                    />
                    </div>
                </div>
            </div>
        )
    }
}

export default User3;



