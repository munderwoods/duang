import React from 'react';
import './Cell.css';
import UserRating from './UserRating.js';
import Button from './Button.js';

class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trailerId: '',
    }
  }

	componentDidMount() {
		this.refs.cell.style.opacity = 1;
	}

	componentWillUnmount() {
		this.refs.cell.style.opacity = 0;
	}

  makeUserScore() {
    let reviews = 0;
    let total = this.props.movie.userRating.reduce((acc, rat) => {
      if(rat) {
        reviews++;
        acc += +rat.rating;
        return acc;
      }
    }, 0);

    return (total / reviews).toFixed(1);
  }

  getTrailer(e, movie) {
    e.preventDefault();
    fetch(`/api/trailer?name=${movie.name}`, {
      method: 'get',
    })
    .then(res => {
      res.json()
        .then(json => {
          console.log(json);
          this.setState({trailerId: json.trailerId});
        });
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="cell" style={{backgroundImage: `url('${this.props.movie.backdrop}')`}} ref="cell">
        <div className={"cell-inner"} >
          <div className={"cell-innerer"} >
            <a id={this.props.movie.name} href={'#' + this.props.movie.name} className="title">{this.props.movie.name}</a>
            <div className="cell-top">
              <div className="cell-left">
                <img src={this.props.movie.image} alt={this.props.movie.name}/>
                <div className="details">
                  <h4>Year: {this.props.movie.year}</h4>
                  <h4>Genre: {this.props.movie.genre[0]}{this.props.movie.genre[1].length > 0 ? "/" + this.props.movie.genre[1] : ""}</h4>
                  <h4>Period: {this.props.movie.period}</h4>
                  <h4>Director: {this.props.movie.director[0]}{this.props.movie.director[1].length > 0 ? " & " + this.props.movie.director[1] : ""}</h4>
                  <h4>User Score: {this.props.movie.userRating[0] ? this.makeUserScore() : 'N/A'}</h4>
                  <h4>Movie DB Score: {this.props.movie.movieDbScore}</h4>
                </div>
              </div>
              <div className="cell-middle">
                <h1 className="score">
                  {this.props.movie.must ? <img alt="duang" className='must' src='./duang-blue.svg' /> : ""}
                  <div className="pull-forward">
                    {this.props.movie.rating}
                    <span className="ten">/10</span>
                  </div>
                </h1>
              </div>
              <div className="cell-right">
                <UserRating movie={this.props.movie} getFilms={this.props.getFilms}/>
                <div className="trailer">
                  {this.state.trailerId
                    ? <iframe title={this.state.trailerId} width="420" height="315" src={'https://www.youtube.com/embed/' + this.state.trailerId} frameBorder="0" allowFullScreen/>
                    : <Button tab="" click={(e) => this.getTrailer(e, this.props.movie)}title="Get Trailer"/>
                  }
                </div>
              </div>
            </div>
            <div className="cell-bottom">
              <h2>Synopsis</h2>
              <p className="review">{this.props.movie.synopsis}</p>
              <h2>Review</h2>
              <p className="synopsis">{this.props.movie.review}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cell;
