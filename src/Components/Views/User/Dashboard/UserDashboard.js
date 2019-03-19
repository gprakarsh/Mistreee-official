import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../../../ducks/reducer';
import axios from 'axios';
import './UserDashboard.scss';
import greeting from 'greeting';
import { geolocated } from 'react-geolocated';
import Geocode from "react-geocode";
import MapContainer from './../../../MapContainer/MapContainer';

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            number: '',
            username: '',
            email: '',
            update: false,
            id: 0,
            errMessage: '',
        }
    }

    componentDidMount() {
        this.componentDidUpdate()
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const { name, address, number, username, email, id } = this.props
            this.setState({
                name: name,
                address: address,
                number: number,
                username: username,
                email: email,
                id: id
            })

        }
    }

    deletor = async () => {
        const { id } = this.props
        const answer = window.confirm("Are you sure you want to delete your account");
        if (answer) {
            const deleteAccount = await axios.delete(`/api/deleteAccount/?id=${id}`)
            this.logout()
            const refresh = await window.location.reload()
            this.props.history.push('/')
        }
    }

    logout = async () => {
        const res = await axios.post(`/auth/logout`)

        const deletor = await this.props.updateUser({})
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
                }
            );
        }
    }

    updateAccount = async () => {
        const { name, address, number, username, email, update, id } = this.state
        this.setState({
            name: '',
            address: '',
            number: '',
            username: '',
            email: '',
            update: false
        })
        
        try {
            const updatedAccount = { name, address, number, username, email, id }
            const updator = await axios.put(`/api/updateAccount`, updatedAccount)
            this.logout()
            await window.location.reload()
            this.props.history.push('/login')
        }
        catch (err) {
            this.setState({
                errMessage: err.response.data
            })
        }
        this.componentDidUpdate()
    }

    render() {
        const { address, number, username, email, update, errMessage,lat,lng } = this.state
        let { name } = this.state
        const { deletor, updateAccount, handleInput } = this
        return (
            <div>
                {update
                    ? <div className='edit-view'>
                        <p>Name:</p>
                        <input name='name' value={name} onChange={handleInput} />
                        <p>Number:</p>
                        <input name='number' value={number} onChange={handleInput} />
                        <p>Username:</p>
                        <input name='username' value={username} onChange={handleInput} />
                        <p>Email:</p>
                        <input name='email' value={email} onChange={handleInput} />
                        <p>Address:</p>
                        <input name='address' value={address} onChange={handleInput} />
                        <MapContainer lat={lat} lng={lng} />
                        <div id='userButtons'>
                            <button onClick={updateAccount}>Update Account</button>
                            <button onClick={() => this.setState({ update: false })}>Cancel</button>
                        </div>
                    </div>
                    : <div className='user-view'>
                        <h1>{greeting.random()} {name}!</h1>
                        <p id='message'>Welcome to your dashboard. Your one stop account manager.</p>
                        <span>{errMessage}</span>
                        <div className='app2'>
                        <p>Name: {name}</p>
                        <p>Address: {address}</p>
                        <p>Contact Number: {number}</p>
                        <p>Username: {username}</p>
                        <p>Email: {email}</p>
                        </div>
                        <div id='buttons'>
                        <button onClick={() => this.setState({ update: true })}>Update Account</button>
                        <button onClick={deletor}>Delete Account</button>
                        </div>
                    </div>}

            </div>
        )
    }
}

const m2p = (state) => {
    const { id, name, address, number, username, email } = state
    return {
        id,
        name,
        address,
        number,
        username,
        email
    }
}

export default connect(m2p, { updateUser })(UserDashboard);