import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from './../../../ducks/reducer'
import ItemsMapper from './ItemsMapper';
import './MechanicWizard.scss'
import missingImage from './../../../assets/Image-missing.png';
import MapContainer from './../../MapContainer/MapContainer';
import { geolocated } from 'react-geolocated';
import Geocode from "react-geocode";



class MechanicWizard extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            address: '',
            lat: 0,
            lng: 0,
            number: '',
            username: '',
            password1: '',
            password2: '',
            reason: '',
            item: '',
            items: [],
            errMessage: '',
            email: '',
            url: '',
        }
    }

    componentDidUpdate=async(prevProps)=> {
        if (prevProps !== this.props) {
            if (this.props.isGeolocationEnabled && this.props.isGeolocationAvailable) {
                const { latitude, longitude } = this.props.coords

                const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLEAPIKEY}`)

                this.setState({
                    lat: latitude,
                    lng: longitude,
                    address:res.data.results[0].formatted_address
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

    apply = async () => {
        const { name, address, number, username, password1, password2, reason, items, email, url } = this.state
        if (password1 === password2) {
            const prospMech = { name, address, number, username, password: password1, reason, items, email, url }
            this.setState({
                name: '',
                address: '',
                number: '',
                username: '',
                password1: '',
                password2: '',
                item: '',
                items: [],
                email: '',
                url: '',

            })
            try {
                const appRes = await axios.post(`/auth/apply`, prospMech)
                this.props.updateUser(appRes.data)
                this.props.history.push('/applied/na')
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

    addItem = () => {
        let { item, items } = this.state
        let itemsCopy = items.slice()
        itemsCopy.push(item.toLowerCase())
        this.setState({
            items: itemsCopy,
            item: ''
        })
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
            console.log(err)
        })
        console.log(this.state)
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

    deleteItem = (i) => {
        let items = this.state.items.slice()
        items.splice(i, 1)
        this.setState({
            items: items
        })
    }
    render() {
        const { handleInput, apply, addItem, deleteItem } = this
        const { name, address, number, username, password1, password2, reason, items, item, email, url, lat, lng } = this.state

        return (
            <div className='MechanicWizard'>
                <h1>Sign up</h1>
                <span>{this.state.errMessage}</span>
                <p>Enter name</p>
                <input name='name' placeholder='Enter Name' onChange={handleInput} value={name} />
                <p>Enter contact number</p>
                <input name='number' placeholder='Enter Number' onChange={handleInput} value={number} />
                <p>Enter a unique username</p>
                <input name='username' placeholder='Choose Username' onChange={handleInput} value={username} />
                <p>Enter a valid email</p>
                <input name='email' value={email} placeholder='Enter email' onChange={handleInput} />
                <p>Upload picture</p>
                <div className='files'>
                    <input id="fileCollector" type="file" onChange={this.getSignedRequest} />
                    <img src={url} onError={(e) => e.target.src = missingImage} />
                </div>
                <p>Set password</p>
                <input name='password1' type='password' placeholder='Enter Password' onChange={handleInput} value={password1} />
                <input name='password2' type='password' placeholder='Confirm Password' onChange={handleInput} value={password2} />
                <div>
                    {password1 === password2
                        ?
                        password1 === ''
                            ? <p></p>
                            : <p id='match'>Passwords match</p>
                        : <p id='mismatch'>Passwords do not match</p>}
                </div>
                <p>Tell us why you want to be a mechanic for Mistreee</p>
                <textarea name='reason' maxLength={1000} onChange={handleInput} value={reason} />
                <p>What items can you repair?</p>
                <ItemsMapper items={items} deleteItem={deleteItem} />
                <div className='items'>
                    <input name='item' onChange={handleInput} value={item} />
                    <button id='add' type='submit' onClick={addItem}>Add Item <i class="fas fa-arrow-right"></i></button>
                </div>
                <p>Enter address</p>
                <input name='address' placeholder='Enter Address' onChange={handleInput} value={address} />
                <MapContainer lat={lat} lng={lng} />
                <button id="submit" onClick={apply}>Submit Application <i class="fas fa-arrow-right"></i></button>
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
})(MechanicWizard));
