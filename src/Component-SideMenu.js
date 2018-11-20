import React, { Component } from "react";
import MapItem from "./Component-Map";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: "",
      query: "",
      suggestions: true
    };

    this.FilterNearby = this.FilterNearby.bind(this);
    this.toggleList = this.toggleList.bind(this);
  }

  //filter nearby locations
  FilterNearby(event) {
    this.props.InfoWindowClose();
    const { value } = event.target;
    var locations = [];
    this.props.alllocations.forEach(function(location) {
      if (
        location.LocationName.toLowerCase().indexOf(value.toLowerCase()) >= 0
      ) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      locations: locations,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      locations: this.props.alllocations
    });
  }

  // toggle nearby locations list
  toggleList() {
    this.setState({
      suggestions: !this.state.suggestions
    });
  }

  render() {
    var Menu = this.state.locations.map(function(item, index) {
      return (
        <MapItem
          key={index}
          InfoWindowOpen={this.props.InfoWindowOpen.bind(this)}
          data={item}
        />
      );
    }, this);

    return (
      <div className="Search-div">
        <input
          role="search"
          aria-label="Search Neighborhood"
          id="search-input"
          className="search-input"
          type="text"
          placeholder="Search Neighborhood"
          value={this.state.query}
          onChange={this.FilterNearby}
        />
        <ul className="nearby-locations">{this.state.suggestions && Menu}</ul>
        <button className="main-btn" onClick={this.toggleList}>
          Toggle List
        </button>
      </div>
    );
  }
}

export default Menu;
