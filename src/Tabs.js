import React from 'react';
import './Tabs.css';
import Button from './Button.js';

class Tabs extends React.Component {
  constructor(props) {
    super(props)
    this.selectTab = this.selectTab.bind(this);
    this.state = {
      active: false
    }
  };

  selectTab(e, tab) {
    e.preventDefault();
    this.props.setTab(tab);
  }

  render() {

    return (
      <div className="tabs">
        <span className="tab-selector">
          <Button tab="tab" filter={this.props.tab} click={this.selectTab} title="Review"/>
          <Button tab="tab" filter={this.props.tab} click={this.selectTab} title="Synopsis"/>
          <Button tab="tab" filter={this.props.tab} click={this.selectTab} title="Trailer"/>
          <Button tab="tab" filter={this.props.tab} click={this.selectTab} title="User Reviews"/>
        </span>
      </div>
    );
  }
}


export default Tabs;
