import React, { Component } from "react";
import Chart from "react-apexcharts";
import Axios from "axios";
import ReactLoading from 'react-loading'
import io from 'socket.io-client'
import './Line.scss'


class Line extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                }
            },
            series: [
                {
                    name: "series-1",
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
            ]
        };
    }

    componentDidMount = async () => {
        this.socket = io()
        this.getStats()
        this.joinSocket()
    }

    joinSocket = () => {
        this.socket.emit(`join room`, 'line')
        this.socket.on('someoneLoggedIn', data => {
            console.log('data received')
            this.setStats(data)
        })
    }

    getStats = async () => {
        const statsRes = await Axios.get(`/api/stats/line`)
        this.setStats(statsRes)
    }

    setStats = async (statsRes) => {
        let categories = []
        let data = []

        statsRes.data.map(stat => {
            categories.push(stat.date)
            data.push(stat.logins)
            return
        })

        this.setState({
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: categories,
                    labels: { show: false }
                }
            },
            series: [
                {
                    name: "Logins/day",
                    data: data
                }
            ],
            loading: false
        }, () => console.log(this.state))
    }

    render() {
        if (this.state.loading) {
            return (<ReactLoading type={'bars'} color={'black'} />)
        }
        return (
            <div className='lineCharts'>
                <div className='lineChart1'>
                    <div className="line">
                        <div className="row">
                            <div className="mixed-chart">
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="line"
                                    width="650"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='lineChart2'>
                    <div className="line">
                        <div className="row">
                            <div className="mixed-chart">
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="line"
                                    width="300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Line;