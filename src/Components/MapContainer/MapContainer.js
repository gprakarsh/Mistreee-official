import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import './MapContainer.scss'

const mapStyles = {
  width: '300px',
  height: '300px',
};

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
  };

  // componentDidUpdate(prevProps){
  //   const {lat,lng} = this.props
  //    if(prevProps !== this.props){
  //     this.setState({lat,lng})
  //   }
  // }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    const { lat, lng} = this.props
    
    return (
      <div className='MapContainer'>
        <Map
          google={this.props.google}
          containerProps={{style:{position:'static'}}}
          zoom={14}
          style={mapStyles}
          containerElement={{style:{width:'40vw',height:'40vh'}}}
          center={{
            lat: lat,
            lng: lng
          }}
        >
          <Marker
            onClick={this.onMarkerClick}
            name={'Selected Location'}
            position={{lat: lat, lng: lng}}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
            </div>
          </InfoWindow>
        </Map>
        </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEAPIKEY
})(MapContainer);