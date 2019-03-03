import React, { useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import './User2.scss'

function User2(props) {

    let timeslotsMapper = []

    useEffect(() => {
        if (!props.location.state) {
            props.history.push('/')
        }
    })

    try {
        const { item, timeslots,name,number,address,id } = props.location.state
        timeslotsMapper = timeslots.map(timeslot => {
            return (<Link to={{
                pathname: '/user/3',
                state: {
                    id:id,
                    name: name,
                    number:number,
                    address:address,
                    item: item,
                    timeslot: timeslot.time
                }
            }}><button>{timeslot.time}</button></Link>)
        })
    }
    catch{ }

    return (
        <div className='user2'>
            <h1>Pick a timeslot</h1>
                <p>Note: All available timeslots are for tomorrow as we like to give our mechanics enough time to prepare for your specific needs</p>
            <div id='timeslots'>{timeslotsMapper}</div>
        </div>
    )
}



export default User2