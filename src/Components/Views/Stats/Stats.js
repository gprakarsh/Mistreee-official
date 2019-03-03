import React from 'react'
import Donut from '../Admin/Charts/Donut';
import Line from '../Admin/Charts/Line';
import './Stats.scss'

function Stats() {
    return (
        <div className='stats'>
            <h1>Statistics</h1>
            <p id='message'>Real-time statistics for Mistreee</p>
            <div className='charts'>
            <div id='donut'><Donut /></div>
            <div id='line'><Line /></div>
            </div>
        </div>
    )
}

export default Stats;