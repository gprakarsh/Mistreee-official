import React from 'react'
import {Link} from 'react-router-dom'
import './MechNav.scss'

function MechNav () {
    return(
        <div className='MechNav'>
            <ul>
                <Link to='/mechanic'><li>Dashboard</li></Link>
                <Link to='/mechanic/req'><li>Requests</li></Link>
                <Link to='/mechanic/appointments'><li>Appointments</li></Link>
                <Link to='/stats'><li>Statistics</li></Link>
            </ul>
        </div>
    )
}

export default MechNav

