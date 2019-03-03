import React, { Component } from 'react';
import './reset.css';
import './App.scss';
import NavBar from './Components/NavBar/NavBar'
import routes from './routes'
import Chat from './Components/Chat/Chat'


class App extends Component {
  constructor() {
    super();
    this.state = {
      imgSrc: '',
    }
  }

  

   render() {
    return (
        <div className="App">
          <NavBar />
          {routes}
          <div className='chat'><Chat /></div>
        </div>
      )
    
  }
}


export default App;

