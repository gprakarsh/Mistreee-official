import React from 'react'
import { Link } from 'react-router-dom'
import './Register.scss'

function Register() {
    return (
        <div className='RegisterBox'>
            <Link to='/'><i class="fas fa-times" id='cross'></i></Link>
            <div className='Register'>
                <div id='repair'>
                    <i class="fas fa-wrench"></i>
                    <Link to='/register/mechanic'><button >Sign up to repair <i class="fas fa-arrow-right"></i></button></Link>
                </div>
                <div id='service'>
                    <i class="fas fa-user" id='mechanic' ></i>
                    <Link to='/register/user' ><button >Sign up for service <i class="fas fa-arrow-right"></i></button> </Link>
                </div>
            </div>
        </div>
    )
}

export default Register