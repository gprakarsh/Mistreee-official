import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from './../../../ducks/reducer'
import './Admin.scss'
import greeting from 'greeting'
import Donut from './Charts/Donut';
import Line from './Charts/Line';
import ReactLoading from 'react-loading'

class Admin extends Component {
  componentDidMount = async () => {
    const { name } = this.props
    if (!name) {
      try {
        const userRes = await axios.get(`/auth/user`)
        let noData = await this.props.updateUser(userRes.data)
      }
      catch (err) {
        console.log(err)
        this.props.history.push('/')
      }
    }
  }

  render() {
      return (
        <div className='adminDash'>
          <h1>{greeting.random()} {this.props.name}!</h1>
          <p id='message'>Welcome to your dashboard. Your one stop website manager.</p>
          <div className='charts'>
            <div id='donut'>
              <Donut />
            </div>
            <div id='line'>
              <Line />
            </div>
          </div>
        </div>
      )
    }
  }

const m2p = (state) => {
  return {
    name: state.name
  }
}

export default connect(m2p, { updateUser })(Admin);