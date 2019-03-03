import React, { Component } from 'react'
import Axios from 'axios';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading'
import './PendingRequests.scss'


class PendingRequests extends Component {

    constructor() {
        super();
        this.state = {
            pendingRequests: [],
            loading: true
        }
    }

    componentDidMount() {
        this.componentDidUpdate()
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps !== this.props) {
            const { id } = this.props
            const pRes = await Axios.get(`/api/pendingReq/?id=${id}`)
            this.setState({
                pendingRequests: pRes.data,
                loading: false
            })
        }
    }

    render() {
        const mapper = this.state.pendingRequests.map((req) => {
            return (
                <div className='app'>
                    <p>Address: {req.address}</p>
                    <p>Number: {req.number}</p>
                    <p>Item: {req.item}</p>
                </div>
            )
        })
        if (this.state.loading) {
            return (<div className='loading'><ReactLoading type={'bars'} color={'black'} />{console.log(typeof this.props.id)}</div>)
        }
        return (
            <div className='pending'>
                {this.state.pendingRequests.length === 0
                    ? <div style={{fontSize:'40px'}}>No pending requests</div>
                    :
                    <div>
                        {mapper}
                    </div>
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

export default connect(m2p)(PendingRequests)