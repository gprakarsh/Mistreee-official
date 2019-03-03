import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer';
import CommonNav from './CommonNav/CommonNav';
import AdminNav from './AdminNav/AdminNav';
import MechNav from './MechNav/MechNav';
import LoggedInNav from './LoggedInNav/LoggedInNav';
import { withRouter } from 'react-router-dom'
import UserNav from './UserNav/UserNav'


class NavBar extends Component {

    componentDidMount = async () => {
        const { name } = this.props
        if (!name) {
            try {
                const userRes = await axios.get(`/auth/user`)
                this.props.updateUser(userRes.data)
            }
            catch (err) {

                this.props.history.push(`/`)

            }
        }

    }



    logout = async() => {
        const wait = await axios.post(`/auth/logout`)            
        this.props.updateUser({})
    }

    render() {
        const { username, isadmin, ismechanic,app_id } = this.props
        const { logout } = this
        if (username) {
            if (isadmin) {
                return (
                    <div style={{height:'15vh',width:'100%'}}>
                        <LoggedInNav username={username} logout={logout} />
                        <AdminNav />
                    </div>
                )
            }
            else if (ismechanic) {
                return (
                    <div style={{height:'15vh',width:'100%'}}>
                        <LoggedInNav username={username} logout={logout} />
                        <MechNav />
                    </div>
                )
            }
            else if (app_id) {
                return (
                    <div style={{height:'15vh',width:'100%'}}>
                        <LoggedInNav username={username} logout={logout} />
                    </div>
                )
            }
            else {
                return (
                    <div style={{height:'15vh',width:'100%'}}>
                        <LoggedInNav username={username} logout={logout} />
                        <UserNav />
                    </div>
                )
            }
        }
        else {
            return (
                <div style={{height:'15vh',width:'100%'}}>
                    <CommonNav />
                </div>
            )
        }
    }
}

const m2p = (state) => {
    return {
        name: state.name,
        username: state.username,
        isadmin: state.isadmin,
        ismechanic: state.ismechanic,
        app_id:state.app_id
    }
}

export default withRouter(connect(m2p, { updateUser })(NavBar))
