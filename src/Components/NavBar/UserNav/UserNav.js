import React from 'react'
import {Link} from 'react-router-dom'
import './UserNav.scss'

function UserNav(props) {
    return (
        <div className='UserNav'>
            <ul>
                <Link to='/user/dashboard'><li>Dashboard</li></Link>
                <Link to='/user'><li>New</li></Link>
                <Link to='/user/pending'><li>Pending</li></Link>
                <Link to='/user/confirmed'><li>Confirmed</li></Link>
                <Link to='/stats'><li>Statistics</li></Link>
            </ul>
        </div>
    )
}

export default UserNav
