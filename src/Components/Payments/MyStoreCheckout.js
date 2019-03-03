import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import Axios from 'axios';


class MyStoreCheckout extends Component {

  confirm = async () => {
    const { id, timeslot, item } = this.props
    const info = { id, timeslot, item }
    const res = await Axios.post(`/api/confirmAppointment`, info)
  }

  render() {
    const {confirm} = this
    return (
      <StripeProvider apiKey={process.env.REACT_APP_STRIPEKEY}>
        <div className="payments">
          <h1>Pay to place appointment</h1>
          <Elements>
            <CheckoutForm confirm={confirm}/>
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}

export default MyStoreCheckout;