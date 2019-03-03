import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import './ConfirmedRequest.scss'
import missingImage from './../../../../assets/Image-missing.webp'



class ConfirmedRequests extends Component {

    constructor() {
        super();
        this.state = {
            confirmedRequests: []
        }
    }

    componentDidMount = async () => {
        const { id } = this.props
        const cRes = await axios.get(`/api/confirmReq/?id=${id}`)
        this.setState({
            confirmedRequests: cRes.data
        })
    }
    render() {
        const mapper = this.state.confirmedRequests.map((req) => {
            return (
                <div className='app'>
                    <div className='mechDetails'>
                        <img src={req.mechDetails.url} onError={(e) => e.target.src = missingImage}/>
                        <div id='mechContact'>
                        <p>Mechanic Name: {req.mechDetails.name}</p>
                        <p>Mechanic Number: {req.mechDetails.number}</p>
                        </div>
                    </div>
                    <p>Address: {req.address}</p>
                    <p>Number: {req.number}</p>
                    <p>Item: {req.item}</p>
                </div>
            )
        })
        return (
            <div className='confirmed'>
                {this.state.confirmedRequests.length === 0
                    ? <div style={{fontSize:'40px'}}>No confirmed requests</div>
                    : <div> {mapper}</div>
                }
            </div>
        )
    }
}

const m2p = (state) => {
    return {
        id: state.id
    }
}

export default connect(m2p)(ConfirmedRequests);

