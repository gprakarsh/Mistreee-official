import React from 'react'
import { Link } from 'react-router-dom'
import './../TopNav.scss'

function CommonNav(props) {
    const { logo } = props
    return (
        <div className='TopNav'>
            <Link to='/'><p id='logo'>मिस्त्री</p></Link>
            <ul>
                <Link to='/login'><li>Log in</li></Link>
                <Link to='/register'><li>Sign up</li></Link>
            </ul>
        </div>
    )
}

export default CommonNav