import React from "react";

class MapItem extends React.Component {
  render() {
    return (
      <li
        role="button"
        className="neighborhood-item"
        tabIndex="0"
        onKeyPress={this.props.InfoWindowOpen.bind(
          this,
          this.props.data.marker
        )}
        onClick={this.props.InfoWindowOpen.bind(this, this.props.data.marker)}
      >
        {this.props.data.LocationName}
      </li>
    );
  }
}

export default MapItem;
