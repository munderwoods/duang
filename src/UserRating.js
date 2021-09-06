import React from 'react';
import './UserRating.css';
import Button from './Button.js';

class UserRating extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      score: null,
      review: null,
      error: ''
    }
  };

  makeUserReviews() {
    let i = 0;
    return this.props.movie.userRating.map(rat => {
      if(rat.review) {
        i++;
        return <p key={i} className="user-reviews"><div className="user-reviews-score">{rat.rating}</div>{' - ' + rat.review}</p>
      } else {
        return null
      }
    });
  }

  showInput() {
    if(!localStorage.getItem(this.props.movie._id) && localStorage.getItem(this.props.movie._id) !== '') {
      return <div className="input-container">
          <textarea
            className="rating-input"
            placeholder="Write your review here"
            onChange={e => this.setState({review: e.target.value})}
          />
          <div className="rating-controls">
            <select onChange={e => this.setState({score: e.target.value})} className={this.state.error}>
              <option disabled selected={true}>Select Score</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <Button click={e => this.setUserRating(e)} title="Submit" size="small" className="rating"/>
          </div>
        </div>
    }
  }

  setUserRating(e) {
    e.preventDefault();
    if(this.state.score) {
      fetch('/api/user-rating', {
        method: 'post',
        body: JSON.stringify({
          id: this.props.movie._id,
          userRating: this.state.score,
          userReview: this.state.review
        }),
      })
      .then(res => {
        this.props.getFilms()
        localStorage.setItem(this.props.movie._id, true);
      })
      .catch(err => console.log(err))
    } else {
      this.setState({error: 'error'});
    }
  }

  render() {
    return (
      <div className="user-rating">
        <h2>User Ratings</h2>
        {this.showInput()}
        {this.makeUserReviews()}
      </div>
    );
  }
}


export default UserRating;
