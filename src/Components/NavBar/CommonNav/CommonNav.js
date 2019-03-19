import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './../TopNav.scss'

function CommonNav(props) {
    const { logo } = props
    return (
        <div className='TopNav' style={{boxSizing:'border-box'}}>
            <Link to='/'><p id='logo'>मिस्त्री</p></Link>
            <ul>
                <NavLink to='/login' activeStyle={{borderBottom:'solid 6px #276EF1'}}><li>Log in</li></NavLink>
                <NavLink to='/register' activeStyle={{borderBottom:'solid 6px #276EF1'}}><li>Sign up</li></NavLink>
            </ul>
        </div>
    )
}

export default CommonNav