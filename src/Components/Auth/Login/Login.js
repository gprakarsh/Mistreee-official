import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from './../../../ducks/reducer'
import './Login.scss'
import io from 'socket.io-client'


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errMessage:''
        }
    }

    componentDidMount=()=>{
        this.socket = io()
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    login = async () => {
        const { username, password } = this.state
        try {
            const loginRes = await axios.post(`/auth/login`, { username, password })
            const { isadmin, ismechanic, id, app_id } = loginRes.data
            this.socket.emit('someoneLoggedIn')
            if (isadmin) {
                this.props.updateUser(loginRes.data)
                this.props.history.push('/admin')
            }
            else if (ismechanic) {
                this.props.updateUser(loginRes.data)
                this.props.history.push('/mechanic')
            }
            else if (id) {
                this.props.updateUser(loginRes.data)
                this.props.history.push('/user/dashboard')
            }
            else if (app_id) {
                this.props.updateUser(loginRes.data)
                this.props.history.push('/applied/na')
            }
            console.log({mechDetails:loginRes.data})
        }
        catch (err) {
            this.setState({
                errMessage:err.response.data
            })
        }

    }
    render() {
        const { username, password,errMessage } = this.state;
        const { login, handleInput } = this;
        return (
            <div className='Login'>
                <Link to='/'><i class="fas fa-times" id='cross'></i></Link>
                <h1>Sign in</h1>
                <span>{errMessage}</span>
                <p>Enter Username or Email</p>
                <input name='username' type='username' id ='input' placeholder='Username/Email' value={username} onChange={handleInput} />
                <p>Enter Password</p>
                <input name='password' type='password' id ='input' placeholder='Password' value={password} onChange={handleInput} />
                <button onClick={login}><p>Sign in</p> <i class="fas fa-arrow-right"></i></button>
                <div id='signUpNav'>
                <p>Don't have an account?</p>
                <Link to='/register'><p>Sign up</p></Link>
                </div>
            </div>
        )
    }
}


export default connect(null, { updateUser })(Login)