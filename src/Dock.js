import React from 'react';
import './Dock.css';
import Button from './Button.js';

class Tabs extends React.Component {
  constructor(props) {
    super(props)
    this.selectTab = this.selectTab.bind(this);
    this.state = {
      show: false
    }
  };

  selectTab(e, tab) {
    e.preventDefault();
    this.props.setTab(tab);
  }

  showDock(show) {
    console.log('T')
    this.setState({show: show});
  }

  stop() {
    this.setState({show: this.state.show});
  }

  render() {
    return (
      <div className="dock" onMouseEnter={() => this.showDock(true)} onMouseLeave={() => this.showDock(false)}>
        <div className={`dock-mask ${this.state.show ? '' : 'show'}`}>
          <strong className="dock-mask-inner">
            | | |
          </strong>
        </div>
        <span className={`dock-container ${this.state.show ? 'show' : ''}`}>
          {this.props.children}
          <div className="intro" onMouseEnter={() => this.stop()}>
            IDontWantTrouble is an exhaustive list of every movie starring Jackie Chan. These films are reviewed and rated from the perspective of a huge Jackie Chan fan. He's my favorite actor. The scores are not relative to cinema in general, but to Jackie Chan's body of work. They're also based on my subjective opinion, which can be colored by many factors outside my or Chan's control including print quality, translation errors, and voice acting. Films I consider "Must-Watch" are marked with the red "Duang" <img alt="smallduang" className="smallDuang" src="./duang-blue.svg"/> symbol behind the score. You can also filter for them, as well as for many other criteria below. If you have suggestions, questions, or just want to argue about my scores, please email me at matthewsunderwood@gmail.com.
          </div>
        </span>
      </div>
    );
  }
}


export default Tabs;
