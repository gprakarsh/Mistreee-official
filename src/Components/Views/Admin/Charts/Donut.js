import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import Axios from 'axios';
import ReactLoading from 'react-loading'
import io from 'socket.io-client'
import './Donut.scss'


class Donut extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      options: {
        plotOptions: {
          pie: {
            expandOnClick: false
          }
        },
        colors: ['#276EF1', '#000000'],
        fill: {
          colors: ['#276EF1', '#000000']
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          colors: ['#276EF1', '#000000']
        },
        labels: ['Users', 'Mechanics'],
        legend: { show: false }
      },
      series: [20, 80],

    }
  }

  componentDidMount = async () => {
    this.socket = io()
    this.getStats()
    this.joinSocket()
  }

  joinSocket = () => {
    this.socket.emit(`join room`, 'donut')
    this.socket.on('someoneLoggedIn', data => {

      this.setStats(data)
    })
  }

  getStats = async () => {
    console.log('getStats')
    const res = await Axios.get(`/api/stats/donut`)
    console.log('initial donut', res)
    this.setStats(res)
  }

  setStats = (res) => {
    console.log('setStats')
    this.setState({
      series: [res.data.userPercentage, res.data.mechPercentage],
      loading: false
    })
  }

  render() {
    if (this.state.loading) {
      return (<ReactLoading type={'bars'} color={'black'} />)
    }
    return (
      <div className='donuts'>
        <div id="donut1">
          {console.log(this.state.loading)}
          <Chart options={this.state.options} series={this.state.series} type="donut" width='600' height='400' />
        </div>
        <div id='donut2'>
          <Chart options={this.state.options} series={this.state.series} type="donut" width='200' height='200' />          
        </div>
      </div>
    );
  }
}

export default Donut;