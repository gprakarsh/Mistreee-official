import React from 'react'
import { Link } from 'react-router-dom'
import '../TopNav.scss'

function LoggedInNav(props) {
    const { username, logout, logo } = props
    return (
        <div className='TopNav'>
            <Link to='/'><p id='logo'>मिस्त्री</p></Link>
            <i class="fas fa-bars"></i>
            <ul>
                <li id='username'>{username}</li>
                <Link to='/'><li onClick={logout}>Log out</li></Link>
            </ul>
        </div>
    )
}

export default LoggedInNav