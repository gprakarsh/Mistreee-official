import React from 'react'
import {Link} from 'react-router-dom'
import './AdminNav.scss'

function AdminNav() {
    return (
        <div className='AdminNav'>
            <ul>
                <Link to='/admin'><li>Dashboard</li></Link>
                <Link to='/admin/apps'><li>Applications</li></Link>
                <Link to='/admin/chat'><li>Complaints</li></Link>
            </ul>
        </div>
    )
}

export default AdminNav
