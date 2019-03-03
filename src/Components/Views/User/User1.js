import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../../ducks/reducer'
import { Link } from 'react-router-dom'
import './User1.scss'
import ReactLoading from 'react-loading'


class User extends Component {
    constructor() {
        super()
        this.state = {
            items: [],
            timeslots: [],
            loading: true
        }
    }

    componentDidMount = async () => {
        const { name } = this.props
        if (!name) {
            try {
                const userRes = await axios.get(`/auth/user`)
                this.props.updateUser(userRes.data)
            }
            catch (err) {
                this.props.history.push('/')
            }
        }
        else {
            try {
                const itemsRes = await axios.get(`/api/items`)
                const timeslotsRes = await axios.get(`/api/timeslots/`)
                this.setState({
                    items: itemsRes.data,
                    timeslots: timeslotsRes.data,
                    loading:false
                })
            }
            catch (err) {
            }
        }
    }

    filter() {
        // Declare variables
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('myInput');
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName('button');
      
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
          a = li[i];
          txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
          } else {
            li[i].style.display = "none";
          }
        }
      }
    render() {
        const items = this.state.items.map((item, i) => <Link to={{
            pathname: '/user/2',
            state: {
                id: this.props.id,
                name: this.props.name,
                number: this.props.number,
                address: this.props.address,
                item: item.item,
                timeslots: this.state.timeslots
            }
        }} key={i}><button >{item.item}</button></Link>)

        if (this.state.loading) {
            return (<div className='loading'><ReactLoading type={'bars'} color={'black'} /></div>)
        }
        
        return (
            <div>
                {
                    this.state.items.length === 0
                        ? <div>The site is under maintainance. Your patience is appreciated</div>
                        : <div className='user1'>
                        <input type="text" id="myInput" onKeyUp={this.filter} placeholder="Search for items..."></input>
                            <p>Choose an item</p>
                            <ul id='myUL'>{items}</ul>
                        </div>
                }
            </div>
        )
    }
}

const m2p = (state) => {
    return {
        id: state.id,
        name: state.name,
        number: state.number,
        address: state.address
    }
}

export default connect(m2p, { updateUser })(User)
