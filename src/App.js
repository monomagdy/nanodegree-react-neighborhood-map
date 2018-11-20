import React, { Component } from "react";
//import logo from './logo.svg';
import "./App.css";
//import MapItem from './Component-Map';
import Menu from "./Component-SideMenu";

//Load the google maps async

function loadMapJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
}

class NeighborhoodApp extends Component {
  //Neighborhood Locations
  constructor(props) {
    super(props);
    this.state = {
      alllocations: [
        {
          name: "Villa 55",
          type: "Pup",
          latitude: 29.955152,
          longitude: 31.262367
        },
        {
          name: "McDonald's",
          type: "Restaurant",
          latitude: 29.954288,
          longitude: 31.263129
        },
        {
          name: "Caracas",
          type: "Restaurant",
          latitude: 29.956054,
          longitude: 31.261487
        },
        {
          name: "Costa",
          type: "Cafe",
          latitude: 29.956946,
          longitude: 31.260704
        },
        {
          name: "Mahraja",
          type: "Restaurant",
          latitude: 29.958815,
          longitude: 31.257485
        },
        {
          name: "Metro",
          type: "Market",
          latitude: 29.958964,
          longitude: 31.260082
        },
        {
          name: "Ralph's",
          type: "Bakery",
          latitude: 29.951918,
          longitude: 31.265478
        },
        {
          name: "Bell's",
          type: "Restaurant",
          latitude: 29.956649,
          longitude: 31.267645
        },
        {
          name: "Villa Belle",
          type: "Hotel",
          latitude: 29.959789,
          longitude:31.262930
        },
        {
          name: "Cuba Cabana",
          type: "Restaurant",
          latitude: 29.956314,
          longitude: 31.260221
        }
      ],
      map: "",
      infowindow: "",
      Prev: ""
    };

    this.DrawMap = this.DrawMap.bind(this);
    this.InfoWindowOpen = this.InfoWindowOpen.bind(this);
    this.InfoWindowClose = this.InfoWindowClose.bind(this);
  }

  componentDidMount() {
    // on intial page render draw map
    window.DrawMap = this.DrawMap;
    loadMapJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCU1RNFpYAbRetPqgZQIiz3lSkFJR2LOPU&libraries=places&callback=DrawMap"
    );
  }

  DrawMap() {
    var Current = this;
    var ViewMap = document.getElementById("map");
    ViewMap.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(ViewMap, {
      center: { lat: 29.955785, lng: 31.261637 },
      zoom: 16
    });

    var InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      Current.InfoWindowClose();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      Current.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      Current.InfoWindowClose();
    });

    var alllocations = [];
    this.state.alllocations.forEach(function(location) {
      var LocationName = location.name + " - " + location.type;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        map: map
      });

      marker.addListener("click", function() {
        Current.InfoWindowOpen(marker);
      });

      location.LocationName = LocationName;
      location.marker = marker;
      location.display = true;
      alllocations.push(location);
    });
    this.setState({
      alllocations: alllocations
    });
  }

  //Open the infowindow for marker
  InfoWindowOpen(marker) {
    this.InfoWindowClose();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      Prev: marker
    });
    this.state.infowindow.setContent("Loading..");
    this.GetLocationInfo(marker);
  }

  // Retrive the location data from foursquare
  GetLocationInfo(marker) {
    var Current = this;
    //clientid and clientSecret from Foursquare developers account
        var clientId = "1OTXEC4SBBNID0PCHWM1RXOSVXWKR00KHAN40TODF0ZT55VO";
        var clientSecret = "YAOBRQUYA1JQVETAZS53UQQQVSFG4WYJXPRI2GTIFHGOEBSL";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (!response.ok) {
                        Current.state.infowindow.setContent("failed to get locations data, please try again");
                        return;
                    }

                    // Custom InfoWindow
                    response.json().then(function (data) {
                        var LocationData = data.response.venues[0];
                        var Open = '<b>Open Now: </b>' + (LocationData.verified ? 'No' : 'Yes') + '<br>';
                        var Rating = '<b>Average Rating: </b>' + LocationData.stats.checkinsCount + '<br>';
                        var GoToFoursquare = '<a href="https://foursquare.com/v/'+ LocationData.id +'" target="_blank">Find on Foursquare</a>'
                        Current.state.infowindow.setContent(Rating +  Open + GoToFoursquare);
                    });
                }
            )
            .catch(function (err) {
                Current.state.infowindow.setContent("failed to get locations data, please try again");
            });
  }

  //close infowindow
  InfoWindowClose() {
    if (this.state.Prev) {
      this.state.Prev.setAnimation(null);
    }
    this.setState({
      Prev: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div className="container-div">
        <Menu
          key="100"
          alllocations={this.state.alllocations}
          InfoWindowOpen={this.InfoWindowOpen}
          InfoWindowClose={this.InfoWindowClose}
        />
        <div id="map" role="presentation" />
      </div>
    );
  }
}

export default NeighborhoodApp;
