import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from './../../../ducks/reducer'
import './UserWizard.scss'
import Geocode from "react-geocode";
import MapContainer from './../../MapContainer/MapContainer';
import { geolocated } from 'react-geolocated';




class UserWizard extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            name: '',
            address: '',
            lat: 0,
            lng: 0,
            number: '',
            username: '',
            email: '',
            password1: '',
            password2: '',
            errMessage: '',
        }
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps !== this.props) {
            if (this.props.isGeolocationEnabled && this.props.isGeolocationAvailable) {
                const { latitude, longitude } = this.props.coords

                const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLEAPIKEY}`)


                this.setState({
                    lat: latitude,
                    lng: longitude,
                    address: res.data.results[0].formatted_address
                }, () => console.log(this.state))
            }
        }
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'address') {
            Geocode.setApiKey(process.env.REACT_APP_GOOGLEAPIKEY)
            Geocode.fromAddress(e.target.value).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    this.setState({
                        lat, lng
                    })
                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    register = async () => {
        const { name, address, number, username, password1, password2, email, lat, lng } = this.state
        if (password1 === password2) {
            const newUser = { name, address, isadmin: false, ismechanic: false, number, username, password: password1, email }
            this.setState({
                name: '',
                address: '',
                number: '',
                username: '',
                password1: '',
                password2: '',
                email: ''
            })
            try {
                const regRes = await axios.post(`/auth/register`, newUser)
                this.props.updateUser(regRes.data)
                this.props.history.push('/user')
            }
            catch (err) {
                this.setState({
                    errMessage: err.response.data
                })
            }
        }
        else {

        }
    }
    render() {
        const { name, address, number, username, password1, password2, email, lat, lng, currentLocation } = this.state
        const { register, handleInput } = this
        return (
            <div>

                <div className='UserWizard'>
                    <h1>Sign up</h1>
                    <span>{this.state.errMessage}</span>
                    <p>Enter name</p>
                    <input name='name' value={name} placeholder='Enter Name' onChange={handleInput} />
                    <p>Enter contact number</p>
                    <input name='number' value={number} placeholder='Enter Number' onChange={handleInput} />
                    <p>Enter a unique username</p>
                    <input name='username' value={username} placeholder='Choose Username' onChange={handleInput} />
                    <p>Enter a valid email</p>
                    <input name='email' value={email} placeholder='Enter email' onChange={handleInput} />
                    <p>Set Password</p>
                    <input name='password1' type='password' placeholder='Enter Password' value={password1} onChange={handleInput} />
                    <input name='password2' type='password' placeholder='Confirm Password' value={password2} onChange={handleInput} />
                    <div>
                        {password1 === password2
                            ?
                            password1 === ''
                                ? <p></p>
                                : <p id='match'>Passwords match</p>
                            : <p id='mismatch'>Passwords do not match</p>}
                    </div>
                    <p>Enter address</p>
                    <input name='address' value={address} placeholder='Enter Address' onChange={handleInput} />
                    <MapContainer lat={lat} lng={lng} />
                    <button onClick={register}>Register <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        )
    }
}


export default connect(null, { updateUser })(geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    geolocationProvider: navigator.geolocation
})(UserWizard));