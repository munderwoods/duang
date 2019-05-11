import React from 'react';
import './Search.css';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  };

  searchActive() {
    if(this.props.filter === "Search") {
      return " active";
    } else {
      return "";
    }
  };

  render() {
    return (
      <div className="container">
        <div className="search-box">
          <input className={this.searchActive()} type="text" placeholder="Search" onChange={(e) => this.props.handleClick(e.target.value)} onFocus={this.props.searchFilter}/>
        </div>
      </div>
    );
  }
}


export default Search;
