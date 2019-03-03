import React from 'react'
import './Reason.scss'
import {Link} from 'react-router-dom'

export default function Reason(props){
    const {reason,id} = props.location.state
    const {approve,disapprove} = props.location.functions
    return(
        <div className='reason'>
            <h1>Tell us why you want to be a mechanic for Mistreee?</h1>
            <p>{reason}</p>
            <Link to='/admin/apps'><button id='back'>Go back</button></Link>
            <Link to='/admin/apps'><button onClick={()=>approve(id)}>Approve</button></Link>
            <Link to='/admin/apps'><button onClick={()=>disapprove(id)}>Disapprove</button></Link>
        </div>
    )
}