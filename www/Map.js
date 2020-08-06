import React from 'react';
import ReactDOM from 'react-dom';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    margin:'1pt'
  },
  diff:{
    position: 'absolute',
    width:'100%',
    height:'50%'
  }
};

export class CurrentLocation extends React.Component {
    constructor(props) {
      super(props);
  
      const { lat, lng } = this.props.initialCenter;
      this.state = {
        currentLocation: {
          lat: lat,
          lng: lng
        }
      };
    }
  
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
          this.recenterMap();
        }
      }

      recenterMap() {
        const map = this.map;
        const current = this.state.currentLocation;
    
        const google = this.props.google;
        const maps = google.maps;
    
        if (map) {
          let center = new maps.LatLng(current.lat, current.lng);
          map.panTo(center);
        }
      }


      componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
          if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
              this.setState({
                currentLocation: {
                  lat: coords.latitude,
                  lng: coords.longitude
                }
              });
            });
          }
        }
        this.loadMap();
      }

    
loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef);

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );

      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig);
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    });
  }


  render() {
    const style = Object.assign({}, mapStyles);
   return (
     <div>
       <div style={style.map} ref="map">
         Loading map...
       </div>
       {this.renderChildren()}
       <h1 style={style.diff} ref="diff">Hii</h1>
     </div>
   );
 }
  
  }
export default CurrentLocation;

CurrentLocation.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: -1.2884,
    lng: 36.8233
  },
  centerAroundCurrentLocation: false,
  visible: true
};
















































// class Map extends Component {

//     // For conciseness simply included all parameters in the querystring directly
  
//     constructor(props) {
//       super(props);
//       this.state = {
//         url: 'https://image.maps.api.here.com/mia/1.6/mapview?w=600&h=300&z=10&t=5&poitxs=16&poitxc=black&poifc=yellow',
//         points: [],
//       }
//     }
  
//     // Helper function to format list of points
  
//     getPOIList() {
//       if (this.state.points.length > 0) {
//         let param = '&poi=';
//         for (var poi in this.state.points) {
//           param += poi.latitude + ',' + poi.longitude;
//         }
//         return param;
//       }
  
//       return '';
//     }
  
//     // Render method builds the URL dynamically to fetch the image from the
//     // HERE Map Image API
  
//     render() {
//       return (
//         <img
//           src={ this.state.url
//             + '&app_id=' + this.props.app_id
//             + '&app_code=' + this.props.app_code
//             + this.getPOIList()
//             }
//           alt="Todo Map"/>
//       );
//     }
//   }

