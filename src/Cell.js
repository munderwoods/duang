import React from 'react';
import './Cell.css';
import Tabs from './Tabs.js';
import UserRating from './UserRating.js';

class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.setTab = this.setTab.bind(this);
    this.loadScore = this.loadScore.bind(this);
    this.state = {
      tab: "Review",
      omdbScore: null
    }
  }

	componentDidMount() {
		this.refs.cell.style.opacity = 1;
	}

	componentWillUnmount() {
		this.refs.cell.style.opacity = 0;
	}

  setTab(tab) {
    this.setState({tab: tab});
  }

  loadScore(e) {
    e.preventDefault();
    fetch(
      'https://api.themoviedb.org/3/search/movie?api_key=c467817fe44cca04167fc35c676381e5&query=' + this.props.movie.name.replace(/ /gi,'+').replace(/'/gi,''))
      .then(response => response.json())
      .then(data => this.setState({omdbScore: data.results[0].vote_average}))
      .catch(err => console.log(err))
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

  tabContent() {
    if(this.state.tab ==="Review") {
      return <p className="synopsis">{this.props.movie.review}</p>;
    }
    if(this.state.tab ==="Synopsis") {
      return <p className="review">{this.props.movie.synopsis}</p>;
    }
    if(this.state.tab ==="Trailer") {
      return <iframe title={this.props.movie.trailer} width="420" height="315" src={'https://www.youtube.com/embed/' + this.props.movie.trailer} frameBorder="0" allowFullScreen/>
    }
    if(this.state.tab ==="User Reviews") {
      return <UserRating movie={this.props.movie} getFilms={this.props.getFilms}/>
    }
  }

  render() {
    return (
      <div className={"cell " + this.state.tab} ref="cell">
        <div className="top">
          <a id={this.props.movie.name} href={'#' + this.props.movie.name} className="title">{this.props.movie.name}</a>
          <img src={this.props.movie.image} alt={this.props.movie.name}/>
          <div className="details">
            <h4>Year: {this.props.movie.year}</h4>
            <h4>Genre: {this.props.movie.genre[0]}{this.props.movie.genre[1].length > 0 ? "/" + this.props.movie.genre[1] : ""}</h4>
            <h4>Period: {this.props.movie.period}</h4>
            <h4>Director: {this.props.movie.director[0]}{this.props.movie.director[1].length > 0 ? " & " + this.props.movie.director[1] : ""}</h4>
            <h4>User Score: {this.props.movie.userRating[0] ? this.makeUserScore() : 'N/A'}</h4>
            <div className="omdb">
              <a className="loadScore" onClick={e => this.loadScore(e)}>Show MDB Score: </a>
              <p>{this.state.omdbScore}</p>
            </div>
            <h1 className="score">
							{this.props.movie.must ? <img alt="duang" className='must' src='./duang-blue.svg' /> : ""}
              <div className="pull-forward">
                {this.props.movie.rating}
                <span className="ten">/10</span>
              </div>
						</h1>
          </div>
        </div>
        <Tabs setTab={this.setTab} tab={this.state.tab} movie={this.props.movie}/>
        <div className="tab-content">{this.tabContent()}</div>
      </div>
    );
  }
}


export default Cell;
