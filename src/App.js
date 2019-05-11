import React, { Component } from 'react';
import './App.css';
import Cell from './Cell.js';
import Button from './Button.js';
import Search from './Search.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this);
    this.search = this.search.bind(this);
    this.searchFilter = this.searchFilter.bind(this);
    this.getFilms = this.getFilms.bind(this);
    this.state = {
      filter: "Old",
      list: [],
      filteredList: [],
      search: "",
			isLoaded: false,
    }
  }

  componentDidMount() {
    this.getFilms();
  }

  getFilms() {
		fetch('/api/films')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            list: result,
            filteredList: result
          });
        },
        (error) => {
          console.log(error);
        }
      )
  }

  onClick(e, sort) {
    e.preventDefault();

		let sortedList = [];

    if(sort === "Bad") {
			sortedList = this.state.list.sort((a,b) => {
				return a.rating - b.rating;
			})
    }

    if(sort === "Good") {
			sortedList = this.state.list.sort((a,b) => {
				return b.rating - a.rating;
			})
    }

    if(sort === "New") {
			sortedList = this.state.list.sort((a,b) => {
				return b.year - a.year;
			})
    }

    if(sort === "Old") {
			sortedList = this.state.list.sort((a,b) => {
				return a.year - b.year;
			})
    }

    if(sort === "Title") {
			sortedList = this.state.list.sort((a,b) => {
				const nameA = a.name.toUpperCase();
				const nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			})
    }

    if(sort === "Period") {
			sortedList = this.state.list.sort((a,b) => {
				const nameA = a.period.toUpperCase();
				const nameB = b.period.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			})
    }

    if(sort === "Director") {
			sortedList = this.state.list.sort((a,b) => {
				const nameA = a.director.toString().toUpperCase();
				const nameB = b.director.toString().toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			})
    }

		if(sort === "Must-Watch") {
			sortedList = this.state.list.filter(movie => movie.must === true);
		}

		if(sort === "Action") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Action"));
		}

		if(sort === "Comedy") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Comedy"));
		}

		if(sort === "Drama") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Drama"));
		}

		if(sort === "Kung Fu") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Kung Fu"));
		}

		if(sort === "Romance") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Romance"));
		}

		if(sort === "Random") {
      if(this.state.filter === "Search") {
        sortedList = [this.state.filteredList[this.getRandomInt(this.state.filteredList.length)]]
      } else {
        const newList = this.onClick(e, this.state.filter);
        sortedList = [newList[this.getRandomInt(newList.length)]];
      }
		}

    this.stateSetter(sort, sortedList);

		return sortedList;
  };

  up() {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  }

	stateSetter(filter, list) {
		if(filter !== "Random") {
			this.setState({filter: filter, filteredList: list});
		} else {
			this.setState({filteredList: list});
		};

	};

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	};

  search(search) {
    const reg = new RegExp(search, 'gi');
    this.setState({filteredList:
      this.state.list.filter(movie => {
        return (movie.name + movie.year + movie.period + movie.review + movie.synopsis + movie.director.toString() + movie.genre.toString()).match(reg) !== null
      })
    });
  };

  searchFilter() {
    this.setState({filter: "Search", filteredList: this.state.list});
  };

  render() {

    const listMovies = this.state.filteredList.map(film => <Cell key={film.name} movie={film} getFilms={this.getFilms}/>)

    return (
      <div className="App">
        <div className="heading">
          <img alt="duang" className="duang" src="./duang.svg" />
          <div className="hero-heading">DuangChan</div>
          <h3>The Ultimate Jackie Chan Movie Reference</h3>
        </div>

        <p className="intro">
          DuangChan is an exhaustive list of every movie starring Jackie Chan. These films are reviewed and rated from the perspective of a huge Jackie Chan fan. He's my favorite actor. The scores are not relative to cinema in general, but to Jackie Chan's body of work. They're also based on my subjective opinion, which can be colored by many factors outside my or Chan's control including print quality, translation errors, and voice acting. Films I consider "Must-Watch" are marked with the red "Duang" <img alt="smallduang" className="smallDuang" src="./duang-blue.svg"/> symbol behind the score. You can also filter for them, as well as for many other criteria below. If you have suggestions, questions, or just want to argue about my scores, please <a href="mailto:matthewsunderwood@gmail.com" className="email">email me.</a>
        </p>

        <Search filter={this.state.filter} searchFilter={this.searchFilter} handleClick={this.search}/>

        <div className="tools-container">
          <span className="tools">
            <Button tab="" filter={this.state.filter} click={this.onClick} position="left" title="Action"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="middle" title="Kung Fu"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="middle" title="Comedy"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="middle" title="Drama"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="right" title="Romance"/>
          </span>
          <span className="tools2">
            <Button tab="" filter={this.state.filter} click={this.onClick} position="" title="Director"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="" title="Period"/>
            <h1 onClick={(e) => this.onClick(e, "Must-Watch")} className={"must-watch" + (this.state.filter === "Must-Watch" ? " must-active" : "")}>
							<img alt="must" className='must' src='./duang-blue.svg' />
              <div className="pull-forward">
                Must Watch
              </div>
						</h1>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="" title="Title"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="" title="Random"/>
          </span>
          <span className="tools3">
            <Button tab="" filter={this.state.filter} click={this.onClick} position="left" title="Old"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="right" title="New"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="left" title="Good"/>
            <Button tab="" filter={this.state.filter} click={this.onClick} position="right" title="Bad"/>
          </span>
        </div>

        <div className="list">
          {listMovies}
        </div>

        <span className="up" onClick={this.up} role="img" aria-labelledby="totop">&#9757;</span>

      </div>
    );
  }
}

export default App;
