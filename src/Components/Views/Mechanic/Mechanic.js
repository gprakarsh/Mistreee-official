import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../../ducks/reducer'
import './Mechanic.scss'
import greeting from 'greeting'
import missingImage from './../../../assets/Image-missing.webp'
import Donut from '../Admin/Charts/Donut';
import { geolocated } from 'react-geolocated';
import Geocode from "react-geocode";
import MapContainer from './../../MapContainer/MapContainer'


class Mechanic extends Component {
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
            url: '',

        }

    }
    componentDidMount() {
        this.componentDidUpdate()
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const { name, address, number, username, url, email, id } = this.props
            this.setState({
                name: name,
                address: address,
                number: number,
                username: username,
                email: email,
                id: id,
                url: url
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
        const { name, address, number, username, email, update, id, url } = this.state
        this.setState({
            name: '',
            address: '',
            number: '',
            username: '',
            email: '',
            update: false,
            url: ''
        })
        try {
            const updatedAccount = { name, address, number, username, email, id, url }
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

    getSignedRequest = (e) => {
        let file = e.target.files[0];
        // here, we are getting the entire file, and it's properties. just like e.target.value is returning us some text on a input text onChange, we'll get an array of files that were uploaded. Since we're only uploading one - we will just pull it by referencing e.target.files[0]

        axios.get('/sign-s3', { //this is our own endpoint we will set up, and this is just a fancy way to send params. as long as you get the filename and type through, you can do it however you like.
            params: {
                'file-name': file.name,
                'file-type': file.type
            }
        }).then((response) => {
            // like i said earlier, we are grabbing a "signed request" and a url, from amazon that is allowing us to actually upload the file. The url is where the file WILL be stored - but it hasn't been yet. 
            //if we successfully get a response and enter the .then, then we will call the uploadFile function (described later ) with our 
            // 1) signedRequest, 2) file (taken from above), and 3) url where the image will go 
            const { signedRequest, url } = response.data
            this.uploadFile(signedRequest, file, url)

        }).catch(err => {
            // just catches the error of something went wrong on the server end
        })
    }

    uploadFile = (signedRequest, file, url) => {
        // here we're just setting the header, as defined in the docs, to tell amazon what type of file we're going to have
        const options = {
            headers: {
                'Content-Type': file.type,
            },
        };
        //and we simply make our request.
        axios
            .put(signedRequest, file, options)
            .then(response => {
                this.setState({ url })

                // Here we can do anything with the URL, setting state isn't required -
                // but you may want to put this URL in your database.
            })
            .catch(err => {
                if (err.response.status === 403) {
                    alert(
                        `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${
                        err.stack
                        }`
                    );
                } else {
                    alert(`ERROR: ${err.status}\n ${err.stack}`);
                }
            });
    }

    render() {
        const { address, number, username, email, update, errMessage, url, lat, lng } = this.state
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
                        <div className='files'>
                            <input id="fileCollector" type="file" onChange={this.getSignedRequest} />
                            <img src={url} onError={(e) => e.target.src = missingImage} />
                        </div>
                        <p>Address:</p>
                        <input name='address' value={address} onChange={handleInput} />
                        <MapContainer lat={lat} lng={lng} />
                        <div id='mechButtons'>
                            <button onClick={updateAccount}>Update Account</button>
                            <button onClick={() => this.setState({ update: false })}>Cancel</button>
                        </div>
                    </div>
                    : <div className='user-view'>
                        
                            <h1>{greeting.random()} {name}!</h1>
                            <p id='message'>Welcome to your dashboard. Your one stop account manager.</p>
                            <span>{errMessage}</span>
                            <div className='appMech'>
                                <img src={url} onError={(e) => e.target.src = missingImage} />
                                <div className='info'>
                                    <p>Name: {name}</p>
                                    <p>Contact Number: {number}</p>
                                    <p>Username: {username}</p>
                                    <p>Email: {email}</p>
                                    <p>Address: {address}</p>
                                </div>
                            </div>
                        
                        <div className='buttons'>
                            <button onClick={() => this.setState({ update: true })}>Update Account</button>
                            <button onClick={deletor}>Delete Account</button>
                        </div>
                    </div>}

            </div>
        )
    }
}

const m2p = (state) => {
    const { id, name, address, number, username, email, url } = state
    return {
        id,
        name,
        address,
        number,
        username,
        email,
        url
    }
}

export default connect(m2p, { updateUser })(geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    geolocationProvider: navigator.geolocation
})(Mechanic));