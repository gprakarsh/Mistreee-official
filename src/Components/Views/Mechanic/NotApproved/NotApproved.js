import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../../../ducks/reducer'
import './NotApproved.scss'


class NotApproved extends Component {
    componentDidMount = async () => {
        const { name } = this.props
        if (!name) {
            try {
                const userRes = await axios.get(`/auth/user`)
                this.props.updateUser(userRes.data)
            }
            catch (err) {
                this.props.history.push('/')
            }
        }
    }
    render() {
        return (
            <div className='notApproved'>
                {this.props.disapproved
                    ? <div>
                        <p>Sorry, you have been disapproved.</p>
                        <p>But, hey you can still be part of the mistreee family and avail repair service using this same account</p>
                    </div>
                    : <div>
                        <h2>Application is under review</h2>
                        <p>Please check your email for more details</p>
                    </div>
                }
            </div>
        )
    }
}

const m2p = (state) => {
    return {
        name: state.name,
        disapproved: state.disapproved
    }
}

export default connect(m2p, { updateUser })(NotApproved)
