import React from 'react';
import './Button.css';

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  };

  componentWillMount() {
    if (this.props.filter === this.props.title) {
      this.setState({active: true});
    }
  };

 active() {
   if(this.props.filter === this.props.title) {
     return "active";
   } else {
     return "";
   }
 }

  render() {

    return (
      <a href="button" className={"button " + this.props.tab + " " + this.active() + " " + this.props.position} onClick={(e) => this.props.click(e, this.props.title)}>
        {this.props.title}
      </a>
    );
  }
}


export default Button;
